// src/component/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import Header from "./Header.jsx";
import AuthService from "../services/AuthService";

const Login = ({ onLoginSuccess, onLoginError }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErr = {};
        if (!formData.email) newErr.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErr.email = "Email is invalid";
        if (!formData.password) newErr.password = "Password is required";
        else if (formData.password.length < 6) newErr.password = "Password must be at least 6 characters";
        setErrors(newErr);
        return Object.keys(newErr).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            // AuthService.login(username, password) 호출
            await AuthService.login(formData.email, formData.password);
            onLoginSuccess();
        } catch (err) {
            // 서버 메시지를 우선 보여주고, 없으면 기본 메시지 사용
            const msg = err.response?.data?.message || err.message || "Login failed. Please try again.";
            setErrors({ form: msg });
            onLoginError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header
                title="Login"
                leftChild={<Link to="/">← 홈으로</Link>}
                rightChild={null}
            />
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
