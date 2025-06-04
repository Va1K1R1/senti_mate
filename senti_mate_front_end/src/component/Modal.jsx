import React, { useEffect, useRef } from 'react';
import './Modal.css';
import Button from './Button';

/**
 * Modal component for displaying dialogs and confirmations
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size (small, medium, large)
 * @param {boolean} props.showCloseButton - Whether to show the close button
 * @param {Array} props.actions - Array of action buttons to display in the footer
 * @returns {React.ReactElement} Modal component
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium', 
  showCloseButton = true,
  actions = []
}) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div 
        className={`modal-container modal-${size}`} 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          {showCloseButton && (
            <button 
              className="modal-close-button" 
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          )}
        </div>
        <div className="modal-content">
          {children}
        </div>
        {actions.length > 0 && (
          <div className="modal-footer">
            {actions.map((action, index) => (
              <Button 
                key={index}
                text={action.text}
                onClick={action.onClick}
                type={action.type || 'default'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;