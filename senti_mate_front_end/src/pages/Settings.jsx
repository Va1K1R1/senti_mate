import React, { useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";

/**
 * Settings page component
 * Allows users to configure application preferences
 */
const SettingsPage = () => {
  // Sample settings state - in a real app, these would be saved to user preferences
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    language: "english",
    privacyLevel: "friends"
  });

  const handleToggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleSelectChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };

  const handleSaveSettings = () => {
    // In a real app, this would save settings to the backend
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">
      <Header />
      <div className="settings-container">
        <h1>Settings</h1>
        <p className="settings-subtitle">Customize your SentiMate experience</p>
        
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label htmlFor="darkMode">Dark Mode</label>
            <input
              type="checkbox"
              id="darkMode"
              checked={settings.darkMode}
              onChange={() => handleToggleSetting("darkMode")}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <label htmlFor="emailNotifications">Email Notifications</label>
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={() => handleToggleSetting("emailNotifications")}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="pushNotifications">Push Notifications</label>
            <input
              type="checkbox"
              id="pushNotifications"
              checked={settings.pushNotifications}
              onChange={() => handleToggleSetting("pushNotifications")}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Language</h2>
          <div className="setting-item">
            <label htmlFor="language">Select Language</label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSelectChange("language", e.target.value)}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="korean">Korean</option>
            </select>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Privacy</h2>
          <div className="setting-item">
            <label htmlFor="privacyLevel">Who can see your diary</label>
            <select
              id="privacyLevel"
              value={settings.privacyLevel}
              onChange={(e) => handleSelectChange("privacyLevel", e.target.value)}
            >
              <option value="private">Only me</option>
              <option value="friends">Friends</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
        
        <button className="save-settings-button" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;