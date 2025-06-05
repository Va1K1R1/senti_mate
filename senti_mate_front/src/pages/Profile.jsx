import React, { useState } from 'react';
import './Profile.css';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

/**
 * Profile page component for displaying and editing user profile information
 * @returns {JSX.Element} Profile page
 */
const Profile = () => {
  const { currentUser } = useAuth();
  
  // State for profile data
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profilePicture, setProfilePicture] = useState(currentUser?.profilePicture || '');
  
  // State for form submission
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Mock statistics
  const statistics = {
    diaryEntries: 15,
    completedTasks: 42,
    streakDays: 7,
    joinDate: new Date(2023, 0, 15).toLocaleDateString()
  };
  
  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, reset form values
      setName(currentUser?.name || '');
      setBio(currentUser?.bio || '');
      setProfilePicture(currentUser?.profilePicture || '');
    }
    setIsEditing(!isEditing);
  };
  
  // Handle profile save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    // Simulate API call to save profile
    setTimeout(() => {
      try {
        // In a real app, this would be an API call
        console.log('Saving profile:', { name, bio, profilePicture });
        
        setIsSaving(false);
        setSaveSuccess(true);
        setIsEditing(false);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (err) {
        console.error('Error saving profile:', err);
        setIsSaving(false);
        setSaveError('Failed to save profile. Please try again.');
      }
    }, 1000);
  };
  
  // Handle profile picture change
  const handleProfilePictureChange = () => {
    // In a real app, this would open a file picker
    // For now, we'll just use a placeholder URL
    setProfilePicture('https://via.placeholder.com/150');
  };
  
  return (
    <div className="profile-page">
      <Header />
      <div className="profile-content">
        <h1 className="profile-title">My Profile</h1>
        
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture-container">
              <img 
                src={profilePicture || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="profile-picture" 
              />
              {isEditing && (
                <button 
                  className="change-picture-btn"
                  onClick={handleProfilePictureChange}
                >
                  Change
                </button>
              )}
            </div>
            
            <div className="profile-info">
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="profile-name-input"
                />
              ) : (
                <h2 className="profile-name">{currentUser?.name || 'User'}</h2>
              )}
              <p className="profile-email">{currentUser?.email || 'user@example.com'}</p>
              
              {!isEditing && (
                <Button 
                  type="primary" 
                  onClick={handleEditToggle}
                  className="edit-profile-btn"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          <div className="profile-body">
            <div className="profile-section">
              <h3>About Me</h3>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="profile-bio-input"
                  rows={4}
                />
              ) : (
                <p className="profile-bio">
                  {currentUser?.bio || 'No bio provided yet.'}
                </p>
              )}
            </div>
            
            <div className="profile-section">
              <h3>Account Statistics</h3>
              <div className="statistics-grid">
                <div className="statistic-item">
                  <span className="statistic-value">{statistics.diaryEntries}</span>
                  <span className="statistic-label">Diary Entries</span>
                </div>
                <div className="statistic-item">
                  <span className="statistic-value">{statistics.completedTasks}</span>
                  <span className="statistic-label">Completed Tasks</span>
                </div>
                <div className="statistic-item">
                  <span className="statistic-value">{statistics.streakDays}</span>
                  <span className="statistic-label">Day Streak</span>
                </div>
                <div className="statistic-item">
                  <span className="statistic-value">{statistics.joinDate}</span>
                  <span className="statistic-label">Join Date</span>
                </div>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="profile-actions">
              {saveSuccess && (
                <div className="success-message">Profile saved successfully!</div>
              )}
              
              {saveError && (
                <div className="error-message">{saveError}</div>
              )}
              
              <div className="action-buttons">
                <Button 
                  type="secondary" 
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;