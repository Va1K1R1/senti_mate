import React from 'react';
import './EmotionItem.css';

/**
 * EmotionItem component for selecting an emotion in the diary editor
 * @param {Object} props - Component props
 * @param {Object} props.emotion - Emotion object with name and color
 * @param {boolean} props.isSelected - Whether this emotion is selected
 * @param {function} props.onClick - Click handler function
 * @returns {JSX.Element} EmotionItem component
 */
const EmotionItem = ({ emotion, isSelected, onClick }) => {
  return (
    <div 
      className={`emotion-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ borderColor: isSelected ? emotion.color : 'transparent' }}
    >
      <div 
        className="emotion-color" 
        style={{ backgroundColor: emotion.color }}
      />
      <span className="emotion-name">
        {emotion.name.charAt(0).toUpperCase() + emotion.name.slice(1)}
      </span>
    </div>
  );
};

export default EmotionItem;