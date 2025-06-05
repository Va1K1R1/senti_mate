import React from 'react';
import './Home.css';
import Header from '../components/common/Header';
import TodoList from '../components/todo/TodoList';
import DiaryList from '../components/diary/DiaryList';

/**
 * Home page component
 * Uses TodoContext and DiaryContext for state management
 * @returns {JSX.Element} Home page
 */
const Home = () => {

  return (
    <div className="home-page">
      <Header />
      <div className="home-content">
        <h1 className="welcome-message">Welcome to SentiMate</h1>
        <p className="welcome-description">
          Track your emotions, manage your tasks, and improve your well-being with SentiMate.
        </p>

        <div className="dashboard-container">
          <div className="dashboard-column">
            <DiaryList />
          </div>
          <div className="dashboard-column">
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
