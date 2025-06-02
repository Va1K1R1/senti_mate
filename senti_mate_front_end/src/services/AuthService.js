import apiService from './apiService';

const AuthService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise with user data
   */
  login: async (email, password) => {
    const response = await apiService.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with user data
   */
  register: async (userData) => {
    const response = await apiService.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - User object or null if not logged in
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;
