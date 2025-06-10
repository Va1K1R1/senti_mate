# Backend Development Guide for SentiMate Frontend

## Introduction

This guide provides comprehensive instructions for developing a new backend that integrates with the existing SentiMate frontend. SentiMate is a health diary web application that allows users to track their emotions, health data, and receive personalized recommendations.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Frontend Structure](#frontend-structure)
3. [Required Backend Components](#required-backend-components)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
6. [Authentication](#authentication)
7. [Implementation Examples](#implementation-examples)
8. [Testing](#testing)
9. [Deployment](#deployment)

## Project Overview

SentiMate is a health diary web application built with React on the frontend. The application allows users to:

- Create and manage diary entries with associated emotions
- Track health data (integrated with Samsung Health SDK)
- Receive personalized recommendations (using OpenAI ChatGPT API)
- Manage user profiles and settings

This guide focuses on implementing a backend that supports all the features required by the existing frontend.

## Frontend Structure

The frontend is built with React and includes the following main components:

### Pages
- **Home**: Dashboard with diary entries and todo list
- **Diary**: View, create, edit, and delete diary entries
- **Emotions**: Track and analyze emotions
- **HealthData**: View and manage health data
- **Recommendations**: View personalized recommendations
- **Profile**: Manage user profile
- **Settings**: Configure application settings
- **Authentication**: Login, Register, and Forgot Password

### State Management
The frontend uses Redux for state management, with separate slices for different features (e.g., todo, diary entries, authentication).

## Required Backend Components

To support the frontend, your backend should include:

1. **Authentication System**: JWT-based authentication with registration, login, and password reset
2. **User Management**: CRUD operations for user profiles
3. **Diary Entry Management**: CRUD operations for diary entries with search and filtering
4. **Emotion Tracking**: Store and analyze emotions associated with diary entries
5. **Health Data Integration**: Integration with Samsung Health SDK
6. **Recommendation System**: Integration with OpenAI ChatGPT API for personalized recommendations
7. **Todo Management**: CRUD operations for todo items

## Data Models

Your backend should implement the following data models:

### User
```java
public class User {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private boolean isActive;
    private boolean isEmailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<DiaryEntry> diaryEntries;
    private List<HealthData> healthData;
    private List<Recommendation> recommendations;
    private Set<Role> roles;
}
```

### Role
```java
public class Role {
    private Long id;
    private String name;
}
```

### DiaryEntry
```java
public class DiaryEntry {
    private Long id;
    private String title;
    private String content;
    private Integer moodScore;
    private LocalDateTime entryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private User user;
    private List<Emotion> emotions;
}
```

### Emotion
```java
public class Emotion {
    private Long id;
    private String name;
    private String description;
    private String color;
    private String icon;
}
```

### HealthData
```java
public class HealthData {
    private Long id;
    private String dataType;
    private Double value;
    private String unit;
    private LocalDateTime recordedAt;
    private LocalDateTime createdAt;
    private User user;
}
```

### Recommendation
```java
public class Recommendation {
    private Long id;
    private String content;
    private String category;
    private LocalDateTime createdAt;
    private User user;
}
```

### Todo
```java
public class Todo {
    private Long id;
    private String text;
    private boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private User user;
}
```

## API Endpoints

Your backend should implement the following API endpoints:

### Authentication
- `POST /api/auth/login`: Authenticate user and return JWT token
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/forgot-password`: Initiate password reset
- `POST /api/auth/reset-password`: Reset password with token

### User Management
- `GET /api/users/{id}`: Get user by ID
- `PUT /api/users/{id}`: Update user profile
- `DELETE /api/users/{id}`: Delete user account
- `GET /api/users/me`: Get current user profile

### Diary Entries
- `GET /api/diary-entries/user/{userId}`: Get all diary entries for a user
- `GET /api/diary-entries/user/{userId}/paged`: Get paginated diary entries for a user
- `GET /api/diary-entries/{id}`: Get diary entry by ID
- `POST /api/diary-entries/user/{userId}`: Create a new diary entry
- `PUT /api/diary-entries/{id}`: Update an existing diary entry
- `DELETE /api/diary-entries/{id}`: Delete a diary entry
- `GET /api/diary-entries/user/{userId}/search/title`: Search diary entries by title
- `GET /api/diary-entries/user/{userId}/search/content`: Search diary entries by content
- `GET /api/diary-entries/user/{userId}/filter/date`: Filter diary entries by date range
- `GET /api/diary-entries/user/{userId}/filter/mood`: Filter diary entries by mood score range
- `GET /api/diary-entries/user/{userId}/count`: Count diary entries for a user
- `GET /api/diary-entries/user/{userId}/average-mood`: Get average mood score for a user

### Emotions
- `GET /api/emotions`: Get all emotions
- `GET /api/emotions/{id}`: Get emotion by ID
- `POST /api/emotions`: Create a new emotion
- `PUT /api/emotions/{id}`: Update an existing emotion
- `DELETE /api/emotions/{id}`: Delete an emotion
- `GET /api/emotions/user/{userId}/stats`: Get emotion statistics for a user

### Health Data
- `GET /api/health-data/user/{userId}`: Get all health data for a user
- `GET /api/health-data/user/{userId}/type/{dataType}`: Get health data by type for a user
- `POST /api/health-data/user/{userId}`: Create new health data
- `DELETE /api/health-data/{id}`: Delete health data
- `GET /api/health-data/user/{userId}/stats`: Get health data statistics for a user
- `POST /api/health-data/user/{userId}/sync`: Sync health data from Samsung Health

### Recommendations
- `GET /api/recommendations/user/{userId}`: Get all recommendations for a user
- `GET /api/recommendations/{id}`: Get recommendation by ID
- `POST /api/recommendations/user/{userId}`: Create a new recommendation
- `DELETE /api/recommendations/{id}`: Delete a recommendation
- `POST /api/recommendations/user/{userId}/generate`: Generate recommendations using ChatGPT

### Todo
- `GET /api/todos/user/{userId}`: Get all todos for a user
- `POST /api/todos/user/{userId}`: Create a new todo
- `PUT /api/todos/{id}`: Update a todo (toggle completion)
- `DELETE /api/todos/{id}`: Delete a todo

## Authentication

The frontend expects JWT-based authentication. Your backend should:

1. Implement user registration and login
2. Generate JWT tokens upon successful authentication
3. Validate JWT tokens for protected endpoints
4. Implement password reset functionality

### Example JWT Configuration

```java
@Configuration
public class SecurityConfig {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(new JwtAuthenticationFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Example JWT Token Provider

```java
@Component
public class JwtTokenProvider {
    
    @Value("${app.jwtSecret}")
    private String jwtSecret;
    
    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;
    
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
        
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        
        return claims.getSubject();
    }
    
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
```

## Implementation Examples

### Authentication Controller

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Check if username is already taken
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already in use
        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(signUpRequest.getPassword())
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .isActive(true)
                .isEmailVerified(false)
                .build();

        userService.createUser(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("User registered successfully!"));
    }
}
```

### Diary Entry Controller

```java
@RestController
@RequestMapping("/api/diary-entries")
public class DiaryEntryController {

    private final DiaryEntryService diaryEntryService;

    @Autowired
    public DiaryEntryController(DiaryEntryService diaryEntryService) {
        this.diaryEntryService = diaryEntryService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DiaryEntry>> getAllDiaryEntriesByUser(@PathVariable Long userId) {
        try {
            List<DiaryEntry> diaryEntries = diaryEntryService.findAllByUser(userId);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiaryEntry> getDiaryEntryById(@PathVariable Long id) {
        return diaryEntryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<DiaryEntry> createDiaryEntry(
            @PathVariable Long userId,
            @Valid @RequestBody DiaryEntry diaryEntry) {
        try {
            DiaryEntry createdDiaryEntry = diaryEntryService.createDiaryEntry(userId, diaryEntry);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDiaryEntry);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiaryEntry> updateDiaryEntry(
            @PathVariable Long id,
            @Valid @RequestBody DiaryEntry diaryEntry) {
        try {
            DiaryEntry updatedDiaryEntry = diaryEntryService.updateDiaryEntry(id, diaryEntry);
            return ResponseEntity.ok(updatedDiaryEntry);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiaryEntry(@PathVariable Long id) {
        try {
            diaryEntryService.deleteDiaryEntry(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

## Testing

To ensure your backend works correctly with the frontend, you should:

1. Implement unit tests for all services and repositories
2. Implement integration tests for all controllers
3. Test the API endpoints with tools like Postman or curl
4. Test the integration with the frontend by running both applications locally

### Example Test

```java
@SpringBootTest
public class DiaryEntryServiceTest {

    @Autowired
    private DiaryEntryService diaryEntryService;

    @Autowired
    private UserService userService;

    @Test
    public void testCreateDiaryEntry() {
        // Create a test user
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .build();
        User savedUser = userService.createUser(user);

        // Create a diary entry
        DiaryEntry diaryEntry = DiaryEntry.builder()
                .title("Test Diary Entry")
                .content("This is a test diary entry")
                .moodScore(5)
                .entryDate(LocalDateTime.now())
                .build();

        DiaryEntry savedDiaryEntry = diaryEntryService.createDiaryEntry(savedUser.getId(), diaryEntry);

        // Verify the diary entry was created
        assertNotNull(savedDiaryEntry.getId());
        assertEquals("Test Diary Entry", savedDiaryEntry.getTitle());
        assertEquals("This is a test diary entry", savedDiaryEntry.getContent());
        assertEquals(5, savedDiaryEntry.getMoodScore());
        assertEquals(savedUser.getId(), savedDiaryEntry.getUser().getId());
    }
}
```

## Deployment

To deploy your backend:

1. Build the application using your preferred build tool (e.g., Maven, Gradle)
2. Configure environment-specific properties (database connection, JWT secret, etc.)
3. Deploy the application to your preferred hosting platform (e.g., AWS, Heroku, Azure)
4. Configure CORS to allow requests from your frontend application
5. Set up a CI/CD pipeline for automated testing and deployment

### Example application.properties for Production

```properties
# Database Configuration
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
app.jwtSecret=${JWT_SECRET}
app.jwtExpirationInMs=86400000

# CORS Configuration
app.cors.allowedOrigins=${ALLOWED_ORIGINS}

# Server Configuration
server.port=${PORT:8080}
```

### Example CORS Configuration

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowedOrigins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

By following this guide, you should be able to create a backend that integrates seamlessly with the existing SentiMate frontend.