import React, { useState } from 'react';
import './TodoList.css';
import TodoItem from './TodoItem';
import Button from '../common/Button';
import { useTodo } from '../../context/TodoContext';

/**
 * TodoList component for displaying and managing a list of todo items
 * Uses TodoContext for state management
 * @returns {JSX.Element} TodoList component
 */
const TodoList = () => {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodo();
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      try {
        await addTodo(newTodoText);
        setNewTodoText('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h2>Todo List</h2>
      </div>

      <form className="todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <Button 
          type="primary" 
          className="todo-add-btn"
        >
          Add
        </Button>
      </form>

      {loading ? (
        <div className="todo-loading">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="todo-error">
          <p>Error loading tasks: {error}</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="todo-items">
          {todos.length === 0 ? (
            <div className="todo-empty">No tasks yet. Add one above!</div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      )}

      <div className="todo-summary">
        <p>{todos.filter(todo => todo.completed).length} of {todos.length} tasks completed</p>
      </div>
    </div>
  );
};

export default TodoList;
