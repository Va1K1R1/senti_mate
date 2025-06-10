import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../styles/theme';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dataExportRequested, setDataExportRequested] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, currentUser } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load user settings from localStorage or API
    loadSettings();
  }, [isAuthenticated, navigate]);

  const loadSettings = () => {
    // This is a placeholder. In a real app, you would load settings from an API
    // For now, we'll use localStorage
    try {
      const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      setNotificationsEnabled(settings.notificationsEnabled || false);
      setEmailNotifications(settings.emailNotifications || false);
      setPushNotifications(settings.pushNotifications || false);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      // This is a placeholder. In a real app, you would save settings to an API
      // For now, we'll use localStorage
      const settings = {
        notificationsEnabled,
        emailNotifications,
        pushNotifications
      };
      
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessage('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDataExport = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      // This is a placeholder. In a real app, you would call an API to request data export
      // For now, we'll simulate a successful request
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDataExportRequested(true);
      setMessage('Data export request submitted. You will receive an email with your data soon.');
    } catch (err) {
      setError('Failed to request data export. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="settings-section">
        <h2>Appearance</h2>
        
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="darkMode">Dark Mode</label>
            <p className="setting-description">
              Switch between light and dark theme
            </p>
          </div>
          <div className="setting-control">
            <button 
              onClick={toggleTheme}
              className="theme-toggle-button"
            >
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Notifications</h2>
        
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="notificationsEnabled">Enable Notifications</label>
            <p className="setting-description">
              Receive notifications about your diary entries and recommendations
            </p>
          </div>
          <div className="setting-control">
            <input
              type="checkbox"
              id="notificationsEnabled"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              disabled={loading}
            />
          </div>
        </div>
        
        {notificationsEnabled && (
          <>
            <div className="setting-item">
              <div className="setting-label">
                <label htmlFor="emailNotifications">Email Notifications</label>
                <p className="setting-description">
                  Receive notifications via email
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-label">
                <label htmlFor="pushNotifications">Push Notifications</label>
                <p className="setting-description">
                  Receive push notifications in your browser
                </p>
              </div>
              <div className="setting-control">
                <input
                  type="checkbox"
                  id="pushNotifications"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="settings-section">
        <h2>Data & Privacy</h2>
        
        <div className="setting-item">
          <div className="setting-label">
            <label>Export Your Data</label>
            <p className="setting-description">
              Download a copy of all your data
            </p>
          </div>
          <div className="setting-control">
            <button 
              onClick={handleRequestDataExport}
              disabled={loading || dataExportRequested}
              className="export-data-button"
            >
              {dataExportRequested ? 'Request Submitted' : 'Request Data Export'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button 
          onClick={saveSettings}
          disabled={loading}
          className="save-button"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        
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

export default Settings;