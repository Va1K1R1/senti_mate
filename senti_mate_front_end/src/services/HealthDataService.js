import apiService from './apiService';
import AuthService from './AuthService';

const HealthDataService = {
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
   * Get all health data for a specific user
   * @param {number} userId - User ID
   * @returns {Promise} - Promise with array of health data
   */
  getAllHealthDataForUser: async (userId) => {
    try {
      const response = await apiService.get(`/health-data/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Get all health data for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Get all health data for the current user
   * @returns {Promise} - Promise with array of health data
   */
  getAllHealthData: async () => {
    try {
      const userId = HealthDataService._getCurrentUserId();
      return await HealthDataService.getAllHealthDataForUser(userId);
    } catch (error) {
      console.error('Get all health data error:', error);
      throw error;
    }
  },

  /**
   * Get health data by ID
   * @param {number} id - Health data ID
   * @returns {Promise} - Promise with health data
   */
  getHealthDataById: async (id) => {
    try {
      const response = await apiService.get(`/health-data/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get health data by ID ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Create new health data for a specific user
   * @param {number} userId - User ID
   * @param {Object} healthData - Health data object
   * @returns {Promise} - Promise with created health data
   */
  createHealthDataForUser: async (userId, healthData) => {
    try {
      const response = await apiService.post(`/health-data/user/${userId}`, healthData);
      return response.data;
    } catch (error) {
      console.error(`Create health data for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Create new health data for the current user
   * @param {Object} healthData - Health data object
   * @returns {Promise} - Promise with created health data
   */
  createHealthData: async (healthData) => {
    try {
      const userId = HealthDataService._getCurrentUserId();
      return await HealthDataService.createHealthDataForUser(userId, healthData);
    } catch (error) {
      console.error('Create health data error:', error);
      throw error;
    }
  },

  /**
   * Update health data
   * @param {number} id - Health data ID
   * @param {Object} healthData - Updated health data object
   * @returns {Promise} - Promise with updated health data
   */
  updateHealthData: async (id, healthData) => {
    try {
      const response = await apiService.put(`/health-data/${id}`, healthData);
      return response.data;
    } catch (error) {
      console.error(`Update health data ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Delete health data
   * @param {number} id - Health data ID
   * @returns {Promise} - Promise with success message
   */
  deleteHealthData: async (id) => {
    try {
      const response = await apiService.delete(`/health-data/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete health data ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Find health data by user and date range
   * @param {number} userId - User ID
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} - Promise with array of health data
   */
  findByUserAndDateRange: async (userId, startDate, endDate) => {
    try {
      // This endpoint is not explicitly mentioned in the API documentation,
      // but it's referenced in the ChatGPTService.java file
      const response = await apiService.get(`/health-data/user/${userId}/range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error(`Find health data by user ${userId} and date range error:`, error);
      throw error;
    }
  }
};

export default HealthDataService;
