import React, { useState } from 'react';
import './Health.css';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import HealthDataCard from '../components/health/HealthDataCard';
import HealthDataChart from '../components/health/HealthDataChart';
import HealthDataForm from '../components/health/HealthDataForm';
import { useHealthData } from '../context/HealthDataContext';

/**
 * Health page component for displaying health data
 * Uses HealthDataContext for state management
 * @returns {JSX.Element} Health page
 */
const Health = () => {
  const { healthData, loading, error, connected, connectToSamsungHealth } = useHealthData();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('steps');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get the latest data for each health metric
  const getLatestData = (type) => {
    if (!healthData[type] || healthData[type].length === 0) {
      return null;
    }
    
    // Sort by date and get the latest
    return [...healthData[type]].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };
  
  // Get trend data for a health metric
  const getTrendData = (type, key) => {
    if (!healthData[type] || healthData[type].length <= 1) {
      return { direction: 'neutral', value: '0%' };
    }
    
    // Sort by date
    const sortedData = [...healthData[type]].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sortedData[0];
    const previous = sortedData[1];
    
    // Calculate trend
    const latestValue = latest[key];
    const previousValue = previous[key];
    const difference = latestValue - previousValue;
    const percentChange = (difference / previousValue) * 100;
    
    // Determine direction
    let direction = 'neutral';
    if (percentChange > 1) direction = 'up';
    else if (percentChange < -1) direction = 'down';
    
    return {
      direction,
      value: `${Math.abs(percentChange).toFixed(1)}%`
    };
  };
  
  // Handle adding new health data
  const handleAddData = (type) => {
    setFormType(type);
    setShowForm(true);
  };
  
  // Handle connecting to Samsung Health
  const handleConnectSamsungHealth = async () => {
    try {
      await connectToSamsungHealth();
    } catch (error) {
      console.error('Error connecting to Samsung Health:', error);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="health-page">
        <Header />
        <div className="health-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading health data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="health-page">
        <Header />
        <div className="health-content">
          <div className="error-container">
            <h2>Error Loading Health Data</h2>
            <p>{error}</p>
            <Button type="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Get latest data for each health metric
  const latestSteps = getLatestData('steps');
  const latestHeartRate = getLatestData('heartRate');
  const latestSleep = getLatestData('sleep');
  const latestExercise = getLatestData('exercise');
  
  // Get trend data for each health metric
  const stepsTrend = getTrendData('steps', 'count');
  const heartRateTrend = getTrendData('heartRate', 'average');
  const sleepTrend = getTrendData('sleep', 'duration');
  const exerciseTrend = getTrendData('exercise', 'duration');
  
  return (
    <div className="health-page">
      <Header />
      <div className="health-content">
        <div className="health-header">
          <h1>Health Dashboard</h1>
          <div className="health-actions">
            {!connected ? (
              <Button type="primary" onClick={handleConnectSamsungHealth}>
                Connect to Samsung Health
              </Button>
            ) : (
              <span className="connection-status">Connected to Samsung Health</span>
            )}
          </div>
        </div>
        
        <div className="health-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'steps' ? 'active' : ''}`}
            onClick={() => setActiveTab('steps')}
          >
            Steps
          </button>
          <button 
            className={`tab-button ${activeTab === 'heartRate' ? 'active' : ''}`}
            onClick={() => setActiveTab('heartRate')}
          >
            Heart Rate
          </button>
          <button 
            className={`tab-button ${activeTab === 'sleep' ? 'active' : ''}`}
            onClick={() => setActiveTab('sleep')}
          >
            Sleep
          </button>
          <button 
            className={`tab-button ${activeTab === 'exercise' ? 'active' : ''}`}
            onClick={() => setActiveTab('exercise')}
          >
            Exercise
          </button>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="health-overview">
            <div className="health-cards">
              <div className="health-card-item">
                <HealthDataCard
                  title="Steps"
                  value={latestSteps ? latestSteps.count.toString() : '0'}
                  unit="steps"
                  icon="👣"
                  trend={stepsTrend.direction}
                  trendValue={stepsTrend.value}
                  color="#4CAF50"
                  onClick={() => setActiveTab('steps')}
                />
              </div>
              <div className="health-card-item">
                <HealthDataCard
                  title="Heart Rate"
                  value={latestHeartRate ? latestHeartRate.average.toString() : '0'}
                  unit="bpm"
                  icon="❤️"
                  trend={heartRateTrend.direction}
                  trendValue={heartRateTrend.value}
                  color="#F44336"
                  onClick={() => setActiveTab('heartRate')}
                />
              </div>
              <div className="health-card-item">
                <HealthDataCard
                  title="Sleep"
                  value={latestSleep ? latestSleep.duration.toString() : '0'}
                  unit="hours"
                  icon="😴"
                  trend={sleepTrend.direction}
                  trendValue={sleepTrend.value}
                  color="#9C27B0"
                  onClick={() => setActiveTab('sleep')}
                />
              </div>
              <div className="health-card-item">
                <HealthDataCard
                  title="Exercise"
                  value={latestExercise ? latestExercise.duration.toString() : '0'}
                  unit="min"
                  icon="🏃"
                  trend={exerciseTrend.direction}
                  trendValue={exerciseTrend.value}
                  color="#FF9800"
                  onClick={() => setActiveTab('exercise')}
                />
              </div>
            </div>
            
            <div className="health-charts">
              <div className="health-chart-container">
                <HealthDataChart
                  title="Steps (Last 5 Days)"
                  data={healthData.steps.slice(-5)}
                  type="bar"
                  dataKey="count"
                  dateKey="date"
                  color="#4CAF50"
                  unit=" steps"
                />
              </div>
              <div className="health-chart-container">
                <HealthDataChart
                  title="Heart Rate (Last 5 Days)"
                  data={healthData.heartRate.slice(-5)}
                  type="line"
                  dataKey="average"
                  dateKey="date"
                  color="#F44336"
                  unit=" bpm"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Steps Tab */}
        {activeTab === 'steps' && (
          <div className="health-detail">
            <div className="detail-header">
              <h2>Step Tracking</h2>
              <Button type="primary" onClick={() => handleAddData('steps')}>
                Add Step Data
              </Button>
            </div>
            
            <div className="detail-content">
              <div className="detail-chart">
                <HealthDataChart
                  title="Daily Steps"
                  data={healthData.steps}
                  type="bar"
                  dataKey="count"
                  dateKey="date"
                  color="#4CAF50"
                  unit=" steps"
                />
              </div>
              
              <div className="detail-stats">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Average Steps</span>
                    <span className="stat-value">
                      {healthData.steps.length > 0 
                        ? Math.round(healthData.steps.reduce((sum, item) => sum + item.count, 0) / healthData.steps.length) 
                        : 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Highest Steps</span>
                    <span className="stat-value">
                      {healthData.steps.length > 0 
                        ? Math.max(...healthData.steps.map(item => item.count)) 
                        : 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Steps</span>
                    <span className="stat-value">
                      {healthData.steps.reduce((sum, item) => sum + item.count, 0)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Days Tracked</span>
                    <span className="stat-value">{healthData.steps.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Heart Rate Tab */}
        {activeTab === 'heartRate' && (
          <div className="health-detail">
            <div className="detail-header">
              <h2>Heart Rate Monitoring</h2>
              <Button type="primary" onClick={() => handleAddData('heartRate')}>
                Add Heart Rate Data
              </Button>
            </div>
            
            <div className="detail-content">
              <div className="detail-chart">
                <HealthDataChart
                  title="Average Heart Rate"
                  data={healthData.heartRate}
                  type="line"
                  dataKey="average"
                  dateKey="date"
                  color="#F44336"
                  unit=" bpm"
                />
              </div>
              
              <div className="detail-stats">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Average Heart Rate</span>
                    <span className="stat-value">
                      {healthData.heartRate.length > 0 
                        ? Math.round(healthData.heartRate.reduce((sum, item) => sum + item.average, 0) / healthData.heartRate.length) 
                        : 0} bpm
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Highest Heart Rate</span>
                    <span className="stat-value">
                      {healthData.heartRate.length > 0 
                        ? Math.max(...healthData.heartRate.map(item => item.max)) 
                        : 0} bpm
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Lowest Heart Rate</span>
                    <span className="stat-value">
                      {healthData.heartRate.length > 0 
                        ? Math.min(...healthData.heartRate.map(item => item.min)) 
                        : 0} bpm
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Days Tracked</span>
                    <span className="stat-value">{healthData.heartRate.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Sleep Tab */}
        {activeTab === 'sleep' && (
          <div className="health-detail">
            <div className="detail-header">
              <h2>Sleep Tracking</h2>
              <Button type="primary" onClick={() => handleAddData('sleep')}>
                Add Sleep Data
              </Button>
            </div>
            
            <div className="detail-content">
              <div className="detail-chart">
                <HealthDataChart
                  title="Sleep Duration"
                  data={healthData.sleep}
                  type="bar"
                  dataKey="duration"
                  dateKey="date"
                  color="#9C27B0"
                  unit=" hours"
                />
              </div>
              
              <div className="detail-stats">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Average Sleep</span>
                    <span className="stat-value">
                      {healthData.sleep.length > 0 
                        ? (healthData.sleep.reduce((sum, item) => sum + item.duration, 0) / healthData.sleep.length).toFixed(1) 
                        : 0} hours
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Longest Sleep</span>
                    <span className="stat-value">
                      {healthData.sleep.length > 0 
                        ? Math.max(...healthData.sleep.map(item => item.duration)).toFixed(1) 
                        : 0} hours
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Shortest Sleep</span>
                    <span className="stat-value">
                      {healthData.sleep.length > 0 
                        ? Math.min(...healthData.sleep.map(item => item.duration)).toFixed(1) 
                        : 0} hours
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Days Tracked</span>
                    <span className="stat-value">{healthData.sleep.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Exercise Tab */}
        {activeTab === 'exercise' && (
          <div className="health-detail">
            <div className="detail-header">
              <h2>Exercise Tracking</h2>
              <Button type="primary" onClick={() => handleAddData('exercise')}>
                Add Exercise Data
              </Button>
            </div>
            
            <div className="detail-content">
              <div className="detail-chart">
                <HealthDataChart
                  title="Exercise Duration"
                  data={healthData.exercise}
                  type="bar"
                  dataKey="duration"
                  dateKey="date"
                  color="#FF9800"
                  unit=" min"
                />
              </div>
              
              <div className="detail-stats">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Average Duration</span>
                    <span className="stat-value">
                      {healthData.exercise.length > 0 
                        ? Math.round(healthData.exercise.reduce((sum, item) => sum + item.duration, 0) / healthData.exercise.length) 
                        : 0} min
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Duration</span>
                    <span className="stat-value">
                      {healthData.exercise.reduce((sum, item) => sum + item.duration, 0)} min
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Calories</span>
                    <span className="stat-value">
                      {healthData.exercise.reduce((sum, item) => sum + item.calories, 0)} cal
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Workouts</span>
                    <span className="stat-value">{healthData.exercise.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Health Data Form Modal */}
        {showForm && (
          <HealthDataForm 
            type={formType} 
            onClose={() => setShowForm(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default Health;