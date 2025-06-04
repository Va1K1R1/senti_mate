import React, { useState, useEffect } from "react";
import "./WellnessScore.css";

/**
 * WellnessScore component for displaying overall health score
 * Calculates and displays a comprehensive wellness score based on various health metrics
 * @returns {JSX.Element} The rendered WellnessScore component
 */
const WellnessScore = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scoreData, setScoreData] = useState(null);

    useEffect(() => {
        const fetchWellnessData = async () => {
            try {
                setIsLoading(true);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mock data for demonstration
                const mockScoreData = {
                    overallScore: 78, // 0-100 scale
                    previousScore: 72,
                    scoreChange: 6,
                    lastUpdated: new Date(),
                    categories: [
                        { 
                            name: "Emotional Health", 
                            score: 82, 
                            previousScore: 75,
                            color: "#8eb695", // App green
                            icon: "😊",
                            metrics: [
                                { name: "Mood Stability", score: 85, weight: 0.4 },
                                { name: "Stress Level", score: 78, weight: 0.4 },
                                { name: "Sleep Quality", score: 82, weight: 0.2 }
                            ]
                        },
                        { 
                            name: "Physical Activity", 
                            score: 68, 
                            previousScore: 65,
                            color: "#FF9800", // Orange
                            icon: "🏃‍♂️",
                            metrics: [
                                { name: "Daily Steps", score: 72, weight: 0.5 },
                                { name: "Exercise Frequency", score: 65, weight: 0.3 },
                                { name: "Activity Variety", score: 60, weight: 0.2 }
                            ]
                        },
                        { 
                            name: "Sleep", 
                            score: 75, 
                            previousScore: 70,
                            color: "#5C6BC0", // Indigo
                            icon: "😴",
                            metrics: [
                                { name: "Sleep Duration", score: 80, weight: 0.4 },
                                { name: "Sleep Consistency", score: 70, weight: 0.4 },
                                { name: "Sleep Quality", score: 75, weight: 0.2 }
                            ]
                        },
                        { 
                            name: "Nutrition", 
                            score: 85, 
                            previousScore: 80,
                            color: "#4CAF50", // Green
                            icon: "🍎",
                            metrics: [
                                { name: "Meal Regularity", score: 90, weight: 0.3 },
                                { name: "Diet Variety", score: 85, weight: 0.4 },
                                { name: "Hydration", score: 80, weight: 0.3 }
                            ]
                        },
                        { 
                            name: "Mindfulness", 
                            score: 80, 
                            previousScore: 70,
                            color: "#9C27B0", // Purple
                            icon: "🧘",
                            metrics: [
                                { name: "Meditation Practice", score: 85, weight: 0.4 },
                                { name: "Stress Management", score: 75, weight: 0.4 },
                                { name: "Digital Wellbeing", score: 80, weight: 0.2 }
                            ]
                        }
                    ],
                    recommendations: [
                        "Try to increase your daily step count to improve your Physical Activity score",
                        "Your sleep consistency has improved - keep maintaining a regular sleep schedule",
                        "Consider adding more variety to your exercise routine"
                    ]
                };
                
                setScoreData(mockScoreData);
            } catch (err) {
                console.error("Error fetching wellness score data:", err);
                setError("Failed to load wellness score. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchWellnessData();
    }, []);

    // Get score color based on value
    const getScoreColor = (score) => {
        if (score < 40) return "#e74c3c"; // Red
        if (score < 60) return "#e67e22"; // Orange
        if (score < 75) return "#f39c12"; // Yellow
        if (score < 90) return "#2ecc71"; // Light Green
        return "#27ae60"; // Green
    };

    // Get score label based on value
    const getScoreLabel = (score) => {
        if (score < 40) return "Needs Attention";
        if (score < 60) return "Fair";
        if (score < 75) return "Good";
        if (score < 90) return "Very Good";
        return "Excellent";
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="WellnessScore">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Calculating your wellness score...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="WellnessScore">
                <div className="ErrorContainer">
                    <div className="ErrorIcon">!</div>
                    <h3>Error Loading Wellness Score</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!scoreData) {
        return (
            <div className="WellnessScore">
                <div className="EmptyState">
                    <h3>No Wellness Data Available</h3>
                    <p>Connect your health data sources to see your wellness score.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="WellnessScore">
            <div className="WellnessScoreHeader">
                <h2>Wellness Score</h2>
                <p>Your comprehensive health assessment</p>
                <p className="LastUpdated">Last updated: {formatDate(scoreData.lastUpdated)}</p>
            </div>
            
            <div className="OverallScoreContainer">
                <div className="ScoreCircle">
                    <svg viewBox="0 0 100 100" width="160" height="160">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e0e0e0"
                            strokeWidth="10"
                        />
                        {/* Score circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={getScoreColor(scoreData.overallScore)}
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 45 * scoreData.overallScore / 100} ${2 * Math.PI * 45 * (1 - scoreData.overallScore / 100)}`}
                            strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        />
                        {/* Score text */}
                        <text
                            x="50"
                            y="45"
                            textAnchor="middle"
                            fontSize="24"
                            fontWeight="bold"
                            fill="#333"
                        >
                            {scoreData.overallScore}
                        </text>
                        <text
                            x="50"
                            y="65"
                            textAnchor="middle"
                            fontSize="12"
                            fill="#666"
                        >
                            {getScoreLabel(scoreData.overallScore)}
                        </text>
                    </svg>
                </div>
                
                <div className="ScoreChange">
                    <div className="ChangeValue">
                        <span className="ChangeArrow">
                            {scoreData.scoreChange > 0 ? "↑" : scoreData.scoreChange < 0 ? "↓" : "→"}
                        </span>
                        {Math.abs(scoreData.scoreChange)} points
                    </div>
                    <div className="ChangePeriod">since last month</div>
                </div>
            </div>
            
            <div className="CategoryScores">
                <h3>Health Categories</h3>
                
                {scoreData.categories.map((category, index) => (
                    <div key={index} className="CategoryCard">
                        <div className="CategoryHeader">
                            <div className="CategoryIcon" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                                {category.icon}
                            </div>
                            <div className="CategoryInfo">
                                <div className="CategoryName">{category.name}</div>
                                <div className="CategoryScoreValue">
                                    <span className="Score">{category.score}</span>
                                    <span className="ScoreChange">
                                        {category.score > category.previousScore ? "↑" : 
                                         category.score < category.previousScore ? "↓" : "→"}
                                        {Math.abs(category.score - category.previousScore)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="CategoryProgressBar">
                            <div 
                                className="ProgressFill" 
                                style={{ 
                                    width: `${category.score}%`,
                                    backgroundColor: category.color
                                }}
                            ></div>
                        </div>
                        
                        <div className="CategoryMetrics">
                            {category.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="MetricItem">
                                    <div className="MetricName">{metric.name}</div>
                                    <div className="MetricScore">{metric.score}</div>
                                    <div className="MetricProgressBar">
                                        <div 
                                            className="MetricProgressFill" 
                                            style={{ 
                                                width: `${metric.score}%`,
                                                backgroundColor: category.color
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="ScoreRecommendations">
                <h3>Recommendations to Improve Your Score</h3>
                <ul className="RecommendationsList">
                    {scoreData.recommendations.map((recommendation, index) => (
                        <li key={index} className="RecommendationItem">
                            <span className="RecommendationIcon">💡</span>
                            <span className="RecommendationText">{recommendation}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WellnessScore;