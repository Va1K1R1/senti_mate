import React, { useState } from 'react';
import './HealthDataForm.css';
import Button from '../common/Button';
import { useHealthData } from '../../context/HealthDataContext';

/**
 * HealthDataForm component for inputting health data
 * @param {Object} props - Component props
 * @param {string} props.type - Type of health data ('steps', 'heartRate', 'sleep', 'exercise')
 * @param {function} props.onClose - Function to close the form
 * @returns {JSX.Element} HealthDataForm component
 */
const HealthDataForm = ({ type = 'steps', onClose }) => {
  const { addHealthData } = useHealthData();
  
  // State for form fields
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [value, setValue] = useState('');
  const [duration, setDuration] = useState('');
  const [quality, setQuality] = useState('good');
  const [exerciseType, setExerciseType] = useState('running');
  const [calories, setCalories] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [error, setError] = useState('');
  
  // Get form title based on type
  const getFormTitle = () => {
    switch (type) {
      case 'steps':
        return 'Add Step Count';
      case 'heartRate':
        return 'Add Heart Rate';
      case 'sleep':
        return 'Add Sleep Data';
      case 'exercise':
        return 'Add Exercise';
      default:
        return 'Add Health Data';
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let data = { date };
      
      // Validate and prepare data based on type
      switch (type) {
        case 'steps':
          if (!value || isNaN(value) || value <= 0) {
            setError('Please enter a valid step count');
            return;
          }
          data.count = parseInt(value);
          break;
          
        case 'heartRate':
          if (!value || isNaN(value) || value <= 0) {
            setError('Please enter a valid average heart rate');
            return;
          }
          if (!min || isNaN(min) || min <= 0) {
            setError('Please enter a valid minimum heart rate');
            return;
          }
          if (!max || isNaN(max) || max <= 0) {
            setError('Please enter a valid maximum heart rate');
            return;
          }
          if (parseInt(min) >= parseInt(max)) {
            setError('Maximum heart rate must be greater than minimum heart rate');
            return;
          }
          data.average = parseInt(value);
          data.min = parseInt(min);
          data.max = parseInt(max);
          break;
          
        case 'sleep':
          if (!duration || isNaN(duration) || duration <= 0) {
            setError('Please enter a valid sleep duration');
            return;
          }
          data.duration = parseFloat(duration);
          data.quality = quality;
          break;
          
        case 'exercise':
          if (!duration || isNaN(duration) || duration < 0) {
            setError('Please enter a valid exercise duration');
            return;
          }
          if (!calories || isNaN(calories) || calories < 0) {
            setError('Please enter a valid calorie count');
            return;
          }
          data.type = exerciseType;
          data.duration = parseInt(duration);
          data.calories = parseInt(calories);
          break;
          
        default:
          setError('Invalid health data type');
          return;
      }
      
      // Add health data
      addHealthData(type, data);
      
      // Close form
      onClose();
    } catch (err) {
      setError('Error adding health data: ' + err.message);
    }
  };
  
  return (
    <div className="health-data-form-container">
      <div className="health-data-form">
        <h2 className="form-title">{getFormTitle()}</h2>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          {type === 'steps' && (
            <div className="form-group">
              <label htmlFor="steps">Step Count</label>
              <input
                type="number"
                id="steps"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter step count"
                min="0"
                required
              />
            </div>
          )}
          
          {type === 'heartRate' && (
            <>
              <div className="form-group">
                <label htmlFor="average">Average Heart Rate (bpm)</label>
                <input
                  type="number"
                  id="average"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter average heart rate"
                  min="0"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="min">Minimum (bpm)</label>
                  <input
                    type="number"
                    id="min"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    placeholder="Min"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="max">Maximum (bpm)</label>
                  <input
                    type="number"
                    id="max"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    placeholder="Max"
                    min="0"
                    required
                  />
                </div>
              </div>
            </>
          )}
          
          {type === 'sleep' && (
            <>
              <div className="form-group">
                <label htmlFor="duration">Sleep Duration (hours)</label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter sleep duration"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quality">Sleep Quality</label>
                <select
                  id="quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  required
                >
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>
            </>
          )}
          
          {type === 'exercise' && (
            <>
              <div className="form-group">
                <label htmlFor="exerciseType">Exercise Type</label>
                <select
                  id="exerciseType"
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                  required
                >
                  <option value="running">Running</option>
                  <option value="walking">Walking</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                  <option value="yoga">Yoga</option>
                  <option value="weightlifting">Weightlifting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="exerciseDuration">Duration (minutes)</label>
                  <input
                    type="number"
                    id="exerciseDuration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Duration"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="calories">Calories Burned</label>
                  <input
                    type="number"
                    id="calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Calories"
                    min="0"
                    required
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="form-actions">
            <Button type="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthDataForm;