import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DiaryItem.css';

/**
 * DiaryItem component for displaying a single diary entry in a list
 * @param {Object} props - Component props
 * @param {Object} props.diary - Diary entry object
 * @returns {JSX.Element} DiaryItem component
 */
const DiaryItem = ({ diary }) => {
  const navigate = useNavigate();
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Function to truncate text
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // Navigate to diary detail page when clicked
  const handleClick = () => {
    navigate(`/diary/${diary.id}`);
  };
  
  // Get emotion color based on emotion type
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      happy: '#FFD700', // Gold
      sad: '#6495ED',   // Cornflower Blue
      angry: '#FF6347',  // Tomato
      anxious: '#9370DB', // Medium Purple
      calm: '#98FB98',   // Pale Green
      default: '#A9A9A9'  // Dark Gray
    };
    
    return emotionColors[emotion?.toLowerCase()] || emotionColors.default;
  };

  return (
    <div className="diary-item" onClick={handleClick}>
      <div 
        className="diary-emotion" 
        style={{ backgroundColor: getEmotionColor(diary.emotion) }}
      >
        {diary.emotion}
      </div>
      
      <div className="diary-content">
        <h3 className="diary-title">{diary.title}</h3>
        <p className="diary-preview">{truncateText(diary.content)}</p>
        <div className="diary-date">{formatDate(diary.date)}</div>
      </div>
    </div>
  );
};

export default DiaryItem;