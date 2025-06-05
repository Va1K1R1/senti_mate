# API Endpoint Mismatches Between Frontend and Backend

This document outlines the mismatches between the frontend service expectations and the backend API endpoints in the SentiMate project.

## Authentication

### Frontend Expectations (AuthService.js)
- POST `/auth/login` - Login with email and password
- POST `/auth/register` - Register a new user

### Backend Implementation (AuthController.java)
- POST `/api/auth/login` - Login with username and password
- POST `/api/auth/register` - Register a new user

### Mismatches
1. The frontend uses `/auth/...` while the backend uses `/api/auth/...`
2. The frontend expects to login with email, but the backend expects username

## Diary Entries

### Frontend Expectations (DiaryService.js)
- GET `/diary` - Get all diary entries
- GET `/diary/{id}` - Get a specific diary entry by ID
- POST `/diary` - Create a new diary entry
- PUT `/diary/{id}` - Update an existing diary entry
- DELETE `/diary/{id}` - Delete a diary entry
- GET `/diary/range?start={startDate}&end={endDate}` - Get diary entries by date range

### Backend Implementation (DiaryEntryController.java)
- GET `/api/diary-entries/user/{userId}` - Get all diary entries for a user
- GET `/api/diary-entries/{id}` - Get a specific diary entry by ID
- POST `/api/diary-entries/user/{userId}` - Create a new diary entry
- PUT `/api/diary-entries/{id}` - Update an existing diary entry
- DELETE `/api/diary-entries/{id}` - Delete a diary entry
- GET `/api/diary-entries/user/{userId}/filter/date` - Filter diary entries by date range

### Mismatches
1. The frontend uses `/diary` while the backend uses `/api/diary-entries`
2. The backend requires a user ID for many endpoints, but the frontend doesn't include it
3. The date range endpoint has different paths and parameter names

## Emotions

### Frontend Expectations (EmotionService.js)
- GET `/emotions` - Get all emotions
- GET `/emotions/{id}` - Get a specific emotion by ID
- POST `/emotions/analyze` - Analyze text to detect emotions
- GET `/emotions/stats?start={startDate}&end={endDate}` - Get emotion statistics for a date range

### Backend Implementation (EmotionController.java)
- GET `/api/emotions/diary/{diaryEntryId}` - Get all emotions for a diary entry
- GET `/api/emotions/{id}` - Get a specific emotion by ID
- POST `/api/emotions/diary/{diaryEntryId}` - Create a new emotion for a diary entry
- GET `/api/emotions/user/{userId}/most-common` - Get most common emotions for a user
- GET `/api/emotions/user/{userId}/average-intensity` - Get average intensity by emotion for a user

### Mismatches
1. The frontend uses `/emotions` while the backend uses `/api/emotions`
2. The backend organizes emotions by diary entry, but the frontend doesn't include this relationship
3. The backend doesn't have a text analysis endpoint, but the frontend expects one
4. The stats endpoint in the frontend doesn't match any backend endpoint

## Health Data

### Frontend Expectations (HealthDataService.js)
- GET `/health-data` - Get all health data for the current user
- GET `/health-data/type/{type}` - Get health data by type
- GET `/health-data/range?start={startDate}&end={endDate}` - Get health data by date range
- POST `/health-data/sync` - Sync health data from Samsung Health
- GET `/health-data/stats/{type}?start={startDate}&end={endDate}` - Get health data statistics

### Backend Implementation (HealthDataController.java)
- GET `/api/health-data/user/{userId}` - Get all health data for a user
- GET `/api/health-data/{id}` - Get health data by ID
- GET `/api/health-data/user/{userId}/date-range` - Find health data for a user in a date range
- POST `/api/health-data/samsung/sync` - Manually sync Samsung Health data
- GET `/api/health-data/user/{userId}/average-steps` - Get average step count
- GET `/api/health-data/user/{userId}/average-heart-rate` - Get average heart rate
- GET `/api/health-data/user/{userId}/average-sleep` - Get average sleep duration

### Mismatches
1. The frontend uses `/health-data` while the backend uses `/api/health-data`
2. The backend requires a user ID for many endpoints, but the frontend doesn't include it
3. The backend doesn't have a type-based endpoint, but the frontend expects one
4. The sync endpoint has a different path in the backend
5. The stats endpoint in the frontend doesn't match any backend endpoint, though there are specific average endpoints

## Recommendations

### Frontend Expectations (RecommendationService.js)
- GET `/recommendations` - Get all recommendations for the current user
- GET `/recommendations/{id}` - Get a specific recommendation by ID
- GET `/recommendations/type/{type}` - Get recommendations by type
- POST `/recommendations/generate` - Generate a new recommendation
- PUT `/recommendations/{id}/read` - Mark a recommendation as read
- PUT `/recommendations/{id}/helpful` - Mark a recommendation as helpful

### Backend Implementation (RecommendationController.java)
- GET `/api/recommendations/user/{userId}` - Get all recommendations for a user
- GET `/api/recommendations/{id}` - Get a recommendation by ID
- GET `/api/recommendations/user/{userId}/category/{category}` - Find recommendations by category
- POST `/api/recommendations/generate` - Generate recommendations using ChatGPT
- PATCH `/api/recommendations/{id}/mark-read` - Mark a recommendation as read
- PATCH `/api/recommendations/{id}/toggle-favorite` - Toggle favorite status

### Mismatches
1. The frontend uses `/recommendations` while the backend uses `/api/recommendations`
2. The backend requires a user ID for many endpoints, but the frontend doesn't include it
3. The backend uses "category" while the frontend uses "type"
4. The backend uses PATCH for marking as read, while the frontend uses PUT
5. The backend doesn't have a "helpful" endpoint, but has a "toggle-favorite" endpoint instead

## User Management

### Frontend Expectations (UserService.js)
- GET `/users/profile` - Get current user profile
- PUT `/users/profile` - Update user profile
- POST `/users/change-password` - Change user password

### Backend Implementation (UserController.java)
- GET `/api/users/{id}` - Get a user by ID
- PUT `/api/users/{id}` - Update a user
- GET `/api/users/username/{username}` - Get a user by username
- GET `/api/users/email/{email}` - Get a user by email
- PATCH `/api/users/{id}/active` - Update the active status of a user
- PATCH `/api/users/{id}/verify-email` - Verify the email of a user

### Mismatches
1. The frontend uses `/users/profile` while the backend uses `/api/users/{id}`
2. The backend doesn't have a specific profile endpoint
3. The backend doesn't have a change-password endpoint

## Summary of Common Issues

1. **Path Prefix**: The frontend omits the `/api` prefix that the backend uses, though this might be handled by the apiService.js configuration.
2. **User ID Requirement**: Many backend endpoints require a user ID, but the frontend doesn't include it in the requests.
3. **Missing Endpoints**: Several endpoints expected by the frontend are not implemented in the backend.
4. **Different HTTP Methods**: Some endpoints use different HTTP methods between frontend and backend.
5. **Different Parameter Names**: Some endpoints use different parameter names or structures.
6. **Different Resource Names**: The frontend and backend sometimes use different names for the same resources (e.g., "type" vs "category").