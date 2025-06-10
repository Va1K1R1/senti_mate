import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider component for managing authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from API on initial render
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        // Check if user is authenticated
        if (AuthService.isAuthenticated()) {
          // Get current user from API
          const user = await AuthService.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Failed to load user data');
        // Clear token if there's an error (e.g., token expired)
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Call login API
      const response = await AuthService.login(email, password);
      setCurrentUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Call register API
      const response = await AuthService.register(username, name, email, password);
      setCurrentUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      // Call logout API
      await AuthService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  // Value object to be provided to consumers
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: AuthService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
