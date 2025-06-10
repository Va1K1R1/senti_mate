import React from 'react';
import './Dashboard.css';
import Header from '../components/common/Header';
import { useDiary } from '../context/DiaryContext';
import { useTodo } from '../context/TodoContext';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard page component for displaying a comprehensive health view
 * @returns {JSX.Element} Dashboard page
 */
const Dashboard = () => {
  const { diaries, loading: diaryLoading, error: diaryError } = useDiary();
  const { todos, loading: todoLoading, error: todoError } = useTodo();
  const navigate = useNavigate();

  // Calculate statistics
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  // Get emotion counts
  const emotionCounts = diaries.reduce((counts, diary) => {
    const emotion = diary.emotion?.toLowerCase() || 'unknown';
    counts[emotion] = (counts[emotion] || 0) + 1;
    return counts;
  }, {});

  // Get most frequent emotion
  const mostFrequentEmotion = Object.entries(emotionCounts).reduce(
    (max, [emotion, count]) => (count > max.count ? { emotion, count } : max),
    { emotion: 'none', count: 0 }
  );

  // Get recent diaries (last 3)
  const recentDiaries = [...diaries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Navigate to diary detail
  const handleDiaryClick = (id) => {
    navigate(`/diary/${id}`);
  };

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Health Dashboard</h1>

        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>Mood Summary</h3>
            {diaryLoading ? (
              <p>Loading...</p>
            ) : diaryError ? (
              <p className="error-text">Error loading diary data</p>
            ) : (
              <>
                <p className="stat-large">
                  {mostFrequentEmotion.emotion !== 'none' 
                    ? mostFrequentEmotion.emotion.charAt(0).toUpperCase() + mostFrequentEmotion.emotion.slice(1) 
                    : 'No entries'}
                </p>
                <p className="stat-label">Most frequent mood</p>
                <p className="stat-small">{diaries.length} diary entries total</p>
              </>
            )}
          </div>

          <div className="summary-card">
            <h3>Task Progress</h3>
            {todoLoading ? (
              <p>Loading...</p>
            ) : todoError ? (
              <p className="error-text">Error loading todo data</p>
            ) : (
              <>
                <p className="stat-large">{completionRate}%</p>
                <p className="stat-label">Tasks completed</p>
                <p className="stat-small">{completedTodos} of {totalTodos} tasks</p>
              </>
            )}
          </div>

          <div className="summary-card">
            <h3>Health Status</h3>
            <p className="stat-large">Coming Soon</p>
            <p className="stat-label">Health data integration</p>
            <p className="stat-small">Connect with Samsung Health</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Diary Entries</h2>
              <Button type="primary" onClick={() => navigate('/diary/new')}>
                New Entry
              </Button>
            </div>

            {diaryLoading ? (
              <div className="loading-indicator">Loading diary entries...</div>
            ) : diaryError ? (
              <div className="error-message">
                <p>Error loading diary entries</p>
                <Button type="primary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : recentDiaries.length === 0 ? (
              <div className="empty-state">
                <p>No diary entries yet. Create your first entry!</p>
              </div>
            ) : (
              <div className="recent-diaries">
                {recentDiaries.map(diary => (
                  <div 
                    key={diary.id} 
                    className="recent-diary-item"
                    onClick={() => handleDiaryClick(diary.id)}
                  >
                    <div className="diary-item-header">
                      <h3>{diary.title}</h3>
                      <span className={`emotion-badge ${diary.emotion}`}>
                        {diary.emotion}
                      </span>
                    </div>
                    <p className="diary-item-preview">
                      {diary.content.length > 100 
                        ? diary.content.substring(0, 100) + '...' 
                        : diary.content}
                    </p>
                    <p className="diary-item-date">{formatDate(diary.date)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Tasks</h2>
              <Button type="primary" onClick={() => navigate('/todo')}>
                View All
              </Button>
            </div>

            {todoLoading ? (
              <div className="loading-indicator">Loading tasks...</div>
            ) : todoError ? (
              <div className="error-message">
                <p>Error loading tasks</p>
                <Button type="primary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : todos.filter(todo => !todo.completed).length === 0 ? (
              <div className="empty-state">
                <p>No pending tasks. Great job!</p>
              </div>
            ) : (
              <div className="upcoming-todos">
                {todos
                  .filter(todo => !todo.completed)
                  .slice(0, 5)
                  .map(todo => (
                    <div key={todo.id} className="todo-item-simple">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => {}} // This will be handled in the Todo page
                        className="todo-checkbox"
                      />
                      <span className="todo-text">{todo.title}</span>
                    </div>
                  ))}
                {todos.filter(todo => !todo.completed).length > 5 && (
                  <p className="more-items">
                    +{todos.filter(todo => !todo.completed).length - 5} more tasks
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
