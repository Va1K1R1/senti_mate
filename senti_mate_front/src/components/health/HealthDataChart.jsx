import React from 'react';
import './HealthDataChart.css';

/**
 * HealthDataChart component for visualizing health data
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {Array} props.data - Array of data points
 * @param {string} props.type - Chart type ('bar', 'line')
 * @param {string} props.dataKey - Key to use for data values
 * @param {string} props.dateKey - Key to use for date values
 * @param {string} props.color - Chart color
 * @param {string} props.unit - Unit of measurement
 * @returns {JSX.Element} HealthDataChart component
 */
const HealthDataChart = ({ 
  title, 
  data = [], 
  type = 'bar', 
  dataKey = 'value', 
  dateKey = 'date', 
  color = '#4CAF50',
  unit = ''
}) => {
  // Find the maximum value in the data for scaling
  const maxValue = Math.max(...data.map(item => item[dataKey]), 1);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format value for display
  const formatValue = (value) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }
    return value;
  };
  
  return (
    <div className="health-data-chart">
      <h3 className="chart-title">{title}</h3>
      
      <div className="chart-container">
        {/* Y-axis labels */}
        <div className="chart-y-axis">
          <div className="y-axis-label">{formatValue(maxValue)}{unit}</div>
          <div className="y-axis-label">{formatValue(maxValue/2)}{unit}</div>
          <div className="y-axis-label">0{unit}</div>
        </div>
        
        {/* Chart content */}
        <div className="chart-content">
          {data.map((item, index) => {
            const heightPercentage = (item[dataKey] / maxValue) * 100;
            
            return (
              <div key={index} className="chart-bar-container">
                {type === 'bar' ? (
                  <div 
                    className="chart-bar" 
                    style={{ 
                      height: `${heightPercentage}%`, 
                      backgroundColor: color 
                    }}
                    title={`${item[dataKey]}${unit}`}
                  />
                ) : (
                  <div className="chart-point-container" style={{ bottom: `${heightPercentage}%` }}>
                    <div 
                      className="chart-point" 
                      style={{ backgroundColor: color }}
                      title={`${item[dataKey]}${unit}`}
                    />
                    {index < data.length - 1 && (
                      <div 
                        className="chart-line"
                        style={{
                          backgroundColor: color,
                          width: '100%',
                          height: '2px',
                          position: 'absolute',
                          right: '-50%',
                          top: '50%',
                          transform: `rotate(${Math.atan2(
                            (data[index + 1][dataKey] - item[dataKey]) / maxValue * 100,
                            100 / data.length
                          )}rad)`,
                          transformOrigin: 'left center'
                        }}
                      />
                    )}
                  </div>
                )}
                <div className="chart-x-label">{formatDate(item[dateKey])}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: color }}></div>
          <div className="legend-label">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default HealthDataChart;