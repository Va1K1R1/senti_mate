import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';

const DiaryNew = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // Mood and health data will be retrieved from API, no need for manual input
  const [isPrivate, setIsPrivate] = useState(true);
  const [emotions, setEmotions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { addDiary } = useDiary();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Please provide a title and content for your diary entry');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const newDiary = {
        title,
        content,
        // Mood and health data will be retrieved from API
        isPrivate,
        emotions: emotions.map(emotion => ({
          name: emotion.name,
          intensity: emotion.intensity
        }))
      };

      const createdDiary = await addDiary(newDiary);
      navigate(`/diary/${createdDiary.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create diary entry. Please try again.');
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

  return (
    <div className="diary-new-container">
      <h2>Create New Diary Entry</h2>

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

        {/* Mood and health data input fields removed as data will be retrieved from API */}

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
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryNew;
