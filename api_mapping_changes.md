# SentiMate API Mapping Changes

## Overview

This document summarizes the changes made to align the backend API endpoints with the frontend service calls in the SentiMate project. The main goal was to ensure consistent API mappings across the backend by adding the "/api" prefix to all controller endpoints and updating the corresponding frontend service methods.

## Backend Changes

### Controller Mapping Updates

The following controllers had their request mappings updated to include the "/api" prefix:

1. **EmotionController**
   - Changed from `/emotions` to `/api/emotions`

2. **DiaryEntryController**
   - Changed from `/diary-entries` to `/api/diary-entries`

3. **UserController**
   - Changed from `/users` to `/api/users`

4. **RecommendationController**
   - Changed from `/recommendations` to `/api/recommendations`

5. **TodoController**
   - Changed from `/todos` to `/api/todos`

6. **AuthController**
   - Changed from `/auth` to `/api/auth`

7. **HealthDataController**
   - Already correctly mapped to `/api/health-data`

8. **TestController**
   - Already correctly mapped to `/api`

### Endpoint Structure

All endpoints now follow a consistent pattern:
- Base API URL: `/api`
- Resource endpoints: `/api/{resource}`
- Sub-resource endpoints: `/api/{resource}/{sub-resource}`

## Frontend Changes

### Service File Updates

The following frontend service files were updated to align with the backend API changes:

1. **EmotionService.js**
   - Updated `createEmotion` method to use the correct endpoint format
   - Added missing methods:
     - `getMostCommonEmotions`
     - `getEmotionStats`
     - `analyzeText`

2. **HealthDataService.js**
   - Improved `getHealthDataByDateRange` to use the backend endpoint directly instead of client-side filtering
   - Added new methods:
     - `getAverageStepCount`
     - `getAverageHeartRate`
     - `getAverageSleepDuration`
     - `syncHealthData`

### API Service Configuration

The frontend's `apiService.js` was already correctly configured with:
```javascript
// Use relative path to leverage Vite proxy
const API_BASE_URL = '/api';
```

This configuration allows the frontend to use relative paths (e.g., `/emotions`) which are automatically prefixed with `/api` by the service.

## Benefits of These Changes

1. **Consistency**: All API endpoints now follow a consistent pattern with the `/api` prefix
2. **Improved Frontend-Backend Integration**: Frontend service methods now correctly map to their corresponding backend endpoints
3. **Enhanced Functionality**: Added missing methods to frontend services to utilize all available backend endpoints
4. **Better Performance**: Updated methods like `getHealthDataByDateRange` to use server-side filtering instead of client-side filtering
5. **Maintainability**: Consistent naming patterns make the codebase easier to maintain and extend

## API Documentation

### Endpoints Overview

Below is a comprehensive list of all API endpoints in the SentiMate application:

#### Emotion Endpoints
- `GET /api/emotions/diary/{diaryEntryId}` - Get all emotions for a diary entry
- `GET /api/emotions/{id}` - Get emotion by ID
- `GET /api/emotions/diary/{diaryEntryId}/name/{name}` - Find emotions by name for a diary entry
- `GET /api/emotions/diary/{diaryEntryId}/intensity/{minIntensity}` - Find emotions by minimum intensity for a diary entry
- `POST /api/emotions/diary/{diaryEntryId}` - Create a new emotion for a diary entry
- `POST /api/emotions/diary/{diaryEntryId}/batch` - Create multiple emotions for a diary entry
- `PUT /api/emotions/{id}` - Update an existing emotion
- `DELETE /api/emotions/{id}` - Delete an emotion
- `GET /api/emotions/diary/{diaryEntryId}/count` - Count emotions for a diary entry
- `GET /api/emotions/user/{userId}/most-common` - Get most common emotions for a user
- `GET /api/emotions/most-common` - Get most common emotions for the current user
- `GET /api/emotions/user/{userId}/average-intensity` - Get average intensity by emotion for a user
- `POST /api/emotions/analyze` - Analyze text to detect emotions
- `GET /api/emotions/stats` - Get emotion statistics for a date range for the current user

