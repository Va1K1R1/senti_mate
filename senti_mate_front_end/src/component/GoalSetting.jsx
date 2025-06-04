import React, { useState, useEffect } from "react";
import "./GoalSetting.css";
import Button from "./Button";

/**
 * GoalSetting component for setting and tracking health goals
 * Allows users to create, edit, and track progress on health-related goals
 * @returns {JSX.Element} The rendered GoalSetting component
 */
const GoalSetting = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [goals, setGoals] = useState([]);
    const [activeTab, setActiveTab] = useState("active"); // "active", "completed", "all"
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGoal, setNewGoal] = useState({
        title: "",
        category: "physical",
        targetValue: "",
        targetUnit: "",
        deadline: "",
        description: ""
    });

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                setIsLoading(true);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Mock data for demonstration
                const mockGoals = [
                    {
                        id: 1,
                        title: "Increase daily step count",
                        category: "physical",
                        currentValue: 6500,
                        targetValue: 10000,
                        targetUnit: "steps",
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
                        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16), // 16 days from now
                        progress: 65,
                        description: "Walk more throughout the day to reach 10,000 steps daily",
                        isCompleted: false,
                        history: [
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), value: 5200 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), value: 5500 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), value: 6000 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), value: 5800 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), value: 6200 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), value: 6400 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), value: 6500 }
                        ]
                    },
                    {
                        id: 2,
                        title: "Meditate regularly",
                        category: "mindfulness",
                        currentValue: 3,
                        targetValue: 5,
                        targetUnit: "days/week",
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), // 21 days ago
                        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9), // 9 days from now
                        progress: 60,
                        description: "Practice meditation for at least 10 minutes, 5 days a week",
                        isCompleted: false,
                        history: [
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), value: 2 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), value: 2 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), value: 3 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), value: 2 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), value: 3 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), value: 3 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), value: 3 }
                        ]
                    },
                    {
                        id: 3,
                        title: "Improve sleep schedule",
                        category: "sleep",
                        currentValue: 6.5,
                        targetValue: 8,
                        targetUnit: "hours/night",
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
                        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
                        progress: 81,
                        description: "Get 8 hours of sleep consistently every night",
                        isCompleted: false,
                        history: [
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), value: 6.0 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), value: 6.2 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), value: 6.3 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), value: 6.0 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), value: 6.5 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), value: 6.5 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), value: 6.5 }
                        ]
                    },
                    {
                        id: 4,
                        title: "Drink more water",
                        category: "nutrition",
                        currentValue: 2000,
                        targetValue: 2500,
                        targetUnit: "ml/day",
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
                        deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago (completed)
                        progress: 100,
                        description: "Drink at least 2.5 liters of water daily",
                        isCompleted: true,
                        history: [
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22), value: 1800 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), value: 2000 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), value: 2100 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19), value: 2200 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18), value: 2300 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17), value: 2400 },
                            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16), value: 2500 }
                        ]
                    }
                ];
                
                setGoals(mockGoals);
            } catch (err) {
                console.error("Error fetching goals:", err);
                setError("Failed to load goals. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchGoals();
    }, []);

    // Get category icon
    const getCategoryIcon = (category) => {
        switch (category) {
            case "physical":
                return "🏃‍♂️";
            case "nutrition":
                return "🍎";
            case "sleep":
                return "😴";
            case "mindfulness":
                return "🧘";
            case "emotional":
                return "😊";
            default:
                return "🎯";
        }
    };

    // Get category color
    const getCategoryColor = (category) => {
        switch (category) {
            case "physical":
                return "#FF9800"; // Orange
            case "nutrition":
                return "#4CAF50"; // Green
            case "sleep":
                return "#5C6BC0"; // Indigo
            case "mindfulness":
                return "#9C27B0"; // Purple
            case "emotional":
                return "#8eb695"; // App green
            default:
                return "#607D8B"; // Blue Grey
        }
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate days remaining
    const getDaysRemaining = (deadline) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGoal(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // In a real app, you would send this to your backend
        const newGoalWithId = {
            ...newGoal,
            id: goals.length + 1,
            startDate: new Date(),
            currentValue: 0,
            progress: 0,
            isCompleted: false,
            history: []
        };
        
        setGoals(prev => [...prev, newGoalWithId]);
        setShowAddForm(false);
        setNewGoal({
            title: "",
            category: "physical",
            targetValue: "",
            targetUnit: "",
            deadline: "",
            description: ""
        });
    };

    // Handle goal completion toggle
    const handleToggleComplete = (id) => {
        setGoals(prev => 
            prev.map(goal => 
                goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
            )
        );
    };

    // Filter goals based on active tab
    const filteredGoals = goals.filter(goal => {
        if (activeTab === "active") return !goal.isCompleted;
        if (activeTab === "completed") return goal.isCompleted;
        return true; // "all" tab
    });

    if (isLoading) {
        return (
            <div className="GoalSetting">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Loading your health goals...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="GoalSetting">
                <div className="ErrorContainer">
                    <div className="ErrorIcon">!</div>
                    <h3>Error Loading Goals</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="GoalSetting">
            <div className="GoalSettingHeader">
                <h2>Health Goals</h2>
                <p>Set and track your wellness objectives</p>
            </div>
            
            <div className="GoalTabs">
                <button 
                    className={`TabButton ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => handleTabChange('active')}
                >
                    Active Goals
                </button>
                <button 
                    className={`TabButton ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => handleTabChange('completed')}
                >
                    Completed
                </button>
                <button 
                    className={`TabButton ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => handleTabChange('all')}
                >
                    All Goals
                </button>
                
                <Button 
                    text={showAddForm ? "Cancel" : "Add New Goal"}
                    onClick={() => setShowAddForm(!showAddForm)}
                    type={showAddForm ? "negative" : "positive"}
                    size="small"
                    className="AddGoalButton"
                />
            </div>
            
            {showAddForm && (
                <div className="AddGoalForm">
                    <h3>Create New Goal</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="FormGroup">
                            <label htmlFor="title">Goal Title</label>
                            <input 
                                type="text" 
                                id="title" 
                                name="title" 
                                value={newGoal.title} 
                                onChange={handleInputChange}
                                placeholder="e.g., Increase daily step count"
                                required
                            />
                        </div>
                        
                        <div className="FormRow">
                            <div className="FormGroup">
                                <label htmlFor="category">Category</label>
                                <select 
                                    id="category" 
                                    name="category" 
                                    value={newGoal.category} 
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="physical">Physical Activity</option>
                                    <option value="nutrition">Nutrition</option>
                                    <option value="sleep">Sleep</option>
                                    <option value="mindfulness">Mindfulness</option>
                                    <option value="emotional">Emotional Health</option>
                                </select>
                            </div>
                            
                            <div className="FormGroup">
                                <label htmlFor="deadline">Target Date</label>
                                <input 
                                    type="date" 
                                    id="deadline" 
                                    name="deadline" 
                                    value={newGoal.deadline} 
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="FormRow">
                            <div className="FormGroup">
                                <label htmlFor="targetValue">Target Value</label>
                                <input 
                                    type="number" 
                                    id="targetValue" 
                                    name="targetValue" 
                                    value={newGoal.targetValue} 
                                    onChange={handleInputChange}
                                    placeholder="e.g., 10000"
                                    required
                                />
                            </div>
                            
                            <div className="FormGroup">
                                <label htmlFor="targetUnit">Unit</label>
                                <input 
                                    type="text" 
                                    id="targetUnit" 
                                    name="targetUnit" 
                                    value={newGoal.targetUnit} 
                                    onChange={handleInputChange}
                                    placeholder="e.g., steps, hours, days"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="FormGroup">
                            <label htmlFor="description">Description (Optional)</label>
                            <textarea 
                                id="description" 
                                name="description" 
                                value={newGoal.description} 
                                onChange={handleInputChange}
                                placeholder="Add details about your goal..."
                                rows="3"
                            />
                        </div>
                        
                        <div className="FormActions">
                            <Button 
                                text="Cancel" 
                                onClick={() => setShowAddForm(false)}
                                type="negative"
                            />
                            <Button 
                                text="Create Goal" 
                                type="positive"
                                submit={true}
                            />
                        </div>
                    </form>
                </div>
            )}
            
            {filteredGoals.length === 0 ? (
                <div className="EmptyState">
                    <h3>No {activeTab === "active" ? "Active" : activeTab === "completed" ? "Completed" : ""} Goals Found</h3>
                    <p>
                        {activeTab === "active" 
                            ? "You don't have any active goals. Click 'Add New Goal' to create one." 
                            : activeTab === "completed" 
                                ? "You haven't completed any goals yet. Keep working on your active goals!" 
                                : "You don't have any goals yet. Click 'Add New Goal' to get started."}
                    </p>
                </div>
            ) : (
                <div className="GoalsList">
                    {filteredGoals.map(goal => (
                        <div key={goal.id} className={`GoalCard ${goal.isCompleted ? 'completed' : ''}`}>
                            <div className="GoalHeader">
                                <div 
                                    className="CategoryBadge"
                                    style={{ backgroundColor: `${getCategoryColor(goal.category)}20`, color: getCategoryColor(goal.category) }}
                                >
                                    <span className="CategoryIcon">{getCategoryIcon(goal.category)}</span>
                                    <span className="CategoryName">
                                        {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                                    </span>
                                </div>
                                
                                <div className="GoalActions">
                                    <button 
                                        className={`CompleteButton ${goal.isCompleted ? 'active' : ''}`}
                                        onClick={() => handleToggleComplete(goal.id)}
                                        title={goal.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                    >
                                        {goal.isCompleted ? "✓" : "○"}
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="GoalTitle">{goal.title}</h3>
                            
                            <div className="GoalProgress">
                                <div className="ProgressBar">
                                    <div 
                                        className="ProgressFill" 
                                        style={{ 
                                            width: `${goal.progress}%`,
                                            backgroundColor: getCategoryColor(goal.category)
                                        }}
                                    ></div>
                                </div>
                                <div className="ProgressText">{goal.progress}% complete</div>
                            </div>
                            
                            <div className="GoalDetails">
                                <div className="GoalMetric">
                                    <div className="MetricLabel">Current</div>
                                    <div className="MetricValue">{goal.currentValue} {goal.targetUnit}</div>
                                </div>
                                
                                <div className="GoalMetric">
                                    <div className="MetricLabel">Target</div>
                                    <div className="MetricValue">{goal.targetValue} {goal.targetUnit}</div>
                                </div>
                                
                                <div className="GoalMetric">
                                    <div className="MetricLabel">
                                        {goal.isCompleted ? "Completed" : "Deadline"}
                                    </div>
                                    <div className="MetricValue">
                                        {goal.isCompleted 
                                            ? formatDate(goal.deadline)
                                            : getDaysRemaining(goal.deadline) > 0 
                                                ? `${getDaysRemaining(goal.deadline)} days left`
                                                : "Overdue"
                                        }
                                    </div>
                                </div>
                            </div>
                            
                            {goal.description && (
                                <div className="GoalDescription">
                                    <p>{goal.description}</p>
                                </div>
                            )}
                            
                            {goal.history && goal.history.length > 0 && (
                                <div className="GoalHistory">
                                    <h4>Recent Progress</h4>
                                    <div className="HistoryChart">
                                        {goal.history.map((entry, index) => (
                                            <div key={index} className="HistoryBar">
                                                <div 
                                                    className="HistoryBarFill" 
                                                    style={{ 
                                                        height: `${(entry.value / goal.targetValue) * 100}%`,
                                                        backgroundColor: getCategoryColor(goal.category)
                                                    }}
                                                    title={`${entry.value} ${goal.targetUnit} on ${formatDate(entry.date)}`}
                                                ></div>
                                                <div className="HistoryDate">
                                                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GoalSetting;