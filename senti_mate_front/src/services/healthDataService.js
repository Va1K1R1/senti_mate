import api from './api';

/**
 * Health data service for handling health data-related API calls
 */
const HealthDataService = {
  /**
   * Get all health data
   * @returns {Promise<Object>} Health data object with steps, heartRate, sleep, and exercise
   */
  getAllHealthData: async () => {
    try {
      return await api.get('/health-data');
    } catch (error) {
      console.error('Get all health data error:', error);
      throw error;
    }
  },

  /**
   * Get step count data
   * @param {string} [startDate] - Start date in ISO format
   * @param {string} [endDate] - End date in ISO format
   * @returns {Promise<Array>} Array of step count data
   */
  getStepData: async (startDate, endDate) => {
    try {
      let endpoint = '/health-data/steps';
      if (startDate && endDate) {
        endpoint += `?startDate=${startDate}&endDate=${endDate}`;
      }
      return await api.get(endpoint);
    } catch (error) {
      console.error('Get step data error:', error);
      throw error;
    }
  },

  /**
   * Get heart rate data
   * @param {string} [startDate] - Start date in ISO format
   * @param {string} [endDate] - End date in ISO format
   * @returns {Promise<Array>} Array of heart rate data
   */
  getHeartRateData: async (startDate, endDate) => {
    try {
      let endpoint = '/health-data/heart-rate';
      if (startDate && endDate) {
        endpoint += `?startDate=${startDate}&endDate=${endDate}`;
      }
      return await api.get(endpoint);
    } catch (error) {
      console.error('Get heart rate data error:', error);
      throw error;
    }
  },

  /**
   * Get sleep data
   * @param {string} [startDate] - Start date in ISO format
   * @param {string} [endDate] - End date in ISO format
   * @returns {Promise<Array>} Array of sleep data
   */
  getSleepData: async (startDate, endDate) => {
    try {
      let endpoint = '/health-data/sleep';
      if (startDate && endDate) {
        endpoint += `?startDate=${startDate}&endDate=${endDate}`;
      }
      return await api.get(endpoint);
    } catch (error) {
      console.error('Get sleep data error:', error);
      throw error;
    }
  },

  /**
   * Get exercise data
   * @param {string} [startDate] - Start date in ISO format
   * @param {string} [endDate] - End date in ISO format
   * @returns {Promise<Array>} Array of exercise data
   */
  getExerciseData: async (startDate, endDate) => {
    try {
      let endpoint = '/health-data/exercise';
      if (startDate && endDate) {
        endpoint += `?startDate=${startDate}&endDate=${endDate}`;
      }
      return await api.get(endpoint);
    } catch (error) {
      console.error('Get exercise data error:', error);
      throw error;
    }
  },

  /**
   * Connect to Samsung Health
   * @returns {Promise<Object>} Connection status
   */
  connectToSamsungHealth: async () => {
    try {
      return await api.post('/health-data/connect', {});
    } catch (error) {
      console.error('Connect to Samsung Health error:', error);
      throw error;
    }
  },

  /**
   * Disconnect from Samsung Health
   * @returns {Promise<Object>} Disconnection status
   */
  disconnectFromSamsungHealth: async () => {
    try {
      return await api.post('/health-data/disconnect', {});
    } catch (error) {
      console.error('Disconnect from Samsung Health error:', error);
      throw error;
    }
  },

  /**
   * Add manual health data entry
   * @param {string} type - Type of health data (steps, heartRate, sleep, exercise)
   * @param {Object} data - Health data object
   * @returns {Promise<Object>} Added health data
   */
  addHealthData: async (type, data) => {
    try {
      return await api.post(`/health-data/${type}`, data);
    } catch (error) {
      console.error(`Add ${type} data error:`, error);
      throw error;
    }
  },

  /**
   * Get health data summary
   * @returns {Promise<Object>} Health data summary
   */
  getHealthSummary: async () => {
    try {
      return await api.get('/health-data/summary');
    } catch (error) {
      console.error('Get health summary error:', error);
      throw error;
    }
  }
};

export default HealthDataService;