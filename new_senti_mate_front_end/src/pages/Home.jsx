import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';
import DiaryCard from '../components/diary/DiaryCard';
import MagneticButton from '../components/common/MagneticButton';
import '../styles/Home.css';

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
        <Link to="/diary/new">
          <MagneticButton className="new-entry-button" glowEffect={true}>
            Create New Entry
          </MagneticButton>
        </Link>
        <Link to="/health-data">
          <MagneticButton className="health-data-button">
            Health Data
          </MagneticButton>
        </Link>
        <Link to="/todo">
          <MagneticButton className="todo-button">
            Todo List
          </MagneticButton>
        </Link>
        <Link to="/recommendations">
          <MagneticButton className="recommendations-button">
            Recommendations
          </MagneticButton>
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
            <DiaryCard key={diary.id} diary={diary} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
