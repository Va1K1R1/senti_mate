import api from './api';
import AuthService from './authService';

/**
 * Diary service for handling diary-related API calls
 */
const DiaryService = {
  /**
   * Get the current user ID
   * @returns {Promise<number>} Current user ID
   * @private
   */
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },
  /**
   * Get all diary entries
   * @param {number} [userId] - User ID (if not provided, gets current user ID)
   * @returns {Promise<Array>} Array of diary entries
   */
  getAllDiaries: async (userId) => {
    try {
      // If userId is not provided, get the current user ID
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }

      // Use the user-specific endpoint to get diaries for this user
      return await api.get(`/diary-entries/user/${userId}`);
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
      if (id === undefined || id === null || id === 'undefined' || id === 'null' || !id) {
        throw new Error('Diary ID is required and must be a valid value');
      }

      // Ensure id is a number
      const diaryId = parseInt(id, 10);
      if (isNaN(diaryId)) {
        throw new Error(`Invalid diary ID: ${id} is not a number`);
      }

      return await api.get(`/diary-entries/${diaryId}`);
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
   * @param {number} [userId] - User ID (if not provided, gets current user ID)
   * @returns {Promise<Object>} Created diary entry
   */
  createDiary: async (diary, userId) => {
    try {
      // If userId is not provided, get the current user ID
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }

      // Use the user-specific endpoint to create a diary for this user
      return await api.post(`/diary-entries/user/${userId}`, diary);
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
   * @throws {Error} If id is undefined or invalid
   */
  updateDiary: async (id, diary) => {
    try {
      // Validate id parameter
      if (id === undefined || id === null || id === 'undefined' || id === 'null' || !id) {
        throw new Error('Diary ID is required and must be a valid value for update');
      }

      // Ensure id is a number
      const diaryId = parseInt(id, 10);
      if (isNaN(diaryId)) {
        throw new Error(`Invalid diary ID: ${id} is not a number`);
      }

      return await api.put(`/diary-entries/${diaryId}`, diary);
    } catch (error) {
      console.error(`Update diary ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Delete a diary entry
   * @param {number} id - Diary entry ID
   * @returns {Promise<void>}
   * @throws {Error} If id is undefined or invalid
   */
  deleteDiary: async (id) => {
    try {
      // Validate id parameter
      if (id === undefined || id === null || id === 'undefined' || id === 'null' || !id) {
        throw new Error('Diary ID is required and must be a valid value for deletion');
      }

      // Ensure id is a number
      const diaryId = parseInt(id, 10);
      if (isNaN(diaryId)) {
        throw new Error(`Invalid diary ID: ${id} is not a number`);
      }

      return await api.delete(`/diary-entries/${diaryId}`);
    } catch (error) {
      console.error(`Delete diary ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get diary entries by emotion
   * Note: This endpoint is not currently supported by the backend.
   * A proper implementation would require adding this endpoint to the backend.
   * @param {string} emotion - Emotion to filter by
   * @returns {Promise<Array>} Array of diary entries
   * @throws {Error} Always throws an error since the endpoint is not supported
   */
  getDiariesByEmotion: async (emotion) => {
    try {
      console.warn('getDiariesByEmotion is not supported by the backend');

      // For now, we'll just throw an error
      throw new Error('getDiariesByEmotion is not supported by the backend');

      // When the backend implements this endpoint, uncomment the following line:
      // return await api.get(`/diary-entries/emotion/${emotion}`);
    } catch (error) {
      console.error(`Get diaries by emotion ${emotion} error:`, error);
      throw error;
    }
  },

  /**
   * Get diary entries by date range
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @param {number} [userId] - User ID (if not provided, gets current user ID)
   * @returns {Promise<Array>} Array of diary entries
   */
  getDiariesByDateRange: async (startDate, endDate, userId) => {
    try {
      // If userId is not provided, get the current user ID
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }

      // Use the user-specific endpoint to filter diaries by date range for this user
      return await api.get(`/diary-entries/user/${userId}/filter/date?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.error(`Get diaries by date range error:`, error);
      throw error;
    }
  }
};

export default DiaryService;
