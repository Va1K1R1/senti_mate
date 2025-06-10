import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HealthDataService from '../services/HealthDataService';

const HealthData = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'steps', 'sleep', 'heart', 'weight', 'custom'
  const [newHealthData, setNewHealthData] = useState({
    dataType: 'steps',
    value: '',
    unit: '',
    timestamp: new Date().toISOString().split('T')[0],
    source: 'Manual Entry'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadHealthData();
  }, [isAuthenticated, navigate]);

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const data = await HealthDataService.getAllHealthData();
      setHealthData(data);
    } catch (err) {
      setError(err.message || 'Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHealthData({
      ...newHealthData,
      [name]: value
    });
  };

  const handleAddHealthData = async (e) => {
    e.preventDefault();
    
    if (!newHealthData.value || !newHealthData.unit) {
      setError('Please provide a value and unit');
      return;
    }
    
    setLoading(true);
    try {
      const createdHealthData = await HealthDataService.createHealthData({
        ...newHealthData,
        value: parseFloat(newHealthData.value)
      });
      
      setHealthData([...healthData, createdHealthData]);
      setNewHealthData({
        dataType: 'steps',
        value: '',
        unit: '',
        timestamp: new Date().toISOString().split('T')[0],
        source: 'Manual Entry'
      });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add health data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHealthData = async (id) => {
    setLoading(true);
    try {
      await HealthDataService.deleteHealthData(id);
      setHealthData(healthData.filter(data => data.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete health data');
    } finally {
      setLoading(false);
    }
  };

  const filteredHealthData = healthData.filter(data => {
    if (activeTab === 'all') return true;
    return data.dataType === activeTab;
  });

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUnitForDataType = (dataType) => {
    switch (dataType) {
      case 'steps':
        return 'steps';
      case 'sleep':
        return 'hours';
      case 'heart':
        return 'bpm';
      case 'weight':
        return 'kg';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (newHealthData.dataType) {
      setNewHealthData({
        ...newHealthData,
        unit: getUnitForDataType(newHealthData.dataType)
      });
    }
  }, [newHealthData.dataType]);

  if (loading && healthData.length === 0) {
    return <div className="loading">Loading your health data...</div>;
  }

  return (
    <div className="health-data-container">
      <h1>Health Data</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="health-data-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={activeTab === 'steps' ? 'active' : ''}
          onClick={() => setActiveTab('steps')}
        >
          Steps
        </button>
        <button 
          className={activeTab === 'sleep' ? 'active' : ''}
          onClick={() => setActiveTab('sleep')}
        >
          Sleep
        </button>
        <button 
          className={activeTab === 'heart' ? 'active' : ''}
          onClick={() => setActiveTab('heart')}
        >
          Heart Rate
        </button>
        <button 
          className={activeTab === 'weight' ? 'active' : ''}
          onClick={() => setActiveTab('weight')}
        >
          Weight
        </button>
        <button 
          className={activeTab === 'custom' ? 'active' : ''}
          onClick={() => setActiveTab('custom')}
        >
          Custom
        </button>
      </div>
      
      <div className="health-data-actions">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-health-data-button"
        >
          {showAddForm ? 'Cancel' : 'Add Health Data'}
        </button>
      </div>
      
      {showAddForm && (
        <form onSubmit={handleAddHealthData} className="health-data-form">
          <div className="form-group">
            <label htmlFor="dataType">Data Type</label>
            <select
              id="dataType"
              name="dataType"
              value={newHealthData.dataType}
              onChange={handleInputChange}
              disabled={loading}
              required
            >
              <option value="steps">Steps</option>
              <option value="sleep">Sleep</option>
              <option value="heart">Heart Rate</option>
              <option value="weight">Weight</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          {newHealthData.dataType === 'custom' && (
            <div className="form-group">
              <label htmlFor="customType">Custom Type Name</label>
              <input
                type="text"
                id="customType"
                name="customType"
                value={newHealthData.customType || ''}
                onChange={handleInputChange}
                disabled={loading}
                required={newHealthData.dataType === 'custom'}
                placeholder="e.g., Blood Pressure, Glucose, etc."
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="value">Value</label>
            <input
              type="number"
              id="value"
              name="value"
              value={newHealthData.value}
              onChange={handleInputChange}
              disabled={loading}
              required
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={newHealthData.unit}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="timestamp">Date</label>
            <input
              type="date"
              id="timestamp"
              name="timestamp"
              value={newHealthData.timestamp}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="source">Source</label>
            <input
              type="text"
              id="source"
              name="source"
              value={newHealthData.source}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Adding...' : 'Add Health Data'}
          </button>
        </form>
      )}
      
      <div className="health-data-list">
        {filteredHealthData.length === 0 ? (
          <div className="no-health-data">
            No health data available. Add some data to get started!
          </div>
        ) : (
          <div className="health-data-grid">
            {filteredHealthData.map(data => (
              <div key={data.id} className="health-data-card">
                <div className="health-data-card-header">
                  <h3 className="health-data-type">
                    {data.dataType === 'custom' ? data.customType : data.dataType}
                  </h3>
                  <button
                    onClick={() => handleDeleteHealthData(data.id)}
                    disabled={loading}
                    className="delete-button"
                    aria-label="Delete health data"
                  >
                    ×
                  </button>
                </div>
                <div className="health-data-value">
                  {data.value} {data.unit}
                </div>
                <div className="health-data-date">
                  {formatDate(data.timestamp)}
                </div>
                <div className="health-data-source">
                  Source: {data.source}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="health-data-actions">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default HealthData;