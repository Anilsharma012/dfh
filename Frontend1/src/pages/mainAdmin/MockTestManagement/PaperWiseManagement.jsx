import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../../../utils/api';
import TestPaperCreator from './TestPaperCreator';
import './MockTestManagement.css';

const PaperWiseManagement = ({ selectedSeries }) => {
  // Hierarchy data
  const [examCategories, setExamCategories] = useState([]);
  const [examYears, setExamYears] = useState([]);
  const [examSlots, setExamSlots] = useState([]);
  
  // Selected items
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: '', shortCode: '', description: '', color: '#2563eb' });
  const [yearForm, setYearForm] = useState({ label: '', description: '' });
  const [slotForm, setSlotForm] = useState({ label: '', description: '' });
  
  // UI states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showYearForm, setShowYearForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadExamCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadExamYears(selectedCategory._id);
      setSelectedYear(null);
      setSelectedSlot(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedYear) {
      loadExamSlots(selectedYear._id);
      setSelectedSlot(null);
    }
  }, [selectedYear]);

  // Load functions
  const loadExamCategories = async () => {
    try {
      const data = await fetchWithErrorHandling('/api/admin/hierarchy/exam-categories');
      if (data && data.success) {
        setExamCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading exam categories:', error);
    }
  };

  const loadExamYears = async (categoryId) => {
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/exam-years?examCategoryId=${categoryId}`);
      if (data && data.success) {
        setExamYears(data.years || []);
      }
    } catch (error) {
      console.error('Error loading exam years:', error);
      setExamYears([]);
    }
  };

  const loadExamSlots = async (yearId) => {
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/exam-slots?examYearId=${yearId}`);
      if (data && data.success) {
        setExamSlots(data.slots || []);
      }
    } catch (error) {
      console.error('Error loading exam slots:', error);
      setExamSlots([]);
    }
  };

  // Category operations
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithErrorHandling('/api/admin/hierarchy/exam-categories', {
        method: 'POST',
        body: JSON.stringify(categoryForm)
      });
      if (data && data.success) {
        alert('Exam category created successfully!');
        loadExamCategories();
        setCategoryForm({ name: '', shortCode: '', description: '', color: '#2563eb' });
        setShowCategoryForm(false);
      }
    } catch (error) {
      alert('Error creating category: ' + error.message);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/exam-categories/${editingCategory._id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryForm)
      });
      if (data && data.success) {
        alert('Exam category updated successfully!');
        loadExamCategories();
        setCategoryForm({ name: '', shortCode: '', description: '', color: '#2563eb' });
        setEditingCategory(null);
        setShowCategoryForm(false);
      }
    } catch (error) {
      alert('Error updating category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure? This will hide the category and all its data.')) return;
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/exam-categories/${id}`, {
        method: 'DELETE'
      });
      if (data && data.success) {
        alert('Exam category deleted successfully!');
        loadExamCategories();
        if (selectedCategory?._id === id) {
          setSelectedCategory(null);
          setExamYears([]);
          setExamSlots([]);
        }
      }
    } catch (error) {
      alert('Error deleting category: ' + error.message);
    }
  };

  // Year operations
  const handleCreateYear = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('Please select an exam category first');
      return;
    }
    try {
      const data = await fetchWithErrorHandling('/api/admin/hierarchy/exam-years', {
        method: 'POST',
        body: JSON.stringify({ ...yearForm, examCategoryId: selectedCategory._id })
      });
      if (data && data.success) {
        alert('Exam year created successfully!');
        loadExamYears(selectedCategory._id);
        setYearForm({ label: '', description: '' });
        setShowYearForm(false);
      }
    } catch (error) {
      alert('Error creating year: ' + error.message);
    }
  };

  const handleUpdateYear = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/exam-years/${editingYear._id}`, {
        method: 'PUT',
        body: JSON.stringify(yearForm)
      });
      if (data && data.success) {
        alert('Exam year updated successfully!');
        loadExamYears(selectedCategory._id);
        setYearForm({ label: '', description: '' });
        setEditingYear(null);
        setShowYearForm(false);
      }
    } catch (error) {
      alert('Error updating year: ' + error.message);
    }
  };

  const handleDeleteYear = async (id) => {
    if (!window.confirm('Are you sure? This will hide the year and all its data.')) return;
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/exam-years/${id}`, {
        method: 'DELETE'
      });
      if (data && data.success) {
        alert('Exam year deleted successfully!');
        loadExamYears(selectedCategory._id);
        if (selectedYear?._id === id) {
          setSelectedYear(null);
          setExamSlots([]);
        }
      }
    } catch (error) {
      alert('Error deleting year: ' + error.message);
    }
  };

  // Slot operations
  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!selectedYear) {
      alert('Please select an exam year first');
      return;
    }
    try {
      const data = await fetchWithErrorHandling('/api/admin/hierarchy/exam-slots', {
        method: 'POST',
        body: JSON.stringify({ ...slotForm, examYearId: selectedYear._id })
      });
      if (data && data.success) {
        alert('Exam slot created successfully!');
        loadExamSlots(selectedYear._id);
        setSlotForm({ label: '', description: '' });
        setShowSlotForm(false);
      }
    } catch (error) {
      alert('Error creating slot: ' + error.message);
    }
  };

  const handleUpdateSlot = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/exam-slots/${editingSlot._id}`, {
        method: 'PUT',
        body: JSON.stringify(slotForm)
      });
      if (data && data.success) {
        alert('Exam slot updated successfully!');
        loadExamSlots(selectedYear._id);
        setSlotForm({ label: '', description: '' });
        setEditingSlot(null);
        setShowSlotForm(false);
      }
    } catch (error) {
      alert('Error updating slot: ' + error.message);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Are you sure? This will hide the slot and all its data.')) return;
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/exam-slots/${id}`, {
        method: 'DELETE'
      });
      if (data && data.success) {
        alert('Exam slot deleted successfully!');
        loadExamSlots(selectedYear._id);
        if (selectedSlot?._id === id) {
          setSelectedSlot(null);
        }
      }
    } catch (error) {
      alert('Error deleting slot: ' + error.message);
    }
  };

  // Edit handlers
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      shortCode: category.shortCode,
      description: category.description || '',
      color: category.color || '#2563eb'
    });
    setShowCategoryForm(true);
  };

  const handleEditYear = (year) => {
    setEditingYear(year);
    setYearForm({
      label: year.label,
      description: year.description || ''
    });
    setShowYearForm(true);
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setSlotForm({
      label: slot.label,
      description: slot.description || ''
    });
    setShowSlotForm(true);
  };

  return (
    <div className="paperwise-container">
      <div className="section-grid">
      {/* Column 1: Exam Categories */}
      <div className="section-col">
        <div className="card-header-row">
          <h3 className="section-title">Exam Categories</h3>
          <button 
            className="small-btn" 
            style={{background: '#10b981'}}
            onClick={() => {
              setShowCategoryForm(!showCategoryForm);
              setEditingCategory(null);
              setCategoryForm({ name: '', shortCode: '', description: '', color: '#2563eb' });
            }}
          >
            {showCategoryForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showCategoryForm && (
          <form className="stack-form" onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
            <input
              type="text"
              placeholder="Category Name (e.g., CAT)"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Short Code (e.g., CAT)"
              value={categoryForm.shortCode}
              onChange={(e) => setCategoryForm({ ...categoryForm, shortCode: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            />
            <button type="submit" className="small-btn" style={{background: '#2563eb'}}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </form>
        )}

        <ul className="list">
          {examCategories.map((category) => (
            <li
              key={category._id}
              className={`list-item ${selectedCategory?._id === category._id ? 'list-item-active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              style={{borderLeftColor: category.color || '#2563eb', borderLeftWidth: '3px'}}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <strong>{category.name}</strong> ({category.shortCode})
                  {category.description && <div style={{fontSize: '12px', color: '#6b7280'}}>{category.description}</div>}
                </div>
                <div style={{display: 'flex', gap: '4px'}}>
                  <button
                    className="icon-btn"
                    onClick={(e) => { e.stopPropagation(); handleEditCategory(category); }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn danger"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category._id); }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: Exam Years */}
      <div className="section-col">
        <div className="card-header-row">
          <h3 className="section-title">
            Exam Years {selectedCategory && `(${selectedCategory.name})`}
          </h3>
          {selectedCategory && (
            <button 
              className="small-btn" 
              style={{background: '#10b981'}}
              onClick={() => {
                setShowYearForm(!showYearForm);
                setEditingYear(null);
                setYearForm({ label: '', description: '' });
              }}
            >
              {showYearForm ? 'Cancel' : '+ Add'}
            </button>
          )}
        </div>

        {!selectedCategory ? (
          <p className="muted">← Select an exam category first</p>
        ) : (
          <>
            {showYearForm && (
              <form className="stack-form" onSubmit={editingYear ? handleUpdateYear : handleCreateYear}>
                <input
                  type="text"
                  placeholder="Year Label (e.g., 2024, 2025)"
                  value={yearForm.label}
                  onChange={(e) => setYearForm({ ...yearForm, label: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={yearForm.description}
                  onChange={(e) => setYearForm({ ...yearForm, description: e.target.value })}
                />
                <button type="submit" className="small-btn" style={{background: '#2563eb'}}>
                  {editingYear ? 'Update Year' : 'Create Year'}
                </button>
              </form>
            )}

            <ul className="list">
              {examYears.map((year) => (
                <li
                  key={year._id}
                  className={`list-item ${selectedYear?._id === year._id ? 'list-item-active' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <strong>{year.label}</strong>
                      {year.description && <div style={{fontSize: '12px', color: '#6b7280'}}>{year.description}</div>}
                    </div>
                    <div style={{display: 'flex', gap: '4px'}}>
                      <button
                        className="icon-btn"
                        onClick={(e) => { e.stopPropagation(); handleEditYear(year); }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={(e) => { e.stopPropagation(); handleDeleteYear(year._id); }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Column 3: Exam Slots */}
      <div className="section-col">
        <div className="card-header-row">
          <h3 className="section-title">
            Exam Slots {selectedYear && `(${selectedYear.label})`}
          </h3>
          {selectedYear && (
            <button 
              className="small-btn" 
              style={{background: '#10b981'}}
              onClick={() => {
                setShowSlotForm(!showSlotForm);
                setEditingSlot(null);
                setSlotForm({ label: '', description: '' });
              }}
            >
              {showSlotForm ? 'Cancel' : '+ Add'}
            </button>
          )}
        </div>

        {!selectedYear ? (
          <p className="muted">← Select an exam year first</p>
        ) : (
          <>
            {showSlotForm && (
              <form className="stack-form" onSubmit={editingSlot ? handleUpdateSlot : handleCreateSlot}>
                <input
                  type="text"
                  placeholder="Slot Label (e.g., Slot 1, Morning, 2024A)"
                  value={slotForm.label}
                  onChange={(e) => setSlotForm({ ...slotForm, label: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={slotForm.description}
                  onChange={(e) => setSlotForm({ ...slotForm, description: e.target.value })}
                />
                <button type="submit" className="small-btn" style={{background: '#2563eb'}}>
                  {editingSlot ? 'Update Slot' : 'Create Slot'}
                </button>
              </form>
            )}

            <ul className="list">
              {examSlots.map((slot) => (
                <li
                  key={slot._id}
                  className={`list-item ${selectedSlot?._id === slot._id ? 'list-item-active' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <strong>{slot.label}</strong>
                      {slot.description && <div style={{fontSize: '12px', color: '#6b7280'}}>{slot.description}</div>}
                    </div>
                    <div style={{display: 'flex', gap: '4px'}}>
                      <button
                        className="icon-btn"
                        onClick={(e) => { e.stopPropagation(); handleEditSlot(slot); }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot._id); }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>

    {/* Test Paper Creator Section */}
    {selectedSlot && (
      <div className="test-creator-section">
        <TestPaperCreator
          testType="previousYear"
          selectedSeries={selectedSeries}
          selectedCategory={selectedCategory}
          selectedYear={selectedYear}
          selectedSlot={selectedSlot}
        />
      </div>
    )}
  </div>
  );
};

export default PaperWiseManagement;
