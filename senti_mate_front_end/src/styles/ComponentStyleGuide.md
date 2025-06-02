# SentiMate Component Style Guide

This style guide provides guidelines for creating and styling components in the SentiMate application. Following these guidelines will ensure consistent styling across the application.

## Table of Contents

1. [CSS Structure](#css-structure)
2. [Naming Conventions](#naming-conventions)
3. [Colors](#colors)
4. [Typography](#typography)
5. [Spacing](#spacing)
6. [Borders and Shadows](#borders-and-shadows)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)
9. [Component Examples](#component-examples)

## CSS Structure

The SentiMate application uses a modular CSS approach with the following structure:

- **variables.css**: Contains CSS custom properties (variables) for colors, typography, spacing, etc.
- **reset.css**: Normalizes browser styles for consistent rendering.
- **utilities.css**: Provides utility classes for common CSS patterns.
- **main.css**: Imports all CSS files and defines global styles.
- **Component-specific CSS**: Each component has its own CSS file with the same name as the component.

When creating a new component, follow these steps:

1. Create a new component file (e.g., `MyComponent.jsx`).
2. Create a corresponding CSS file (e.g., `MyComponent.css`).
3. Import the CSS file in the component file.
4. Use CSS variables from `variables.css` for consistent styling.
5. Use utility classes from `utilities.css` when appropriate.

## Naming Conventions

### Component Names

- Use PascalCase for component names (e.g., `MyComponent`).
- Use descriptive names that reflect the component's purpose.

### CSS Class Names

- Use the component name as the main class name (e.g., `.MyComponent`).
- Use camelCase for child elements (e.g., `.MyComponent .headerSection`).
- Use BEM-like naming for variants (e.g., `.Button_primary`, `.Button_secondary`).

## Colors

Use CSS variables for colors to ensure consistency and support theme switching:

```css
/* Primary colors */
var(--primary-color)
var(--primary-color-dark)
var(--primary-color-light)

/* Secondary colors */
var(--secondary-color)
var(--secondary-color-dark)

/* Text colors */
var(--text-color)
var(--text-color-light)
var(--text-color-lighter)

/* Background colors */
var(--background-color)
var(--card-background)

/* Status colors */
var(--success-color)
var(--warning-color)
var(--error-color)
var(--info-color)
```

## Typography

Use CSS variables for font families, sizes, and weights:

```css
/* Font families */
var(--font-family-primary)
var(--font-family-secondary)

/* Font sizes */
var(--font-size-xs)
var(--font-size-sm)
var(--font-size-md)
var(--font-size-lg)
var(--font-size-xl)
var(--font-size-xxl)
```

## Spacing

Use CSS variables for spacing to ensure consistent layout:

```css
/* Spacing */
var(--spacing-xs)
var(--spacing-sm)
var(--spacing-md)
var(--spacing-lg)
var(--spacing-xl)
var(--spacing-xxl)
```

## Borders and Shadows

Use CSS variables for border radius and shadows:

```css
/* Border radius */
var(--border-radius-sm)
var(--border-radius-md)
var(--border-radius-lg)
var(--border-radius-xl)

/* Box shadow */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
```

## Responsive Design

Use media queries with CSS variables for breakpoints:

```css
@media (max-width: var(--breakpoint-xs)) {
  /* Styles for extra small screens */
}

@media (max-width: var(--breakpoint-sm)) {
  /* Styles for small screens */
}

@media (max-width: var(--breakpoint-md)) {
  /* Styles for medium screens */
}

@media (max-width: var(--breakpoint-lg)) {
  /* Styles for large screens */
}

@media (max-width: var(--breakpoint-xl)) {
  /* Styles for extra large screens */
}
```

## Accessibility

Ensure all components are accessible:

- Use semantic HTML elements.
- Provide appropriate ARIA attributes.
- Ensure sufficient color contrast.
- Support keyboard navigation.
- Make focus states visible.
- Provide text alternatives for non-text content.

## Component Examples

### Button Component

```jsx
// Button.jsx
import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'default', onClick, ...props }) => {
  return (
    <button 
      className={`Button Button_${variant}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

```css
/* Button.css */
.Button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.Button_default {
  background-color: var(--primary-color);
  color: white;
}

.Button_default:hover {
  background-color: var(--primary-color-dark);
}

.Button_secondary {
  background-color: var(--secondary-color);
  color: white;
}

.Button_secondary:hover {
  background-color: var(--secondary-color-dark);
}

/* Responsive styles */
@media (max-width: var(--breakpoint-sm)) {
  .Button {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
}
```

### Card Component

```jsx
// Card.jsx
import React from 'react';
import './Card.css';

const Card = ({ children, title, className = '', ...props }) => {
  return (
    <div className={`Card ${className}`} {...props}>
      {title && <h2 className="Card-title">{title}</h2>}
      <div className="Card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
```

```css
/* Card.css */
.Card {
  background-color: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.Card-title {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-color);
}

.Card-content {
  color: var(--text-color-light);
}

/* Dark theme styles */
.dark-theme .Card {
  background-color: var(--card-background);
}

/* Responsive styles */
@media (max-width: var(--breakpoint-md)) {
  .Card {
    padding: var(--spacing-md);
  }
  
  .Card-title {
    font-size: var(--font-size-md);
  }
}
```

By following these guidelines, we can ensure consistent styling across the SentiMate application and provide a better user experience.