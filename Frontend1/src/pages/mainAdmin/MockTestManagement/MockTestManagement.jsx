import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../../../utils/api';
import PaperWiseManagement from './PaperWiseManagement';
import TopicWiseManagement from './TopicWiseManagement';
import QuestionBuilder from './QuestionBuilder';
import './MockTestManagement.css';

const MockTestManagement = () => {
  const [activeTab, setActiveTab] = useState('previousYear');
  const [subTab, setSubTab] = useState('paperWise');
  const [series, setSeries] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  
  const getDefaultSection = (sectionName) => {
    const defaults = {
      'VARC': { duration: 40, totalQuestions: 24, totalMarks: 72 },
      'DILR': { duration: 40, totalQuestions: 20, totalMarks: 60 },
      'QA': { duration: 40, totalQuestions: 22, totalMarks: 66 }
    };
    return {
      name: sectionName,
      ...defaults[sectionName],
      questions: []
    };
  };

  const getDefaultSections = () => ['VARC', 'DILR', 'QA'].map(getDefaultSection);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 120,
    totalQuestions: 66,
    testType: 'previousYear',
    paperType: 'paperWise',
    exam: 'CAT',
    yearLabel: '2024',
    subject: '',
    topic: '',
    sessionYear: '2024',
    sections: getDefaultSections()
  });

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const data = await fetchWithErrorHandling('/api/admin/mock-tests/series');
      if (data && data.series) {
        setSeries(data.series);
        if (data.series.length > 0) {
          setSelectedSeries(data.series[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async (seriesId) => {
    try {
      const data = await fetchWithErrorHandling(`/api/admin/mock-tests/tests?seriesId=${seriesId}`);
      if (data && data.tests) {
        setTests(data.tests);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleCreateSeries = async () => {
    const title = prompt('Enter series title:');
    if (!title) return;
    
    try {
      const data = await fetchWithErrorHandling('/api/admin/mock-tests/series', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category: 'CAT',
          description: '',
          price: 0,
          validity: 365
        })
      });
      
      if (data && data.success) {
        alert('Series created successfully!');
        fetchSeries();
      }
    } catch (error) {
      alert('Failed to create series: ' + error.message);
    }
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    const sections = test.sections && test.sections.length > 0 ? test.sections : getDefaultSections();
    setFormData({
      title: test.title || '',
      description: test.description || '',
      duration: test.duration || 120,
      totalQuestions: test.totalQuestions || 66,
      testType: test.testType || activeTab,
      paperType: test.paperType || subTab,
      exam: test.exam || 'CAT',
      yearLabel: test.yearLabel || '2024',
      subject: test.subject || '',
      topic: test.topic || '',
      sessionYear: test.sessionYear || '2024',
      sections: sections
    });
    setActiveTab(test.testType || activeTab);
    if (test.testType === 'previousYear') {
      setSubTab(test.paperType || 'paperWise');
    }
  };

  const handleCancelEdit = () => {
    setEditingTest(null);
    setFormData({
      title: '',
      description: '',
      duration: 120,
      totalQuestions: 66,
      testType: activeTab,
      paperType: subTab,
      exam: 'CAT',
      yearLabel: '2024',
      subject: '',
      topic: '',
      sessionYear: '2024',
      sections: getDefaultSections()
    });
  };

  const handleManageQuestions = (test) => {
    setSelectedTest(test);
    setShowQuestionBuilder(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSeries && !editingTest) {
      alert('Please select a series first or create one');
      return;
    }

    const requiredSections = ['VARC', 'DILR', 'QA'];
    for (const sectionName of requiredSections) {
      const section = formData.sections.find(s => s.name === sectionName);
      if (!section || !section.duration || section.duration <= 0) {
        alert(`Please enter a valid duration for ${sectionName} section (must be greater than 0)`);
        return;
      }
      if (!section.totalQuestions || section.totalQuestions < 0) {
        alert(`Please enter a valid question count for ${sectionName} section (must be 0 or greater)`);
        return;
      }
    }

    try {
      setLoading(true);
      
      const testData = {
        ...formData,
        seriesId: editingTest ? editingTest.seriesId : selectedSeries,
        testType: activeTab,
        paperType: activeTab === 'previousYear' ? subTab : null,
        positiveMarks: 3,
        negativeMarks: -1,
        isFree: false,
        difficulty: 'Medium'
      };

      let data;
      if (editingTest) {
        data = await fetchWithErrorHandling(`/api/admin/mock-tests/tests/${editingTest._id}`, {
          method: 'PUT',
          body: JSON.stringify(testData)
        });
      } else {
        data = await fetchWithErrorHandling('/api/admin/mock-tests/test', {
          method: 'POST',
          body: JSON.stringify(testData)
        });
      }

      if (data && data.success) {
        alert(`Test ${editingTest ? 'updated' : 'created'} successfully!`);
        handleCancelEdit();
        fetchTests(selectedSeries);
      }
    } catch (error) {
      alert(`Failed to ${editingTest ? 'update' : 'create'} test: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    
    try {
      const data = await fetchWithErrorHandling(`/api/admin/mock-tests/tests/${testId}`, {
        method: 'DELETE'
      });
      
      if (data && data.success) {
        alert('Test deleted successfully!');
        if (editingTest && editingTest._id === testId) {
          handleCancelEdit();
        }
        fetchTests(selectedSeries);
      }
    } catch (error) {
      alert('Failed to delete test: ' + error.message);
    }
  };

  useEffect(() => {
    if (selectedSeries) {
      fetchTests(selectedSeries);
    }
  }, [selectedSeries]);

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className="mock-test-form">
        {editingTest && (
          <div className="edit-banner">
            Editing: {editingTest.title}
            <button type="button" onClick={handleCancelEdit} className="btn-cancel">
              Cancel
            </button>
          </div>
        )}
        
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
          />
        </div>

        <div className="sections-configuration">
          <h3>Section-wise Configuration</h3>
          <p className="helper-text">Configure duration and question count for each section</p>
          
          {['VARC', 'DILR', 'QA'].map((sectionName) => {
            const sectionIndex = formData.sections.findIndex(s => s.name === sectionName);
            const section = sectionIndex >= 0 
              ? formData.sections[sectionIndex] 
              : getDefaultSection(sectionName);
            
            const updateSection = (updates) => {
              const sectionsMap = new Map(formData.sections.map(s => [s.name, s]));
              sectionsMap.set(sectionName, { ...section, ...updates });
              
              const canonicalOrder = ['VARC', 'DILR', 'QA'];
              const newSections = canonicalOrder.map(name => 
                sectionsMap.get(name) || getDefaultSection(name)
              );
              
              const totalDuration = newSections.reduce((sum, s) => sum + (s.duration || 0), 0);
              const totalQuestions = newSections.reduce((sum, s) => sum + (s.totalQuestions || 0), 0);
              
              setFormData({ 
                ...formData, 
                sections: newSections, 
                duration: totalDuration,
                totalQuestions 
              });
            };
            
            return (
              <div key={sectionName} className="section-config-row">
                <div className="section-label">
                  <strong>{sectionName}</strong>
                </div>
                <div className="section-inputs">
                  <div className="form-group">
                    <label>Duration (min) *</label>
                    <input
                      type="number"
                      min="1"
                      value={section.duration || 0}
                      onChange={(e) => {
                        const duration = parseInt(e.target.value) || 0;
                        updateSection({ duration });
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Questions *</label>
                    <input
                      type="number"
                      min="0"
                      value={section.totalQuestions || 0}
                      onChange={(e) => {
                        const totalQuestions = parseInt(e.target.value) || 0;
                        const totalMarks = totalQuestions * 3;
                        updateSection({ totalQuestions, totalMarks });
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="totals-summary">
            <div className="total-item">
              <strong>Total Duration:</strong> <span>{formData.duration} minutes</span>
            </div>
            <div className="total-item">
              <strong>Total Questions:</strong> <span>{formData.totalQuestions}</span>
            </div>
          </div>
        </div>

        {activeTab === 'previousYear' && subTab === 'paperWise' && (
          <>
            <div className="form-group">
              <label>Exam *</label>
              <select 
                value={formData.exam}
                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
              >
                <option value="CAT">CAT</option>
                <option value="XAT">XAT</option>
                <option value="SNAP">SNAP</option>
                <option value="IIFT">IIFT</option>
                <option value="NMAT">NMAT</option>
              </select>
            </div>

            <div className="form-group">
              <label>Year Label *</label>
              <input
                type="text"
                value={formData.yearLabel}
                onChange={(e) => setFormData({ ...formData, yearLabel: e.target.value })}
                placeholder="e.g., 2024, 2024A, 2024B"
                required
              />
            </div>
          </>
        )}

        {activeTab === 'previousYear' && subTab === 'topicWise' && (
          <>
            <div className="form-group">
              <label>Subject *</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="">Select Subject</option>
                <option value="VARC">VARC</option>
                <option value="LRDI">LRDI</option>
                <option value="Quant">Quant</option>
              </select>
            </div>

            <div className="form-group">
              <label>Topic *</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Algebra, RC, Geometry"
                required
              />
            </div>
          </>
        )}

        {activeTab === 'sessional' && (
          <div className="form-group">
            <label>Session Year *</label>
            <input
              type="text"
              value={formData.sessionYear}
              onChange={(e) => setFormData({ ...formData, sessionYear: e.target.value })}
              placeholder="e.g., 2024, 2025"
              required
            />
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (editingTest ? 'Updating...' : 'Creating...') : (editingTest ? 'Update Test' : 'Create Test')}
        </button>
      </form>
    );
  };

  return (
    <div className="mock-test-management">
      <div className="page-header">
        <h1>Mock Test Management</h1>
        <button onClick={handleCreateSeries} className="btn-secondary">
          Create New Series
        </button>
      </div>

      <div className="series-selector">
        <label>Select Series:</label>
        <select
          value={selectedSeries || ''}
          onChange={(e) => setSelectedSeries(e.target.value)}
        >
          <option value="">-- Select Series --</option>
          {series.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title} ({s.actualTestCount || 0} tests)
            </option>
          ))}
        </select>
      </div>

      <div className="tabs-container">
        <div className="main-tabs">
          <button
            className={activeTab === 'previousYear' ? 'active' : ''}
            onClick={() => setActiveTab('previousYear')}
          >
            Previous Year Papers
          </button>
          <button
            className={activeTab === 'full' ? 'active' : ''}
            onClick={() => setActiveTab('full')}
          >
            Full Tests
          </button>
          <button
            className={activeTab === 'series' ? 'active' : ''}
            onClick={() => setActiveTab('series')}
          >
            Series Tests
          </button>
          <button
            className={activeTab === 'module' ? 'active' : ''}
            onClick={() => setActiveTab('module')}
          >
            Module Tests
          </button>
          <button
            className={activeTab === 'sessional' ? 'active' : ''}
            onClick={() => setActiveTab('sessional')}
          >
            Sessional Tests
          </button>
        </div>

        {activeTab === 'previousYear' && (
          <div className="sub-tabs">
            <button
              className={subTab === 'paperWise' ? 'active' : ''}
              onClick={() => setSubTab('paperWise')}
            >
              Paper Wise
            </button>
            <button
              className={subTab === 'topicWise' ? 'active' : ''}
              onClick={() => setSubTab('topicWise')}
            >
              Topic Wise
            </button>
          </div>
        )}
      </div>

      {/* Render Question Builder if managing questions */}
      {showQuestionBuilder ? (
        <QuestionBuilder
          testPaperId={selectedTest._id}
          onClose={() => {
            setShowQuestionBuilder(false);
            setSelectedTest(null);
            if (selectedSeries) {
              fetchTests(selectedSeries);
            }
          }}
          onQuestionSaved={() => {
            if (selectedSeries) {
              fetchTests(selectedSeries);
            }
          }}
        />
      ) : activeTab === 'previousYear' ? (
        /* Render hierarchy management for Previous Year Papers */
        <div className="management-content">
          {subTab === 'paperWise' ? (
            <PaperWiseManagement selectedSeries={selectedSeries} />
          ) : (
            <TopicWiseManagement selectedSeries={selectedSeries} />
          )}
        </div>
      ) : (
        /* Render test creation form for other test types */
        <div className="content-area">
          <div className="form-section">
            <h2>{editingTest ? 'Edit Test' : 'Create New Test'}</h2>
            {renderForm()}
          </div>

          <div className="tests-list-section">
            <h2>Existing Tests</h2>
            {loading ? (
              <p>Loading...</p>
            ) : tests.length === 0 ? (
              <p>No tests found for this series</p>
            ) : (
              <div className="tests-grid">
                {tests.map((test) => (
                  <div key={test._id} className={`test-card ${editingTest?._id === test._id ? 'editing' : ''}`}>
                    <div className="test-header">
                      <h3>{test.title}</h3>
                      <span className={`test-type ${test.testType}`}>
                        {test.testType}
                      </span>
                    </div>
                    <p>{test.description}</p>
                    <div className="test-meta">
                      <span>⏱️ {test.duration} min</span>
                      <span>📝 {test.totalQuestions} questions</span>
                      <span>🎯 {test.totalMarks} marks</span>
                    </div>
                    {test.exam && <div className="test-exam">Exam: {test.exam}</div>}
                    {test.yearLabel && <div className="test-year">Year: {test.yearLabel}</div>}
                    {test.subject && <div className="test-subject">Subject: {test.subject}</div>}
                    {test.topic && <div className="test-topic">Topic: {test.topic}</div>}
                    <div className="test-actions">
                      <button
                        onClick={() => handleManageQuestions(test)}
                        className="btn-questions"
                      >
                        📚 Manage Questions
                      </button>
                      <button
                        onClick={() => handleEditTest(test)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTestManagement;
