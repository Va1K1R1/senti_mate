import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting when a media query matches
 * @param {string} query - The media query to match
 * @returns {boolean} Whether the media query matches
 */
const useMediaQuery = query => {
  // Initialize with the current match state
  const getMatches = mediaQuery => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia(mediaQuery).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches(query));

  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);

    // Update the state initially
    setMatches(mediaQuery.matches);

    // Define a callback function to handle changes
    const handleChange = event => {
      setMatches(event.matches);
    };

    // Add the callback as a listener for changes to the media query
    if (mediaQuery.addEventListener) {
      // Modern browsers
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Older browsers
      mediaQuery.addListener(handleChange);
    }

    // Remove the listener when the component is unmounted
    return () => {
      if (mediaQuery.removeEventListener) {
        // Modern browsers
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
