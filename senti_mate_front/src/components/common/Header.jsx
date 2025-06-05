import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

/**
 * Header component for navigation
 * @returns {JSX.Element} Header component
 */
const Header = () => {
  const location = useLocation();

  // Function to determine if a nav link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">
          <Link to="/">SentiMate</Link>
        </h1>

        <nav className="nav-menu">
          <ul>
            <li className={isActive('/') ? 'active' : ''}>
              <Link to="/">Home</Link>
            </li>
            <li className={isActive('/diary') ? 'active' : ''}>
              <Link to="/diary">Diary</Link>
            </li>
            <li className={isActive('/todo') ? 'active' : ''}>
              <Link to="/todo">Todo</Link>
            </li>
            <li className={isActive('/dashboard') ? 'active' : ''}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <ul className="user-menu">
            <li className={isActive('/profile') ? 'active' : ''}>
              <Link to="/profile">Profile</Link>
            </li>
            <li className={isActive('/settings') ? 'active' : ''}>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
