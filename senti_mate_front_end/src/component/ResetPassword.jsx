import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import './ResetPassword.css';

/**
 * ResetPassword component for resetting user password
 * @returns {JSX.Element} The rendered ResetPassword component
 */
const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    // Form state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [error, setError] = useState('');
    
    // Validation state
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    
    // Password requirements
    const passwordRequirements = [
        { id: 'length', label: '8자 이상', regex: /.{8,}/ },
        { id: 'uppercase', label: '대문자 포함', regex: /[A-Z]/ },
        { id: 'lowercase', label: '소문자 포함', regex: /[a-z]/ },
        { id: 'number', label: '숫자 포함', regex: /[0-9]/ },
        { id: 'special', label: '특수문자 포함', regex: /[!@#$%^&*(),.?":{}|<>]/ }
    ];
    
    // Validate password against requirements
    const validatePassword = (value) => {
        const errors = passwordRequirements.filter(req => !req.regex.test(value))
            .map(req => req.id);
        setPasswordErrors(errors);
        return errors.length === 0;
    };
    
    // Validate confirm password
    const validateConfirmPassword = (value) => {
        if (value !== password) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };
    
    // Handle password change
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
        
        // If confirm password is not empty, validate it again
        if (confirmPassword) {
            validateConfirmPassword(confirmPassword);
        }
    };
    
    // Handle confirm password change
    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        validateConfirmPassword(value);
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
        
        if (!isPasswordValid || !isConfirmPasswordValid) {
            return;
        }
        
        // Check if token exists
        if (!token) {
            setError('유효하지 않은 비밀번호 재설정 링크입니다.');
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            // Call API to reset password
            // This is a placeholder for the actual API call
            // Replace with your actual API call
            // await authService.resetPassword(token, password);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Set success state
            setResetSuccess(true);
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/login', { 
                    state: { message: '비밀번호가 성공적으로 재설정되었습니다. 새 비밀번호로 로그인하세요.' } 
                });
            }, 3000);
        } catch (error) {
            setError('비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Check if token exists on component mount
    useEffect(() => {
        if (!token) {
            setError('유효하지 않은 비밀번호 재설정 링크입니다. 비밀번호 재설정을 다시 요청해주세요.');
        }
    }, [token]);
    
    // If reset was successful, show success message
    if (resetSuccess) {
        return (
            <div className="ResetPassword">
                <div className="ResetPassword-success">
                    <h2>비밀번호 재설정 완료</h2>
                    <p>비밀번호가 성공적으로 재설정되었습니다.</p>
                    <p>잠시 후 로그인 페이지로 이동합니다...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="ResetPassword">
            <h2>비밀번호 재설정</h2>
            
            {error && (
                <div className="ResetPassword-error" role="alert">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="ResetPassword-form">
                <div className="form-group">
                    <label htmlFor="password">새 비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        disabled={isSubmitting}
                        aria-invalid={passwordErrors.length > 0}
                        aria-describedby="password-requirements"
                        required
                    />
                    
                    <div id="password-requirements" className="password-requirements">
                        <p>비밀번호는 다음 조건을 만족해야 합니다:</p>
                        <ul>
                            {passwordRequirements.map(req => (
                                <li 
                                    key={req.id} 
                                    className={passwordErrors.includes(req.id) ? 'invalid' : password ? 'valid' : ''}
                                >
                                    {req.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        disabled={isSubmitting}
                        aria-invalid={!!confirmPasswordError}
                        aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                        required
                    />
                    
                    {confirmPasswordError && (
                        <div id="confirm-password-error" className="error-message">
                            {confirmPasswordError}
                        </div>
                    )}
                </div>
                
                <Button
                    type="primary"
                    text={isSubmitting ? "처리 중..." : "비밀번호 재설정"}
                    disabled={isSubmitting || passwordErrors.length > 0 || !!confirmPasswordError || !password || !confirmPassword}
                    className="ResetPassword-submit"
                />
                
                <div className="ResetPassword-links">
                    <a href="/login" className="link">로그인 페이지로 돌아가기</a>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;