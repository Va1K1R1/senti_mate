import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import Header from "./Header.jsx";
import AuthService from "../services/AuthService";

const Register = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = "You must agree to the terms and conditions";
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
            // Use AuthService to register
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            const response = await AuthService.register(userData);

            // Call the onRegister callback with the response data
            if (onRegister) {
                onRegister(response);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setErrors({
                form: "Registration failed. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div> <Header title="Register"
                      leftChild={<Link to="/">← 홈으로</Link>}
                      rightChild={null}/>
        <div className="Register">
            <div className="RegisterContainer">
                <div className="RegisterHeader">
                    <h2>Create Account</h2>
                    <p>Sign up to start using SentiMate</p>
                </div>

                {errors.form && (
                    <div className="ErrorMessage">{errors.form}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="FormGroup">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={errors.name ? "error" : ""}
                        />
                        {errors.name && (
                            <div className="ErrorMessage">{errors.name}</div>
                        )}
                    </div>

                    <div className="FormGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={errors.email ? "error" : ""}
                        />
                        {errors.email && (
                            <div className="ErrorMessage">{errors.email}</div>
                        )}
                    </div>

                    <div className="FormGroup">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className={errors.password ? "error" : ""}
                        />
                        {errors.password && (
                            <div className="ErrorMessage">{errors.password}</div>
                        )}
                    </div>

                    <div className="FormGroup">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className={errors.confirmPassword ? "error" : ""}
                        />
                        {errors.confirmPassword && (
                            <div className="ErrorMessage">{errors.confirmPassword}</div>
                        )}
                    </div>

                    <div className="FormGroup Checkbox">
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className={errors.agreeTerms ? "error" : ""}
                        />
                        <label htmlFor="agreeTerms">
                            I agree to the <a href="/terms" className="TermsLink">Terms and Conditions</a>
                        </label>
                    </div>
                    {errors.agreeTerms && (
                        <div className="ErrorMessage">{errors.agreeTerms}</div>
                    )}

                    <button
                        type="submit"
                        className="RegisterButton"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="RegisterFooter">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="LoginLink">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Register;
