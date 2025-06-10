import { createContext, useContext, useEffect } from 'react';

// Create a context for theme management (light theme only)
export const ThemeContext = createContext();

// ThemeProvider component to wrap the application
export const ThemeProvider = ({ children }) => {
  // Effect to apply light theme class to body
  useEffect(() => {
    const body = document.body;
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  }, []);

  // Provide theme context to children components
  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
