import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../styles/theme';
import '../../styles/Loading.css';

const LoadingDots = ({ size = 'medium', color, className = '' }) => {
  const { darkMode } = useTheme();
  const dotColor = color || (darkMode ? '#fff' : '#4a90e2');
  
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const dotVariants = {
    initial: { y: 0, opacity: 0.5 },
    animate: {
      y: [0, -10, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <motion.div 
      className={`loading-dots ${size} ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map(i => (
        <motion.div 
          key={i} 
          className="dot"
          style={{ backgroundColor: dotColor }}
          variants={dotVariants}
        />
      ))}
    </motion.div>
  );
};

const LoadingSpinner = ({ size = 'medium', color, className = '' }) => {
  const { darkMode } = useTheme();
  const spinnerColor = color || (darkMode ? '#fff' : '#4a90e2');
  
  return (
    <div className={`loading-spinner ${size} ${className}`}>
      <motion.div 
        className="spinner"
        style={{ borderColor: `${spinnerColor} transparent transparent transparent` }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

const LoadingPulse = ({ size = 'medium', color, className = '' }) => {
  const { darkMode } = useTheme();
  const pulseColor = color || (darkMode ? '#fff' : '#4a90e2');
  
  return (
    <div className={`loading-pulse ${size} ${className}`}>
      <motion.div 
        className="pulse"
        style={{ backgroundColor: pulseColor }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

const LoadingBar = ({ size = 'medium', color, className = '', width = '200px' }) => {
  const { darkMode } = useTheme();
  const barColor = color || (darkMode ? '#fff' : '#4a90e2');
  
  return (
    <div 
      className={`loading-bar ${size} ${className}`}
      style={{ width }}
    >
      <motion.div 
        className="bar"
        style={{ backgroundColor: barColor }}
        initial={{ width: 0 }}
        animate={{ 
          width: ['0%', '100%', '0%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

const Loading = ({ 
  type = 'dots', 
  size = 'medium', 
  color,
  text,
  textPosition = 'bottom',
  className = '',
  ...props
}) => {
  const { darkMode } = useTheme();
  
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return <LoadingSpinner size={size} color={color} className={className} />;
      case 'pulse':
        return <LoadingPulse size={size} color={color} className={className} />;
      case 'bar':
        return <LoadingBar size={size} color={color} className={className} />;
      case 'dots':
      default:
        return <LoadingDots size={size} color={color} className={className} />;
    }
  };
  
  return (
    <div className={`loading-container ${textPosition} ${darkMode ? 'dark' : 'light'}`} {...props}>
      {textPosition === 'top' && text && <div className="loading-text">{text}</div>}
      {renderLoader()}
      {textPosition === 'bottom' && text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default Loading;