import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../styles/theme';
import '../../styles/MagneticButton.css';

const MagneticButton = ({ 
  children, 
  className = '', 
  onClick, 
  disabled = false,
  magneticEffect = true,
  glowEffect = false,
  strength = 30,
  radius = 400,
  ...props 
}) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { darkMode } = useTheme();
  
  // Reset position when component unmounts or disabled changes
  useEffect(() => {
    return () => {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };
  }, [disabled]);
  
  const handleMouseMove = (e) => {
    if (disabled || !magneticEffect || !buttonRef.current) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    // Calculate center of the button
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Calculate distance from mouse to center (Pythagorean theorem)
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // If mouse is within the magnetic radius
    if (distance < radius) {
      // Calculate magnetic pull (stronger when closer)
      const pull = 1 - distance / radius;
      
      // Apply pull to position
      setPosition({
        x: distanceX * pull * (strength / 10),
        y: distanceY * pull * (strength / 10)
      });
    } else {
      // Reset position if mouse is outside radius
      setPosition({ x: 0, y: 0 });
    }
  };
  
  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };
  
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`magnetic-button ${className} ${darkMode ? 'dark' : 'light'} ${glowEffect ? 'glow' : ''} ${disabled ? 'disabled' : ''}`}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
      {glowEffect && <div className={`glow-effect ${isHovered ? 'active' : ''}`} />}
    </motion.button>
  );
};

export default MagneticButton;