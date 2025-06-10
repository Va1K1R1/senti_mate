import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import RecommendationService from '../../services/RecommendationService';
import apiService from '../../services/apiService';

// Mock the apiService
jest.mock('../../services/apiService', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

describe('RecommendationService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllRecommendations', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: 1,
            type: 'wellness',
            content: 'Try meditation for 10 minutes each morning to reduce stress.',
            isRead: false,
            isHelpful: null,
            createdAt: '2023-01-01T12:00:00Z'
          },
          {
            id: 2,
            type: 'exercise',
            content: 'Consider adding a 30-minute walk to your daily routine.',
            isRead: true,
            isHelpful: true,
            createdAt: '2023-01-02T12:00:00Z'
          }
        ]
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await RecommendationService.getAllRecommendations();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/recommendations');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting all recommendations', async () => {
      // Arrange
      const mockError = new Error('Failed to get recommendations');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(RecommendationService.getAllRecommendations()).rejects.toThrow('Failed to get recommendations');
      expect(apiService.get).toHaveBeenCalledWith('/recommendations');
    });
  });

  describe('getRecommendationById', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const id = 1;
      const mockResponse = {
        data: {
          id: 1,
          type: 'wellness',
          content: 'Try meditation for 10 minutes each morning to reduce stress.',
          isRead: false,
          isHelpful: null,
          createdAt: '2023-01-01T12:00:00Z'
        }
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await RecommendationService.getRecommendationById(id);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/recommendations/${id}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting recommendation by ID', async () => {
      // Arrange
      const id = 999;
      const mockError = new Error('Recommendation not found');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(RecommendationService.getRecommendationById(id)).rejects.toThrow('Recommendation not found');
      expect(apiService.get).toHaveBeenCalledWith(`/recommendations/${id}`);
    });
  });

  describe('getRecommendationsByType', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const type = 'wellness';
      const mockResponse = {
        data: [
          {
            id: 1,
            type: 'wellness',
            content: 'Try meditation for 10 minutes each morning to reduce stress.',
            isRead: false,
            isHelpful: null,
            createdAt: '2023-01-01T12:00:00Z'
          },
          {
            id: 3,
            type: 'wellness',
            content: 'Consider keeping a gratitude journal to improve mental health.',
            isRead: false,
            isHelpful: null,
            createdAt: '2023-01-03T12:00:00Z'
          }
        ]
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await RecommendationService.getRecommendationsByType(type);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/recommendations/type/${type}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting recommendations by type', async () => {
      // Arrange
      const type = 'unknown_type';
      const mockError = new Error('Invalid recommendation type');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(RecommendationService.getRecommendationsByType(type)).rejects.toThrow('Invalid recommendation type');
      expect(apiService.get).toHaveBeenCalledWith(`/recommendations/type/${type}`);
    });
  });

  describe('generateRecommendation', () => {
    it('should call apiService.post with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: {
          id: 4,
          type: 'mental_health',
          content: 'Based on your recent diary entries, consider practicing mindfulness to help with anxiety.',
          isRead: false,
          isHelpful: null,
          createdAt: '2023-01-04T12:00:00Z'
        }
      };
      apiService.post.mockResolvedValue(mockResponse);

      // Act
      const result = await RecommendationService.generateRecommendation();

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/recommendations/generate');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when generating recommendation', async () => {
      // Arrange
      const mockError = new Error('Failed to generate recommendation');
      apiService.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(RecommendationService.generateRecommendation()).rejects.toThrow('Failed to generate recommendation');
      expect(apiService.post).toHaveBeenCalledWith('/recommendations/generate');
    });
  });

  describe('markAsRead', () => {
    it('should call apiService.put with correct parameters', async () => {
      // Arrange
      const id = 1;
      const mockResponse = {
        data: {
          id: 1,
          type: 'wellness',
          content: 'Try meditation for 10 minutes each morning to reduce stress.',
          isRead: true,
          isHelpful: null,
          createdAt: '2023-01-01T12:00:00Z'
        }
      };
      apiService.put.mockResolvedValue(mockResponse);

      // Act
      const result = await RecommendationService.markAsRead(id);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith(`/recommendations/${id}/read`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when marking recommendation as read', async () => {
      // Arrange
      const id = 999;
      const mockError = new Error('Recommendation not found');
      apiService.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(RecommendationService.markAsRead(id)).rejects.toThrow('Recommendation not found');
      expect(apiService.put).toHaveBeenCalledWith(`/recommendations/${id}/read`);
    });
  });

  describe('markHelpfulness', () => {
    it('should call apiService.put with correct parameters when marking as helpful', async () => {
      // Arrange
      const id = 1;
      const isHelpful = true;
      const mockResponse = {
        data: {
          id: 1,
          type: 'wellness',
          content: 'Try meditation for 10 minutes each morning to reduce stress.',
          isRead: true,
          isHelpful: true,
          createdAt: '2023-01-01T12:00:00Z'
        }
      };
      apiService.put.mockResolvedValue(mockResponse);

      // Act
      const result = await RecommendationService.markHelpfulness(id, isHelpful);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith(`/recommendations/${id}/helpful`, { isHelpful });
      expect(result).toEqual(mockResponse.data);
    });

    it('should call apiService.put with correct parameters when marking as not helpful', async () => {
      // Arrange
      const id = 1;
      const isHelpful = false;
      const mockResponse = {
        data: {
          id: 1,
          type: 'wellness',
          content: 'Try meditation for 10 minutes each morning to reduce stress.',
          isRead: true,
          isHelpful: false,
          createdAt: '2023-01-01T12:00:00Z'
        }
      };
      apiService.put.mockResolvedValue(mockResponse);

      // Act
      const result = await RecommendationService.markHelpfulness(id, isHelpful);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith(`/recommendations/${id}/helpful`, { isHelpful });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when marking recommendation helpfulness', async () => {
      // Arrange
      const id = 999;
      const isHelpful = true;
      const mockError = new Error('Recommendation not found');
      apiService.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(RecommendationService.markHelpfulness(id, isHelpful)).rejects.toThrow('Recommendation not found');
      expect(apiService.put).toHaveBeenCalledWith(`/recommendations/${id}/helpful`, { isHelpful });
    });
  });
});