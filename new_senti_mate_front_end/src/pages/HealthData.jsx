import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HealthDataService from '../services/HealthDataService';

const HealthData = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'steps', 'sleep', 'heart', 'weight', 'custom'
  // Health data will be retrieved from API, no need for manual input

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

  // Health data input functions removed as data will be retrieved from API

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

  // Unit function removed as health data will be retrieved from API

  // Unit setting effect removed as health data will be retrieved from API

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

      {/* Health data input form removed as data will be retrieved from API */}

      <div className="health-data-list">
        {filteredHealthData.length === 0 ? (
          <div className="no-health-data">
            No health data available. Health data will be automatically synced from connected devices and services.
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
