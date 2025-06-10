import apiService from './apiService';
import AuthService from './AuthService';

const RecommendationService = {
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
   * Get all recommendations for a specific user
   * @param {number} userId - User ID
   * @returns {Promise} - Promise with array of recommendations
   */
  getRecommendationsForUser: async (userId) => {
    try {
      const response = await apiService.get(`/recommendations/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Get recommendations for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Get all recommendations for the current user
   * @returns {Promise} - Promise with array of recommendations
   */
  getAllRecommendations: async () => {
    try {
      const userId = RecommendationService._getCurrentUserId();
      return await RecommendationService.getRecommendationsForUser(userId);
    } catch (error) {
      console.error('Get all recommendations error:', error);
      throw error;
    }
  },

  /**
   * Get a specific recommendation by ID
   * @param {number} id - Recommendation ID
   * @returns {Promise} - Promise with recommendation data
   */
  getRecommendationById: async (id) => {
    try {
      const response = await apiService.get(`/recommendations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get recommendation by ID ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Generate a new recommendation based on diary entries and health data
   * @param {number} userId - User ID
   * @param {number} diaryEntryId - Diary entry ID
   * @returns {Promise} - Promise with generated recommendation
   */
  generateRecommendation: async (userId, diaryEntryId) => {
    try {
      const response = await apiService.post('/recommendations/generate', { userId, diaryEntryId });
      return response.data;
    } catch (error) {
      console.error('Generate recommendation error:', error);
      throw error;
    }
  },

  /**
   * Delete a recommendation
   * @param {number} id - Recommendation ID
   * @returns {Promise} - Promise with success message
   */
  deleteRecommendation: async (id) => {
    try {
      const response = await apiService.delete(`/recommendations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete recommendation ${id} error:`, error);
      throw error;
    }
  }
};

export default RecommendationService;
