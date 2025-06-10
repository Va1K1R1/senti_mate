import React, { useState, useEffect } from "react";
import "./RecommendationList.css";
import RecommendationItem from "./RecommendationItem";

const RecommendationList = ({ recommendations }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("all");
    
    useEffect(() => {
        // If recommendations are provided as a prop, use them
        if (recommendations) {
            setData(recommendations);
            setIsLoading(false);
            return;
        }
        
        // Otherwise, simulate fetching data from an API
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1200));
                
                // Mock data for demonstration
                const mockRecommendations = [
                    {
                        id: 1,
                        type: "exercise",
                        title: "Try a Morning Walk",
                        description: "Based on your sleep patterns and step count, a 20-minute morning walk could improve your energy levels throughout the day.",
                        source: "health_data",
                        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
                        isCompleted: false,
                        isSaved: true
                    },
                    {
                        id: 2,
                        type: "mood",
                        title: "Practice Gratitude Journaling",
                        description: "Your recent diary entries show signs of stress. Taking 5 minutes each evening to write down 3 things you're grateful for can help shift your perspective.",
                        source: "diary_analysis",
                        date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                        isCompleted: true,
                        isSaved: true
                    },
                    {
                        id: 3,
                        type: "sleep",
                        title: "Establish a Bedtime Routine",
                        description: "Your sleep data shows irregular patterns. Try setting a consistent bedtime and creating a 15-minute wind-down routine to improve sleep quality.",
                        source: "health_data",
                        date: new Date(), // Today
                        isCompleted: false,
                        isSaved: false
                    },
                    {
                        id: 4,
                        type: "nutrition",
                        title: "Increase Water Intake",
                        description: "Based on your activity levels and the emotions expressed in your diary, increasing your water intake could help with your energy and focus.",
                        source: "combined_analysis",
                        date: new Date(), // Today
                        isCompleted: false,
                        isSaved: false
                    },
                    {
                        id: 5,
                        type: "exercise",
                        title: "Try Strength Training",
                        description: "Your exercise patterns show mostly cardio activities. Adding 2 days of strength training per week could help balance your fitness routine.",
                        source: "health_data",
                        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
                        isCompleted: false,
                        isSaved: true
                    }
                ];
                
                setData(mockRecommendations);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError("Failed to load recommendations. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRecommendations();
    }, [recommendations]);
    
    const handleToggleComplete = (id) => {
        setData(prevData => 
            prevData.map(item => 
                item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
            )
        );
    };
    
    const handleToggleSave = (id) => {
        setData(prevData => 
            prevData.map(item => 
                item.id === id ? { ...item, isSaved: !item.isSaved } : item
            )
        );
    };
    
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };
    
    // Filter recommendations based on selected filter
    const filteredRecommendations = data.filter(item => {
        if (filter === "all") return true;
        if (filter === "saved") return item.isSaved;
        if (filter === "completed") return item.isCompleted;
        if (filter === "pending") return !item.isCompleted;
        return item.type === filter;
    });
    
    if (isLoading) {
        return (
            <div className="RecommendationList">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Loading recommendations...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="RecommendationList">
                <div className="ErrorContainer">
                    <div className="ErrorIcon">!</div>
                    <h3>Error Loading Recommendations</h3>
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
        <div className="RecommendationList">
            <div className="RecommendationHeader">
                <h2>Personalized Recommendations</h2>
                <p>Based on your health data and diary entries</p>
            </div>
            
            <div className="FilterContainer">
                <button 
                    className={`FilterButton ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('all')}
                >
                    All
                </button>
                <button 
                    className={`FilterButton ${filter === 'saved' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('saved')}
                >
                    Saved
                </button>
                <button 
                    className={`FilterButton ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('pending')}
                >
                    Pending
                </button>
                <button 
                    className={`FilterButton ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('completed')}
                >
                    Completed
                </button>
            </div>
            
            <div className="RecommendationItems">
                {filteredRecommendations.length > 0 ? (
                    filteredRecommendations.map(recommendation => (
                        <RecommendationItem 
                            key={recommendation.id}
                            recommendation={recommendation}
                            onToggleComplete={handleToggleComplete}
                            onToggleSave={handleToggleSave}
                        />
                    ))
                ) : (
                    <div className="EmptyState">
                        <p>No recommendations found for the selected filter.</p>
                    </div>
                )}
            </div>
            
            <div className="RecommendationFooter">
                <p>Recommendations are generated by AI based on your data and are not medical advice.</p>
                <button className="RefreshButton">
                    Get New Recommendations
                </button>
            </div>
        </div>
    );
};

export default RecommendationList;