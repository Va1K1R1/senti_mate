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

      <div className="login-container">

        {error && <div className="error-message">{error}</div>}
        
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onLoginError={handleLoginError} 
        />
        
        </div>
      <Footer />
    </div>
  );
};

export default LoginPage;