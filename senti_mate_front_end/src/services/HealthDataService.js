import apiService from './apiService';

const HealthDataService = {
  /**
   * Get all health data for the current user
   * @returns {Promise} - Promise with array of health data
   */
  getAllHealthData: async () => {
    const response = await apiService.get('/health-data');
    return response.data;
  },

  /**
   * Get health data by type
   * @param {string} type - Health data type (e.g., 'steps', 'heart_rate', 'sleep', 'exercise')
   * @returns {Promise} - Promise with array of health data of the specified type
   */
  getHealthDataByType: async (type) => {
    const response = await apiService.get(`/health-data/type/${type}`);
    return response.data;
  },

  /**
   * Get health data by date range
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} - Promise with array of health data within the date range
   */
  getHealthDataByDateRange: async (startDate, endDate) => {
    const response = await apiService.get(`/health-data/range?start=${startDate}&end=${endDate}`);
    return response.data;
  },

  /**
   * Sync health data from Samsung Health
   * @returns {Promise} - Promise with sync status
   */
  syncHealthData: async () => {
    const response = await apiService.post('/health-data/sync');
    return response.data;
  },

  /**
   * Get health data statistics
   * @param {string} type - Health data type (e.g., 'steps', 'heart_rate', 'sleep', 'exercise')
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} - Promise with health data statistics
   */
  getHealthDataStats: async (type, startDate, endDate) => {
    const response = await apiService.get(`/health-data/stats/${type}?start=${startDate}&end=${endDate}`);
    return response.data;
  }
};

export default HealthDataService;