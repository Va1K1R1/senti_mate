import apiService from './apiService';
import AuthService from './AuthService';

const UserService = {
  /**
   * Get current user ID from localStorage
   * @returns {number} - User ID
   * @private
   */
  _getCurrentUserId: () => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to perform this action');
    }
    return user.id;
  },

  /**
   * Get all users
   * @returns {Promise} - Promise with array of users
   */
  getAllUsers: async () => {
    try {
      const response = await apiService.get('/users');
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  /**
   * Get a user by ID
   * @param {number} id - User ID
   * @returns {Promise} - Promise with user data
   */
  getUserById: async (id) => {
    try {
      const response = await apiService.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get user by ID ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} - Promise with user profile data
   */
  getProfile: async () => {
    try {
      const userId = UserService._getCurrentUserId();
      return await UserService.getUserById(userId);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update a user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise with updated user data
   */
  updateUser: async (id, userData) => {
    try {
      const response = await apiService.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Update user ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Update current user profile
   * @param {Object} profileData - User profile data to update
   * @returns {Promise} - Promise with updated user profile data
   */
  updateProfile: async (profileData) => {
    try {
      const userId = UserService._getCurrentUserId();
      return await UserService.updateUser(userId, profileData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Delete a user
   * @param {number} id - User ID
   * @returns {Promise} - Promise with success message
   */
  deleteUser: async (id) => {
    try {
      const response = await apiService.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete user ${id} error:`, error);
      throw error;
    }
  }
};

export default UserService;
