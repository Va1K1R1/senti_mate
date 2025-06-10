import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadUserProfile();
  }, [isAuthenticated, navigate]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch the user profile from the API
      // For now, we'll use the currentUser from AuthContext
      if (currentUser) {
        setProfile({
          ...profile,
          username: currentUser.username || '',
          email: currentUser.email || ''
        });
      }
    } catch (err) {
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      // In a real app, you would call the API to update the user profile
      // For now, we'll simulate a successful update
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the currentUser in AuthContext
      // This would typically be handled by the API response
      
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (profile.newPassword !== profile.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (profile.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      // In a real app, you would call the API to change the password
      // For now, we'll simulate a successful password change
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessage('Password changed successfully');
      setChangingPassword(false);
      setProfile({
        ...profile,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      // In a real app, you would call the API to delete the account
      // For now, we'll simulate a successful account deletion
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Log the user out
      logout();
      
      // Redirect to the login page
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="profile-section">
        <h2>Account Information</h2>
        
        {!editing ? (
          <div className="profile-info">
            <div className="profile-field">
              <span className="field-label">Username:</span>
              <span className="field-value">{profile.username}</span>
            </div>
            
            <div className="profile-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{profile.email}</span>
            </div>
            
            <button 
              onClick={() => setEditing(true)}
              disabled={loading}
              className="edit-button"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setEditing(false)}
                disabled={loading}
                className="cancel-button"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                disabled={loading}
                className="save-button"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="profile-section">
        <h2>Password</h2>
        
        {!changingPassword ? (
          <button 
            onClick={() => setChangingPassword(true)}
            disabled={loading}
            className="change-password-button"
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={profile.currentPassword}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={profile.newPassword}
                onChange={handleInputChange}
                disabled={loading}
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                required
                minLength="6"
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setChangingPassword(false)}
                disabled={loading}
                className="cancel-button"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                disabled={loading}
                className="save-button"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="profile-section danger-zone">
        <h2>Danger Zone</h2>
        
        <div className="danger-action">
          <div className="danger-description">
            <h3>Delete Account</h3>
            <p>
              This will permanently delete your account and all your data.
              This action cannot be undone.
            </p>
          </div>
          
          <button 
            onClick={handleDeleteAccount}
            disabled={loading}
            className="delete-account-button"
          >
            Delete Account
          </button>
        </div>
      </div>
      
      <div className="profile-actions">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;