import React, { useState } from "react";
import Header from "../component/Header.jsx";
import Footer from "../component/Footer.jsx";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    language: "english",
    privacyLevel: "private"
  });

  const toggle = key => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const change = (key, v) => setSettings(prev => ({ ...prev, [key]: v }));

  return (
      <div className="settings-page">
        <Header />
        <div className="settings-container">
          <h1>Settings</h1>
          <section>
            <h2>Appearance</h2>
            <label>
              <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => toggle("darkMode")}
              />
              Dark Mode
            </label>
          </section>
          <section>
            <h2>Notifications</h2>
            <label>
              <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => toggle("emailNotifications")}
              />
              Email Notifications
            </label>
            <label>
              <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => toggle("pushNotifications")}
              />
              Push Notifications
            </label>
          </section>
          <section>
            <h2>Language</h2>
            <select
                value={settings.language}
                onChange={e => change("language", e.target.value)}
            >
              <option value="english">English</option>
              <option value="korean">Korean</option>
              <option value="spanish">Spanish</option>
            </select>
          </section>
          <section>
            <h2>Privacy</h2>
            <select
                value={settings.privacyLevel}
                onChange={e => change("privacyLevel", e.target.value)}
            >
              <option value="private">Only me</option>
              <option value="friends">Friends</option>
              <option value="public">Public</option>
            </select>
          </section>
          <button className="save-settings-button" onClick={() => alert("Settings saved!")}>
            Save Settings
          </button>
        </div>
        <Footer />
      </div>
  );
};

export default SettingsPage;
