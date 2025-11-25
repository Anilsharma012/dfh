import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Mycourse.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "../../utils/axiosConfig";
import CoursePreviewModal from "../CoursePreviewModal/CoursePreviewModal";
import Staticourse from "../../components/StaticCourse/Staticourse"

const Mycourse = () => {
  const [courses, setCourses] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewCourse, setPreviewCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('🔍 Fetching published courses...');
        const response = await axios.get("/api/courses/student/published-courses");
        console.log('✅ Courses response:', response.data);

        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          console.error('❌ Failed response:', response.data);
          setError("Failed to load courses");
        }
      } catch (err) {
        console.error("❌ Failed to load courses:", err);
        if (err.response?.status === 403) {
          setError("Access denied - please check your authentication");
        } else {
          setError("");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await axios.get('/api/user/student/my-courses');
        if (res.data.success) {
          setEnrolledCourses(res.data.courses.map(c => c.courseId?._id).filter(Boolean));
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      }
    };

    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const isEnrolled = (courseId) => enrolledCourses.includes(courseId);

  const visibleCourses = showAll ? courses : courses.slice(0, 2);

  return (
    <section className="tsp-programs-section">
      <div className="tsp-programs-header">
        <div className='tsp-llf'>
          <h5>Our Courses</h5>
          <h2>Tailored for Your Success</h2>
        </div>
        <div className='tsp-llr'>
          <p>
            At Tathagat, we offer comprehensive and specialized programs designed to help students excel
            in CAT, XAT, SNAP, GMAT, and other management entrance exams. Whether you're a beginner or
            looking for advanced training, we have the perfect program for you!
          </p>
        </div>
      </div>

      {/* ✅ Added navigate on these buttons */}
      <div className="tsp-programs-actions">
        <button onClick={() => navigate("/mock-test")}><i className="fa fa-filter"></i> CAT & OMET</button>
        <button onClick={() => navigate("/Testimonial")}><i className="fa fa-filter"></i> Year</button>
        <button onClick={() => navigate("/ourBlog")}><i className="fa fa-filter"></i> Online/Offline</button>
        <button onClick={() => navigate("/compare")}><i className="fa fa-balance-scale"></i> Course Comparison</button>
      </div>
 <Staticourse/>
      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="tsp-programs-grid">
          {visibleCourses.map((item) => (
            <div className="tsp-program-card" key={item._id}>
              <div className="tsp-program-image">
                <LazyLoadImage
                  effect="blur"
                  src={`/uploads/${item.thumbnail}`}
                  alt={item.name}
                />
                <div className="tsp-badge">{item.name}</div>
              </div>

              <div className="tsp-program-content">
                <h3>{item.name}</h3>
                <ul className="desc-list">
                  {item.description
                    ?.replace(/<[^>]+>/g, '')
                    .split('\n')
                    .filter(line => line.trim() !== "")
                    .map((feat, idx) => (
                      <li key={idx}>✔ {feat}</li>
                    ))}
                </ul>

                <div className="tsp-program-price-row">
                  <div>
                    <h4>₹{item.price}</h4>
                    {item.oldPrice && <del>₹{item.oldPrice}</del>}
                  </div>
                  <div className="tsp-program-buttons">
                    <button onClick={() => setPreviewCourse(item)} className="preview-btn">
                      👁️ Preview
                    </button>
                    <button onClick={() => navigate("/course-purchase", { state: item })}>Enroll Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showAll && courses.length > 2 && (
        <div className="tsp-show-all-button">
          <button onClick={() => setShowAll(true)}>Show All</button>
        </div>
      )}

      {previewCourse && (
        <CoursePreviewModal
          course={previewCourse}
          onClose={() => setPreviewCourse(null)}
          isEnrolled={isEnrolled(previewCourse._id)}
        />
      )}
    </section>
  );
};

export default Mycourse;
