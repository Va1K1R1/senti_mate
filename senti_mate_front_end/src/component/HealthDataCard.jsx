import React, { useState } from "react";
import "./HealthDataCard.css";

const HealthDataCard = ({ 
    title, 
    icon, 
    data, 
    type, 
    primaryStat, 
    secondaryStat, 
    chartData, 
    chartLabels 
}) => {
    const [expanded, setExpanded] = useState(false);
    
    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    
    // Function to determine the color based on the type of health data
    const getColor = () => {
        switch (type) {
            case "steps":
                return "#4CAF50"; // Green
            case "sleep":
                return "#5C6BC0"; // Indigo
            case "heartRate":
                return "#EF5350"; // Red
            case "exercise":
                return "#FF9800"; // Orange
            default:
                return "#8eb695"; // Default app color
        }
    };
    
    // Simple bar chart renderer
    const renderBarChart = () => {
        const color = getColor();
        const maxValue = Math.max(...chartData);
        
        return (
            <div className="BarChart">
                {chartData.map((value, index) => (
                    <div key={index} className="BarChartColumn">
                        <div 
                            className="BarChartBar" 
                            style={{ 
                                height: `${(value / maxValue) * 100}%`,
                                backgroundColor: color
                            }}
                            title={`${chartLabels[index]}: ${value}`}
                        ></div>
                        <div className="BarChartLabel">{chartLabels[index]}</div>
                    </div>
                ))}
            </div>
        );
    };
    
    // Render detailed view based on health data type
    const renderDetailedView = () => {
        switch (type) {
            case "steps":
                return (
                    <div className="DetailedView">
                        <div className="DetailedStats">
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Today</span>
                                <span className="DetailStatValue">{data.today.toLocaleString()}</span>
                            </div>
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Goal</span>
                                <span className="DetailStatValue">{data.goal.toLocaleString()}</span>
                            </div>
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Progress</span>
                                <div className="ProgressBar">
                                    <div 
                                        className="ProgressBarFill" 
                                        style={{ 
                                            width: `${Math.min(100, Math.round(data.today / data.goal * 100))}%`,
                                            backgroundColor: getColor()
                                        }}
                                    ></div>
                                </div>
                                <span className="ProgressText">{Math.round(data.today / data.goal * 100)}%</span>
                            </div>
                        </div>
                        <div className="WeeklyChart">
                            <h4>Weekly Steps</h4>
                            {renderBarChart()}
                        </div>
                    </div>
                );
            
            case "sleep":
                return (
                    <div className="DetailedView">
                        <div className="DetailedStats">
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Last Night</span>
                                <span className="DetailStatValue">{data.lastNight.total} hours</span>
                            </div>
                            <div className="SleepBreakdown">
                                <div className="SleepPhase" style={{ backgroundColor: "#5C6BC0", width: `${(data.lastNight.deep / data.lastNight.total) * 100}%` }}>
                                    <span className="SleepPhaseTooltip">Deep: {data.lastNight.deep}h</span>
                                </div>
                                <div className="SleepPhase" style={{ backgroundColor: "#9FA8DA", width: `${(data.lastNight.light / data.lastNight.total) * 100}%` }}>
                                    <span className="SleepPhaseTooltip">Light: {data.lastNight.light}h</span>
                                </div>
                                <div className="SleepPhase" style={{ backgroundColor: "#7986CB", width: `${(data.lastNight.rem / data.lastNight.total) * 100}%` }}>
                                    <span className="SleepPhaseTooltip">REM: {data.lastNight.rem}h</span>
                                </div>
                            </div>
                        </div>
                        <div className="WeeklyChart">
                            <h4>Weekly Sleep</h4>
                            {renderBarChart()}
                        </div>
                    </div>
                );
                
            case "heartRate":
                return (
                    <div className="DetailedView">
                        <div className="DetailedStats">
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Current</span>
                                <span className="DetailStatValue">{data.current} BPM</span>
                            </div>
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Resting</span>
                                <span className="DetailStatValue">{data.resting} BPM</span>
                            </div>
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Range</span>
                                <span className="DetailStatValue">{data.min} - {data.max} BPM</span>
                            </div>
                        </div>
                        <div className="WeeklyChart">
                            <h4>Weekly Average Heart Rate</h4>
                            {renderBarChart()}
                        </div>
                    </div>
                );
                
            case "exercise":
                return (
                    <div className="DetailedView">
                        <div className="DetailedStats">
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Today's Activity</span>
                                <span className="DetailStatValue">{data.today.type}</span>
                            </div>
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Duration</span>
                                <span className="DetailStatValue">{data.today.duration} min</span>
                            </div>
                            <div className="DetailStat">
                                <span className="DetailStatLabel">Calories</span>
                                <span className="DetailStatValue">{data.today.calories} cal</span>
                            </div>
                        </div>
                        <div className="WeeklyChart">
                            <h4>Weekly Calories Burned</h4>
                            {renderBarChart()}
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <div className={`HealthDataCard ${expanded ? 'expanded' : ''}`} style={{ borderTopColor: getColor() }}>
            <div className="CardHeader" onClick={toggleExpand}>
                <div className="CardTitle">
                    <span className="CardIcon">{icon}</span>
                    <h3>{title}</h3>
                </div>
                <button className="ExpandButton">
                    {expanded ? '−' : '+'}
                </button>
            </div>
            
            <div className="CardContent">
                <div className="CardStats">
                    <div className="PrimaryStat">{primaryStat}</div>
                    <div className="SecondaryStat">{secondaryStat}</div>
                </div>
                
                {expanded && renderDetailedView()}
            </div>
        </div>
    );
};

export default HealthDataCard;