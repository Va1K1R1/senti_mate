import React from 'react';
import { useTheme } from '../../styles/theme';
import { motion } from 'framer-motion';
import '../../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.button 
      onClick={toggleTheme}
      className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">
        {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
      <span className="icon">
        {darkMode ? '☀️' : '🌙'}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
