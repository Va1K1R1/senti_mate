import React, { useState, useEffect } from 'react';
import './EmotionChart.css';

/**
 * EmotionChart component
 * Displays a chart of the user's emotions over time
 */
const EmotionChart = ({ emotionData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'

  useEffect(() => {
    // If emotionData is provided as a prop, use it
    if (emotionData) {
      setData(emotionData);
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
          week: [
            { day: 'Mon', emotion: 'Happy', count: 3, intensity: 0.8 },
            { day: 'Tue', emotion: 'Calm', count: 2, intensity: 0.6 },
            { day: 'Wed', emotion: 'Anxious', count: 1, intensity: 0.4 },
            { day: 'Thu', emotion: 'Happy', count: 2, intensity: 0.7 },
            { day: 'Fri', emotion: 'Sad', count: 1, intensity: 0.3 },
            { day: 'Sat', emotion: 'Happy', count: 4, intensity: 0.9 },
            { day: 'Sun', emotion: 'Calm', count: 3, intensity: 0.7 },
          ],
          month: [
            { week: 'Week 1', emotions: { Happy: 12, Calm: 8, Anxious: 4, Sad: 2, Angry: 1 } },
            { week: 'Week 2', emotions: { Happy: 10, Calm: 9, Anxious: 3, Sad: 3, Angry: 2 } },
            { week: 'Week 3', emotions: { Happy: 14, Calm: 7, Anxious: 2, Sad: 1, Angry: 0 } },
            { week: 'Week 4', emotions: { Happy: 11, Calm: 10, Anxious: 3, Sad: 2, Angry: 1 } },
          ],
          year: [
            { month: 'Jan', primaryEmotion: 'Happy', intensity: 0.8 },
            { month: 'Feb', primaryEmotion: 'Happy', intensity: 0.7 },
            { month: 'Mar', primaryEmotion: 'Calm', intensity: 0.6 },
            { month: 'Apr', primaryEmotion: 'Anxious', intensity: 0.5 },
            { month: 'May', primaryEmotion: 'Happy', intensity: 0.8 },
            { month: 'Jun', primaryEmotion: 'Happy', intensity: 0.9 },
            { month: 'Jul', primaryEmotion: 'Calm', intensity: 0.7 },
            { month: 'Aug', primaryEmotion: 'Happy', intensity: 0.8 },
            { month: 'Sep', primaryEmotion: 'Calm', intensity: 0.6 },
            { month: 'Oct', primaryEmotion: 'Happy', intensity: 0.7 },
            { month: 'Nov', primaryEmotion: 'Anxious', intensity: 0.4 },
            { month: 'Dec', primaryEmotion: 'Happy', intensity: 0.9 },
          ],
          summary: {
            primaryEmotion: 'Happy',
            emotionCounts: { Happy: 47, Calm: 34, Anxious: 12, Sad: 8, Angry: 4 },
            totalEntries: 105,
          },
        };

        setData(mockData);
      } catch (err) {
        console.error('Error fetching emotion data:', err);
        setError('Failed to load emotion data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [emotionData]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (isLoading) {
    return (
      <div className="EmotionChart">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading emotion data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="EmotionChart">
        <div className="error-container">
          <div className="error-icon">!</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Helper function to get emotion color
  const getEmotionColor = (emotion) => {
    const colors = {
      Happy: '#4caf50', // Green
      Calm: '#2196f3',  // Blue
      Anxious: '#ff9800', // Orange
      Sad: '#9c27b0',   // Purple
      Angry: '#f44336', // Red
    };
    return colors[emotion] || '#757575'; // Default gray
  };

  // Render weekly emotion chart
  const renderWeeklyChart = () => {
    return (
      <div className="weekly-chart">
        <div className="chart-bars">
          {data.week.map((day, index) => (
            <div key={index} className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${day.intensity * 100}%`,
                  backgroundColor: getEmotionColor(day.emotion)
                }}
                title={`${day.emotion} (${day.count} entries)`}
              ></div>
              <div className="chart-label">{day.day}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render monthly emotion chart
  const renderMonthlyChart = () => {
    return (
      <div className="monthly-chart">
        <div className="chart-grid">
          {data.month.map((week, index) => (
            <div key={index} className="chart-week">
              <div className="chart-week-label">{week.week}</div>
              <div className="chart-week-emotions">
                {Object.entries(week.emotions).map(([emotion, count]) => (
                  <div 
                    key={emotion} 
                    className="emotion-bubble"
                    style={{ 
                      backgroundColor: getEmotionColor(emotion),
                      width: `${Math.min(count * 5, 40)}px`,
                      height: `${Math.min(count * 5, 40)}px`,
                    }}
                    title={`${emotion}: ${count} entries`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render yearly emotion chart
  const renderYearlyChart = () => {
    return (
      <div className="yearly-chart">
        <div className="chart-timeline">
          {data.year.map((month, index) => (
            <div key={index} className="chart-month">
              <div 
                className="chart-month-indicator"
                style={{ 
                  backgroundColor: getEmotionColor(month.primaryEmotion),
                  opacity: month.intensity
                }}
                title={`${month.primaryEmotion} (${Math.round(month.intensity * 100)}% intensity)`}
              ></div>
              <div className="chart-month-label">{month.month}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render emotion summary
  const renderSummary = () => {
    const { primaryEmotion, emotionCounts, totalEntries } = data.summary;
    
    return (
      <div className="emotion-summary">
        <div className="primary-emotion">
          <div className="primary-emotion-label">Primary Emotion</div>
          <div 
            className="primary-emotion-value"
            style={{ color: getEmotionColor(primaryEmotion) }}
          >
            {primaryEmotion}
          </div>
        </div>
        
        <div className="emotion-distribution">
          {Object.entries(emotionCounts).map(([emotion, count]) => (
            <div key={emotion} className="emotion-distribution-item">
              <div className="emotion-name">{emotion}</div>
              <div className="emotion-bar-container">
                <div 
                  className="emotion-bar"
                  style={{ 
                    width: `${(count / totalEntries) * 100}%`,
                    backgroundColor: getEmotionColor(emotion)
                  }}
                ></div>
              </div>
              <div className="emotion-percentage">
                {Math.round((count / totalEntries) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="EmotionChart">
      <div className="chart-header">
        <h3>Emotion Trends</h3>
        <div className="time-range-selector">
          <button 
            className={`time-range-button ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('week')}
          >
            Week
          </button>
          <button 
            className={`time-range-button ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('month')}
          >
            Month
          </button>
          <button 
            className={`time-range-button ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        {timeRange === 'week' && renderWeeklyChart()}
        {timeRange === 'month' && renderMonthlyChart()}
        {timeRange === 'year' && renderYearlyChart()}
      </div>
      
      {renderSummary()}
    </div>
  );
};

export default EmotionChart;