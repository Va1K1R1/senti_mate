import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Editor.css';
import Button from '../common/Button';
import EmotionItem from './EmotionItem';
import { useDiary } from '../../context/DiaryContext';

/**
 * Editor component for creating and editing diary entries
 * @param {Object} props - Component props
 * @param {Object} [props.initialData] - Initial diary data for editing (null for new entry)
 * @param {boolean} [props.isEdit=false] - Whether this is an edit operation
 * @returns {JSX.Element} Editor component
 */
const Editor = ({ initialData = null, isEdit = false }) => {
  const navigate = useNavigate();
  const { addDiary, updateDiary } = useDiary();

  // State for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Available emotions
  const emotions = [
    { name: 'happy', color: '#FFD700' },
    { name: 'sad', color: '#6495ED' },
    { name: 'angry', color: '#FF6347' },
    { name: 'anxious', color: '#9370DB' },
    { name: 'calm', color: '#98FB98' }
  ];

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setEmotion(initialData.emotion || '');
      if (initialData.date) {
        setDate(new Date(initialData.date).toISOString().slice(0, 10));
      }
    }
  }, [initialData]);

  // State for loading and error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!content.trim()) {
      alert('Please enter content');
      return;
    }

    if (!emotion) {
      alert('Please select an emotion');
      return;
    }

    const diaryData = {
      title,
      content,
      emotion,
      date: new Date(date).toISOString()
    };

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit && initialData) {
        await updateDiary(initialData.id, diaryData);
        navigate(`/diary/${initialData.id}`);
      } else {
        const newDiary = await addDiary(diaryData);
        navigate(`/diary/${newDiary.id}`);
      }
    } catch (error) {
      console.error('Error saving diary:', error);
      setError(error.message || 'Failed to save diary entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    if (isEdit && initialData) {
      navigate(`/diary/${initialData.id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="diary-editor">
      <h2 className="editor-title">{isEdit ? 'Edit Diary Entry' : 'New Diary Entry'}</h2>

      <form className="editor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your entry"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>How are you feeling?</label>
          <div className="emotion-selector">
            {emotions.map((item) => (
              <EmotionItem
                key={item.name}
                emotion={item}
                isSelected={emotion === item.name}
                onClick={() => setEmotion(item.name)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day and how you're feeling..."
            rows={10}
            required
          />
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="editor-buttons">
          <Button 
            type="secondary" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="primary"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Saving...' 
              : isEdit ? 'Save Changes' : 'Save Entry'
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Editor;
