import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import EmotionService from '../../services/EmotionService';
import apiService from '../../services/apiService';

// Mock the apiService
jest.mock('../../services/apiService', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('EmotionService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllEmotions', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: 1, name: 'happy', description: 'Feeling joy or pleasure', color: '#FFD700' },
          { id: 2, name: 'sad', description: 'Feeling sorrow or unhappiness', color: '#4169E1' },
          { id: 3, name: 'angry', description: 'Feeling strong displeasure or hostility', color: '#FF0000' },
          { id: 4, name: 'relaxed', description: 'Feeling calm and free from tension', color: '#90EE90' }
        ]
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await EmotionService.getAllEmotions();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/emotions');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting all emotions', async () => {
      // Arrange
      const mockError = new Error('Failed to get emotions');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(EmotionService.getAllEmotions()).rejects.toThrow('Failed to get emotions');
      expect(apiService.get).toHaveBeenCalledWith('/emotions');
    });
  });

  describe('getEmotionById', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const id = 1;
      const mockResponse = {
        data: { id: 1, name: 'happy', description: 'Feeling joy or pleasure', color: '#FFD700' }
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await EmotionService.getEmotionById(id);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/emotions/${id}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting emotion by ID', async () => {
      // Arrange
      const id = 999;
      const mockError = new Error('Emotion not found');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(EmotionService.getEmotionById(id)).rejects.toThrow('Emotion not found');
      expect(apiService.get).toHaveBeenCalledWith(`/emotions/${id}`);
    });
  });

  describe('analyzeText', () => {
    it('should call apiService.post with correct parameters', async () => {
      // Arrange
      const text = 'I am feeling really happy today because the sun is shining.';
      const mockResponse = {
        data: {
          emotions: [
            { name: 'happy', score: 0.85 },
            { name: 'excited', score: 0.45 },
            { name: 'relaxed', score: 0.30 }
          ],
          dominantEmotion: 'happy'
        }
      };
      apiService.post.mockResolvedValue(mockResponse);

      // Act
      const result = await EmotionService.analyzeText(text);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/emotions/analyze', { text });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when analyzing text', async () => {
      // Arrange
      const text = 'I am feeling really happy today because the sun is shining.';
      const mockError = new Error('Failed to analyze text');
      apiService.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(EmotionService.analyzeText(text)).rejects.toThrow('Failed to analyze text');
      expect(apiService.post).toHaveBeenCalledWith('/emotions/analyze', { text });
    });
  });

  describe('getEmotionStats', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockResponse = {
        data: {
          emotionCounts: {
            happy: 10,
            sad: 5,
            angry: 2,
            relaxed: 8
          },
          mostFrequentEmotion: 'happy',
          emotionTrend: [
            { date: '2023-01-01', emotion: 'happy' },
            { date: '2023-01-02', emotion: 'relaxed' },
            { date: '2023-01-03', emotion: 'sad' }
          ]
        }
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await EmotionService.getEmotionStats(startDate, endDate);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/emotions/stats?start=${startDate}&end=${endDate}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting emotion stats', async () => {
      // Arrange
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockError = new Error('Failed to get emotion statistics');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(EmotionService.getEmotionStats(startDate, endDate)).rejects.toThrow('Failed to get emotion statistics');
      expect(apiService.get).toHaveBeenCalledWith(`/emotions/stats?start=${startDate}&end=${endDate}`);
    });
  });
});