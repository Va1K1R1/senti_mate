import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiaryList.css';
import DiaryItem from './DiaryItem';
import Button from '../common/Button';
import { useDiary } from '../../context/DiaryContext';

/**
 * DiaryList component for displaying a list of diary entries
 * Uses DiaryContext for state management
 * @returns {JSX.Element} DiaryList component
 */
const DiaryList = () => {
  const { diaries, loading, error } = useDiary();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter diaries based on emotion
  const filteredDiaries = diaries.filter(diary => {
    if (filter === 'all') return true;
    return diary.emotion?.toLowerCase() === filter;
  });

  // Sort diaries based on date
  const sortedDiaries = [...filteredDiaries].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Navigate to new diary page
  const handleNewDiary = () => {
    navigate('/diary/new');
  };

  // Get unique emotions from diaries
  const emotions = ['all', ...new Set(diaries.map(diary => diary.emotion?.toLowerCase()).filter(Boolean))];

  return (
    <div className="diary-list">
      <div className="diary-header">
        <h2>My Diary</h2>
        <Button 
          type="primary" 
          onClick={handleNewDiary}
          className="new-diary-btn"
        >
          New Entry
        </Button>
      </div>

      <div className="diary-filters">
        <div className="emotion-filter">
          {emotions.map(emotion => (
            <button
              key={emotion}
              className={`emotion-filter-btn ${filter === emotion ? 'active' : ''}`}
              onClick={() => setFilter(emotion)}
            >
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </button>
          ))}
        </div>

        <div className="sort-options">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="diary-loading">
          <div className="loading-spinner"></div>
          <p>Loading diary entries...</p>
        </div>
      ) : error ? (
        <div className="diary-error">
          <p>Error loading diary entries: {error}</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="diary-entries">
          {sortedDiaries.length === 0 ? (
            <div className="diary-empty">
              No diary entries found. Create your first entry!
            </div>
          ) : (
            sortedDiaries.map(diary => (
              <DiaryItem key={diary.id} diary={diary} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DiaryList;
