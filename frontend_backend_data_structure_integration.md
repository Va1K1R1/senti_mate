# Frontend-Backend Data Structure Integration

This document describes the implementation of consistent request/response data structures between the frontend and backend of the SentiMate application.

## Overview

To ensure consistent data structures between the frontend and backend, we've implemented model classes in the frontend that match the backend entity structures. These model classes provide methods for converting between frontend and backend formats, while maintaining backward compatibility with existing frontend components.

## Model Classes

### DiaryEntry

The `DiaryEntry` class in the frontend matches the `DiaryEntry` entity in the backend. It includes all the fields from the backend entity, as well as methods for converting between frontend and backend formats.

```javascript
// DiaryEntry.js
class DiaryEntry {
  constructor({
    id = null,
    title = '',
    content = '',
    moodScore = null,
    energyLevel = null,
    stressLevel = null,
    sleepHours = null,
    isPrivate = true,
    createdAt = null,
    updatedAt = null,
    userId = null,
    emotions = [],
    // Legacy fields for backward compatibility
    date = null,
    emotionId = null
  }) {
    // ...
  }

  toBackendFormat() {
    // Convert to backend format
  }

  static fromBackendFormat(backendData) {
    // Convert from backend format
  }

  toLegacyFormat() {
    // Convert to legacy format for backward compatibility
  }
}
```

### Emotion

The `Emotion` class in the frontend matches the `Emotion` entity in the backend. It includes all the fields from the backend entity, as well as methods for converting between frontend and backend formats.

```javascript
// Emotion.js
class Emotion {
  constructor({
    id = null,
    name = '',
    intensity = null,
    description = '',
    colorCode = '',
    createdAt = null,
    diaryEntryId = null,
    // Legacy fields for backward compatibility
    type = null
  }) {
    // ...
  }

  toBackendFormat() {
    // Convert to backend format
  }

  static fromBackendFormat(backendData) {
    // Convert from backend format
  }

  toLegacyFormat() {
    // Convert to legacy format for backward compatibility
  }
}
```

### HealthData

The `HealthData` class in the frontend matches the `HealthData` entity in the backend. It includes all the fields from the backend entity, as well as methods for converting between frontend and backend formats and utility methods for formatting data.

```javascript
// HealthData.js
class HealthData {
  constructor({
    id = null,
    date = null,
    stepCount = null,
    heartRateAvg = null,
    heartRateMin = null,
    heartRateMax = null,
    sleepDurationMinutes = null,
    deepSleepMinutes = null,
    lightSleepMinutes = null,
    remSleepMinutes = null,
    caloriesBurned = null,
    exerciseDurationMinutes = null,
    exerciseType = '',
    dataSource = '',
    syncStatus = '',
    createdAt = null,
    updatedAt = null,
    userId = null
  }) {
    // ...
  }

  toBackendFormat() {
    // Convert to backend format
  }

  static fromBackendFormat(backendData) {
    // Convert from backend format
  }

  getFormattedDate() {
    // Format date for display
  }

  getFormattedSleepDuration() {
    // Format sleep duration for display
  }
}
```

### Recommendation

The `Recommendation` class in the frontend matches the `Recommendation` entity in the backend. It includes all the fields from the backend entity, as well as methods for converting between frontend and backend formats and utility methods for formatting data.

```javascript
// Recommendation.js
class Recommendation {
  constructor({
    id = null,
    title = '',
    content = '',
    category = '',
    priorityLevel = null,
    isRead = false,
    isFavorite = false,
    source = '',
    sourcePrompt = '',
    sourceResponse = '',
    createdAt = null,
    updatedAt = null,
    userId = null
  }) {
    // ...
  }

  toBackendFormat() {
    // Convert to backend format
  }

  static fromBackendFormat(backendData) {
    // Convert from backend format
  }

  getFormattedCreatedAt() {
    // Format creation date for display
  }

  getPriorityText() {
    // Get priority level as text
  }

  getContentPreview(maxLength = 100) {
    // Get a truncated version of the content for previews
  }
}
```

### User

The `User` class in the frontend matches the `User` entity in the backend. It includes all the fields from the backend entity, as well as methods for converting between frontend and backend formats and utility methods for user-related operations.

```javascript
// User.js
class User {
  constructor({
    id = null,
    username = '',
    email = '',
    password = null, // Only used for creating/updating users
    firstName = '',
    lastName = '',
    profilePicture = '',
    isActive = true,
    isEmailVerified = false,
    createdAt = null,
    updatedAt = null,
    roles = []
  }) {
    // ...
  }

  toBackendFormat() {
    // Convert to backend format
  }

  static fromBackendFormat(backendData) {
    // Convert from backend format
  }

  getFullName() {
    // Get full name
  }

  hasRole(roleName) {
    // Check if user has a specific role
  }

  getHighestRole() {
    // Get user's highest role
  }

  getFormattedCreatedAt() {
    // Format creation date for display
  }

  getInitials() {
    // Get user initials for avatar
  }
}
```

## Service Integration

