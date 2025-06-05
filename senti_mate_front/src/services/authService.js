import api from './api';

/**
 * Authentication service for handling auth-related API calls
 */
const AuthService = {
  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store the token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   */
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      
      // Store the token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Call the logout endpoint if the backend requires it
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if the API call fails
    } finally {
      // Always remove the token from localStorage
      localStorage.removeItem('token');
    }
  },

  /**
   * Get the current user's profile
   * @returns {Promise<Object>} User profile data
   */
  getCurrentUser: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Check if the user is authenticated
   * @returns {boolean} True if the user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;