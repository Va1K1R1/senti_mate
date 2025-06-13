import api from './apiService';
import AuthService from './AuthService';

const UserService = {
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },

  getAllUsers: async () => {
    try {
      return await api.get('/users');
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      return await api.get(`/users/${id}`);
    } catch (error) {
      console.error(`Get user by ID ${id} error:`, error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const userId = await UserService._getCurrentUserId();
      return await UserService.getUserById(userId);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      return await api.put(`/users/${id}`, userData);
    } catch (error) {
      console.error(`Update user ${id} error:`, error);
      throw error;
    }
  },

  updateCurrentUser: async (userData) => {
    try {
      const userId = await UserService._getCurrentUserId();
      const updatedUser = await UserService.updateUser(userId, userData);

      // Update the stored user data
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        const updatedStoredUser = {
          ...currentUser,
          ...updatedUser
        };
        localStorage.setItem('user', JSON.stringify(updatedStoredUser));
      }

      return updatedUser;
    } catch (error) {
      console.error('Update current user error:', error);
      throw error;
    }
  },

  uploadProfilePicture: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/users/${id}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the stored user data if it's the current user
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        const updatedUser = { 
          ...currentUser, 
          profilePicture: response.profilePicture 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return response;
    } catch (error) {
      console.error(`Upload profile picture for user ${id} error:`, error);
      throw error;
    }
  },

  uploadCurrentUserProfilePicture: async (file) => {
    try {
      const userId = await UserService._getCurrentUserId();
      return await UserService.uploadProfilePicture(userId, file);
    } catch (error) {
      console.error('Upload current user profile picture error:', error);
      throw error;
    }
  },

  requestEmailVerification: async () => {
    try {
      const userId = await UserService._getCurrentUserId();
      return await api.post(`/users/${userId}/verify-email`);
    } catch (error) {
      console.error('Request email verification error:', error);
      throw error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.post('/users/verify-email', { token });

      // Update the stored user data
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { 
          ...currentUser, 
          isEmailVerified: true 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return response;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      return await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Delete user ${id} error:`, error);
      throw error;
    }
  }
};

export default UserService;
