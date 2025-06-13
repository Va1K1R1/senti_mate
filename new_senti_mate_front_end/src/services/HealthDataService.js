import api from './apiService';
import AuthService from './AuthService';

const HealthDataService = {
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },

  getAllHealthData: async (userId) => {
    try {
      if (!userId) {
        userId = await HealthDataService._getCurrentUserId();
      }
      return await api.get(`/health-data/user/${userId}`);
    } catch (error) {
      console.error('Get all health data error:', error);
      throw error;
    }
  },

  getHealthDataById: async (id) => {
    try {
      return await api.get(`/health-data/${id}`);
    } catch (error) {
      console.error(`Get health data by ID ${id} error:`, error);
      throw error;
    }
  },

  createHealthData: async (healthData, userId) => {
    try {
      if (!userId) {
        userId = await HealthDataService._getCurrentUserId();
      }
      return await api.post(`/health-data/user/${userId}`, healthData);
    } catch (error) {
      console.error('Create health data error:', error);
      throw error;
    }
  },

  updateHealthData: async (id, healthData) => {
    try {
      return await api.put(`/health-data/${id}`, healthData);
    } catch (error) {
      console.error(`Update health data ${id} error:`, error);
      throw error;
    }
  },

  deleteHealthData: async (id) => {
    try {
      return await api.delete(`/health-data/${id}`);
    } catch (error) {
      console.error(`Delete health data ${id} error:`, error);
      throw error;
    }
  },

  getHealthDataByType: async (dataType, userId) => {
    try {
      if (!userId) {
        userId = await HealthDataService._getCurrentUserId();
      }
      const allData = await HealthDataService.getAllHealthData(userId);
      return allData.filter(data => data.dataType === dataType);
    } catch (error) {
      console.error(`Get health data by type ${dataType} error:`, error);
      throw error;
    }
  },

  getHealthDataByDateRange: async (startDate, endDate, userId) => {
    try {
      if (!userId) {
        userId = await HealthDataService._getCurrentUserId();
      }
      return await api.get(`/health-data/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.error(`Get health data by date range error:`, error);
      throw error;
    }
  },

  getAverageStepCount: async (startDate, endDate, userId) => {
    try {
      if (!userId) {
        userId = await HealthDataService._getCurrentUserId();
      }
      return await api.get(`/health-data/user/${userId}/average-steps?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.error('Get average step count error:', error);
      throw error;
    }
  },

  getAverageHeartRate: async (startDate, endDate, userId) => {
    try {
      if (!userId) {
        userId = await HealthDataService._getCurrentUserId();
      }
      return await api.get(`/health-data/user/${userId}/average-heart-rate?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.error('Get average heart rate error:', error);
      throw error;
    }
  },

  getAverageSleepDuration: async (startDate, endDate, userId) => {
    try {
      if (!userId) {
        userId = await HealthDataService._getCurrentUserId();
      }
      return await api.get(`/health-data/user/${userId}/average-sleep?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.error('Get average sleep duration error:', error);
      throw error;
    }
  },

  syncHealthData: async (healthDataList, userId) => {
    try {
      if (!userId) {
        userId = await HealthDataService._getCurrentUserId();
      }
      return await api.post(`/health-data/user/${userId}/sync`, healthDataList);
    } catch (error) {
      console.error('Sync health data error:', error);
      throw error;
    }
  }
};

export default HealthDataService;
