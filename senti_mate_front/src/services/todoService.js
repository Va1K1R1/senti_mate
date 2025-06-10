import api from './api';

/**
 * Todo service for handling todo-related API calls
 */
const TodoService = {
  /**
   * Get all todo items
   * @param {number} [userId=1] - User ID (defaults to 1 if not provided)
   * @returns {Promise<Array>} Array of todo items
   */
  getAllTodos: async (userId = 1) => {
    try {
      return await api.get(`/todos?userId=${userId}`);
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
   * @param {string} todo.text - Todo item text
   * @param {boolean} [todo.completed=false] - Todo item completion status
   * @param {number} [userId=1] - User ID (defaults to 1 if not provided)
   * @returns {Promise<Object>} Created todo item
   */
  createTodo: async (todo, userId = 1) => {
    try {
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
   * @param {string} [todo.text] - Updated todo item text
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
   * @param {number} [userId=1] - User ID (defaults to 1 if not provided)
   * @returns {Promise<Array>} Array of completed todo items
   */
  getCompletedTodos: async (userId = 1) => {
    try {
      return await api.get(`/todos/user/${userId}/completed`);
    } catch (error) {
      console.error('Get completed todos error:', error);
      throw error;
    }
  },

  /**
   * Get incomplete todo items
   * @param {number} [userId=1] - User ID (defaults to 1 if not provided)
   * @returns {Promise<Array>} Array of incomplete todo items
   */
  getIncompleteTodos: async (userId = 1) => {
    try {
      return await api.get(`/todos/user/${userId}/incomplete`);
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
