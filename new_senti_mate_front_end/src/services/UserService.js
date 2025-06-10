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