import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import HealthDataService from '../../services/HealthDataService';
import apiService from '../../services/apiService';

// Mock the apiService
jest.mock('../../services/apiService', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('HealthDataService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllHealthData', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: 1,
            type: 'steps',
            value: 8500,
            date: '2023-01-01T12:00:00Z',
            source: 'Samsung Health'
          },
          {
            id: 2,
            type: 'heart_rate',
            value: 72,
            date: '2023-01-01T12:30:00Z',
            source: 'Samsung Health'
          }
        ]
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await HealthDataService.getAllHealthData();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/health-data');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting all health data', async () => {
      // Arrange
      const mockError = new Error('Failed to get health data');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(HealthDataService.getAllHealthData()).rejects.toThrow('Failed to get health data');
      expect(apiService.get).toHaveBeenCalledWith('/health-data');
    });
  });

  describe('getHealthDataByType', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const type = 'steps';
      const mockResponse = {
        data: [
          {
            id: 1,
            type: 'steps',
            value: 8500,
            date: '2023-01-01T12:00:00Z',
            source: 'Samsung Health'
          },
          {
            id: 3,
            type: 'steps',
            value: 10200,
            date: '2023-01-02T12:00:00Z',
            source: 'Samsung Health'
          }
        ]
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await HealthDataService.getHealthDataByType(type);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/health-data/type/${type}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting health data by type', async () => {
      // Arrange
      const type = 'unknown_type';
      const mockError = new Error('Invalid health data type');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(HealthDataService.getHealthDataByType(type)).rejects.toThrow('Invalid health data type');
      expect(apiService.get).toHaveBeenCalledWith(`/health-data/type/${type}`);
    });
  });

  describe('getHealthDataByDateRange', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockResponse = {
        data: [
          {
            id: 1,
            type: 'steps',
            value: 8500,
            date: '2023-01-01T12:00:00Z',
            source: 'Samsung Health'
          },
          {
            id: 2,
            type: 'heart_rate',
            value: 72,
            date: '2023-01-01T12:30:00Z',
            source: 'Samsung Health'
          }
        ]
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await HealthDataService.getHealthDataByDateRange(startDate, endDate);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/health-data/range?start=${startDate}&end=${endDate}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting health data by date range', async () => {
      // Arrange
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockError = new Error('Failed to get health data');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(HealthDataService.getHealthDataByDateRange(startDate, endDate)).rejects.toThrow('Failed to get health data');
      expect(apiService.get).toHaveBeenCalledWith(`/health-data/range?start=${startDate}&end=${endDate}`);
    });
  });

  describe('syncHealthData', () => {
    it('should call apiService.post with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: {
          message: 'Health data synced successfully',
          syncedItems: 15
        }
      };
      apiService.post.mockResolvedValue(mockResponse);

      // Act
      const result = await HealthDataService.syncHealthData();

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/health-data/sync');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when syncing health data', async () => {
      // Arrange
      const mockError = new Error('Failed to sync health data');
      apiService.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(HealthDataService.syncHealthData()).rejects.toThrow('Failed to sync health data');
      expect(apiService.post).toHaveBeenCalledWith('/health-data/sync');
    });
  });

  describe('getHealthDataStats', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const type = 'steps';
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockResponse = {
        data: {
          average: 9500,
          max: 15000,
          min: 5000,
          total: 294500,
          dailyAverage: 9500,
          trend: [
            { date: '2023-01-01', value: 8500 },
            { date: '2023-01-02', value: 10200 },
            { date: '2023-01-03', value: 7800 }
          ]
        }
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await HealthDataService.getHealthDataStats(type, startDate, endDate);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/health-data/stats/${type}?start=${startDate}&end=${endDate}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting health data stats', async () => {
      // Arrange
      const type = 'steps';
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockError = new Error('Failed to get health data statistics');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(HealthDataService.getHealthDataStats(type, startDate, endDate)).rejects.toThrow('Failed to get health data statistics');
      expect(apiService.get).toHaveBeenCalledWith(`/health-data/stats/${type}?start=${startDate}&end=${endDate}`);
    });
  });
});