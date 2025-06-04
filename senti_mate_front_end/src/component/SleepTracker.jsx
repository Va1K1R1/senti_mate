import React, { useState, useEffect } from "react";
import "./SleepTracker.css";
import HealthDataChart from "./HealthDataChart";

const SleepTracker = ({ data, onRefresh }) => {
    const [sleepData, setSleepData] = useState(data || null);
    const [isLoading, setIsLoading] = useState(!data);
    const [selectedPeriod, setSelectedPeriod] = useState("week");
    const [selectedMetric, setSelectedMetric] = useState("duration");
    
    useEffect(() => {
        if (data) {
            setSleepData(data);
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
                    lastNight: {
                        date: "2023-06-07",
                        bedtime: "23:30",
                        wakeup: "07:00",
                        duration: 7.5,
                        quality: 85,
                        deep: 2.3,
                        light: 4.2,
                        rem: 1.0,
                        awake: 0.3,
                        heartRate: { avg: 62, min: 58, max: 76 },
                        respiratoryRate: { avg: 16, min: 14, max: 18 }
                    },
                    week: [
                        {
                            date: "2023-06-01",
                            duration: 6.5,
                            quality: 75,
                            deep: 1.8,
                            light: 3.7,
                            rem: 0.8,
                            awake: 0.2,
                            bedtime: "00:15",
                            wakeup: "06:45"
                        },
                        {
                            date: "2023-06-02",
                            duration: 7.2,
                            quality: 82,
                            deep: 2.1,
                            light: 4.0,
                            rem: 0.9,
                            awake: 0.2,
                            bedtime: "23:45",
                            wakeup: "07:00"
                        },
                        {
                            date: "2023-06-03",
                            duration: 8.0,
                            quality: 88,
                            deep: 2.5,
                            light: 4.3,
                            rem: 1.1,
                            awake: 0.1,
                            bedtime: "23:00",
                            wakeup: "07:00"
                        },
                        {
                            date: "2023-06-04",
                            duration: 7.5,
                            quality: 85,
                            deep: 2.3,
                            light: 4.2,
                            rem: 1.0,
                            awake: 0.0,
                            bedtime: "23:30",
                            wakeup: "07:00"
                        },
                        {
                            date: "2023-06-05",
                            duration: 6.8,
                            quality: 78,
                            deep: 2.0,
                            light: 3.8,
                            rem: 0.8,
                            awake: 0.2,
                            bedtime: "00:00",
                            wakeup: "06:48"
                        },
                        {
                            date: "2023-06-06",
                            duration: 7.9,
                            quality: 90,
                            deep: 2.6,
                            light: 4.1,
                            rem: 1.2,
                            awake: 0.0,
                            bedtime: "22:45",
                            wakeup: "06:40"
                        },
                        {
                            date: "2023-06-07",
                            duration: 7.5,
                            quality: 85,
                            deep: 2.3,
                            light: 4.2,
                            rem: 1.0,
                            awake: 0.0,
                            bedtime: "23:30",
                            wakeup: "07:00"
                        }
                    ],
                    month: [
                        // Simplified for brevity - would contain 30 days of data
                        { date: "2023-06-01", avgDuration: 7.2, avgQuality: 82 },
                        { date: "2023-06-08", avgDuration: 7.5, avgQuality: 85 },
                        { date: "2023-06-15", avgDuration: 6.9, avgQuality: 79 },
                        { date: "2023-06-22", avgDuration: 7.8, avgQuality: 88 },
                        { date: "2023-06-29", avgDuration: 7.3, avgQuality: 83 }
                    ],
                    sleepSummary: {
                        avgDuration: 7.3,
                        avgQuality: 83,
                        avgDeep: 2.2,
                        avgLight: 4.0,
                        avgRem: 1.0,
                        avgAwake: 0.1,
                        avgBedtime: "23:30",
                        avgWakeup: "06:50",
                        bestDay: "2023-06-06",
                        worstDay: "2023-06-01"
                    }
                };
                
                setSleepData(mockData);
            } catch (error) {
                console.error("Error fetching sleep data:", error);
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
    
    const handleMetricChange = (metric) => {
        setSelectedMetric(metric);
    };
    
    // Prepare chart data based on selected period and metric
    const prepareChartData = () => {
        if (!sleepData) return { data: [], labels: [] };
        
        if (selectedPeriod === "week") {
            const chartData = sleepData.week.map(day => {
                switch (selectedMetric) {
                    case "duration":
                        return day.duration;
                    case "quality":
                        return day.quality;
                    case "deep":
                        return day.deep;
                    case "light":
                        return day.light;
                    case "rem":
                        return day.rem;
                    default:
                        return day.duration;
                }
            });
            
            const labels = sleepData.week.map((day, index) => {
                const date = new Date(day.date);
                return date.toLocaleDateString('en-US', { weekday: 'short' });
            });
            
            return { data: chartData, labels };
        } else if (selectedPeriod === "month") {
            const chartData = sleepData.month.map(week => {
                return selectedMetric === "duration" ? week.avgDuration : week.avgQuality;
            });
            
            const labels = sleepData.month.map(week => {
                const date = new Date(week.date);
                return date.toLocaleDateString('en-US', { day: 'numeric' });
            });
            
            return { data: chartData, labels };
        }
        
        return { data: [], labels: [] };
    };
    
    // Get sleep quality description
    const getSleepQualityDescription = (quality) => {
        if (quality >= 90) return "Excellent";
        if (quality >= 80) return "Very Good";
        if (quality >= 70) return "Good";
        if (quality >= 60) return "Fair";
        if (quality >= 50) return "Poor";
        return "Very Poor";
    };
    
    // Get sleep quality color
    const getSleepQualityColor = (quality) => {
        if (quality >= 90) return "#4CAF50"; // Green
        if (quality >= 80) return "#8BC34A"; // Light Green
        if (quality >= 70) return "#CDDC39"; // Lime
        if (quality >= 60) return "#FFEB3B"; // Yellow
        if (quality >= 50) return "#FFC107"; // Amber
        return "#FF5722"; // Deep Orange
    };
    
    // Format time (HH:MM)
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };
    
    if (isLoading) {
        return (
            <div className="SleepTracker">
                <div className="LoadingContainer">
                    <div className="LoadingSpinner"></div>
                    <p>Loading sleep data...</p>
                </div>
            </div>
        );
    }
    
    if (!sleepData) {
        return (
            <div className="SleepTracker">
                <div className="ErrorContainer">
                    <p>No sleep data available.</p>
                    <button className="RefreshButton" onClick={handleRefresh}>
                        Refresh
                    </button>
                </div>
            </div>
        );
    }
    
    const chartData = prepareChartData();
    const lastNight = sleepData.lastNight;
    const sleepSummary = sleepData.sleepSummary;
    
    // Calculate sleep phase percentages
    const totalSleepTime = lastNight.deep + lastNight.light + lastNight.rem;
    const deepPercentage = (lastNight.deep / totalSleepTime) * 100;
    const lightPercentage = (lastNight.light / totalSleepTime) * 100;
    const remPercentage = (lastNight.rem / totalSleepTime) * 100;
    
    return (
        <div className="SleepTracker">
            <div className="SleepHeader">
                <h2>Sleep Tracker</h2>
                <button className="RefreshButton" onClick={handleRefresh}>
                    <span className="RefreshIcon">↻</span>
                </button>
            </div>
            
            <div className="LastNightSummary">
                <div className="SleepQualityIndicator" style={{ 
                    backgroundColor: getSleepQualityColor(lastNight.quality) 
                }}>
                    <div className="SleepQualityScore">{lastNight.quality}</div>
                    <div className="SleepQualityLabel">
                        {getSleepQualityDescription(lastNight.quality)}
                    </div>
                </div>
                
                <div className="SleepDetails">
                    <div className="SleepTime">
                        <div className="SleepTimeItem">
                            <span className="SleepTimeLabel">Bedtime</span>
                            <span className="SleepTimeValue">{formatTime(lastNight.bedtime)}</span>
                        </div>
                        <div className="SleepDuration">
                            <span className="SleepDurationValue">{lastNight.duration}h</span>
                        </div>
                        <div className="SleepTimeItem">
                            <span className="SleepTimeLabel">Wake Up</span>
                            <span className="SleepTimeValue">{formatTime(lastNight.wakeup)}</span>
                        </div>
                    </div>
                    
                    <div className="SleepPhases">
                        <div className="SleepPhaseBar">
                            <div className="SleepPhase deep" style={{ width: `${deepPercentage}%` }}>
                                <span className="SleepPhaseTooltip">Deep: {lastNight.deep}h</span>
                            </div>
                            <div className="SleepPhase light" style={{ width: `${lightPercentage}%` }}>
                                <span className="SleepPhaseTooltip">Light: {lastNight.light}h</span>
                            </div>
                            <div className="SleepPhase rem" style={{ width: `${remPercentage}%` }}>
                                <span className="SleepPhaseTooltip">REM: {lastNight.rem}h</span>
                            </div>
                        </div>
                        <div className="SleepPhaseLegend">
                            <div className="SleepPhaseLegendItem">
                                <div className="SleepPhaseLegendColor deep"></div>
                                <div className="SleepPhaseLegendLabel">Deep</div>
                            </div>
                            <div className="SleepPhaseLegendItem">
                                <div className="SleepPhaseLegendColor light"></div>
                                <div className="SleepPhaseLegendLabel">Light</div>
                            </div>
                            <div className="SleepPhaseLegendItem">
                                <div className="SleepPhaseLegendColor rem"></div>
                                <div className="SleepPhaseLegendLabel">REM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="SleepFilters">
                <div className="PeriodSelector">
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
                
                <div className="MetricSelector">
                    <select 
                        value={selectedMetric}
                        onChange={(e) => handleMetricChange(e.target.value)}
                    >
                        <option value="duration">Duration</option>
                        <option value="quality">Quality</option>
                        <option value="deep">Deep Sleep</option>
                        <option value="light">Light Sleep</option>
                        <option value="rem">REM Sleep</option>
                    </select>
                </div>
            </div>
            
            <div className="SleepChartContainer">
                <HealthDataChart 
                    title={`Sleep ${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} (${selectedPeriod === 'week' ? 'Weekly' : 'Monthly'})`}
                    data={chartData.data}
                    labels={chartData.labels}
                    type="bar"
                    color="#5C6BC0"
                    height={250}
                />
            </div>
            
            <div className="SleepSummary">
                <h3>Sleep Summary</h3>
                <div className="SleepSummaryGrid">
                    <div className="SleepSummaryItem">
                        <div className="SummaryItemLabel">Avg. Duration</div>
                        <div className="SummaryItemValue">{sleepSummary.avgDuration}h</div>
                    </div>
                    <div className="SleepSummaryItem">
                        <div className="SummaryItemLabel">Avg. Quality</div>
                        <div className="SummaryItemValue">{sleepSummary.avgQuality}</div>
                    </div>
                    <div className="SleepSummaryItem">
                        <div className="SummaryItemLabel">Avg. Deep Sleep</div>
                        <div className="SummaryItemValue">{sleepSummary.avgDeep}h</div>
                    </div>
                    <div className="SleepSummaryItem">
                        <div className="SummaryItemLabel">Avg. Light Sleep</div>
                        <div className="SummaryItemValue">{sleepSummary.avgLight}h</div>
                    </div>
                    <div className="SleepSummaryItem">
                        <div className="SummaryItemLabel">Avg. REM Sleep</div>
                        <div className="SummaryItemValue">{sleepSummary.avgRem}h</div>
                    </div>
                    <div className="SleepSummaryItem">
                        <div className="SummaryItemLabel">Avg. Bedtime</div>
                        <div className="SummaryItemValue">{formatTime(sleepSummary.avgBedtime)}</div>
                    </div>
                </div>
            </div>
            
            <div className="SleepTips">
                <h3>Sleep Tips</h3>
                <ul className="TipsList">
                    <li className="TipItem">
                        <div className="TipIcon">💡</div>
                        <div className="TipContent">
                            <div className="TipTitle">Consistent Schedule</div>
                            <div className="TipDescription">Go to bed and wake up at the same time every day, even on weekends.</div>
                        </div>
                    </li>
                    <li className="TipItem">
                        <div className="TipIcon">📱</div>
                        <div className="TipContent">
                            <div className="TipTitle">Limit Screen Time</div>
                            <div className="TipDescription">Avoid screens at least 1 hour before bedtime to improve sleep quality.</div>
                        </div>
                    </li>
                    <li className="TipItem">
                        <div className="TipIcon">🌙</div>
                        <div className="TipContent">
                            <div className="TipTitle">Dark Environment</div>
                            <div className="TipDescription">Keep your bedroom dark, quiet, and cool for optimal sleep conditions.</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SleepTracker;