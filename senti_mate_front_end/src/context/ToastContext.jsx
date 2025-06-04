import React, { createContext, useContext } from 'react';
import { ToastContainer } from '../component/Toast';
import useToast from '../hooks/useToast';

// Create context
const ToastContext = createContext(null);

/**
 * Custom hook to use the toast context
 * @returns {Object} Toast context value
 */
export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
};

/**
 * Toast provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The rendered ToastProvider component
 */
export const ToastProvider = ({ children }) => {
    const toast = useToast();
    
    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer 
                toasts={toast.toasts} 
                removeToast={toast.removeToast} 
            />
        </ToastContext.Provider>
    );
};

export default ToastContext;