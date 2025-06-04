import React, { useState, useEffect } from "react";
import "./StepCounter.css";
import HealthDataChart from "./HealthDataChart";

const StepCounter = ({ data, onRefresh }) => {
    const [stepData, setStepData] = useState(data || null);
    const [isLoading, setIsLoading] = useState(!data);
    const [selectedPeriod, setSelectedPeriod] = useState("day");
    
    useEffect(() => {
        if (data) {
            setStepData(data);
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
                        steps: 8432,
                        goal: 10000,
                        distance: 6.5,
                        calories: 320,
                        activeMinutes: 45,
                        hourlySteps: [
                            { hour: "00:00", steps: 0 },
                            { hour: "01:00", steps: 0 },
                            { hour: "02:00", steps: 0 },
                            { hour: "03:00", steps: 0 },
                            { hour: "04:00", steps: 0 },
                            { hour: "05:00", steps: 0 },
                            { hour: "06:00", steps: 120 },
                            { hour: "07:00", steps: 850 },
                            { hour: "08:00", steps: 1200 },
                            { hour: "09:00", steps: 450 },
                            { hour: "10:00", steps: 320 },
                            { hour: "11:00", steps: 280 },
                            { hour: "12:00", steps: 750 },
                            { hour: "13:00", steps: 680 },
                            { hour: "14:00", steps: 420 },
                            { hour: "15:00", steps: 380 },
                            { hour: "16:00", steps: 520 },
                            { hour: "17:00", steps: 1100 },
                            { hour: "18:00", steps: 850 },
                            { hour: "19:00", steps: 320 },
                            { hour: "20:00", steps: 180 },
                            { hour: "21:00", steps: 120 },
                            { hour: "22:00", steps: 50 },
                            { hour: "23:00", steps: 0 }
                        ]
                    },
                    week: [
                        { date: "2023-06-01", steps: 7543, goal: 10000, distance: 5.8, calories: 290 },
                        { date: "2023-06-02", steps: 9821, goal: 10000, distance: 7.5, calories: 380 },
                        { date: "2023-06-03", steps: 12432, goal: 10000, distance: 9.6, calories: 480 },
                        { date: "2023-06-04", steps: 8432, goal: 10000, distance: 6.5, calories: 320 },
                        { date: "2023-06-05", steps: 5678, goal: 10000, distance: 4.4, calories: 220 },
                        { date: "2023-06-06", steps: 10234, goal: 10000, distance: 7.9, calories: 390 },
                        { date: "2023-06-07", steps: 8432, goal: 10000, distance: 6.5, calories: 320 }
                    ],
                    month: [
                        { week: 1, avgSteps: 8500, totalSteps: 59500 },
                        { week: 2, avgSteps: 9200, totalSteps: 64400 },
                        { week: 3, avgSteps: 7800, totalSteps: 54600 },
                        { week: 4, avgSteps: 8900, totalSteps: 62300 }
                    ],
                    achievements: [
                        { id: 1, title: "First 10K Steps", date: "2023-05-15", icon: "🏆" },
                        { id: 2, title: "7-Day Streak", date: "2023-05-22", icon: "🔥" },
                        { id: 3, title: "100K Steps in a Week", date: "2023-06-01", icon: "⭐" },
                        { id: 4, title: "Marathon Distance", date: "2023-06-05", icon: "🏃‍♂️" }
                    ],
                    insights: [
                        { type: "trend", message: "You're averaging 8,500 steps per day this month, which is 500 steps more than last month." },
                        { type: "goal", message: "You've reached your step goal 5 out of 7 days this week." },
                        { type: "activity", message: "Your most active day is Wednesday, and your least active is Sunday." }
                    ]
                };
                
                setStepData(mockData);
            } catch (error) {
                console.error("Error fetching step data:", error);
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
    
    // Prepare chart data based on selected period
    const prepareChartData = () => {
        if (!stepData) return { data: [], labels: [] };
        
        if (selectedPeriod === "day") {
            return {
                data: stepData.today.hourlySteps.map(hour => hour.steps),
                labels: stepData.today.hourlySteps.map(hour => hour.hour)
            };
        } else if (selectedPeriod === "week") {
            return {
                data: stepData.week.map(day => day.steps),
                labels: stepData.week.map(day => {
                    const date = new Date(day.date);
                    return date.toLocaleDateString('en-US', { weekday: 'short' });
                })
            };
        } else if (selectedPeriod === "month") {
            return {
                data: stepData.month.map(week => week.avgSteps),
                labels: stepData.month.map(week => `Week ${week.week}`)
            };
        }
        
        return { data: [], labels: [] };
    };
    
    // Calculate progress percentage
    const calculateProgress = () => {
        if (!stepData) return 0;
        
        const steps = stepData.today.steps;
        const goal = stepData.today.goal;
        return Math.min(100, Math.round((steps / goal) * 100));
    };
    
    // Format number with commas
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    if (isLoading) {
        return (
            <div className="StepCounter">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Loading step data...</p>
                </div>
            </div>
        );
    }
    
    if (!stepData) {
        return (
            <div className="StepCounter">
                <div className="ErrorContainer">
                    <p>No step data available.</p>
                    <button className="RefreshButton" onClick={handleRefresh}>
                        Refresh
                    </button>
                </div>
            </div>
        );
    }
    
    const chartData = prepareChartData();
    const progressPercentage = calculateProgress();
    
    return (
        <div className="StepCounter">
            <div className="StepHeader">
                <h2>Step Counter</h2>
                <button className="RefreshButton" onClick={handleRefresh}>
                    <span className="RefreshIcon">↻</span>
                </button>
            </div>
            
            <div className="StepProgress">
                <div className="StepCircle">
                    <div className="StepCount">
                        <span className="StepValue">{formatNumber(stepData.today.steps)}</span>
                        <span className="StepLabel">steps</span>
                    </div>
                    <svg className="ProgressRing" width="200" height="200" viewBox="0 0 200 200">
                        <circle
                            className="ProgressRingBackground"
                            cx="100"
                            cy="100"
                            r="80"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        <circle
                            className="ProgressRingForeground"
                            cx="100"
                            cy="100"
                            r="80"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 80}`}
                            strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercentage / 100)}`}
                            transform="rotate(-90, 100, 100)"
                        />
                    </svg>
                    <div className="GoalPercentage">{progressPercentage}%</div>
                </div>
                
                <div className="StepGoal">
                    <div className="GoalLabel">Daily Goal</div>
                    <div className="GoalValue">{formatNumber(stepData.today.goal)} steps</div>
                    <div className="GoalProgress">
                        <div className="GoalProgressBar">
                            <div 
                                className="GoalProgressFill" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="StepStats">
                <div className="StatCard">
                    <div className="StatIcon">📏</div>
                    <div className="StatContent">
                        <div className="StatValue">{stepData.today.distance} km</div>
                        <div className="StatLabel">Distance</div>
                    </div>
                </div>
                
                <div className="StatCard">
                    <div className="StatIcon">🔥</div>
                    <div className="StatContent">
                        <div className="StatValue">{stepData.today.calories}</div>
                        <div className="StatLabel">Calories</div>
                    </div>
                </div>
                
                <div className="StatCard">
                    <div className="StatIcon">⏱️</div>
                    <div className="StatContent">
                        <div className="StatValue">{stepData.today.activeMinutes}</div>
                        <div className="StatLabel">Active Minutes</div>
                    </div>
                </div>
            </div>
            
            <div className="StepChartSection">
                <div className="PeriodSelector">
                    <button 
                        className={`PeriodButton ${selectedPeriod === 'day' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('day')}
                    >
                        Day
                    </button>
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
                
                <div className="StepChartContainer">
                    <HealthDataChart 
                        title={`Step Count (${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})`}
                        data={chartData.data}
                        labels={chartData.labels}
                        type="bar"
                        color="#4CAF50"
                        height={250}
                    />
                </div>
            </div>
            
            {stepData.achievements && stepData.achievements.length > 0 && (
                <div className="StepAchievements">
                    <h3>Achievements</h3>
                    <div className="AchievementsList">
                        {stepData.achievements.map(achievement => (
                            <div key={achievement.id} className="AchievementItem">
                                <div className="AchievementIcon">{achievement.icon}</div>
                                <div className="AchievementContent">
                                    <div className="AchievementTitle">{achievement.title}</div>
                                    <div className="AchievementDate">
                                        {new Date(achievement.date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {stepData.insights && stepData.insights.length > 0 && (
                <div className="StepInsights">
                    <h3>Insights</h3>
                    <div className="InsightsList">
                        {stepData.insights.map((insight, index) => (
                            <div key={index} className={`InsightItem ${insight.type}`}>
                                <div className="InsightIcon">
                                    {insight.type === 'trend' && '📈'}
                                    {insight.type === 'goal' && '🎯'}
                                    {insight.type === 'activity' && '📊'}
                                </div>
                                <div className="InsightContent">
                                    <div className="InsightMessage">{insight.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="StepTips">
                <h3>Tips to Increase Your Steps</h3>
                <ul className="TipsList">
                    <li className="TipItem">
                        <div className="TipIcon">🚶‍♂️</div>
                        <div className="TipContent">
                            <div className="TipTitle">Take the Stairs</div>
                            <div className="TipDescription">Skip the elevator and take the stairs whenever possible.</div>
                        </div>
                    </li>
                    <li className="TipItem">
                        <div className="TipIcon">🅿️</div>
                        <div className="TipContent">
                            <div className="TipTitle">Park Further Away</div>
                            <div className="TipDescription">Park your car farther from entrances to add extra steps to your day.</div>
                        </div>
                    </li>
                    <li className="TipItem">
                        <div className="TipIcon">⏰</div>
                        <div className="TipContent">
                            <div className="TipTitle">Set Hourly Reminders</div>
                            <div className="TipDescription">Set a reminder to walk for 5 minutes every hour during your workday.</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default StepCounter;