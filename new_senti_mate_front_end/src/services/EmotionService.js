import api from './apiService';

const EmotionService = {
  getAllEmotions: async () => {
    try {
      return await api.get('/emotions');
    } catch (error) {
      console.error('Get all emotions error:', error);
      throw error;
    }
  },

  getMostCommonEmotions: async (limit = 5) => {
    try {
      return await api.get(`/emotions/most-common?limit=${limit}`);
    } catch (error) {
      console.error('Get most common emotions error:', error);
      throw error;
    }
  },

  getEmotionStats: async (startDate, endDate) => {
    try {
      let url = '/emotions/stats';
      if (startDate || endDate) {
        url += '?';
        if (startDate) url += `startDate=${startDate}`;
        if (startDate && endDate) url += '&';
        if (endDate) url += `endDate=${endDate}`;
      }
      return await api.get(url);
    } catch (error) {
      console.error('Get emotion stats error:', error);
      throw error;
    }
  },

  analyzeText: async (text) => {
    try {
      return await api.post('/emotions/analyze', { text });
    } catch (error) {
      console.error('Analyze text error:', error);
      throw error;
    }
  },

  getEmotionById: async (id) => {
    try {
      return await api.get(`/emotions/${id}`);
    } catch (error) {
      console.error(`Get emotion by ID ${id} error:`, error);
      throw error;
    }
  },

  getEmotionsForDiary: async (diaryId) => {
    try {
      return await api.get(`/emotions/diary/${diaryId}`);
    } catch (error) {
      console.error(`Get emotions for diary ${diaryId} error:`, error);
      throw error;
    }
  },

  createEmotion: async (diaryEntryId, emotion) => {
    try {
      return await api.post(`/emotions/diary/${diaryEntryId}`, emotion);
    } catch (error) {
      console.error('Create emotion error:', error);
      throw error;
    }
  },

  updateEmotion: async (id, emotion) => {
    try {
      return await api.put(`/emotions/${id}`, emotion);
    } catch (error) {
      console.error(`Update emotion ${id} error:`, error);
      throw error;
    }
  },

  deleteEmotion: async (id) => {
    try {
      return await api.delete(`/emotions/${id}`);
    } catch (error) {
      console.error(`Delete emotion ${id} error:`, error);
      throw error;
    }
  }
};

export default EmotionService;
