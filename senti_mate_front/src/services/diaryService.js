import api from './api';

/**
 * Diary service for handling diary-related API calls
 */
const DiaryService = {
  /**
   * Get all diary entries
   * @returns {Promise<Array>} Array of diary entries
   */
  getAllDiaries: async () => {
    try {
      return await api.get('/diary-entries');
    } catch (error) {
      console.error('Get all diaries error:', error);
      throw error;
    }
  },

  /**
   * Get a diary entry by ID
   * @param {number} id - Diary entry ID
   * @returns {Promise<Object>} Diary entry
   * @throws {Error} If id is undefined or invalid
   */
  getDiaryById: async (id) => {
    try {
      // Validate id parameter
      if (id === undefined || id === null) {
        throw new Error('Diary ID is required');
      }
      return await api.get(`/diary-entries/${id}`);
    } catch (error) {
      console.error(`Get diary by ID ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Create a new diary entry
   * @param {Object} diary - Diary entry data
   * @param {string} diary.title - Diary entry title
   * @param {string} diary.content - Diary entry content
   * @param {string} diary.emotion - Diary entry emotion
   * @returns {Promise<Object>} Created diary entry
   */
  createDiary: async (diary) => {
    try {
      return await api.post('/diary-entries', diary);
    } catch (error) {
      console.error('Create diary error:', error);
      throw error;
    }
  },

  /**
   * Update a diary entry
   * @param {number} id - Diary entry ID
   * @param {Object} diary - Updated diary entry data
   * @param {string} [diary.title] - Updated diary entry title
   * @param {string} [diary.content] - Updated diary entry content
   * @param {string} [diary.emotion] - Updated diary entry emotion
   * @returns {Promise<Object>} Updated diary entry
   */
  updateDiary: async (id, diary) => {
    try {
      return await api.put(`/diary-entries/${id}`, diary);
    } catch (error) {
      console.error(`Update diary ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Delete a diary entry
   * @param {number} id - Diary entry ID
   * @returns {Promise<void>}
   */
  deleteDiary: async (id) => {
    try {
      return await api.delete(`/diary-entries/${id}`);
    } catch (error) {
      console.error(`Delete diary ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get diary entries by emotion
   * @param {string} emotion - Emotion to filter by
   * @returns {Promise<Array>} Array of diary entries
   */
  getDiariesByEmotion: async (emotion) => {
    try {
      return await api.get(`/diary-entries/emotion/${emotion}`);
    } catch (error) {
      console.error(`Get diaries by emotion ${emotion} error:`, error);
      throw error;
    }
  },

  /**
   * Get diary entries by date range
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise<Array>} Array of diary entries
   */
  getDiariesByDateRange: async (startDate, endDate) => {
    try {
      return await api.get(`/diary-entries/range?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.error(`Get diaries by date range error:`, error);
      throw error;
    }
  }
};

export default DiaryService;
