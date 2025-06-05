import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Diary.css';
import Header from '../components/common/Header';
import Viewer from '../components/diary/Viewer';
import Button from '../components/common/Button';
import { useDiary } from '../context/DiaryContext';

/**
 * Diary page component for viewing a specific diary entry
 * @returns {JSX.Element} Diary page
 */
const Diary = () => {
  const { id } = useParams();
  const { currentDiary, loading, error, getDiaryById } = useDiary();
  
  // Fetch diary entry when component mounts or ID changes
  useEffect(() => {
    if (id) {
      getDiaryById(id);
    }
  }, [id, getDiaryById]);
  
  return (
    <div className="diary-page">
      <Header />
      <div className="diary-page-content">
        {loading ? (
          <div className="diary-loading">
            <div className="loading-spinner"></div>
            <p>Loading diary entry...</p>
          </div>
        ) : error ? (
          <div className="diary-error">
            <h2>Error Loading Diary Entry</h2>
            <p>{error}</p>
            <Button type="primary" onClick={() => getDiaryById(id)}>
              Try Again
            </Button>
          </div>
        ) : (
          <Viewer diary={currentDiary} />
        )}
      </div>
    </div>
  );
};

export default Diary;