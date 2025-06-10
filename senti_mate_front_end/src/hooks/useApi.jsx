import { useState, useCallback, useEffect } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for making API calls
 * @param {string} url - API endpoint URL
 * @param {Object} options - API call options
 * @param {boolean} options.fetchOnMount - Whether to fetch data on component mount
 * @param {Object} options.initialData - Initial data before API call
 * @param {number} options.cacheTime - Cache time in milliseconds (0 to disable caching)
 * @returns {Object} API call state and methods
 */
const useApi = (url, options = {}) => {
  const { 
    fetchOnMount = false, 
    initialData = null,
    cacheTime = 0 
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  // Cache management
  const getCachedData = useCallback(() => {
    if (!cacheTime || !url) return null;
    
    try {
      const cacheKey = `api_cache_${url}`;
      const cachedItem = localStorage.getItem(cacheKey);
      
      if (cachedItem) {
        const { data: cachedData, timestamp: cachedTimestamp } = JSON.parse(cachedItem);
        const isExpired = Date.now() - cachedTimestamp > cacheTime;
        
        if (!isExpired) {
          return cachedData;
        }
      }
    } catch (err) {
      console.error('Cache retrieval error:', err);
    }
    
    return null;
  }, [url, cacheTime]);

  const setCachedData = useCallback((data) => {
    if (!cacheTime || !url) return;
    
    try {
      const cacheKey = `api_cache_${url}`;
      const cacheItem = JSON.stringify({
        data,
        timestamp: Date.now()
      });
      
      localStorage.setItem(cacheKey, cacheItem);
    } catch (err) {
      console.error('Cache storage error:', err);
    }
  }, [url, cacheTime]);

  /**
   * Fetch data from API
   * @param {Object} params - Request parameters
   * @param {Object} config - Axios request config
   * @returns {Promise} - Promise with API response data
   */
  const fetchData = useCallback(async (params = {}, config = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setTimestamp(Date.now());
        setLoading(false);
        return cachedData;
      }
      
      // Make API call
      const response = await apiService.get(url, { 
        params,
        ...config 
      });
      
      setData(response.data);
      setTimestamp(Date.now());
      
      // Cache the response
      if (cacheTime > 0) {
        setCachedData(response.data);
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, getCachedData, setCachedData]);

  /**
   * Post data to API
   * @param {Object} data - Request data
   * @param {Object} config - Axios request config
   * @returns {Promise} - Promise with API response data
   */
  const postData = useCallback(async (data = {}, config = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.post(url, data, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  /**
   * Put data to API
   * @param {Object} data - Request data
   * @param {Object} config - Axios request config
   * @returns {Promise} - Promise with API response data
   */
  const putData = useCallback(async (data = {}, config = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.put(url, data, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  /**
   * Delete data from API
   * @param {Object} config - Axios request config
   * @returns {Promise} - Promise with API response data
   */
  const deleteData = useCallback(async (config = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.delete(url, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Fetch data on mount if specified
  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchOnMount, fetchData]);

  return {
    data,
    loading,
    error,
    timestamp,
    fetchData,
    postData,
    putData,
    deleteData
  };
};

export default useApi;