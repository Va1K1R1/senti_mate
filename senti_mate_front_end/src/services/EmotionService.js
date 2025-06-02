import apiService from './apiService';

const EmotionService = {
  /**
   * Get all emotions
   * @returns {Promise} - Promise with array of emotions
   */
  getAllEmotions: async () => {
    const response = await apiService.get('/emotions');
    return response.data;
  },

  /**
   * Get a specific emotion by ID
   * @param {string} id - Emotion ID
   * @returns {Promise} - Promise with emotion data
   */
  getEmotionById: async (id) => {
    const response = await apiService.get(`/emotions/${id}`);
    return response.data;
  },

  /**
   * Analyze text to detect emotions
   * @param {string} text - Text to analyze
   * @returns {Promise} - Promise with detected emotions
   */
  analyzeText: async (text) => {
    const response = await apiService.post('/emotions/analyze', { text });
    return response.data;
  },

  /**
   * Get emotion statistics for a user
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} - Promise with emotion statistics
   */
  getEmotionStats: async (startDate, endDate) => {
    const response = await apiService.get(`/emotions/stats?start=${startDate}&end=${endDate}`);
    return response.data;
  }
};

export default EmotionService;