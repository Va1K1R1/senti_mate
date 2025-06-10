import React, { createContext, useContext, useState, useEffect } from 'react';
import TodoService from '../services/todoService';

// Create the context
const TodoContext = createContext();

// Custom hook to use the todo context
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

/**
 * TodoProvider component for managing todo state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} TodoProvider component
 */
export const TodoProvider = ({ children }) => {
  // State for todo items
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load todos from API on initial render
  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const data = await TodoService.getAllTodos();
        setTodos(data);
      } catch (error) {
        console.error('Error loading todos:', error);
        setError('Failed to load todos');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  // Add a new todo
  const addTodo = async (text) => {
    setLoading(true);
    try {
      const newTodo = await TodoService.createTodo({ title: text, completed: false });
      setTodos([...todos, newTodo]);
      return newTodo;
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id) => {
    setLoading(true);
    try {
      await TodoService.toggleTodo(id);
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to update todo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await TodoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear all completed todos
  const clearCompleted = async () => {
    setLoading(true);
    try {
      await TodoService.clearCompletedTodos();
      setTodos(todos.filter(todo => !todo.completed));
    } catch (error) {
      console.error('Error clearing completed todos:', error);
      setError('Failed to clear completed todos');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Value object to be provided to consumers
  const value = {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;
