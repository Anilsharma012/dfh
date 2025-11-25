import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../../../utils/api';
import './HierarchyManagement.css';

const HierarchyManagement = () => {
  const [activeTab, setActiveTab] = useState('examCategory');
  
  const [examCategories, setExamCategories] = useState([]);
  const [examYears, setExamYears] = useState([]);
  const [examSlots, setExamSlots] = useState([]);
  const [topicCategories, setTopicCategories] = useState([]);
  const [topicTestGroups, setTopicTestGroups] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchExamCategories(),
        fetchExamYears(),
        fetchExamSlots(),
        fetchTopicCategories(),
        fetchTopicTestGroups()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchExamCategories = async () => {
    const data = await fetchWithErrorHandling('/api/admin/hierarchy/exam-categories');
    if (data?.categories) setExamCategories(data.categories);
  };

  const fetchExamYears = async () => {
    const data = await fetchWithErrorHandling('/api/admin/hierarchy/exam-years');
    if (data?.years) setExamYears(data.years);
  };

  const fetchExamSlots = async () => {
    const data = await fetchWithErrorHandling('/api/admin/hierarchy/exam-slots');
    if (data?.slots) setExamSlots(data.slots);
  };

  const fetchTopicCategories = async () => {
    const data = await fetchWithErrorHandling('/api/admin/hierarchy/topic-categories');
    if (data?.categories) setTopicCategories(data.categories);
  };

  const fetchTopicTestGroups = async () => {
    const data = await fetchWithErrorHandling('/api/admin/hierarchy/topic-test-groups');
    if (data?.groups) setTopicTestGroups(data.groups);
  };

  const handleCreate = (type) => {
    setEditingItem(null);
    setFormData(getEmptyFormData(type));
  };

  const handleEdit = (type, item) => {
    setEditingItem({ type, id: item._id });
    setFormData(item);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = getEndpoint(type);
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `/api/admin/hierarchy/${endpoint}/${editingItem.id}`
        : `/api/admin/hierarchy/${endpoint}`;

      const data = await fetchWithErrorHandling(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (data?.success) {
        alert(`${type} ${editingItem ? 'updated' : 'created'} successfully!`);
        handleCancel();
        fetchAllData();
      }
    } catch (error) {
      alert(`Failed to ${editingItem ? 'update' : 'create'} ${type}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      const endpoint = getEndpoint(type);
      const data = await fetchWithErrorHandling(`/api/admin/hierarchy/${endpoint}/${id}`, {
        method: 'DELETE'
      });

      if (data?.success) {
        alert('Deleted successfully!');
        fetchAllData();
      }
    } catch (error) {
      alert(`Failed to delete: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getEndpoint = (type) => {
    const endpoints = {
      examCategory: 'exam-categories',
      examYear: 'exam-years',
      examSlot: 'exam-slots',
      topicCategory: 'topic-categories',
      topicTestGroup: 'topic-test-groups'
    };
    return endpoints[type];
  };

  const getEmptyFormData = (type) => {
    switch (type) {
      case 'examCategory':
        return { name: '', code: '', description: '', displayOrder: 0 };
      case 'examYear':
        return { examCategoryId: '', label: '', displayOrder: 0 };
      case 'examSlot':
        return { examYearId: '', label: '', slotMonth: '', displayOrder: 0 };
      case 'topicCategory':
        return { name: '', code: '', description: '', displayOrder: 0 };
      case 'topicTestGroup':
        return { topicCategoryId: '', title: '', description: '', displayOrder: 0 };
      default:
        return {};
    }
  };

  const renderExamCategoryForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'examCategory')} className="hierarchy-form">
      <h3>{editingItem ? 'Edit' : 'Create'} Exam Category</h3>
      <input
        type="text"
        placeholder="Name (e.g., CAT, XAT, SNAP)"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Code (e.g., CAT, XAT)"
        value={formData.code || ''}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Display Order"
        value={formData.displayOrder || 0}
        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {editingItem ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );

  const renderExamYearForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'examYear')} className="hierarchy-form">
      <h3>{editingItem ? 'Edit' : 'Create'} Exam Year</h3>
      <select
        value={formData.examCategoryId || ''}
        onChange={(e) => setFormData({ ...formData, examCategoryId: e.target.value })}
        required
      >
        <option value="">Select Exam Category</option>
        {examCategories.map(cat => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Year Label (e.g., 2024)"
        value={formData.label || ''}
        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Display Order"
        value={formData.displayOrder || 0}
        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {editingItem ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );

  const renderExamSlotForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'examSlot')} className="hierarchy-form">
      <h3>{editingItem ? 'Edit' : 'Create'} Exam Slot</h3>
      <select
        value={formData.examYearId || ''}
        onChange={(e) => setFormData({ ...formData, examYearId: e.target.value })}
        required
      >
        <option value="">Select Exam Year</option>
        {examYears.map(year => (
          <option key={year._id} value={year._id}>
            {year.examCategoryId?.name} - {year.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Slot Label (e.g., Slot 1, Slot A)"
        value={formData.label || ''}
        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Slot Month (optional)"
        value={formData.slotMonth || ''}
        onChange={(e) => setFormData({ ...formData, slotMonth: e.target.value })}
      />
      <input
        type="number"
        placeholder="Display Order"
        value={formData.displayOrder || 0}
        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {editingItem ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );

  const renderTopicCategoryForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'topicCategory')} className="hierarchy-form">
      <h3>{editingItem ? 'Edit' : 'Create'} Topic Category</h3>
      <input
        type="text"
        placeholder="Name (e.g., VARC, LRDI, Quant)"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Code (e.g., VARC, LRDI)"
        value={formData.code || ''}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Display Order"
        value={formData.displayOrder || 0}
        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {editingItem ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );

  const renderTopicTestGroupForm = () => (
    <form onSubmit={(e) => handleSubmit(e, 'topicTestGroup')} className="hierarchy-form">
      <h3>{editingItem ? 'Edit' : 'Create'} Topic Test Group</h3>
      <select
        value={formData.topicCategoryId || ''}
        onChange={(e) => setFormData({ ...formData, topicCategoryId: e.target.value })}
        required
      >
        <option value="">Select Topic Category</option>
        {topicCategories.map(cat => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Title (e.g., Algebra, Reading Comprehension)"
        value={formData.title || ''}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Display Order"
        value={formData.displayOrder || 0}
        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {editingItem ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );

  const renderItemsList = (items, type) => {
    if (!items || items.length === 0) {
      return <p className="no-items">No items found. Create one to get started!</p>;
    }

    return (
      <div className="items-grid">
        {items.map(item => (
          <div key={item._id} className="item-card">
            <h4>{item.name || item.label || item.title}</h4>
            {item.code && <div className="item-code">Code: {item.code}</div>}
            {item.description && <div className="item-desc">{item.description}</div>}
            {item.examCategoryId && (
              <div className="item-parent">Exam: {item.examCategoryId.name}</div>
            )}
            {item.examYearId && (
              <div className="item-parent">
                Year: {item.examYearId.examCategoryId?.name} - {item.examYearId.label}
              </div>
            )}
            {item.topicCategoryId && (
              <div className="item-parent">Category: {item.topicCategoryId.name}</div>
            )}
            {item.slotMonth && <div className="item-month">Month: {item.slotMonth}</div>}
            <div className="item-order">Order: {item.displayOrder}</div>
            <div className="item-actions">
              <button onClick={() => handleEdit(type, item)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => handleDelete(type, item._id)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="hierarchy-management">
      <div className="page-header">
        <h1>Hierarchy Management</h1>
        <p>Configure the structure for organizing mock tests</p>
      </div>

      <div className="tabs-container">
        <button
          className={activeTab === 'examCategory' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('examCategory')}
        >
          Exam Categories
        </button>
        <button
          className={activeTab === 'examYear' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('examYear')}
        >
          Exam Years
        </button>
        <button
          className={activeTab === 'examSlot' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('examSlot')}
        >
          Exam Slots
        </button>
        <button
          className={activeTab === 'topicCategory' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('topicCategory')}
        >
          Topic Categories
        </button>
        <button
          className={activeTab === 'topicTestGroup' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('topicTestGroup')}
        >
          Topic Groups
        </button>
      </div>

      <div className="content-area">
        <div className="form-section">
          {!editingItem && (
            <button
              onClick={() => handleCreate(activeTab)}
              className="btn-create"
            >
              + Create New {activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          )}
          
          {(editingItem || formData.name !== undefined || formData.label !== undefined || formData.title !== undefined) && (
            <>
              {activeTab === 'examCategory' && renderExamCategoryForm()}
              {activeTab === 'examYear' && renderExamYearForm()}
              {activeTab === 'examSlot' && renderExamSlotForm()}
              {activeTab === 'topicCategory' && renderTopicCategoryForm()}
              {activeTab === 'topicTestGroup' && renderTopicTestGroupForm()}
            </>
          )}
        </div>

        <div className="items-section">
          <h2>Existing {activeTab.replace(/([A-Z])/g, ' $1').trim()}s</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {activeTab === 'examCategory' && renderItemsList(examCategories, 'examCategory')}
              {activeTab === 'examYear' && renderItemsList(examYears, 'examYear')}
              {activeTab === 'examSlot' && renderItemsList(examSlots, 'examSlot')}
              {activeTab === 'topicCategory' && renderItemsList(topicCategories, 'topicCategory')}
              {activeTab === 'topicTestGroup' && renderItemsList(topicTestGroups, 'topicTestGroup')}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HierarchyManagement;
