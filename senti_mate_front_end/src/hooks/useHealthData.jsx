import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook for Samsung Health integration
 * @param {Object} options - Options for the hook
 * @param {boolean} options.fetchOnMount - Whether to fetch data on component mount
 * @param {string} options.dataType - Type of health data to fetch (steps, heartRate, sleep, exercise)
 * @param {number} options.days - Number of days of data to fetch
 * @returns {Object} Health data and methods
 */
const useHealthData = (options = {}) => {
  const { fetchOnMount = false, dataType = 'steps', days = 7 } = options;

  // Use the useApi hook for making API calls
  const healthApi = useApi(`/api/health/${dataType}`);

  // Store authentication state in local storage
  const [authState, setAuthState] = useLocalStorage('samsung_health_auth', {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  });

  // State for health data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  // Check if the access token is expired
  const isTokenExpired = useCallback(() => {
    if (!authState.expiresAt) return true;
    return new Date().getTime() > authState.expiresAt;
  }, [authState.expiresAt]);

  // Refresh the access token
  const refreshToken = useCallback(async () => {
    if (!authState.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      setLoading(true);
      const response = await healthApi.postData('/api/health/refresh-token', {
        refreshToken: authState.refreshToken,
      });

      setAuthState({
        ...authState,
        accessToken: response.accessToken,
        expiresAt: new Date().getTime() + response.expiresIn * 1000,
      });

      return response.accessToken;
    } catch (err) {
      setError('Failed to refresh token');
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authState, healthApi, setAuthState]);

  // Authenticate with Samsung Health
  const authenticate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Redirect to Samsung Health OAuth page
      window.location.href = '/api/health/auth';

      // The rest of the authentication flow will be handled by the redirect callback
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle the OAuth callback
  const handleAuthCallback = useCallback(
    async code => {
      try {
        setLoading(true);
        setError(null);

        const response = await healthApi.postData('/api/health/token', {
          code,
        });

        setAuthState({
          isAuthenticated: true,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresAt: new Date().getTime() + response.expiresIn * 1000,
        });

        return true;
      } catch (err) {
        setError('Failed to complete authentication');
        console.error(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [healthApi, setAuthState],
  );

  // Fetch health data
  const fetchHealthData = useCallback(
    async (requestedDataType = dataType, numDays = days) => {
      try {
        setLoading(true);
        setError(null);

        // Check if token is expired and refresh if needed
        let token = authState.accessToken;
        if (isTokenExpired()) {
          token = await refreshToken();
        }

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - numDays);

        // Format dates as ISO strings
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Make API call
        const response = await healthApi.fetchData(
          {
            startDate: startDateStr,
            endDate: endDateStr,
            dataType: requestedDataType,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setData(response.data || []);
        setLastSynced(new Date());
        return response.data;
      } catch (err) {
        setError('Failed to fetch health data');
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      authState.accessToken,
      dataType,
      days,
      healthApi,
      isTokenExpired,
      refreshToken,
    ],
  );

  // Disconnect from Samsung Health
  const disconnect = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    });
    setData([]);
    setLastSynced(null);
  }, [setAuthState]);

  // Fetch data on mount if specified
  useEffect(() => {
    if (fetchOnMount && authState.isAuthenticated) {
      fetchHealthData();
    }
  }, [fetchOnMount, authState.isAuthenticated, fetchHealthData]);

  return {
    data,
    loading,
    error,
    lastSynced,
    isAuthenticated: authState.isAuthenticated,
    authenticate,
    handleAuthCallback,
    fetchHealthData,
    disconnect,
  };
};

export default useHealthData;
