import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../component/Login";
import Footer from "../component/Footer";
import Header from "../component/Header";
import "../component/Login.css";

/**
 * Login page component
 * Provides user authentication functionality
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Handle successful login
  const handleLoginSuccess = () => {
    navigate("/");
  };

  // Handle login error
  const handleLoginError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <h1>Welcome to SentiMate</h1>
        <p className="login-subtitle">Your personal health diary</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onLoginError={handleLoginError} 
        />
        
        <div className="login-links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;