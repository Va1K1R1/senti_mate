import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import AuthService from '../../services/AuthService';
import apiService from '../../services/apiService';

// Mock the apiService
jest.mock('../../services/apiService', () => ({
  post: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('login', () => {
    it('should call apiService.post with correct parameters', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: 1, email: 'test@example.com', name: 'Test User' }
        }
      };
      apiService.post.mockResolvedValue(mockResponse);

      // Act
      const result = await AuthService.login(email, password);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/auth/login', { email, password });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
    });

    it('should handle login error', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrong-password';
      const mockError = new Error('Invalid credentials');
      apiService.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(AuthService.login(email, password)).rejects.toThrow('Invalid credentials');
      expect(apiService.post).toHaveBeenCalledWith('/auth/login', { email, password });
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('register', () => {
    it('should call apiService.post with correct parameters', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      const mockResponse = {
        data: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        }
      };
      apiService.post.mockResolvedValue(mockResponse);

      // Act
      const result = await AuthService.register(userData);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration error', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };
      const mockError = new Error('Email already exists');
      apiService.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(AuthService.register(userData)).rejects.toThrow('Email already exists');
      expect(apiService.post).toHaveBeenCalledWith('/auth/register', userData);
    });
  });

  describe('logout', () => {
    it('should remove token and user from localStorage', () => {
      // Arrange
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));

      // Act
      AuthService.logout();

      // Assert
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from localStorage', () => {
      // Arrange
      const user = { id: 1, name: 'Test User', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(user));

      // Act
      const result = AuthService.getCurrentUser();

      // Assert
      expect(result).toEqual(user);
    });

    it('should return null if user is not in localStorage', () => {
      // Act
      const result = AuthService.getCurrentUser();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists in localStorage', () => {
      // Arrange
      localStorage.setItem('token', 'test-token');

      // Act
      const result = AuthService.isAuthenticated();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if token does not exist in localStorage', () => {
      // Act
      const result = AuthService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });
  });
});
