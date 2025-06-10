import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../component/Login";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "../component/Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLoginSuccess = () => {
    navigate("/");
  };

  const handleLoginError = (msg) => {
    setError(msg);
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
