import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TodoService from '../services/TodoService';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadTodos();
  }, [isAuthenticated, navigate]);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const data = await TodoService.getAllTodos();
      setTodos(data);
      // Move debug logs here to see the actual data received
      console.log('Data received from API:', data);
      console.log('Type of data:', typeof data);
      console.log('Is array?', Array.isArray(data));
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  // Always ensure todos is an array before using .filter()
  const safeTodos = Array.isArray(todos) ? todos : [];

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!newTodoText.trim()) return;

    setLoading(true);
    try {
      const newTodo = {
        title: newTodoText,  // Changed from 'text' to 'title'
        completed: false
      };

      const createdTodo = await TodoService.createTodo(newTodo);
      setTodos([...safeTodos, createdTodo]);
      setNewTodoText('');
    } catch (err) {
      setError(err.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id) => {
    setLoading(true);
    try {
      const updatedTodo = await TodoService.toggleTodoCompleted(id);
      setTodos(safeTodos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    setLoading(true);
    try {
      await TodoService.deleteTodo(id);
      setTodos(safeTodos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  const filteredTodos = safeTodos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  const completedCount = safeTodos.filter(todo => todo.completed).length;
  const activeCount = safeTodos.length - completedCount;

  if (loading && safeTodos.length === 0) {
    return <div className="loading">Loading your todos...</div>;
  }

  return (
    <div className="todo-container">
      <h1>Todo List</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="todo-stats">
        <span className="todo-count">
          {activeCount} active, {completedCount} completed
        </span>
        <div className="todo-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          disabled={loading}
          className="todo-input"
        />
        <button 
          type="submit" 
          disabled={loading || !newTodoText.trim()}
          className="todo-add-button"
        >
          Add
        </button>
      </form>

      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="todo-empty">
            {filter === 'all' 
              ? 'No todos yet. Add one above!' 
              : filter === 'active' 
                ? 'No active todos.' 
                : 'No completed todos.'}
          </li>
        ) : (
          filteredTodos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-item-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  disabled={loading}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.title}</span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                disabled={loading}
                className="todo-delete-button"
                aria-label="Delete todo"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="todo-actions">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Todo;
