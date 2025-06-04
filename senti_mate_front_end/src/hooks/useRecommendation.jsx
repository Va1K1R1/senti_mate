import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';
import useDiary from './useDiary';
import useHealthData from './useHealthData';

/**
 * Custom hook for fetching ChatGPT recommendations
 * @param {Object} options - Options for the hook
 * @param {boolean} options.fetchOnMount - Whether to fetch recommendations on component mount
 * @param {string} options.recommendationType - Type of recommendation to fetch (wellness, exercise, nutrition, mental)
 * @param {number} options.days - Number of days of data to consider
 * @returns {Object} Recommendation data and methods
 */
const useRecommendation = (options = {}) => {
  const {
    fetchOnMount = false,
    recommendationType = 'wellness',
    days = 7,
  } = options;

  // Use the useApi hook for making API calls
  const recommendationApi = useApi('/api/recommendations');

  // Use the useDiary hook to get diary entries
  const { getAllDiaries } = useDiary();

  // Use the useHealthData hook to get health data
  const healthData = useHealthData({ days });

  // State for recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Fetch recommendations from the API
  const fetchRecommendations = useCallback(
    async (type = recommendationType) => {
      try {
        setLoading(true);
        setError(null);

        // Get diary entries for the specified number of days
        const diaries = getAllDiaries() || [];
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Filter diaries by date range
        const recentDiaries = diaries.filter(
          diary =>
            new Date(diary.date) >= startDate && new Date(diary.date) <= now,
        );

        // Prepare the request data
        const requestData = {
          recommendationType: type,
          diaryEntries: recentDiaries,
          healthData: healthData.data || [],
          days,
        };

        // Make the API call
        const response = await recommendationApi.postData(
          '/generate',
          requestData,
        );

        setRecommendations(response.recommendations || []);
        setLastFetched(new Date());
        return response.recommendations;
      } catch (err) {
        setError('Failed to fetch recommendations');
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      recommendationType,
      days,
      getAllDiaries,
      healthData.data,
      recommendationApi,
    ],
  );

  // Fetch recommendations for a specific diary entry
  const getRecommendationForDiary = useCallback(
    async (diaryId, type = recommendationType) => {
      try {
        setLoading(true);
        setError(null);

        // Get all diary entries
        const diaries = getAllDiaries() || [];

        // Find the specific diary entry
        const diary = diaries.find(d => String(d.id) === String(diaryId));

        if (!diary) {
          throw new Error(`Diary with id ${diaryId} not found`);
        }

        // Prepare the request data
        const requestData = {
          recommendationType: type,
          diaryEntries: [diary],
          healthData: healthData.data || [],
          days: 1,
        };

        // Make the API call
        const response = await recommendationApi.postData(
          '/generate-for-diary',
          requestData,
        );

        return response.recommendation;
      } catch (err) {
        setError('Failed to fetch recommendation for diary');
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [recommendationType, getAllDiaries, healthData.data, recommendationApi],
  );

  // Rate a recommendation
  const rateRecommendation = useCallback(
    async (recommendationId, rating) => {
      try {
        setLoading(true);
        setError(null);

        // Make the API call
        await recommendationApi.postData('/rate', {
          recommendationId,
          rating,
        });

        return true;
      } catch (err) {
        setError('Failed to rate recommendation');
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [recommendationApi],
  );

  // Fetch recommendations on mount if specified
  useEffect(() => {
    if (fetchOnMount) {
      fetchRecommendations();
    }
  }, [fetchOnMount, fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    lastFetched,
    fetchRecommendations,
    getRecommendationForDiary,
    rateRecommendation,
  };
};

export default useRecommendation;
