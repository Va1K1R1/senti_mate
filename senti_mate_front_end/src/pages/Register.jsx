import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Register from "../component/Register";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "../component/Register.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegisterSuccess = () => {
    navigate("/login");
  };

  const handleRegisterError = (msg) => {
    setError(msg);
  };

  return (
      <div className="register-page">
        <Header
            title="Register"
            leftChild={<Link to="/">← 홈으로</Link>}
            rightChild={null}
        />
        <div className="register-container">
          {error && <div className="error-message">{error}</div>}
          <Register
              onRegisterSuccess={handleRegisterSuccess}
              onRegisterError={handleRegisterError}
          />
        </div>
        <Footer />
      </div>
  );
};

export default RegisterPage;
