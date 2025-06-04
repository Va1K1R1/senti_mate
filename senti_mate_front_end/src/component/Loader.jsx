import React from "react";
import "./Loader.css";

/**
 * Loader component for displaying loading states
 * @param {string} size - Size of the loader (small, medium, large)
 * @param {string} type - Type of loader (spinner, dots, bar)
 * @param {string} text - Optional text to display with the loader
 * @param {boolean} fullScreen - Whether the loader should cover the full screen
 * @param {string} className - Additional CSS class names
 * @param {object} rest - Additional props to pass to the container element
 */
const Loader = ({ 
    size = "medium", 
    type = "spinner", 
    text, 
    fullScreen = false, 
    className = "", 
    ...rest 
}) => {
    // Render different loader types
    const renderLoader = () => {
        switch (type) {
            case "dots":
                return (
                    <div className="Loader_dots">
                        <div className="Loader_dot"></div>
                        <div className="Loader_dot"></div>
                        <div className="Loader_dot"></div>
                    </div>
                );
            case "bar":
                return <div className="Loader_bar"></div>;
            case "spinner":
            default:
                return <div className="Loader_spinner"></div>;
        }
    };

    // Create the loader container class
    const loaderClass = `Loader Loader_${size} Loader_${type} ${fullScreen ? 'Loader_fullScreen' : ''} ${className}`;

    return (
        <div className={loaderClass} role="status" aria-live="polite" {...rest}>
            {renderLoader()}
            {text && <p className="Loader_text">{text}</p>}
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;