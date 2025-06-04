import { useEffect, useRef } from 'react';

/**
 * Custom hook for detecting clicks outside of a specified element
 * @param {Function} handler - The callback function to run when a click outside is detected
 * @param {Array} excludeRefs - Optional array of refs to exclude from outside click detection
 * @returns {React.RefObject} A ref to attach to the element
 */
const useOnClickOutside = (handler, excludeRefs = []) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = event => {
      // Do nothing if the ref is not set or if clicking ref's element or descendants
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // Check if the click was inside any of the excluded elements
      for (const excludeRef of excludeRefs) {
        if (
          excludeRef &&
          excludeRef.current &&
          excludeRef.current.contains(event.target)
        ) {
          return;
        }
      }

      handler(event);
    };

    // Add event listeners
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, excludeRefs]);

  return ref;
};

export default useOnClickOutside;
