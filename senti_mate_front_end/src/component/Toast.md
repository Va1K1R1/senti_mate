# Toast Component

The Toast component provides a way to display non-intrusive notifications to users. It's designed to be flexible, accessible, and easy to use throughout the application.

## Features

- Multiple toast types: success, error, warning, info
- Auto-dismiss after configurable duration
- Manually dismissable with close button
- Stacked notifications
- Responsive design (adjusts for mobile devices)
- Accessible (ARIA attributes, keyboard navigation)
- Dark mode support
- Animation effects

## Usage

### Basic Usage

```jsx
import { useToastContext } from '../context/ToastContext';

const MyComponent = () => {
  const toast = useToastContext();
  
  const handleClick = () => {
    toast.success('Operation completed successfully!');
  };
  
  return (
    <button onClick={handleClick}>
      Show Success Toast
    </button>
  );
};
```

### Available Methods

The `useToastContext` hook provides the following methods:

- `addToast(message, type, duration)`: Add a toast with custom type and duration
- `success(message, duration)`: Add a success toast
- `error(message, duration)`: Add an error toast
- `warning(message, duration)`: Add a warning toast
- `info(message, duration)`: Add an info toast
- `removeToast(id)`: Remove a specific toast by ID
- `clearToasts()`: Remove all toasts

### Setup

To use toasts in your application, wrap your app with the `ToastProvider`:

```jsx
// In your App.jsx or index.jsx
import { ToastProvider } from './context/ToastContext';

const App = () => {
  return (
    <ToastProvider>
      {/* Your app components */}
    </ToastProvider>
  );
};
```

## Examples

### Different Toast Types

```jsx
const ToastDemo = () => {
  const toast = useToastContext();
  
  return (
    <div>
      <button onClick={() => toast.success('Success message')}>
        Success Toast
      </button>
      
      <button onClick={() => toast.error('Error message')}>
        Error Toast
      </button>
      
      <button onClick={() => toast.warning('Warning message')}>
        Warning Toast
      </button>
      
      <button onClick={() => toast.info('Info message')}>
        Info Toast
      </button>
    </div>
  );
};
```

### Custom Duration

```jsx
// Toast will stay for 5 seconds (5000ms)
toast.info('This will stay longer', 5000);

// Toast will stay for 1 second (1000ms)
toast.success('Quick notification', 1000);
```

### Advanced Usage

```jsx
const AdvancedToastDemo = () => {
  const toast = useToastContext();
  
  const handleComplexOperation = async () => {
    try {
      // Show a loading toast that doesn't auto-dismiss
      const loadingToastId = toast.info('Operation in progress...', 0);
      
      // Perform async operation
      await someAsyncOperation();
      
      // Remove the loading toast
      toast.removeToast(loadingToastId);
      
      // Show success toast
      toast.success('Operation completed successfully!');
    } catch (error) {
      toast.error(`Operation failed: ${error.message}`);
    }
  };
  
  return (
    <button onClick={handleComplexOperation}>
      Start Complex Operation
    </button>
  );
};
```

## Accessibility

The Toast component includes the following accessibility features:

- ARIA role="alert" for screen readers
- aria-live="assertive" to announce toast messages
- Keyboard-accessible close button
- Focus management
- Sufficient color contrast
- Visible focus indicators