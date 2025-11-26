import React, { useEffect, useState } from 'react';
import './MyCourses.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchMyCourses } from '../../utils/api';

const MyCourses = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        // Use the centralized API helper which includes better error handling and retries
        const data = await fetchMyCourses();
        console.log('my-courses:', data);

        // Normalize response from various possible shapes
        const raw = data?.enrolledCourses || data?.unlockedCourses || data?.courses || data?.data || data || [];
        const normalized = (Array.isArray(raw) ? raw : []).map(x => (x && x.courseId) ? x : ({ courseId: x, status: x?.status || 'unlocked' }));

        // Only unlocked
        let unlocked = normalized.filter(i => !i.status || i.status === 'unlocked');

        // If justPurchasedCourseId present, move to top and mark highlight
        try {
          const justId = localStorage.getItem('justPurchasedCourseId');
          if (justId) {
            const idx = unlocked.findIndex(it => {
              const cid = it.courseId && it.courseId._id ? it.courseId._id.toString() : (it.courseId && it.courseId.toString ? it.courseId.toString() : null);
              return cid === justId.toString();
            });
            if (idx > -1) {
              const [found] = unlocked.splice(idx, 1);
              found._justPurchased = true;
              unlocked.unshift(found);
            }
            localStorage.removeItem('justPurchasedCourseId');
          }
        } catch (e) {
          // ignore localStorage errors
        }

        setItems(unlocked);
      } catch (e) {
        console.error('my-courses fetch error', e);
        const msg = e.message && e.message.includes('Network') ? 'Network error' : 'Failed to load';
        setError(msg);
        try { if (msg === 'Network error') toast('Network error'); } catch (e2) {}
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className="mc-wrapper"><p>Loading...</p></div>;
  if (error) return (
    <div className="mc-wrapper">
      <p className="mc-error">{error}</p>
      <button className="mc-browse" onClick={() => navigate('/')}>Browse Courses</button>
    </div>
  );

  if (!items.length) return (
    <div className="mc-wrapper">
      <h3>No courses yet</h3>
      <button className="mc-browse" onClick={() => navigate('/')}>Browse Courses</button>
    </div>
  );

  return (
    <div className="mc-grid">
      {items.map((c) => {
        const course = c.courseId || c; // populated or id
        const id = course?._id || (course && course.toString && course.toString()) || c._id;
        const title = (course && (course.name || course.title || course.courseTitle)) || c.title || 'Course';
        const thumb = (course && (course.thumbnail || course.thumb || course.image)) || '';
        const highlight = !!c._justPurchased;
        return (
          <div className={`mc-card ${highlight ? 'mc-highlight' : ''}`} key={c._id || id}>
            <div className="mc-thumb" style={{ backgroundImage: thumb ? `url(${thumb})` : undefined }} />
            <div className="mc-title">{title}</div>
            <div className="mc-status">unlocked</div>
          <button
  className="mc-start"
  onClick={() => navigate(`/student/course-content/${id}`)}
>
  Start Learning
</button>
          </div>
        );
      })}
    </div>
  );
};

export default MyCourses;
