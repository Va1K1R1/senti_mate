import React, { useState, useEffect } from 'react';
import './HealthDataSummary.css';

/**
 * HealthDataSummary component
 * Displays a summary of the user's health data for the dashboard
 */
const HealthDataSummary = ({ healthData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // If healthData is provided as a prop, use it
    if (healthData) {
      setData(healthData);
      setIsLoading(false);
      return;
    }

    // Otherwise, simulate fetching data from an API
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data for demonstration
        const mockData = {
          steps: {
            today: 8432,
            goal: 10000,
            progress: 84.32,
          },
          sleep: {
            lastNight: 7.5,
            goal: 8,
            progress: 93.75,
          },
          heartRate: {
            current: 72,
            resting: 62,
          },
          exercise: {
            today: {
              calories: 320,
              duration: 45,
              type: 'Running',
            },
            weeklyCalories: 1750,
            weeklyGoal: 2000,
            progress: 87.5,
          },
        };

        setData(mockData);
      } catch (err) {
        console.error('Error fetching health data summary:', err);
        setError('Failed to load health data summary. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [healthData]);

  if (isLoading) {
    return (
      <div className="HealthDataSummary">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="HealthDataSummary">
        <div className="error-container">
          <div className="error-icon">!</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="HealthDataSummary">
      <div className="health-data-grid">
        <div className="health-data-item">
          <div className="health-data-icon">👣</div>
          <div className="health-data-content">
            <h3>Steps</h3>
            <div className="health-data-value">{data.steps.today.toLocaleString()}</div>
            <div className="health-data-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${data.steps.progress}%` }}
              ></div>
            </div>
            <div className="health-data-goal">{data.steps.progress}% of daily goal</div>
          </div>
        </div>

        <div className="health-data-item">
          <div className="health-data-icon">😴</div>
          <div className="health-data-content">
            <h3>Sleep</h3>
            <div className="health-data-value">{data.sleep.lastNight} hrs</div>
            <div className="health-data-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${data.sleep.progress}%` }}
              ></div>
            </div>
            <div className="health-data-goal">{data.sleep.progress}% of sleep goal</div>
          </div>
        </div>

        <div className="health-data-item">
          <div className="health-data-icon">❤️</div>
          <div className="health-data-content">
            <h3>Heart Rate</h3>
            <div className="health-data-value">{data.heartRate.current} BPM</div>
            <div className="health-data-secondary">
              Resting: {data.heartRate.resting} BPM
            </div>
          </div>
        </div>

        <div className="health-data-item">
          <div className="health-data-icon">🏃‍♂️</div>
          <div className="health-data-content">
            <h3>Exercise</h3>
            <div className="health-data-value">{data.exercise.today.calories} cal</div>
            <div className="health-data-secondary">
              {data.exercise.today.duration} min {data.exercise.today.type}
            </div>
            <div className="health-data-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${data.exercise.progress}%` }}
              ></div>
            </div>
            <div className="health-data-goal">{data.exercise.progress}% of weekly goal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDataSummary;
