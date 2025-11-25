// File: CourseForm.jsx
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./CourseForm.css";

const CourseForm = ({ onClose, onSuccess, editData, courseType = 'full_course' }) => {
    const [name, setName] = useState(editData?.name || "");
  const [price, setPrice] = useState(editData?.price || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [selectedCourseType, setSelectedCourseType] = useState(editData?.courseType || courseType || 'full_course');
 const [thumbnail, setThumbnail] = useState(null);
 const [preview, setPreview] = useState(editData?.thumbnail ? `/uploads/${editData.thumbnail}` : null);
  const [loading, setLoading] = useState(false);

  const courseTypeLabels = {
    full_course: 'Full Course',
    recorded_classes: 'Recorded Classes',
    mock_tests: 'Mock Tests'
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("courseType", selectedCourseType);

  // Only add thumbnail if new file selected (edit case may have preview string)
  if (typeof thumbnail === "object") {
    formData.append("thumbnail", thumbnail);
  }

  try {
    const token = localStorage.getItem("adminToken");

    if (editData) {
      // UPDATE existing course
      await axios.put(`/api/courses/${editData._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Course updated successfully!");
    } else {
      // CREATE new course
      await axios.post("/api/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Course added successfully!");
    }

    onSuccess(); // Refresh + Close modal
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Something went wrong!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="adminCourse-form-overlay">
      <div className="adminCourse-form-modal">
        <h2 className="adminCourse-form-title">
          {editData ? 'Edit Course' : `Add ${courseTypeLabels[courseType]}`}
        </h2>
        <form onSubmit={handleSubmit} className="adminCourse-form">
          <div className="adminCourse-form-group">
            <label>Course Title</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="adminCourse-form-group">
            <label>Course Type</label>
            <select 
              value={selectedCourseType} 
              onChange={(e) => setSelectedCourseType(e.target.value)}
              className="adminCourse-select"
            >
              <option value="full_course">📚 Full Course</option>
              <option value="recorded_classes">🎥 Recorded Classes</option>
              <option value="mock_tests">📝 Mock Tests</option>
            </select>
          </div>

          <div className="adminCourse-form-group">
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div className="adminCourse-form-group">
            <label>Description</label>
            <ReactQuill value={description} onChange={setDescription} />
          </div>

          <div className="adminCourse-form-group">
            <label>Thumbnail {!editData && <span style={{color: 'red'}}>*</span>}</label>
            <input type="file" onChange={handleThumbnail} required={!editData} />
            {preview && <img src={preview} alt="Preview" className="adminCourse-thumb-preview" />}
          </div>

          <div className="adminCourse-form-actions">
            <button type="submit" disabled={loading} className="adminCourse-submit">
              {loading ? "Saving..." : "Save Course"}
            </button>
            <button type="button" onClick={onClose} className="adminCourse-cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
