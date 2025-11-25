import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentCourseContentManager.css";
import { FaPlay, FaVideo, FaFileAlt, FaChevronDown, FaChevronRight, FaBook, FaClipboardList, FaGraduationCap, FaClock, FaCheckCircle, FaLock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from 'dompurify';

const StudentCourseContentManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("recorded");
  
  const [recordedClasses, setRecordedClasses] = useState({ videos: [], groupedByTopic: {}, totalVideos: 0 });
  const [mockTests, setMockTests] = useState({ series: [], totalTests: 0, totalSeries: 0 });
  const [fullCourseContent, setFullCourseContent] = useState({ structure: [], totalSubjects: 0, totalChapters: 0, totalTopics: 0, totalTests: 0 });
  const [stats, setStats] = useState({ totalVideos: 0, totalTests: 0, totalMockTests: 0 });
  
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);

  const sanitizeHtml = (html) => {
    if (!html) return '';
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'] });
  };

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken") || localStorage.getItem("token");
        console.log("📚 Fetching comprehensive content, token present:", !!token);
        
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`/api/student/course/${courseId}/comprehensive-content`, {
          headers,
        });

        console.log("📦 API Response received:", res.data);
        console.log("📦 Response success:", res.data?.success);

        if (res.data && res.data.success) {
          console.log("✅ Setting course data...");
          setCourse(res.data.course);
          setRecordedClasses(res.data.recordedClasses || { videos: [], groupedByTopic: {} });
          setMockTests(res.data.mockTests || { series: [], totalTests: 0 });
          setFullCourseContent(res.data.fullCourseContent || { structure: [] });
          setStats(res.data.stats || { totalVideos: 0, totalTests: 0, totalMockTests: 0 });
          console.log("✅ All data set, videos count:", res.data.recordedClasses?.totalVideos);
          
          if (res.data.recordedClasses?.totalVideos > 0) {
            setActiveSection("recorded");
          } else if (res.data.mockTests?.totalTests > 0) {
            setActiveSection("mocktests");
          } else {
            setActiveSection("fullcourse");
          }
          console.log("✅ Active section set");
        } else {
          console.error("❌ API returned success:false or no data");
          setError("Failed to load course content. Invalid response from server.");
        }
        setLoading(false);
        console.log("✅ Loading set to false");
      } catch (err) {
        console.error("❌ Error fetching course content:", err);
        console.error("❌ Error response:", err?.response);
        if (err?.response?.status === 403) {
          setError("You need to purchase this course to access its content.");
        } else {
          setError("Failed to load course content. Please try again.");
        }
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseContent();
    }
  }, [courseId]);

  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  if (loading) {
    return (
      <div className="student-content-manager">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-content-manager">
        <div className="error-state">
          <FaLock className="error-icon" />
          <h3>Access Denied</h3>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-content-manager">
      <div className="course-header">
        <div className="course-info">
          <h1 className="course-title">{course?.name || "Course Content"}</h1>
          <div className="course-description" dangerouslySetInnerHTML={{ __html: sanitizeHtml(course?.description) }} />
        </div>
        <div className="course-stats">
          <div className="stat-item">
            <FaVideo />
            <span>{stats.totalVideos} Videos</span>
          </div>
          <div className="stat-item">
            <FaClipboardList />
            <span>{stats.totalMockTests} Mock Tests</span>
          </div>
          <div className="stat-item">
            <FaBook />
            <span>{stats.totalTests} Practice Tests</span>
          </div>
        </div>
      </div>

      <div className="section-tabs">
        <button 
          className={`section-tab ${activeSection === 'recorded' ? 'active' : ''}`}
          onClick={() => setActiveSection('recorded')}
        >
          <FaVideo /> Recorded Classes
          <span className="tab-count">{recordedClasses.totalVideos}</span>
        </button>
        <button 
          className={`section-tab ${activeSection === 'mocktests' ? 'active' : ''}`}
          onClick={() => setActiveSection('mocktests')}
        >
          <FaClipboardList /> Mock Tests
          <span className="tab-count">{mockTests.totalTests}</span>
        </button>
        <button 
          className={`section-tab ${activeSection === 'fullcourse' ? 'active' : ''}`}
          onClick={() => setActiveSection('fullcourse')}
        >
          <FaGraduationCap /> Full Course Content
          <span className="tab-count">{fullCourseContent.totalSubjects}</span>
        </button>
      </div>

      <div className="section-content">
        {activeSection === 'recorded' && (
          <div className="recorded-classes-section">
            <h2 className="section-title">
              <FaVideo /> Recorded Video Lectures
            </h2>
            
            {recordedClasses.totalVideos === 0 ? (
              <div className="empty-state">
                <FaVideo className="empty-icon" />
                <h3>No Video Lectures Available</h3>
                <p>Video lectures for this course will appear here once they are uploaded by the instructor.</p>
              </div>
            ) : (
              <>
                {playingVideo && (
                  <div className="video-player-container">
                    <div className="video-player-header">
                      <h3>{playingVideo.title}</h3>
                      <button className="close-player" onClick={() => setPlayingVideo(null)}>Close</button>
                    </div>
                    <div className="video-player">
                      <iframe
                        src={getYouTubeEmbedUrl(playingVideo.videoUrl)}
                        title={playingVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    {playingVideo.description && (
                      <div className="video-description">
                        <p>{playingVideo.description}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {Object.keys(recordedClasses.groupedByTopic).length > 0 ? (
                  Object.entries(recordedClasses.groupedByTopic).map(([topic, videos]) => (
                    <div key={topic} className="video-topic-group">
                      <h3 className="topic-title">{topic}</h3>
                      <div className="video-grid">
                        {videos.map((video, index) => (
                          <div 
                            key={video._id || index} 
                            className="video-card"
                            onClick={() => setPlayingVideo(video)}
                          >
                            <div className="video-thumbnail">
                              {video.thumbnail ? (
                                <img src={`/uploads/${video.thumbnail}`} alt={video.title} />
                              ) : (
                                <div className="thumbnail-placeholder">
                                  <FaPlay className="play-icon" />
                                </div>
                              )}
                              <div className="play-overlay">
                                <FaPlay />
                              </div>
                              {video.duration && (
                                <span className="video-duration">{video.duration}</span>
                              )}
                            </div>
                            <div className="video-info">
                              <h4>{video.title}</h4>
                              <p className="video-serial">Lecture {video.serialNumber || index + 1}</p>
                              {video.isFree && <span className="free-badge">FREE</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="video-grid">
                    {recordedClasses.videos.map((video, index) => (
                      <div 
                        key={video._id || index} 
                        className="video-card"
                        onClick={() => setPlayingVideo(video)}
                      >
                        <div className="video-thumbnail">
                          {video.thumbnail ? (
                            <img src={`/uploads/${video.thumbnail}`} alt={video.title} />
                          ) : (
                            <div className="thumbnail-placeholder">
                              <FaPlay className="play-icon" />
                            </div>
                          )}
                          <div className="play-overlay">
                            <FaPlay />
                          </div>
                          {video.duration && (
                            <span className="video-duration">{video.duration}</span>
                          )}
                        </div>
                        <div className="video-info">
                          <h4>{video.title}</h4>
                          <p className="video-serial">Lecture {video.serialNumber || index + 1}</p>
                          {video.isFree && <span className="free-badge">FREE</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeSection === 'mocktests' && (
          <div className="mock-tests-section">
            <h2 className="section-title">
              <FaClipboardList /> Mock Tests
            </h2>
            
            {mockTests.totalTests === 0 ? (
              <div className="empty-state">
                <FaClipboardList className="empty-icon" />
                <h3>No Mock Tests Available</h3>
                <p>Mock tests for practice will appear here once they are published.</p>
                <button 
                  className="explore-btn"
                  onClick={() => navigate('/student/mock-tests')}
                >
                  Explore All Mock Tests
                </button>
              </div>
            ) : (
              <div className="mock-test-series-list">
                {mockTests.series.map((series) => (
                  <div key={series._id} className="mock-test-series-card">
                    <div className="series-header">
                      <div className="series-info">
                        <h3>{series.title}</h3>
                        <p>{series.description}</p>
                        <div className="series-meta">
                          <span className="category-badge">{series.category}</span>
                          <span className="test-count">{series.tests?.length || 0} Tests</span>
                        </div>
                      </div>
                      {series.thumbnail && (
                        <img 
                          src={`/uploads/${series.thumbnail}`} 
                          alt={series.title}
                          className="series-thumbnail"
                        />
                      )}
                    </div>
                    
                    {series.tests && series.tests.length > 0 && (
                      <div className="series-tests">
                        {series.tests.slice(0, 5).map((test, index) => (
                          <div key={test._id} className="test-item">
                            <div className="test-info">
                              <FaFileAlt />
                              <span>{test.title || `Test ${index + 1}`}</span>
                            </div>
                            <div className="test-details">
                              <span className="duration"><FaClock /> {test.duration} min</span>
                              <span className="marks">{test.totalMarks} marks</span>
                              {test.isFree ? (
                                <button 
                                  className="start-test-btn free"
                                  onClick={() => navigate(`/student/mock-test/${test._id}/instructions`)}
                                >
                                  Start Free Test
                                </button>
                              ) : (
                                <button 
                                  className="start-test-btn"
                                  onClick={() => navigate(`/student/mock-test/${test._id}/instructions`)}
                                >
                                  Start Test
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {series.tests.length > 5 && (
                          <button 
                            className="view-all-btn"
                            onClick={() => navigate('/student/mock-tests')}
                          >
                            View All {series.tests.length} Tests
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'fullcourse' && (
          <div className="full-course-section">
            <h2 className="section-title">
              <FaGraduationCap /> Full Course Content
            </h2>
            
            <div className="course-overview">
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-value">{fullCourseContent.totalSubjects}</span>
                  <span className="stat-label">Subjects</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{fullCourseContent.totalChapters}</span>
                  <span className="stat-label">Chapters</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{fullCourseContent.totalTopics}</span>
                  <span className="stat-label">Topics</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{fullCourseContent.totalTests}</span>
                  <span className="stat-label">Tests</span>
                </div>
              </div>
            </div>
            
            {fullCourseContent.structure.length === 0 ? (
              <div className="empty-state">
                <FaBook className="empty-icon" />
                <h3>Course Content Coming Soon</h3>
                <p>The detailed course curriculum will be available here once the instructor adds the content structure.</p>
              </div>
            ) : (
              <div className="course-tree">
                {fullCourseContent.structure.map((subject) => (
                  <div key={subject._id} className="subject-item">
                    <div 
                      className="tree-node subject-node"
                      onClick={() => toggleSubject(subject._id)}
                    >
                      {expandedSubjects[subject._id] ? <FaChevronDown /> : <FaChevronRight />}
                      <FaBook className="node-icon" />
                      <span className="node-title">{subject.name}</span>
                      <span className="node-count">{subject.chapters?.length || 0} Chapters</span>
                    </div>
                    
                    {expandedSubjects[subject._id] && subject.chapters && (
                      <div className="chapters-list">
                        {subject.chapters.map((chapter) => (
                          <div key={chapter._id} className="chapter-item">
                            <div 
                              className="tree-node chapter-node"
                              onClick={() => toggleChapter(chapter._id)}
                            >
                              {expandedChapters[chapter._id] ? <FaChevronDown /> : <FaChevronRight />}
                              <FaFileAlt className="node-icon" />
                              <span className="node-title">{chapter.name}</span>
                              <span className="node-count">{chapter.topics?.length || 0} Topics</span>
                            </div>
                            
                            {expandedChapters[chapter._id] && (
                              <div className="topics-list">
                                {chapter.topics && chapter.topics.map((topic) => (
                                  <div key={topic._id} className="topic-item">
                                    <div 
                                      className="tree-node topic-node"
                                      onClick={() => toggleTopic(topic._id)}
                                    >
                                      {(topic.tests?.length > 0 || topic.videos?.length > 0) && (
                                        expandedTopics[topic._id] ? <FaChevronDown /> : <FaChevronRight />
                                      )}
                                      <FaGraduationCap className="node-icon" />
                                      <span className="node-title">{topic.name}</span>
                                      {topic.tests?.length > 0 && (
                                        <span className="node-badge tests">{topic.tests.length} Tests</span>
                                      )}
                                      {topic.videos?.length > 0 && (
                                        <span className="node-badge videos">{topic.videos.length} Videos</span>
                                      )}
                                    </div>
                                    
                                    {expandedTopics[topic._id] && (
                                      <div className="topic-content">
                                        {topic.videos && topic.videos.length > 0 && (
                                          <div className="topic-videos">
                                            {topic.videos.map((video) => (
                                              <div 
                                                key={video._id} 
                                                className="content-item video-item"
                                                onClick={() => {
                                                  setPlayingVideo(video);
                                                  setActiveSection('recorded');
                                                }}
                                              >
                                                <FaVideo />
                                                <span>{video.title}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                        {topic.tests && topic.tests.length > 0 && (
                                          <div className="topic-tests">
                                            {topic.tests.map((test) => (
                                              <div key={test._id} className="content-item test-item">
                                                <FaClipboardList />
                                                <span>{test.title}</span>
                                                <span className="test-duration">{test.duration} min</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                
                                {chapter.directTests && chapter.directTests.length > 0 && (
                                  <div className="direct-tests">
                                    <h4>Chapter Tests</h4>
                                    {chapter.directTests.map((test) => (
                                      <div key={test._id} className="content-item test-item">
                                        <FaClipboardList />
                                        <span>{test.title}</span>
                                        <span className="test-duration">{test.duration} min</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <button 
          className="action-btn primary"
          onClick={() => navigate('/student/live-classes')}
        >
          Live Classes
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => navigate('/student/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default StudentCourseContentManager;
