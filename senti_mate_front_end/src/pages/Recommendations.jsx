import React, { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import RecommendationList from '../component/RecommendationList';
import '../component/RecommendationList.css';
import useRecommendation from '../hooks/useRecommendation';
import './Recommendations.css';

/**
 * Recommendations page component
 * Displays personalized wellness recommendations from ChatGPT
 */
const RecommendationsPage = () => {
  const [recommendationType, setRecommendationType] = useState('wellness');
  const [days, setDays] = useState(7);

  const { recommendations, loading, error, lastFetched, fetchRecommendations } = useRecommendation({
    fetchOnMount: true,
    recommendationType,
    days,
  });

  const handleTypeChange = type => {
    setRecommendationType(type);
  };

  const handleDaysChange = numDays => {
    setDays(numDays);
  };

  const handleRefresh = () => {
    fetchRecommendations(recommendationType);
  };

  return (
    <div className="recommendations-page">
      <Header />
      <div className="recommendations-container">
        <h1>Your Wellness Recommendations</h1>
        <p className="recommendations-subtitle">
          Personalized advice based on your health diary
        </p>

        <div className="recommendations-controls">
          <div className="recommendation-type-selector">
            <label>Recommendation Type:</label>
            <div className="button-group">
              <button
                className={`type-button ${recommendationType === 'wellness' ? 'active' : ''}`}
                onClick={() => handleTypeChange('wellness')}
              >
                Wellness
              </button>
              <button
                className={`type-button ${recommendationType === 'exercise' ? 'active' : ''}`}
                onClick={() => handleTypeChange('exercise')}
              >
                Exercise
              </button>
              <button
                className={`type-button ${recommendationType === 'nutrition' ? 'active' : ''}`}
                onClick={() => handleTypeChange('nutrition')}
              >
                Nutrition
              </button>
              <button
                className={`type-button ${recommendationType === 'mental' ? 'active' : ''}`}
                onClick={() => handleTypeChange('mental')}
              >
                Mental Health
              </button>
            </div>
          </div>

          <div className="days-selector">
            <label>Data from last:</label>
            <div className="button-group">
              <button
                className={`days-button ${days === 7 ? 'active' : ''}`}
                onClick={() => handleDaysChange(7)}
              >
                7 days
              </button>
              <button
                className={`days-button ${days === 14 ? 'active' : ''}`}
                onClick={() => handleDaysChange(14)}
              >
                14 days
              </button>
              <button
                className={`days-button ${days === 30 ? 'active' : ''}`}
                onClick={() => handleDaysChange(30)}
              >
                30 days
              </button>
            </div>
          </div>

          <button className="refresh-button" onClick={handleRefresh}>
            Refresh Recommendations
          </button>
        </div>

        {lastFetched && (
          <p className="last-updated">
            Last updated: {new Date(lastFetched).toLocaleString()}
          </p>
        )}

        <RecommendationList
          recommendations={recommendations}
          isLoading={loading}
          error={error}
        />
      </div>
      <Footer />
    </div>
  );
};

export default RecommendationsPage;
