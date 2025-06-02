# SentiMate Project Guidelines

This document provides guidelines for developing and maintaining the SentiMate project, a health diary web application built with Spring Boot and React.

## Build/Configuration Instructions

### Backend (Spring Boot)

#### Prerequisites
- Java 17 or higher
- Gradle 8.x or higher (or use the included Gradle wrapper)

#### Building and Running
1. Navigate to the backend directory:
   ```bash
   cd senti_mate_back_end
   ```

2. Build the project:
   ```bash
   ./gradlew build
   ```

3. Run the application:
   ```bash
   ./gradlew bootRun
   ```

4. The application will be available at `http://localhost:8080`

#### Configuration
The application is configured using `application.properties` in the `src/main/resources` directory. For development, you may want to configure:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/sentimate_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080
```

### Frontend (React)

#### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

#### Building and Running
1. Navigate to the frontend directory:
   ```bash
   cd senti_mate_front_end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`

5. Build for production:
   ```bash
   npm run build
   ```

## Testing Information

### Backend Testing

#### Running Tests
To run all tests:
```bash
cd senti_mate_back_end
./gradlew test
```

To run a specific test class:
```bash
./gradlew test --tests "com.example.senti_mate_back_end.service.GreetingServiceTest"
```

#### Adding New Tests
1. Create a new test class in the `src/test/java` directory, following the same package structure as the class you're testing.
2. Use JUnit 5 annotations (`@Test`, `@BeforeEach`, etc.) to define your tests.
3. Use Spring Boot testing annotations (`@SpringBootTest`, `@WebMvcTest`, etc.) as needed.

#### Example Test
Here's an example of a service test:

```java
package com.example.senti_mate_back_end.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class GreetingServiceTest {

    @Autowired
    private GreetingService greetingService;

    @Test
    public void testGreetWithName() {
        // Given
        String name = "John";

        // When
        String greeting = greetingService.greet(name);

        // Then
        assertEquals("Hello, John!", greeting);
    }

    @Test
    public void testGreetWithNullName() {
        // Given
        String name = null;

        // When
        String greeting = greetingService.greet(name);

        // Then
        assertEquals("Hello, Guest!", greeting);
    }
}
```

### Frontend Testing

#### Running Tests
To run all tests:
```bash
cd senti_mate_front_end
npm test
```

#### Adding New Tests
1. Create a new test file with the `.test.js` or `.spec.js` extension next to the component you're testing.
2. Use Jest and React Testing Library to write your tests.

## Additional Development Information

### Code Style

#### Backend (Java)
- Follow the [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- Use meaningful names for classes, methods, and variables
- Write Javadoc comments for public classes and methods
- Use constructor injection for dependencies
- Prefer immutable objects when possible

#### Frontend (React)
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with hooks instead of class components
- Use meaningful names for components, functions, and variables
- Use ESLint and Prettier for code formatting

### Project Structure

#### Backend
The backend follows a standard Spring Boot project structure:
- `src/main/java`: Java source code
  - `com.example.senti_mate_back_end`: Root package
    - `controller`: REST controllers
    - `service`: Business logic
    - `repository`: Data access
    - `model`: Domain models
    - `config`: Configuration classes
    - `exception`: Custom exceptions
    - `util`: Utility classes
- `src/main/resources`: Configuration files and static resources
- `src/test/java`: Test source code

#### Frontend
The frontend follows a standard React project structure:
- `src`: Source code
  - `components`: Reusable UI components
  - `pages`: Page components
  - `services`: API services
  - `hooks`: Custom hooks
  - `utils`: Utility functions
  - `assets`: Static assets
  - `styles`: CSS/SCSS files

### Debugging

#### Backend
- Use logging with SLF4J and Logback
- Configure logging levels in `application.properties`
- Use Spring Boot Actuator for monitoring and metrics

#### Frontend
- Use React Developer Tools browser extension
- Use console.log for debugging (remove before committing)
- Use the browser's developer tools for network and performance debugging

### Database

#### MySQL Configuration
- Use MySQL 8.0 or higher
- Create a dedicated database for the application
- Create a dedicated user with limited privileges
- Use connection pooling (HikariCP is included with Spring Boot)
- Use indexes for frequently queried columns
- Consider using a migration tool like Flyway or Liquibase for database schema changes

## API Documentation

### Available APIs
The project uses the following external APIs:

#### Samsung Health SDK Web API
For health data integration, refer to the detailed documentation in `api_doc.md` which includes:
- Authentication flow using OAuth 2.0
- Endpoints for retrieving step count, heart rate, sleep, and exercise data
- Example requests and responses
- Java/Spring Boot implementation examples

#### OpenAI ChatGPT API
For emotion analysis and personalized wellness advice, refer to the detailed documentation in `api_doc.md` which includes:
- Authentication using API keys
- Chat Completions API usage
- Prompt engineering for health diary analysis
- Java/Spring Boot implementation examples
- Token usage optimization techniques

For complete API implementation details, code examples, and best practices, please refer to the comprehensive documentation in `api_doc.md`.

# SentiMate Project Task List

This document outlines the tasks required to develop and maintain the SentiMate project, a health diary web application built with Spring Boot and React, following the provided guidelines.

## Backend Tasks (Spring Boot)

### Setup and Configuration
- [x] Initialize Spring Boot project
- [x] Configure basic application properties
- [ ] Configure MySQL database connection
- [ ] Set up Spring Security with JWT authentication
- [ ] Configure CORS for frontend integration
- [ ] Set up logging with SLF4J and Logback
- [ ] Configure Spring Boot Actuator for monitoring

### Domain Model Development
- [ ] Create User entity with authentication fields
- [ ] Create DiaryEntry entity for health diary entries
- [ ] Create Emotion entity for emotion tracking
- [ ] Create HealthData entity for Samsung Health integration
- [ ] Create Recommendation entity for ChatGPT recommendations
- [ ] Implement entity relationships and validations

### Repository Layer
- [ ] Create UserRepository interface
- [ ] Create DiaryEntryRepository interface
- [ ] Create EmotionRepository interface
- [ ] Create HealthDataRepository interface
- [ ] Create RecommendationRepository interface
- [ ] Implement custom query methods as needed

### Service Layer
- [x] Create GreetingService for testing demonstration
- [ ] Create UserService for user management
- [ ] Create DiaryEntryService for diary entry management
- [ ] Create EmotionService for emotion tracking
- [ ] Create HealthDataService for Samsung Health integration
- [ ] Create RecommendationService for ChatGPT integration
- [ ] Implement business logic and validation

### Controller Layer
- [ ] Create AuthController for authentication endpoints
- [ ] Create UserController for user management endpoints
- [ ] Create DiaryEntryController for diary entry endpoints
- [ ] Create EmotionController for emotion tracking endpoints
- [ ] Create HealthDataController for Samsung Health endpoints
- [ ] Create RecommendationController for ChatGPT endpoints
- [ ] Implement request validation and error handling

### External API Integration
- [ ] Implement Samsung Health SDK Web API integration
  - [ ] Set up OAuth 2.0 authentication flow
  - [ ] Implement endpoints for retrieving health data
  - [ ] Handle data synchronization and storage
- [ ] Implement OpenAI ChatGPT API integration
  - [ ] Set up API key authentication
  - [ ] Implement prompt engineering for health diary analysis
  - [ ] Handle token usage optimization

### Security
- [ ] Implement user registration and login
- [ ] Implement JWT token generation and validation
- [ ] Implement role-based access control
- [ ] Implement password encryption
- [ ] Implement secure API endpoints
- [ ] Implement CSRF protection

## Frontend Tasks (React)

### Setup and Configuration
- [x] Initialize React project with Vite
- [ ] Set up project structure (components, pages, services, hooks, utils, assets, styles)
- [ ] Configure routing with React Router
- [ ] Set up state management with React Context or Redux
- [ ] Configure API service with Axios
- [ ] Set up environment variables for different environments

### Component Development
- [ ] Create layout components (Header, Footer, Sidebar, etc.)
- [ ] Create authentication components (Login, Register, ForgotPassword, etc.)
- [ ] Create diary entry components (DiaryForm, DiaryList, DiaryDetail, etc.)
- [ ] Create emotion tracking components (EmotionSelector, EmotionChart, etc.)
- [ ] Create health data components (HealthDataDashboard, HealthDataChart, etc.)
- [ ] Create recommendation components (RecommendationList, RecommendationDetail, etc.)
- [ ] Implement responsive design for all components

### Page Development
- [ ] Create Home page
- [ ] Create Login/Register pages
- [ ] Create Dashboard page
- [ ] Create Diary page
- [ ] Create Emotions page
- [ ] Create Health Data page
- [ ] Create Recommendations page
- [ ] Create Settings page
- [ ] Create Profile page

### Service Development
- [ ] Create AuthService for authentication API calls
- [ ] Create UserService for user API calls
- [ ] Create DiaryService for diary entry API calls
- [ ] Create EmotionService for emotion API calls
- [ ] Create HealthDataService for health data API calls
- [ ] Create RecommendationService for recommendation API calls

### Hook Development
- [ ] Create useAuth hook for authentication state
- [ ] Create useForm hook for form handling
- [ ] Create useApi hook for API calls
- [ ] Create useLocalStorage hook for local storage
- [ ] Create custom hooks for specific features

### Styling
- [ ] Set up CSS/SCSS structure
- [ ] Implement responsive design
- [ ] Implement theme support (light/dark mode)
- [ ] Implement consistent styling across the application
- [ ] Ensure accessibility compliance

## Testing Tasks

### Backend Testing
- [x] Set up JUnit 5 and Spring Boot Test
- [x] Create GreetingServiceTest for demonstration
- [ ] Create unit tests for all services
- [ ] Create unit tests for all repositories
- [ ] Create integration tests for all controllers
- [ ] Create end-to-end tests for critical flows
- [ ] Set up test coverage reporting

### Frontend Testing
- [ ] Set up Jest and React Testing Library
- [ ] Create unit tests for all components
- [ ] Create unit tests for all hooks
- [ ] Create unit tests for all services
- [ ] Create integration tests for pages
- [ ] Create end-to-end tests with Cypress
- [ ] Set up test coverage reporting

## Documentation Tasks

### Backend Documentation
- [ ] Create API documentation with Swagger/OpenAPI
- [ ] Document all services with Javadoc
- [ ] Document all controllers with Javadoc
- [ ] Document all repositories with Javadoc
- [ ] Document all entities with Javadoc
- [ ] Create README.md with setup and usage instructions

### Frontend Documentation
- [ ] Document all components with JSDoc
- [ ] Document all hooks with JSDoc
- [ ] Document all services with JSDoc
- [ ] Document all utilities with JSDoc
- [ ] Create README.md with setup and usage instructions

### Project Documentation
- [ ] Create comprehensive README.md for the entire project
- [ ] Create CONTRIBUTING.md for contribution guidelines
- [ ] Create CHANGELOG.md for version history
- [ ] Create LICENSE file
- [ ] Create documentation for deployment process
- [ ] Create documentation for CI/CD pipeline

## DevOps Tasks

### Continuous Integration
- [ ] Set up GitHub Actions for CI
- [ ] Configure build and test automation
- [ ] Set up code quality checks (SonarQube, ESLint, etc.)
- [ ] Set up security scanning (OWASP Dependency Check, etc.)
- [ ] Set up test coverage reporting

### Continuous Deployment
- [ ] Set up GitHub Actions for CD
- [ ] Configure deployment to development environment
- [ ] Configure deployment to staging environment
- [ ] Configure deployment to production environment
- [ ] Set up rollback procedures

### Monitoring and Logging
- [ ] Set up logging with ELK stack or similar
- [ ] Set up monitoring with Prometheus and Grafana
- [ ] Set up alerting for critical issues
- [ ] Set up performance monitoring
- [ ] Set up error tracking

## Database Tasks

### Schema Design
- [ ] Design database schema for all entities
- [ ] Create database migration scripts
- [ ] Set up database versioning with Flyway or Liquibase
- [ ] Optimize database schema for performance
- [ ] Implement database indexing strategy

### Data Management
- [ ] Implement data backup and recovery procedures
- [ ] Implement data archiving strategy
- [ ] Implement data purging strategy
- [ ] Implement data migration strategy
- [ ] Implement data validation and cleaning procedures

## Security Tasks

### Security Auditing
- [ ] Conduct security audit of backend code
- [ ] Conduct security audit of frontend code
- [ ] Conduct security audit of database
- [ ] Conduct security audit of API endpoints
- [ ] Conduct security audit of authentication flow

### Security Implementation
- [ ] Implement secure password storage
- [ ] Implement secure API communication
- [ ] Implement secure data storage
- [ ] Implement secure file uploads
- [ ] Implement secure user sessions
- [ ] Implement rate limiting and throttling

## Performance Tasks

### Performance Optimization
- [ ] Optimize database queries
- [ ] Optimize API response times
- [ ] Optimize frontend rendering
- [ ] Implement caching strategy
- [ ] Implement lazy loading for frontend components
- [ ] Optimize asset loading and bundling

## Accessibility Tasks

### Accessibility Implementation
- [ ] Ensure all components meet WCAG 2.1 AA standards
- [ ] Implement keyboard navigation
- [ ] Implement screen reader support
- [ ] Implement high contrast mode
- [ ] Conduct accessibility audit
- [ ] Fix accessibility issues

## Internationalization Tasks

### Internationalization Implementation
- [ ] Set up i18n framework
- [ ] Create translation files for supported languages
- [ ] Implement language switching
- [ ] Ensure all text is translatable
- [ ] Test application with different languages

## Mobile Responsiveness Tasks

### Mobile Responsiveness Implementation
- [ ] Ensure all pages are responsive
- [ ] Optimize for mobile devices
- [ ] Implement mobile-specific features
- [ ] Test on various mobile devices
- [ ] Implement progressive web app features

## Deployment Tasks

### Deployment Preparation
- [ ] Create production build scripts
- [ ] Configure environment variables for production
- [ ] Set up domain and SSL certificates
- [ ] Configure web server (Nginx, Apache, etc.)
- [ ] Set up database for production

### Deployment Execution
- [ ] Deploy backend to production server
- [ ] Deploy frontend to production server
- [ ] Configure load balancing if needed
- [ ] Set up monitoring for production
- [ ] Conduct post-deployment testing
