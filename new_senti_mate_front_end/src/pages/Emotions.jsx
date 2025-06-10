import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmotionService from '../services/EmotionService';
import DiaryService from '../services/DiaryService';

const Emotions = () => {
  const [emotions, setEmotions] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDiary, setSelectedDiary] = useState('');
  const [newEmotion, setNewEmotion] = useState({
    name: '',
    intensity: 5,
    diaryEntry: null
  });
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load diaries first
      const diaryData = await DiaryService.getAllDiaries();
      setDiaries(diaryData);
      
      // Load all emotions
      const emotionData = await EmotionService.getAllEmotions();
      setEmotions(emotionData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmotion({
      ...newEmotion,
      [name]: name === 'intensity' ? parseInt(value) : value
    });
  };

  const handleDiaryChange = (e) => {
    const diaryId = e.target.value;
    setSelectedDiary(diaryId);
    
    if (diaryId) {
      setNewEmotion({
        ...newEmotion,
        diaryEntry: { id: parseInt(diaryId) }
      });
    } else {
      setNewEmotion({
        ...newEmotion,
        diaryEntry: null
      });
    }
  };

  const handleAddEmotion = async (e) => {
    e.preventDefault();
    
    if (!newEmotion.name || !newEmotion.diaryEntry) {
      setError('Please provide an emotion name and select a diary entry');
      return;
    }
    
    setLoading(true);
    try {
      const createdEmotion = await EmotionService.createEmotion(newEmotion);
      setEmotions([...emotions, createdEmotion]);
      setNewEmotion({
        name: '',
        intensity: 5,
        diaryEntry: null
      });
      setSelectedDiary('');
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add emotion');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmotion = async (id) => {
    setLoading(true);
    try {
      await EmotionService.deleteEmotion(id);
      setEmotions(emotions.filter(emotion => emotion.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete emotion');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDiaryTitle = (diaryId) => {
    const diary = diaries.find(d => d.id === diaryId);
    return diary ? diary.title : 'Unknown Diary';
  };

  if (loading && emotions.length === 0) {
    return <div className="loading">Loading your emotions data...</div>;
  }

  return (
    <div className="emotions-container">
      <h1>Emotions</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="emotions-actions">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-emotion-button"
        >
          {showAddForm ? 'Cancel' : 'Add Emotion'}
        </button>
      </div>
      
      {showAddForm && (
        <form onSubmit={handleAddEmotion} className="emotion-form">
          <div className="form-group">
            <label htmlFor="name">Emotion Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newEmotion.name}
              onChange={handleInputChange}
              disabled={loading}
              required
              placeholder="e.g., Happy, Sad, Anxious, etc."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="intensity">Intensity (1-10)</label>
            <input
              type="range"
              id="intensity"
              name="intensity"
              min="1"
              max="10"
              value={newEmotion.intensity}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span>{newEmotion.intensity}</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="diaryEntry">Diary Entry</label>
            <select
              id="diaryEntry"
              name="diaryEntry"
              value={selectedDiary}
              onChange={handleDiaryChange}
              disabled={loading}
              required
            >
              <option value="">Select a diary entry</option>
              {diaries.map(diary => (
                <option key={diary.id} value={diary.id}>
                  {diary.title} ({formatDate(diary.createdAt)})
                </option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Adding...' : 'Add Emotion'}
          </button>
        </form>
      )}
      
      <div className="emotions-list">
        {emotions.length === 0 ? (
          <div className="no-emotions">
            No emotions recorded yet. Add some emotions to get started!
          </div>
        ) : (
          <div className="emotions-grid">
            {emotions.map(emotion => (
              <div key={emotion.id} className="emotion-card">
                <div className="emotion-card-header">
                  <h3 className="emotion-name">{emotion.name}</h3>
                  <button
                    onClick={() => handleDeleteEmotion(emotion.id)}
                    disabled={loading}
                    className="delete-button"
                    aria-label="Delete emotion"
                  >
                    ×
                  </button>
                </div>
                <div className="emotion-intensity">
                  Intensity: {emotion.intensity}/10
                </div>
                {emotion.diaryEntry && (
                  <div className="emotion-diary">
                    Diary: {getDiaryTitle(emotion.diaryEntry.id)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="emotions-actions">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Emotions;