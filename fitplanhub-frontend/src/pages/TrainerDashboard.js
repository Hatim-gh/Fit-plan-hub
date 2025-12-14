import React, { useState, useEffect } from 'react';
import { plansAPI } from '../services/api';

const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getMyPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingPlan) {
        await plansAPI.update(editingPlan._id, formData);
        setMessage('Plan updated successfully!');
      } else {
        await plansAPI.create(formData);
        setMessage('Plan created successfully!');
      }
      
      setShowForm(false);
      setEditingPlan(null);
      setFormData({ title: '', description: '', price: '', duration: '' });
      fetchPlans();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description || '',
      price: plan.price,
      duration: plan.duration
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await plansAPI.delete(id);
        setMessage('Plan deleted successfully!');
        fetchPlans();
      } catch (error) {
        setMessage(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    setFormData({ title: '', description: '', price: '', duration: '' });
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '30px' }}>
        <h1>My Fitness Plans</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Create New Plan'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="card">
          <h2>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="card">
          <p>You haven't created any plans yet. Create your first plan!</p>
        </div>
      ) : (
        <div className="plan-grid">
          {plans.map((plan) => (
            <div key={plan._id} className="plan-card">
              <h3>{plan.title}</h3>
              <p style={{ color: '#666', marginBottom: '10px' }}>{plan.description}</p>
              <p className="price">${plan.price}</p>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                Duration: {plan.duration} days
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(plan)} className="btn btn-secondary">
                  Edit
                </button>
                <button onClick={() => handleDelete(plan._id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;

