import React, { useState, useEffect } from "react";
import "./HealthDataDashboard.css";
import HealthDataCard from "./HealthDataCard";

const HealthDataDashboard = ({ healthData }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    
    useEffect(() => {
        // If healthData is provided as a prop, use it
        if (healthData) {
            setData(healthData);
            setIsLoading(false);
            return;
        }
        
        // Otherwise, simulate fetching data from an API
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Mock data for demonstration
                const mockData = {
                    steps: {
                        today: 8432,
                        goal: 10000,
                        weekly: [6543, 7821, 9432, 8432, 5678, 10234, 8432],
                        weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    },
                    sleep: {
                        lastNight: {
                            total: 7.5,
                            deep: 2.3,
                            light: 4.2,
                            rem: 1.0
                        },
                        weekly: [6.5, 7.2, 8.0, 7.5, 6.8, 7.9, 7.5],
                        weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    },
                    heartRate: {
                        current: 72,
                        min: 58,
                        max: 142,
                        resting: 62,
                        weekly: [
                            { min: 57, max: 128, avg: 72 },
                            { min: 58, max: 135, avg: 74 },
                            { min: 56, max: 142, avg: 75 },
                            { min: 58, max: 138, avg: 72 },
                            { min: 59, max: 132, avg: 73 },
                            { min: 57, max: 130, avg: 71 },
                            { min: 58, max: 142, avg: 72 }
                        ],
                        weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    },
                    exercise: {
                        today: {
                            calories: 320,
                            duration: 45,
                            type: "Running"
                        },
                        weekly: [
                            { calories: 280, duration: 30, type: "Walking" },
                            { calories: 350, duration: 40, type: "Cycling" },
                            { calories: 420, duration: 50, type: "Running" },
                            { calories: 320, duration: 45, type: "Running" },
                            { calories: 0, duration: 0, type: "Rest" },
                            { calories: 380, duration: 60, type: "Swimming" },
                            { calories: 320, duration: 45, type: "Running" }
                        ],
                        weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    }
                };
                
                setData(mockData);
            } catch (err) {
                console.error("Error fetching health data:", err);
                setError("Failed to load health data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [healthData]);
    
    if (isLoading) {
        return (
            <div className="HealthDataDashboard">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Loading health data...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="HealthDataDashboard">
                <div className="ErrorContainer">
                    <div className="ErrorIcon">!</div>
                    <h3>Error Loading Data</h3>
                    <p>{error}</p>
                    <button 
                        className="RetryButton"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="HealthDataDashboard">
            <div className="HealthDataGrid">
                <HealthDataCard 
                    title="Steps" 
                    icon="👣"
                    data={data.steps}
                    type="steps"
                    primaryStat={`${data.steps.today.toLocaleString()}`}
                    secondaryStat={`${Math.round(data.steps.today / data.steps.goal * 100)}% of daily goal`}
                    chartData={data.steps.weekly}
                    chartLabels={data.steps.weeklyLabels}
                />
                
                <HealthDataCard 
                    title="Sleep" 
                    icon="😴"
                    data={data.sleep}
                    type="sleep"
                    primaryStat={`${data.sleep.lastNight.total} hours`}
                    secondaryStat={`Deep: ${data.sleep.lastNight.deep}h, Light: ${data.sleep.lastNight.light}h, REM: ${data.sleep.lastNight.rem}h`}
                    chartData={data.sleep.weekly}
                    chartLabels={data.sleep.weeklyLabels}
                />
                
                <HealthDataCard 
                    title="Heart Rate" 
                    icon="❤️"
                    data={data.heartRate}
                    type="heartRate"
                    primaryStat={`${data.heartRate.current} BPM`}
                    secondaryStat={`Resting: ${data.heartRate.resting} BPM`}
                    chartData={data.heartRate.weekly.map(day => day.avg)}
                    chartLabels={data.heartRate.weeklyLabels}
                />
                
                <HealthDataCard 
                    title="Exercise" 
                    icon="🏃‍♂️"
                    data={data.exercise}
                    type="exercise"
                    primaryStat={data.exercise.today.type}
                    secondaryStat={`${data.exercise.today.duration} min, ${data.exercise.today.calories} cal`}
                    chartData={data.exercise.weekly.map(day => day.calories)}
                    chartLabels={data.exercise.weeklyLabels}
                />
            </div>
            
            <div className="HealthDataFooter">
                <p>Data synchronized with Samsung Health</p>
                <button className="SyncButton">
                    Sync Now
                </button>
            </div>
        </div>
    );
};

export default HealthDataDashboard;