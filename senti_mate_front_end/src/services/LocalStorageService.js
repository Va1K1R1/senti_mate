/**
 * Service for local data persistence using localStorage
 */
const LocalStorageService = {
  /**
   * Set an item in localStorage
   * @param {string} key - The key to store the value under
   * @param {any} value - The value to store
   * @returns {boolean} - True if successful, false otherwise
   */
  setItem: (key, value) => {
    try {
      const valueToStore =
        typeof value === 'object' ? JSON.stringify(value) : value;
      window.localStorage.setItem(key, valueToStore);
      // Dispatch a custom event so other parts of the app can react to changes
      window.dispatchEvent(new Event('local-storage-change'));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Get an item from localStorage
   * @param {string} key - The key to retrieve the value for
   * @param {any} defaultValue - The default value to return if the key doesn't exist
   * @returns {any} - The stored value or defaultValue if not found
   */
  getItem: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      // Try to parse as JSON, if it fails return the raw value
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Remove an item from localStorage
   * @param {string} key - The key to remove
   * @returns {boolean} - True if successful, false otherwise
   */
  removeItem: key => {
    try {
      window.localStorage.removeItem(key);
      // Dispatch a custom event so other parts of the app can react to changes
      window.dispatchEvent(new Event('local-storage-change'));
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all items from localStorage
   * @returns {boolean} - True if successful, false otherwise
   */
  clear: () => {
    try {
      window.localStorage.clear();
      // Dispatch a custom event so other parts of the app can react to changes
      window.dispatchEvent(new Event('local-storage-change'));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Get all keys from localStorage
   * @returns {Array} - Array of keys or empty array if error
   */
  getAllKeys: () => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('Error getting all localStorage keys:', error);
      return [];
    }
  },

  /**
   * Check if a key exists in localStorage
   * @param {string} key - The key to check
   * @returns {boolean} - True if the key exists, false otherwise
   */
  hasKey: key => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking localStorage key "${key}":`, error);
      return false;
    }
  },
};

export default LocalStorageService;
