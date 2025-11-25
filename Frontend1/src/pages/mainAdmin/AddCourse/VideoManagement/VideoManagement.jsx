import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { FaEdit, FaTrash, FaLock, FaLockOpen, FaPlus, FaUpload } from 'react-icons/fa';
import './VideoManagement.css';

const VideoManagement = ({ courseId, onClose }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [bulkUploadMode, setBulkUploadMode] = useState(false);
  
  const [formData, setFormData] = useState({
    topicName: '',
    title: '',
    description: '',
    videoUrl: '',
    serialNumber: 1,
    duration: '',
    isFree: false
  });

  const [bulkVideos, setBulkVideos] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'
  const [csvFile, setCsvFile] = useState(null);
  const [bulkInputMode, setBulkInputMode] = useState('text'); // 'text' or 'csv'

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`/api/courses/${courseId}/videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(res.data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Use FormData if file upload, otherwise JSON
      const isFileUpload = uploadMode === 'file' && videoFile;
      let payload;
      let headers = { Authorization: `Bearer ${token}` };

      if (isFileUpload) {
        // FormData for file upload
        payload = new FormData();
        payload.append('courseId', courseId);
        payload.append('topicName', formData.topicName);
        payload.append('title', formData.title);
        payload.append('description', formData.description);
        payload.append('serialNumber', formData.serialNumber);
        payload.append('duration', formData.duration);
        payload.append('isFree', formData.isFree);
        payload.append('videoFile', videoFile);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // JSON for URL
        payload = {
          courseId,
          ...formData
        };
        headers['Content-Type'] = 'application/json';
      }

      if (editingVideo) {
        await axios.put(`/api/courses/videos/${editingVideo._id}`, payload, { headers });
        alert('✅ Video updated successfully');
      } else {
        await axios.post(`/api/courses/${courseId}/videos`, payload, { headers });
        alert('✅ Video added successfully');
      }

      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('❌ Failed to save video: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target.result;
        setBulkVideos(csvContent);
      };
      reader.readAsText(file);
    }
  };

  const handleBulkUpload = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!bulkVideos.trim()) {
        alert('⚠️ Please enter at least one video');
        setLoading(false);
        return;
      }

      // Use PapaParse for proper CSV parsing (handles commas in quoted fields)
      const parseResult = Papa.parse(bulkVideos.trim(), {
        skipEmptyLines: true,
        delimiter: ',',
      });

      if (parseResult.errors.length > 0) {
        console.error('CSV parsing errors:', parseResult.errors);
        alert('⚠️ CSV parsing error: ' + parseResult.errors[0].message);
        setLoading(false);
        return;
      }

      const rows = parseResult.data;
      if (rows.length === 0) {
        alert('⚠️ No valid video entries found');
        setLoading(false);
        return;
      }

      const videosArray = rows.map((parts, index) => {
        // Clean up each field
        const cleanParts = parts.map(p => (typeof p === 'string' ? p.trim() : ''));
        
        // Validation
        if (cleanParts.length < 3) {
          throw new Error(`Line ${index + 1}: Minimum 3 fields required (Topic, Title, URL)`);
        }
        if (!cleanParts[2]) {
          throw new Error(`Line ${index + 1}: Video URL is required`);
        }

        // Parse isFree with flexible boolean support
        let isFree = false;
        if (cleanParts[4]) {
          const freeValue = cleanParts[4].toLowerCase();
          isFree = freeValue === 'true' || freeValue === '1' || freeValue === 'yes';
        }

        return {
          topicName: cleanParts[0] || 'General',
          title: cleanParts[1] || `Video ${index + 1}`,
          videoUrl: cleanParts[2],
          duration: cleanParts[3] || '',
          isFree,
          serialNumber: index + 1
        };
      });

      await axios.post('/api/courses/videos/bulk-upload', {
        courseId,
        videos: videosArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`✅ ${videosArray.length} videos uploaded successfully!`);
      setBulkVideos('');
      setCsvFile(null);
      setBulkUploadMode(false);
      fetchVideos();
    } catch (error) {
      console.error('Error bulk uploading:', error);
      const errorMsg = error.message || error.response?.data?.message || 'Failed to bulk upload videos';
      alert('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/courses/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Video deleted');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('❌ Failed to delete video');
    }
  };

  const handleToggleFree = async (videoId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(`/api/courses/videos/${videoId}/toggle-free`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchVideos();
    } catch (error) {
      console.error('Error toggling video status:', error);
      alert('❌ Failed to toggle status');
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setFormData({
      topicName: video.topicName || '',
      title: video.title || '',
      description: video.description || '',
      videoUrl: video.videoUrl || '',
      serialNumber: video.serialNumber || 1,
      duration: video.duration || '',
      isFree: video.isFree || false
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      topicName: '',
      title: '',
      description: '',
      videoUrl: '',
      serialNumber: videos.length + 1,
      duration: '',
      isFree: false
    });
    setVideoFile(null);
    setUploadMode('url');
    setEditingVideo(null);
    setShowAddForm(false);
  };

  return (
    <div className="video-management-overlay">
      <div className="video-management-modal">
        <div className="video-management-header">
          <h2>📹 Video Management</h2>
          <button className="video-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="video-actions">
          <button 
            className="video-action-btn primary"
            onClick={() => { setShowAddForm(true); setBulkUploadMode(false); }}
          >
            <FaPlus /> Add Single Video
          </button>
          <button 
            className="video-action-btn secondary"
            onClick={() => { setBulkUploadMode(true); setShowAddForm(false); }}
          >
            <FaUpload /> Bulk Upload
          </button>
        </div>

        {showAddForm && !bulkUploadMode && (
          <div className="video-form-container">
            <h3>{editingVideo ? 'Edit Video' : 'Add New Video'}</h3>
            <form onSubmit={handleAddVideo} className="video-form">
              <div className="video-form-row">
                <div className="video-form-group">
                  <label>Topic Name</label>
                  <input
                    type="text"
                    value={formData.topicName}
                    onChange={(e) => handleInputChange('topicName', e.target.value)}
                    placeholder="e.g., Grammar, Quantitative Aptitude"
                  />
                </div>
                <div className="video-form-group">
                  <label>Serial Number</label>
                  <input
                    type="number"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', parseInt(e.target.value))}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="video-form-group">
                <label>Video Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="Enter video title"
                />
              </div>

              <div className="video-form-group">
                <label style={{ marginBottom: '10px', display: 'block' }}>Video Source *</label>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      value="url"
                      checked={uploadMode === 'url'}
                      onChange={() => { setUploadMode('url'); setVideoFile(null); }}
                    />
                    📎 Video URL / YouTube Link
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      value="file"
                      checked={uploadMode === 'file'}
                      onChange={() => { setUploadMode('file'); handleInputChange('videoUrl', ''); }}
                    />
                    📁 Upload Video File
                  </label>
                </div>

                {uploadMode === 'url' ? (
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    required={uploadMode === 'url'}
                    placeholder="https://youtube.com/watch?v=... or direct video URL"
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      required={uploadMode === 'file'}
                    />
                    {videoFile && <p style={{ marginTop: '5px', color: '#27ae60', fontSize: '14px' }}>✓ {videoFile.name}</p>}
                  </div> 
                )}
              </div>

              <div className="video-form-row">
                <div className="video-form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 45 min"
                  />
                </div>
                <div className="video-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => handleInputChange('isFree', e.target.checked)}
                    />
                    Free Video
                  </label>
                </div>
              </div>

              <div className="video-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="3"
                  placeholder="Enter video description"
                />
              </div>

              <div className="video-form-actions">
                <button type="submit" className="video-submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingVideo ? 'Update Video' : 'Add Video')}
                </button>
                <button type="button" className="video-cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {bulkUploadMode && (
          <div className="bulk-upload-container">
            <h3>📤 Bulk Upload Videos</h3>
            
            {/* Toggle between Text and CSV File */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="text"
                  checked={bulkInputMode === 'text'}
                  onChange={() => { setBulkInputMode('text'); setCsvFile(null); }}
                />
                ✍️ Paste CSV Text
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="csv"
                  checked={bulkInputMode === 'csv'}
                  onChange={() => setBulkInputMode('csv')}
                />
                📂 Upload CSV File
              </label>
            </div>

            <p className="bulk-upload-hint">
              Format: TopicName, VideoTitle, VideoURL, Duration, IsFree(true/false)<br/>
              One video per line. Example:<br/>
              <code>Grammar,Introduction to Nouns,https://youtube.com/...,30min,true</code>
            </p>

            {bulkInputMode === 'text' ? (
              <textarea
                value={bulkVideos}
                onChange={(e) => setBulkVideos(e.target.value)}
                rows="10"
                placeholder="Grammar,Introduction to Nouns,https://youtube.com/watch?v=abc,30min,true
Grammar,Pronouns Basics,https://youtube.com/watch?v=def,25min,false"
                className="bulk-upload-textarea"
              />
            ) : (
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                  style={{
                    padding: '10px',
                    border: '2px dashed #3498db',
                    borderRadius: '8px',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                />
                {csvFile && (
                  <div style={{ marginTop: '10px', color: '#27ae60', fontSize: '14px' }}>
                    ✓ File loaded: {csvFile.name}
                    <button 
                      onClick={() => { setCsvFile(null); setBulkVideos(''); }}
                      style={{ marginLeft: '10px', padding: '2px 8px', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                  </div>
                )}
                {bulkVideos && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Preview ({(() => {
                      const parsed = Papa.parse(bulkVideos.trim(), { skipEmptyLines: true });
                      return parsed.data.length;
                    })()} videos detected):</strong>
                    <textarea
                      value={bulkVideos}
                      readOnly
                      rows="8"
                      className="bulk-upload-textarea"
                      style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="bulk-upload-actions">
              <button 
                className="video-submit-btn"
                onClick={handleBulkUpload}
                disabled={loading || !bulkVideos.trim()}
              >
                {loading ? 'Uploading...' : 'Upload Videos'}
              </button>
              <button 
                className="video-cancel-btn"
                onClick={() => { setBulkUploadMode(false); setBulkVideos(''); setCsvFile(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="videos-list">
          <h3>📚 All Videos ({videos.length})</h3>
          {loading && <p>Loading videos...</p>}
          {!loading && videos.length === 0 && (
            <p className="no-videos">No videos added yet. Click "Add Single Video" or "Bulk Upload" to get started.</p>
          )}
          {!loading && videos.length > 0 && (
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video._id} className="video-card">
                  <div className="video-card-header">
                    <span className="video-serial">#{video.serialNumber}</span>
                    <span className={`video-badge ${video.isFree ? 'free' : 'paid'}`}>
                      {video.isFree ? <><FaLockOpen /> FREE</> : <><FaLock /> PAID</>}
                    </span>
                  </div>
                  {video.topicName && <div className="video-topic">{video.topicName}</div>}
                  <h4 className="video-title">{video.title}</h4>
                  {video.duration && <p className="video-duration">⏱️ {video.duration}</p>}
                  {video.description && <p className="video-description">{video.description}</p>}
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    🔗 View Video
                  </a>
                  <div className="video-card-actions">
                    <button
                      className="video-action-icon"
                      onClick={() => handleEditVideo(video)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="video-action-icon"
                      onClick={() => handleToggleFree(video._id)}
                      title={video.isFree ? 'Make Paid' : 'Make Free'}
                    >
                      {video.isFree ? <FaLock /> : <FaLockOpen />}
                    </button>
                    <button
                      className="video-action-icon delete"
                      onClick={() => handleDeleteVideo(video._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoManagement;
