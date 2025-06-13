import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../styles/theme';
import { motion } from 'framer-motion';
import '../../styles/Aurora.css';

const Aurora = ({ interactive = true }) => {
  const canvasRef = useRef(null);
  const { darkMode } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse position for interactive effects
  const handleMouseMove = (e) => {
    if (interactive) {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let orbs = []; // Larger, slower-moving background elements
    let time = 0; // For time-based animations

    // Add event listeners for mouse interaction if interactive mode is enabled
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    const initElements = () => {
      // Initialize particles
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 15); // More particles

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1, // Larger range of sizes
          speedX: Math.random() * 0.7 - 0.35, // Faster movement
          speedY: Math.random() * 0.7 - 0.35,
          color: getRandomColor(0.3, 0.5), // More vibrant
          pulseSpeed: Math.random() * 0.02 + 0.01, // For size pulsing
          pulseSize: Math.random() * 0.5 + 0.5, // Pulse amplitude
          phase: Math.random() * Math.PI * 2, // Random starting phase
          shape: Math.random() > 0.7 ? 'circle' : 'square', // Different shapes
          connectDistance: Math.random() * 150 + 50 // Distance to connect with other particles
        });
      }

      // Initialize orbs (larger background elements)
      orbs = [];
      const orbCount = Math.floor(window.innerWidth / 200); // Fewer orbs

      for (let i = 0; i < orbCount; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 100 + 50, // Much larger
          speedX: (Math.random() * 0.2 - 0.1) * 0.5, // Very slow movement
          speedY: (Math.random() * 0.2 - 0.1) * 0.5,
          color: getRandomColor(0.05, 0.1), // Very transparent
          pulseSpeed: Math.random() * 0.005 + 0.002, // Slow pulsing
          pulseSize: Math.random() * 0.3 + 0.2,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const getRandomColor = (minAlpha = 0.2, maxAlpha = 0.3) => {
      const alpha = minAlpha + Math.random() * (maxAlpha - minAlpha);

      // More vibrant and varied colors
      const colors = darkMode ? 
        [
          `rgba(74, 144, 226, ${alpha})`, // Blue
          `rgba(80, 227, 194, ${alpha})`, // Teal
          `rgba(112, 76, 182, ${alpha})`, // Purple
          `rgba(155, 89, 182, ${alpha})`, // Violet
          `rgba(52, 152, 219, ${alpha})`, // Lighter blue
          `rgba(26, 188, 156, ${alpha})`, // Turquoise
        ] : 
        [
          `rgba(74, 144, 226, ${alpha})`, // Blue
          `rgba(80, 227, 194, ${alpha})`, // Teal
          `rgba(255, 183, 77, ${alpha})`, // Orange
          `rgba(255, 107, 129, ${alpha})`, // Pink
          `rgba(46, 204, 113, ${alpha})`, // Green
          `rgba(241, 196, 15, ${alpha})`, // Yellow
        ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const drawOrbs = () => {
      orbs.forEach(orb => {
        // Calculate pulsing size
        const pulseMultiplier = 1 + Math.sin(time * orb.pulseSpeed + orb.phase) * orb.pulseSize;
        const currentRadius = orb.radius * pulseMultiplier;

        // Create gradient
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, currentRadius * 1.5
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawConnections = () => {
      // Draw connections between nearby particles
      ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = (particles[i].connectDistance + particles[j].connectDistance) / 2;

          if (distance < maxDistance) {
            // Opacity based on distance (closer = more opaque)
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = darkMode ? 
              `rgba(255, 255, 255, ${opacity * 0.05})` : 
              `rgba(0, 0, 0, ${opacity * 0.05})`;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawParticles = () => {
      particles.forEach(particle => {
        // Calculate pulsing size
        const pulseMultiplier = 1 + Math.sin(time * particle.pulseSpeed + particle.phase) * particle.pulseSize;
        const currentRadius = particle.radius * pulseMultiplier;

        // Create gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentRadius * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;

        // Draw different shapes
        if (particle.shape === 'square') {
          ctx.fillRect(
            particle.x - currentRadius, 
            particle.y - currentRadius, 
            currentRadius * 2, 
            currentRadius * 2
          );
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, currentRadius * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const drawMouseEffect = () => {
      if (interactive && isHovering) {
        // Create a ripple effect around the mouse
        const rippleRadius = 100 + Math.sin(time * 2) * 20;
        const gradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, rippleRadius
        );

        const rippleColor = darkMode ? 
          'rgba(255, 255, 255, 0.1)' : 
          'rgba(74, 144, 226, 0.1)';

        gradient.addColorStop(0, rippleColor);
        gradient.addColorStop(0.5, rippleColor.replace(')', ', 0.05)'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, rippleRadius, 0, Math.PI * 2);
        ctx.fill();

        // Attract nearby particles to mouse
        particles.forEach(particle => {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const force = (1 - distance / 200) * 0.2;
            particle.x += dx * force;
            particle.y += dy * force;
          }
        });
      }
    };

    const updateElements = () => {
      // Update time for animations
      time += 0.01;

      // Update orbs
      orbs.forEach(orb => {
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Wrap around edges (no bouncing for smoother effect)
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;
      });

      // Update particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges with slight randomization for more natural movement
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
          particle.speedX += (Math.random() * 0.1 - 0.05); // Add slight randomness
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
          particle.speedY += (Math.random() * 0.1 - 0.05);
        }

        // Occasionally change direction slightly for more natural movement
        if (Math.random() < 0.01) {
          particle.speedX += (Math.random() * 0.1 - 0.05);
          particle.speedY += (Math.random() * 0.1 - 0.05);

          // Limit max speed
          const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
          if (speed > 1) {
            particle.speedX = (particle.speedX / speed) * 1;
            particle.speedY = (particle.speedY / speed) * 1;
          }
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw in layers from back to front
      drawOrbs();
      drawConnections();
      drawParticles();
      drawMouseEffect();

      updateElements();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode, interactive, mousePosition, isHovering]);

  return (
    <motion.canvas 
      ref={canvasRef} 
      className={`aurora-canvas ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default Aurora;
