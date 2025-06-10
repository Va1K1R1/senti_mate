import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import UserService from '../../services/UserService';
import apiService from '../../services/apiService';

// Mock the apiService
jest.mock('../../services/apiService', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should call apiService.get with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          bio: 'Test bio',
          avatarUrl: 'https://example.com/avatar.jpg'
        }
      };
      apiService.get.mockResolvedValue(mockResponse);

      // Act
      const result = await UserService.getProfile();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/users/profile');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when getting profile', async () => {
      // Arrange
      const mockError = new Error('Failed to get profile');
      apiService.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(UserService.getProfile()).rejects.toThrow('Failed to get profile');
      expect(apiService.get).toHaveBeenCalledWith('/users/profile');
    });
  });

  describe('updateProfile', () => {
    it('should call apiService.put with correct parameters', async () => {
      // Arrange
      const profileData = {
        name: 'Updated Name',
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/new-avatar.jpg'
      };
      const mockResponse = {
        data: {
          id: 1,
          name: 'Updated Name',
          email: 'test@example.com',
          bio: 'Updated bio',
          avatarUrl: 'https://example.com/new-avatar.jpg'
        }
      };
      apiService.put.mockResolvedValue(mockResponse);

      // Act
      const result = await UserService.updateProfile(profileData);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith('/users/profile', profileData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when updating profile', async () => {
      // Arrange
      const profileData = {
        name: 'Updated Name',
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/new-avatar.jpg'
      };
      const mockError = new Error('Failed to update profile');
      apiService.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(UserService.updateProfile(profileData)).rejects.toThrow('Failed to update profile');
      expect(apiService.put).toHaveBeenCalledWith('/users/profile', profileData);
    });
  });

  describe('changePassword', () => {
    it('should call apiService.post with correct parameters', async () => {
      // Arrange
      const passwordData = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123'
      };
      const mockResponse = {
        data: {
          message: 'Password changed successfully'
        }
      };
      apiService.post.mockResolvedValue(mockResponse);

      // Act
      const result = await UserService.changePassword(passwordData);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/users/change-password', passwordData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error when changing password', async () => {
      // Arrange
      const passwordData = {
        oldPassword: 'wrongPassword',
        newPassword: 'newPassword123'
      };
      const mockError = new Error('Incorrect old password');
      apiService.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(UserService.changePassword(passwordData)).rejects.toThrow('Incorrect old password');
      expect(apiService.post).toHaveBeenCalledWith('/users/change-password', passwordData);
    });
  });
});