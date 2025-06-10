import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header.jsx";
import AuthService from "../services/AuthService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErr = {};
    if (!email) newErr.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErr.email = "Email is invalid";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // 백엔드에 forgot-password 엔드포인트가 있다면 아래처럼 호출
      await AuthService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setErrors({ form: err.message || "Request failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div>
        <Header
            title="Forgot Password"
            leftChild={<Link to="/login">← Back to Login</Link>}
            rightChild={null}
        />
        <div className="ForgotPassword">
          <div className="ForgotPasswordContainer">
            {isSubmitted ? (
                <div className="SuccessMessage">
                  <h3>Check Your Email</h3>
                  <p>
                    We've sent a reset link to <strong>{email}</strong>.
                  </p>
                  <Link to="/login" className="BackToLoginButton">
                    Back to Login
                  </Link>
                </div>
            ) : (
                <>
                  {errors.form && <div className="ErrorMessage">{errors.form}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="FormGroup">
                      <label htmlFor="email">Email</label>
                      <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setErrors({}); }}
                          placeholder="Enter your email"
                          className={errors.email ? "error" : ""}
                      />
                      {errors.email && <div className="ErrorMessage">{errors.email}</div>}
                    </div>
                    <button
                        type="submit"
                        className="ResetButton"
                        disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Reset Password"}
                    </button>
                  </form>
                </>
            )}
          </div>
        </div>
      </div>
  );
};

export default ForgotPassword;
