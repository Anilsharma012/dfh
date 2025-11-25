import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./CourseOverview.css";

const parseList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return value.split(/\r?\n+/).map((v) => v.trim()).filter(Boolean);
  return [];
};

const useQuery = () => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

const OverviewSection = ({ title, children, icon }) => (
  <motion.div
    className="co-card"
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.25 }}
  >
    <div className="co-card-header">
      <span className="co-card-icon" aria-hidden>{icon}</span>
      <h3 className="co-card-title">{title}</h3>
    </div>
    <div className="co-card-body">{children}</div>
  </motion.div>
);

const CourseOverview = () => {
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [course, setCourse] = useState(null);

  const courseId = query.get("id");
  const slug = query.get("slug");

  const builderPublicKey = (typeof window !== 'undefined' && window.__BUILDER_PUBLIC_API_KEY__) || process.env.REACT_APP_BUILDER_PUBLIC_API_KEY || '';
  const builderModel = (typeof window !== 'undefined' && window.__BUILDER_MODEL__) || process.env.REACT_APP_BUILDER_MODEL || 'courses';

  async function fetchFromBuilder() {
    if (!builderPublicKey) return null;
    const queryObj = slug ? { 'data.slug': slug } : (courseId ? { 'data.courseId': String(courseId) } : {});
    const qs = new URLSearchParams({ apiKey: builderPublicKey, limit: '1', query: JSON.stringify(queryObj) }).toString();
    const url = `https://cdn.builder.io/api/v3/content/${encodeURIComponent(builderModel)}?${qs}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    const item = data?.results?.[0];
    if (!item) return null;
    const d = item.data || {};
    const overview = d.overview || {};
    // normalize to match backend course shape for UI reuse
    return {
      _id: d.courseId || item.id,
      name: d.name,
      price: d.price,
      thumbnail: d.thumbnail,
      overview: {
        description: overview.description || '',
        materialIncludes: Array.isArray(overview.materialIncludes) ? overview.materialIncludes : [],
        requirements: Array.isArray(overview.requirements) ? overview.requirements : [],
      },
    };
  }

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        let fromBuilder = null;
        try {
          fromBuilder = await fetchFromBuilder();
        } catch {}
        if (!cancelled && fromBuilder) {
          setCourse(fromBuilder);
          return;
        }
        if (courseId) {
          const { data } = await axios.get(`/api/courses/student/published-courses/${courseId}`);
          if (!cancelled) setCourse(data.course || null);
        } else {
          const { data } = await axios.get("/api/courses/student/published-courses");
          const list = Array.isArray(data.courses) ? data.courses : [];
          if (!cancelled) setCourse(list[0] || null);
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || e.message || "Failed to load course overview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [courseId, slug, builderPublicKey, builderModel]);

  const overview = useMemo(() => course?.overview || {}, [course]);
  const materials = useMemo(() => parseList(overview?.materialIncludes), [overview]);
  const requirements = useMemo(() => parseList(overview?.requirements), [overview]);

  if (loading) {
    return (
      <div className="co-container" aria-busy="true" aria-live="polite">
        <div className="co-skel-row" />
        <div className="co-skel-row" />
        <div className="co-skel-row" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="co-container">
        <div className="co-empty">
          <p>{error || "No course available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="co-container" data-course-id={course._id}>
      <AnimatePresence>
        {(overview?.description || materials.length || requirements.length) ? (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="co-heading">Course Overview</h2>
            <div className="co-grid">
              <OverviewSection title="Description" icon="📝">
                {overview?.description ? (
                  <p className="co-text" data-builder-field="overview.description">{overview.description}</p>
                ) : (
                  <p className="co-muted">No description added yet.</p>
                )}
              </OverviewSection>

              <OverviewSection title="Material Includes" icon="📦">
                {materials.length ? (
                  <ul className="co-list" data-builder-field="overview.materialIncludes">
                    {materials.map((item, idx) => (
                      <li key={idx} className="co-list-item">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="co-muted">No materials listed.</p>
                )}
              </OverviewSection>

              <OverviewSection title="Requirements" icon="✅">
                {requirements.length ? (
                  <ul className="co-list" data-builder-field="overview.requirements">
                    {requirements.map((item, idx) => (
                      <li key={idx} className="co-list-item">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="co-muted">No requirements specified.</p>
                )}
              </OverviewSection>
            </div>
          </motion.div>
        ) : (
          <div className="co-empty"><p>Overview will appear here once added by admin.</p></div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseOverview;
