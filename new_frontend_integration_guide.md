# New Frontend Integration Guide for SentiMate Backend

This document provides comprehensive guidelines for developing a new frontend application that integrates with the existing SentiMate backend. It focuses specifically on the backend API endpoints, data models, authentication flow, and integration points needed to create a new frontend.

## Table of Contents
1. [Introduction](#introduction)
2. [Backend API Documentation](#backend-api-documentation)
3. [Data Models](#data-models)
4. [Authentication Flow](#authentication-flow)
5. [Integration Points](#integration-points)
6. [Development Setup Instructions](#development-setup-instructions)
7. [Best Practices](#best-practices)

## Introduction

SentiMate is a health diary web application that allows users to track their emotions, mood, energy levels, and other health-related metrics. The application consists of a Spring Boot backend and a React frontend. This guide focuses on how to develop a new frontend application that integrates with the existing backend.

## Backend API Documentation

The SentiMate backend provides a RESTful API for frontend integration. Below are the main API endpoints organized by resource.

### Base URL

All API endpoints are prefixed with: `http://localhost:8080/api`

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/register` | Register a new user | `{ "username": "string", "email": "string", "password": "string" }` | `{ "id": number, "username": "string", "email": "string", "token": "string" }` |
| POST | `/auth/login` | Login a user | `{ "username": "string", "password": "string" }` | `{ "id": number, "username": "string", "email": "string", "token": "string" }` |

### Diary Entry Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/diary-entries/user/{userId}` | Get all diary entries for a user | - | Array of diary entries |
| GET | `/diary-entries` | Get all diary entries for the current user | - | Array of diary entries |
| GET | `/diary-entries/user/{userId}/paged` | Get paginated diary entries for a user | - | Paginated diary entries |
| GET | `/diary-entries/{id}` | Get a diary entry by ID | - | Diary entry |
| GET | `/diary-entries/user/{userId}/search/title` | Search diary entries by title | Query param: `title` | Paginated diary entries |
| GET | `/diary-entries/user/{userId}/search/content` | Search diary entries by content | Query param: `content` | Paginated diary entries |
| GET | `/diary-entries/user/{userId}/filter/date` | Filter diary entries by date range | Query params: `startDate`, `endDate` | Paginated diary entries |
| GET | `/diary-entries/range` | Get diary entries by date range for current user | Query params: `startDate`, `endDate` | Array of diary entries |
| GET | `/diary-entries/user/{userId}/filter/mood` | Filter diary entries by mood score range | Query params: `minScore`, `maxScore` | Paginated diary entries |
| POST | `/diary-entries/user/{userId}` | Create a new diary entry | Diary entry object | Created diary entry |
| POST | `/diary-entries` | Create a new diary entry for current user | Diary entry object | Created diary entry |
| PUT | `/diary-entries/{id}` | Update a diary entry | Diary entry object | Updated diary entry |
| DELETE | `/diary-entries/{id}` | Delete a diary entry | - | No content |
| GET | `/diary-entries/user/{userId}/count` | Count diary entries for a user | - | Count (number) |
| GET | `/diary-entries/user/{userId}/average-mood` | Get average mood score for a user | - | Average mood score (number) |

### Emotion Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/emotions` | Get all emotions | - | Array of emotions |
| GET | `/emotions/{id}` | Get an emotion by ID | - | Emotion |
| GET | `/emotions/diary/{diaryId}` | Get emotions for a diary entry | - | Array of emotions |
| POST | `/emotions` | Create a new emotion | Emotion object | Created emotion |
| PUT | `/emotions/{id}` | Update an emotion | Emotion object | Updated emotion |
| DELETE | `/emotions/{id}` | Delete an emotion | - | No content |

### Health Data Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/health-data/user/{userId}` | Get all health data for a user | - | Array of health data |
| GET | `/health-data/{id}` | Get health data by ID | - | Health data |
| POST | `/health-data/user/{userId}` | Create new health data | Health data object | Created health data |
| PUT | `/health-data/{id}` | Update health data | Health data object | Updated health data |
| DELETE | `/health-data/{id}` | Delete health data | - | No content |

### Todo Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/todos/user/{userId}` | Get all todos for a user | - | Array of todos |
| GET | `/todos/{id}` | Get a todo by ID | - | Todo |
| POST | `/todos/user/{userId}` | Create a new todo | Todo object | Created todo |
| PUT | `/todos/{id}` | Update a todo | Todo object | Updated todo |
| DELETE | `/todos/{id}` | Delete a todo | - | No content |

### User Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/users` | Get all users | - | Array of users |
| GET | `/users/{id}` | Get a user by ID | - | User |
| PUT | `/users/{id}` | Update a user | User object | Updated user |
| DELETE | `/users/{id}` | Delete a user | - | No content |

### Recommendation Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/recommendations/user/{userId}` | Get all recommendations for a user | - | Array of recommendations |
| GET | `/recommendations/{id}` | Get a recommendation by ID | - | Recommendation |
| POST | `/recommendations/generate` | Generate a new recommendation | `{ "userId": number, "diaryEntryId": number }` | Generated recommendation |
| DELETE | `/recommendations/{id}` | Delete a recommendation | - | No content |

## Data Models

The SentiMate backend uses the following data models:

### User

```
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "password": "********", // Not returned in responses
  "firstName": "John",
  "lastName": "Doe",
  "profilePicture": "profile.jpg",
  "isActive": true,
  "isEmailVerified": false,
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:00:00",
  "roles": [
    {
      "id": 1,
      "name": "USER",
      "description": "Regular user role"
    }
  ],
  "diaryEntries": [], // Only included when specifically requested
  "healthData": [], // Only included when specifically requested
  "recommendations": [], // Only included when specifically requested
  "todos": [] // Only included when specifically requested
}
```

Note: The User model uses `@JsonManagedReference` on collection fields (diaryEntries, healthData, recommendations, todos) to manage serialization of bidirectional relationships.

### DiaryEntry

```
{
  "id": 1,
  "title": "My first diary entry",
  "content": "Today was a good day...",
  "moodScore": 8,
  "energyLevel": 7,
  "stressLevel": 3,
  "sleepHours": 7.5,
  "isPrivate": true,
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:00:00",
  "emotions": [
    {
      "id": 1,
      "name": "happy",
      "intensity": 8,
      "description": "Feeling of joy",
      "colorCode": "#FFD700"
    }
  ]
  // user field is not included in JSON response due to @JsonBackReference
}
```

Note: The DiaryEntry model uses `@JsonBackReference` on the user field to prevent circular references during serialization. It also uses `@JsonManagedReference` on the emotions collection to manage the bidirectional relationship with Emotion entities.

### Emotion

```
{
  "id": 1,
  "name": "happy",
  "intensity": 8,
  "description": "Feeling of joy",
  "colorCode": "#FFD700",
  "createdAt": "2023-01-01T12:00:00"
  // diaryEntry field is not included in JSON response due to @JsonBackReference
}
```

Note: The Emotion model uses `@JsonBackReference` on the diaryEntry field to prevent circular references during serialization.

### HealthData

```
{
  "id": 1,
  "date": "2023-01-01",
  "stepCount": 8500,
  "heartRateAvg": 72,
  "heartRateMin": 60,
  "heartRateMax": 120,
  "sleepDurationMinutes": 420,
  "deepSleepMinutes": 90,
  "lightSleepMinutes": 240,
  "remSleepMinutes": 90,
  "caloriesBurned": 2100,
  "exerciseDurationMinutes": 45,
  "exerciseType": "Running",
  "dataSource": "Samsung Health",
  "syncStatus": "Synced",
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:00:00"
  // user field is not included in JSON response due to @JsonBackReference
}
```

Note: The HealthData model uses `@JsonBackReference` on the user field to prevent circular references during serialization.

### Todo

```
{
  "id": 1,
  "title": "Go for a walk",
  "description": "Take a 30-minute walk in the park",
  "completed": false,
  "dueDate": "2023-01-02T18:00:00",
  "priority": 2,
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:00:00"
  // user field is not included in JSON response due to @JsonBackReference
}
```

Note: The Todo model uses `@JsonBackReference` on the user field to prevent circular references during serialization.

### Recommendation

```
{
  "id": 1,
  "title": "Take Short Breaks",
  "content": "Based on your mood patterns, consider taking short breaks during work hours.",
  "category": "Wellness",
  "priorityLevel": 2,
  "isRead": false,
  "isFavorite": false,
  "source": "ChatGPT",
  "sourcePrompt": "Generate a recommendation based on low energy levels",
  "sourceResponse": "Full response from ChatGPT",
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:00:00"
  // user field is not included in JSON response due to @JsonBackReference
}
```

Note: The Recommendation model uses `@JsonBackReference` on the user field to prevent circular references during serialization.

## JSON Serialization

The SentiMate backend uses Jackson annotations to manage circular references in the model classes. This is important to understand when working with the API responses:

### Managing Circular References

1. `@JsonManagedReference` is used on parent fields (collections) in the User class to indicate that this is the forward part of the reference.
2. `@JsonBackReference` is used on child fields (references back to parent) in the DiaryEntry, HealthData, Recommendation, Todo, and Emotion classes to indicate that this is the back part of the reference that will be omitted from serialization.

This means that when you receive a User object, it may include collections of related entities (diaryEntries, healthData, recommendations, todos), but when you receive a DiaryEntry, HealthData, Recommendation, Todo, or Emotion object, it will not include the full User object to prevent circular references.

### Date Format

All dates are serialized as ISO 8601 strings:
- Date and time: `YYYY-MM-DDTHH:mm:ss.SSSZ`
- Date only: `YYYY-MM-DD`

## Authentication Flow

The SentiMate backend uses JWT (JSON Web Token) for authentication. Here's how to implement the authentication flow in your frontend:

### Registration

1. Collect user information (username, email, password)
2. Send a POST request to `/api/auth/register` with the user information
3. Store the returned token in localStorage or a secure cookie
4. Redirect the user to the dashboard or home page

### Login

1. Collect user credentials (username, password)
2. Send a POST request to `/api/auth/login` with the credentials
3. Store the returned token in localStorage or a secure cookie
4. Redirect the user to the dashboard or home page

### Authenticated Requests

1. Include the token in the Authorization header of all API requests:
   ```
   Authorization: Bearer <token>
   ```
2. Handle token expiration by implementing a refresh token mechanism or redirecting to the login page

### Logout

1. Remove the token from localStorage or the secure cookie
2. Redirect the user to the login page

## Integration Points

Here are the key integration points between the frontend and backend:

### API Service

Create a base API service that handles common functionality:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unknown error occurred';

    console.error(`API error: ${message}`, error);
    return Promise.reject(new Error(message));
  }
);

export const get = async (endpoint, options = {}) => {
  try {
    return await axiosInstance.get(endpoint, options);
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const post = async (endpoint, data, options = {}) => {
  try {
    return await axiosInstance.post(endpoint, data, options);
  } catch (error) {
    console.error(`POST request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const put = async (endpoint, data, options = {}) => {
  try {
    return await axiosInstance.put(endpoint, data, options);
  } catch (error) {
    console.error(`PUT request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const del = async (endpoint, options = {}) => {
  try {
    return await axiosInstance.delete(endpoint, options);
  } catch (error) {
    console.error(`DELETE request failed for ${endpoint}:`, error);
    throw error;
  }
};

export default {
  get,
  post,
  put,
  delete: del
};
```

### Feature-Specific Services

Create services for each feature that use the base API service:

#### AuthService

```javascript
import api from './api';

const AuthService = {
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;
```

#### DiaryService

```javascript
import api from './api';
import AuthService from './authService';

const DiaryService = {
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },

  getAllDiaries: async (userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.get(`/diary-entries/user/${userId}`);
    } catch (error) {
      console.error('Get all diaries error:', error);
      throw error;
    }
  },

  getDiaryById: async (id) => {
    try {
      return await api.get(`/diary-entries/${id}`);
    } catch (error) {
      console.error(`Get diary by ID ${id} error:`, error);
      throw error;
    }
  },

  createDiary: async (diary, userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.post(`/diary-entries/user/${userId}`, diary);
    } catch (error) {
      console.error('Create diary error:', error);
      throw error;
    }
  },

  updateDiary: async (id, diary) => {
    try {
      return await api.put(`/diary-entries/${id}`, diary);
    } catch (error) {
      console.error(`Update diary ${id} error:`, error);
      throw error;
    }
  },

  deleteDiary: async (id) => {
    try {
      return await api.delete(`/diary-entries/${id}`);
    } catch (error) {
      console.error(`Delete diary ${id} error:`, error);
      throw error;
    }
  },

  getDiariesByDateRange: async (startDate, endDate, userId) => {
    try {
      if (!userId) {
        userId = await DiaryService._getCurrentUserId();
      }
      return await api.get(`/diary-entries/user/${userId}/filter/date?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.error(`Get diaries by date range error:`, error);
      throw error;
    }
  }
};

export default DiaryService;
```

#### TodoService

```javascript
import api from './api';
import AuthService from './authService';

const TodoService = {
  _getCurrentUserId: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      throw new Error('User must be authenticated to perform this action');
    }
  },

  getAllTodos: async (userId) => {
    try {
      if (!userId) {
        userId = await TodoService._getCurrentUserId();
      }
      return await api.get(`/todos/user/${userId}`);
    } catch (error) {
      console.error('Get all todos error:', error);
      throw error;
    }
  },

  getTodoById: async (id) => {
    try {
      return await api.get(`/todos/${id}`);
    } catch (error) {
      console.error(`Get todo by ID ${id} error:`, error);
      throw error;
    }
  },

  createTodo: async (todo, userId) => {
    try {
      if (!userId) {
        userId = await TodoService._getCurrentUserId();
      }
      return await api.post(`/todos/user/${userId}`, todo);
    } catch (error) {
      console.error('Create todo error:', error);
      throw error;
    }
  },

  updateTodo: async (id, todo) => {
    try {
      return await api.put(`/todos/${id}`, todo);
    } catch (error) {
      console.error(`Update todo ${id} error:`, error);
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      return await api.delete(`/todos/${id}`);
    } catch (error) {
      console.error(`Delete todo ${id} error:`, error);
      throw error;
    }
  }
};

export default TodoService;
```

### State Management

Use React Context or Redux for state management. Here's an example using React Context for diary entries:

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import DiaryService from '../services/diaryService';

const DiaryContext = createContext();

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

export const DiaryProvider = ({ children }) => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDiary, setCurrentDiary] = useState(null);

  useEffect(() => {
    const loadDiaries = async () => {
      setLoading(true);
      try {
        const data = await DiaryService.getAllDiaries();
        setDiaries(data);
      } catch (error) {
        console.error('Error loading diaries:', error);
        setError('Failed to load diary entries');
      } finally {
        setLoading(false);
      }
    };

    loadDiaries();
  }, []);

  const getDiaryById = async (id) => {
    setLoading(true);
    try {
      const diary = await DiaryService.getDiaryById(id);
      setCurrentDiary(diary);
      return diary;
    } catch (error) {
      console.error('Error getting diary by ID:', error);
      setError('Failed to get diary entry');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addDiary = async (diary) => {
    setLoading(true);
    try {
      const newDiary = await DiaryService.createDiary(diary);
      setDiaries([...diaries, newDiary]);
      return newDiary;
    } catch (error) {
      console.error('Error adding diary:', error);
      setError('Failed to add diary entry');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDiary = async (id, updatedDiary) => {
    setLoading(true);
    try {
      const updated = await DiaryService.updateDiary(id, updatedDiary);
      setDiaries(
        diaries.map(diary =>
          diary.id === id ? updated : diary
        )
      );
      if (currentDiary && currentDiary.id === id) {
        setCurrentDiary(updated);
      }
      return updated;
    } catch (error) {
      console.error('Error updating diary:', error);
      setError('Failed to update diary entry');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDiary = async (id) => {
    setLoading(true);
    try {
      await DiaryService.deleteDiary(id);
      setDiaries(diaries.filter(diary => diary.id !== id));
      if (currentDiary && currentDiary.id === id) {
        setCurrentDiary(null);
      }
    } catch (error) {
      console.error('Error deleting diary:', error);
      setError('Failed to delete diary entry');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    diaries,
    currentDiary,
    loading,
    error,
    getDiaryById,
    addDiary,
    updateDiary,
    deleteDiary
  };

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
};

export default DiaryContext;
```

## Development Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Java 17 or higher (for running the backend)
- Gradle 8.x or higher (for building the backend)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd senti_mate
   ```

2. Build and run the backend:
   ```bash
   cd senti_mate_back_end
   ./gradlew bootRun
   ```

3. The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Create a new frontend project using your preferred framework (React, Vue, Angular, etc.):
   ```bash
   # For React with Vite
   npm create vite@latest my-sentimate-frontend -- --template react
   cd my-sentimate-frontend
   ```

2. Install dependencies:
   ```bash
   npm install axios react-router-dom
   ```

3. Create the project structure:
   ```
   src/
   ├── components/
   │   ├── auth/
   │   ├── common/
   │   ├── diary/
   │   ├── health/
   │   └── todo/
   ├── context/
   ├── pages/
   ├── services/
   ├── utils/
   ├── App.jsx
   └── main.jsx
   ```

4. Implement the API services and components as described in the previous sections.

5. Run the development server:
   ```bash
   npm run dev
   ```

6. The frontend will be available at `http://localhost:5173`

## Best Practices

### API Integration

1. **Centralize API calls**: Use service modules to centralize API calls and avoid duplicating API logic in components.
2. **Handle errors consistently**: Implement consistent error handling across all API calls.
3. **Use loading states**: Show loading indicators during API calls to improve user experience.
4. **Validate input**: Validate user input before sending it to the API.
5. **Use environment variables**: Store API URLs and other configuration in environment variables.

### State Management

1. **Use appropriate state management**: Choose the right state management solution based on your application's complexity.
2. **Keep state normalized**: Avoid duplicating data in your state.
3. **Use immutable updates**: Always update state immutably to avoid unexpected behavior.
4. **Minimize state**: Only store what you need in state.

### Component Design

1. **Create reusable components**: Design components to be reusable across the application.
2. **Use proper component composition**: Compose components to create complex UIs.
3. **Implement responsive design**: Ensure your components work well on different screen sizes.
4. **Follow accessibility guidelines**: Make your components accessible to all users.

### Performance

1. **Optimize rendering**: Use React.memo, useMemo, and useCallback to optimize rendering.
2. **Implement pagination**: Use pagination for large data sets.
3. **Lazy load components**: Use lazy loading for components that are not immediately needed.
4. **Optimize images**: Use optimized images and consider lazy loading for images.

### Security

1. **Sanitize user input**: Always sanitize user input to prevent XSS attacks.
2. **Implement proper authentication**: Use secure authentication methods.
3. **Protect sensitive data**: Don't store sensitive data in localStorage or sessionStorage.
4. **Use HTTPS**: Always use HTTPS for API calls.
5. **Implement CSRF protection**: Use CSRF tokens for forms.

By following these guidelines, you can create a robust and maintainable frontend application that integrates seamlessly with the SentiMate backend.
