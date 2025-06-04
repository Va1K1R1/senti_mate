import React, { useState, useEffect } from "react";
import "./ActivityTracker.css";
import HealthDataChart from "./HealthDataChart";

const ActivityTracker = ({ data, onRefresh }) => {
    const [activityData, setActivityData] = useState(data || null);
    const [isLoading, setIsLoading] = useState(!data);
    const [selectedPeriod, setSelectedPeriod] = useState("week");
    const [selectedActivity, setSelectedActivity] = useState("all");
    
    useEffect(() => {
        if (data) {
            setActivityData(data);
            setIsLoading(false);
            return;
        }
        
        // Fetch data if not provided as prop
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mock data
                const mockData = {
                    today: {
                        calories: 320,
                        duration: 45,
                        type: "Running",
                        distance: 5.2,
                        steps: 6500,
                        heartRate: { avg: 142, max: 165, min: 125 }
                    },
                    week: [
                        { 
                            date: "2023-06-01", 
                            activities: [
                                { type: "Running", duration: 30, calories: 280, distance: 3.5 },
                                { type: "Yoga", duration: 20, calories: 120, distance: 0 }
                            ]
                        },
                        { 
                            date: "2023-06-02", 
                            activities: [
                                { type: "Cycling", duration: 40, calories: 350, distance: 12 }
                            ]
                        },
                        { 
                            date: "2023-06-03", 
                            activities: [
                                { type: "Running", duration: 50, calories: 420, distance: 6.2 }
                            ]
                        },
                        { 
                            date: "2023-06-04", 
                            activities: [
                                { type: "Running", duration: 45, calories: 320, distance: 5.2 }
                            ]
                        },
                        { 
                            date: "2023-06-05", 
                            activities: [] // Rest day
                        },
                        { 
                            date: "2023-06-06", 
                            activities: [
                                { type: "Swimming", duration: 60, calories: 380, distance: 1.5 }
                            ]
                        },
                        { 
                            date: "2023-06-07", 
                            activities: [
                                { type: "Running", duration: 45, calories: 320, distance: 5.2 }
                            ]
                        }
                    ],
                    month: [
                        // Simplified for brevity - would contain 30 days of data
                        { date: "2023-06-01", totalCalories: 400, totalDuration: 50 },
                        { date: "2023-06-08", totalCalories: 1200, totalDuration: 150 },
                        { date: "2023-06-15", totalCalories: 950, totalDuration: 120 },
                        { date: "2023-06-22", totalCalories: 1100, totalDuration: 140 },
                        { date: "2023-06-29", totalCalories: 800, totalDuration: 100 }
                    ],
                    activitySummary: {
                        running: { totalDuration: 215, totalCalories: 1760, totalDistance: 25.3, sessions: 5 },
                        cycling: { totalDuration: 40, totalCalories: 350, totalDistance: 12, sessions: 1 },
                        swimming: { totalDuration: 60, totalCalories: 380, totalDistance: 1.5, sessions: 1 },
                        yoga: { totalDuration: 20, totalCalories: 120, totalDistance: 0, sessions: 1 }
                    }
                };
                
                setActivityData(mockData);
            } catch (error) {
                console.error("Error fetching activity data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [data]);
    
    const handleRefresh = () => {
        setIsLoading(true);
        
        // Simulate refresh
        setTimeout(() => {
            setIsLoading(false);
            if (onRefresh) onRefresh();
        }, 1000);
    };
    
    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };
    
    const handleActivityChange = (activity) => {
        setSelectedActivity(activity);
    };
    
    // Prepare chart data based on selected period and activity
    const prepareChartData = () => {
        if (!activityData) return { data: [], labels: [] };
        
        if (selectedPeriod === "week") {
            const chartData = activityData.week.map(day => {
                if (selectedActivity === "all") {
                    return day.activities.reduce((total, activity) => total + activity.calories, 0);
                } else {
                    const filteredActivities = day.activities.filter(activity => 
                        activity.type.toLowerCase() === selectedActivity
                    );
                    return filteredActivities.reduce((total, activity) => total + activity.calories, 0);
                }
            });
            
            const labels = activityData.week.map((day, index) => {
                const date = new Date(day.date);
                return date.toLocaleDateString('en-US', { weekday: 'short' });
            });
            
            return { data: chartData, labels };
        } else if (selectedPeriod === "month") {
            return {
                data: activityData.month.map(day => day.totalCalories),
                labels: activityData.month.map(day => {
                    const date = new Date(day.date);
                    return date.toLocaleDateString('en-US', { day: 'numeric' });
                })
            };
        }
        
        return { data: [], labels: [] };
    };
    
    // Get activity summary
    const getActivitySummary = () => {
        if (!activityData || !activityData.activitySummary) return null;
        
        if (selectedActivity === "all") {
            const summary = Object.values(activityData.activitySummary).reduce(
                (total, activity) => {
                    return {
                        totalDuration: total.totalDuration + activity.totalDuration,
                        totalCalories: total.totalCalories + activity.totalCalories,
                        totalDistance: total.totalDistance + activity.totalDistance,
                        sessions: total.sessions + activity.sessions
                    };
                },
                { totalDuration: 0, totalCalories: 0, totalDistance: 0, sessions: 0 }
            );
            return summary;
        } else {
            return activityData.activitySummary[selectedActivity] || 
                { totalDuration: 0, totalCalories: 0, totalDistance: 0, sessions: 0 };
        }
    };
    
    if (isLoading) {
        return (
            <div className="ActivityTracker">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Loading activity data...</p>
                </div>
            </div>
        );
    }
    
    if (!activityData) {
        return (
            <div className="ActivityTracker">
                <div className="ErrorContainer">
                    <p>No activity data available.</p>
                    <button className="RefreshButton" onClick={handleRefresh}>
                        Refresh
                    </button>
                </div>
            </div>
        );
    }
    
    const chartData = prepareChartData();
    const activitySummary = getActivitySummary();
    
    return (
        <div className="ActivityTracker">
            <div className="ActivityHeader">
                <h2>Activity Tracker</h2>
                <button className="RefreshButton" onClick={handleRefresh}>
                    <span className="RefreshIcon">↻</span>
                </button>
            </div>
            
            <div className="ActivityFilters">
                <div className="PeriodSelector">
                    <button 
                        className={`PeriodButton ${selectedPeriod === 'week' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('week')}
                    >
                        Week
                    </button>
                    <button 
                        className={`PeriodButton ${selectedPeriod === 'month' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('month')}
                    >
                        Month
                    </button>
                </div>
                
                <div className="ActivitySelector">
                    <select 
                        value={selectedActivity}
                        onChange={(e) => handleActivityChange(e.target.value)}
                    >
                        <option value="all">All Activities</option>
                        {activityData.activitySummary && Object.keys(activityData.activitySummary).map(activity => (
                            <option key={activity} value={activity}>
                                {activity.charAt(0).toUpperCase() + activity.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="ActivitySummary">
                <div className="SummaryCard">
                    <div className="SummaryIcon">🔥</div>
                    <div className="SummaryContent">
                        <div className="SummaryValue">{activitySummary?.totalCalories || 0}</div>
                        <div className="SummaryLabel">Calories</div>
                    </div>
                </div>
                
                <div className="SummaryCard">
                    <div className="SummaryIcon">⏱️</div>
                    <div className="SummaryContent">
                        <div className="SummaryValue">{activitySummary?.totalDuration || 0}</div>
                        <div className="SummaryLabel">Minutes</div>
                    </div>
                </div>
                
                <div className="SummaryCard">
                    <div className="SummaryIcon">📏</div>
                    <div className="SummaryContent">
                        <div className="SummaryValue">{activitySummary?.totalDistance.toFixed(1) || 0}</div>
                        <div className="SummaryLabel">Kilometers</div>
                    </div>
                </div>
                
                <div className="SummaryCard">
                    <div className="SummaryIcon">🏋️</div>
                    <div className="SummaryContent">
                        <div className="SummaryValue">{activitySummary?.sessions || 0}</div>
                        <div className="SummaryLabel">Sessions</div>
                    </div>
                </div>
            </div>
            
            <div className="ActivityChartContainer">
                <HealthDataChart 
                    title={`Calories Burned (${selectedPeriod === 'week' ? 'Weekly' : 'Monthly'})`}
                    data={chartData.data}
                    labels={chartData.labels}
                    type="bar"
                    color="#FF9800"
                    height={250}
                />
            </div>
            
            <div className="RecentActivities">
                <h3>Recent Activities</h3>
                <div className="ActivityList">
                    {activityData.week.flatMap(day => 
                        day.activities.map((activity, index) => {
                            if (selectedActivity !== 'all' && activity.type.toLowerCase() !== selectedActivity) {
                                return null;
                            }
                            return (
                                <div key={`${day.date}-${index}`} className="ActivityItem">
                                    <div className="ActivityType">
                                        {getActivityIcon(activity.type)} {activity.type}
                                    </div>
                                    <div className="ActivityDetails">
                                        <span>{activity.duration} min</span>
                                        <span>{activity.calories} cal</span>
                                        {activity.distance > 0 && <span>{activity.distance} km</span>}
                                    </div>
                                    <div className="ActivityDate">
                                        {new Date(day.date).toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ).filter(Boolean)}
                </div>
            </div>
        </div>
    );
};

// Helper function to get activity icon
const getActivityIcon = (activityType) => {
    const type = activityType.toLowerCase();
    switch (type) {
        case 'running':
            return '🏃‍♂️';
        case 'walking':
            return '🚶‍♂️';
        case 'cycling':
            return '🚴‍♂️';
        case 'swimming':
            return '🏊‍♂️';
        case 'yoga':
            return '🧘‍♂️';
        case 'gym':
        case 'weight training':
            return '🏋️‍♂️';
        case 'hiking':
            return '🥾';
        case 'basketball':
            return '🏀';
        case 'football':
        case 'soccer':
            return '⚽';
        case 'tennis':
            return '🎾';
        default:
            return '🏋️‍♂️';
    }
};

export default ActivityTracker;