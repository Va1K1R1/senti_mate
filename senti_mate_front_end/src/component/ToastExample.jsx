import React from "react";
import { useToast } from "../context/ToastContext";
import Button from "./Button";
import "./ToastExample.css";

/**
 * Example component demonstrating how to use the Toast component
 * @returns {JSX.Element} The rendered ToastExample component
 */
const ToastExample = () => {
    // Use the toast hook to access toast functionality
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    return (
        <div className="ToastExample">
            <h2>Toast Notifications Example</h2>
            <p>Click the buttons below to display different types of toast notifications.</p>
            
            <div className="toast-buttons">
                <Button 
                    text="Success Toast" 
                    onClick={() => showSuccess("Operation completed successfully!")}
                    type="positive"
                />
                
                <Button 
                    text="Error Toast" 
                    onClick={() => showError("An error occurred. Please try again.")}
                    type="negative"
                />
                
                <Button 
                    text="Warning Toast" 
                    onClick={() => showWarning("This action cannot be undone.")}
                    type="warning"
                />
                
                <Button 
                    text="Info Toast" 
                    onClick={() => showInfo("Here's some information for you.")}
                    type="default"
                />
                
                <Button 
                    text="Custom Duration" 
                    onClick={() => showInfo("This toast will disappear in 10 seconds.", 10000)}
                    type="default"
                />
            </div>
            
            <div className="usage-example">
                <h3>How to Use</h3>
                <pre>
                    {`
// 1. Import the useToast hook
import { useToast } from "../context/ToastContext";

// 2. Use the hook in your component
const YourComponent = () => {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    
    // 3. Call the appropriate method to show a toast
    const handleSuccess = () => {
        showSuccess("Operation completed successfully!");
    };
    
    // 4. You can also specify a custom duration (in milliseconds)
    const handleCustomDuration = () => {
        showInfo("This toast will disappear in 10 seconds.", 10000);
    };
    
    return (
        <button onClick={handleSuccess}>Show Success Toast</button>
    );
};
                    `}
                </pre>
            </div>
        </div>
    );
};

export default ToastExample;