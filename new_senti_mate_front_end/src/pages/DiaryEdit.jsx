import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';

const DiaryEdit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodScore, setMoodScore] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [isPrivate, setIsPrivate] = useState(true);
  const [emotions, setEmotions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const { getDiaryById, updateDiary } = useDiary();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const diary = await getDiaryById(id);
        if (diary) {
          setTitle(diary.title || '');
          setContent(diary.content || '');
          setMoodScore(diary.moodScore || 5);
          setEnergyLevel(diary.energyLevel || 5);
          setStressLevel(diary.stressLevel || 5);
          setSleepHours(diary.sleepHours || 7);
          setIsPrivate(diary.isPrivate !== undefined ? diary.isPrivate : true);
          setEmotions(diary.emotions || []);
        } else {
          setError('Diary entry not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load diary entry');
      } finally {
        setInitialLoading(false);
      }
    };

    loadDiary();
  }, [id, getDiaryById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      setError('Please provide a title and content for your diary entry');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const updatedDiary = {
        title,
        content,
        moodScore: parseInt(moodScore),
        energyLevel: parseInt(energyLevel),
        stressLevel: parseInt(stressLevel),
        sleepHours: parseFloat(sleepHours),
        isPrivate,
        emotions: emotions.map(emotion => ({
          id: emotion.id,
          name: emotion.name,
          intensity: emotion.intensity
        }))
      };
      
      await updateDiary(id, updatedDiary);
      navigate(`/diary/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update diary entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmotion = () => {
    setEmotions([...emotions, { name: '', intensity: 5 }]);
  };

  const handleEmotionChange = (index, field, value) => {
    const updatedEmotions = [...emotions];
    updatedEmotions[index][field] = value;
    setEmotions(updatedEmotions);
  };

  const handleRemoveEmotion = (index) => {
    const updatedEmotions = [...emotions];
    updatedEmotions.splice(index, 1);
    setEmotions(updatedEmotions);
  };

  if (initialLoading) {
    return <div className="loading">Loading diary entry...</div>;
  }

  return (
    <div className="diary-edit-container">
      <h2>Edit Diary Entry</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="moodScore">Mood Score (1-10)</label>
          <input
            type="range"
            id="moodScore"
            min="1"
            max="10"
            value={moodScore}
            onChange={(e) => setMoodScore(e.target.value)}
            disabled={loading}
          />
          <span>{moodScore}</span>
        </div>
        
        <div className="form-group">
          <label htmlFor="energyLevel">Energy Level (1-10)</label>
          <input
            type="range"
            id="energyLevel"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(e.target.value)}
            disabled={loading}
          />
          <span>{energyLevel}</span>
        </div>
        
        <div className="form-group">
          <label htmlFor="stressLevel">Stress Level (1-10)</label>
          <input
            type="range"
            id="stressLevel"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(e.target.value)}
            disabled={loading}
          />
          <span>{stressLevel}</span>
        </div>
        
        <div className="form-group">
          <label htmlFor="sleepHours">Sleep Hours</label>
          <input
            type="number"
            id="sleepHours"
            min="0"
            max="24"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="isPrivate">Privacy</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="isPrivate">Make this entry private</label>
          </div>
        </div>
        
        <div className="emotions-section">
          <h3>Emotions</h3>
          {emotions.map((emotion, index) => (
            <div key={index} className="emotion-item">
              <input
                type="text"
                placeholder="Emotion name"
                value={emotion.name}
                onChange={(e) => handleEmotionChange(index, 'name', e.target.value)}
                disabled={loading}
              />
              <input
                type="range"
                min="1"
                max="10"
                value={emotion.intensity}
                onChange={(e) => handleEmotionChange(index, 'intensity', parseInt(e.target.value))}
                disabled={loading}
              />
              <span>{emotion.intensity}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveEmotion(index)}
                disabled={loading}
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddEmotion}
            disabled={loading}
          >
            Add Emotion
          </button>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryEdit;