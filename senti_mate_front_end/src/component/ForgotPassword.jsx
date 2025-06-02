import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const handleChange = (e) => {
        setEmail(e.target.value);
        
        // Clear error when user starts typing
        if (errors.email) {
            setErrors({});
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Call the onSubmit callback with the email
            if (onSubmit) {
                onSubmit(email);
            }
            
            // Show success message
            setIsSubmitted(true);
        } catch (error) {
            console.error("Password reset error:", error);
            setErrors({
                form: "Password reset request failed. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="ForgotPassword">
            <div className="ForgotPasswordContainer">
                <div className="ForgotPasswordHeader">
                    <h2>Forgot Password</h2>
                    <p>Enter your email to reset your password</p>
                </div>
                
                {isSubmitted ? (
                    <div className="SuccessMessage">
                        <div className="SuccessIcon">✓</div>
                        <h3>Check Your Email</h3>
                        <p>
                            We've sent a password reset link to <strong>{email}</strong>.
                            Please check your inbox and follow the instructions.
                        </p>
                        <Link to="/login" className="BackToLoginButton">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        {errors.form && (
                            <div className="ErrorMessage">{errors.form}</div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="FormGroup">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={errors.email ? "error" : ""}
                                />
                                {errors.email && (
                                    <div className="ErrorMessage">{errors.email}</div>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="ResetButton"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Reset Password"}
                            </button>
                        </form>
                        
                        <div className="ForgotPasswordFooter">
                            <Link to="/login" className="BackLink">
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;