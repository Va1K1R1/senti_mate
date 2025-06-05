import api from './api';

/**
 * Todo service for handling todo-related API calls
 */
const TodoService = {
  /**
   * Get all todo items
   * @returns {Promise<Array>} Array of todo items
   */
  getAllTodos: async () => {
    try {
      return await api.get('/todos');
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
   * @returns {Promise<Object>} Created todo item
   */
  createTodo: async (todo) => {
    try {
      return await api.post('/todos', todo);
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
      // First get the current todo to know its completion status
      const todo = await api.get(`/todos/${id}`);
      // Then update it with the opposite status
      return await api.put(`/todos/${id}`, {
        ...todo,
        completed: !todo.completed
      });
    } catch (error) {
      console.error(`Toggle todo ${id} error:`, error);
      throw error;
    }
  },

  /**
   * Get completed todo items
   * @returns {Promise<Array>} Array of completed todo items
   */
  getCompletedTodos: async () => {
    try {
      return await api.get('/todos/completed');
    } catch (error) {
      console.error('Get completed todos error:', error);
      throw error;
    }
  },

  /**
   * Get incomplete todo items
   * @returns {Promise<Array>} Array of incomplete todo items
   */
  getIncompleteTodos: async () => {
    try {
      return await api.get('/todos/incomplete');
    } catch (error) {
      console.error('Get incomplete todos error:', error);
      throw error;
    }
  },

  /**
   * Clear all completed todo items
   * @returns {Promise<void>}
   */
  clearCompletedTodos: async () => {
    try {
      return await api.delete('/todos/completed');
    } catch (error) {
      console.error('Clear completed todos error:', error);
      throw error;
    }
  }
};

export default TodoService;