# SentiMate Frontend Development Guide

This document provides comprehensive guidelines for developing the frontend of the SentiMate project, a health diary web application built with React.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Component Structure](#component-structure)
4. [Development Workflow](#development-workflow)
5. [Prioritized Tasks](#prioritized-tasks)
6. [Coding Standards](#coding-standards)
7. [Testing Guidelines](#testing-guidelines)
8. [Performance Considerations](#performance-considerations)
9. [Accessibility Guidelines](#accessibility-guidelines)

## Project Overview

SentiMate is a health diary web application that allows users to track their emotions, health data, and receive personalized wellness advice. The frontend is built with React and Vite, and integrates with a Spring Boot backend.

### Key Features

- User authentication and authorization
- Health diary entries with emotion tracking
- Todo list management
- Integration with Samsung Health data
- Personalized wellness recommendations using ChatGPT
- Responsive design for mobile and desktop

### Technology Stack

- React with Vite
- React Router for routing
- Axios for API calls
- CSS for styling (no SCSS)
- React Context API for state management
- Jest and React Testing Library for testing

## Frontend Architecture

The frontend follows a component-based architecture with a clear separation of concerns:

### Directory Structure

```
src/
├── assets/         # Static assets (images, icons, etc.)
├── components/     # Reusable UI components
│   ├── common/     # Common components (Button, Input, etc.)
│   ├── diary/      # Diary-related components
│   ├── todo/       # Todo-related components
│   ├── health/     # Health data components
│   └── recommendation/ # Recommendation components
├── pages/          # Page components
├── services/       # API services
├── models/         # Data models matching backend entities
├── hooks/          # Custom hooks
├── utils/          # Utility functions
├── context/        # React Context for state management
├── App.jsx         # Main App component
└── main.jsx        # Entry point
```

### State Management

The application uses React Context API for global state management, with separate contexts for:

- Authentication state
- Diary entries
- Todo items
- Health data
- Recommendations
- Application settings

Local component state is used for UI-specific state that doesn't need to be shared.

### API Integration

The frontend communicates with the backend using Axios for HTTP requests. API services are organized by domain:

- `AuthService` - Authentication and user management
- `DiaryService` - Diary entry management
- `TodoService` - Todo item management
- `HealthDataService` - Health data integration
- `RecommendationService` - Recommendation management

## Component Structure

### Core Components

1. **Button** - Reusable button component with different variants
2. **Header** - Navigation header with app title and menu
3. **Clock** - Analog clock display
4. **DiaryItem** - Individual diary entry display
5. **DiaryList** - List of diary entries
6. **Editor** - Form for creating/editing diary entries
7. **EmotionItem** - Component for selecting emotion
8. **TodoItem** - Individual todo item
9. **TodoList** - List of todo items with add/edit/delete functionality
10. **Viewer** - Component for viewing diary entry details

### Page Components

1. **Home** - Main dashboard with diary list and todo list
2. **Diary** - Page for viewing a specific diary entry
3. **New** - Page for creating a new diary entry
4. **Edit** - Page for editing an existing diary entry
5. **Todo** - Dedicated page for todo list management
6. **Login/Register** - Authentication pages
7. **Dashboard** - Comprehensive health view
8. **Settings** - Application settings
9. **Profile** - User profile information

### Custom Hooks

1. **useDiary** - Hook for fetching and managing diary entries
2. **useAuth** - Hook for authentication state
3. **useForm** - Hook for form handling
4. **useApi** - Hook for API calls with loading and error states
5. **useLocalStorage** - Hook for persistent local storage

## Development Workflow

### Setup and Installation

1. Clone the repository
2. Navigate to the frontend directory: `cd senti_mate_front`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

### Development Process

1. **Feature Planning**
   - Review the feature requirements
   - Break down the feature into smaller tasks
   - Create a plan for implementation

2. **Component Development**
   - Create new components or modify existing ones
   - Implement component functionality
   - Style components using CSS
   - Write unit tests for components

3. **Integration**
   - Connect components to API services
   - Implement state management
   - Test integration with backend

4. **Testing**
   - Run unit tests: `npm test`
   - Perform manual testing
   - Fix any issues found during testing

5. **Code Review**
   - Submit code for review
   - Address review comments
   - Merge changes

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Feature branches
- `bugfix/bug-name` - Bug fix branches

## Prioritized Tasks

Based on the current state of the project, here are the prioritized tasks for frontend development:

### Phase 1: Foundation (High Priority)

1. **Project Structure Setup**
   - Create directory structure
   - Set up routing with React Router
   - Configure API service with Axios

2. **Core Component Development**
   - Implement Button component
   - Implement Header component
   - Implement TodoItem and TodoList components
   - Implement DiaryItem and DiaryList components

3. **Basic Pages**
   - Implement Home page with diary list and todo list
   - Implement Todo page for dedicated todo management

### Phase 2: Authentication and Data Management (High Priority)

1. **Authentication**
   - Implement Login/Register components
   - Set up authentication context
   - Implement protected routes

2. **Diary Management**
   - Implement Editor component for creating/editing diary entries
   - Implement Viewer component for viewing diary details
   - Implement Diary, New, and Edit pages

3. **State Management**
   - Set up context for diary entries
   - Set up context for todo items
   - Implement API integration for diary and todo

### Phase 3: Health Data and Recommendations (Medium Priority)

1. **Health Data Integration**
   - Implement health data components
   - Set up health data context
   - Implement API integration for health data

2. **Recommendation Features**
   - Implement recommendation components
   - Set up recommendation context
   - Implement API integration for recommendations

### Phase 4: User Experience Enhancements (Medium Priority)

1. **Responsive Design**
   - Implement mobile-first responsive design
   - Create responsive navigation
   - Ensure all components adapt to different screen sizes

2. **Performance Optimization**
   - Implement code splitting
   - Optimize bundle size
   - Implement lazy loading for routes and components

### Phase 5: Testing and Documentation (Medium Priority)

1. **Testing**
   - Set up Jest and React Testing Library
   - Write tests for components
   - Write tests for hooks and services

2. **Documentation**
   - Add JSDoc comments to components, hooks, and services
   - Create user guide
   - Create API documentation

### Phase 6: Advanced Features (Low Priority)

1. **Accessibility**
   - Ensure proper semantic HTML
   - Add ARIA attributes
   - Implement keyboard navigation

2. **Internationalization**
   - Set up i18n framework
   - Extract text to translation files
   - Implement language switching

## Coding Standards

### General Guidelines

- Use functional components with hooks instead of class components
- Use meaningful names for components, functions, and variables
- Keep components small and focused on a single responsibility
- Use prop types for component props
- Use destructuring for props and state
- Use async/await for asynchronous operations
- Use try/catch for error handling

### CSS Guidelines

- Use CSS modules for component styling
- Use a consistent naming convention for CSS classes
- Use CSS variables for colors, fonts, and spacing
- Use flexbox and grid for layout
- Use media queries for responsive design
- Avoid using !important
- Keep selectors simple and specific

### JavaScript Guidelines

- Use ES6+ features (arrow functions, destructuring, etc.)
- Use const for variables that don't change
- Use let for variables that change
- Avoid using var
- Use template literals for string concatenation
- Use optional chaining and nullish coalescing
- Use array and object spread operators
- Use async/await for promises

## Testing Guidelines

### Unit Testing

- Test component rendering
- Test component props
- Test component state changes
- Test component event handlers
- Test custom hooks
- Test utility functions
- Test API services with mock data

### Integration Testing

- Test component interactions
- Test form submissions
- Test API integration
- Test routing
- Test authentication flow

### End-to-End Testing

- Test critical user flows
- Test authentication
- Test diary entry management
- Test todo item management
- Test health data integration
- Test recommendation features

## Performance Considerations

- Use React.memo for expensive components
- Use useCallback for event handlers
- Use useMemo for expensive calculations
- Use code splitting for large components
- Use lazy loading for routes
- Optimize images and assets
- Minimize re-renders
- Use pagination for large lists
- Use virtualization for very large lists
- Implement caching for API responses

## Accessibility Guidelines

- Use semantic HTML elements
- Add alt text to images
- Use ARIA attributes when necessary
- Ensure proper keyboard navigation
- Implement focus management
- Ensure sufficient color contrast
- Test with screen readers
- Follow WCAG 2.1 AA standards