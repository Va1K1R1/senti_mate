import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RecommendationDetail.css";
import Button from "./Button";

/**
 * RecommendationDetail component for displaying detailed information about a recommendation
 * @returns {JSX.Element} The rendered RecommendationDetail component
 */
const RecommendationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recommendation, setRecommendation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                setIsLoading(true);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Mock data for demonstration
                const mockRecommendation = {
                    id: parseInt(id),
                    type: "exercise",
                    title: "Try a Morning Walk",
                    description: "Based on your sleep patterns and step count, a 20-minute morning walk could improve your energy levels throughout the day.",
                    detailedContent: `
# Morning Walk Recommendation

Based on the analysis of your recent health data and diary entries, we've noticed patterns that suggest a morning walk could be beneficial for your overall wellbeing.

## Why This Matters

Your sleep data shows you typically wake up between 6:30-7:00 AM, but your step count doesn't increase significantly until after 9:00 AM. Research suggests that morning light exposure can:

- Regulate your circadian rhythm
- Boost mood and energy levels
- Improve focus and productivity throughout the day

## Suggested Implementation

- **Duration**: Start with just 20 minutes
- **Timing**: Within 30 minutes of waking up
- **Intensity**: Moderate pace, no need for high intensity
- **Consistency**: Aim for at least 4 days per week

## Expected Benefits

Based on your data patterns, you may experience:
- Improved mood (your diary entries show lower mood scores in the morning)
- Better energy levels throughout the day
- Gradual improvement in sleep quality

## Progress Tracking

We'll monitor changes in your:
- Step count patterns
- Mood scores in morning diary entries
- Sleep quality metrics

Would you like to set a reminder for your morning walks?
                    `,
                    source: "health_data",
                    date: new Date(),
                    relatedMetrics: [
                        { name: "Average Steps", value: "5,243", target: "7,500", progress: 70 },
                        { name: "Sleep Quality", value: "72%", target: "85%", progress: 85 },
                        { name: "Morning Mood", value: "6.2/10", target: "7.5/10", progress: 83 }
                    ],
                    isCompleted: false,
                    isSaved: true
                };
                
                setRecommendation(mockRecommendation);
                setIsCompleted(mockRecommendation.isCompleted);
                setIsSaved(mockRecommendation.isSaved);
            } catch (err) {
                console.error("Error fetching recommendation:", err);
                setError("Failed to load recommendation details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRecommendation();
    }, [id]);
    
    // Get icon based on recommendation type
    const getTypeIcon = (type) => {
        switch (type) {
            case "exercise":
                return "🏃‍♂️";
            case "sleep":
                return "😴";
            case "mood":
                return "😊";
            case "nutrition":
                return "🍎";
            case "mindfulness":
                return "🧘";
            default:
                return "💡";
        }
    };
    
    // Get color based on recommendation type
    const getTypeColor = (type) => {
        switch (type) {
            case "exercise":
                return "#FF9800"; // Orange
            case "sleep":
                return "#5C6BC0"; // Indigo
            case "mood":
                return "#8eb695"; // App green
            case "nutrition":
                return "#4CAF50"; // Green
            case "mindfulness":
                return "#9C27B0"; // Purple
            default:
                return "#607D8B"; // Blue Grey
        }
    };
    
    // Get source label
    const getSourceLabel = (source) => {
        switch (source) {
            case "health_data":
                return "Based on your health data";
            case "diary_analysis":
                return "Based on your diary entries";
            case "combined_analysis":
                return "Based on combined analysis";
            default:
                return "Personalized recommendation";
        }
    };
    
    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Handle toggle complete
    const handleToggleComplete = () => {
        setIsCompleted(!isCompleted);
        // In a real app, you would also update this in your backend
    };
    
    // Handle toggle save
    const handleToggleSave = () => {
        setIsSaved(!isSaved);
        // In a real app, you would also update this in your backend
    };
    
    // Handle go back
    const handleGoBack = () => {
        navigate(-1);
    };
    
    if (isLoading) {
        return (
            <div className="RecommendationDetail">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Loading recommendation details...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="RecommendationDetail">
                <div className="ErrorContainer">
                    <div className="ErrorIcon">!</div>
                    <h3>Error Loading Recommendation</h3>
                    <p>{error}</p>
                    <Button 
                        text="Go Back"
                        onClick={handleGoBack}
                        type="default"
                    />
                </div>
            </div>
        );
    }
    
    if (!recommendation) {
        return (
            <div className="RecommendationDetail">
                <div className="ErrorContainer">
                    <h3>Recommendation Not Found</h3>
                    <p>The recommendation you're looking for doesn't exist or has been removed.</p>
                    <Button 
                        text="Go Back"
                        onClick={handleGoBack}
                        type="default"
                    />
                </div>
            </div>
        );
    }
    
    return (
        <div className="RecommendationDetail">
            <div className="RecommendationDetailHeader">
                <Button 
                    text="← Back"
                    onClick={handleGoBack}
                    type="default"
                    size="small"
                />
                
                <div className="RecommendationActions">
                    <button 
                        className={`ActionButton SaveButton ${isSaved ? 'active' : ''}`}
                        onClick={handleToggleSave}
                        title={isSaved ? "Remove from saved" : "Save recommendation"}
                    >
                        {isSaved ? "★ Saved" : "☆ Save"}
                    </button>
                    
                    <button 
                        className={`ActionButton CompleteButton ${isCompleted ? 'active' : ''}`}
                        onClick={handleToggleComplete}
                        title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    >
                        {isCompleted ? "✓ Completed" : "○ Mark Complete"}
                    </button>
                </div>
            </div>
            
            <div className="RecommendationDetailContent">
                <div className="RecommendationTypeTag" style={{ backgroundColor: getTypeColor(recommendation.type) }}>
                    <span className="TypeIcon">{getTypeIcon(recommendation.type)}</span>
                    <span className="TypeText">{recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}</span>
                </div>
                
                <h1 className="RecommendationTitle">{recommendation.title}</h1>
                
                <div className="RecommendationMeta">
                    <span className="RecommendationSource">{getSourceLabel(recommendation.source)}</span>
                    <span className="RecommendationDate">Generated on {formatDate(recommendation.date)}</span>
                </div>
                
                <div className="RecommendationSummary">
                    <h3>Summary</h3>
                    <p>{recommendation.description}</p>
                </div>
                
                <div className="RecommendationDetailedContent">
                    <div dangerouslySetInnerHTML={{ 
                        __html: recommendation.detailedContent
                            .replace(/^# (.*$)/gim, '<h2>$1</h2>')
                            .replace(/^## (.*$)/gim, '<h3>$1</h3>')
                            .replace(/^### (.*$)/gim, '<h4>$1</h4>')
                            .replace(/\n- (.*$)/gim, '<li>$1</li>')
                            .replace(/\n\n/gim, '</p><p>')
                            .replace(/<\/p><p><li>/gim, '<ul><li>')
                            .replace(/<\/li><\/p><p>/gim, '</li></ul><p>')
                    }} />
                </div>
                
                {recommendation.relatedMetrics && (
                    <div className="RelatedMetrics">
                        <h3>Related Health Metrics</h3>
                        <div className="MetricsGrid">
                            {recommendation.relatedMetrics.map((metric, index) => (
                                <div key={index} className="MetricCard">
                                    <div className="MetricName">{metric.name}</div>
                                    <div className="MetricValue">{metric.value}</div>
                                    <div className="MetricTarget">Target: {metric.target}</div>
                                    <div className="ProgressBar">
                                        <div 
                                            className="ProgressFill" 
                                            style={{ width: `${metric.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationDetail;