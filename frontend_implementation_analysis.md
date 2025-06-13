# SentiMate Frontend Implementation Analysis

## Overview

This document provides an analysis of the current frontend implementation of SentiMate, identifying unimplemented features (excluding external APIs) and suggesting implementation directions. The analysis is based on a comparison between the backend API documentation in `new_frontend_integration_guide.md` and the current frontend implementation.

## Project Structure

The SentiMate project consists of the following main components:

1. `senti_mate_back_end` - The Spring Boot backend
2. `senti_mate_front_end` - The current React frontend
3. `new_senti_mate_front_end` - A new React frontend implementation

## Implemented Features

The current frontend (`senti_mate_front_end`) has implemented most of the features described in the backend API documentation:

1. **Authentication** - Login, registration, and password recovery
2. **Diary Entries** - Creating, reading, updating, and deleting diary entries
3. **Emotions** - Managing emotions associated with diary entries
4. **Health Data** - Tracking and visualizing health metrics
5. **Recommendations** - Displaying recommendations based on diary entries

## Unimplemented Features

### 1. Todo Feature Backend Integration

The Todo feature is partially implemented in the current frontend but lacks proper integration with the backend API. The current implementation:

- Uses Redux for state management (`todoSlice.js`)
- Stores todos only in the client-side state
- Does not persist todos to the backend
- Does not retrieve todos from the backend

The backend API provides the following Todo endpoints:

```
GET    /todos/user/{userId}   - Get all todos for a user
GET    /todos/{id}            - Get a todo by ID
POST   /todos/user/{userId}   - Create a new todo
PUT    /todos/{id}            - Update a todo
DELETE /todos/{id}            - Delete a todo
```

### 2. User Profile Management

While the current frontend has a Profile page, it lacks comprehensive user profile management features:

- Limited profile editing capabilities
- No profile picture upload functionality
- No email verification process

## Implementation Directions

### 1. Todo Feature Backend Integration

To fully implement the Todo feature with backend integration, the following steps are recommended:

1. **Create a TodoService.js file** in the `services` directory:

```javascript
import apiService from './apiService';
import AuthService from './AuthService';

const TodoService = {
  _getCurrentUserId: () => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to perform this action');
    }
    return user.id;
  },

  getAllTodos: async (userId) => {
    try {
      if (!userId) {
        userId = TodoService._getCurrentUserId();
      }
      const response = await apiService.get(`/todos/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get all todos error:', error);
      throw error;
    }
  },

  getTodoById: async (id) => {
    try {
      const response = await apiService.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get todo by ID ${id} error:`, error);
      throw error;
    }
  },

  createTodo: async (todo, userId) => {
    try {
      if (!userId) {
        userId = TodoService._getCurrentUserId();
      }
      const response = await apiService.post(`/todos/user/${userId}`, todo);
      return response.data;
    } catch (error) {
      console.error('Create todo error:', error);
      throw error;
    }
  },

  updateTodo: async (id, todo) => {
    try {
      const response = await apiService.put(`/todos/${id}`, todo);
      return response.data;
    } catch (error) {
      console.error(`Update todo ${id} error:`, error);
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await apiService.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete todo ${id} error:`, error);
      throw error;
    }
  },

  toggleTodoCompleted: async (id) => {
    try {
      const todo = await TodoService.getTodoById(id);
      return await TodoService.updateTodo(id, {
        ...todo,
        completed: !todo.completed
      });
    } catch (error) {
      console.error(`Toggle todo ${id} completed error:`, error);
      throw error;
    }
  }
};

export default TodoService;
```

2. **Update the Todo Redux slice** to use the TodoService:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TodoService from '../services/TodoService';

// Async thunks
export const fetchTodos = createAsyncThunk(
  'todo/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      return await TodoService.getAllTodos();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  'todo/createTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      return await TodoService.createTodo(todoData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todo/updateTodo',
  async ({ id, todoData }, { rejectWithValue }) => {
    try {
      return await TodoService.updateTodo(id, todoData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todo/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await TodoService.deleteTodo(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTodoCompleted = createAsyncThunk(
  'todo/toggleTodoCompleted',
  async (id, { rejectWithValue }) => {
    try {
      return await TodoService.toggleTodoCompleted(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  todoList: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todoList = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createTodo
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todoList = [action.payload, ...state.todoList];
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateTodo
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todoList = state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        );
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteTodo
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todoList = state.todoList.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // toggleTodoCompleted
      .addCase(toggleTodoCompleted.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTodoCompleted.fulfilled, (state, action) => {
        state.loading = false;
        state.todoList = state.todoList.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        );
      })
      .addCase(toggleTodoCompleted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;
```

3. **Update the Todo.jsx page** to use the Redux async thunks:

```jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTodos, createTodo, toggleTodoCompleted, deleteTodo } from '../store/slices/todoSlice';

import Header from '../component/Header.jsx';
import TodoList from '../component/TodoList.jsx';

const Todo = () => {
  const dispatch = useDispatch();
  const { todoList, loading, error } = useSelector((state) => state.todo);
  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = (text) => {
    if (!text.trim()) return;
    dispatch(createTodo({ title: text, completed: false }));
    setNewTodoText('');
  };

  const handleToggleTodo = (id) => {
    dispatch(toggleTodoCompleted(id));
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  return (
    <div>
      <Header
        title="To do List"
        leftChild={<Link to="/">← 홈으로</Link>}
        rightChild={null}
      />

      <div style={{ padding: '20px' }}>
        {error && <div className="error-message">{error}</div>}
        {loading && todoList.length === 0 ? (
          <div className="loading">Loading your todos...</div>
        ) : (
          <TodoList
            todoList={todoList}
            addTodo={handleAddTodo}
            toggleTodo={handleToggleTodo}
            deleteTodo={handleDeleteTodo}
            newTodoText={newTodoText}
            setNewTodoText={setNewTodoText}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Todo;
```

4. **Update the TodoList.jsx component** to handle loading state and controlled input:

```jsx
import React from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({ 
  todoList, 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  newTodoText, 
  setNewTodoText, 
  loading 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;
    addTodo(newTodoText);
  };

  return (
    <div className="TodoTitle">
      <div className="TodoList">
        <h2>📋 오늘의 할 일</h2><br/>
        <form className="todo-input" onSubmit={handleSubmit}>
          <input
            id="todoInput"
            placeholder="할 일을 입력하세요"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newTodoText.trim()}>추가</button>
        </form>
        <div className="todo-items">
          {todoList.length === 0 ? (
            <p className="empty-msg">할 일을 추가해보세요!</p>
          ) : (
            todoList.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                content={todo.title}
                isDone={todo.completed}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                disabled={loading}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
```

### 2. User Profile Management

To enhance the user profile management features, the following steps are recommended:

1. **Extend the UserService.js** to include profile management functions:

```javascript
import apiService from './apiService';
import AuthService from './AuthService';

const UserService = {
  getCurrentUser: () => {
    return AuthService.getCurrentUser();
  },

  getUserById: async (id) => {
    try {
      const response = await apiService.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get user by ID ${id} error:`, error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await apiService.put(`/users/${id}`, userData);
      
      // Update the stored user data if it's the current user
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error(`Update user ${id} error:`, error);
      throw error;
    }
  },

  uploadProfilePicture: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiService.post(`/users/${id}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update the stored user data if it's the current user
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        const updatedUser = { ...currentUser, profilePicture: response.data.profilePicture };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error(`Upload profile picture for user ${id} error:`, error);
      throw error;
    }
  },

  requestEmailVerification: async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User must be authenticated to perform this action');
      }
      
      const response = await apiService.post(`/users/${currentUser.id}/verify-email`);
      return response.data;
    } catch (error) {
      console.error('Request email verification error:', error);
      throw error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await apiService.post('/users/verify-email', { token });
      
      // Update the stored user data
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, isEmailVerified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },
};

export default UserService;
```

2. **Enhance the Profile.jsx page** to include profile picture upload and email verification:

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = UserService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        const userData = await UserService.getUserById(currentUser.id);
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user profile
      const updatedUser = await UserService.updateUser(user.id, formData);
      
      // Upload profile picture if selected
      if (profilePicture) {
        await UserService.uploadProfilePicture(user.id, profilePicture);
      }
      
      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    setLoading(true);
    
    try {
      await UserService.requestEmailVerification();
      setVerificationSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {user && (
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-picture-container">
              <img 
                src={user.profilePicture || '/default-avatar.png'} 
                alt="Profile" 
                className="profile-picture" 
              />
              {editMode && (
                <div className="profile-picture-upload">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    id="profile-picture-input"
                  />
                  <label htmlFor="profile-picture-input">Change Picture</label>
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{user.username}</h2>
              <p className="email">{user.email}</p>
              {!user.isEmailVerified && (
                <div className="email-verification">
                  <p className="not-verified">Email not verified</p>
                  {verificationSent ? (
                    <p className="verification-sent">Verification email sent!</p>
                  ) : (
                    <button 
                      onClick={handleRequestVerification} 
                      disabled={loading}
                      className="verify-button"
                    >
                      Verify Email
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {editMode ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setEditMode(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="save-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">First Name:</span>
                <span className="detail-value">{user.firstName || 'Not set'}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Last Name:</span>
                <span className="detail-value">{user.lastName || 'Not set'}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Account Created:</span>
                <span className="detail-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <button 
                onClick={() => setEditMode(true)}
                className="edit-button"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
```

## Conclusion

The current frontend implementation of SentiMate has most of the features described in the backend API documentation. The main areas for improvement are:

1. **Todo Feature Backend Integration** - Implementing proper integration with the backend API for the Todo feature
2. **User Profile Management** - Enhancing the user profile management features

By implementing these features, the frontend will provide a more complete and robust user experience that fully leverages the capabilities of the backend API.

The new frontend implementation (`new_senti_mate_front_end`) already has these features implemented and can serve as a reference for the implementation in the current frontend.