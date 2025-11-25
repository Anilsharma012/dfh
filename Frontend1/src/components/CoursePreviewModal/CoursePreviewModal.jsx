import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import DOMPurify from 'isomorphic-dompurify';
import { FaLock, FaUnlock, FaTimes, FaPlay } from 'react-icons/fa';
import './CoursePreviewModal.css';

const CoursePreviewModal = ({ course, onClose, isEnrolled }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (course && course._id && course.courseType === 'recorded_classes') {
      fetchVideos();
    } else {
      setLoading(false);
    }
  }, [course]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`/api/courses/${course._id}/videos`);
      setVideos(res.data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    if (video.isFree) {
      setSelectedVideo(video);
    } else if (!isEnrolled) {
      // Navigate to buy page for paid videos
      navigate('/course-purchase', { state: course });
    } else {
      setSelectedVideo(video);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube URL conversion
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : new URLSearchParams(new URL(url).search).get('v');
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    // Vimeo URL conversion
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    
    // Direct video file or uploaded file
    if (url.startsWith('http') || url.startsWith('/uploads/')) {
      return url.startsWith('http') ? url : `/uploads/${url}`;
    }
    
    return `/uploads/${url}`;
  };

  const groupVideosByTopic = () => {
    const grouped = {};
    videos.forEach(video => {
      const topic = video.topicName || 'General';
      if (!grouped[topic]) grouped[topic] = [];
      grouped[topic].push(video);
    });
    return grouped;
  };

  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  const groupedVideos = groupVideosByTopic();

  return (
    <div className="course-preview-overlay" onClick={onClose}>
      <div className="course-preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="course-preview-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="course-preview-header">
          <h2>{course.name}</h2>
          <div className="course-preview-price">₹{course.price}</div>
        </div>

        <div className="course-preview-body">
          {/* Course Description */}
          <div className="course-preview-section">
            <h3>📝 Course Description</h3>
            <div 
              className="course-description-content" 
              dangerouslySetInnerHTML={sanitizeHTML(course.description || 'No description available')}
            />
          </div>

          {/* Overview Section */}
          {course.overview && (
            <div className="course-preview-section">
              <h3>📚 Course Overview</h3>
              {course.overview.about && (
                <div className="overview-item">
                  <strong>About:</strong>
                  <p>{course.overview.about}</p>
                </div>
              )}
              {course.overview.description && (
                <div className="overview-item">
                  <strong>Overview Description:</strong>
                  <p>{course.overview.description}</p>
                </div>
              )}
              {course.overview.materialIncludes && course.overview.materialIncludes.length > 0 && (
                <div className="overview-item">
                  <strong>What's Included:</strong>
                  <ul>
                    {course.overview.materialIncludes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {course.overview.requirements && course.overview.requirements.length > 0 && (
                <div className="overview-item">
                  <strong>Requirements:</strong>
                  <ul>
                    {course.overview.requirements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {course.overview.videoUrl && (
                <div className="overview-item">
                  <strong>Preview Video:</strong>
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      onClick={() => setSelectedVideo({ 
                        title: 'Course Preview Video', 
                        videoUrl: course.overview.videoUrl,
                        isFree: true
                      })}
                      style={{
                        backgroundColor: '#27ae60',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <FaPlay /> Watch Preview
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Free Resources Section */}
          {course.courseType === 'recorded_classes' && !loading && videos.length > 0 && (
            (() => {
              const freeVideos = videos.filter(v => v.isFree);
              return freeVideos.length > 0 ? (
                <div className="course-preview-section free-resources-section" style={{
                  backgroundColor: '#e8f8f5',
                  border: '2px solid #27ae60',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h3 style={{ color: '#27ae60', marginBottom: '15px' }}>
                    🎁 Free Resources ({freeVideos.length} Videos)
                  </h3>
                  <p style={{ color: '#555', marginBottom: '15px', fontSize: '14px' }}>
                    ✨ Watch these free videos without enrolling! Click any video below to start learning.
                  </p>
                  <div className="free-videos-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {freeVideos
                      .sort((a, b) => a.serialNumber - b.serialNumber)
                      .map((video) => (
                        <div
                          key={video._id}
                          className="free-video-link"
                          onClick={() => handleVideoClick(video)}
                          style={{
                            backgroundColor: 'white',
                            padding: '12px 15px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            border: '1px solid #d1f2eb',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(5px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(39, 174, 96, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                          }}
                        >
                          <div style={{
                            backgroundColor: '#27ae60',
                            color: 'white',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <FaPlay />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                              #{video.serialNumber} - {video.title}
                            </div>
                            {video.topicName && (
                              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                📚 {video.topicName}
                                {video.duration && <span> • ⏱️ {video.duration}</span>}
                              </div>
                            )}
                          </div>
                          <span style={{
                            backgroundColor: '#27ae60',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}>
                            PLAY FREE
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null;
            })()
          )}

          {/* Videos Section (for Recorded Classes) */}
          {course.courseType === 'recorded_classes' && (
            <div className="course-preview-section">
              <h3>🎥 Course Videos</h3>
              {loading ? (
                <p>Loading videos...</p>
              ) : videos.length === 0 ? (
                <p>No videos available yet.</p>
              ) : (
                <div className="videos-by-topic">
                  {Object.entries(groupedVideos).map(([topic, topicVideos]) => (
                    <div key={topic} className="topic-group">
                      <h4 className="topic-title">{topic}</h4>
                      <div className="video-list">
                        {topicVideos
                          .sort((a, b) => a.serialNumber - b.serialNumber)
                          .map((video) => (
                            <div
                              key={video._id}
                              className={`video-item ${!video.isFree && !isEnrolled ? 'locked' : 'unlocked'}`}
                              onClick={() => handleVideoClick(video)}
                              style={{ 
                                cursor: video.isFree || isEnrolled ? 'pointer' : 'not-allowed',
                                opacity: !video.isFree && !isEnrolled ? 0.6 : 1
                              }}
                            >
                              <div className="video-item-icon">
                                {video.isFree || isEnrolled ? (
                                  <FaPlay className="play-icon" style={{ color: '#27ae60' }} />
                                ) : (
                                  <FaLock className="lock-icon" />
                                )}
                              </div>
                              <div className="video-item-info">
                                <div className="video-item-title" style={{ 
                                  color: video.isFree || isEnrolled ? '#2c3e50' : '#95a5a6',
                                  fontWeight: video.isFree ? '600' : '500'
                                }}>
                                  #{video.serialNumber} - {video.title}
                                  {video.isFree && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#27ae60' }}>▶ Click to Play</span>}
                                </div>
                                {video.duration && (
                                  <div className="video-item-duration">{video.duration}</div>
                                )}
                                {video.videoUrl && video.isFree && (
                                  <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '3px' }}>
                                    🔗 {video.videoUrl.substring(0, 50)}...
                                  </div>
                                )}
                              </div>
                              <div className="video-item-badge">
                                {video.isFree ? (
                                  <span className="free-badge" style={{ 
                                    backgroundColor: '#27ae60',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}>🔓 FREE</span>
                                ) : (
                                  <span className="paid-badge" style={{
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}>🔒 {isEnrolled ? 'UNLOCK' : 'BUY TO UNLOCK'}</span>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Player */}
          {selectedVideo && (
            <div className="video-player-section">
              <div className="video-player-header">
                <h4>▶️ {selectedVideo.title}</h4>
                <button onClick={() => setSelectedVideo(null)}>Close Player</button>
              </div>
              <div className="video-player-wrapper">
                {getEmbedUrl(selectedVideo.videoUrl)?.includes('youtube.com') || 
                 getEmbedUrl(selectedVideo.videoUrl)?.includes('vimeo.com') ? (
                  <iframe
                    src={getEmbedUrl(selectedVideo.videoUrl)}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video controls autoPlay>
                    <source src={getEmbedUrl(selectedVideo.videoUrl)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {selectedVideo.description && (
                <div className="video-description">
                  <strong>Description:</strong>
                  <p>{selectedVideo.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="course-preview-footer">
          {!isEnrolled && (
            <button 
              className="enroll-btn" 
              onClick={() => navigate('/course-purchase', { state: course })}
            >
              Enroll Now - ₹{course.price}
            </button>
          )}
          {isEnrolled && (
            <div className="enrolled-badge">✅ You are enrolled in this course</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewModal;
