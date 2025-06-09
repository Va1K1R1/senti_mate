import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle component for switching between light and dark themes
 * @returns {JSX.Element} ThemeToggle component
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;