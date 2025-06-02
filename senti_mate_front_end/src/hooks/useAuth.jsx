import { useState, useEffect, useCallback } from 'react';
import AuthService from '../services/AuthService';

/**
 * Custom hook for managing authentication state
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const authenticated = AuthService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(authenticated);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise with login result
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AuthService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with registration result
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AuthService.register(userData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout
  };
};

export default useAuth;