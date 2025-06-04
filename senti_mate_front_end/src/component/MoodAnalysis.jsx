import React, { useState, useEffect } from "react";
import "./MoodAnalysis.css";

/**
 * MoodAnalysis component for emotion trend analysis
 * Displays charts and insights about the user's emotional trends over time
 * @returns {JSX.Element} The rendered MoodAnalysis component
 */
const MoodAnalysis = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moodData, setMoodData] = useState(null);
    const [timeRange, setTimeRange] = useState("month"); // "week", "month", "year"

    useEffect(() => {
        const fetchMoodData = async () => {
            try {
                setIsLoading(true);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mock data for demonstration
                const mockMoodData = {
                    summary: {
                        averageMood: 3.2, // 1-5 scale
                        dominantEmotion: "happy",
                        moodStability: 72, // percentage
                        moodImprovement: 8, // percentage
                    },
                    trends: {
                        week: generateMockTrendData(7),
                        month: generateMockTrendData(30),
                        year: generateMockTrendData(12, true)
                    },
                    insights: [
                        "Your mood tends to be highest on weekends",
                        "Morning entries show lower mood scores than evening entries",
                        "Your emotional stability has improved by 8% in the last month",
                        "Exercise appears to correlate with higher mood scores"
                    ],
                    emotionDistribution: [
                        { emotion: "Very Happy", count: 12, percentage: 15, color: "#27ae60" },
                        { emotion: "Happy", count: 28, percentage: 35, color: "#2ecc71" },
                        { emotion: "Neutral", count: 24, percentage: 30, color: "#f39c12" },
                        { emotion: "Sad", count: 12, percentage: 15, color: "#e67e22" },
                        { emotion: "Very Sad", count: 4, percentage: 5, color: "#e74c3c" }
                    ]
                };
                
                setMoodData(mockMoodData);
            } catch (err) {
                console.error("Error fetching mood data:", err);
                setError("Failed to load mood analysis. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchMoodData();
    }, []);

    // Helper function to generate mock trend data
    const generateMockTrendData = (count, isYearly = false) => {
        const data = [];
        const baseValue = 3;
        const now = new Date();
        
        for (let i = 0; i < count; i++) {
            const date = new Date();
            
            if (isYearly) {
                // For yearly data, go back by months
                date.setMonth(now.getMonth() - i);
                data.unshift({
                    label: date.toLocaleDateString('en-US', { month: 'short' }),
                    value: baseValue + Math.sin(i / 2) * 1.5 + Math.random() * 0.5,
                    entries: Math.floor(Math.random() * 20) + 10
                });
            } else {
                // For weekly/monthly data, go back by days
                date.setDate(now.getDate() - i);
                data.unshift({
                    label: isYearly ? date.toLocaleDateString('en-US', { month: 'short' }) : 
                           date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
                    value: baseValue + Math.sin(i / 2) * 1.5 + Math.random() * 0.5,
                    entries: Math.floor(Math.random() * 3) + 1
                });
            }
        }
        
        return data;
    };

    // Handle time range change
    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    // Get mood label from value
    const getMoodLabel = (value) => {
        if (value <= 1.5) return "Very Sad";
        if (value <= 2.5) return "Sad";
        if (value <= 3.5) return "Neutral";
        if (value <= 4.5) return "Happy";
        return "Very Happy";
    };

    // Get color for mood value
    const getMoodColor = (value) => {
        if (value <= 1.5) return "#e74c3c"; // Very Sad - Red
        if (value <= 2.5) return "#e67e22"; // Sad - Orange
        if (value <= 3.5) return "#f39c12"; // Neutral - Yellow
        if (value <= 4.5) return "#2ecc71"; // Happy - Light Green
        return "#27ae60"; // Very Happy - Green
    };

    if (isLoading) {
        return (
            <div className="MoodAnalysis">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Analyzing your emotional patterns...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="MoodAnalysis">
                <div className="ErrorContainer">
                    <div className="ErrorIcon">!</div>
                    <h3>Error Loading Mood Analysis</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!moodData) {
        return (
            <div className="MoodAnalysis">
                <div className="EmptyState">
                    <h3>No Mood Data Available</h3>
                    <p>Start recording your emotions in diary entries to see mood analysis.</p>
                </div>
            </div>
        );
    }

    const currentTrendData = moodData.trends[timeRange];

    return (
        <div className="MoodAnalysis">
            <div className="MoodAnalysisHeader">
                <h2>Mood Analysis</h2>
                <p>Insights based on your emotional patterns</p>
            </div>
            
            <div className="MoodSummary">
                <div className="MoodSummaryCard">
                    <div className="MoodAverage">
                        <div 
                            className="MoodAverageValue" 
                            style={{ color: getMoodColor(moodData.summary.averageMood) }}
                        >
                            {moodData.summary.averageMood.toFixed(1)}
                        </div>
                        <div className="MoodAverageLabel">Average Mood</div>
                        <div className="MoodAverageText">{getMoodLabel(moodData.summary.averageMood)}</div>
                    </div>
                </div>
                
                <div className="MoodSummaryCard">
                    <div className="MoodStability">
                        <div className="StabilityChart">
                            <svg viewBox="0 0 100 100" width="80" height="80">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#e0e0e0"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#8eb695"
                                    strokeWidth="10"
                                    strokeDasharray={`${2 * Math.PI * 45 * moodData.summary.moodStability / 100} ${2 * Math.PI * 45 * (1 - moodData.summary.moodStability / 100)}`}
                                    strokeDashoffset={2 * Math.PI * 45 * 0.25}
                                />
                                <text
                                    x="50"
                                    y="55"
                                    textAnchor="middle"
                                    fontSize="20"
                                    fontWeight="bold"
                                    fill="#333"
                                >
                                    {moodData.summary.moodStability}%
                                </text>
                            </svg>
                        </div>
                        <div className="StabilityLabel">Emotional Stability</div>
                    </div>
                </div>
                
                <div className="MoodSummaryCard">
                    <div className="MoodImprovement">
                        <div className="ImprovementValue">
                            <span className="ImprovementArrow">
                                {moodData.summary.moodImprovement > 0 ? "↑" : "↓"}
                            </span>
                            {Math.abs(moodData.summary.moodImprovement)}%
                        </div>
                        <div className="ImprovementLabel">
                            {moodData.summary.moodImprovement >= 0 ? "Improvement" : "Decline"}
                        </div>
                        <div className="ImprovementPeriod">Last 30 days</div>
                    </div>
                </div>
            </div>
            
            <div className="MoodTrends">
                <div className="TrendsHeader">
                    <h3>Mood Trends</h3>
                    <div className="TimeRangeSelector">
                        <button 
                            className={`TimeRangeButton ${timeRange === 'week' ? 'active' : ''}`}
                            onClick={() => handleTimeRangeChange('week')}
                        >
                            Week
                        </button>
                        <button 
                            className={`TimeRangeButton ${timeRange === 'month' ? 'active' : ''}`}
                            onClick={() => handleTimeRangeChange('month')}
                        >
                            Month
                        </button>
                        <button 
                            className={`TimeRangeButton ${timeRange === 'year' ? 'active' : ''}`}
                            onClick={() => handleTimeRangeChange('year')}
                        >
                            Year
                        </button>
                    </div>
                </div>
                
                <div className="TrendsChart">
                    <div className="ChartYAxis">
                        <div className="YAxisLabel">Very Happy</div>
                        <div className="YAxisLabel">Happy</div>
                        <div className="YAxisLabel">Neutral</div>
                        <div className="YAxisLabel">Sad</div>
                        <div className="YAxisLabel">Very Sad</div>
                    </div>
                    
                    <div className="ChartBars">
                        {currentTrendData.map((item, index) => (
                            <div key={index} className="ChartBarContainer">
                                <div 
                                    className="ChartBar" 
                                    style={{ 
                                        height: `${(item.value / 5) * 100}%`,
                                        backgroundColor: getMoodColor(item.value)
                                    }}
                                    title={`${getMoodLabel(item.value)} (${item.value.toFixed(1)}) - ${item.entries} entries`}
                                >
                                    <div className="EntryCount">{item.entries}</div>
                                </div>
                                <div className="BarLabel">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="MoodInsights">
                <h3>Insights</h3>
                <ul className="InsightsList">
                    {moodData.insights.map((insight, index) => (
                        <li key={index} className="InsightItem">
                            <span className="InsightIcon">💡</span>
                            <span className="InsightText">{insight}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="EmotionDistribution">
                <h3>Emotion Distribution</h3>
                <div className="DistributionChart">
                    {moodData.emotionDistribution.map((item, index) => (
                        <div key={index} className="DistributionItem">
                            <div className="DistributionBar">
                                <div 
                                    className="DistributionFill" 
                                    style={{ 
                                        width: `${item.percentage}%`,
                                        backgroundColor: item.color
                                    }}
                                ></div>
                            </div>
                            <div className="DistributionLabel">
                                <span className="EmotionName">{item.emotion}</span>
                                <span className="EmotionPercentage">{item.percentage}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MoodAnalysis;