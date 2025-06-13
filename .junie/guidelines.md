# SentiMate Development Guidelines

This document provides essential information for developers working on the SentiMate project.

## Build/Configuration Instructions

### Prerequisites

- **Java 17 or higher**: The project requires Java 17 as specified in the build.gradle file.
- **MySQL Database**: The application uses MySQL as its database.
- **Gradle**: The project uses Gradle as its build system (Gradle wrapper is included).

### Building the Project

1. Clone the repository
2. Navigate to the `senti_mate_back_end` directory
3. Run the Gradle wrapper to build the project:

```bash
# On Windows
.\gradlew.bat build

# On Unix-based systems
./gradlew build
```

### Configuration

The application's configuration is stored in `application.properties` in the `src/main/resources` directory. Key configuration properties include:

- Database connection settings
- Server port
- Logging configuration
- External API configurations (like OpenAI)

For local development, you can create an `application-dev.properties` file with your specific configurations and run the application with the `dev` profile:

```bash
.\gradlew.bat bootRun --args='--spring.profiles.active=dev'
```

## Testing Information

### Test Structure

The project uses JUnit 5 (Jupiter) for testing with the following structure:

- **Unit Tests**: Located in packages matching the main code structure
- **Controller Tests**: Located in the `controller` package
- **End-to-End Tests**: Located in the `e2e` package

### Running Tests

To run all tests:

```bash
.\gradlew.bat test
```

To run a specific test class:

```bash
.\gradlew.bat test --tests "com.example.senti_mate_back_end.SimpleTest"
```

To run a specific test method:

```bash
.\gradlew.bat test --tests "com.example.senti_mate_back_end.SimpleTest.testSimpleAddition"
```

### Adding New Tests

1. Create a new test class in the appropriate package
2. Use the `@Test` annotation from JUnit 5 for test methods
3. For Spring Boot integration tests, use the `@SpringBootTest` annotation
4. For controller tests, use `@AutoConfigureMockMvc` and inject `MockMvc`

### Example Test

Here's a simple example test:

```java
package com.example.senti_mate_back_end;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SimpleTest {

    @Test
    public void testSimpleAddition() {
        assertEquals(4, 2 + 2, "2 + 2 should equal 4");
    }
}
```

For a more complex example, here's a controller test structure:

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    public void setup() {
        // Setup test data
    }
    
    @AfterEach
    public void cleanup() {
        // Clean up test data
    }
    
    @Test
    public void testCreateUser() throws Exception {
        // Test creating a user
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("testuser"));
    }
}
```

## Additional Development Information

### Code Style

The project follows these code style practices:

1. **Lombok**: Used extensively to reduce boilerplate code with annotations like `@Data`, `@Builder`, etc.
2. **JPA Entities**: Follow standard JPA patterns with appropriate annotations
3. **Validation**: Uses Jakarta validation annotations for input validation
4. **JSON Handling**: Uses Jackson annotations for controlling JSON serialization/deserialization
5. **Documentation**: Methods should have Javadoc comments, especially for public APIs

### Project Structure

The project follows a standard Spring Boot structure:

- `model`: Entity classes representing database tables
- `repository`: Spring Data JPA repositories
- `service`: Business logic services
- `controller`: REST API controllers
- `dto`: Data Transfer Objects for API requests/responses
- `exception`: Custom exception classes
- `config`: Configuration classes

### Database Migrations

The project uses Flyway for database migrations. Migration scripts are located in `src/main/resources/db/migration` and follow the naming convention `V{version}__{description}.sql`.

### Relationships Between Entities

- Entities use appropriate JPA annotations (`@OneToMany`, `@ManyToOne`, etc.) to define relationships
- Jackson annotations (`@JsonManagedReference`, `@JsonBackReference`) are used to handle bidirectional relationships in JSON serialization
- Lazy loading is used for most relationships to improve performance

### Testing Best Practices

1. Use appropriate test fixtures and avoid hardcoded test data
2. Clean up test data after tests to ensure test isolation
3. Use meaningful assertions that verify the expected behavior
4. For controller tests, verify both the status code and the response body
5. Use `@ActiveProfiles("test")` to use test-specific configurations

### Debugging

For debugging tests, you can add debug logs with:

```java
System.out.println("[DEBUG_LOG] Your debug message");
```

This prefix ensures the logs are properly captured and displayed in the test output.