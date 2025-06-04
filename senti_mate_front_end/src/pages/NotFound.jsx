import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../component/Header';
import './NotFound.css';

const NotFound = () => {
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
            <Link to="/" className="notfound_button">
              Go to Home
            </Link>
            <Link to="/dashboard" className="notfound_button notfound_button_secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;