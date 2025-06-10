# Frontend API Integration Guide

This document provides a guide for integrating the frontend with the backend API for the SentiMate project. It includes information about the changes made to the service files to align them with the backend API endpoints.

## Overview of Changes

The following service files have been updated to match the backend API endpoints:

1. **AuthService.js**: Updated to use username instead of email for login
2. **DiaryService.js**: Updated to use '/diary-entries' path and include user ID where needed
3. **EmotionService.js**: Added methods for getting emotions for a diary entry, creating an emotion, updating an emotion, and deleting an emotion
4. **HealthDataService.js**: Updated to use the correct endpoints as per the API documentation
5. **RecommendationService.js**: Updated to use the correct endpoints as per the API documentation
6. **UserService.js**: Updated to use the correct endpoints as per the API documentation

## Service Methods

### AuthService

- `login(username, password)`: Login a user with username and password
- `register(userData)`: Register a new user
- `logout()`: Logout the current user
- `getCurrentUser()`: Get the current user from localStorage
- `isAuthenticated()`: Check if the user is authenticated

### DiaryService

- `getAllEntries()`: Get all diary entries for the current user
- `getAllEntriesForUser(userId)`: Get all diary entries for a specific user
- `getEntryById(id)`: Get a specific diary entry by ID
- `createEntry(entryData)`: Create a new diary entry for the current user
- `createEntryForUser(userId, entryData)`: Create a new diary entry for a specific user
- `updateEntry(id, entryData)`: Update an existing diary entry
- `deleteEntry(id)`: Delete a diary entry
- `getEntriesByDateRange(startDate, endDate)`: Get diary entries by date range for the current user
- `getEntriesByDateRangeForUser(userId, startDate, endDate)`: Get diary entries by date range for a specific user
- `getEntriesByMoodRange(userId, minScore, maxScore)`: Get diary entries by mood score range for a specific user
- `searchEntriesByTitle(userId, title)`: Search diary entries by title for a specific user
- `searchEntriesByContent(userId, content)`: Search diary entries by content for a specific user
- `getEntryCount(userId)`: Get count of diary entries for a specific user
- `getAverageMood(userId)`: Get average mood score for a specific user

### EmotionService

- `getAllEmotions()`: Get all emotions
- `getEmotionById(id)`: Get a specific emotion by ID
- `getEmotionsForDiary(diaryId)`: Get emotions for a specific diary entry
- `createEmotion(emotionData)`: Create a new emotion
- `updateEmotion(id, emotionData)`: Update an existing emotion
- `deleteEmotion(id)`: Delete an emotion

### HealthDataService

- `getAllHealthDataForUser(userId)`: Get all health data for a specific user
- `getAllHealthData()`: Get all health data for the current user
- `getHealthDataById(id)`: Get health data by ID
- `createHealthDataForUser(userId, healthData)`: Create new health data for a specific user
- `createHealthData(healthData)`: Create new health data for the current user
- `updateHealthData(id, healthData)`: Update health data
- `deleteHealthData(id)`: Delete health data
- `findByUserAndDateRange(userId, startDate, endDate)`: Find health data by user and date range

### RecommendationService

- `getRecommendationsForUser(userId)`: Get all recommendations for a specific user
- `getAllRecommendations()`: Get all recommendations for the current user
- `getRecommendationById(id)`: Get a specific recommendation by ID
- `generateRecommendation(userId, diaryEntryId)`: Generate a new recommendation based on diary entries and health data
- `deleteRecommendation(id)`: Delete a recommendation

### UserService

- `getAllUsers()`: Get all users
- `getUserById(id)`: Get a user by ID
- `getProfile()`: Get current user profile
- `updateUser(id, userData)`: Update a user
- `updateProfile(profileData)`: Update current user profile
- `deleteUser(id)`: Delete a user

## Component Updates

Components that use these services might need to be updated to use the new method names and parameters. Here are some examples of how to update components:

### Login Component

```jsx
import { useState } from 'react';
import AuthService from '../services/AuthService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await AuthService.login(username, password);
      window.location.href = '/';
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
```

### Diary Component

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DiaryService from '../services/DiaryService';
import EmotionService from '../services/EmotionService';

const Diary = () => {
  const { id } = useParams();
  const [diary, setDiary] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diaryData = await DiaryService.getEntryById(id);
        setDiary(diaryData);
        
        const emotionsData = await EmotionService.getEmotionsForDiary(id);
        setEmotions(emotionsData);
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load diary entry');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!diary) return <div>Diary entry not found</div>;

  return (
    <div>
      <h1>{diary.title}</h1>
      <p>Date: {new Date(diary.date).toLocaleDateString()}</p>
      <p>Mood: {diary.moodScore}/10</p>
      <div>
        <h2>Emotions:</h2>
        <ul>
          {emotions.map(emotion => (
            <li key={emotion.id}>{emotion.name} - Intensity: {emotion.intensity}/10</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Content:</h2>
        <p>{diary.content}</p>
      </div>
    </div>
  );
};

export default Diary;
```

## Conclusion

By updating the service files to match the backend API endpoints, we've ensured that the frontend can communicate properly with the backend. Components that use these services might need to be updated to use the new method names and parameters, but the overall structure of the application remains the same.