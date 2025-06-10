# SentiMate Style Guide

This style guide provides guidelines for creating and styling components in the SentiMate application. Following these guidelines will ensure consistent styling across the application.

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

Use CSS variables for colors to ensure consistency and support theme switching. Refer to `variables.css` for the complete list of color variables.

## Typography

Use CSS variables for font families, sizes, and weights. Refer to `variables.css` for the complete list of typography variables.

## Spacing

Use CSS variables for spacing to ensure consistent layout. Refer to `variables.css` for the complete list of spacing variables.

## Borders and Shadows

Use CSS variables for border radius and shadows. Refer to `variables.css` for the complete list of border and shadow variables.

## Responsive Design

Use media queries with CSS variables for breakpoints. Refer to `variables.css` for the complete list of breakpoint variables.

## Accessibility

Ensure all components are accessible:

- Use semantic HTML elements.
- Provide appropriate ARIA attributes.
- Ensure sufficient color contrast.
- Support keyboard navigation.
- Make focus states visible.
- Provide text alternatives for non-text content.

## Component Examples

For examples of well-structured components, refer to:

- `Button.jsx` and `Button.css`: A reusable button component with different variants.
- `ThemeToggle.jsx` and `ThemeToggle.css`: A component for toggling between light and dark themes.

By following these guidelines, we can ensure consistent styling across the SentiMate application and provide a better user experience.