The frontend services have been updated to use these model classes for consistent request/response data structures. Each service method now converts between frontend and backend formats using the appropriate model class.

### DiaryService

```javascript
// DiaryService.js
import DiaryEntry from '../models/DiaryEntry';

const DiaryService = {
  getAllEntries: async (userId) => {
    try {
      const response = await apiService.get(`/api/diary-entries/user/${userId}`);
      // Convert backend data to frontend model
      return response.data.map(entry => DiaryEntry.fromBackendFormat(entry).toLegacyFormat());
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      throw error;
    }
  },

  // Other methods...
};
```

### EmotionService

```javascript
// EmotionService.js
import Emotion from '../models/Emotion';

const EmotionService = {
  getAllEmotions: async (diaryEntryId) => {
    try {
      const response = await apiService.get(`/api/emotions/diary/${diaryEntryId}`);
      // Convert backend data to frontend model
      return response.data.map(emotion => Emotion.fromBackendFormat(emotion).toLegacyFormat());
    } catch (error) {
      console.error(`Error fetching emotions for diary entry ${diaryEntryId}:`, error);
      throw error;
    }
  },

  // Other methods...
};
```

### HealthDataService

```javascript
// HealthDataService.js
import HealthData from '../models/HealthData';

const HealthDataService = {
  getAllHealthData: async (userId) => {
    try {
      const response = await apiService.get(`/api/health-data/user/${userId}`);
      // Convert backend data to frontend model
      return response.data.map(data => HealthData.fromBackendFormat(data));
    } catch (error) {
      console.error('Error fetching health data:', error);
      throw error;
    }
  },

  // Other methods...
};
```

### RecommendationService

```javascript
// RecommendationService.js
import Recommendation from '../models/Recommendation';

const RecommendationService = {
  getAllRecommendations: async (userId) => {
    try {
      const response = await apiService.get(`/api/recommendations/user/${userId}`);
      // Convert backend data to frontend model
      return response.data.map(data => Recommendation.fromBackendFormat(data));
    } catch (error) {
      console.error(`Error fetching recommendations for user ${userId}:`, error);
      throw error;
    }
  },

  // Other methods...
};
```

### UserService

```javascript
// UserService.js
import User from '../models/User';

const UserService = {
  getAllUsers: async () => {
    try {
      const response = await apiService.get('/api/users');
      // Convert backend data to frontend model
      return response.data.map(data => User.fromBackendFormat(data));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Other methods...
};
```

## Backward Compatibility

To maintain backward compatibility with existing frontend components, the model classes include methods for converting to a legacy format. This allows the updated services to work with existing components without requiring changes to those components.

For example, the `DiaryEntry` class includes a `toLegacyFormat()` method that converts the full model to the simplified format used by existing components:

```javascript
toLegacyFormat() {
  return {
    id: this.id,
    date: this.createdAt ? new Date(this.createdAt).getTime() : new Date().getTime(),
    emotionId: this.emotions.length ? this.emotions[0].type : null,
    content: this.content
  };
}
```

## Error Handling

All service methods now include error handling to catch and log any errors that occur during API communication. This helps with debugging and provides a better user experience by allowing the application to handle errors gracefully.

```javascript
try {
  // API call
} catch (error) {
  console.error('Error message:', error);
  throw error;
}
```

## Date/Time Format Consistency

To ensure consistent date/time handling between the frontend and backend, the following approach has been implemented:

1. **Backend Date Formats**:
   - The backend uses `LocalDate` for date fields (e.g., `HealthData.date`)
   - The backend uses `LocalDateTime` for timestamp fields (e.g., `createdAt`, `updatedAt`)

2. **Frontend Date Handling**:
   - Date strings from the backend are parsed into JavaScript `Date` objects when needed
   - Dates are formatted appropriately for display using utility methods in the model classes
   - When sending dates to the backend, they are converted to ISO format strings

3. **Utility Methods**:
   - Each model class includes utility methods for formatting dates for display
   - For example, `getFormattedDate()`, `getFormattedCreatedAt()`, etc.

## Enum Value Consistency

To ensure enum values are consistent between the frontend and backend, the following approach has been implemented:

1. **Role Names**:
   - The backend uses role names like "USER", "MODERATOR", "ADMIN"
   - The frontend `User` class includes the same role hierarchy
   - The `hasRole()` and `getHighestRole()` methods in the `User` class handle role checking

2. **Emotion Types**:
   - The backend uses emotion names
   - The frontend maps between numeric emotion types (1-5) and string names
   - The `Emotion` class includes methods for converting between types and names

3. **Priority Levels**:
   - The backend uses numeric priority levels
   - The frontend `Recommendation` class includes a mapping between numeric levels and text descriptions
   - The `getPriorityText()` method converts numeric levels to human-readable text

## Next Steps

1. Test all API endpoints with the updated services to ensure proper integration
2. Create unit tests for model conversion methods to verify data integrity
3. Update frontend components to use the full model classes instead of the legacy format, where appropriate
4. Add more comprehensive error handling and user feedback for API errors
