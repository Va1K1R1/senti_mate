import apiService from './apiService';

const EmotionService = {
  /**
   * Get all emotions
   * @returns {Promise} - Promise with array of emotions
   */
  getAllEmotions: async () => {
    try {
      const response = await apiService.get('/emotions');
      return response.data;
    } catch (error) {
      console.error('Get all emotions error:', error);
      throw error;
    }
  },

  /**
   * Get a specific emotion by ID
   * @param {number} id - Emotion ID
   * @returns {Promise} - Promise with emotion data
   */
  getEmotionById: async (id) => {
    try {
      const response = await apiService.get(`/emotions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get emotion by ID ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get emotions for a specific diary entry
   * @param {number} diaryId - Diary entry ID
   * @returns {Promise} - Promise with array of emotions
   */
  getEmotionsForDiary: async (diaryId) => {
    try {
      const response = await apiService.get(`/emotions/diary/${diaryId}`);
      return response.data;
    } catch (error) {
      console.error(`Get emotions for diary ${diaryId} error:`, error);
      throw error;
    }
  },

  /**
   * Create a new emotion
   * @param {Object} emotionData - Emotion data
   * @returns {Promise} - Promise with created emotion data
   */
  createEmotion: async (emotionData) => {
    try {
      const response = await apiService.post('/emotions', emotionData);
      return response.data;
    } catch (error) {
      console.error('Create emotion error:', error);
      throw error;
    }
  },

  /**
   * Update an existing emotion
   * @param {number} id - Emotion ID
   * @param {Object} emotionData - Updated emotion data
   * @returns {Promise} - Promise with updated emotion data
   */
  updateEmotion: async (id, emotionData) => {
    try {
      const response = await apiService.put(`/emotions/${id}`, emotionData);
      return response.data;
    } catch (error) {
      console.error(`Update emotion ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Delete an emotion
   * @param {number} id - Emotion ID
   * @returns {Promise} - Promise with success message
   */
  deleteEmotion: async (id) => {
    try {
      const response = await apiService.delete(`/emotions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete emotion ${id} error:`, error);
      throw error;
    }
  }
};

export default EmotionService;
