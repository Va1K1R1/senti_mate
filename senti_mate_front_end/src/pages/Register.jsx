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

      <div className="register-container">

        
        {error && <div className="error-message">{error}</div>}
        
        <Register 
          onRegisterSuccess={handleRegisterSuccess} 
          onRegisterError={handleRegisterError} 
        />
        
        <div className="register-links">

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;