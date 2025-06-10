import React from 'react';
import Header from '../components/common/Header';
import DiaryList from '../components/diary/DiaryList';
import './DiaryList.css';

/**
 * DiaryList page component for displaying a list of diary entries
 * @returns {JSX.Element} DiaryList page
 */
const DiaryListPage = () => {
  return (
    <div className="diary-list-page">
      <Header />
      <div className="diary-list-page-content">
        <DiaryList />
      </div>
    </div>
  );
};

export default DiaryListPage;