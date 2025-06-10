import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Note: This is a placeholder. The actual implementation would depend on
      // the backend's password reset functionality.
      // For now, we'll simulate a successful request.
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Password reset instructions have been sent to your email.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              placeholder="Enter your registered email"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        <div className="reset-instructions">
          <p>
            We've sent password reset instructions to your email address.
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <p>
            If you don't receive an email within a few minutes, please check your spam folder.
          </p>
        </div>
      )}
      
      <div className="auth-links">
        <p>
          Remember your password? <Link to="/login">Login</Link>
        </p>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;