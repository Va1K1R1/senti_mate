import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecommendationService from '../services/RecommendationService';
import DiaryService from '../services/DiaryService';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDiary, setSelectedDiary] = useState('');
  const [generatingRecommendation, setGeneratingRecommendation] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load diaries first
      const diaryData = await DiaryService.getAllDiaries();
      setDiaries(diaryData);
      
      // Load all recommendations
      const recommendationData = await RecommendationService.getAllRecommendations();
      setRecommendations(recommendationData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDiaryChange = (e) => {
    setSelectedDiary(e.target.value);
  };

  const handleGenerateRecommendation = async () => {
    if (!selectedDiary) {
      setError('Please select a diary entry');
      return;
    }
    
    setGeneratingRecommendation(true);
    setError('');
    
    try {
      const newRecommendation = await RecommendationService.generateRecommendation(
        parseInt(selectedDiary)
      );
      
      setRecommendations([...recommendations, newRecommendation]);
      setSelectedDiary('');
    } catch (err) {
      setError(err.message || 'Failed to generate recommendation');
    } finally {
      setGeneratingRecommendation(false);
    }
  };

  const handleDeleteRecommendation = async (id) => {
    setLoading(true);
    try {
      await RecommendationService.deleteRecommendation(id);
      setRecommendations(recommendations.filter(rec => rec.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete recommendation');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDiaryTitle = (diaryId) => {
    const diary = diaries.find(d => d.id === diaryId);
    return diary ? diary.title : 'Unknown Diary';
  };

  if (loading && recommendations.length === 0) {
    return <div className="loading">Loading your recommendations...</div>;
  }

  return (
    <div className="recommendations-container">
      <h1>Recommendations</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="generate-recommendation">
        <h2>Generate New Recommendation</h2>
        <p>Select a diary entry to generate a personalized recommendation based on your mood and emotions.</p>
        
        <div className="form-group">
          <label htmlFor="diaryEntry">Diary Entry</label>
          <select
            id="diaryEntry"
            value={selectedDiary}
            onChange={handleDiaryChange}
            disabled={loading || generatingRecommendation}
          >
            <option value="">Select a diary entry</option>
            {diaries.map(diary => (
              <option key={diary.id} value={diary.id}>
                {diary.title} ({formatDate(diary.createdAt)})
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleGenerateRecommendation}
          disabled={loading || generatingRecommendation || !selectedDiary}
          className="generate-button"
        >
          {generatingRecommendation ? 'Generating...' : 'Generate Recommendation'}
        </button>
      </div>
      
      <div className="recommendations-list">
        <h2>Your Recommendations</h2>
        
        {recommendations.length === 0 ? (
          <div className="no-recommendations">
            No recommendations yet. Generate your first recommendation above!
          </div>
        ) : (
          <div className="recommendations-grid">
            {recommendations.map(recommendation => (
              <div key={recommendation.id} className="recommendation-card">
                <div className="recommendation-card-header">
                  <span className="recommendation-date">
                    {formatDate(recommendation.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDeleteRecommendation(recommendation.id)}
                    disabled={loading}
                    className="delete-button"
                    aria-label="Delete recommendation"
                  >
                    ×
                  </button>
                </div>
                <div className="recommendation-content">
                  {recommendation.content}
                </div>
                {recommendation.diaryEntry && (
                  <div className="recommendation-diary">
                    Based on: {getDiaryTitle(recommendation.diaryEntry.id)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="recommendations-actions">
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

export default Recommendations;