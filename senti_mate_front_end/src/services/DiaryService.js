import apiService from './apiService';

const DiaryService = {
  /**
   * Get all diary entries
   * @returns {Promise} - Promise with array of diary entries
   */
  getAllEntries: async () => {
    const response = await apiService.get('/diary');
    return response.data;
  },

  /**
   * Get a specific diary entry by ID
   * @param {string} id - Diary entry ID
   * @returns {Promise} - Promise with diary entry data
   */
  getEntryById: async (id) => {
    const response = await apiService.get(`/diary/${id}`);
    return response.data;
  },

  /**
   * Create a new diary entry
   * @param {Object} entryData - Diary entry data
   * @returns {Promise} - Promise with created diary entry data
   */
  createEntry: async (entryData) => {
    const response = await apiService.post('/diary', entryData);
    return response.data;
  },

  /**
   * Update an existing diary entry
   * @param {string} id - Diary entry ID
   * @param {Object} entryData - Updated diary entry data
   * @returns {Promise} - Promise with updated diary entry data
   */
  updateEntry: async (id, entryData) => {
    const response = await apiService.put(`/diary/${id}`, entryData);
    return response.data;
  },

  /**
   * Delete a diary entry
   * @param {string} id - Diary entry ID
   * @returns {Promise} - Promise with success message
   */
  deleteEntry: async (id) => {
    const response = await apiService.delete(`/diary/${id}`);
    return response.data;
  },

  /**
   * Get diary entries by date range
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} - Promise with array of diary entries
   */
  getEntriesByDateRange: async (startDate, endDate) => {
    const response = await apiService.get(`/diary/range?start=${startDate}&end=${endDate}`);
    return response.data;
  }
};

export default DiaryService;