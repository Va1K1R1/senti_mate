import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TiltCard from '../common/TiltCard';
import { useTheme } from '../../styles/theme';
import '../../styles/DiaryCard.css';

const DiaryCard = ({ diary }) => {
  const { darkMode } = useTheme();
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getMoodEmoji = (score) => {
    if (score >= 8) return '😄';
    if (score >= 6) return '🙂';
    if (score >= 4) return '😐';
    if (score >= 2) return '😔';
    return '😢';
  };
  
  const getEnergyEmoji = (level) => {
    if (level >= 8) return '⚡';
    if (level >= 6) return '💪';
    if (level >= 4) return '👍';
    if (level >= 2) return '👎';
    return '😴';
  };
  
  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <TiltCard className="diary-tilt-card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{diary.title}</h3>
          <span className="card-date">{formatDate(diary.createdAt)}</span>
        </div>
        
        <div className="card-body">
          <p>{truncateText(diary.content)}</p>
        </div>
        
        <div className="card-footer">
          <div className="card-metrics">
            <span className="mood">
              {getMoodEmoji(diary.moodScore)} {diary.moodScore}/10
            </span>
            <span className="energy">
              {getEnergyEmoji(diary.energyLevel)} {diary.energyLevel}/10
            </span>
          </div>
          
          <div className="card-actions">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={`/diary/${diary.id}`} 
                className={`view-button ${darkMode ? 'dark' : 'light'}`}
              >
                View Entry
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default DiaryCard;