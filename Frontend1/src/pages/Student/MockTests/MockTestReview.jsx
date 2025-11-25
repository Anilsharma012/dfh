import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './MockTestReview.css';

const MockTestReview = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [filter, setFilter] = useState('all');

  const sanitizeHtml = (html) => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                     'ul', 'ol', 'li', 'img', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 
                     'td', 'span', 'div', 'sup', 'sub', 'strike', 'code', 'pre', 'blockquote',
                     'hr', 'video', 'iframe'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'width', 'height', 'style', 'class',
                     'target', 'rel', 'colspan', 'rowspan', 'align', 'controls', 'frameborder',
                     'allowfullscreen'],
    });
  };

  useEffect(() => {
    fetchReviewData();
  }, [attemptId]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        navigate('/Login');
        return;
      }

      const response = await fetch(`/api/mock-tests/attempt/${attemptId}/review`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch review data: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setReviewData(data);
      } else {
        setError(data.message || 'Failed to load review data');
      }
    } catch (err) {
      console.error('Error fetching review:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredQuestions = () => {
    if (!reviewData?.sections?.[currentSection]?.questions) return [];
    
    const questions = reviewData.sections[currentSection].questions;
    
    switch (filter) {
      case 'correct':
        return questions.filter(q => q.isCorrect);
      case 'incorrect':
        return questions.filter(q => q.isAnswered && !q.isCorrect);
      case 'unanswered':
        return questions.filter(q => !q.isAnswered);
      default:
        return questions;
    }
  };

  const getCurrentQuestionData = () => {
    const filtered = getFilteredQuestions();
    return filtered[currentQuestion] || null;
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestion(index);
    setShowExplanation(false);
  };

  const handleSectionChange = (index) => {
    setCurrentSection(index);
    setCurrentQuestion(0);
    setShowExplanation(false);
  };

  const handlePrevious = () => {
    const filtered = getFilteredQuestions();
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleNext = () => {
    const filtered = getFilteredQuestions();
    if (currentQuestion < filtered.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const getQuestionStatus = (question) => {
    if (question.isCorrect) return 'correct';
    if (question.isAnswered && !question.isCorrect) return 'incorrect';
    return 'unanswered';
  };

  const renderOptions = (question) => {
    if (!question.options) return null;

    if (typeof question.options === 'object' && !Array.isArray(question.options)) {
      return Object.entries(question.options).map(([key, value]) => {
        const isUserAnswer = question.userAnswer === key;
        const isCorrectAnswer = question.correctAnswer === key;
        
        let optionClass = 'review-option';
        if (isCorrectAnswer) optionClass += ' correct-answer';
        if (isUserAnswer && !isCorrectAnswer) optionClass += ' wrong-answer';
        if (isUserAnswer && isCorrectAnswer) optionClass += ' user-correct';

        return (
          <div key={key} className={optionClass}>
            <span className="option-indicator">{key}</span>
            <span className="option-text">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }} />
            </span>
            {isCorrectAnswer && <span className="answer-badge correct">Correct Answer</span>}
            {isUserAnswer && !isCorrectAnswer && <span className="answer-badge wrong">Your Answer</span>}
          </div>
        );
      });
    }

    if (Array.isArray(question.options)) {
      return question.options.map((option, index) => {
        const optionLabel = typeof option === 'object' ? option.label : String.fromCharCode(65 + index);
        const optionText = typeof option === 'object' ? (option.value || option.optionText) : option;
        
        const isUserAnswer = question.userAnswer === optionLabel;
        const isCorrectAnswer = question.correctAnswer === optionLabel;
        
        let optionClass = 'review-option';
        if (isCorrectAnswer) optionClass += ' correct-answer';
        if (isUserAnswer && !isCorrectAnswer) optionClass += ' wrong-answer';
        if (isUserAnswer && isCorrectAnswer) optionClass += ' user-correct';

        return (
          <div key={index} className={optionClass}>
            <span className="option-indicator">{optionLabel}</span>
            <span className="option-text">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(optionText) }} />
            </span>
            {isCorrectAnswer && <span className="answer-badge correct">Correct Answer</span>}
            {isUserAnswer && !isCorrectAnswer && <span className="answer-badge wrong">Your Answer</span>}
          </div>
        );
      });
    }

    return null;
  };

  if (loading) {
    return (
      <div className="review-loading">
        <div className="spinner"></div>
        <p>Loading review...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-error">
        <h3>Error Loading Review</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/student/mock-tests')}>Back to Mock Tests</button>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="review-error">
        <h3>No Review Data</h3>
        <button onClick={() => navigate('/student/mock-tests')}>Back to Mock Tests</button>
      </div>
    );
  }

  const currentQuestionData = getCurrentQuestionData();
  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="mock-test-review">
      <div className="review-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/student/mock-tests')}>
            Back to Mock Tests
          </button>
          <h2>{reviewData.test?.title || 'Test Review'}</h2>
        </div>
        <div className="header-right">
          <div className="summary-stats">
            <span className="stat correct">Correct: {reviewData.summary?.totalCorrect || 0}</span>
            <span className="stat incorrect">Incorrect: {reviewData.summary?.totalIncorrect || 0}</span>
            <span className="stat unanswered">Unanswered: {reviewData.summary?.totalNotAnswered || 0}</span>
            <span className="stat accuracy">Accuracy: {reviewData.summary?.accuracy || 0}%</span>
          </div>
        </div>
      </div>

      <div className="review-content">
        <div className="review-main">
          <div className="section-tabs">
            {reviewData.sections?.map((section, index) => (
              <button
                key={index}
                className={`section-tab ${currentSection === index ? 'active' : ''}`}
                onClick={() => handleSectionChange(index)}
              >
                {section.name}
              </button>
            ))}
          </div>

          <div className="filter-bar">
            <label>Filter: </label>
            <select value={filter} onChange={(e) => { setFilter(e.target.value); setCurrentQuestion(0); }}>
              <option value="all">All Questions</option>
              <option value="correct">Correct Only</option>
              <option value="incorrect">Incorrect Only</option>
              <option value="unanswered">Unanswered Only</option>
            </select>
            <span className="filter-count">Showing {filteredQuestions.length} questions</span>
          </div>

          {currentQuestionData ? (
            <div className="question-review-card">
              <div className="question-header">
                <span className="question-number">Question {currentQuestion + 1} of {filteredQuestions.length}</span>
                <span className={`status-badge ${getQuestionStatus(currentQuestionData)}`}>
                  {currentQuestionData.isCorrect ? 'Correct' : currentQuestionData.isAnswered ? 'Incorrect' : 'Not Answered'}
                </span>
              </div>

              {currentQuestionData.passage && (
                <div className="passage-section">
                  <h4>Passage</h4>
                  <div 
                    className="passage-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentQuestionData.passage) }} 
                  />
                </div>
              )}

              <div className="question-text">
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentQuestionData.questionText) }} />
              </div>

              {currentQuestionData.images?.length > 0 && (
                <div className="question-images">
                  {currentQuestionData.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Question ${idx + 1}`} />
                  ))}
                </div>
              )}

              <div className="options-section">
                {renderOptions(currentQuestionData)}
              </div>

              <div className="answer-summary">
                <div className="answer-row">
                  <strong>Your Answer:</strong> 
                  <span className={currentQuestionData.isCorrect ? 'correct' : 'incorrect'}>
                    {currentQuestionData.userAnswer || 'Not Answered'}
                  </span>
                </div>
                <div className="answer-row">
                  <strong>Correct Answer:</strong> 
                  <span className="correct">{currentQuestionData.correctAnswer}</span>
                </div>
              </div>

              {(currentQuestionData.explanation || currentQuestionData.solution) && (
                <div className="explanation-section">
                  <button 
                    className="toggle-explanation"
                    onClick={() => setShowExplanation(!showExplanation)}
                  >
                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                  
                  {showExplanation && (
                    <div className="explanation-content">
                      {currentQuestionData.explanation && (
                        <div className="explanation-text">
                          <h4>Explanation</h4>
                          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentQuestionData.explanation) }} />
                        </div>
                      )}
                      {currentQuestionData.solution && (
                        <div className="solution-text">
                          <h4>Solution</h4>
                          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentQuestionData.solution) }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="navigation-buttons">
                <button 
                  className="nav-btn prev"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                <button 
                  className="nav-btn next"
                  onClick={handleNext}
                  disabled={currentQuestion === filteredQuestions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="no-questions">
              <p>No questions match the selected filter.</p>
            </div>
          )}
        </div>

        <div className="review-sidebar">
          <h4>Question Navigator</h4>
          <div className="question-grid">
            {filteredQuestions.map((question, index) => (
              <button
                key={index}
                className={`question-btn ${getQuestionStatus(question)} ${currentQuestion === index ? 'current' : ''}`}
                onClick={() => handleQuestionSelect(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="legend">
            <div className="legend-item">
              <span className="legend-color correct"></span>
              <span>Correct</span>
            </div>
            <div className="legend-item">
              <span className="legend-color incorrect"></span>
              <span>Incorrect</span>
            </div>
            <div className="legend-item">
              <span className="legend-color unanswered"></span>
              <span>Not Answered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestReview;
