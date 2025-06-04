# SentiMate Component Documentation

## Modal Component

The Modal component is a reusable dialog and confirmation component for the SentiMate application.

### Features

- Customizable title and content
- Optional close button in the header
- Support for custom action buttons in the footer
- Three size options: small, medium (default), and large
- Accessibility features for screen readers
- Closes when clicking outside or pressing the Escape key
- Prevents scrolling of the background content when open
- Smooth animations for opening and closing

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | required | Controls whether the modal is visible |
| `onClose` | function | required | Function called when the modal is closed |
| `title` | string | required | Title displayed in the modal header |
| `children` | React.ReactNode | required | Content to display in the modal body |
| `size` | string | 'medium' | Size of the modal: 'small', 'medium', or 'large' |
| `showCloseButton` | boolean | true | Whether to show the close button in the header |
| `actions` | Array | [] | Array of action button objects to display in the footer |

#### Action Button Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `text` | string | Text to display on the button |
| `onClick` | function | Function to call when the button is clicked |
| `type` | string | Button type: 'primary', 'secondary', 'danger', etc. |

### Usage Examples

#### Basic Modal

```jsx
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <div>
      <Button text="Open Modal" onClick={openModal} type="primary" />
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Example Modal"
      >
        <p>This is the content of the modal.</p>
      </Modal>
    </div>
  );
};
```

#### Modal with Action Buttons

```jsx
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleSave = () => {
    // Save logic here
    closeModal();
  };
  
  return (
    <div>
      <Button text="Open Modal" onClick={openModal} type="primary" />
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Confirmation"
        actions={[
          { text: 'Cancel', onClick: closeModal, type: 'secondary' },
          { text: 'Save', onClick: handleSave, type: 'primary' }
        ]}
      >
        <p>Are you sure you want to save these changes?</p>
      </Modal>
    </div>
  );
};
```

### Accessibility

The Modal component includes several accessibility features:

- Proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)
- Focus management (focus is trapped inside the modal when open)
- Keyboard navigation (close with Escape key)
- Screen reader support

### Styling

The Modal component uses CSS variables from the project's theme for consistent styling:

- Background colors use `--card-background`
- Text colors use `--text-color` and `--text-color-light`
- Border colors use `--border-color`

Custom styling can be applied by targeting the following CSS classes:

- `.modal-overlay`: The overlay that covers the page
- `.modal-container`: The modal container
- `.modal-header`: The modal header
- `.modal-title`: The modal title
- `.modal-close-button`: The close button
- `.modal-content`: The modal content area
- `.modal-footer`: The modal footer with action buttons

### See Also

For more detailed examples, see the `ModalExample.jsx` file in the examples directory.