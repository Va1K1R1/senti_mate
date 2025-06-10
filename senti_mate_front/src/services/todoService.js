import api from './api';
import AuthService from './authService';

/**
 * Todo service for handling todo-related API calls
 */
const TodoService = {
  /**
   * Get the current user ID
   * @returns {Promise<number>} Current user ID
   * @private
   */
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },
  /**
   * Get all todo items
   * @param {number} [userId] - User ID (if not provided, gets current user ID)
   * @returns {Promise<Array>} Array of todo items
   */
  getAllTodos: async (userId) => {
    try {
      // If userId is not provided, get the current user ID
      if (!userId) {
        userId = await TodoService._getCurrentUserId();
      }

      const response = await api.get(`/todos?userId=${userId}`);
      // Check if response is a pagination object and extract the content array
      if (response && typeof response === 'object' && Array.isArray(response.content)) {
        return response.content;
      }
      // If response is already an array, return it
      if (Array.isArray(response)) {
        return response;
      }
      // If response is neither a pagination object nor an array, return an empty array
      console.warn('Unexpected response format from /todos endpoint:', response);
      return [];
    } catch (error) {
      console.error('Get all todos error:', error);
      throw error;
    }
  },

  /**
   * Get a todo item by ID
   * @param {number} id - Todo item ID
   * @returns {Promise<Object>} Todo item
   */
  getTodoById: async (id) => {
    try {
      return await api.get(`/todos/${id}`);
    } catch (error) {
      console.error(`Get todo by ID ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Create a new todo item
   * @param {Object} todo - Todo item data
   * @param {string} todo.title - Todo item title
   * @param {boolean} [todo.completed=false] - Todo item completion status
   * @param {number} [userId] - User ID (if not provided, gets current user ID)
   * @returns {Promise<Object>} Created todo item
   */
  createTodo: async (todo, userId) => {
    try {
      // If userId is not provided, get the current user ID
      if (!userId) {
        userId = await TodoService._getCurrentUserId();
      }

      return await api.post(`/todos?userId=${userId}`, todo);
    } catch (error) {
      console.error('Create todo error:', error);
      throw error;
    }
  },

  /**
   * Update a todo item
   * @param {number} id - Todo item ID
   * @param {Object} todo - Updated todo item data
   * @param {string} [todo.title] - Updated todo item title
   * @param {boolean} [todo.completed] - Updated todo item completion status
   * @returns {Promise<Object>} Updated todo item
   */
  updateTodo: async (id, todo) => {
    try {
      return await api.put(`/todos/${id}`, todo);
    } catch (error) {
      console.error(`Update todo ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Delete a todo item
   * @param {number} id - Todo item ID
   * @returns {Promise<void>}
   */
  deleteTodo: async (id) => {
    try {
      return await api.delete(`/todos/${id}`);
    } catch (error) {
      console.error(`Delete todo ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Toggle a todo item's completion status
   * @param {number} id - Todo item ID
   * @returns {Promise<Object>} Updated todo item
   */
  toggleTodo: async (id) => {
    try {
      // Use the PATCH endpoint specifically for toggling completion status
      return await api.patch(`/todos/${id}/toggle`);
    } catch (error) {
      console.error(`Toggle todo ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get completed todo items
   * @param {number} [userId] - User ID (if not provided, gets current user ID)
   * @returns {Promise<Array>} Array of completed todo items
   */
  getCompletedTodos: async (userId) => {
    try {
      // If userId is not provided, get the current user ID
      if (!userId) {
        userId = await TodoService._getCurrentUserId();
      }

      const response = await api.get(`/todos/user/${userId}/completed`);
      // Check if response is a pagination object and extract the content array
      if (response && typeof response === 'object' && Array.isArray(response.content)) {
        return response.content;
      }
      // If response is already an array, return it
      if (Array.isArray(response)) {
        return response;
      }
      // If response is neither a pagination object nor an array, return an empty array
      console.warn(`Unexpected response format from /todos/user/${userId}/completed endpoint:`, response);
      return [];
    } catch (error) {
      console.error('Get completed todos error:', error);
      throw error;
    }
  },

  /**
   * Get incomplete todo items
   * @param {number} [userId] - User ID (if not provided, gets current user ID)
   * @returns {Promise<Array>} Array of incomplete todo items
   */
  getIncompleteTodos: async (userId) => {
    try {
      // If userId is not provided, get the current user ID
      if (!userId) {
        userId = await TodoService._getCurrentUserId();
      }

      const response = await api.get(`/todos/user/${userId}/incomplete`);
      // Check if response is a pagination object and extract the content array
      if (response && typeof response === 'object' && Array.isArray(response.content)) {
        return response.content;
      }
      // If response is already an array, return it
      if (Array.isArray(response)) {
        return response;
      }
      // If response is neither a pagination object nor an array, return an empty array
      console.warn(`Unexpected response format from /todos/user/${userId}/incomplete endpoint:`, response);
      return [];
    } catch (error) {
      console.error('Get incomplete todos error:', error);
      throw error;
    }
  },

  /**
   * Clear all completed todo items
   * Note: This endpoint is not currently supported by the backend.
   * To clear completed todos, you'll need to get all completed todos
   * and delete them one by one using the deleteTodo method.
   * @returns {Promise<void>}
   */
  clearCompletedTodos: async () => {
    try {
      // This endpoint doesn't exist in the backend, so this will fail
      // A proper implementation would be:
      // 1. Get all completed todos for the user
      // 2. Delete each todo one by one
      console.warn('clearCompletedTodos is not supported by the backend');

      // For now, we'll just throw an error
      throw new Error('clearCompletedTodos is not supported by the backend');
    } catch (error) {
      console.error('Clear completed todos error:', error);
      throw error;
    }
  }
};

export default TodoService;
