import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../../../utils/api';
import QuestionBuilder from './QuestionBuilder';
import './TestPaperCreator.css';

const TestPaperCreator = ({ 
  testType, 
  selectedSeries,
  selectedCategory,
  selectedYear,
  selectedSlot,
  selectedTopicCategory,
  selectedTopicGroup
}) => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 180,
    totalQuestions: 0,
    sections: [
      { name: 'VARC', duration: 60, totalQuestions: 0, totalMarks: 0 },
      { name: 'DILR', duration: 60, totalQuestions: 0, totalMarks: 0 },
      { name: 'QA', duration: 60, totalQuestions: 0, totalMarks: 0 }
    ],
    isFree: false,
    price: null,
    difficulty: 'Medium',
    visibility: 'PUBLISHED',
    positiveMarks: 3,
    negativeMarks: -1,
    instructions: {
      general: [
        'Read all instructions carefully before starting the test',
        'Each question carries equal marks unless specified',
        'There is negative marking for incorrect answers',
        'You can navigate between questions using the question palette',
        'Make sure to submit the test before time runs out'
      ],
      sectionSpecific: {}
    }
  });

  useEffect(() => {
    if (selectedSeries) {
      loadTests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeries, testType]);

  const loadTests = async () => {
    try {
      setLoading(true);
      let filter = `seriesId=${selectedSeries}&testType=${testType}`;
      
      // Add hierarchy filters for Previous Year Papers
      if (testType === 'previousYear') {
        if (selectedCategory) filter += `&examCategoryId=${selectedCategory._id}`;
        if (selectedYear) filter += `&examYearId=${selectedYear._id}`;
        if (selectedSlot) filter += `&examSlotId=${selectedSlot._id}`;
        if (selectedTopicCategory) filter += `&topicCategoryId=${selectedTopicCategory._id}`;
        if (selectedTopicGroup) filter += `&topicTestGroupId=${selectedTopicGroup._id}`;
      }

      const data = await fetchWithErrorHandling(`/api/admin/mock-tests/tests?${filter}`);
      if (data && data.success) {
        const testsWithQuestionCount = await Promise.all(
          (data.tests || []).map(async (test) => {
            try {
              const questionData = await fetchWithErrorHandling(`/api/admin/mock-tests/questions?testPaperId=${test._id}`);
              return {
                ...test,
                actualQuestionCount: questionData?.questions?.length || 0
              };
            } catch (error) {
              return {
                ...test,
                actualQuestionCount: 0
              };
            }
          })
        );
        setTests(testsWithQuestionCount);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSeries) {
      alert('Please select a series first');
      return;
    }

    try {
      setLoading(true);

      const testData = {
        ...formData,
        seriesId: selectedSeries,
        testType: testType,
        totalMarks: formData.sections.reduce((sum, sec) => sum + sec.totalMarks, 0)
      };

      // Add hierarchy mapping for Previous Year Papers
      if (testType === 'previousYear') {
        if (selectedCategory) testData.previousYearExamCategoryId = selectedCategory._id;
        if (selectedYear) testData.previousYearExamYearId = selectedYear._id;
        if (selectedSlot) testData.previousYearExamSlotId = selectedSlot._id;
        if (selectedTopicCategory) testData.topicCategoryId = selectedTopicCategory._id;
        if (selectedTopicGroup) testData.topicTestGroupId = selectedTopicGroup._id;
        testData.paperType = selectedCategory ? 'paperWise' : 'topicWise';
      }

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
        loadTests();
        handleCancelEdit();
        setShowTestForm(false);
      }
    } catch (error) {
      alert(`Error ${editingTest ? 'updating' : 'creating'} test: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setFormData({
      title: test.title || '',
      description: test.description || '',
      duration: test.duration || 180,
      totalQuestions: test.totalQuestions || 0,
      sections: test.sections && test.sections.length > 0 ? test.sections : [
        { name: 'VARC', duration: 60, totalQuestions: 0, totalMarks: 0 },
        { name: 'DILR', duration: 60, totalQuestions: 0, totalMarks: 0 },
        { name: 'QA', duration: 60, totalQuestions: 0, totalMarks: 0 }
      ],
      isFree: test.isFree || false,
      price: test.price || null,
      difficulty: test.difficulty || 'Medium',
      visibility: test.visibility || 'PUBLISHED',
      positiveMarks: test.positiveMarks || 3,
      negativeMarks: test.negativeMarks || -1,
      instructions: test.instructions || {
        general: [],
        sectionSpecific: {}
      }
    });
    setShowTestForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTest(null);
    setFormData({
      title: '',
      description: '',
      duration: 180,
      totalQuestions: 0,
      sections: [
        { name: 'VARC', duration: 60, totalQuestions: 0, totalMarks: 0 },
        { name: 'DILR', duration: 60, totalQuestions: 0, totalMarks: 0 },
        { name: 'QA', duration: 60, totalQuestions: 0, totalMarks: 0 }
      ],
      isFree: false,
      price: null,
      difficulty: 'Medium',
      visibility: 'PUBLISHED',
      positiveMarks: 3,
      negativeMarks: -1,
      instructions: {
        general: [],
        sectionSpecific: {}
      }
    });
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test? All questions will also be deleted.')) return;
    
    try {
      const data = await fetchWithErrorHandling(`/api/admin/mock-tests/tests/${testId}`, {
        method: 'DELETE'
      });
      
      if (data && data.success) {
        alert('Test deleted successfully!');
        loadTests();
        if (selectedTest?._id === testId) {
          setSelectedTest(null);
          setShowQuestionBuilder(false);
        }
        if (editingTest && editingTest._id === testId) {
          handleCancelEdit();
        }
      }
    } catch (error) {
      alert('Error deleting test: ' + error.message);
    }
  };

  const handleManageQuestions = (test) => {
    setSelectedTest(test);
    setShowQuestionBuilder(true);
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = field.includes('duration') || field.includes('Questions') || field.includes('Marks')
      ? parseInt(value) || 0
      : value;
    setFormData({ ...formData, sections: newSections });
  };

  const getTestTypeLabel = () => {
    const labels = {
      'previousYear': 'Previous Year Paper',
      'full': 'Full Test',
      'series': 'Series Test',
      'module': 'Module Test',
      'sessional': 'Sessional Test'
    };
    return labels[testType] || 'Test';
  };

  return (
    <div className="test-paper-creator">
      {showQuestionBuilder ? (
        <QuestionBuilder
          testPaperId={selectedTest._id}
          onClose={() => {
            setShowQuestionBuilder(false);
            setSelectedTest(null);
            loadTests();
          }}
          onQuestionSaved={() => loadTests()}
        />
      ) : (
        <>
          <div className="creator-header">
            <div>
              <h3>{getTestTypeLabel()} Management</h3>
              <p className="muted">
                {testType === 'previousYear' && selectedSlot
                  ? `Creating test for: ${selectedCategory?.name} ${selectedYear?.label} - ${selectedSlot?.label}`
                  : testType === 'previousYear' && selectedTopicGroup
                  ? `Creating test for: ${selectedTopicCategory?.name} - ${selectedTopicGroup?.title}`
                  : `Manage ${getTestTypeLabel()}s for the selected series`}
              </p>
            </div>
            <button
              onClick={() => {
                setShowTestForm(!showTestForm);
                if (!showTestForm) handleCancelEdit();
              }}
              className="btn-create-test"
            >
              {showTestForm ? 'Cancel' : `+ Create ${getTestTypeLabel()}`}
            </button>
          </div>

          {showTestForm && (
            <div className="test-form-card">
              <h4>{editingTest ? `Edit ${getTestTypeLabel()}` : `Create New ${getTestTypeLabel()}`}</h4>
              <form onSubmit={handleSubmit} className="test-form">
                <div className="form-group">
                  <label>Test Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder={`e.g., CAT 2024 Mock Test 1`}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Enter test description..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Total Duration (minutes) *</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                      placeholder="e.g., 180"
                    />
                  </div>

                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Free Test?</label>
                    <select
                      value={formData.isFree}
                      onChange={(e) => setFormData({ ...formData, isFree: e.target.value === 'true' })}
                    >
                      <option value="false">No (Paid)</option>
                      <option value="true">Yes (Free)</option>
                    </select>
                  </div>

                  {!formData.isFree && (
                    <div className="form-group">
                      <label>Price (INR) *</label>
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : null })}
                        required={!formData.isFree}
                        placeholder="e.g., 299"
                        min="0"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Visibility</label>
                    <select
                      value={formData.visibility}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Positive Marks per Question</label>
                    <input
                      type="number"
                      value={formData.positiveMarks}
                      onChange={(e) => setFormData({ ...formData, positiveMarks: parseInt(e.target.value) })}
                      placeholder="e.g., 3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Negative Marks per Question</label>
                    <input
                      type="number"
                      value={formData.negativeMarks}
                      onChange={(e) => setFormData({ ...formData, negativeMarks: parseInt(e.target.value) })}
                      placeholder="e.g., -1"
                    />
                  </div>
                </div>

                <div className="sections-config">
                  <h5>Section Configuration</h5>
                  {formData.sections.map((section, index) => (
                    <div key={index} className="section-row">
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
                        placeholder="Section Name"
                      />
                      <input
                        type="number"
                        value={section.duration}
                        onChange={(e) => handleSectionChange(index, 'duration', e.target.value)}
                        placeholder="Duration (min)"
                      />
                      <input
                        type="number"
                        value={section.totalQuestions}
                        onChange={(e) => handleSectionChange(index, 'totalQuestions', e.target.value)}
                        placeholder="Questions"
                      />
                      <input
                        type="number"
                        value={section.totalMarks}
                        onChange={(e) => handleSectionChange(index, 'totalMarks', e.target.value)}
                        placeholder="Total Marks"
                      />
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (editingTest ? 'Updating...' : 'Creating...') : (editingTest ? 'Update Test' : 'Create Test')}
                </button>
              </form>
            </div>
          )}

          <div className="tests-list">
            <h4>Existing Tests ({tests.length})</h4>
            {loading ? (
              <p>Loading tests...</p>
            ) : tests.length === 0 ? (
              <p className="no-tests">No tests created yet. Click the button above to create your first test.</p>
            ) : (
              <div className="tests-grid">
                {tests.map((test) => (
                  <div key={test._id} className="test-card">
                    <div className="test-card-header">
                      <h5>{test.title}</h5>
                      <span className={`status-badge ${test.visibility?.toLowerCase()}`}>
                        {test.visibility || 'Published'}
                      </span>
                    </div>
                    <p className="test-description">{test.description}</p>
                    <div className="test-stats">
                      <span>⏱️ {test.duration} min</span>
                      <span title={`${test.actualQuestionCount || 0} questions added out of ${test.totalQuestions || 0} planned`}>
                        📝 {test.actualQuestionCount || 0}/{test.totalQuestions || 0} questions
                        {(test.actualQuestionCount || 0) >= (test.totalQuestions || 0) && (test.totalQuestions || 0) > 0 && (
                          <span style={{marginLeft: '5px', color: 'green'}}>✓</span>
                        )}
                      </span>
                      <span>🎯 {test.totalMarks || 0} marks</span>
                      <span className={`difficulty-tag ${test.difficulty?.toLowerCase()}`}>
                        {test.difficulty || 'Medium'}
                      </span>
                      {!test.isFree && test.price && (
                        <span style={{fontWeight: 'bold', color: '#4CAF50'}}>₹{test.price}</span>
                      )}
                    </div>
                    {test.isFree && <div className="free-badge">FREE</div>}
                    <div className="test-card-actions">
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
        </>
      )}
    </div>
  );
};

export default TestPaperCreator;
