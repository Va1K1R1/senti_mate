import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for using localStorage with React state
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if localStorage is empty
 * @returns {Array} [storedValue, setValue, removeValue] - State and methods
 */
const useLocalStorage = (key, initialValue) => {
  // Get from localStorage on initial render
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a browser`
        );
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch a custom event so other instances can update
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn(
        `Tried removing localStorage key "${key}" even though environment is not a browser`
      );
    }

    try {
      // Remove from localStorage
      window.localStorage.removeItem(key);
      
      // Reset state
      setStoredValue(initialValue);
      
      // Dispatch a custom event so other instances can update
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  // Listen for changes to this localStorage key in other windows/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    // this only works for other documents, not the current one
    window.addEventListener('storage', handleStorageChange);
    // this is a custom event, triggered in setValue
    window.addEventListener('local-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;