import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import './ErrorPage.css';

const ErrorPage = ({ error, resetError }) => {
  const navigate = useNavigate();
  
  // Default error message if none provided
  const errorMessage = error?.message || 'Something went wrong';
  const errorDetails = error?.stack || 'No additional details available';
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleReset = () => {
    if (resetError) {
      resetError();
    } else {
      // If no reset function provided, just go to home
      navigate('/');
    }
  };
  
  return (
    <div className="ErrorPage">
      <Header 
        headText="Error Occurred" 
        leftChild={<button onClick={handleGoBack} className="back_btn">Go Back</button>}
      />
      
      <div className="error_container">
        <div className="error_content">
          <h1 className="error_title">Oops!</h1>
          <p className="error_message">{errorMessage}</p>
          
          <div className="error_actions">
            <button onClick={handleReset} className="error_button">
              Try Again
            </button>
            <Link to="/" className="error_button error_button_secondary">
              Go to Home
            </Link>
            <Link to="/dashboard" className="error_button error_button_secondary">
              Go to Dashboard
            </Link>
          </div>
          
          <div className="error_details_container">
            <details>
              <summary>Technical Details</summary>
              <pre className="error_details">{errorDetails}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;