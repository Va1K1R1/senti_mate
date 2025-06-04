import React, { useState, useEffect } from "react";
import "./HeartRateMonitor.css";
import HealthDataChart from "./HealthDataChart";

const HeartRateMonitor = ({ data, onRefresh }) => {
    const [heartRateData, setHeartRateData] = useState(data || null);
    const [isLoading, setIsLoading] = useState(!data);
    const [selectedPeriod, setSelectedPeriod] = useState("day");
    const [selectedView, setSelectedView] = useState("overview");
    
    useEffect(() => {
        if (data) {
            setHeartRateData(data);
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
                    current: {
                        value: 72,
                        timestamp: new Date().toISOString(),
                        status: "normal" // normal, high, low
                    },
                    resting: {
                        value: 62,
                        trend: -2 // down 2 BPM from previous average
                    },
                    today: {
                        min: 58,
                        max: 142,
                        avg: 72,
                        readings: [
                            { time: "00:00", value: 62 },
                            { time: "01:00", value: 60 },
                            { time: "02:00", value: 58 },
                            { time: "03:00", value: 59 },
                            { time: "04:00", value: 60 },
                            { time: "05:00", value: 62 },
                            { time: "06:00", value: 65 },
                            { time: "07:00", value: 70 },
                            { time: "08:00", value: 75 },
                            { time: "09:00", value: 80 },
                            { time: "10:00", value: 78 },
                            { time: "11:00", value: 76 },
                            { time: "12:00", value: 82 },
                            { time: "13:00", value: 85 },
                            { time: "14:00", value: 80 },
                            { time: "15:00", value: 78 },
                            { time: "16:00", value: 76 },
                            { time: "17:00", value: 78 },
                            { time: "18:00", value: 142 }, // Exercise spike
                            { time: "19:00", value: 90 },
                            { time: "20:00", value: 80 },
                            { time: "21:00", value: 75 },
                            { time: "22:00", value: 70 },
                            { time: "23:00", value: 65 }
                        ]
                    },
                    week: [
                        { date: "2023-06-01", min: 57, max: 128, avg: 72, restingHR: 63 },
                        { date: "2023-06-02", min: 58, max: 135, avg: 74, restingHR: 63 },
                        { date: "2023-06-03", min: 56, max: 142, avg: 75, restingHR: 62 },
                        { date: "2023-06-04", min: 58, max: 138, avg: 72, restingHR: 62 },
                        { date: "2023-06-05", min: 59, max: 132, avg: 73, restingHR: 62 },
                        { date: "2023-06-06", min: 57, max: 130, avg: 71, restingHR: 61 },
                        { date: "2023-06-07", min: 58, max: 142, avg: 72, restingHR: 62 }
                    ],
                    month: [
                        // Simplified for brevity - would contain 4 weeks of data
                        { week: 1, avgHR: 73, avgRestingHR: 63 },
                        { week: 2, avgHR: 72, avgRestingHR: 62 },
                        { week: 3, avgHR: 71, avgRestingHR: 61 },
                        { week: 4, avgHR: 72, avgRestingHR: 62 }
                    ],
                    zones: {
                        // Heart rate zones based on max HR (estimated as 220 - age)
                        // Assuming age 30, max HR = 190
                        rest: { min: 0, max: 95, time: 16.2 }, // 50% of max HR
                        fatBurn: { min: 95, max: 114, time: 5.8 }, // 50-60% of max HR
                        cardio: { min: 114, max: 133, time: 1.5 }, // 60-70% of max HR
                        peak: { min: 133, max: 190, time: 0.5 } // 70-100% of max HR
                    },
                    insights: [
                        {
                            type: "improvement",
                            message: "Your resting heart rate has improved by 2 BPM over the past month."
                        },
                        {
                            type: "anomaly",
                            message: "An unusually high heart rate was detected yesterday at 6:30 PM."
                        },
                        {
                            type: "tip",
                            message: "Try to get more cardio zone minutes to improve heart health."
                        }
                    ]
                };
                
                setHeartRateData(mockData);
            } catch (error) {
                console.error("Error fetching heart rate data:", error);
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
    
    const handleViewChange = (view) => {
        setSelectedView(view);
    };
    
    // Get heart rate status color
    const getHeartRateColor = (status) => {
        switch (status) {
            case "high":
                return "#F44336"; // Red
            case "low":
                return "#2196F3"; // Blue
            case "normal":
            default:
                return "#4CAF50"; // Green
        }
    };
    
    // Get heart rate zone color
    const getZoneColor = (zone) => {
        switch (zone) {
            case "rest":
                return "#8BC34A"; // Light Green
            case "fatBurn":
                return "#FFC107"; // Amber
            case "cardio":
                return "#FF9800"; // Orange
            case "peak":
                return "#F44336"; // Red
            default:
                return "#9E9E9E"; // Grey
        }
    };
    
    // Prepare chart data based on selected period
    const prepareChartData = () => {
        if (!heartRateData) return { data: [], labels: [] };
        
        if (selectedPeriod === "day") {
            return {
                data: heartRateData.today.readings.map(reading => reading.value),
                labels: heartRateData.today.readings.map(reading => reading.time)
            };
        } else if (selectedPeriod === "week") {
            return {
                data: heartRateData.week.map(day => day.avg),
                labels: heartRateData.week.map(day => {
                    const date = new Date(day.date);
                    return date.toLocaleDateString('en-US', { weekday: 'short' });
                })
            };
        } else if (selectedPeriod === "month") {
            return {
                data: heartRateData.month.map(week => week.avgHR),
                labels: heartRateData.month.map(week => `Week ${week.week}`)
            };
        }
        
        return { data: [], labels: [] };
    };
    
    // Prepare resting heart rate chart data
    const prepareRestingHRChartData = () => {
        if (!heartRateData) return { data: [], labels: [] };
        
        if (selectedPeriod === "week") {
            return {
                data: heartRateData.week.map(day => day.restingHR),
                labels: heartRateData.week.map(day => {
                    const date = new Date(day.date);
                    return date.toLocaleDateString('en-US', { weekday: 'short' });
                })
            };
        } else if (selectedPeriod === "month") {
            return {
                data: heartRateData.month.map(week => week.avgRestingHR),
                labels: heartRateData.month.map(week => `Week ${week.week}`)
            };
        }
        
        return { data: [], labels: [] };
    };
    
    // Calculate total time in zones
    const calculateTotalZoneTime = () => {
        if (!heartRateData || !heartRateData.zones) return 0;
        
        return Object.values(heartRateData.zones).reduce((total, zone) => total + zone.time, 0);
    };
    
    if (isLoading) {
        return (
            <div className="HeartRateMonitor">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Loading heart rate data...</p>
                </div>
            </div>
        );
    }
    
    if (!heartRateData) {
        return (
            <div className="HeartRateMonitor">
                <div className="ErrorContainer">
                    <p>No heart rate data available.</p>
                    <button className="RefreshButton" onClick={handleRefresh}>
                        Refresh
                    </button>
                </div>
            </div>
        );
    }
    
    const chartData = prepareChartData();
    const restingChartData = prepareRestingHRChartData();
    const totalZoneTime = calculateTotalZoneTime();
    
    return (
        <div className="HeartRateMonitor">
            <div className="HeartRateHeader">
                <h2>Heart Rate Monitor</h2>
                <button className="RefreshButton" onClick={handleRefresh}>
                    <span className="RefreshIcon">↻</span>
                </button>
            </div>
            
            <div className="CurrentHeartRate">
                <div className="HeartRateValue" style={{ color: getHeartRateColor(heartRateData.current.status) }}>
                    <span className="HeartIcon">❤️</span>
                    <span className="BPMValue">{heartRateData.current.value}</span>
                    <span className="BPMLabel">BPM</span>
                </div>
                <div className="HeartRateStatus">
                    Current Heart Rate: <span className="StatusText" style={{ color: getHeartRateColor(heartRateData.current.status) }}>
                        {heartRateData.current.status.charAt(0).toUpperCase() + heartRateData.current.status.slice(1)}
                    </span>
                </div>
                <div className="RestingHeartRate">
                    <div className="RestingValue">
                        <span className="RestingLabel">Resting HR:</span>
                        <span className="RestingBPM">{heartRateData.resting.value} BPM</span>
                    </div>
                    <div className="RestingTrend">
                        {heartRateData.resting.trend !== 0 && (
                            <span className={`TrendIcon ${heartRateData.resting.trend < 0 ? 'down' : 'up'}`}>
                                {heartRateData.resting.trend < 0 ? '↓' : '↑'}
                            </span>
                        )}
                        <span className="TrendValue">
                            {Math.abs(heartRateData.resting.trend)} BPM {heartRateData.resting.trend < 0 ? 'lower' : 'higher'} than last week
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="HeartRateViewSelector">
                <button 
                    className={`ViewButton ${selectedView === 'overview' ? 'active' : ''}`}
                    onClick={() => handleViewChange('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`ViewButton ${selectedView === 'zones' ? 'active' : ''}`}
                    onClick={() => handleViewChange('zones')}
                >
                    HR Zones
                </button>
                <button 
                    className={`ViewButton ${selectedView === 'insights' ? 'active' : ''}`}
                    onClick={() => handleViewChange('insights')}
                >
                    Insights
                </button>
            </div>
            
            {selectedView === 'overview' && (
                <div className="HeartRateOverview">
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
                    
                    <div className="HeartRateChartContainer">
                        <HealthDataChart 
                            title={`Average Heart Rate (${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})`}
                            data={chartData.data}
                            labels={chartData.labels}
                            type="line"
                            color="#EF5350"
                            height={250}
                        />
                    </div>
                    
                    {selectedPeriod !== 'day' && (
                        <div className="RestingHeartRateChartContainer">
                            <HealthDataChart 
                                title={`Resting Heart Rate (${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})`}
                                data={restingChartData.data}
                                labels={restingChartData.labels}
                                type="line"
                                color="#5C6BC0"
                                height={200}
                            />
                        </div>
                    )}
                    
                    <div className="HeartRateStats">
                        <div className="StatCard">
                            <div className="StatLabel">Min</div>
                            <div className="StatValue">
                                {selectedPeriod === 'day' ? heartRateData.today.min : 
                                 Math.min(...heartRateData.week.map(day => day.min))} BPM
                            </div>
                        </div>
                        <div className="StatCard">
                            <div className="StatLabel">Max</div>
                            <div className="StatValue">
                                {selectedPeriod === 'day' ? heartRateData.today.max : 
                                 Math.max(...heartRateData.week.map(day => day.max))} BPM
                            </div>
                        </div>
                        <div className="StatCard">
                            <div className="StatLabel">Avg</div>
                            <div className="StatValue">
                                {selectedPeriod === 'day' ? heartRateData.today.avg : 
                                 Math.round(heartRateData.week.reduce((sum, day) => sum + day.avg, 0) / heartRateData.week.length)} BPM
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {selectedView === 'zones' && (
                <div className="HeartRateZones">
                    <div className="ZonesDescription">
                        <p>Heart rate zones help you track the intensity of your workouts. Spending time in higher zones can improve cardiovascular fitness.</p>
                    </div>
                    
                    <div className="ZonesContainer">
                        {Object.entries(heartRateData.zones).map(([zone, data]) => {
                            const percentage = (data.time / totalZoneTime) * 100;
                            return (
                                <div key={zone} className="ZoneItem">
                                    <div className="ZoneHeader">
                                        <div className="ZoneName">
                                            {zone.charAt(0).toUpperCase() + zone.slice(1)}
                                        </div>
                                        <div className="ZoneRange">
                                            {data.min}-{data.max} BPM
                                        </div>
                                    </div>
                                    <div className="ZoneProgressContainer">
                                        <div 
                                            className="ZoneProgress" 
                                            style={{ 
                                                width: `${percentage}%`,
                                                backgroundColor: getZoneColor(zone)
                                            }}
                                        ></div>
                                    </div>
                                    <div className="ZoneTime">
                                        {data.time} hours
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="ZonesPieChart">
                        <div className="PieChartContainer">
                            <div className="PieChart">
                                {Object.entries(heartRateData.zones).map(([zone, data], index, array) => {
                                    const percentage = (data.time / totalZoneTime) * 100;
                                    let cumulativePercentage = 0;
                                    for (let i = 0; i < index; i++) {
                                        cumulativePercentage += (Object.values(heartRateData.zones)[i].time / totalZoneTime) * 100;
                                    }
                                    
                                    return (
                                        <div 
                                            key={zone}
                                            className="PieChartSegment"
                                            style={{
                                                backgroundColor: getZoneColor(zone),
                                                transform: `rotate(${cumulativePercentage * 3.6}deg)`,
                                                clipPath: percentage >= 50 ? 
                                                    'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 
                                                    `polygon(0 0, 50% 0, 50% 50%, ${50 + 50 * Math.sin(percentage * 0.036 * Math.PI)}% ${50 - 50 * Math.cos(percentage * 0.036 * Math.PI)}%, 50% 50%, 0 50%)`,
                                                zIndex: array.length - index
                                            }}
                                        ></div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="PieChartLegend">
                            {Object.entries(heartRateData.zones).map(([zone, data]) => (
                                <div key={zone} className="LegendItem">
                                    <div className="LegendColor" style={{ backgroundColor: getZoneColor(zone) }}></div>
                                    <div className="LegendLabel">{zone.charAt(0).toUpperCase() + zone.slice(1)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {selectedView === 'insights' && (
                <div className="HeartRateInsights">
                    <div className="InsightsDescription">
                        <p>Personalized insights based on your heart rate data.</p>
                    </div>
                    
                    <div className="InsightsList">
                        {heartRateData.insights.map((insight, index) => (
                            <div key={index} className={`InsightItem ${insight.type}`}>
                                <div className="InsightIcon">
                                    {insight.type === 'improvement' && '📈'}
                                    {insight.type === 'anomaly' && '⚠️'}
                                    {insight.type === 'tip' && '💡'}
                                </div>
                                <div className="InsightContent">
                                    <div className="InsightType">
                                        {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                                    </div>
                                    <div className="InsightMessage">
                                        {insight.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="HeartRateRecommendations">
                        <h3>Recommendations</h3>
                        <ul className="RecommendationsList">
                            <li className="RecommendationItem">
                                <div className="RecommendationIcon">🏃‍♂️</div>
                                <div className="RecommendationContent">
                                    <div className="RecommendationTitle">Cardio Exercise</div>
                                    <div className="RecommendationDescription">
                                        Aim for at least 150 minutes of moderate-intensity cardio exercise per week.
                                    </div>
                                </div>
                            </li>
                            <li className="RecommendationItem">
                                <div className="RecommendationIcon">🧘‍♂️</div>
                                <div className="RecommendationContent">
                                    <div className="RecommendationTitle">Stress Management</div>
                                    <div className="RecommendationDescription">
                                        Practice relaxation techniques to help lower your resting heart rate.
                                    </div>
                                </div>
                            </li>
                            <li className="RecommendationItem">
                                <div className="RecommendationIcon">⏰</div>
                                <div className="RecommendationContent">
                                    <div className="RecommendationTitle">Regular Monitoring</div>
                                    <div className="RecommendationDescription">
                                        Check your heart rate regularly to track changes and identify patterns.
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeartRateMonitor;