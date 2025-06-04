import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { toggleSetting, updateSetting, updateDataSyncSettings, resetSettings } from "../store/slices/settingsSlice";
import "./Settings.css";

/**
 * Settings page component
 * Allows users to configure application preferences using global state management
 */
const SettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);

  // Memoize filtered settings to optimize performance
  const filteredSettings = useMemo(() => {
    const filtered = { ...settings };
    delete filtered.loading;
    delete filtered.error;
    return filtered;
  }, [settings]);

  const handleToggleSetting = (setting) => {
    dispatch(toggleSetting(setting));
  };

  const handleSelectChange = (setting, value) => {
    dispatch(updateSetting({ setting, value }));
  };

  const handleRangeChange = (setting, value) => {
    dispatch(updateSetting({ setting, value: parseFloat(value) }));
  };

  const handleDataSyncChange = (key, value) => {
    dispatch(updateDataSyncSettings({ [key]: value }));
  };

  const handleSaveSettings = () => {
    // Settings are automatically saved to localStorage in the reducer
    alert("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default values?")) {
      dispatch(resetSettings());
      alert("Settings have been reset to defaults.");
    }
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

        <div className="settings-section">
          <h2>Accessibility</h2>
          <div className="setting-item">
            <label htmlFor="fontScale">Font Size</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="range"
                id="fontScale"
                min="0.8"
                max="1.4"
                step="0.1"
                value={settings.fontScale}
                onChange={(e) => handleRangeChange("fontScale", e.target.value)}
              />
              <span className="setting-value-display">{settings.fontScale}x</span>
            </div>
          </div>
          <div className="setting-item">
            <label htmlFor="highContrast">High Contrast Mode</label>
            <input
              type="checkbox"
              id="highContrast"
              checked={settings.highContrast}
              onChange={() => handleToggleSetting("highContrast")}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Data Management</h2>
          <div className="setting-item">
            <label htmlFor="autoSave">Auto Save Entries</label>
            <input
              type="checkbox"
              id="autoSave"
              checked={settings.autoSave}
              onChange={() => handleToggleSetting("autoSave")}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="dataSyncEnabled">Sync Data with Cloud</label>
            <input
              type="checkbox"
              id="dataSyncEnabled"
              checked={settings.dataSync.enabled}
              onChange={() => handleDataSyncChange("enabled", !settings.dataSync.enabled)}
            />
          </div>
          {settings.dataSync.enabled && (
            <div className="setting-item">
              <label htmlFor="dataSyncFrequency">Sync Frequency</label>
              <select
                id="dataSyncFrequency"
                value={settings.dataSync.frequency}
                onChange={(e) => handleDataSyncChange("frequency", e.target.value)}
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}
        </div>

        <div className="settings-actions">
          <button className="save-settings-button" onClick={handleSaveSettings}>
            Save Settings
          </button>
          <button className="reset-settings-button" onClick={handleResetSettings}>
            Reset to Defaults
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
