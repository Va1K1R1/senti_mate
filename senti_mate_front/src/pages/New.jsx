import React from 'react';
import './New.css';
import Header from '../components/common/Header';
import Editor from '../components/diary/Editor';

/**
 * New page component for creating a new diary entry
 * @returns {JSX.Element} New page
 */
const New = () => {
  return (
    <div className="new-page">
      <Header />
      <div className="new-page-content">
        <Editor />
      </div>
    </div>
  );
};

export default New;