import React from 'react';
import './HealthDataCard.css';

/**
 * HealthDataCard component for displaying health metrics
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.value - Main value to display
 * @param {string} props.unit - Unit of measurement
 * @param {string} props.icon - Icon name or emoji
 * @param {string} props.trend - Trend direction ('up', 'down', 'neutral')
 * @param {string} props.trendValue - Value of the trend
 * @param {string} props.color - Card accent color
 * @param {function} props.onClick - Click handler function
 * @returns {JSX.Element} HealthDataCard component
 */
const HealthDataCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  trend, 
  trendValue, 
  color = '#4CAF50',
  onClick 
}) => {
  // Get trend icon based on trend direction
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  // Get trend color based on trend direction and context
  const getTrendColor = () => {
    // For steps and exercise, up is good
    if ((title.toLowerCase().includes('step') || title.toLowerCase().includes('exercise')) && trend === 'up') {
      return '#4CAF50'; // Green
    }
    
    // For heart rate, neutral is good
    if (title.toLowerCase().includes('heart') && trend === 'neutral') {
      return '#4CAF50'; // Green
    }
    
    // For sleep, up is good if below 8 hours, neutral if around 8 hours, down is good if above 9 hours
    if (title.toLowerCase().includes('sleep')) {
      const hours = parseFloat(value);
      if ((hours < 8 && trend === 'up') || (hours > 9 && trend === 'down') || (hours >= 8 && hours <= 9 && trend === 'neutral')) {
        return '#4CAF50'; // Green
      }
    }
    
    // Default colors based on trend
    switch (trend) {
      case 'up':
        return '#f44336'; // Red
      case 'down':
        return '#f44336'; // Red
      default:
        return '#4CAF50'; // Green
    }
  };

  return (
    <div 
      className="health-data-card" 
      onClick={onClick}
      style={{ borderColor: color }}
    >
      <div className="health-data-header">
        <span className="health-data-icon">{icon}</span>
        <h3 className="health-data-title">{title}</h3>
      </div>
      
      <div className="health-data-value-container">
        <span className="health-data-value">{value}</span>
        {unit && <span className="health-data-unit">{unit}</span>}
      </div>
      
      {trend && trendValue && (
        <div className="health-data-trend" style={{ color: getTrendColor() }}>
          <span className="trend-icon">{getTrendIcon()}</span>
          <span className="trend-value">{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default HealthDataCard;