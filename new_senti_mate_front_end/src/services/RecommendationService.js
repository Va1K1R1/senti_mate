import api from './apiService';
import AuthService from './AuthService';

const RecommendationService = {
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },

  getAllRecommendations: async (userId) => {
    try {
      if (!userId) {
        userId = await RecommendationService._getCurrentUserId();
      }
      return await api.get(`/recommendations/user/${userId}`);
    } catch (error) {
      console.error('Get all recommendations error:', error);
      throw error;
    }
  },

  getRecommendationById: async (id) => {
    try {
      return await api.get(`/recommendations/${id}`);
    } catch (error) {
      console.error(`Get recommendation by ID ${id} error:`, error);
      throw error;
    }
  },

  generateRecommendation: async (diaryEntryId, userId) => {
    try {
      if (!userId) {
        userId = await RecommendationService._getCurrentUserId();
      }
      return await api.post('/recommendations/generate', {
        userId,
        diaryEntryId
      });
    } catch (error) {
      console.error('Generate recommendation error:', error);
      throw error;
    }
  },

  deleteRecommendation: async (id) => {
    try {
      return await api.delete(`/recommendations/${id}`);
    } catch (error) {
      console.error(`Delete recommendation ${id} error:`, error);
      throw error;
    }
  }
};

export default RecommendationService;