import apiService from './apiService';

const RecommendationService = {
  /**
   * Get all recommendations for the current user
   * @returns {Promise} - Promise with array of recommendations
   */
  getAllRecommendations: async () => {
    const response = await apiService.get('/recommendations');
    return response.data;
  },

  /**
   * Get a specific recommendation by ID
   * @param {string} id - Recommendation ID
   * @returns {Promise} - Promise with recommendation data
   */
  getRecommendationById: async (id) => {
    const response = await apiService.get(`/recommendations/${id}`);
    return response.data;
  },

  /**
   * Get recommendations by type
   * @param {string} type - Recommendation type (e.g., 'wellness', 'exercise', 'mental_health')
   * @returns {Promise} - Promise with array of recommendations of the specified type
   */
  getRecommendationsByType: async (type) => {
    const response = await apiService.get(`/recommendations/type/${type}`);
    return response.data;
  },

  /**
   * Generate a new recommendation based on diary entries and health data
   * @returns {Promise} - Promise with generated recommendation
   */
  generateRecommendation: async () => {
    const response = await apiService.post('/recommendations/generate');
    return response.data;
  },

  /**
   * Mark a recommendation as read
   * @param {string} id - Recommendation ID
   * @returns {Promise} - Promise with updated recommendation
   */
  markAsRead: async (id) => {
    const response = await apiService.put(`/recommendations/${id}/read`);
    return response.data;
  },

  /**
   * Mark a recommendation as helpful
   * @param {string} id - Recommendation ID
   * @param {boolean} isHelpful - Whether the recommendation was helpful
   * @returns {Promise} - Promise with updated recommendation
   */
  markHelpfulness: async (id, isHelpful) => {
    const response = await apiService.put(`/recommendations/${id}/helpful`, { isHelpful });
    return response.data;
  }
};

export default RecommendationService;