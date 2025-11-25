import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './MockTestAttempt.css';

const MockTestAttempt = () => {
  const { testId, attemptId } = useParams();
  const navigate = useNavigate();
  
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
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
  };
  
  const [testData, setTestData] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  
  const [sectionStates, setSectionStates] = useState([]);
  const [isResuming, setIsResuming] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [showSectionLockedModal, setShowSectionLockedModal] = useState(false);
  const [lockedSectionInfo, setLockedSectionInfo] = useState(null);
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [showScratchPad, setShowScratchPad] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('0');
  const [scratchPadContent, setScratchPadContent] = useState('');
  const [drawingMode, setDrawingMode] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [showSectionResult, setShowSectionResult] = useState(false);
  const [currentSectionResult, setCurrentSectionResult] = useState(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  
  const timerRef = useRef(null);
  const syncIntervalRef = useRef(null);
  const currentAttemptIdRef = useRef(attemptId);

  useEffect(() => {
    currentAttemptIdRef.current = attemptId;
  }, [attemptId]);

  useEffect(() => {
    fetchTestData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (sectionStates.length > 0 && testData && !showFinalResult) {
      timerRef.current = setInterval(() => {
        setSectionStates(prevStates => {
          const currentSectionState = prevStates[currentSection];
          
          if (!currentSectionState) return prevStates;
          
          if (currentSectionState.isLocked || currentSectionState.isCompleted) {
            return prevStates;
          }
          
          if (currentSectionState.remainingSeconds <= 1) {
            const newStates = prevStates.map((state, idx) => 
              idx === currentSection 
                ? { ...state, remainingSeconds: 0, isCompleted: true, completedAt: new Date().toISOString() }
                : { ...state }
            );
            
            setTimeout(() => handleSectionTimeUp(), 0);
            return newStates;
          }
          
          const newStates = prevStates.map((state, idx) => 
            idx === currentSection 
              ? { ...state, remainingSeconds: state.remainingSeconds - 1 }
              : { ...state }
          );
          return newStates;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sectionStates.length, currentSection, testData, showFinalResult]);

  useEffect(() => {
    if (currentAttemptIdRef.current && testData && !showFinalResult) {
      syncIntervalRef.current = setInterval(() => {
        syncProgress();
      }, 5000);
    }
    
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [testData, currentSection, currentQuestion, responses, sectionStates, showFinalResult]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      syncProgress();
      e.preventDefault();
      e.returnValue = 'Your test progress will be saved. Are you sure you want to leave?';
      return e.returnValue;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [responses, sectionStates]);

  const syncProgress = useCallback(async () => {
    if (!currentAttemptIdRef.current || showFinalResult) return;
    
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;
      
      const currentQuestionData = testData?.sections?.[currentSection]?.questions?.[currentQuestion];
      
      // Build responses with proper markedForReview state
      // We need to map question indices to question IDs to check markedForReview
      const responsesWithReviewState = Object.entries(responses).map(([questionId, selectedAnswer]) => {
        // Find which question index this questionId corresponds to
        let isMarked = false;
        if (testData?.sections) {
          testData.sections.forEach((section, sectionIdx) => {
            if (section.questions) {
              section.questions.forEach((q, qIdx) => {
                if (q._id === questionId && sectionIdx === currentSection && markedForReview.has(qIdx)) {
                  isMarked = true;
                }
              });
            }
          });
        }
        return {
          questionId,
          selectedAnswer,
          isAnswered: !!selectedAnswer,
          isMarkedForReview: isMarked
        };
      });
      
      const syncData = {
        currentSectionKey: testData?.sections?.[currentSection]?.name,
        currentSectionIndex: currentSection,
        currentQuestionIndex: currentQuestion,
        currentQuestionId: currentQuestionData?._id,
        sectionStates: sectionStates,
        responses: responsesWithReviewState
      };
      
      const response = await fetch(`/api/mock-tests/attempt/${currentAttemptIdRef.current}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(syncData)
      });
      
      if (response.ok) {
        const syncResult = await response.json();
        setLastSyncTime(new Date());
        setSyncError(null);
        
        // CRITICAL: Merge server-validated section states to prevent time manipulation
        // Server is the source of truth for remaining time and locked status
        if (syncResult.sectionStates && Array.isArray(syncResult.sectionStates)) {
          setSectionStates(prevStates => {
            return syncResult.sectionStates.map((serverState, idx) => {
              // Always use server-validated remaining time and lock status
              return {
                ...serverState,
                remainingSeconds: serverState.remainingSeconds,
                isLocked: serverState.isLocked,
                isCompleted: serverState.isCompleted
              };
            });
          });
        }
      } else {
        console.error('Sync failed:', response.status);
        setSyncError('Failed to save progress');
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
      setSyncError('Connection error - progress may not be saved');
    }
  }, [testData, currentSection, currentQuestion, responses, sectionStates, markedForReview, showFinalResult]);

  const fetchTestData = async () => {
    try {
      setLoadingError(null);
      const authToken = localStorage.getItem('authToken');
      if (!authToken || authToken === 'null') {
        navigate('/Login');
        return;
      }

      if (attemptId) {
        const attemptResponse = await fetch(`/api/mock-tests/attempt/${attemptId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (attemptResponse.ok) {
          const attemptData = await attemptResponse.json();
          if (attemptData.success) {
            setTestData(attemptData.test);
            
            if (attemptData.attempt?.sectionStates?.length > 0) {
              setSectionStates(attemptData.attempt.sectionStates);
              setIsResuming(true);
              
              if (attemptData.attempt.currentSectionIndex !== undefined) {
                setCurrentSection(attemptData.attempt.currentSectionIndex);
              }
              if (attemptData.attempt.currentQuestionIndex !== undefined) {
                setCurrentQuestion(attemptData.attempt.currentQuestionIndex);
              }
            } else {
              initializeSectionStates(attemptData.test);
            }
            
            if (attemptData.responses) {
              const responsesObj = {};
              if (Array.isArray(attemptData.responses)) {
                attemptData.responses.forEach(r => {
                  if (r.questionId && r.selectedAnswer) {
                    responsesObj[r.questionId] = r.selectedAnswer;
                  }
                });
              } else {
                Object.assign(responsesObj, attemptData.responses);
              }
              setResponses(responsesObj);
            }
            
            setLoading(false);
            return;
          }
        }
      }

      const response = await fetch(`/api/mock-tests/test/${testId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTestData(data.test);
        
        if (data.attempt?.sectionStates?.length > 0) {
          setSectionStates(data.attempt.sectionStates);
        } else {
          initializeSectionStates(data.test);
        }

        if (data.resuming && data.attempt) {
          setIsResuming(true);
          currentAttemptIdRef.current = data.attempt._id;
          navigate(`/student/mock-test/${testId}/attempt/${data.attempt._id}`, { replace: true });
          
          if (data.attempt.currentSectionIndex !== undefined) {
            setCurrentSection(data.attempt.currentSectionIndex);
          }
          if (data.attempt.currentQuestionIndex !== undefined) {
            setCurrentQuestion(data.attempt.currentQuestionIndex);
          }
        } else if (data.attempt) {
          currentAttemptIdRef.current = data.attempt._id;
          navigate(`/student/mock-test/${testId}/attempt/${data.attempt._id}`, { replace: true });
        }
      } else {
        setLoadingError(data.message || 'Failed to start test');
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
      setLoadingError(error.message || 'Failed to load test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeSectionStates = (test) => {
    if (!test?.sections) return;
    
    const states = test.sections.map((section, index) => ({
      sectionKey: section.name,
      startedAt: index === 0 ? new Date().toISOString() : null,
      remainingSeconds: section.duration * 60,
      isLocked: false,
      isCompleted: false,
      completedAt: null
    }));
    
    setSectionStates(states);
  };

  const handleSectionTimeUp = async () => {
    const sectionName = testData?.sections?.[currentSection]?.name || 'Current section';
    
    // IMMEDIATELY notify server to lock this section (prevents manipulation by pausing JS)
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken && currentAttemptIdRef.current) {
        await fetch(`/api/mock-tests/attempt/${currentAttemptIdRef.current}/transition`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fromSection: sectionName,
            toSection: testData?.sections?.[currentSection + 1]?.name || null
          })
        });
      }
    } catch (error) {
      console.error('Error locking section on server:', error);
    }
    
    setLockedSectionInfo({
      sectionName,
      message: `Time's up for ${sectionName}! Moving to the next section.`
    });
    setShowSectionLockedModal(true);
  };

  const handleSectionLockedContinue = async () => {
    setShowSectionLockedModal(false);
    setLockedSectionInfo(null);
    
    if (currentSection < testData.sections.length - 1) {
      const sectionResult = calculateSectionResult(currentSection);
      setCompletedSections(prev => [...prev, sectionResult]);
      
      try {
        const authToken = localStorage.getItem('authToken');
        await fetch(`/api/mock-tests/attempt/${currentAttemptIdRef.current}/transition-section`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fromSection: testData.sections[currentSection].name,
            toSection: testData.sections[currentSection + 1].name
          })
        });
      } catch (error) {
        console.error('Error transitioning section:', error);
      }
      
      setSectionStates(prevStates => 
        prevStates.map((state, idx) => 
          idx === currentSection + 1 
            ? { ...state, startedAt: new Date().toISOString() }
            : { ...state }
        )
      );
      
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
      setVisitedQuestions(new Set([0]));
    } else {
      handleSubmitTest();
    }
  };

  const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return '00:00:00';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSectionTime = () => {
    return sectionStates[currentSection]?.remainingSeconds || 0;
  };

  const getTotalTimeRemaining = () => {
    return sectionStates.reduce((total, state) => {
      if (!state.isCompleted) {
        return total + (state.remainingSeconds || 0);
      }
      return total;
    }, 0);
  };

  const isSectionLocked = (sectionIndex) => {
    const state = sectionStates[sectionIndex];
    if (!state) return false;
    return state.isLocked || state.isCompleted || (state.remainingSeconds <= 0);
  };

  const canNavigateToSection = (sectionIndex) => {
    if (sectionIndex === currentSection) return true;
    
    if (sectionIndex < currentSection) {
      return !isSectionLocked(sectionIndex);
    }
    
    return false;
  };

  const handleQuestionSelect = (questionIndex) => {
    setCurrentQuestion(questionIndex);
    setVisitedQuestions(prev => new Set([...prev, questionIndex]));
  };

  const handleAnswerSelect = (answer) => {
    const questionId = getCurrentQuestion()?._id;
    if (questionId) {
      setResponses(prev => ({
        ...prev,
        [questionId]: answer
      }));
      
      saveResponse(questionId, answer);
    }
  };

  const saveResponse = async (questionId, selectedAnswer) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await fetch(`/api/mock-tests/attempt/${currentAttemptIdRef.current}/response`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId,
          selectedAnswer,
          isMarkedForReview: markedForReview.has(currentQuestion)
        })
      });
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const handleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const handleClearResponse = () => {
    const questionId = getCurrentQuestion()?._id;
    if (questionId) {
      setResponses(prev => {
        const newResponses = { ...prev };
        delete newResponses[questionId];
        return newResponses;
      });
      saveResponse(questionId, null);
    }
  };

  const handleNextQuestion = () => {
    const totalQuestions = testData?.sections[currentSection]?.questions?.length || 0;
    if (currentQuestion < totalQuestions - 1) {
      handleQuestionSelect(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      handleQuestionSelect(currentQuestion - 1);
    }
  };

  const calculateSectionResult = (sectionIndex) => {
    const section = testData.sections[sectionIndex];
    const sectionQuestions = section.questions || [];

    let answered = 0;
    let markedCount = 0;
    let visited = visitedQuestions.size;

    sectionQuestions.forEach((question, localIndex) => {
      const questionId = question?._id || question;
      const response = responses[questionId];

      if (markedForReview.has(localIndex)) {
        markedCount++;
      }

      if (response && response.trim && response.trim() !== '') {
        answered++;
      } else if (response) {
        answered++;
      }
    });

    const notAnswered = sectionQuestions.length - answered;
    const notVisited = Math.max(0, sectionQuestions.length - visited);

    return {
      sectionName: section.name,
      totalQuestions: sectionQuestions.length,
      answered,
      notAnswered,
      markedForReview: markedCount,
      visited: Math.min(visited, sectionQuestions.length),
      notVisited,
      correct: 0,
      incorrect: 0,
      score: answered * 3,
      maxScore: sectionQuestions.length * 3
    };
  };

  const handleNextSection = async () => {
    const sectionResult = calculateSectionResult(currentSection);
    setCurrentSectionResult(sectionResult);
    setCompletedSections(prev => [...prev, sectionResult]);
    
    setSectionStates(prevStates => 
      prevStates.map((state, idx) => 
        idx === currentSection 
          ? { ...state, isCompleted: true, completedAt: new Date().toISOString() }
          : { ...state }
      )
    );

    setShowSectionResult(true);
  };

  const proceedToNextSection = async () => {
    setShowSectionResult(false);
    setCurrentSectionResult(null);

    if (currentSection < testData?.sections?.length - 1) {
      try {
        const authToken = localStorage.getItem('authToken');
        await fetch(`/api/mock-tests/attempt/${currentAttemptIdRef.current}/transition-section`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fromSection: testData.sections[currentSection].name,
            toSection: testData.sections[currentSection + 1].name
          })
        });
      } catch (error) {
        console.error('Error transitioning section:', error);
      }
      
      setSectionStates(prevStates => 
        prevStates.map((state, idx) => 
          idx === currentSection + 1 
            ? { ...state, startedAt: new Date().toISOString() }
            : { ...state }
        )
      );
      
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
      setVisitedQuestions(new Set([0]));
    } else {
      handleSubmitTest();
    }
  };

  const handleSubmitTest = async () => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      
      await syncProgress();

      if (currentSectionResult === null || currentSectionResult.sectionName !== testData.sections[currentSection].name) {
        const sectionResult = calculateSectionResult(currentSection);
        setCompletedSections(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(s => s.sectionName === sectionResult.sectionName);
          if (existingIndex >= 0) {
            updated[existingIndex] = sectionResult;
          } else {
            updated.push(sectionResult);
          }
          return updated;
        });
      }

      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`/api/mock-tests/attempt/${currentAttemptIdRef.current}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Use detailed results from backend if available
        if (data.results) {
          setFinalResult({
            sections: data.results.sections,
            totalScore: data.results.totalScore,
            totalQuestions: data.results.totalQuestions,
            totalAnswered: data.results.totalAnswered,
            totalCorrect: data.results.totalCorrect,
            totalIncorrect: data.results.totalIncorrect,
            totalNotAnswered: data.results.totalNotAnswered,
            positiveMarks: data.results.positiveMarks,
            negativeMarks: data.results.negativeMarks,
            percentage: parseFloat(data.results.percentage),
            attemptId: data.attemptId
          });
        } else {
          // Fallback to client-side calculation
          const allSections = [...completedSections];
          if (!allSections.find(s => s.sectionName === testData.sections[currentSection].name)) {
            allSections.push(calculateSectionResult(currentSection));
          }

          const combinedResult = {
            sections: allSections,
            totalScore: allSections.reduce((sum, section) => sum + section.score, 0),
            maxTotalScore: allSections.reduce((sum, section) => sum + section.maxScore, 0),
            totalAnswered: allSections.reduce((sum, section) => sum + section.answered, 0),
            totalQuestions: allSections.reduce((sum, section) => sum + section.totalQuestions, 0),
            percentage: 0,
            backendScore: data.score
          };
          combinedResult.percentage = (combinedResult.totalScore / combinedResult.maxTotalScore) * 100;
          setFinalResult(combinedResult);
        }
        setShowFinalResult(true);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const getCurrentQuestion = () => {
    if (!testData?.sections?.[currentSection]?.questions) {
      return null;
    }
    return testData.sections[currentSection].questions[currentQuestion];
  };

  const getQuestionStatus = (questionIndex) => {
    const question = testData?.sections[currentSection]?.questions[questionIndex];
    const questionId = question?._id;
    const isAnswered = questionId && responses[questionId];
    const isMarked = markedForReview.has(questionIndex);
    const isVisited = visitedQuestions.has(questionIndex);

    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    if (isVisited) return 'visited';
    return 'not-visited';
  };

  const startDrawing = (e) => {
    if (!drawingMode) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing || !drawingMode) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!drawingMode) return;
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleCalculatorInput = (value) => {
    if (value === 'C') {
      setCalculatorValue('0');
    } else if (value === '=') {
      try {
        const result = eval(calculatorValue.replace(/×/g, '*').replace(/÷/g, '/'));
        setCalculatorValue(result.toString());
      } catch {
        setCalculatorValue('Error');
      }
    } else if (value === '⌫') {
      setCalculatorValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setCalculatorValue(prev => prev === '0' ? value : prev + value);
    }
  };

  if (loading) {
    return (
      <div className="cat-exam-loading">
        <div className="loading-spinner"></div>
        <p>Loading your test...</p>
        {isResuming && <p className="resume-notice">Resuming your previous session...</p>}
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="cat-exam-error">
        <h3>Unable to Load Test</h3>
        <p>{loadingError}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button onClick={() => navigate('/student/mock-tests')}>
            Back to Mock Tests
          </button>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="cat-exam-error">
        <h3>Test not found</h3>
        <button onClick={() => navigate('/student/mock-tests')}>
          Back to Mock Tests
        </button>
      </div>
    );
  }

  const currentQuestionData = getCurrentQuestion();
  const totalQuestions = testData?.sections[currentSection]?.questions?.length || 0;
  const currentSectionTimeRemaining = getCurrentSectionTime();
  const isCurrentSectionLocked = isSectionLocked(currentSection);

  return (
    <div className="cat-exam-interface">
      <div className="cat-exam-header">
        <div className="exam-header-left">
          <div className="cat-logos">
            <span className="logo-item">CAT</span>
            <span className="logo-item">2024</span>
            <span className="logo-separator">|</span>
            <span className="logo-item">IIM</span>
            <span className="logo-item">AHMEDABAD</span>
            <span className="logo-item">BANGALORE</span>
            <span className="logo-item">CALCUTTA</span>
            <span className="logo-item">KOZHIKODE</span>
            <span className="logo-item">LUCKNOW</span>
            <span className="logo-item">INDORE</span>
            <span className="logo-item">TATHAGAT</span>
          </div>
        </div>
        <div className="exam-header-right">
          <div className="sync-status">
            {lastSyncTime && (
              <span className="sync-indicator success" title={`Last saved: ${lastSyncTime.toLocaleTimeString()}`}>
                Saved
              </span>
            )}
            {syncError && (
              <span className="sync-indicator error" title={syncError}>
                Not saved
              </span>
            )}
          </div>
          <div className="candidate-info">
            <div className="candidate-avatar">
              <span>👤</span>
            </div>
            <div className="candidate-details">
              <span className="candidate-name">Student</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cat-exam-content">
        <div className="cat-question-panel">
          <div className="question-header">
            <div className="section-info">
              <h3>Section {currentSection + 1}: {testData.sections[currentSection].name}</h3>
              <span>Question No. {currentQuestion + 1}</span>
              {isCurrentSectionLocked && (
                <span className="section-locked-badge">Section Completed</span>
              )}
            </div>
            <div className="question-navigation">
              <button 
                className="nav-btn"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0 || isCurrentSectionLocked}
              >
                Previous
              </button>
              <button 
                className="nav-btn"
                onClick={handleNextQuestion}
                disabled={currentQuestion === totalQuestions - 1 || isCurrentSectionLocked}
              >
                Next
              </button>
            </div>
          </div>

          <div className="question-content">
            <div className="question-text">
              {currentQuestionData?.questionText ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentQuestionData.questionText) }} />
              ) : (
                <p>Loading question...</p>
              )}
            </div>

            {currentQuestionData?.images?.map((image, index) => (
              <img key={index} src={image} alt={`Question ${index + 1}`} className="question-image" />
            ))}

            <div className="question-options">
              {currentQuestionData?.options ? (
                (() => {
                  if (typeof currentQuestionData.options === 'object' && !Array.isArray(currentQuestionData.options)) {
                    return ['A', 'B', 'C', 'D'].map((optionKey) => {
                      const optionText = currentQuestionData.options[optionKey];
                      if (!optionText) return null;
                      
                      const questionId = currentQuestionData._id;
                      const isSelected = responses[questionId] === optionKey;

                      return (
                        <label key={optionKey} className={`option-label ${isSelected ? 'selected' : ''} ${isCurrentSectionLocked ? 'disabled' : ''}`}>
                          <input
                            type="radio"
                            name={`question-${questionId}`}
                            value={optionKey}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(optionKey)}
                            disabled={isCurrentSectionLocked}
                          />
                          <span className="option-indicator">{optionKey}</span>
                          <span className="option-text">
                            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(optionText) }} />
                          </span>
                        </label>
                      );
                    }).filter(Boolean);
                  }
                  
                  if (Array.isArray(currentQuestionData.options)) {
                    return currentQuestionData.options.map((option, index) => {
                      const questionId = currentQuestionData._id;
                      
                      if (typeof option === 'object' && option.label && option.value !== undefined) {
                        const optionLabel = option.label;
                        const optionText = option.value;
                        const isSelected = responses[questionId] === optionLabel;

                        return (
                          <label key={index} className={`option-label ${isSelected ? 'selected' : ''} ${isCurrentSectionLocked ? 'disabled' : ''}`}>
                            <input
                              type="radio"
                              name={`question-${questionId}`}
                              value={optionLabel}
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(optionLabel)}
                              disabled={isCurrentSectionLocked}
                            />
                            <span className="option-indicator">{optionLabel}</span>
                            <span className="option-text">
                              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(optionText) }} />
                            </span>
                          </label>
                        );
                      }
                      
                      const optionLabel = String.fromCharCode(65 + index);
                      const optionText = typeof option === 'object' ? (option.optionText || option.value || '') : option;
                      const isSelected = responses[questionId] === optionLabel || responses[questionId] === optionText;

                      return (
                        <label key={index} className={`option-label ${isSelected ? 'selected' : ''} ${isCurrentSectionLocked ? 'disabled' : ''}`}>
                          <input
                            type="radio"
                            name={`question-${questionId}`}
                            value={optionLabel}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(optionLabel)}
                            disabled={isCurrentSectionLocked}
                          />
                          <span className="option-indicator">{optionLabel}</span>
                          <span className="option-text">
                            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(optionText) }} />
                          </span>
                          {typeof option === 'object' && option.optionImage && (
                            <img src={option.optionImage} alt="option" className="option-image" />
                          )}
                        </label>
                      );
                    });
                  }
                  
                  return <p>No options available</p>;
                })()
              ) : (
                <p>Loading options...</p>
              )}
            </div>
          </div>

          <div className="question-actions">
            <button 
              className="action-btn secondary" 
              onClick={handleClearResponse}
              disabled={isCurrentSectionLocked}
            >
              Clear Response
            </button>
            <button 
              className={`action-btn ${markedForReview.has(currentQuestion) ? 'marked' : 'secondary'}`}
              onClick={handleMarkForReview}
              disabled={isCurrentSectionLocked}
            >
              {markedForReview.has(currentQuestion) ? 'Unmark for Review' : 'Mark for Review & Next'}
            </button>
            <button 
              className="action-btn primary" 
              onClick={handleNextQuestion}
              disabled={isCurrentSectionLocked}
            >
              Save & Next
            </button>
          </div>
        </div>

        <div className="cat-sidebar-panel">
          <div className="timer-section">
            <div className="timer-item">
              <span className="timer-label">Total Time Left</span>
              <span className="timer-value">{formatTime(getTotalTimeRemaining())}</span>
            </div>
            <div className={`timer-item section-timer ${currentSectionTimeRemaining < 300 ? 'warning' : ''} ${currentSectionTimeRemaining < 60 ? 'critical' : ''}`}>
              <span className="timer-label">Section Time</span>
              <span className="timer-value">{formatTime(currentSectionTimeRemaining)}</span>
            </div>
          </div>

          {currentSectionTimeRemaining < 300 && currentSectionTimeRemaining > 0 && (
            <div className="time-warning-banner">
              {currentSectionTimeRemaining < 60 
                ? 'Less than 1 minute remaining in this section!' 
                : `${Math.ceil(currentSectionTimeRemaining / 60)} minutes remaining in this section`}
            </div>
          )}

          <div className="tools-section">
            <button 
              className="tool-btn"
              onClick={() => setShowInstructions(true)}
            >
              Instructions
            </button>
            <button 
              className="tool-btn"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              Calculator
            </button>
            <button 
              className="tool-btn"
              onClick={() => setShowScratchPad(!showScratchPad)}
            >
              Scratch Pad
            </button>
          </div>

          <div className="status-legend">
            <h4>Question Status</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="status-indicator answered"></span>
                <span>Answered</span>
              </div>
              <div className="legend-item">
                <span className="status-indicator not-answered"></span>
                <span>Not Answered</span>
              </div>
              <div className="legend-item">
                <span className="status-indicator marked"></span>
                <span>Marked for Review</span>
              </div>
              <div className="legend-item">
                <span className="status-indicator answered-marked"></span>
                <span>Answered & Marked</span>
              </div>
              <div className="legend-item">
                <span className="status-indicator visited"></span>
                <span>Not Visited</span>
              </div>
            </div>
          </div>

          <div className="question-palette">
            <h4>Choose a Question</h4>
            <div className="palette-grid">
              {testData.sections[currentSection]?.questions?.length > 0 ? (
                testData.sections[currentSection].questions.map((_, index) => (
                  <button
                    key={index}
                    className={`palette-btn ${getQuestionStatus(index)} ${currentQuestion === index ? 'current' : ''}`}
                    onClick={() => handleQuestionSelect(index)}
                    disabled={isCurrentSectionLocked}
                  >
                    {index + 1}
                  </button>
                ))
              ) : (
                <p>No questions available for this section</p>
              )}
            </div>
          </div>

          <div className="section-navigation">
            <div className="section-tabs">
              {testData.sections.map((section, index) => {
                const isLocked = isSectionLocked(index);
                const canNavigate = canNavigateToSection(index);
                
                return (
                  <button
                    key={index}
                    className={`section-tab ${currentSection === index ? 'active' : ''} ${isLocked ? 'locked' : ''} ${!canNavigate ? 'disabled' : ''}`}
                    onClick={() => {
                      if (canNavigate && !isLocked) {
                        setCurrentSection(index);
                        setCurrentQuestion(0);
                        setVisitedQuestions(new Set([0]));
                      }
                    }}
                    disabled={!canNavigate || (isLocked && index !== currentSection)}
                    title={isLocked ? 'Section completed' : (index > currentSection ? 'Complete current section first' : section.name)}
                  >
                    {section.name}
                    {isLocked && <span className="lock-icon">Completed</span>}
                  </button>
                );
              })}
            </div>
            
            <div className="section-actions">
              {currentSection < testData.sections.length - 1 ? (
                <button 
                  className="section-btn primary" 
                  onClick={handleNextSection}
                  disabled={isCurrentSectionLocked}
                >
                  Submit Section & Continue
                </button>
              ) : (
                <button className="section-btn danger" onClick={handleSubmitTest}>
                  Submit Test
                </button>
              )}
            </div>
            
            <div className="section-guidance">
              <p>
                {currentSection < testData.sections.length - 1 
                  ? 'You can submit this section early or wait for the timer to complete.'
                  : 'This is the final section. Submit when ready.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showCalculator && (
        <div className="modal-overlay">
          <div className="calculator-modal">
            <div className="calculator-header">
              <h4>Calculator</h4>
              <button onClick={() => setShowCalculator(false)}>×</button>
            </div>
            <div className="calculator-display">
              {calculatorValue}
            </div>
            <div className="calculator-buttons">
              {[
                ['C', '⌫', '÷', '×'],
                ['7', '8', '9', '-'],
                ['4', '5', '6', '+'],
                ['1', '2', '3', '='],
                ['0', '.', '', '']
              ].map((row, rowIndex) => (
                <div key={rowIndex} className="calculator-row">
                  {row.map((btn, btnIndex) => (
                    btn && (
                      <button
                        key={btnIndex}
                        className={`calc-btn ${btn === '=' ? 'equals' : ''} ${['C', '⌫'].includes(btn) ? 'function' : ''}`}
                        onClick={() => handleCalculatorInput(btn)}
                      >
                        {btn}
                      </button>
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showScratchPad && (
        <div className="modal-overlay">
          <div className="scratchpad-modal">
            <div className="scratchpad-header">
              <h4>Scratch Pad</h4>
              <div className="scratchpad-controls">
                <button
                  className={`mode-btn ${!drawingMode ? 'active' : ''}`}
                  onClick={() => setDrawingMode(false)}
                >
                  Text
                </button>
                <button
                  className={`mode-btn ${drawingMode ? 'active' : ''}`}
                  onClick={() => setDrawingMode(true)}
                >
                  Draw
                </button>
              </div>
              <button onClick={() => setShowScratchPad(false)}>×</button>
            </div>

            {drawingMode ? (
              <canvas
                ref={canvasRef}
                className="scratchpad-canvas"
                width={460}
                height={300}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            ) : (
              <textarea
                className="scratchpad-textarea"
                value={scratchPadContent}
                onChange={(e) => setScratchPadContent(e.target.value)}
                placeholder="Use this space for your rough work..."
              />
            )}

            <div className="scratchpad-actions">
              {drawingMode ? (
                <button onClick={clearCanvas}>Clear Drawing</button>
              ) : (
                <button onClick={() => setScratchPadContent('')}>Clear Text</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="modal-overlay">
          <div className="instructions-modal">
            <div className="instructions-header">
              <h4>Test Instructions</h4>
              <button onClick={() => setShowInstructions(false)}>×</button>
            </div>
            <div className="instructions-content">
              <div className="instruction-section">
                <h5>Section-wise Time Management</h5>
                <ul>
                  <li>Each section has its own time limit that cannot be extended.</li>
                  <li>When section time expires, you will automatically move to the next section.</li>
                  <li>You cannot return to a section once its time has expired.</li>
                  <li>You may submit a section early if you finish before time expires.</li>
                </ul>
              </div>
              <div className="instruction-section">
                <h5>Progress Saving</h5>
                <ul>
                  <li>Your progress is automatically saved every few seconds.</li>
                  <li>If you lose connection, you can resume from where you left off.</li>
                  <li>Look for the "Saved" indicator in the top right corner.</li>
                </ul>
              </div>
              {Array.isArray(testData.instructions) && testData.instructions.length > 0 && (
                <div className="instruction-section">
                  <h5>Additional Instructions</h5>
                  {testData.instructions.map((instruction, index) => (
                    <p key={index}>
                      {typeof instruction === 'object' ? JSON.stringify(instruction) : String(instruction)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSectionLockedModal && lockedSectionInfo && (
        <div className="modal-overlay">
          <div className="section-locked-modal">
            <div className="section-locked-header">
              <h3>Section Time Complete</h3>
            </div>
            <div className="section-locked-content">
              <div className="time-up-icon">⏰</div>
              <p>{lockedSectionInfo.message}</p>
              <p className="section-locked-note">
                Your answers for this section have been saved. You cannot return to this section.
              </p>
            </div>
            <div className="section-locked-actions">
              <button className="section-btn primary" onClick={handleSectionLockedContinue}>
                {currentSection < testData.sections.length - 1 ? 'Continue to Next Section' : 'View Results'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSectionResult && currentSectionResult && (
        <div className="modal-overlay">
          <div className="section-result-modal">
            <div className="section-result-header">
              <h3>Section Complete - {currentSectionResult.sectionName}</h3>
            </div>
            <div className="section-result-content">
              <div className="result-summary">
                <div className="result-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Questions:</span>
                    <span className="stat-value">{currentSectionResult.totalQuestions}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Answered:</span>
                    <span className="stat-value answered">{currentSectionResult.answered}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Not Answered:</span>
                    <span className="stat-value not-answered">{currentSectionResult.notAnswered}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Marked for Review:</span>
                    <span className="stat-value marked">{currentSectionResult.markedForReview}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Not Visited:</span>
                    <span className="stat-value not-visited">{currentSectionResult.notVisited}</span>
                  </div>
                </div>

                <div className="score-summary">
                  <h4>Section Performance</h4>
                  <div className="score-item">
                    <span>Attempted: {currentSectionResult.answered} questions</span>
                  </div>
                  <div className="score-item">
                    <span>Percentage: {((currentSectionResult.answered / currentSectionResult.totalQuestions) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="section-transition-note">
                <p><strong>Note:</strong> Once you proceed, you cannot return to this section.</p>
              </div>
            </div>
            <div className="section-result-actions">
              {currentSection < testData?.sections?.length - 1 ? (
                <button className="result-btn primary" onClick={proceedToNextSection}>
                  Continue to Next Section
                </button>
              ) : (
                <button className="result-btn primary" onClick={proceedToNextSection}>
                  Continue to Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showFinalResult && finalResult && (
        <div className="modal-overlay">
          <div className="final-result-modal">
            <div className="final-result-header">
              <h3>Test Complete - Final Results</h3>
            </div>
            <div className="final-result-content">
              <div className="overall-summary">
                <div className="overall-stats">
                  <div className="big-stat">
                    <span className="big-stat-label">Overall Score</span>
                    <span className="big-stat-value">{finalResult.totalScore}</span>
                    <span className="big-stat-percentage">
                      {finalResult.positiveMarks && finalResult.negativeMarks !== undefined 
                        ? `+${finalResult.positiveMarks} / -${finalResult.negativeMarks}`
                        : `${finalResult.percentage?.toFixed(1) || 0}%`}
                    </span>
                  </div>
                </div>

                <div className="score-breakdown">
                  <div className="breakdown-item correct">
                    <span className="breakdown-label">Correct</span>
                    <span className="breakdown-value">{finalResult.totalCorrect || 0}</span>
                  </div>
                  <div className="breakdown-item incorrect">
                    <span className="breakdown-label">Incorrect</span>
                    <span className="breakdown-value">{finalResult.totalIncorrect || 0}</span>
                  </div>
                  <div className="breakdown-item unanswered">
                    <span className="breakdown-label">Unanswered</span>
                    <span className="breakdown-value">{finalResult.totalNotAnswered || (finalResult.totalQuestions - finalResult.totalAnswered)}</span>
                  </div>
                </div>

                <div className="section-wise-results">
                  <h4>Section-wise Performance</h4>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Section</th>
                        <th>Questions</th>
                        <th>Correct</th>
                        <th>Incorrect</th>
                        <th>Not Answered</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalResult.sections.map((section, index) => (
                        <tr key={index}>
                          <td className="section-name">{section.sectionName}</td>
                          <td>{section.totalQuestions}</td>
                          <td className="correct">{section.correct || 0}</td>
                          <td className="incorrect">{section.incorrect || 0}</td>
                          <td className="not-answered">{section.notAnswered || 0}</td>
                          <td className="score">{section.score || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="final-result-actions">
              <button 
                className="result-btn secondary" 
                onClick={() => navigate(`/student/mock-test/review/${finalResult.attemptId || currentAttemptIdRef.current}`)}
              >
                View Detailed Review
              </button>
              <button className="result-btn primary" onClick={() => navigate('/student/mock-tests')}>
                Back to Mock Tests
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTestAttempt;
