# Frontend API Integration

This document summarizes the changes made to align the frontend API service URLs with the backend controller endpoints.

## Overview

The frontend API services were updated to match the backend controller endpoints. This ensures proper communication between the frontend and backend components of the SentiMate application.

## Changes Made

### Base URL

All API service URLs now include the `/api` prefix to match the backend controller base paths.

### DiaryService.js

- Updated base path from `/diary` to `/api/diary-entries`
- Updated endpoints to include the user ID where required
- Updated method signatures to include the user ID parameter where required
- Updated the date range endpoint to match the backend controller endpoint

### EmotionService.js

- Updated base path from `/emotions` to `/api/emotions`
- Updated the `getAllEmotions` method to get emotions for a specific diary entry
- Added new methods for creating, updating, and deleting emotions
- Added methods for getting most common emotions and average intensity by emotion for a user
- Removed methods that don't have corresponding endpoints in the backend

### AuthService.js

- Updated base path from `/auth` to `/api/auth`
- Updated the login method to use `username` instead of `email` to match the backend controller

### UserService.js

- Updated base path from `/users` to `/api/users`
- Completely replaced the methods with new ones that match the backend controller endpoints
- Added methods for getting all users, getting a user by ID, creating a user, updating a user, deleting a user, getting a user by username, getting a user by email, updating user active status, and verifying user email

### HealthDataService.js

- Updated base path from `/health-data` to `/api/health-data`
- Updated all methods to include the user ID parameter where required
- Added new methods for getting health data by ID, getting health data for a user on a specific date, creating or updating health data, deleting health data, getting average step count, getting average heart rate, getting average sleep duration, getting Samsung Health authorization URL, and manually syncing Samsung Health data
- Removed methods that don't have corresponding endpoints in the backend

### RecommendationService.js

- Updated base path from `/recommendations` to `/api/recommendations`
- Updated all methods to include the user ID parameter where required
- Added new methods for getting recommendations by read status, getting recommendations by favorite status, getting recommendations by category, creating a recommendation, updating a recommendation, marking a recommendation as unread, toggling the favorite status of a recommendation, deleting a recommendation, generating recommendations using ChatGPT, and analyzing sentiment of a diary entry
- Updated the `markAsRead` method to use PATCH instead of PUT
- Removed methods that don't have corresponding endpoints in the backend

## Implementation Approach

The approach taken was to update the frontend service files to match the backend controller endpoints, rather than creating an adapter layer in the backend. This approach has several advantages:

1. **Direct Integration**: The frontend now communicates directly with the backend endpoints without any intermediate layer.
2. **Simplified Architecture**: No additional adapter layer is needed, simplifying the overall architecture.
3. **Improved Performance**: Direct API calls without an adapter layer can improve performance.
4. **Better Maintainability**: The frontend services now accurately reflect the backend API structure, making it easier to maintain and update.

## Next Steps

1. Test the updated API services to ensure proper integration with the backend
2. Update any components that use these services to pass the required parameters
3. Implement error handling for API communication
4. Verify that all functionality works as expected