import apiService from './apiService';

const UserService = {
  /**
   * Get current user profile
   * @returns {Promise} - Promise with user profile data
   */
  getProfile: async () => {
    const response = await apiService.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - User profile data to update
   * @returns {Promise} - Promise with updated user profile data
   */
  updateProfile: async (profileData) => {
    const response = await apiService.put('/users/profile', profileData);
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} passwordData - Object containing old and new password
   * @returns {Promise} - Promise with success message
   */
  changePassword: async (passwordData) => {
    const response = await apiService.post('/users/change-password', passwordData);
    return response.data;
  }
};

export default UserService;