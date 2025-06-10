import api from './apiService';
import AuthService from './AuthService';

const TodoService = {
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },

  getAllTodos: async (userId) => {
    try {
      if (!userId) {
        userId = await TodoService._getCurrentUserId();
      }
      return await api.get(`/todos/user/${userId}`);
    } catch (error) {
      console.error('Get all todos error:', error);
      throw error;
    }
  },

  getTodoById: async (id) => {
    try {
      return await api.get(`/todos/${id}`);
    } catch (error) {
      console.error(`Get todo by ID ${id} error:`, error);
      throw error;
    }
  },

  createTodo: async (todo, userId) => {
    try {
      if (!userId) {
        userId = await TodoService._getCurrentUserId();
      }
      return await api.post(`/todos/user/${userId}`, todo);
    } catch (error) {
      console.error('Create todo error:', error);
      throw error;
    }
  },

  updateTodo: async (id, todo) => {
    try {
      return await api.put(`/todos/${id}`, todo);
    } catch (error) {
      console.error(`Update todo ${id} error:`, error);
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      return await api.delete(`/todos/${id}`);
    } catch (error) {
      console.error(`Delete todo ${id} error:`, error);
      throw error;
    }
  },

  toggleTodoCompleted: async (id) => {
    try {
      const todo = await TodoService.getTodoById(id);
      return await TodoService.updateTodo(id, {
        ...todo,
        completed: !todo.completed
      });
    } catch (error) {
      console.error(`Toggle todo ${id} completed error:`, error);
      throw error;
    }
  }
};

export default TodoService;