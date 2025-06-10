import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import Header from "./Header.jsx";

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
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

            // Call the onLogin callback with the form data
            if (onLogin) {
                onLogin(formData);
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors({
                form: "Login failed. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div> <Header title="Login"
                      leftChild={<Link to="/">← 홈으로</Link>}
                      rightChild={null}/>
            <div className="Login">
                <div className="LoginContainer">
                    <div className="LoginHeader">
                        <h2>Welcome Back</h2>
                        <p>Sign in to continue to SentiMate</p>
                    </div>

                    {errors.form && (
                        <div className="ErrorMessage">{errors.form}</div>
                    )}

                    <form onSubmit={handleSubmit}>
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
                                placeholder="Enter your password"
                                className={errors.password ? "error" : ""}
                            />
                            {errors.password && (
                                <div className="ErrorMessage">{errors.password}</div>
                            )}
                        </div>

                        <div className="FormGroup Checkbox">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>

                        <button
                            type="submit"
                            className="LoginButton"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="LoginFooter">
                        <Link to="/forgot-password" className="ForgotPassword">
                            Forgot Password?
                        </Link>
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register" className="RegisterLink">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
