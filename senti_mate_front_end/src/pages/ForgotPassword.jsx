import React, { useState } from "react";
import { Link } from "react-router-dom";
import ForgotPassword from "../component/ForgotPassword";
import Footer from "../component/Footer";
import Header from "../component/Header";
import "../component/ForgotPassword.css";

/**
 * ForgotPassword page component
 * Provides password reset functionality
 */
const ForgotPasswordPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle successful password reset request
  const handleResetSuccess = (message) => {
    setSuccess(message || "Password reset email sent. Please check your inbox.");
    setError("");
  };

  // Handle password reset error
  const handleResetError = (errorMessage) => {
    setError(errorMessage);
    setSuccess("");
  };


  return (
    <div className="forgot-password-page">
      <Header />
      <div className="forgot-password-container">
        <h1>Reset Your Password</h1>
        <p className="forgot-password-subtitle">Enter your email to receive a password reset link</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <ForgotPassword 
          onResetSuccess={handleResetSuccess} 
          onResetError={handleResetError} 
        />

        <div className="forgot-password-links">
          <p>
            Remember your password? <Link to="/login">Return to Login</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
