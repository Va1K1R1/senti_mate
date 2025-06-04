import React, { useRef, useState } from "react";
import "./Button.css";

/**
 * Enhanced Button component with support for icons, loading state, disabled state, tooltips, and accessibility features
 * @param {string} text - Button text
 * @param {function} onClick - Click handler
 * @param {string} type - Button type (default, positive, negative)
 * @param {React.ReactNode} icon - Optional icon to display before text
 * @param {boolean} isLoading - Whether the button is in loading state
 * @param {boolean} disabled - Whether the button is disabled
 * @param {string} className - Additional CSS class names
 * @param {string} size - Button size (small, medium, large)
 * @param {boolean} fullWidth - Whether the button should take full width
 * @param {string} tooltip - Optional tooltip text
 * @param {string} ariaLabel - Accessible label for screen readers (defaults to text if not provided)
 * @param {object} rest - Additional props to pass to the button element
 */
const Button = ({ 
    text, 
    onClick, 
    type = "default", 
    icon, 
    isLoading = false,
    disabled = false, 
    className = "",
    size = "medium",
    fullWidth = false,
    tooltip = "",
    ariaLabel,
    ...rest 
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef(null);

    // Handle keyboard events for better accessibility
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled && !isLoading && onClick) {
                onClick(e);
            }
        }
    };

    // Show visual feedback on click
    const handleMouseDown = () => {
        if (!disabled && !isLoading && buttonRef.current) {
            buttonRef.current.classList.add('Button_pressed');
        }
    };

    const handleMouseUp = () => {
        if (buttonRef.current) {
            buttonRef.current.classList.remove('Button_pressed');
        }
    };

    return (
        <div 
            className={`Button_container ${fullWidth ? 'Button_fullWidth' : ''}`}
            onMouseEnter={() => tooltip && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => tooltip && setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
        >
            <button 
                ref={buttonRef}
                className={`Button Button_${type} Button_${size} ${className} ${disabled || isLoading ? 'Button_disabled' : ''} ${isLoading ? 'Button_loading' : ''} ${fullWidth ? 'Button_fullWidth' : ''}`} 
                onClick={disabled || isLoading ? undefined : onClick}
                onKeyDown={handleKeyDown}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                disabled={disabled || isLoading}
                aria-label={ariaLabel || text}
                aria-disabled={disabled || isLoading}
                aria-busy={isLoading}
                role="button"
                tabIndex={disabled ? -1 : 0}
                {...rest}
            >
                {isLoading ? (
                    <>
                        <span className="Button_spinner" aria-hidden="true"></span>
                        <span className="Button_loading_text">{text}</span>
                    </>
                ) : (
                    <>
                        {icon && <span className="Button_icon" aria-hidden="true">{icon}</span>}
                        {text}
                    </>
                )}
            </button>
            {tooltip && showTooltip && (
                <div className="Button_tooltip" role="tooltip">
                    {tooltip}
                </div>
            )}
        </div>
    );
};

export default Button;
