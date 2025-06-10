import React, { useState } from 'react';
import './TodoItem.css';
import Button from '../common/Button';

/**
 * TodoItem component for displaying a single todo item
 * @param {Object} props - Component props
 * @param {Object} props.todo - Todo item object
 * @param {function} props.onToggle - Function to toggle todo completion
 * @param {function} props.onDelete - Function to delete todo
 * @returns {JSX.Element} TodoItem component
 */
const TodoItem = ({ todo, onToggle, onDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      await onToggle(todo.id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isToggling}
          className="todo-checkbox"
        />
        <span className="todo-text">{todo.title}</span>
      </div>
      <div className="todo-actions">
        <Button 
          type="danger" 
          onClick={handleDelete}
          disabled={isDeleting}
          className="todo-delete-btn"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;
