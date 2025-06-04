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

## Database Management

The SentiMate application uses MySQL as its database and Flyway for database migrations. This section provides instructions for managing the database.

### Database Initialization

The database is automatically initialized when the application starts for the first time. Flyway will create the necessary tables and insert initial data based on the migration scripts in the `src/main/resources/db/migration` directory.

### Database Migrations

Database migrations are managed using Flyway. Migration scripts are located in the `src/main/resources/db/migration` directory and follow the naming convention `V<version>__<description>.sql`.

To add a new migration script:

1. Create a new SQL file in the `src/main/resources/db/migration` directory with a name following the convention `V<version>__<description>.sql`, where `<version>` is a version number higher than the existing scripts and `<description>` is a brief description of the migration.
2. Add the SQL statements for the migration to the file.
3. Rebuild and restart the application. Flyway will automatically apply the new migration.

### Database Backup and Recovery

The application includes scripts for backing up and recovering the database. These scripts are located in the `src/main/resources/scripts` directory.

To backup the database:

```
cd src/main/resources/scripts
./database_backup_recovery.sh backup
```

To recover the database from a backup:

```
cd src/main/resources/scripts
./database_backup_recovery.sh recover [backup_file]
```

If no backup file is specified, the latest backup will be used.

To schedule automated backups:

```
cd src/main/resources/scripts
./database_backup_recovery.sh schedule
```

This will set up a cron job to backup the database daily at 2 AM.

### Data Archiving and Purging

The application includes scripts for archiving and purging old data. These scripts are located in the `src/main/resources/scripts` directory.

To archive old data:

```
cd src/main/resources/scripts
./data_archiving_purging.sh archive_all
```

To purge old data (after archiving):

```
cd src/main/resources/scripts
./data_archiving_purging.sh purge_all
```

To schedule automated archiving and purging:

```
cd src/main/resources/scripts
./data_archiving_purging.sh schedule
```

This will set up cron jobs to archive and purge old data monthly.

### Data Validation and Cleaning

The application includes scripts for validating and cleaning data. These scripts are located in the `src/main/resources/scripts` directory.

To validate data:

```
cd src/main/resources/scripts
./data_validation_cleaning.sh validate_all
```

To clean the database (remove orphaned records and optimize tables):

```
cd src/main/resources/scripts
./data_validation_cleaning.sh clean
```

To schedule automated validation and cleaning:

```
cd src/main/resources/scripts
./data_validation_cleaning.sh schedule
```

This will set up cron jobs to validate and clean data weekly.

### Data Migration

The application includes scripts for migrating data between different database environments. These scripts are located in the `src/main/resources/scripts` directory.

To migrate data from a source database to the target database:

```
cd src/main/resources/scripts
./data_migration.sh migrate
```

To export data from the source database:

```
cd src/main/resources/scripts
./data_migration.sh export
```

To import data to the target database:

```
cd src/main/resources/scripts
./data_migration.sh import <export_dir>
```

To validate a migration:

```
cd src/main/resources/scripts
./data_migration.sh validate
```

## Additional Resources

For more information, refer to the following resources:

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
