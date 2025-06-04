# SentiMate Build and Deployment Guide

This document provides instructions for building and deploying the SentiMate application, which consists of a Spring Boot backend and a React frontend.

## Prerequisites

### Backend
- Java 17 or higher
- Gradle 8.x or higher (or use the included Gradle wrapper)
- MySQL 8.0 or higher

### Frontend
- Node.js 18.x or higher
- npm 9.x or higher

## Build Scripts

The following build scripts are available in the root directory of the project:

### Backend Build Script

```
build-backend.bat [environment]
```

This script builds the Spring Boot backend application for the specified environment. If no environment is specified, it defaults to `development`.

**Parameters:**
- `environment` (optional): The environment to build for. Valid values are `development`, `test`, and `production`. Default is `development`.

**Example:**
```
build-backend.bat production
```

### Frontend Build Script

```
build-frontend.bat [environment]
```

This script builds the React frontend application for the specified environment. If no environment is specified, it defaults to `development`.

**Parameters:**
- `environment` (optional): The environment to build for. Valid values are `development`, `test`, and `production`. Default is `development`.

**Example:**
```
build-frontend.bat production
```

## Deployment Scripts

The following deployment scripts are available in the root directory of the project:

### Backend Deployment Script

```
deploy-backend.bat [environment] [target]
```

This script deploys the Spring Boot backend application to the specified target for the specified environment. If no environment is specified, it defaults to `development`. If no target is specified, it defaults to `local`.

**Parameters:**
- `environment` (optional): The environment to deploy for. Valid values are `development`, `test`, and `production`. Default is `development`.
- `target` (optional): The deployment target. Valid values are `local` and `server`. Default is `local`.

**Example:**
```
deploy-backend.bat production server
```

### Frontend Deployment Script

```
deploy-frontend.bat [environment] [target]
```

This script deploys the React frontend application to the specified target for the specified environment. If no environment is specified, it defaults to `development`. If no target is specified, it defaults to `local`.

**Parameters:**
- `environment` (optional): The environment to deploy for. Valid values are `development`, `test`, and `production`. Default is `development`.
- `target` (optional): The deployment target. Valid values are `local` and `server`. Default is `local`.

**Example:**
```
deploy-frontend.bat production server
```

### Full Deployment Script

```
deploy.bat [environment] [target]
```

This script deploys both the backend and frontend applications to the specified target for the specified environment. If no environment is specified, it defaults to `development`. If no target is specified, it defaults to `local`.

**Parameters:**
- `environment` (optional): The environment to deploy for. Valid values are `development`, `test`, and `production`. Default is `development`.
- `target` (optional): The deployment target. Valid values are `local` and `server`. Default is `local`.

**Example:**
```
deploy.bat production server
```

## Environment Configuration

### Backend

The backend application is configured using `application.properties` in the `src/main/resources` directory. Different profiles can be used for different environments.

For development, you may want to configure:

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

### Frontend

The frontend application is configured using environment files in the root directory of the frontend project:

- `.env.development` for development environment
- `.env.test` for test environment
- `.env.production` for production environment

These files contain environment-specific variables such as API base URL, feature flags, and logging level.

## Local Deployment

To deploy the application locally, run the following command:

```
deploy.bat
```

This will build and deploy both the backend and frontend applications for the development environment. The backend will be available at http://localhost:8080 and the frontend will be available at http://localhost:5173.

## Server Deployment

To deploy the application to a server, you need to modify the deployment scripts to include the server-specific configuration. The current scripts provide instructions for server deployment but do not implement it.

For server deployment, you would typically:

1. Build the application for the production environment
2. Copy the built files to the server
3. Configure the server to run the application

For example:

```
deploy.bat production server
```

## Troubleshooting

### Backend

If the backend deployment fails, check the following:

1. Make sure Java 17 or higher is installed and available in the PATH
2. Make sure MySQL is running and the database exists
3. Check the application.properties file for correct database configuration
4. Check the logs for any errors

### Frontend

If the frontend deployment fails, check the following:

1. Make sure Node.js 18.x or higher is installed and available in the PATH
2. Make sure npm 9.x or higher is installed
3. Check the environment files for correct configuration
4. Check the logs for any errors

## Additional Resources

For more information, refer to the following resources:

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)