import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../../../utils/api';
import TestPaperCreator from './TestPaperCreator';
import './MockTestManagement.css';

const TopicWiseManagement = ({ selectedSeries }) => {
  // Hierarchy data
  const [topicCategories, setTopicCategories] = useState([]);
  const [topicTestGroups, setTopicTestGroups] = useState([]);
  
  // Selected items
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: '', section: 'GENERAL', description: '' });
  const [groupForm, setGroupForm] = useState({ title: '', description: '' });
  
  // UI states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadTopicCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadTopicTestGroups(selectedCategory._id);
      setSelectedGroup(null);
    }
  }, [selectedCategory]);

  // Load functions
  const loadTopicCategories = async () => {
    try {
      const data = await fetchWithErrorHandling('/api/admin/hierarchy/topic-categories');
      if (data && data.success) {
        setTopicCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading topic categories:', error);
    }
  };

  const loadTopicTestGroups = async (categoryId) => {
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/topic-test-groups?topicCategoryId=${categoryId}`);
      if (data && data.success) {
        setTopicTestGroups(data.groups || []);
      }
    } catch (error) {
      console.error('Error loading topic test groups:', error);
      setTopicTestGroups([]);
    }
  };

  // Category operations
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithErrorHandling('/api/admin/hierarchy/topic-categories', {
        method: 'POST',
        body: JSON.stringify(categoryForm)
      });
      if (data && data.success) {
        alert('Topic category created successfully!');
        loadTopicCategories();
        setCategoryForm({ name: '', section: 'GENERAL', description: '' });
        setShowCategoryForm(false);
      }
    } catch (error) {
      alert('Error creating category: ' + error.message);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/topic-categories/${editingCategory._id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryForm)
      });
      if (data && data.success) {
        alert('Topic category updated successfully!');
        loadTopicCategories();
        setCategoryForm({ name: '', section: 'GENERAL', description: '' });
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
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/topic-categories/${id}`, {
        method: 'DELETE'
      });
      if (data && data.success) {
        alert('Topic category deleted successfully!');
        loadTopicCategories();
        if (selectedCategory?._id === id) {
          setSelectedCategory(null);
          setTopicTestGroups([]);
        }
      }
    } catch (error) {
      alert('Error deleting category: ' + error.message);
    }
  };

  // Group operations
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('Please select a topic category first');
      return;
    }
    try {
      const data = await fetchWithErrorHandling('/api/admin/hierarchy/topic-test-groups', {
        method: 'POST',
        body: JSON.stringify({ ...groupForm, topicCategoryId: selectedCategory._id })
      });
      if (data && data.success) {
        alert('Topic test group created successfully!');
        loadTopicTestGroups(selectedCategory._id);
        setGroupForm({ title: '', description: '' });
        setShowGroupForm(false);
      }
    } catch (error) {
      alert('Error creating group: ' + error.message);
    }
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/topic-test-groups/${editingGroup._id}`, {
        method: 'PUT',
        body: JSON.stringify(groupForm)
      });
      if (data && data.success) {
        alert('Topic test group updated successfully!');
        loadTopicTestGroups(selectedCategory._id);
        setGroupForm({ title: '', description: '' });
        setEditingGroup(null);
        setShowGroupForm(false);
      }
    } catch (error) {
      alert('Error updating group: ' + error.message);
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Are you sure? This will hide the group and all its data.')) return;
    try {
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/topic-test-groups/${id}`, {
        method: 'DELETE'
      });
      if (data && data.success) {
        alert('Topic test group deleted successfully!');
        loadTopicTestGroups(selectedCategory._id);
        if (selectedGroup?._id === id) {
          setSelectedGroup(null);
        }
      }
    } catch (error) {
      alert('Error deleting group: ' + error.message);
    }
  };

  // Edit handlers
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      section: category.section || 'GENERAL',
      description: category.description || ''
    });
    setShowCategoryForm(true);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setGroupForm({
      title: group.title,
      description: group.description || ''
    });
    setShowGroupForm(true);
  };

  const sectionColors = {
    'VARC': '#7c3aed',
    'DILR': '#ea580c',
    'QA': '#0891b2',
    'GENERAL': '#6b7280'
  };

  return (
    <div className="topicwise-container">
      <div className="section-grid" style={{gridTemplateColumns: '1.2fr 1.5fr'}}>
      {/* Column 1: Topic Categories */}
      <div className="section-col">
        <div className="card-header-row">
          <h3 className="section-title">Topic Categories</h3>
          <button 
            className="small-btn" 
            style={{background: '#10b981'}}
            onClick={() => {
              setShowCategoryForm(!showCategoryForm);
              setEditingCategory(null);
              setCategoryForm({ name: '', section: 'GENERAL', description: '' });
            }}
          >
            {showCategoryForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showCategoryForm && (
          <form className="stack-form" onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
            <input
              type="text"
              placeholder="Category Name (e.g., Verbal Ability)"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
            />
            <select
              value={categoryForm.section}
              onChange={(e) => setCategoryForm({ ...categoryForm, section: e.target.value })}
            >
              <option value="GENERAL">General</option>
              <option value="VARC">VARC (Verbal Ability & Reading Comprehension)</option>
              <option value="DILR">DILR (Data Interpretation & Logical Reasoning)</option>
              <option value="QA">QA (Quantitative Aptitude)</option>
            </select>
            <input
              type="text"
              placeholder="Description (optional)"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            />
            <button type="submit" className="small-btn" style={{background: '#2563eb'}}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </form>
        )}

        <ul className="list">
          {topicCategories.map((category) => (
            <li
              key={category._id}
              className={`list-item ${selectedCategory?._id === category._id ? 'list-item-active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              style={{
                borderLeftColor: sectionColors[category.section] || '#6b7280',
                borderLeftWidth: '3px'
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <strong>{category.name}</strong>
                  <div style={{fontSize: '11px', color: sectionColors[category.section], fontWeight: 600}}>
                    {category.section}
                  </div>
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

      {/* Column 2: Topic Test Groups */}
      <div className="section-col">
        <div className="card-header-row">
          <h3 className="section-title">
            Topic Test Groups {selectedCategory && `(${selectedCategory.name})`}
          </h3>
          {selectedCategory && (
            <button 
              className="small-btn" 
              style={{background: '#10b981'}}
              onClick={() => {
                setShowGroupForm(!showGroupForm);
                setEditingGroup(null);
                setGroupForm({ title: '', description: '' });
              }}
            >
              {showGroupForm ? 'Cancel' : '+ Add'}
            </button>
          )}
        </div>

        {!selectedCategory ? (
          <p className="muted">← Select a topic category first</p>
        ) : (
          <>
            {showGroupForm && (
              <form className="stack-form" onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}>
                <input
                  type="text"
                  placeholder="Group Title (e.g., Algebra - Set 1)"
                  value={groupForm.title}
                  onChange={(e) => setGroupForm({ ...groupForm, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  rows="3"
                />
                <button type="submit" className="small-btn" style={{background: '#2563eb'}}>
                  {editingGroup ? 'Update Group' : 'Create Group'}
                </button>
              </form>
            )}

            <ul className="list">
              {topicTestGroups.map((group) => (
                <li
                  key={group._id}
                  className={`list-item ${selectedGroup?._id === group._id ? 'list-item-active' : ''}`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <strong>{group.title}</strong>
                      {group.description && <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>{group.description}</div>}
                    </div>
                    <div style={{display: 'flex', gap: '4px'}}>
                      <button
                        className="icon-btn"
                        onClick={(e) => { e.stopPropagation(); handleEditGroup(group); }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group._id); }}
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
    {selectedGroup && (
      <div className="test-creator-section">
        <TestPaperCreator
          testType="previousYear"
          selectedSeries={selectedSeries}
          selectedTopicCategory={selectedCategory}
          selectedTopicGroup={selectedGroup}
        />
      </div>
    )}
  </div>
  );
};

export default TopicWiseManagement;
