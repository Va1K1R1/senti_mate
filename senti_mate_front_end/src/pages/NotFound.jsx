import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  return (
    <div className="NotFound">
      <Header 
        headText="Page Not Found" 
        leftChild={<Link to="/" className="back_btn">Back to Home</Link>}
      />

      <div className="notfound_container">
        <div className="notfound_content">
          <h1 className="notfound_title">404</h1>
          <p className="notfound_message">Oops! The page you're looking for doesn't exist.</p>
          <p className="notfound_submessage">
            It might have been moved or deleted, or perhaps you mistyped the URL.
          </p>
          <div className="notfound_actions">
            <button onClick={handleGoBack} className="notfound_button notfound_button_back">
              Go Back
            </button>
            <Link to="/" className="notfound_button">
              Go to Home
            </Link>
            <Link to="/dashboard" className="notfound_button notfound_button_secondary">
              Go to Dashboard
            </Link>
          </div>

          <div className="notfound_suggestions">
            <h2 className="notfound_suggestions_title">You might be looking for:</h2>
            <ul className="notfound_suggestions_list">
              <li><Link to="/diary/new" className="notfound_suggestion_link">Create New Diary Entry</Link></li>
              <li><Link to="/todo" className="notfound_suggestion_link">Manage Todo List</Link></li>
              <li><Link to="/settings" className="notfound_suggestion_link">Settings</Link></li>
              <li><Link to="/profile" className="notfound_suggestion_link">Your Profile</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
