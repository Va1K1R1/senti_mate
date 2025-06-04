import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../component/Modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders nothing when isOpen is false', () => {
    render(
      <Modal 
        isOpen={false} 
        onClose={mockOnClose} 
        title="Test Modal"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Test Modal"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Test Modal"
        showCloseButton={true}
      >
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('renders action buttons when provided', () => {
    const mockAction1 = jest.fn();
    const mockAction2 = jest.fn();
    
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Test Modal"
        actions={[
          { text: 'Cancel', onClick: mockOnClose, type: 'secondary' },
          { text: 'Confirm', onClick: mockAction1, type: 'primary' }
        ]}
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockAction1).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('renders with different sizes', () => {
    const { rerender } = render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Small Modal"
        size="small"
      >
        <p>Small modal content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog').classList.contains('modal-small')).toBe(true);
    
    rerender(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Large Modal"
        size="large"
      >
        <p>Large modal content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog').classList.contains('modal-large')).toBe(true);
  });
});