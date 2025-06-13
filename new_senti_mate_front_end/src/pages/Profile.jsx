import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: null
  });
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);

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
      // Fetch the user profile from the API
      const userData = await UserService.getCurrentUser();

      setProfile({
        ...profile,
        username: userData.username || '',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        profilePicture: userData.profilePicture || null,
        isEmailVerified: userData.isEmailVerified || false
      });
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);

      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile({
          ...profile,
          profilePicture: event.target.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Update user profile
      const userData = {
        username: profile.username,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName
      };

      await UserService.updateCurrentUser(userData);

      // Upload profile picture if selected
      if (profilePictureFile) {
        await UserService.uploadCurrentUserProfilePicture(profilePictureFile);
        setProfilePictureFile(null);
      }

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
      // Update password
      await UserService.updateCurrentUser({
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword
      });

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

  const handleRequestVerification = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await UserService.requestEmailVerification();
      setVerificationSent(true);
      setMessage('Verification email sent successfully');
    } catch (err) {
      setError(err.message || 'Failed to send verification email. Please try again.');
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
      // Delete user account
      const userId = currentUser.id;
      await UserService.deleteUser(userId);

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
        <div className="profile-header">
          <div className="profile-picture-container">
            <img 
              src={profile.profilePicture || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-picture" 
            />
            {editing && (
              <div className="profile-picture-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  id="profile-picture-input"
                  className="profile-picture-input"
                />
                <label htmlFor="profile-picture-input" className="profile-picture-label">
                  Change Picture
                </label>
              </div>
            )}
          </div>

          <div className="profile-info-header">
            <h2>{profile.username}</h2>
            <p className="email">{profile.email}</p>
            {!profile.isEmailVerified && (
              <div className="email-verification">
                <p className="not-verified">Email not verified</p>
                {verificationSent ? (
                  <p className="verification-sent">Verification email sent!</p>
                ) : (
                  <button 
                    onClick={handleRequestVerification} 
                    disabled={loading}
                    className="verify-button"
                  >
                    Verify Email
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

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

            <div className="profile-field">
              <span className="field-label">First Name:</span>
              <span className="field-value">{profile.firstName || 'Not set'}</span>
            </div>

            <div className="profile-field">
              <span className="field-label">Last Name:</span>
              <span className="field-value">{profile.lastName || 'Not set'}</span>
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

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                disabled={loading}
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
