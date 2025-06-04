import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for throttling a function
 * @param {Function} fn - The function to throttle
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The throttled function
 */
const useThrottle = (fn, delay = 200) => {
  const [ready, setReady] = useState(true);
  const timerRef = useRef(null);
  const fnRef = useRef(fn);

  // Update the function reference when it changes
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Clear the timer when the component unmounts or delay changes
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [delay]);

  // The throttled function
  const throttledFn = useCallback(
    (...args) => {
      if (!ready) {
        return;
      }

      setReady(false);
      fnRef.current(...args);

      timerRef.current = setTimeout(() => {
        setReady(true);
      }, delay);
    },
    [ready, delay],
  );

  return throttledFn;
};

export default useThrottle;
