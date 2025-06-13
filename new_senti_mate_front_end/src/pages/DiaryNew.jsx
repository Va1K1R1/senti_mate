import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';

const DiaryNew = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
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
        isPrivate
      };

      const createdDiary = await addDiary(newDiary);
      navigate(`/diary/${createdDiary.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create diary entry. Please try again.');
    } finally {
      setLoading(false);
    }
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
