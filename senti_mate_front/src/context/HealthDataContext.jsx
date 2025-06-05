import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const HealthDataContext = createContext();

// Custom hook to use the health data context
export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

/**
 * HealthDataProvider component for managing health data state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} HealthDataProvider component
 */
export const HealthDataProvider = ({ children }) => {
  // State for health data
  const [healthData, setHealthData] = useState({
    steps: [],
    heartRate: [],
    sleep: [],
    exercise: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  // Load health data from localStorage on initial render
  useEffect(() => {
    const loadHealthData = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const storedHealthData = localStorage.getItem('healthData');
        if (storedHealthData) {
          setHealthData(JSON.parse(storedHealthData));
          setConnected(true);
        } else {
          // Set default health data if none exist
          setHealthData({
            steps: [
              { date: '2025-05-01', count: 8432 },
              { date: '2025-05-02', count: 10253 },
              { date: '2025-05-03', count: 7654 },
              { date: '2025-05-04', count: 9123 },
              { date: '2025-05-05', count: 11542 }
            ],
            heartRate: [
              { date: '2025-05-01', average: 72, min: 58, max: 120 },
              { date: '2025-05-02', average: 75, min: 60, max: 125 },
              { date: '2025-05-03', average: 71, min: 57, max: 118 },
              { date: '2025-05-04', average: 73, min: 59, max: 122 },
              { date: '2025-05-05', average: 74, min: 60, max: 124 }
            ],
            sleep: [
              { date: '2025-05-01', duration: 7.5, quality: 'good' },
              { date: '2025-05-02', duration: 6.8, quality: 'fair' },
              { date: '2025-05-03', duration: 8.2, quality: 'excellent' },
              { date: '2025-05-04', duration: 7.0, quality: 'good' },
              { date: '2025-05-05', duration: 6.5, quality: 'fair' }
            ],
            exercise: [
              { date: '2025-05-01', type: 'running', duration: 30, calories: 320 },
              { date: '2025-05-02', type: 'cycling', duration: 45, calories: 400 },
              { date: '2025-05-03', type: 'rest', duration: 0, calories: 0 },
              { date: '2025-05-04', type: 'swimming', duration: 60, calories: 500 },
              { date: '2025-05-05', type: 'yoga', duration: 40, calories: 200 }
            ]
          });
        }
      } catch (error) {
        console.error('Error loading health data from localStorage:', error);
        setError('Failed to load health data');
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, []);

  // Save health data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('healthData', JSON.stringify(healthData));
    } catch (error) {
      console.error('Error saving health data to localStorage:', error);
    }
  }, [healthData]);

  // Connect to Samsung Health (mock implementation)
  const connectToSamsungHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to Samsung Health
      setConnected(true);
      
      // Return success
      return { success: true };
    } catch (error) {
      console.error('Error connecting to Samsung Health:', error);
      setError('Failed to connect to Samsung Health');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Disconnect from Samsung Health (mock implementation)
  const disconnectFromSamsungHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call to Samsung Health
      setConnected(false);
      
      // Return success
      return { success: true };
    } catch (error) {
      console.error('Error disconnecting from Samsung Health:', error);
      setError('Failed to disconnect from Samsung Health');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add manual health data entry
  const addHealthData = (type, data) => {
    setHealthData(prevData => ({
      ...prevData,
      [type]: [...prevData[type], data]
    }));
  };

  // Value object to be provided to consumers
  const value = {
    healthData,
    loading,
    error,
    connected,
    connectToSamsungHealth,
    disconnectFromSamsungHealth,
    addHealthData
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};

export default HealthDataContext;