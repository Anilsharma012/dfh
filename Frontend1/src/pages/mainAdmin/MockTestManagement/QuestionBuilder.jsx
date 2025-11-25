import React, { useState, useEffect, useMemo } from 'react';
import { fetchWithErrorHandling } from '../../../utils/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import './QuestionBuilder.css';

const QuestionBuilder = ({ testPaperId, onClose, onQuestionSaved }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  
  // Sanitize HTML content
  const sanitizeHtml = (html) => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                     'ul', 'ol', 'li', 'img', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 
                     'td', 'span', 'div', 'sup', 'sub', 'strike', 'code', 'pre', 'blockquote'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'width', 'height', 'style', 'class']
    });
  };
  
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'SINGLE_CORRECT_MCQ',
    section: 'VARC',
    options: [
      { label: 'A', value: '' },
      { label: 'B', value: '' },
      { label: 'C', value: '' },
      { label: 'D', value: '' }
    ],
    correctOptionIds: [],
    numericAnswer: '',
    textAnswer: '',
    marks: { positive: 3, negative: -1 },
    difficulty: 'MEDIUM',
    timeSuggestionSeconds: 180,
    topicTag: '',
    subTopicTag: '',
    explanation: '',
    passage: '',
    images: []
  });

  // React-Quill Image Upload Handler (works with any editor instance)
  const imageHandler = function() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    const quillInstance = this.quill;

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();
        if (data.success && data.url) {
          const range = quillInstance.getSelection(true);
          quillInstance.insertEmbed(range.index, 'image', data.url);
          quillInstance.setSelection(range.index + 1);
        } else {
          alert('Image upload failed. Please try again.');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Image upload failed. Please try again.');
      }
    };
  };

  // React-Quill Modules Configuration
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  // React-Quill Formats
  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'script',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  useEffect(() => {
    if (testPaperId) {
      loadQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testPaperId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await fetchWithErrorHandling(`/api/admin/mock-tests/questions?testPaperId=${testPaperId}`);
      if (data && data.success) {
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionTypeChange = (type) => {
    const newFormData = {
      ...formData,
      questionType: type,
      correctOptionIds: [],
      numericAnswer: '',
      textAnswer: ''
    };

    // Adjust options for different question types
    if (type === 'TITA' || type === 'NUMERIC') {
      newFormData.options = [];
    } else if (formData.options.length === 0) {
      newFormData.options = [
        { label: 'A', value: '' },
        { label: 'B', value: '' },
        { label: 'C', value: '' },
        { label: 'D', value: '' }
      ];
    }

    setFormData(newFormData);
  };

  const handleAddOption = () => {
    const labels = ['A', 'B', 'C', 'D', 'E'];
    if (formData.options.length < 5) {
      setFormData({
        ...formData,
        options: [...formData.options, { label: labels[formData.options.length], value: '' }]
      });
    }
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        options: newOptions,
        correctOptionIds: formData.correctOptionIds.filter(id => id !== formData.options[index].label)
      });
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].value = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectOptionToggle = (label) => {
    if (formData.questionType === 'SINGLE_CORRECT_MCQ') {
      setFormData({ ...formData, correctOptionIds: [label] });
    } else if (formData.questionType === 'MULTI_CORRECT_MCQ') {
      const isSelected = formData.correctOptionIds.includes(label);
      setFormData({
        ...formData,
        correctOptionIds: isSelected
          ? formData.correctOptionIds.filter(id => id !== label)
          : [...formData.correctOptionIds, label]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!testPaperId) {
      alert('Test paper ID is required');
      return;
    }

    // Validation
    if (formData.questionType !== 'TITA' && formData.questionType !== 'NUMERIC') {
      if (formData.correctOptionIds.length === 0) {
        alert('Please select at least one correct answer');
        return;
      }
    } else {
      if (formData.questionType === 'NUMERIC' && !formData.numericAnswer) {
        alert('Please enter the numeric answer');
        return;
      }
      if (formData.questionType === 'TITA' && !formData.textAnswer) {
        alert('Please enter the text answer');
        return;
      }
    }

    try {
      setLoading(true);
      
      const questionData = {
        ...formData,
        testPaperId,
        sequenceNumber: editingQuestion ? editingQuestion.sequenceNumber : questions.length + 1
      };

      let data;
      if (editingQuestion) {
        data = await fetchWithErrorHandling(`/api/admin/mock-tests/question/${editingQuestion._id}`, {
          method: 'PUT',
          body: JSON.stringify(questionData)
        });
      } else {
        data = await fetchWithErrorHandling('/api/admin/mock-tests/question', {
          method: 'POST',
          body: JSON.stringify(questionData)
        });
      }

      if (data && data.success) {
        alert(`Question ${editingQuestion ? 'updated' : 'created'} successfully!`);
        loadQuestions();
        handleCancelEdit();
        if (onQuestionSaved) onQuestionSaved();
      }
    } catch (error) {
      alert(`Error ${editingQuestion ? 'updating' : 'creating'} question: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText || '',
      questionType: question.questionType || 'SINGLE_CORRECT_MCQ',
      section: question.section || 'VARC',
      options: question.options && question.options.length > 0 ? question.options : [
        { label: 'A', value: '' },
        { label: 'B', value: '' },
        { label: 'C', value: '' },
        { label: 'D', value: '' }
      ],
      correctOptionIds: question.correctOptionIds || [],
      numericAnswer: question.numericAnswer || '',
      textAnswer: question.textAnswer || '',
      marks: question.marks || { positive: 3, negative: -1 },
      difficulty: question.difficulty || 'MEDIUM',
      timeSuggestionSeconds: question.timeSuggestionSeconds || 180,
      topicTag: question.topicTag || '',
      subTopicTag: question.subTopicTag || '',
      explanation: question.explanation || '',
      passage: question.passage || '',
      images: question.images || []
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setFormData({
      questionText: '',
      questionType: 'SINGLE_CORRECT_MCQ',
      section: 'VARC',
      options: [
        { label: 'A', value: '' },
        { label: 'B', value: '' },
        { label: 'C', value: '' },
        { label: 'D', value: '' }
      ],
      correctOptionIds: [],
      numericAnswer: '',
      textAnswer: '',
      marks: { positive: 3, negative: -1 },
      difficulty: 'MEDIUM',
      timeSuggestionSeconds: 180,
      topicTag: '',
      subTopicTag: '',
      explanation: '',
      passage: '',
      images: []
    });
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const data = await fetchWithErrorHandling(`/api/admin/mock-tests/question/${questionId}`, {
        method: 'DELETE'
      });
      
      if (data && data.success) {
        alert('Question deleted successfully!');
        loadQuestions();
        if (editingQuestion && editingQuestion._id === questionId) {
          handleCancelEdit();
        }
        if (onQuestionSaved) onQuestionSaved();
      }
    } catch (error) {
      alert('Error deleting question: ' + error.message);
    }
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadFile) {
      alert('Please select a CSV file');
      return;
    }

    try {
      setLoading(true);
      const fileContent = await bulkUploadFile.text();
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('CSV file must have at least a header row and one question');
        return;
      }

      // Parse CSV
      const questionsData = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        
        if (fields.length < 3) continue; // Skip invalid lines
        
        const questionText = fields[0]?.replace(/^"|"$/g, '');
        const section = fields[1]?.toUpperCase() || 'GENERAL';
        const questionType = fields[2]?.toUpperCase() || 'SINGLE_CORRECT_MCQ';
        const optionA = fields[3]?.replace(/^"|"$/g, '');
        const optionB = fields[4]?.replace(/^"|"$/g, '');
        const optionC = fields[5]?.replace(/^"|"$/g, '');
        const optionD = fields[6]?.replace(/^"|"$/g, '');
        const correctAnswer = fields[7]?.toUpperCase().replace(/^"|"$/g, '');
        const explanation = fields[8]?.replace(/^"|"$/g, '');
        const difficulty = fields[9]?.toUpperCase() || 'MEDIUM';

        if (!questionText) continue;

        const questionData = {
          questionText,
          section,
          questionType: questionType.includes('SINGLE') ? 'SINGLE_CORRECT_MCQ' : 
                       questionType.includes('MULTI') ? 'MULTI_CORRECT_MCQ' :
                       questionType.includes('NUMERIC') ? 'NUMERIC' : 'TITA',
          difficulty,
          explanation: explanation || '',
          marks: { positive: 3, negative: -1 }
        };

        // Handle MCQ options
        if (questionType.includes('MCQ')) {
          questionData.options = [];
          if (optionA) questionData.options.push({ label: 'A', value: optionA });
          if (optionB) questionData.options.push({ label: 'B', value: optionB });
          if (optionC) questionData.options.push({ label: 'C', value: optionC });
          if (optionD) questionData.options.push({ label: 'D', value: optionD });
          questionData.correctOptionIds = correctAnswer.split(',').map(a => a.trim());
        } else if (questionType.includes('NUMERIC')) {
          questionData.numericAnswer = parseFloat(correctAnswer) || 0;
        } else {
          questionData.textAnswer = correctAnswer;
        }

        questionsData.push(questionData);
      }

      if (questionsData.length === 0) {
        alert('No valid questions found in CSV file');
        return;
      }

      // Upload to backend
      const data = await fetchWithErrorHandling('/api/admin/mock-tests/questions/bulk', {
        method: 'POST',
        body: JSON.stringify({
          testPaperId,
          questions: questionsData
        })
      });

      if (data && data.success) {
        alert(`Successfully uploaded ${data.count} questions!`);
        loadQuestions();
        setBulkUploadFile(null);
        setShowBulkUpload(false);
        if (onQuestionSaved) onQuestionSaved();
      }
    } catch (error) {
      alert('Error uploading questions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSVTemplate = () => {
    const template = `QuestionText,Section,QuestionType,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation,Difficulty
"What is 2+2?",QA,SINGLE_CORRECT_MCQ,3,4,5,6,B,"Basic addition: 2+2 equals 4",EASY
"Which are prime numbers?",QA,MULTI_CORRECT_MCQ,2,3,4,5,"A,B","2 and 3 are prime numbers",MEDIUM
"What is the capital of France?",VARC,TITA,,,,,Paris,"Paris is the capital of France",EASY`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="question-builder">
      <div className="question-builder-header">
        <h2>Question Builder</h2>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <button 
            onClick={() => setShowBulkUpload(!showBulkUpload)} 
            className="btn-bulk-upload"
            style={{
              padding: '8px 16px',
              backgroundColor: showBulkUpload ? '#ff6b6b' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showBulkUpload ? '✕ Close Bulk Upload' : '📤 Bulk Upload CSV'}
          </button>
          {onClose && (
            <button onClick={onClose} className="btn-close">✕</button>
          )}
        </div>
      </div>

      {showBulkUpload && (
        <div className="bulk-upload-section" style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px dashed #4CAF50'
        }}>
          <h3>Bulk Upload Questions from CSV</h3>
          <p style={{color: '#666', marginBottom: '15px'}}>
            Upload multiple questions at once using a CSV file. Download the template to see the required format.
          </p>
          
          <div style={{marginBottom: '15px'}}>
            <button 
              onClick={downloadCSVTemplate}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              📥 Download CSV Template
            </button>
            
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setBulkUploadFile(e.target.files[0])}
              style={{marginLeft: '10px'}}
            />
          </div>
          
          {bulkUploadFile && (
            <div style={{marginTop: '10px'}}>
              <p style={{color: '#333'}}>Selected file: <strong>{bulkUploadFile.name}</strong></p>
              <button 
                onClick={handleBulkUpload}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: loading ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '10px'
                }}
              >
                {loading ? 'Uploading...' : '📤 Upload Questions'}
              </button>
            </div>
          )}
          
          <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px'}}>
            <h4 style={{marginTop: 0}}>CSV Format Instructions:</h4>
            <ul style={{marginBottom: 0, paddingLeft: '20px'}}>
              <li>Column 1: QuestionText (required)</li>
              <li>Column 2: Section (VARC, DILR, QA, or GENERAL)</li>
              <li>Column 3: QuestionType (SINGLE_CORRECT_MCQ, MULTI_CORRECT_MCQ, TITA, NUMERIC)</li>
              <li>Columns 4-7: OptionA, OptionB, OptionC, OptionD (for MCQ questions)</li>
              <li>Column 8: CorrectAnswer (letter like "A" or "A,B" for multi-correct, or text/number for TITA/NUMERIC)</li>
              <li>Column 9: Explanation (optional)</li>
              <li>Column 10: Difficulty (EASY, MEDIUM, or HARD)</li>
            </ul>
          </div>
        </div>
      )}

      <div className="question-builder-content">
        {/* Question Form */}
        <div className="question-form-section">
          <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
          
          <form onSubmit={handleSubmit} className="question-form">
            {editingQuestion && (
              <div className="edit-banner">
                Editing Question #{editingQuestion.sequenceNumber}
                <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                  Cancel
                </button>
              </div>
            )}

            {/* Question Type and Section */}
            <div className="form-row">
              <div className="form-group">
                <label>Question Type *</label>
                <select
                  value={formData.questionType}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  required
                >
                  <option value="SINGLE_CORRECT_MCQ">Single Correct MCQ</option>
                  <option value="MULTI_CORRECT_MCQ">Multiple Correct MCQ</option>
                  <option value="TITA">TITA (Type In The Answer)</option>
                  <option value="NUMERIC">Numeric Answer</option>
                </select>
              </div>

              <div className="form-group">
                <label>Section *</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  required
                >
                  <option value="VARC">VARC</option>
                  <option value="DILR">DILR</option>
                  <option value="QA">QA</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>
            </div>

            {/* Passage (optional) */}
            {formData.section === 'VARC' && (
              <div className="form-group">
                <label>Passage (Optional - for RC questions)</label>
                <ReactQuill
                  theme="snow"
                  value={formData.passage}
                  onChange={(content) => setFormData({ ...formData, passage: content })}
                  modules={quillModules}
                  formats={quillFormats}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
                <small style={{color: "#666", fontSize: "12px"}}>
                  You can add images, formatting, and paragraphs in the passage
                </small>
              </div>
            )}

            {/* Question Text */}
            <div className="form-group">
              <label>Question Text *</label>
              <ReactQuill
                theme="snow"
                value={formData.questionText}
                onChange={(content) => setFormData({ ...formData, questionText: content })}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '300px', marginBottom: '50px' }}
              />
              <small style={{color: "#666", fontSize: "12px"}}>
                You can add images, paragraphs, formatting, and special symbols
              </small>
            </div>

            {/* Options for MCQ */}
            {(formData.questionType === 'SINGLE_CORRECT_MCQ' || formData.questionType === 'MULTI_CORRECT_MCQ') && (
              <div className="options-section">
                <div className="options-header">
                  <label>Options</label>
                  {formData.options.length < 5 && (
                    <button type="button" onClick={handleAddOption} className="btn-add-option">
                      + Add Option
                    </button>
                  )}
                </div>

                {formData.options.map((option, index) => (
                  <div key={index} className="option-row" style={{display: 'block', marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                      <input
                        type={formData.questionType === 'SINGLE_CORRECT_MCQ' ? 'radio' : 'checkbox'}
                        checked={formData.correctOptionIds.includes(option.label)}
                        onChange={() => handleCorrectOptionToggle(option.label)}
                        style={{marginRight: '8px'}}
                      />
                      <span className="option-label" style={{fontWeight: 'bold', marginRight: '10px'}}>{option.label}.</span>
                      {formData.options.length > 2 && (
                        <button type="button" onClick={() => handleRemoveOption(index)} className="btn-remove-option" style={{marginLeft: 'auto'}}>
                          ✕
                        </button>
                      )}
                    </div>
                    <ReactQuill
                      theme="snow"
                      value={option.value}
                      onChange={(content) => handleOptionChange(index, content)}
                      modules={quillModules}
                      formats={quillFormats}
                      style={{ height: '200px', marginBottom: '50px' }}
                    />
                  </div>
                ))}
                <p className="help-text">Select the correct answer(s) by clicking the radio/checkbox</p>
              </div>
            )}

            {/* Numeric Answer */}
            {formData.questionType === 'NUMERIC' && (
              <div className="form-group">
                <label>Numeric Answer *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.numericAnswer}
                  onChange={(e) => setFormData({ ...formData, numericAnswer: parseFloat(e.target.value) })}
                  required
                  placeholder="Enter the numeric answer"
                />
              </div>
            )}

            {/* Text Answer for TITA */}
            {formData.questionType === 'TITA' && (
              <div className="form-group">
                <label>Text Answer *</label>
                <input
                  type="text"
                  value={formData.textAnswer}
                  onChange={(e) => setFormData({ ...formData, textAnswer: e.target.value })}
                  required
                  placeholder="Enter the text answer"
                />
              </div>
            )}

            {/* Marks Configuration */}
            <div className="form-row">
              <div className="form-group">
                <label>Positive Marks *</label>
                <input
                  type="number"
                  value={formData.marks.positive}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    marks: { ...formData.marks, positive: parseInt(e.target.value) }
                  })}
                  required
                  placeholder="e.g., 3"
                />
              </div>

              <div className="form-group">
                <label>Negative Marks *</label>
                <input
                  type="number"
                  value={formData.marks.negative}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    marks: { ...formData.marks, negative: parseInt(e.target.value) }
                  })}
                  required
                  placeholder="e.g., -1"
                />
              </div>

              <div className="form-group">
                <label>Difficulty *</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  required
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Time (seconds)</label>
                <input
                  type="number"
                  value={formData.timeSuggestionSeconds}
                  onChange={(e) => setFormData({ ...formData, timeSuggestionSeconds: parseInt(e.target.value) })}
                  placeholder="e.g., 180"
                />
              </div>
            </div>

            {/* Topic Tags */}
            <div className="form-row">
              <div className="form-group">
                <label>Topic Tag</label>
                <input
                  type="text"
                  value={formData.topicTag}
                  onChange={(e) => setFormData({ ...formData, topicTag: e.target.value })}
                  placeholder="e.g., Arithmetic, RC, LR"
                />
              </div>

              <div className="form-group">
                <label>Sub-Topic Tag</label>
                <input
                  type="text"
                  value={formData.subTopicTag}
                  onChange={(e) => setFormData({ ...formData, subTopicTag: e.target.value })}
                  placeholder="e.g., Percentages, Inference"
                />
              </div>
            </div>

            {/* Explanation */}
            <div className="form-group">
              <label>Explanation / Solution</label>
              <ReactQuill
                theme="snow"
                value={formData.explanation}
                onChange={(content) => setFormData({ ...formData, explanation: content })}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '300px', marginBottom: '50px' }}
              />
              <small style={{color: "#666", fontSize: "12px"}}>
                Add detailed solution with images, formatting, and step-by-step explanations
              </small>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (editingQuestion ? 'Updating...' : 'Creating...') : (editingQuestion ? 'Update Question' : 'Add Question')}
            </button>
          </form>
        </div>

        {/* Questions List */}
        <div className="questions-list-section">
          <h3>Questions ({questions.length})</h3>
          
          {loading ? (
            <p>Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="no-questions">No questions added yet. Add your first question using the form.</p>
          ) : (
            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={question._id} className={`question-card ${editingQuestion?._id === question._id ? 'editing' : ''}`}>
                  <div className="question-card-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className={`question-badge ${question.questionType}`}>
                      {question.questionType}
                    </span>
                    <span className={`difficulty-badge ${question.difficulty}`}>
                      {question.difficulty}
                    </span>
                    <span className="section-badge">{question.section}</span>
                  </div>
                  <div className="question-text">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: sanitizeHtml(
                          question.questionText.length > 120 
                            ? question.questionText.substring(0, 120) + '...'
                            : question.questionText
                        ) 
                      }} 
                    />
                  </div>
                  <div className="question-meta">
                    <span>+{question.marks?.positive || 3} / {question.marks?.negative || -1}</span>
                    <span>{question.timeSuggestionSeconds || 180}s</span>
                    {question.topicTag && <span>📌 {question.topicTag}</span>}
                  </div>
                  <div className="question-actions">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
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
    </div>
  );
};

export default QuestionBuilder;
