import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Edit.css';
import Header from '../components/common/Header';
import Editor from '../components/diary/Editor';
import Button from '../components/common/Button';
import { useDiary } from '../context/DiaryContext';

/**
 * Edit page component for editing an existing diary entry
 * @returns {JSX.Element} Edit page
 */
const Edit = () => {
  const { id } = useParams();
  const { currentDiary, loading, error, getDiaryById } = useDiary();
  
  // Fetch diary entry when component mounts or ID changes
  useEffect(() => {
    if (id) {
      getDiaryById(id);
    }
  }, [id, getDiaryById]);
  
  return (
    <div className="edit-page">
      <Header />
      <div className="edit-page-content">
        {loading ? (
          <div className="edit-loading">
            <div className="loading-spinner"></div>
            <p>Loading diary entry...</p>
          </div>
        ) : error ? (
          <div className="edit-error">
            <h2>Error Loading Diary Entry</h2>
            <p>{error}</p>
            <Button type="primary" onClick={() => getDiaryById(id)}>
              Try Again
            </Button>
          </div>
        ) : (
          <Editor initialData={currentDiary} isEdit={true} />
        )}
      </div>
    </div>
  );
};

export default Edit;