import React, { useState, useEffect, useCallback } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import HealthDataDashboard from "../component/HealthDataDashboard";
import "../component/HealthDataDashboard.css";
import useHealthData from "../hooks/useHealthData";
import "./HealthData.css";

/**
 * HealthData page component
 * Displays health data from Samsung Health integration
 */
const HealthDataPage = () => {
  // Use the useHealthData hook to integrate with Samsung Health
  const {
    data,
    loading,
    error,
    lastSynced,
    isAuthenticated,
    authenticate,
    fetchHealthData,
    disconnect
  } = useHealthData({ fetchOnMount: true });

  // State to store combined health data
  const [healthData, setHealthData] = useState(null);

  // Function to format the last synced time
  const formatLastSynced = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  // Function to handle sync button click
  const handleSync = useCallback(async () => {
    if (!isAuthenticated) {
      authenticate();
    } else {
      try {
        await fetchHealthData();
      } catch (err) {
        console.error("Error syncing health data:", err);
      }
    }
  }, [isAuthenticated, authenticate, fetchHealthData]);

  // Process and combine health data when it changes
  useEffect(() => {
    if (data && data.length > 0) {
      // Process and format the data for the dashboard
      const processedData = {
        steps: {
          today: data.find(item => item.type === 'steps')?.value || 0,
          goal: 10000,
          weekly: data.filter(item => item.type === 'steps').map(item => item.value).slice(-7),
          weeklyLabels: data.filter(item => item.type === 'steps').map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
          }).slice(-7)
        },
        sleep: {
          lastNight: {
            total: data.find(item => item.type === 'sleep')?.value || 0,
            deep: data.find(item => item.type === 'sleep')?.details?.deep || 0,
            light: data.find(item => item.type === 'sleep')?.details?.light || 0,
            rem: data.find(item => item.type === 'sleep')?.details?.rem || 0
          },
          weekly: data.filter(item => item.type === 'sleep').map(item => item.value).slice(-7),
          weeklyLabels: data.filter(item => item.type === 'sleep').map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
          }).slice(-7)
        },
        heartRate: {
          current: data.find(item => item.type === 'heartRate')?.value || 0,
          min: data.find(item => item.type === 'heartRate')?.details?.min || 0,
          max: data.find(item => item.type === 'heartRate')?.details?.max || 0,
          resting: data.find(item => item.type === 'heartRate')?.details?.resting || 0,
          weekly: data.filter(item => item.type === 'heartRate').map(item => ({
            min: item.details?.min || 0,
            max: item.details?.max || 0,
            avg: item.value
          })).slice(-7),
          weeklyLabels: data.filter(item => item.type === 'heartRate').map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
          }).slice(-7)
        },
        exercise: {
          today: {
            calories: data.find(item => item.type === 'exercise')?.details?.calories || 0,
            duration: data.find(item => item.type === 'exercise')?.details?.duration || 0,
            type: data.find(item => item.type === 'exercise')?.details?.type || 'None'
          },
          weekly: data.filter(item => item.type === 'exercise').map(item => ({
            calories: item.details?.calories || 0,
            duration: item.details?.duration || 0,
            type: item.details?.type || 'None'
          })).slice(-7),
          weeklyLabels: data.filter(item => item.type === 'exercise').map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
          }).slice(-7)
        }
      };

      setHealthData(processedData);
    }
  }, [data]);

  return (
    <div className="health-data-page">
      <Header />
      <div className="health-data-container">
        <div className="health-data-header">
          <div>
            <h1>Your Health Data</h1>
            <p className="health-data-subtitle">Track your health metrics and progress</p>
            {lastSynced && (
              <p className="health-data-sync-info">
                Last synced: {formatLastSynced(lastSynced)}
              </p>
            )}
          </div>
          <div className="health-data-actions">
            <button 
              className="sync-button" 
              onClick={handleSync}
              disabled={loading}
            >
              {loading ? "Syncing..." : isAuthenticated ? "Sync Now" : "Connect Samsung Health"}
            </button>
            {isAuthenticated && (
              <button 
                className="disconnect-button" 
                onClick={disconnect}
                disabled={loading}
              >
                Disconnect
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="health-data-error">
            <p>{error}</p>
            <button onClick={handleSync}>Try Again</button>
          </div>
        )}

        {!isAuthenticated && !loading && !error ? (
          <div className="health-data-connect">
            <div className="connect-icon">🔄</div>
            <h2>Connect to Samsung Health</h2>
            <p>Connect your Samsung Health account to view your health data</p>
            <button onClick={authenticate}>Connect Now</button>
          </div>
        ) : (
          <HealthDataDashboard healthData={healthData} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HealthDataPage;
