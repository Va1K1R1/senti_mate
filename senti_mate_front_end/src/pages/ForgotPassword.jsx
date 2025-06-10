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
      <div> <Header title="Forgot Password"
                    leftChild={<Link to="/">← 홈으로</Link>}
                    rightChild={null}/>
          <div className="forgot-password-page">

            <div className="forgot-password-container">

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <ForgotPassword
                onResetSuccess={handleResetSuccess}
                onResetError={handleResetError}
              />

            </div>
            <Footer />
          </div>
      </div>
  );
};

export default ForgotPasswordPage;
