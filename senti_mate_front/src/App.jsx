import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import context providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DiaryProvider } from './context/DiaryContext';
import { TodoProvider } from './context/TodoContext';
import { HealthDataProvider } from './context/HealthDataContext';

// Import pages
import Home from './pages/Home';
import Todo from './pages/Todo';
import Login from './pages/Login';
import Register from './pages/Register';
import Diary from './pages/Diary';
import New from './pages/New';
import Edit from './pages/Edit';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Health from './pages/Health';

// Import components
import ProtectedRoute from './components/common/ProtectedRoute';

/**
 * Main App component with routing and context providers
 * @returns {JSX.Element} App component
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DiaryProvider>
          <TodoProvider>
            <HealthDataProvider>
              <Router>
                <div className="app">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } />
                    <Route path="/todo" element={
                      <ProtectedRoute>
                        <Todo />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/health" element={
                      <ProtectedRoute>
                        <Health />
                      </ProtectedRoute>
                    } />
                    <Route path="/diary/new" element={
                      <ProtectedRoute>
                        <New />
                      </ProtectedRoute>
                    } />
                    <Route path="/diary/edit/:id" element={
                      <ProtectedRoute>
                        <Edit />
                      </ProtectedRoute>
                    } />
                    <Route path="/diary/:id" element={
                      <ProtectedRoute>
                        <Diary />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </div>
              </Router>
            </HealthDataProvider>
          </TodoProvider>
        </DiaryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;