import api from './apiService';
import AuthService from './AuthService';

const DiaryService = {
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },

  getAllDiaries: async (userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.get(`/diary-entries/user/${userId}`);
    } catch (error) {
      console.error('Get all diaries error:', error);
      throw error;
    }
  },

  getDiaryById: async (id) => {
    try {
      return await api.get(`/diary-entries/${id}`);
    } catch (error) {
      console.error(`Get diary by ID ${id} error:`, error);
      throw error;
    }
  },

  createDiary: async (diary, userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.post(`/diary-entries/user/${userId}`, diary);
    } catch (error) {
      console.error('Create diary error:', error);
      throw error;
    }
  },

  updateDiary: async (id, diary) => {
    try {
      return await api.put(`/diary-entries/${id}`, diary);
    } catch (error) {
      console.error(`Update diary ${id} error:`, error);
      throw error;
    }
  },

  deleteDiary: async (id) => {
    try {
      return await api.delete(`/diary-entries/${id}`);
    } catch (error) {
      console.error(`Delete diary ${id} error:`, error);
      throw error;
    }
  },

  getDiariesByDateRange: async (startDate, endDate, userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.get(`/diary-entries/user/${userId}/filter/date?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.error(`Get diaries by date range error:`, error);
      throw error;
    }
  },

  getDiariesByMoodRange: async (minScore, maxScore, userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.get(`/diary-entries/user/${userId}/filter/mood?minScore=${minScore}&maxScore=${maxScore}`);
    } catch (error) {
      console.error(`Get diaries by mood range error:`, error);
      throw error;
    }
  },

  searchDiariesByTitle: async (title, userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.get(`/diary-entries/user/${userId}/search/title?title=${title}`);
    } catch (error) {
      console.error(`Search diaries by title error:`, error);
      throw error;
    }
  },

  searchDiariesByContent: async (content, userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.get(`/diary-entries/user/${userId}/search/content?content=${content}`);
    } catch (error) {
      console.error(`Search diaries by content error:`, error);
      throw error;
    }
  },

  getAverageMood: async (userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.get(`/diary-entries/user/${userId}/average-mood`);
    } catch (error) {
      console.error(`Get average mood error:`, error);
      throw error;
    }
  }
};

export default DiaryService;
