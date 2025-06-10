import React from 'react';
import { useTheme } from '../../styles/theme';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkMode ? '#f9f9f9' : '#333',
        color: darkMode ? '#333' : '#f9f9f9',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
      }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;