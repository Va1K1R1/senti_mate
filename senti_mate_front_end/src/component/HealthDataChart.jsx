import React, { useState, useEffect } from "react";
import "./HealthDataChart.css";

const HealthDataChart = ({ 
    title,
    data,
    labels,
    type = "bar",
    color = "#8eb695",
    height = 200,
    showLegend = true,
    showTooltips = true,
    animate = true,
    onDataPointClick = null
}) => {
    const [chartData, setChartData] = useState(data);
    const [isAnimating, setIsAnimating] = useState(animate);
    
    useEffect(() => {
        setChartData(data);
        if (animate) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [data, animate]);
    
    // Calculate chart dimensions
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    // Function to get color based on data type
    const getChartColor = () => {
        if (typeof color === 'function') {
            return color(data);
        }
        return color;
    };
    
    // Render bar chart
    const renderBarChart = () => {
        return (
            <div className="BarChartContainer" style={{ height: `${height}px` }}>
                {data.map((value, index) => {
                    const barHeight = range === 0 ? 0 : ((value - minValue) / range) * 100;
                    return (
                        <div key={index} className="BarChartColumn">
                            <div 
                                className={`BarChartBar ${isAnimating ? 'animate' : ''}`}
                                style={{ 
                                    height: `${barHeight}%`,
                                    backgroundColor: getChartColor(),
                                    transitionDelay: `${index * 50}ms`
                                }}
                                onClick={() => onDataPointClick && onDataPointClick(value, index, labels[index])}
                                title={showTooltips ? `${labels[index]}: ${value}` : undefined}
                            ></div>
                            {labels && <div className="BarChartLabel">{labels[index]}</div>}
                        </div>
                    );
                })}
            </div>
        );
    };
    
    // Render line chart
    const renderLineChart = () => {
        // Calculate points for the SVG path
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = range === 0 ? 0 : 100 - ((value - minValue) / range) * 100;
            return `${x},${y}`;
        }).join(' ');
        
        return (
            <div className="LineChartContainer" style={{ height: `${height}px` }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Draw the line */}
                    <polyline
                        className={`LineChartLine ${isAnimating ? 'animate' : ''}`}
                        points={points}
                        fill="none"
                        stroke={getChartColor()}
                        strokeWidth="2"
                    />
                    
                    {/* Draw data points */}
                    {data.map((value, index) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = range === 0 ? 0 : 100 - ((value - minValue) / range) * 100;
                        return (
                            <circle
                                key={index}
                                className={`LineChartPoint ${isAnimating ? 'animate' : ''}`}
                                cx={x}
                                cy={y}
                                r="2"
                                fill={getChartColor()}
                                onClick={() => onDataPointClick && onDataPointClick(value, index, labels[index])}
                                style={{ transitionDelay: `${index * 50 + 300}ms` }}
                            >
                                {showTooltips && (
                                    <title>{labels[index]}: {value}</title>
                                )}
                            </circle>
                        );
                    })}
                </svg>
                
                {/* X-axis labels */}
                {labels && (
                    <div className="LineChartLabels">
                        {labels.map((label, index) => (
                            <div 
                                key={index} 
                                className="LineChartLabel"
                                style={{ left: `${(index / (labels.length - 1)) * 100}%` }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    return (
        <div className="HealthDataChart">
            {title && <h3 className="ChartTitle">{title}</h3>}
            
            <div className="ChartContainer">
                {type === "bar" && renderBarChart()}
                {type === "line" && renderLineChart()}
            </div>
            
            {showLegend && (
                <div className="ChartLegend">
                    <div className="LegendItem">
                        <div className="LegendColor" style={{ backgroundColor: getChartColor() }}></div>
                        <div className="LegendLabel">{title || "Data"}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthDataChart;