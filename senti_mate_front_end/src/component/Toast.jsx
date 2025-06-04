import React, { useState, useEffect, useCallback } from 'react';
import './Toast.css';

/**
 * Toast component for displaying temporary notifications
 * 
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds before auto-closing (0 for no auto-close)
 * @param {function} onClose - Callback function when toast is closed
 * @param {boolean} isVisible - Whether the toast is visible
 * @param {string} position - Position of the toast (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center)
 */
const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose, 
  isVisible = true,
  position = 'top-right'
}) => {
  const [visible, setVisible] = useState(isVisible);
  const [animationClass, setAnimationClass] = useState('');

  // Handle close action with animation
  const handleClose = useCallback(() => {
    setAnimationClass('Toast_exit');
    
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300); // Match animation duration
  }, [onClose]);

  // Auto-close after duration
  useEffect(() => {
    let timer;
    
    if (isVisible && duration > 0) {
      // Set entry animation
      setAnimationClass('Toast_entry');
      
      // Clear entry animation after it completes
      const entryTimer = setTimeout(() => {
        setAnimationClass('');
      }, 300); // Match animation duration
      
      // Set timer for auto-close
      timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(entryTimer);
      };
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, duration, handleClose]);

  // Update visible state when isVisible prop changes
  useEffect(() => {
    setVisible(isVisible);
    if (isVisible) {
      setAnimationClass('Toast_entry');
      setTimeout(() => {
        setAnimationClass('');
      }, 300);
    }
  }, [isVisible]);

  // Don't render if not visible
  if (!visible) return null;

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`Toast Toast_${type} Toast_${position} ${animationClass}`} role="alert">
      <div className="Toast_icon">{getIcon()}</div>
      <div className="Toast_content">
        <p className="Toast_message">{message}</p>
      </div>
      <button 
        className="Toast_close" 
        onClick={handleClose}
        aria-label="Close notification"
      >
        ✕
      </button>
      {duration > 0 && (
        <div 
          className="Toast_progress" 
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};

/**
 * ToastContainer component for managing multiple toasts
 * 
 * @param {Array} toasts - Array of toast objects
 * @param {string} position - Position of the toasts (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center)
 * @param {function} removeToast - Function to remove a toast by id
 */
export const ToastContainer = ({ 
  toasts = [], 
  position = 'top-right',
  removeToast 
}) => {
  if (!toasts.length) return null;

  return (
    <div className={`ToastContainer ToastContainer_${position}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
          position={position}
        />
      ))}
    </div>
  );
};

export default Toast;