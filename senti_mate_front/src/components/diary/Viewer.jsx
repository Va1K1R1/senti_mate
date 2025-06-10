import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Viewer.css';
import Button from '../common/Button';
import { useDiary } from '../../context/DiaryContext';

/**
 * Viewer component for displaying diary entry details
 * @param {Object} props - Component props
 * @param {Object} props.diary - Diary entry object to display
 * @returns {JSX.Element} Viewer component
 */
const Viewer = ({ diary }) => {
  const navigate = useNavigate();
  const { deleteDiary } = useDiary();

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  // Handle edit button
  const handleEdit = () => {
    navigate(`/diary/edit/${diary.id}`);
  };

  // Handle delete button with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this diary entry?')) {
      deleteDiary(diary.id);
      navigate('/');
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate('/');
  };

  if (!diary) {
    return (
      <div className="diary-viewer diary-not-found">
        <h2>Diary entry not found</h2>
        <Button type="primary" onClick={handleBack}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="diary-viewer">
      <div className="viewer-header">
        <h2 className="viewer-title">{diary.title}</h2>
        <div className="viewer-meta">
          <div 
            className="viewer-emotion" 
            style={{ backgroundColor: getEmotionColor(diary.emotion) }}
          >
            {diary.emotion}
          </div>
          <div className="viewer-date">{formatDate(diary.date)}</div>
        </div>
      </div>

      <div className="viewer-content">
        {diary.content ? diary.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        )) : <p>No content available</p>}
      </div>

      <div className="viewer-actions">
        <Button type="secondary" onClick={handleBack}>
          Back
        </Button>
        <div className="viewer-action-buttons">
          <Button type="primary" onClick={handleEdit}>
            Edit
          </Button>
          <Button type="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
