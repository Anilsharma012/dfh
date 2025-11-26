import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentCourseContentManager.css";
import {
  FaPlay,
  FaVideo,
  FaFileAlt,
  FaChevronDown,
  FaChevronRight,
  FaBook,
  FaClipboardList,
  FaGraduationCap,
  FaClock,
  FaLock,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

const StudentCourseContentManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("recorded");

  const [recordedClasses, setRecordedClasses] = useState({
    videos: [],
    groupedByTopic: {},
    totalVideos: 0,
  });
  const [mockTests, setMockTests] = useState({
    series: [],
    totalTests: 0,
    totalSeries: 0,
  });
  const [fullCourseContent, setFullCourseContent] = useState({
    structure: [],
    totalSubjects: 0,
    totalChapters: 0,
    totalTopics: 0,
    totalTests: 0,
  });
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalTests: 0,
    totalMockTests: 0,
  });

  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);

  const sanitizeHtml = (html) => {
    if (!html) return "";
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "b",
        "i",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "br",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "span",
      ],
    });
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("authToken") || localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(
          `/api/student/course/${courseId}/comprehensive-content`,
          { headers }
        );

        if (res.data && res.data.success) {
          const rc = res.data.recordedClasses || {
            videos: [],
            groupedByTopic: {},
            totalVideos: 0,
          };
          const mt = res.data.mockTests || {
            series: [],
            totalTests: 0,
            totalSeries: 0,
          };
          const fc = res.data.fullCourseContent || {
            structure: [],
            totalSubjects: 0,
            totalChapters: 0,
            totalTopics: 0,
            totalTests: 0,
          };
          const st = res.data.stats || {
            totalVideos: 0,
            totalTests: 0,
            totalMockTests: 0,
          };

          setCourse(res.data.course);
          setRecordedClasses(rc);
          setMockTests(mt);
          setFullCourseContent(fc);
          setStats(st);

          // default section
          if (rc.totalVideos > 0) {
            setActiveSection("recorded");
          } else if (mt.totalTests > 0) {
            setActiveSection("mocktests");
          } else {
            setActiveSection("fullcourse");
          }

          // default playing video
          const firstVideo =
            rc.videos && rc.videos.length > 0 ? rc.videos[0] : null;
          setPlayingVideo(firstVideo);
        } else {
          setError(
            "Failed to load course content. Invalid response from server."
          );
        }
      } catch (err) {
        console.error("❌ Error fetching course content:", err);
        if (err?.response?.status === 403) {
          setError(
            "You need to purchase this course to access its content."
          );
        } else {
          setError("Failed to load course content. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseContent();
    }
  }, [courseId]);

  const toggleSubject = (subjectId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  // ---------- UI STATES ----------

  if (loading) {
    return (
      <div className="scm-page">
        <div className="scm-center-card">
          <div className="scm-loader" />
          <p className="scm-muted">Loading your course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scm-page">
        <div className="scm-center-card scm-error-card">
          <FaLock className="scm-error-icon" />
          <h2>Access Restricted</h2>
          <p>{error}</p>
          <button
            className="scm-btn scm-btn-primary"
            onClick={() => navigate("/student/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ---------- HELPERS FOR RECORDED SECTION ----------

  const topicEntries =
    recordedClasses && recordedClasses.groupedByTopic
      ? Object.entries(recordedClasses.groupedByTopic)
      : [];

  const hasTopicGrouping = topicEntries.length > 0;

  const fallbackTopicEntries =
    !hasTopicGrouping && recordedClasses.videos?.length
      ? [["All Lectures", recordedClasses.videos]]
      : [];

  const finalTopicEntries =
    topicEntries.length > 0 ? topicEntries : fallbackTopicEntries;

  const currentVideo =
    playingVideo ||
    (finalTopicEntries[0] && finalTopicEntries[0][1]?.[0]) ||
    null;

  // ---------- RENDER ----------

  return (
    <div className="scm-page">
      {/* HEADER */}
      <header className="scm-header">
        <div className="scm-header-left">
          <p className="scm-badge-live">Enrolled Course</p>
          <h1 className="scm-title">
            {course?.name || "Recorded Course"}
          </h1>
          <div
            className="scm-description"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(course?.description),
            }}
          />
        </div>
        <div className="scm-header-right">
          <div className="scm-stat-pill">
            <FaVideo />
            <div>
              <span className="scm-stat-label">Videos</span>
              <span className="scm-stat-value">
                {stats.totalVideos || 0}
              </span>
            </div>
          </div>
          <div className="scm-stat-pill">
            <FaClipboardList />
            <div>
              <span className="scm-stat-label">Mock Tests</span>
              <span className="scm-stat-value">
                {stats.totalMockTests || 0}
              </span>
            </div>
          </div>
          <div className="scm-stat-pill">
            <FaBook />
            <div>
              <span className="scm-stat-label">Practice Tests</span>
              <span className="scm-stat-value">
                {stats.totalTests || 0}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="scm-tabs">
        <button
          className={`scm-tab ${
            activeSection === "recorded" ? "is-active" : ""
          }`}
          onClick={() => setActiveSection("recorded")}
        >
          <FaVideo />
          <span>Recorded Classes</span>
          <span className="scm-tab-count">
            {recordedClasses.totalVideos || 0}
          </span>
        </button>
        <button
          className={`scm-tab ${
            activeSection === "mocktests" ? "is-active" : ""
          }`}
          onClick={() => setActiveSection("mocktests")}
        >
          <FaClipboardList />
          <span>Mock Tests</span>
          <span className="scm-tab-count">
            {mockTests.totalTests || 0}
          </span>
        </button>
        <button
          className={`scm-tab ${
            activeSection === "fullcourse" ? "is-active" : ""
          }`}
          onClick={() => setActiveSection("fullcourse")}
        >
          <FaGraduationCap />
          <span>Full Course Content</span>
          <span className="scm-tab-count">
            {fullCourseContent.totalSubjects || 0}
          </span>
        </button>
      </div>

      {/* SECTION CONTENT */}
      <main className="scm-main">
        {/* RECORDED CLASSES */}
        {activeSection === "recorded" && (
          <section className="scm-section">
            <div className="scm-section-header">
              <h2>
                <FaVideo /> Recorded Video Lectures
              </h2>
              <p className="scm-muted">
                Watch topic-wise structured lectures with clean player
                and quick navigation.
              </p>
            </div>

            {recordedClasses.totalVideos === 0 ? (
              <div className="scm-empty">
                <FaVideo className="scm-empty-icon" />
                <h3>No Video Lectures Yet</h3>
                <p>
                  Once your faculty uploads recorded classes, they will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="scm-recorded-layout">
                {/* LEFT – VIDEO LIST */}
                <div className="scm-video-list">
                  {finalTopicEntries.map(([topicName, videos]) => (
                    <div key={topicName} className="scm-topic-block">
                      <div className="scm-topic-header">
                        <span className="scm-topic-chip">Topic</span>
                        <h3>{topicName}</h3>
                        <span className="scm-topic-count">
                          {videos.length} lecture
                          {videos.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="scm-video-items">
                        {videos.map((video, idx) => {
                          const isActive =
                            currentVideo &&
                            (currentVideo._id === video._id ||
                              currentVideo.title === video.title);
                          return (
                            <button
                              type="button"
                              key={video._id || idx}
                              className={`scm-video-item ${
                                isActive ? "is-active" : ""
                              }`}
                              onClick={() => setPlayingVideo(video)}
                            >
                              <div className="scm-video-thumb">
                                {video.thumbnail ? (
                                  <img
                                    src={`/uploads/${video.thumbnail}`}
                                    alt={video.title}
                                  />
                                ) : (
                                  <div className="scm-thumb-placeholder">
                                    <FaPlay />
                                  </div>
                                )}
                              </div>
                              <div className="scm-video-meta">
                                <p className="scm-video-title">
                                  {video.title}
                                </p>
                                <p className="scm-video-sub">
                                  Lecture{" "}
                                  {video.serialNumber ||
                                    idx + 1}
                                  {video.duration && (
                                    <>
                                      {" "}
                                      •{" "}
                                      <span>
                                        {video.duration}
                                      </span>
                                    </>
                                  )}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* RIGHT – MAIN PLAYER */}
                <div className="scm-player-card">
                  {currentVideo ? (
                    <>
                      <div className="scm-player-header">
                        <div>
                          <p className="scm-pill">
                            Lecture{" "}
                            {currentVideo.serialNumber ||
                              1}
                          </p>
                          <h3>{currentVideo.title}</h3>
                          {currentVideo.duration && (
                            <p className="scm-muted">
                              <FaClock /> {currentVideo.duration}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="scm-video-frame">
                        <div className="scm-video-frame-inner">
                          <iframe
                            src={getYouTubeEmbedUrl(
                              currentVideo.videoUrl
                            )}
                            title={currentVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>

                      {currentVideo.description && (
                        <div className="scm-player-notes">
                          <h4>Lecture Notes</h4>
                          <p>{currentVideo.description}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="scm-player-empty">
                      <FaPlay className="scm-player-empty-icon" />
                      <h3>Select a lecture to start learning</h3>
                      <p className="scm-muted">
                        Click any video from the list on the left.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* MOCK TESTS */}
        {activeSection === "mocktests" && (
          <section className="scm-section">
            <div className="scm-section-header">
              <h2>
                <FaClipboardList /> Mock Tests
              </h2>
              <p className="scm-muted">
                Full-length mocks with proper analytics to simulate
                actual exam.
              </p>
            </div>

            {mockTests.totalTests === 0 ? (
              <div className="scm-empty">
                <FaClipboardList className="scm-empty-icon" />
                <h3>No Mock Tests Yet</h3>
                <p>
                  Once mocks are published for this course, they will
                  appear here.
                </p>
                <button
                  className="scm-btn scm-btn-outline"
                  onClick={() => navigate("/student/mock-tests")}
                >
                  Explore All Platform Mock Tests
                </button>
              </div>
            ) : (
              <div className="scm-mock-grid">
                {mockTests.series.map((series) => (
                  <article
                    key={series._id}
                    className="scm-mock-card"
                  >
                    <div className="scm-mock-card-header">
                      <div>
                        <p className="scm-pill-light">
                          {series.category || "Mock Series"}
                        </p>
                        <h3>{series.title}</h3>
                        {series.description && (
                          <p className="scm-muted">
                            {series.description}
                          </p>
                        )}
                      </div>
                      {series.thumbnail && (
                        <img
                          src={`/uploads/${series.thumbnail}`}
                          alt={series.title}
                          className="scm-mock-thumb"
                        />
                      )}
                    </div>

                    {series.tests && series.tests.length > 0 && (
                      <div className="scm-mock-tests-list">
                        {series.tests.slice(0, 4).map((test) => (
                          <div
                            key={test._id}
                            className="scm-mock-test-row"
                          >
                            <div className="scm-mock-test-left">
                              <FaFileAlt />
                              <div>
                                <p>{test.title}</p>
                                <span className="scm-muted-small">
                                  {test.totalQuestions} Q •{" "}
                                  {test.totalMarks} Marks
                                </span>
                              </div>
                            </div>
                            <div className="scm-mock-test-right">
                              <span className="scm-muted-small">
                                <FaClock /> {test.duration} min
                              </span>
                              <button
                                className={`scm-btn scm-btn-sm ${
                                  test.isFree
                                    ? "scm-btn-ghost"
                                    : "scm-btn-primary"
                                }`}
                                onClick={() =>
                                  navigate(
                                    `/student/mock-test/${test._id}/instructions`
                                  )
                                }
                              >
                                {test.isFree
                                  ? "Start Free Test"
                                  : "Start Test"}
                              </button>
                            </div>
                          </div>
                        ))}

                        {series.tests.length > 4 && (
                          <button
                            className="scm-link-btn"
                            onClick={() =>
                              navigate("/student/mock-tests")
                            }
                          >
                            View all {series.tests.length} tests
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* FULL COURSE CONTENT */}
        {activeSection === "fullcourse" && (
          <section className="scm-section">
            <div className="scm-section-header">
              <h2>
                <FaGraduationCap /> Full Course Curriculum
              </h2>
              <p className="scm-muted">
                Subject → Chapter → Topic wise breakdown of your
                complete course.
              </p>
            </div>

            <div className="scm-curriculum-stats">
              <div className="scm-curr-stat">
                <span>{fullCourseContent.totalSubjects || 0}</span>
                <label>Subjects</label>
              </div>
              <div className="scm-curr-stat">
                <span>{fullCourseContent.totalChapters || 0}</span>
                <label>Chapters</label>
              </div>
              <div className="scm-curr-stat">
                <span>{fullCourseContent.totalTopics || 0}</span>
                <label>Topics</label>
              </div>
              <div className="scm-curr-stat">
                <span>{fullCourseContent.totalTests || 0}</span>
                <label>Tests</label>
              </div>
            </div>

            {fullCourseContent.structure.length === 0 ? (
              <div className="scm-empty">
                <FaBook className="scm-empty-icon" />
                <h3>Curriculum Coming Soon</h3>
                <p>
                  Once faculty adds detailed structure, you&apos;ll see
                  the entire curriculum here.
                </p>
              </div>
            ) : (
              <div className="scm-tree">
                {fullCourseContent.structure.map((subject) => (
                  <div
                    key={subject._id}
                    className="scm-tree-block"
                  >
                    <button
                      type="button"
                      className="scm-tree-node scm-tree-node-subject"
                      onClick={() => toggleSubject(subject._id)}
                    >
                      {expandedSubjects[subject._id] ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                      <FaBook className="scm-node-icon" />
                      <span>{subject.name}</span>
                      <span className="scm-node-count">
                        {subject.chapters?.length || 0} chapters
                      </span>
                    </button>

                    {expandedSubjects[subject._id] &&
                      subject.chapters && (
                        <div className="scm-tree-children">
                          {subject.chapters.map((chapter) => (
                            <div
                              key={chapter._id}
                              className="scm-tree-chapter"
                            >
                              <button
                                type="button"
                                className="scm-tree-node scm-tree-node-chapter"
                                onClick={() =>
                                  toggleChapter(chapter._id)
                                }
                              >
                                {expandedChapters[chapter._id] ? (
                                  <FaChevronDown />
                                ) : (
                                  <FaChevronRight />
                                )}
                                <FaFileAlt className="scm-node-icon" />
                                <span>{chapter.name}</span>
                                <span className="scm-node-count">
                                  {chapter.topics?.length || 0} topics
                                </span>
                              </button>

                              {expandedChapters[chapter._id] && (
                                <div className="scm-tree-children">
                                  {chapter.topics?.map((topic) => (
                                    <div
                                      key={topic._id}
                                      className="scm-tree-topic"
                                    >
                                      <button
                                        type="button"
                                        className="scm-tree-node scm-tree-node-topic"
                                        onClick={() =>
                                          toggleTopic(topic._id)
                                        }
                                      >
                                        {(topic.tests?.length > 0 ||
                                          topic.videos
                                            ?.length > 0) &&
                                          (expandedTopics[
                                            topic._id
                                          ] ? (
                                            <FaChevronDown />
                                          ) : (
                                            <FaChevronRight />
                                          ))}
                                        <FaGraduationCap className="scm-node-icon" />
                                        <span>{topic.name}</span>
                                        {topic.videos?.length >
                                          0 && (
                                          <span className="scm-node-badge videos">
                                            {topic.videos.length}{" "}
                                            videos
                                          </span>
                                        )}
                                        {topic.tests?.length >
                                          0 && (
                                          <span className="scm-node-badge tests">
                                            {topic.tests.length}{" "}
                                            tests
                                          </span>
                                        )}
                                      </button>

                                      {expandedTopics[topic._id] && (
                                        <div className="scm-topic-content">
                                          {topic.videos
                                            ?.length > 0 && (
                                            <div className="scm-topic-list">
                                              {topic.videos.map(
                                                (video) => (
                                                  <button
                                                    key={
                                                      video._id
                                                    }
                                                    type="button"
                                                    className="scm-topic-item"
                                                    onClick={() => {
                                                      setPlayingVideo(
                                                        video
                                                      );
                                                      setActiveSection(
                                                        "recorded"
                                                      );
                                                    }}
                                                  >
                                                    <FaVideo />
                                                    <span>
                                                      {
                                                        video.title
                                                      }
                                                    </span>
                                                  </button>
                                                )
                                              )}
                                            </div>
                                          )}

                                          {topic.tests?.length >
                                            0 && (
                                            <div className="scm-topic-list">
                                              {topic.tests.map(
                                                (test) => (
                                                  <div
                                                    key={
                                                      test._id
                                                    }
                                                    className="scm-topic-item scm-topic-test"
                                                  >
                                                    <FaClipboardList />
                                                    <span>
                                                      {
                                                        test.title
                                                      }
                                                    </span>
                                                    <span className="scm-muted-small">
                                                      {test.duration}{" "}
                                                      min
                                                    </span>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}

                                  {chapter.directTests &&
                                    chapter.directTests
                                      .length > 0 && (
                                      <div className="scm-topic-content">
                                        <p className="scm-muted-small">
                                          Chapter Tests
                                        </p>
                                        <div className="scm-topic-list">
                                          {chapter.directTests.map(
                                            (test) => (
                                              <div
                                                key={test._id}
                                                className="scm-topic-item scm-topic-test"
                                              >
                                                <FaClipboardList />
                                                <span>
                                                  {
                                                    test.title
                                                  }
                                                </span>
                                                <span className="scm-muted-small">
                                                  {test.duration}{" "}
                                                  min
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </div>
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
          </section>
        )}
      </main>

      {/* QUICK ACTIONS */}
      <div className="scm-footer-actions">
        <button
          className="scm-btn scm-btn-outline"
          onClick={() => navigate("/student/live-classes")}
        >
          Go to Live Classes
        </button>
        <button
          className="scm-btn scm-btn-primary"
          onClick={() => navigate("/student/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default StudentCourseContentManager;
