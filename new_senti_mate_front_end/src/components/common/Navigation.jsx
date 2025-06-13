import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../styles/theme';
import { motion } from 'framer-motion';

const Navigation = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home', authRequired: true },
    { path: '/diary/new', label: 'New Entry', authRequired: true },
    { path: '/emotions', label: 'Emotions', authRequired: true },
    { path: '/health-data', label: 'Health', authRequired: true },
    { path: '/recommendations', label: 'Recommendations', authRequired: true },
    { path: '/todo', label: 'Todo', authRequired: true },
    { path: '/profile', label: 'Profile', authRequired: true },
    { path: '/settings', label: 'Settings', authRequired: true },
    { path: '/login', label: 'Login', authRequired: false, hideWhenAuth: true },
    { path: '/register', label: 'Register', authRequired: false, hideWhenAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => 
    (isAuthenticated && !item.hideWhenAuth) || (!isAuthenticated && !item.authRequired)
  );

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  return (
    <nav className={`navigation ${darkMode ? 'dark' : 'light'}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="logo-text"
            >
              SentiMate
            </motion.div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
        </motion.button>

        {/* Desktop navigation */}
        <div className="desktop-nav">
          <ul className="nav-links">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="logout-button"
                  onClick={logout}
                >
                  <span>Logout</span>
                </motion.button>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile navigation */}
        <motion.div
          className="mobile-nav"
          animate={isOpen ? "open" : "closed"}
          variants={variants}
          transition={{ duration: 0.3 }}
        >
          <ul className="mobile-nav-links">
            {filteredNavItems.map((item) => (
              <motion.li
                key={item.path}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
            {isAuthenticated && (
              <motion.li
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="logout-button" onClick={logout}>
                  <span>Logout</span>
                </button>
              </motion.li>
            )}
          </ul>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;
