import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiaries, setFilteredDiaries] = useState([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageMood: 0
  });
  
  const { diaries: contextDiaries, loading: contextLoading, error: contextError } = useDiary();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (contextDiaries) {
      setDiaries(contextDiaries);
      setFilteredDiaries(contextDiaries);
      setStats({
        totalEntries: contextDiaries.length,
        averageMood: calculateAverageMood(contextDiaries)
      });
      setLoading(contextLoading);
      setError(contextError);
    }
  }, [contextDiaries, contextLoading, contextError, isAuthenticated, navigate]);

  const calculateAverageMood = (diaryEntries) => {
    if (!diaryEntries || diaryEntries.length === 0) return 0;
    const sum = diaryEntries.reduce((acc, diary) => acc + (diary.moodScore || 0), 0);
    return (sum / diaryEntries.length).toFixed(1);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredDiaries(diaries);
      return;
    }
    
    const filtered = diaries.filter(diary => 
      diary.title.toLowerCase().includes(term.toLowerCase()) || 
      diary.content.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredDiaries(filtered);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading your diary entries...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome, {currentUser?.username || 'User'}</h1>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">Total Entries:</span>
            <span className="stat-value">{stats.totalEntries}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Mood:</span>
            <span className="stat-value">{stats.averageMood}/10</span>
          </div>
        </div>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search diary entries..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      <div className="action-buttons">
        <Link to="/diary/new" className="new-entry-button">
          Create New Entry
        </Link>
        <Link to="/health-data" className="health-data-button">
          Health Data
        </Link>
        <Link to="/todo" className="todo-button">
          Todo List
        </Link>
        <Link to="/recommendations" className="recommendations-button">
          Recommendations
        </Link>
      </div>
      
      <div className="diary-list">
        <h2>Your Diary Entries</h2>
        
        {filteredDiaries.length === 0 ? (
          <div className="no-entries">
            {searchTerm ? 
              'No entries match your search.' : 
              'You have no diary entries yet. Create your first entry!'}
          </div>
        ) : (
          filteredDiaries.map(diary => (
            <div key={diary.id} className="diary-card">
              <div className="diary-card-header">
                <h3 className="diary-card-title">{diary.title}</h3>
                <span className="diary-card-date">{formatDate(diary.createdAt)}</span>
              </div>
              <div className="diary-card-content">
                <p>{diary.content.length > 150 ? 
                  `${diary.content.substring(0, 150)}...` : 
                  diary.content}
                </p>
              </div>
              <div className="diary-card-footer">
                <div className="diary-card-metrics">
                  <span className="mood">Mood: {diary.moodScore}/10</span>
                  <span className="energy">Energy: {diary.energyLevel}/10</span>
                </div>
                <Link to={`/diary/${diary.id}`} className="view-button">
                  View Entry
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;