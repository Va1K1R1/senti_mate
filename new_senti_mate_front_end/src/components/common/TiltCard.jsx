import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../styles/theme';
import '../../styles/TiltCard.css';

const TiltCard = ({ 
  children, 
  className = '', 
  glareEnabled = true,
  tiltEnabled = true,
  glareColor = 'rgba(255, 255, 255, 0.4)',
  tiltMaxAngleX = 10,
  tiltMaxAngleY = 10,
  scale = 1.03,
  perspective = 1000,
  transitionDuration = 400,
  floatingEffect = true,
  floatingRange = 10,
  floatingSpeed = 3,
  borderGlow = true,
  borderGlowColor = '',
  borderGlowIntensity = 0.8,
  contentAnimationEnabled = true,
  ...props 
}) => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { darkMode } = useTheme();

  // For floating animation
  const floatingY = useMotionValue(0);
  const floatingX = useMotionValue(0);
  const controls = useAnimation();

  // For parallax effect on card content
  const contentY = useTransform(
    floatingY,
    [-floatingRange, floatingRange],
    [2, -2]
  );
  const contentX = useTransform(
    floatingX,
    [-floatingRange, floatingRange],
    [2, -2]
  );

  // For border glow effect
  const defaultGlowColor = darkMode 
    ? 'rgba(74, 144, 226, 0.6)' 
    : 'rgba(74, 144, 226, 0.4)';
  const actualGlowColor = borderGlowColor || defaultGlowColor;

  // Initialize floating animation
  useEffect(() => {
    if (floatingEffect) {
      const floatAnimation = async () => {
        while (true) {
          // Random movement within range
          await controls.start({
            y: Math.random() * floatingRange * 2 - floatingRange,
            x: Math.random() * floatingRange * 2 - floatingRange,
            transition: { 
              duration: 3 + Math.random() * floatingSpeed, 
              ease: "easeInOut" 
            }
          });
        }
      };

      floatAnimation();
    }

    // Set mounted state for entrance animation
    setIsMounted(true);

    return () => {
      controls.stop();
    };
  }, [controls, floatingEffect, floatingRange, floatingSpeed]);

  // Update motion values when controls change
  useEffect(() => {
    const unsubscribeY = controls.y.onChange(latest => {
      floatingY.set(latest);
    });

    const unsubscribeX = controls.x.onChange(latest => {
      floatingX.set(latest);
    });

    return () => {
      unsubscribeY();
      unsubscribeX();
    };
  }, [controls, floatingY, floatingX]);

  const handleMouseMove = (e) => {
    if (!tiltEnabled || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to card center (in percentage)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Convert to percentage (-1 to 1)
    const rotateX = (mouseY / (rect.height / 2)) * -tiltMaxAngleX;
    const rotateY = (mouseX / (rect.width / 2)) * tiltMaxAngleY;

    // Update rotation state
    setRotation({ x: rotateX, y: rotateY });

    // Update glare position
    if (glareEnabled) {
      const glareX = (mouseX / rect.width) * 100 + 50;
      const glareY = (mouseY / rect.height) * 100 + 50;
      setGlarePosition({ x: glareX, y: glareY });
    }

    // Stop floating animation when interacting
    if (floatingEffect) {
      controls.stop();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);

    // Stop floating animation when hovering
    if (floatingEffect) {
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });

    // Resume floating animation when not hovering
    if (floatingEffect) {
      controls.start({
        y: Math.random() * floatingRange * 2 - floatingRange,
        x: Math.random() * floatingRange * 2 - floatingRange,
        transition: { 
          duration: 3 + Math.random() * floatingSpeed, 
          ease: "easeInOut" 
        }
      });
    }
  };

  // Card entrance animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          ref={cardRef}
          className={`tilt-card ${className} ${darkMode ? 'dark' : 'light'} ${borderGlow ? 'with-glow' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: `${perspective}px`,
            y: floatingEffect ? floatingY : 0,
            x: floatingEffect ? floatingX : 0,
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cardVariants}
          {...props}
        >
          <motion.div
            className="tilt-card-inner"
            animate={{
              rotateX: rotation.x,
              rotateY: rotation.y,
              scale: isHovered ? scale : 1,
            }}
            transition={{
              duration: transitionDuration / 1000,
              ease: "easeOut",
            }}
          >
            {/* Content with subtle parallax effect */}
            <motion.div 
              ref={contentRef}
              className="tilt-card-content"
              style={contentAnimationEnabled ? {
                y: isHovered ? contentY : 0,
                x: isHovered ? contentX : 0,
              } : {}}
            >
              {children}
            </motion.div>

            {/* Glare effect */}
            {glareEnabled && (
              <div 
                className={`glare ${isHovered ? 'visible' : ''}`}
                style={{
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, rgba(255, 255, 255, 0) 80%)`,
                }}
              />
            )}

            {/* Border glow effect */}
            {borderGlow && (
              <div 
                className={`border-glow ${isHovered ? 'active' : ''}`}
                style={{
                  boxShadow: `0 0 20px ${borderGlowIntensity * 5}px ${actualGlowColor}`,
                  borderColor: actualGlowColor,
                  opacity: isHovered ? borderGlowIntensity : 0,
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TiltCard;
