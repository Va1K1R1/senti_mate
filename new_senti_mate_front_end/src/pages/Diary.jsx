import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';
import EmotionService from '../services/EmotionService';

const Diary = () => {
  const { id } = useParams();
  const [diary, setDiary] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  const { getDiaryById, deleteDiary } = useDiary();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const diaryData = await getDiaryById(id);
        if (diaryData) {
          setDiary(diaryData);
          
          // Load emotions if they're not included in the diary data
          if (!diaryData.emotions || diaryData.emotions.length === 0) {
            try {
              const emotionsData = await EmotionService.getEmotionsForDiary(id);
              setEmotions(emotionsData);
            } catch (emotionErr) {
              console.error('Failed to load emotions:', emotionErr);
            }
          } else {
            setEmotions(diaryData.emotions);
          }
        } else {
          setError('Diary entry not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load diary entry');
      } finally {
        setLoading(false);
      }
    };

    loadDiary();
  }, [id, getDiaryById]);

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    setLoading(true);
    try {
      await deleteDiary(id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete diary entry');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading diary entry...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="not-found-container">
        <h2>Diary Entry Not Found</h2>
        <p>The diary entry you're looking for doesn't exist or has been deleted.</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="diary-container">
      <div className="diary-header">
        <h2>{diary.title}</h2>
        <div className="diary-date">{formatDate(diary.createdAt)}</div>
        {diary.updatedAt !== diary.createdAt && (
          <div className="diary-updated">
            Updated: {formatDate(diary.updatedAt)}
          </div>
        )}
      </div>
      
      <div className="diary-content">
        <p>{diary.content}</p>
      </div>
      
      <div className="diary-metrics">
        <div className="metric">
          <span className="metric-label">Mood:</span>
          <span className="metric-value">{diary.moodScore}/10</span>
        </div>
        <div className="metric">
          <span className="metric-label">Energy:</span>
          <span className="metric-value">{diary.energyLevel}/10</span>
        </div>
        <div className="metric">
          <span className="metric-label">Stress:</span>
          <span className="metric-value">{diary.stressLevel}/10</span>
        </div>
        <div className="metric">
          <span className="metric-label">Sleep:</span>
          <span className="metric-value">{diary.sleepHours} hours</span>
        </div>
      </div>
      
      {emotions.length > 0 && (
        <div className="diary-emotions">
          <h3>Emotions</h3>
          <div className="emotions-list">
            {emotions.map((emotion, index) => (
              <div key={index} className="emotion-tag">
                {emotion.name} ({emotion.intensity}/10)
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="diary-privacy">
        {diary.isPrivate ? 'Private Entry' : 'Public Entry'}
      </div>
      
      <div className="diary-actions">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          Back to List
        </button>
        <button 
          className="edit-button"
          onClick={() => navigate(`/diary/edit/${id}`)}
          disabled={loading}
        >
          Edit Entry
        </button>
        <button 
          className={`delete-button ${deleteConfirm ? 'confirm' : ''}`}
          onClick={handleDelete}
          disabled={loading}
        >
          {deleteConfirm ? 'Confirm Delete' : 'Delete Entry'}
        </button>
        {deleteConfirm && (
          <button 
            className="cancel-button"
            onClick={() => setDeleteConfirm(false)}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Diary;