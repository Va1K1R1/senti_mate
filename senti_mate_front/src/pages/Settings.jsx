import React, { useState } from 'react';
import './Settings.css';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

/**
 * Settings page component for configuring application settings
 * @returns {JSX.Element} Settings page
 */
const Settings = () => {
  const { currentUser, logout } = useAuth();

  // State for settings
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState('en');

  // State for form submission
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Handle settings save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    // Simulate API call to save settings
    setTimeout(() => {
      try {
        // In a real app, this would be an API call
        localStorage.setItem('settings', JSON.stringify({
          theme,
          notifications,
          emailNotifications,
          language
        }));

        setIsSaving(false);
        setSaveSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (err) {
        console.error('Error saving settings:', err);
        setIsSaving(false);
        setSaveError('Failed to save settings. Please try again.');
      }
    }, 1000);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect happens automatically via AuthContext
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="settings-page">
      <Header />
      <div className="settings-content">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-container">
          <div className="settings-section">
            <h2>Appearance</h2>
            <form onSubmit={handleSaveSettings}>
              <div className="form-group">
                <label htmlFor="theme">Theme</label>
                <select 
                  id="theme" 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
                <small>Choose how SentiMate looks to you</small>
              </div>

              <div className="form-group">
                <label htmlFor="language">Language</label>
                <select 
                  id="language" 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
                <small>Choose your preferred language (Coming soon)</small>
              </div>
            </form>
          </div>

          <div className="settings-section">
            <h2>Notifications</h2>
            <form>
              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={notifications} 
                    onChange={(e) => setNotifications(e.target.checked)} 
                  />
                  Enable in-app notifications
                </label>
                <small>Receive notifications about diary reminders and insights</small>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={emailNotifications} 
                    onChange={(e) => setEmailNotifications(e.target.checked)} 
                  />
                  Enable email notifications
                </label>
                <small>Receive email notifications (Coming soon)</small>
              </div>
            </form>
          </div>

          <div className="settings-section">
            <h2>Account</h2>
            <div className="account-info">
              <p><strong>Name:</strong> {currentUser?.name || 'Not available'}</p>
              <p><strong>Email:</strong> {currentUser?.email || 'Not available'}</p>
              <p><strong>Account Type:</strong> {currentUser?.role || 'Standard'}</p>
            </div>

            <div className="account-actions">
              <Button type="secondary" onClick={() => alert('Feature coming soon')}>
                Change Password
              </Button>
              <Button type="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          <div className="settings-actions">
            {saveSuccess && (
              <div className="success-message">Settings saved successfully!</div>
            )}

            {saveError && (
              <div className="error-message">{saveError}</div>
            )}

            <Button 
              type="primary" 
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
