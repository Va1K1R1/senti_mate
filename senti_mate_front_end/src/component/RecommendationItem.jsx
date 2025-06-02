import React from "react";
import "./RecommendationItem.css";

const RecommendationItem = ({ recommendation, onToggleComplete, onToggleSave }) => {
    const { id, type, title, description, source, date, isCompleted, isSaved } = recommendation;
    
    // Format the date to display
    const formatDate = (date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };
    
    // Get icon based on recommendation type
    const getTypeIcon = () => {
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
    
    // Get source label
    const getSourceLabel = () => {
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
    
    // Get color based on recommendation type
    const getTypeColor = () => {
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
    
    return (
        <div className={`RecommendationItem ${isCompleted ? 'completed' : ''}`}>
            <div className="RecommendationTypeIcon" style={{ backgroundColor: getTypeColor() }}>
                {getTypeIcon()}
            </div>
            
            <div className="RecommendationContent">
                <div className="RecommendationHeader">
                    <h3 className="RecommendationTitle">{title}</h3>
                    <span className="RecommendationDate">{formatDate(date)}</span>
                </div>
                
                <p className="RecommendationDescription">{description}</p>
                
                <div className="RecommendationMeta">
                    <span className="RecommendationSource">{getSourceLabel()}</span>
                    <div className="RecommendationActions">
                        <button 
                            className={`ActionButton SaveButton ${isSaved ? 'active' : ''}`}
                            onClick={() => onToggleSave(id)}
                            title={isSaved ? "Remove from saved" : "Save recommendation"}
                        >
                            {isSaved ? "★" : "☆"}
                        </button>
                        
                        <button 
                            className={`ActionButton CompleteButton ${isCompleted ? 'active' : ''}`}
                            onClick={() => onToggleComplete(id)}
                            title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                        >
                            {isCompleted ? "✓" : "○"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationItem;