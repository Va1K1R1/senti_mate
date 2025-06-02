import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Register from "../component/Register";
import Footer from "../component/Footer";
import Header from "../component/Header";
import "../component/Register.css";

/**
 * Register page component
 * Provides user registration functionality
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Handle successful registration
  const handleRegisterSuccess = () => {
    navigate("/login");
  };

  // Handle registration error
  const handleRegisterError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="register-page">
      <Header />
      <div className="register-container">
        <h1>Create an Account</h1>
        <p className="register-subtitle">Join SentiMate and start tracking your health journey</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <Register 
          onRegisterSuccess={handleRegisterSuccess} 
          onRegisterError={handleRegisterError} 
        />
        
        <div className="register-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;