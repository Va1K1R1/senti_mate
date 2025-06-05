# SentiMate Environment Configuration

This document provides information about the environment configuration for the SentiMate project, including how to set up and configure the application for different environments (development, staging, and production).

## Overview

The SentiMate application is configured to run in three different environments:

1. **Development**: Used for local development and testing
2. **Staging**: Used for testing in a production-like environment
3. **Production**: Used for the live application

Each environment has its own configuration files and environment variables.

## Frontend Configuration

### Environment Files

The frontend uses environment files to configure environment-specific variables:

- `.env.development`: Configuration for the development environment
- `.env.staging`: Configuration for the staging environment
- `.env.production`: Configuration for the production environment

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_BASE_URL | Base URL for API requests | http://localhost:8080/api |
| VITE_AUTH_ENABLED | Whether authentication is enabled | true |
| VITE_FEATURE_HEALTH_DATA | Whether health data features are enabled | true |
| VITE_FEATURE_RECOMMENDATIONS | Whether recommendation features are enabled | true |
| VITE_LOG_LEVEL | Logging level | debug, info, error |

### Development Environment

The development environment is configured to use a local backend server running on port 8080. The frontend development server is configured to proxy API requests to the backend server to avoid CORS issues.

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    }
  }
}
```

### Staging Environment

The staging environment is configured to use a staging backend server. The frontend is built with the staging environment variables and deployed to a staging server.

### Production Environment

The production environment is configured to use the production backend server. The frontend is built with the production environment variables and deployed to the production server.

## Backend Configuration

### Properties Files

The backend uses properties files to configure environment-specific properties:

- `application.properties`: Default configuration (used for development)
- `application-staging.properties`: Configuration for the staging environment
- `application-production.properties`: Configuration for the production environment

### Environment Variables

The backend uses environment variables for sensitive information and environment-specific configuration. These variables are referenced in the properties files using the `${VARIABLE_NAME}` syntax.

| Variable | Description | Used In |
|----------|-------------|---------|
| DB_USERNAME | Database username | All environments |
| DB_PASSWORD | Database password | All environments |
| JWT_SECRET | Secret key for JWT token generation | All environments |
| ADMIN_USERNAME | Admin username | All environments |
| ADMIN_PASSWORD | Admin password | All environments |
| SAMSUNG_HEALTH_CLIENT_ID | Samsung Health API client ID | All environments |
| SAMSUNG_HEALTH_CLIENT_SECRET | Samsung Health API client secret | All environments |
| OPENAI_API_KEY | OpenAI API key | All environments |

### CORS Configuration

The backend is configured to allow cross-origin requests from the frontend. The allowed origins are configured in the properties files and used in the SecurityConfig class:

```java
@Value("${spring.web.cors.allowed-origins}")
private String allowedOrigins;

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
    // ... other configuration
    return source;
}
```

### Development Environment

The development environment is configured to use a local MySQL database and allows cross-origin requests from the local frontend server (http://localhost:5173).

### Staging Environment

The staging environment is configured to use a staging database server and allows cross-origin requests from the staging frontend server (https://staging.sentimate.com).

### Production Environment

The production environment is configured to use a production database server and allows cross-origin requests from the production frontend server (https://sentimate.com and https://www.sentimate.com).

## Running the Application

### Development

1. Start the backend server:
   ```bash
   cd senti_mate_back_end
   ./gradlew bootRun
   ```

2. Start the frontend development server:
   ```bash
   cd senti_mate_front_end
   npm run dev
   ```

3. Access the application at http://localhost:5173

### Staging

1. Build the backend for staging:
   ```bash
   cd senti_mate_back_end
   ./gradlew clean build -Pprofile=staging
   ```

2. Build the frontend for staging:
   ```bash
   cd senti_mate_front_end
   npm run build:staging
   ```

3. Deploy the built artifacts to the staging server

### Production

1. Build the backend for production:
   ```bash
   cd senti_mate_back_end
   ./gradlew clean build -Pprofile=production
   ```

2. Build the frontend for production:
   ```bash
   cd senti_mate_front_end
   npm run build
   ```

3. Deploy the built artifacts to the production server