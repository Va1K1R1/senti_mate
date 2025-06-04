import { useEffect, useRef } from 'react';

/**
 * Custom hook for accessing the previous value of a state or prop
 * @param {any} value - The value to track
 * @returns {any} The previous value
 */
const usePrevious = value => {
  // Create a ref to store the previous value
  const ref = useRef();

  // Update the ref whenever the value changes
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return the previous value (which is now stored in ref.current)
  return ref.current;
};

export default usePrevious;
