import apiService from './apiService';
import AuthService from './AuthService';

const DiaryService = {
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
   * Get all diary entries for the current user
   * @returns {Promise} - Promise with array of diary entries
   */
  getAllEntries: async () => {
    try {
      const response = await apiService.get('/diary-entries');
      return response.data;
    } catch (error) {
      console.error('Get all diary entries error:', error);
      throw error;
    }
  },

  /**
   * Get all diary entries for a specific user
   * @param {number} userId - User ID
   * @returns {Promise} - Promise with array of diary entries
   */
  getAllEntriesForUser: async (userId) => {
    try {
      const response = await apiService.get(`/diary-entries/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Get all diary entries for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Get a specific diary entry by ID
   * @param {number} id - Diary entry ID
   * @returns {Promise} - Promise with diary entry data
   */
  getEntryById: async (id) => {
    try {
      const response = await apiService.get(`/diary-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get diary entry by ID ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Create a new diary entry for the current user
   * @param {Object} entryData - Diary entry data
   * @returns {Promise} - Promise with created diary entry data
   */
  createEntry: async (entryData) => {
    try {
      const response = await apiService.post('/diary-entries', entryData);
      return response.data;
    } catch (error) {
      console.error('Create diary entry error:', error);
      throw error;
    }
  },

  /**
   * Create a new diary entry for a specific user
   * @param {number} userId - User ID
   * @param {Object} entryData - Diary entry data
   * @returns {Promise} - Promise with created diary entry data
   */
  createEntryForUser: async (userId, entryData) => {
    try {
      const response = await apiService.post(`/diary-entries/user/${userId}`, entryData);
      return response.data;
    } catch (error) {
      console.error(`Create diary entry for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Update an existing diary entry
   * @param {number} id - Diary entry ID
   * @param {Object} entryData - Updated diary entry data
   * @returns {Promise} - Promise with updated diary entry data
   */
  updateEntry: async (id, entryData) => {
    try {
      const response = await apiService.put(`/diary-entries/${id}`, entryData);
      return response.data;
    } catch (error) {
      console.error(`Update diary entry ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Delete a diary entry
   * @param {number} id - Diary entry ID
   * @returns {Promise} - Promise with success message
   */
  deleteEntry: async (id) => {
    try {
      const response = await apiService.delete(`/diary-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete diary entry ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get diary entries by date range for the current user
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} - Promise with array of diary entries
   */
  getEntriesByDateRange: async (startDate, endDate) => {
    try {
      const response = await apiService.get(`/diary-entries/range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error(`Get diary entries by date range error:`, error);
      throw error;
    }
  },

  /**
   * Get diary entries by date range for a specific user
   * @param {number} userId - User ID
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} - Promise with array of diary entries
   */
  getEntriesByDateRangeForUser: async (userId, startDate, endDate) => {
    try {
      const response = await apiService.get(`/diary-entries/user/${userId}/filter/date?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error(`Get diary entries by date range for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Get diary entries by mood score range for a specific user
   * @param {number} userId - User ID
   * @param {number} minScore - Minimum mood score
   * @param {number} maxScore - Maximum mood score
   * @returns {Promise} - Promise with array of diary entries
   */
  getEntriesByMoodRange: async (userId, minScore, maxScore) => {
    try {
      const response = await apiService.get(`/diary-entries/user/${userId}/filter/mood?minScore=${minScore}&maxScore=${maxScore}`);
      return response.data;
    } catch (error) {
      console.error(`Get diary entries by mood range for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Search diary entries by title for a specific user
   * @param {number} userId - User ID
   * @param {string} title - Title to search for
   * @returns {Promise} - Promise with array of diary entries
   */
  searchEntriesByTitle: async (userId, title) => {
    try {
      const response = await apiService.get(`/diary-entries/user/${userId}/search/title?title=${title}`);
      return response.data;
    } catch (error) {
      console.error(`Search diary entries by title for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Search diary entries by content for a specific user
   * @param {number} userId - User ID
   * @param {string} content - Content to search for
   * @returns {Promise} - Promise with array of diary entries
   */
  searchEntriesByContent: async (userId, content) => {
    try {
      const response = await apiService.get(`/diary-entries/user/${userId}/search/content?content=${content}`);
      return response.data;
    } catch (error) {
      console.error(`Search diary entries by content for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Get count of diary entries for a specific user
   * @param {number} userId - User ID
   * @returns {Promise} - Promise with count of diary entries
   */
  getEntryCount: async (userId) => {
    try {
      const response = await apiService.get(`/diary-entries/user/${userId}/count`);
      return response.data;
    } catch (error) {
      console.error(`Get diary entry count for user ${userId} error:`, error);
      throw error;
    }
  },

  /**
   * Get average mood score for a specific user
   * @param {number} userId - User ID
   * @returns {Promise} - Promise with average mood score
   */
  getAverageMood: async (userId) => {
    try {
      const response = await apiService.get(`/diary-entries/user/${userId}/average-mood`);
      return response.data;
    } catch (error) {
      console.error(`Get average mood for user ${userId} error:`, error);
      throw error;
    }
  }
};

export default DiaryService;
