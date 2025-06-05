import React from 'react';
import './Todo.css';
import Header from '../components/common/Header';
import TodoList from '../components/todo/TodoList';

/**
 * Todo page component
 * Uses TodoContext for state management
 * @returns {JSX.Element} Todo page
 */
const Todo = () => {

  return (
    <div className="todo-page">
      <Header />
      <div className="todo-page-content">
        <div className="todo-page-header">
          <h1>Task Management</h1>
          <p>
            Keep track of your tasks and stay organized. Add new tasks, mark them as completed, 
            and remove them when they're no longer needed.
          </p>
        </div>

        <div className="todo-page-main">
          <TodoList />

          <div className="todo-tips">
            <h3>Tips for Effective Task Management</h3>
            <ul>
              <li>Break down large tasks into smaller, manageable ones</li>
              <li>Prioritize tasks based on importance and urgency</li>
              <li>Set realistic deadlines for your tasks</li>
              <li>Review and update your task list regularly</li>
              <li>Celebrate your accomplishments when you complete tasks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