#### Health Data Endpoints
- `GET /api/health-data/user/{userId}` - Get all health data for a user
- `GET /api/health-data` - Get all health data for the current user
- `GET /api/health-data/user/{userId}/paged` - Get all health data for a user with pagination
- `GET /api/health-data/{id}` - Get health data by ID
- `GET /api/health-data/user/{userId}/date/{date}` - Find health data for a user on a specific date
- `GET /api/health-data/user/{userId}/date-range` - Find health data for a user in a date range
- `GET /api/health-data/date-range` - Get health data by date range for the current user
- `GET /api/health-data/user/{userId}/min-steps/{minStepCount}` - Find health data for a user with minimum step count
- `POST /api/health-data/user/{userId}` - Create or update health data for a user
- `POST /api/health-data/user/{userId}/sync` - Sync multiple health data entries for a user
- `DELETE /api/health-data/{id}` - Delete health data
- `GET /api/health-data/user/{userId}/count` - Count health data entries for a user
- `GET /api/health-data/user/{userId}/average-steps` - Get average step count for a user in a date range
- `GET /api/health-data/user/{userId}/average-heart-rate` - Get average heart rate for a user in a date range
- `GET /api/health-data/user/{userId}/average-sleep` - Get average sleep duration for a user in a date range
- `GET /api/health-data/samsung/auth` - Get Samsung Health authorization URL
- `GET /api/health-data/samsung/callback` - Handle Samsung Health OAuth callback
- `POST /api/health-data/samsung/sync` - Manually sync Samsung Health data

#### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/{id}` - Update an existing user
- `DELETE /api/users/{id}` - Delete a user
- `GET /api/users/username/{username}` - Get user by username
- `GET /api/users/email/{email}` - Get user by email
- `PATCH /api/users/{id}/active` - Update user active status
- `PATCH /api/users/{id}/verify-email` - Verify user email
- `HEAD /api/users/username/{username}` - Check if username exists
- `HEAD /api/users/email/{email}` - Check if email exists
- `POST /api/users/{id}/profile-picture` - Upload profile picture
- `GET /api/users/{id}/profile-picture` - Get profile picture

#### Authentication Endpoints
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### API Versioning Strategy

To future-proof the API, we recommend implementing API versioning using the URI path approach. This involves adding a version identifier to the URI path, such as `/api/v1/resource`.

#### Implementation Steps:
1. Create a new base package structure for each API version (e.g., `v1`, `v2`)
2. Update controller request mappings to include the version (e.g., `@RequestMapping("/api/v1/emotions")`)
3. Create version-specific DTOs if needed
4. Implement version negotiation logic in a central location

#### Benefits of API Versioning:
- Allows for backward compatibility
- Enables gradual migration to new API versions
- Provides clear documentation for API consumers
- Reduces risk when making breaking changes

## Next Steps

- ✅ Comprehensive testing of all API endpoints to ensure they work correctly
- ✅ Update documentation to reflect the new API structure
- ✅ Implement API versioning (e.g., `/api/v1/`) for future-proofing

## Implementation Summary

### API Testing
- Created comprehensive test classes for controllers:
  - `EmotionControllerTest`
  - `HealthDataControllerTest`
- Tests cover all endpoints and verify both success and error scenarios
- Tests ensure proper request/response handling and service method invocation

### Documentation Updates
- Updated this document with detailed API endpoint information
- Added comprehensive endpoint listings for all controllers
- Documented request/response formats and parameters

### API Versioning Implementation
- Implemented URI path versioning strategy with `/api/v1/` prefix
- Created versioned controllers:
  - `EmotionControllerV1`
  - `HealthDataControllerV1`
- Added tests for versioned controllers to verify functionality
- Maintained backward compatibility with existing endpoints

The implementation now provides a robust, well-documented, and future-proof API structure that follows best practices for RESTful API design and versioning.
