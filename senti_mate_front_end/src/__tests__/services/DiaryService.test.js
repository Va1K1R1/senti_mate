import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import DiaryService from '../../services/DiaryService';
import apiService from '../../services/apiService';

// Mock the apiService
jest.mock('../../services/apiService', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('DiaryService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllEntries', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: 1,
            title: 'Test Diary Entry 1',
            content: 'Test content 1',
            emotion: 'happy',
            date: '2023-01-01T12:00:00Z'
          },
          {
            id: 2,
            title: 'Test Diary Entry 2',
            content: 'Test content 2',
            emotion: 'sad',
            date: '2023-01-02T12:00:00Z'
          }
        ]
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await DiaryService.getAllEntries();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/diary');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting all entries', async () => {
      // Arrange
      const mockError = new Error('Failed to get diary entries');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(DiaryService.getAllEntries()).rejects.toThrow('Failed to get diary entries');
      expect(apiService.get).toHaveBeenCalledWith('/diary');
    });
  });

  describe('getEntryById', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const id = 1;
      const mockResponse = {
        data: {
          id: 1,
          title: 'Test Diary Entry',
          content: 'Test content',
          emotion: 'happy',
          date: '2023-01-01T12:00:00Z'
        }
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await DiaryService.getEntryById(id);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/diary/${id}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting entry by ID', async () => {
      // Arrange
      const id = 999;
      const mockError = new Error('Diary entry not found');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(DiaryService.getEntryById(id)).rejects.toThrow('Diary entry not found');
      expect(apiService.get).toHaveBeenCalledWith(`/diary/${id}`);
    });
  });

  describe('createEntry', () => {
    it('should call apiService.post with correct parameters', async () => {
      // Arrange
      const entryData = {
        title: 'New Diary Entry',
        content: 'New content',
        emotion: 'excited',
        date: '2023-01-03T12:00:00Z'
      };
      const mockResponse = {
        data: {
          id: 3,
          ...entryData
        }
      };
      apiService.post.mockResolvedValue(mockResponse);

      // Act
      const result = await DiaryService.createEntry(entryData);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/diary', entryData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when creating entry', async () => {
      // Arrange
      const entryData = {
        title: 'New Diary Entry',
        content: 'New content',
        emotion: 'excited',
        date: '2023-01-03T12:00:00Z'
      };
      const mockError = new Error('Failed to create diary entry');
      apiService.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(DiaryService.createEntry(entryData)).rejects.toThrow('Failed to create diary entry');
      expect(apiService.post).toHaveBeenCalledWith('/diary', entryData);
    });
  });

  describe('updateEntry', () => {
    it('should call apiService.put with correct parameters', async () => {
      // Arrange
      const id = 1;
      const entryData = {
        title: 'Updated Diary Entry',
        content: 'Updated content',
        emotion: 'relaxed',
      };
      const mockResponse = {
        data: {
          id: 1,
          ...entryData,
          date: '2023-01-01T12:00:00Z'
        }
      };
      apiService.put.mockResolvedValue(mockResponse);

      // Act
      const result = await DiaryService.updateEntry(id, entryData);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith(`/diary/${id}`, entryData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when updating entry', async () => {
      // Arrange
      const id = 999;
      const entryData = {
        title: 'Updated Diary Entry',
        content: 'Updated content',
        emotion: 'relaxed',
      };
      const mockError = new Error('Diary entry not found');
      apiService.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(DiaryService.updateEntry(id, entryData)).rejects.toThrow('Diary entry not found');
      expect(apiService.put).toHaveBeenCalledWith(`/diary/${id}`, entryData);
    });
  });

  describe('deleteEntry', () => {
    it('should call apiService.delete with correct parameters', async () => {
      // Arrange
      const id = 1;
      const mockResponse = {
        data: {
          message: 'Diary entry deleted successfully'
        }
      };
      apiService.delete.mockResolvedValue(mockResponse);

      // Act
      const result = await DiaryService.deleteEntry(id);

      // Assert
      expect(apiService.delete).toHaveBeenCalledWith(`/diary/${id}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when deleting entry', async () => {
      // Arrange
      const id = 999;
      const mockError = new Error('Diary entry not found');
      apiService.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(DiaryService.deleteEntry(id)).rejects.toThrow('Diary entry not found');
      expect(apiService.delete).toHaveBeenCalledWith(`/diary/${id}`);
    });
  });

  describe('getEntriesByDateRange', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockResponse = {
        data: [
          {
            id: 1,
            title: 'Test Diary Entry 1',
            content: 'Test content 1',
            emotion: 'happy',
            date: '2023-01-01T12:00:00Z'
          },
          {
            id: 2,
            title: 'Test Diary Entry 2',
            content: 'Test content 2',
            emotion: 'sad',
            date: '2023-01-02T12:00:00Z'
          }
        ]
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await DiaryService.getEntriesByDateRange(startDate, endDate);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/diary/range?start=${startDate}&end=${endDate}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting entries by date range', async () => {
      // Arrange
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockError = new Error('Failed to get diary entries');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(DiaryService.getEntriesByDateRange(startDate, endDate)).rejects.toThrow('Failed to get diary entries');
      expect(apiService.get).toHaveBeenCalledWith(`/diary/range?start=${startDate}&end=${endDate}`);
    });
  });
});