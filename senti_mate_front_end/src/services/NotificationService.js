/**
 * Service for user notifications
 * This service provides methods for displaying notifications to the user
 * It uses a custom event system to communicate with notification components
 */
const NotificationService = {
  /**
   * Show a notification
   * @param {string} message - The message to display
   * @param {string} type - The type of notification (success, error, warning, info)
   * @param {number} duration - The duration in milliseconds to show the notification
   * @returns {string} - The ID of the created notification
   */
  notify: (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();

    // Create notification data
    const notification = {
      id,
      message,
      type,
      duration,
    };

    // Dispatch a custom event with the notification data
    const event = new CustomEvent('notification', {
      detail: notification,
    });
    window.dispatchEvent(event);

    return id;
  },

  /**
   * Show a success notification
   * @param {string} message - The message to display
   * @param {number} duration - The duration in milliseconds to show the notification
   * @returns {string} - The ID of the created notification
   */
  success: (message, duration) => {
    return NotificationService.notify(message, 'success', duration);
  },

  /**
   * Show an error notification
   * @param {string} message - The message to display
   * @param {number} duration - The duration in milliseconds to show the notification
   * @returns {string} - The ID of the created notification
   */
  error: (message, duration) => {
    return NotificationService.notify(message, 'error', duration);
  },

  /**
   * Show a warning notification
   * @param {string} message - The message to display
   * @param {number} duration - The duration in milliseconds to show the notification
   * @returns {string} - The ID of the created notification
   */
  warning: (message, duration) => {
    return NotificationService.notify(message, 'warning', duration);
  },

  /**
   * Show an info notification
   * @param {string} message - The message to display
   * @param {number} duration - The duration in milliseconds to show the notification
   * @returns {string} - The ID of the created notification
   */
  info: (message, duration) => {
    return NotificationService.notify(message, 'info', duration);
  },

  /**
   * Remove a notification by ID
   * @param {string} id - The ID of the notification to remove
   */
  remove: id => {
    // Dispatch a custom event to remove the notification
    const event = new CustomEvent('notification-remove', {
      detail: { id },
    });
    window.dispatchEvent(event);
  },

  /**
   * Clear all notifications
   */
  clearAll: () => {
    // Dispatch a custom event to clear all notifications
    const event = new CustomEvent('notification-clear');
    window.dispatchEvent(event);
  },

  /**
   * Add a listener for notification events
   * @param {Function} callback - The callback function to call when a notification is created
   * @returns {Function} - A function to remove the listener
   */
  addListener: callback => {
    const handleNotification = event => {
      callback(event.detail);
    };

    window.addEventListener('notification', handleNotification);

    // Return a function to remove the listener
    return () => {
      window.removeEventListener('notification', handleNotification);
    };
  },

  /**
   * Add a listener for notification removal events
   * @param {Function} callback - The callback function to call when a notification is removed
   * @returns {Function} - A function to remove the listener
   */
  addRemoveListener: callback => {
    const handleRemove = event => {
      callback(event.detail.id);
    };

    window.addEventListener('notification-remove', handleRemove);

    // Return a function to remove the listener
    return () => {
      window.removeEventListener('notification-remove', handleRemove);
    };
  },

  /**
   * Add a listener for notification clear events
   * @param {Function} callback - The callback function to call when all notifications are cleared
   * @returns {Function} - A function to remove the listener
   */
  addClearListener: callback => {
    window.addEventListener('notification-clear', callback);

    // Return a function to remove the listener
    return () => {
      window.removeEventListener('notification-clear', callback);
    };
  },
};

export default NotificationService;
