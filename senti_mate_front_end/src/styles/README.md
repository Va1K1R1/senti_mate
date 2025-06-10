# SentiMate Styling System

This document provides an overview of the styling system implemented for the SentiMate application.

## Overview

The SentiMate styling system is designed to provide a consistent, maintainable, and accessible user interface. It includes:

1. **CSS Variables**: Global CSS custom properties for colors, typography, spacing, etc.
2. **Utility Classes**: Reusable CSS classes for common patterns.
3. **Component-Specific CSS**: Modular CSS files for each component.
4. **Theme Support**: Light and dark theme support with easy switching.
5. **Responsive Design**: Mobile-first approach with responsive breakpoints.
6. **Accessibility Features**: Focus states, keyboard navigation, and semantic HTML.

## File Structure

```
src/
├── styles/
│   ├── variables.css     # CSS custom properties
│   ├── reset.css         # Browser normalization
│   ├── utilities.css     # Utility classes
│   ├── main.css          # Main CSS file that imports all others
│   ├── theme.js          # Theme switching functionality
│   └── StyleGuide.md     # Style guide documentation
├── component/
│   ├── Component.jsx     # React component
│   └── Component.css     # Component-specific CSS
└── index.css             # Entry point for styles
```

## CSS Variables

CSS variables are defined in `variables.css` and provide a consistent way to apply colors, spacing, typography, etc. across the application. This makes it easy to maintain and update the design system.

Example usage:
```css
.MyComponent {
    color: var(--text-color);
    background-color: var(--card-background);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
}
```

## Utility Classes

Utility classes are defined in `utilities.css` and provide a way to apply common CSS patterns without writing custom CSS. This reduces code duplication and ensures consistency.

Example usage:
```html
<div class="d-flex justify-content-between align-items-center p-md mb-lg">
    <h2 class="text-primary font-weight-bold">My Title</h2>
    <button class="btn btn-primary">Click Me</button>
</div>
```

## Theme Support

The application supports light and dark themes using CSS variables and React Context. The theme can be toggled using the ThemeToggle component, which is fixed to the bottom right corner of the screen.

The theme is stored in localStorage and respects the user's system preference for dark mode.

## Responsive Design

The application uses a mobile-first approach with responsive breakpoints defined in CSS variables. Media queries are used to adjust the layout and styling for different screen sizes.

Example usage:
```css
@media (max-width: var(--breakpoint-md)) {
    .MyComponent {
        flex-direction: column;
    }
}
```

## Accessibility

The application includes several accessibility features:

- Semantic HTML elements
- ARIA attributes
- Visible focus states
- Keyboard navigation
- Sufficient color contrast
- Text alternatives for non-text content

## Component Examples

Several components have been updated to use the new styling system:

- **Button**: A reusable button component with different variants.
- **TodoItem**: A component for displaying a single todo item.
- **TodoList**: A component for displaying a list of todo items.
- **DiaryItem**: A component for displaying a single diary entry.
- **DiaryList**: A component for displaying a list of diary entries.
- **ThemeToggle**: A component for toggling between light and dark themes.

## How to Use

1. Import the main CSS file in your component:
   ```jsx
   import '../styles/main.css';
   ```

2. Use CSS variables for consistent styling:
   ```css
   .MyComponent {
       color: var(--text-color);
       background-color: var(--card-background);
       padding: var(--spacing-md);
   }
   ```

3. Use utility classes for common patterns:
   ```html
   <div class="d-flex justify-content-between p-md">
       <h2 class="text-primary">My Title</h2>
       <button class="btn btn-primary">Click Me</button>
   </div>
   ```

4. Add responsive styles:
   ```css
   @media (max-width: var(--breakpoint-md)) {
       .MyComponent {
           flex-direction: column;
       }
   }
   ```

5. Add dark theme support:
   ```css
   .dark-theme .MyComponent {
       background-color: var(--card-background);
   }
   ```

6. Add accessibility features:
   ```css
   .MyComponent:focus-visible {
       outline: 2px solid var(--primary-color);
       outline-offset: 2px;
   }
   ```

## Conclusion

The SentiMate styling system provides a consistent, maintainable, and accessible user interface. By following the guidelines in this document and the StyleGuide.md file, developers can ensure that new components are styled consistently with the rest of the application.