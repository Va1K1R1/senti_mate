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
