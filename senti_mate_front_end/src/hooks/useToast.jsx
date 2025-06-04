import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Object containing toasts array and functions to add, remove, and clear toasts
 */
const useToast = () => {
    const [toasts, setToasts] = useState([]);

    /**
     * Add a new toast notification
     * @param {string} message - The message to display
     * @param {string} type - The type of toast (success, error, warning, info)
     * @param {number} duration - The duration in milliseconds to show the toast
     * @returns {string} The ID of the created toast
     */
    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now().toString();
        
        setToasts(prevToasts => [
            ...prevToasts,
            {
                id,
                message,
                type,
                duration
            }
        ]);
        
        return id;
    }, []);

    /**
     * Remove a toast notification by ID
     * @param {string} id - The ID of the toast to remove
     */
    const removeToast = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    /**
     * Clear all toast notifications
     */
    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    /**
     * Convenience method to add a success toast
     * @param {string} message - The message to display
     * @param {number} duration - The duration in milliseconds to show the toast
     * @returns {string} The ID of the created toast
     */
    const success = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    /**
     * Convenience method to add an error toast
     * @param {string} message - The message to display
     * @param {number} duration - The duration in milliseconds to show the toast
     * @returns {string} The ID of the created toast
     */
    const error = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    /**
     * Convenience method to add a warning toast
     * @param {string} message - The message to display
     * @param {number} duration - The duration in milliseconds to show the toast
     * @returns {string} The ID of the created toast
     */
    const warning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    /**
     * Convenience method to add an info toast
     * @param {string} message - The message to display
     * @param {number} duration - The duration in milliseconds to show the toast
     * @returns {string} The ID of the created toast
     */
    const info = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        clearToasts,
        success,
        error,
        warning,
        info
    };
};

export default useToast;