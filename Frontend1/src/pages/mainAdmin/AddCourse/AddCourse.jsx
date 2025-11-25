// File: AddCourse.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import CourseForm from "./CourseForm/CourseForm";
import VideoManagement from "./VideoManagement/VideoManagement";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaFileAlt, FaVideo } from "react-icons/fa";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import "./AddCourse.css";

const AddCourse = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourseType, setSelectedCourseType] = useState('full_course');
  const [overviewCourse, setOverviewCourse] = useState(null);
  const [videoManagementCourse, setVideoManagementCourse] = useState(null);
  const [overviewForm, setOverviewForm] = useState({
    description: "",
    about: "",
    materialIncludes: "",
    requirements: "",
    videoUrl: "",
  });
  const [savingOverview, setSavingOverview] = useState(false);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      console.error("❌ Failed to load courses", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setEditCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Course deleted!");
      fetchCourses();
    } catch (err) {
      console.error("�� Delete failed", err);
      alert("Something went wrong!");
    }
  };

  const handlePublish = async (courseId, currentStatus) => {
    const confirm = window.confirm(
      currentStatus
        ? "Unpublish this course from frontend?"
        : "Are you sure you want to publish this course?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(
        `/api/courses/toggle-publish/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
      fetchCourses();
    } catch (err) {
      alert("❌ Failed to update publish status");
    }
  };

  const openOverviewModal = (course) => {
    setOverviewCourse(course);
    setOverviewForm({
      description: course?.overview?.description || "",
      about: course?.overview?.about || "",
      materialIncludes: (course?.overview?.materialIncludes || []).join("\n"),
      requirements: (course?.overview?.requirements || []).join("\n"),
      videoUrl: course?.overview?.videoUrl || "",
    });
  };

  const closeOverviewModal = () => {
    setOverviewCourse(null);
    setOverviewForm({
      description: "",
      about: "",
      materialIncludes: "",
      requirements: "",
      videoUrl: "",
    });
    setSavingOverview(false);
  };

  const handleOverviewChange = (field, value) => {
    setOverviewForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOverviewSubmit = async (event) => {
    event.preventDefault();
    if (!overviewCourse) return;

    try {
      setSavingOverview(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(
        `/api/courses/${overviewCourse._id}/overview`,
        overviewForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success && res.data?.course) {
        const updatedCourse = res.data.course;
        setCourses((prev) =>
          prev.map((item) => (item._id === updatedCourse._id ? updatedCourse : item))
        );
        alert("✅ Course overview saved successfully");
        closeOverviewModal();
      } else {
        throw new Error(res.data?.message || "Failed to save overview");
      }
    } catch (error) {
      console.error("❌ Failed to save overview", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save course overview. Please try again."
      );
    } finally {
      setSavingOverview(false);
    }
  };

  const handleCourseTypeSelect = (type) => {
    setSelectedCourseType(type);
    setShowForm(true);
    setShowDropdown(false);
  };

  return (
    <AdminLayout>
      <div className="adminCourse-wrapper">
        <div className="adminCourse-header">
          <h2 className="adminCourse-title">All Courses</h2>
          <div className="adminCourse-add-dropdown">
            <button 
              className="adminCourse-add-btn" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              ➕ Add Course  ▼
            </button>
            {showDropdown && (
              <div className="adminCourse-dropdown-menu">
                <button 
                  className="adminCourse-dropdown-item"
                  onClick={() => handleCourseTypeSelect('full_course')}
                >
                  📚 Full Course
                </button>
                <button 
                  className="adminCourse-dropdown-item"
                  onClick={() => handleCourseTypeSelect('recorded_classes')}
                >
                  🎥 Recorded Classes
                </button>
                <button 
                  className="adminCourse-dropdown-item"
                  onClick={() => handleCourseTypeSelect('mock_tests')}
                >
                  📝 Mock Tests
                </button>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <CourseForm
            editData={editCourse}
            courseType={selectedCourseType}
            onClose={() => {
              setShowForm(false);
              setEditCourse(null);
              setSelectedCourseType('full_course');
            }}
            onSuccess={() => {
              fetchCourses();
              setShowForm(false);
              setEditCourse(null);
              setSelectedCourseType('full_course');
            }}
          />
        )}

        <div className="adminCourse-grid">
          {courses.map((course, i) => (
            <div className="adminCourse-card" key={course._id}>
              <div className="adminCourse-image-wrap">
                <img
                  src={`/uploads/${course.thumbnail}`}
                  alt="Course Thumbnail"
                  className="adminCourse-image"
                />
                <div
                  className="adminCourse-publish-icon"
                  title={course.published ? "Published" : "Click to Publish"}
                  onClick={() => handlePublish(course._id, course.published)}
                >
                  {course.published ? (
                    <FaToggleOn color="#005ae0" size={22} />
                  ) : (
                    <FaToggleOff color="#ccc" size={22} />
                  )}
                </div>
              </div>
              <div className="adminCourse-card-body">
                <h3 className="adminCourse-name">{course.name}</h3>
                <div
                  className="adminCourse-description"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                ></div>
                <div className="adminCourse-card-footer">
                  <p className="adminCourse-price">₹{course.price}</p>
                  <p className="adminCourse-date">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="adminCourse-actions">
                  <button
                    className="adminCourse-icon-btn overview"
                    onClick={() => openOverviewModal(course)}
                    title="Add Overview"
                    type="button"
                  >
                    <FaFileAlt />
                    <span className="adminCourse-action-text">Add Overview</span>
                  </button>
                  {course.courseType === 'recorded_classes' && (
                    <button
                      className="adminCourse-icon-btn videos"
                      onClick={() => setVideoManagementCourse(course)}
                      title="Manage Videos"
                      type="button"
                    >
                      <FaVideo />
                      <span className="adminCourse-action-text">Manage Videos</span>
                    </button>
                  )}
                  <button
                    className="adminCourse-icon-btn edit"
                    onClick={() => handleEdit(course)}
                    title="Edit"
                    type="button"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="adminCourse-icon-btn delete"
                    onClick={() => handleDelete(course._id)}
                    title="Delete"
                    type="button"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {overviewCourse && (
            <motion.div
              className="course-overview-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeOverviewModal}
            >
              <motion.div
                className="course-overview-modal"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="course-overview-modal-header">
                  <div>
                    <h3 className="course-overview-title">Course Overview</h3>
                    <p className="course-overview-subtitle">{overviewCourse?.name}</p>
                  </div>
                  <button
                    className="course-overview-close"
                    onClick={closeOverviewModal}
                    type="button"
                    disabled={savingOverview}
                  >
                    ×
                  </button>
                </div>
                <form className="course-overview-form" onSubmit={handleOverviewSubmit}>
                  <div className="course-overview-section">
                    <label className="course-overview-label" htmlFor="overview-description">
                      COURSE TITLE
                    </label>
                    <textarea
                      id="overview-description"
                      className="course-overview-textarea"
                      value={overviewForm.description}
                      onChange={(event) => handleOverviewChange("description", event.target.value)}
                      placeholder="Share a compelling overview of this course..."
                      rows={6}
                    />
                  </div>
                  <div className="course-overview-section">
                    <label className="course-overview-label" htmlFor="overview-materials">
                      Material Includes
                    </label>
                    <textarea
                      id="overview-materials"
                      className="course-overview-textarea"
                      value={overviewForm.materialIncludes}
                      onChange={(event) => handleOverviewChange("materialIncludes", event.target.value)}
                      placeholder="List resources included with this course. Add one item per line."
                      rows={4}
                    />
                    <p className="course-overview-hint">Each new line will appear as a bullet point for students.</p>
                  </div>
                  <div className="course-overview-section">
                    <label className="course-overview-label" htmlFor="overview-about">
                      About The Course
                    </label>
                    <textarea
                      id="overview-about"
                      className="course-overview-textarea"
                      value={overviewForm.about}
                      onChange={(event) => handleOverviewChange("about", event.target.value)}
                      placeholder="Write the detailed course overview students will see on the course page."
                      rows={6}
                    />
                  </div>
                  <div className="course-overview-section">
                    <label className="course-overview-label" htmlFor="overview-requirements">
                      Requirements
                    </label>
                    <textarea
                      id="overview-requirements"
                      className="course-overview-textarea"
                      value={overviewForm.requirements}
                      onChange={(event) => handleOverviewChange("requirements", event.target.value)}
                      placeholder="Describe any prerequisites or expectations. Add one item per line."
                      rows={4}
                    />
                  </div>
                  <div className="course-overview-section">
                    <label className="course-overview-label" htmlFor="overview-video-url">
                      YouTube Video URL
                    </label>
                    <input
                      id="overview-video-url"
                      className="course-overview-textarea"
                      value={overviewForm.videoUrl}
                      onChange={(event) => handleOverviewChange("videoUrl", event.target.value)}
                      placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                    />
                  </div>
                  <div className="course-overview-actions">
                    <button
                      className="course-overview-save"
                      type="submit"
                      disabled={savingOverview}
                    >
                      {savingOverview ? "Saving..." : "Save Overview"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {videoManagementCourse && (
          <VideoManagement
            courseId={videoManagementCourse._id}
            onClose={() => setVideoManagementCourse(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AddCourse;
