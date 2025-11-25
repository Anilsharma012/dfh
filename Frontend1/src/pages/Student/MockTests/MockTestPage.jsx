import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithErrorHandling } from '../../../utils/api';
import './MockTestPage.css';

const MockTestPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('previousYear');
  const [subTab, setSubTab] = useState('paperWise');
  const [testTree, setTestTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockTestTree();
  }, []);

  const fetchMockTestTree = async () => {
    try {
      setLoading(true);
      const data = await fetchWithErrorHandling('/api/mock-tests/tree');
      if (data && data.success) {
        setTestTree(data.data);
      }
    } catch (error) {
      console.error('Error fetching mock test tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    try {
      // Navigate to instructions page first (CAT exam style flow)
      navigate(`/student/mock-test/${testId}/instructions`);
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Please login to start the test');
    }
  };

  const renderPreviousYearTests = () => {
    if (!testTree) return null;

    const data = testTree.previousYear;

    if (subTab === 'paperWise') {
      const exams = Object.keys(data.paperWise);
      if (exams.length === 0) {
        return <div className="empty-state">No previous year papers available</div>;
      }

      return (
        <div className="papers-container">
          {exams.map((exam) => (
            <div key={exam} className="exam-section">
              <h3 className="exam-title">{exam}</h3>
              <div className="papers-grid">
                {data.paperWise[exam].exams && data.paperWise[exam].exams.map((paper) => (
                  <div key={paper.id} className="test-card">
                    <div className="test-card-header">
                      <h4>{exam} {paper.yearLabel}</h4>
                      <span className="test-badge previous-year">Previous Year</span>
                    </div>
                    {paper.declaration && (
                      <p className="test-description">{paper.declaration}</p>
                    )}
                    <div className="test-meta">
                      <span>⏱️ {paper.durationMinutes} min</span>
                      <span>🎯 {paper.totalMarks} marks</span>
                    </div>
                    <button
                      className="start-test-btn"
                      onClick={() => handleStartTest(paper.id)}
                    >
                      Start Test
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      const subjects = Object.keys(data.topicWise);
      if (subjects.length === 0) {
        return <div className="empty-state">No topic-wise tests available</div>;
      }

      return (
        <div className="topics-container">
          {subjects.map((subject) => (
            <div key={subject} className="subject-section">
              <h3 className="subject-title">{subject}</h3>
              <div className="topics-grid">
                {data.topicWise[subject].topics && data.topicWise[subject].topics.map((topic) => (
                  <div key={topic.id} className="test-card">
                    <div className="test-card-header">
                      <h4>{topic.topic || topic.title}</h4>
                      <span className="test-badge topic-wise">Topic Wise</span>
                    </div>
                    {topic.description && (
                      <p className="test-description">{topic.description}</p>
                    )}
                    <div className="test-meta">
                      <span>⏱️ {topic.durationMinutes} min</span>
                    </div>
                    <button
                      className="start-test-btn"
                      onClick={() => handleStartTest(topic.id)}
                    >
                      Start Test
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const renderTestList = (tests, testType) => {
    if (!tests || tests.length === 0) {
      return <div className="empty-state">No {testType} tests available</div>;
    }

    return (
      <div className="tests-grid">
        {tests.map((test) => (
          <div key={test.id} className="test-card">
            <div className="test-card-header">
              <h4>{test.name || test.title}</h4>
              <span className={`test-badge ${testType}`}>{testType}</span>
            </div>
            {test.description && (
              <p className="test-description">{test.description}</p>
            )}
            <div className="test-meta">
              <span>⏱️ {test.durationMinutes} min</span>
              <span>📝 {test.totalQuestions} questions</span>
              <span>🎯 {test.totalMarks} marks</span>
            </div>
            <button
              className="start-test-btn"
              onClick={() => handleStartTest(test.id)}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderSessionalTests = () => {
    if (!testTree || !testTree.sessionalTests) return null;

    const years = Object.keys(testTree.sessionalTests);
    if (years.length === 0) {
      return <div className="empty-state">No sessional tests available</div>;
    }

    return (
      <div className="sessional-container">
        {years.map((year) => (
          <div key={year} className="year-section">
            <h3 className="year-title">Session {year}</h3>
            <div className="tests-grid">
              {testTree.sessionalTests[year].map((test) => (
                <div key={test.id} className="test-card">
                  <div className="test-card-header">
                    <h4>{test.name || test.title}</h4>
                    <span className="test-badge sessional">Sessional</span>
                  </div>
                  {test.description && (
                    <p className="test-description">{test.description}</p>
                  )}
                  <div className="test-meta">
                    <span>⏱️ {test.durationMinutes} min</span>
                    <span>📝 {test.totalQuestions} questions</span>
                    <span>🎯 {test.totalMarks} marks</span>
                  </div>
                  <button
                    className="start-test-btn"
                    onClick={() => handleStartTest(test.id)}
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading-state">Loading mock tests...</div>;
    }

    if (!testTree) {
      return <div className="empty-state">No tests available</div>;
    }

    switch (activeTab) {
      case 'previousYear':
        return renderPreviousYearTests();
      case 'full':
        return renderTestList(testTree.fullTests, 'full');
      case 'series':
        return renderTestList(testTree.seriesTests, 'series');
      case 'module':
        return renderTestList(testTree.moduleTests, 'module');
      case 'sessional':
        return renderSessionalTests();
      default:
        return null;
    }
  };

  return (
    <div className="mock-test-page">
      <div className="page-header">
        <h1>Mock Tests</h1>
        <p className="page-subtitle">Practice with our comprehensive test series</p>
      </div>

      <div className="tabs-container">
        <div className="main-tabs">
          <button
            className={`tab ${activeTab === 'previousYear' ? 'active' : ''}`}
            onClick={() => setActiveTab('previousYear')}
          >
            Previous Year Papers
          </button>
          <button
            className={`tab ${activeTab === 'full' ? 'active' : ''}`}
            onClick={() => setActiveTab('full')}
          >
            Full Tests
          </button>
          <button
            className={`tab ${activeTab === 'series' ? 'active' : ''}`}
            onClick={() => setActiveTab('series')}
          >
            Series Tests
          </button>
          <button
            className={`tab ${activeTab === 'module' ? 'active' : ''}`}
            onClick={() => setActiveTab('module')}
          >
            Module Tests
          </button>
          <button
            className={`tab ${activeTab === 'sessional' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessional')}
          >
            Sessional Tests
          </button>
        </div>

        {activeTab === 'previousYear' && (
          <div className="sub-tabs">
            <button
              className={`sub-tab ${subTab === 'paperWise' ? 'active' : ''}`}
              onClick={() => setSubTab('paperWise')}
            >
              Paper Wise
            </button>
            <button
              className={`sub-tab ${subTab === 'topicWise' ? 'active' : ''}`}
              onClick={() => setSubTab('topicWise')}
            >
              Topic Wise
            </button>
          </div>
        )}
      </div>

      <div className="content-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default MockTestPage;
