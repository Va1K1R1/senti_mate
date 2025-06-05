import React from 'react';
import './Button.css';

/**
 * Button component for consistent button styling across the application
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {string} props.type - Button type (primary, secondary, danger)
 * @param {function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.className - Additional CSS class names
 * @param {React.ReactNode} props.children - Button content (alternative to text)
 * @returns {JSX.Element} Button component
 */
const Button = ({ 
  text, 
  type = 'primary', 
  onClick, 
  disabled = false, 
  className = '',
  children
}) => {
  return (
    <button
      className={`button ${type} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children || text}
    </button>
  );
};

export default Button;