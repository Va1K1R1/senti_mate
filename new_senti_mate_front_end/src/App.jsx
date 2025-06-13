import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './styles/theme';
import { AuthProvider } from './context/AuthContext';
import { DiaryProvider } from './context/DiaryContext';

// Import pages
import Home from './pages/Home';
import Diary from './pages/Diary';
import DiaryEdit from './pages/DiaryEdit';
import DiaryNew from './pages/DiaryNew';
import Todo from './pages/Todo';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HealthData from './pages/HealthData';
import Recommendations from './pages/Recommendations';
import Emotions from './pages/Emotions';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// Import components
import ThemeToggle from './components/common/ThemeToggle';
import Navigation from './components/common/Navigation';
import Aurora from './components/common/Aurora';
import Loading from './components/common/Loading';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="loading-page">
          <Aurora />
          <Loading 
            type="pulse" 
            size="large" 
            text="Loading SentiMate..." 
          />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <DiaryProvider>
          <div className="app-container">
            <Aurora />
            <Navigation />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/diary/:id" element={<Diary />} />
                <Route path="/diary/edit/:id" element={<DiaryEdit />} />
                <Route path="/diary/new" element={<DiaryNew />} />
                <Route path="/todo" element={<Todo />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/health-data" element={<HealthData />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/emotions" element={<Emotions />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
            <ThemeToggle />
          </div>
        </DiaryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
