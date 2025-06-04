# SentiMate - Health Diary Web Application

SentiMate is a health diary web application built with Spring Boot and React. It allows users to track their emotions, health data, and receive personalized wellness advice.

## Project Overview

SentiMate integrates with the Samsung Health SDK Web API for health data and the OpenAI ChatGPT API for emotion analysis and personalized wellness advice. The application provides a comprehensive platform for users to maintain a health diary and track their well-being.

## Features

- User authentication and authorization
- Health diary entries
- Emotion tracking
- Integration with Samsung Health data
- Personalized wellness recommendations using ChatGPT
  - Filter recommendations by type (wellness, exercise, nutrition, mental health)
  - View recommendations based on data from different time periods (7, 14, or 30 days)
  - Mark recommendations as completed or save them for later
- Responsive design for mobile and desktop

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.5.0
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Lombok
- JUnit 5 for testing

### Frontend
- React with Vite
- React Router for routing
- Axios for API calls
- CSS/SCSS for styling
- Jest and React Testing Library for testing

## Getting Started

### Prerequisites
- Java 17 or higher
- Gradle 8.x or higher (or use the included Gradle wrapper)
- Node.js 18.x or higher
- npm 9.x or higher
- MySQL 8.0 or higher

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/senti_mate.git
   cd senti_mate
   ```

2. Configure the database:
   - Create a MySQL database named `sentimate_db`
   - Update the database credentials in `senti_mate_back_end/src/main/resources/application.properties`

3. Build and run the backend:
   ```bash
   cd senti_mate_back_end
   ./gradlew build
   ./gradlew bootRun
   ```

4. The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Install dependencies:
   ```bash
   cd senti_mate_front_end
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. The frontend will be available at `http://localhost:5173`

## Project Structure

### Backend Structure
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

### Frontend Structure
- `src`: Source code
  - `components`: Reusable UI components
  - `pages`: Page components
  - `services`: API services
  - `hooks`: Custom hooks
  - `utils`: Utility functions
  - `assets`: Static assets
  - `styles`: CSS/SCSS files

## Development Guidelines

Please refer to the [Task List](task_list.md) for a comprehensive list of tasks to be completed for the project.

## API Documentation

For detailed information about the external APIs used in this project, please refer to the [API Documentation](api_doc.md).

## Testing

### Backend Testing
```bash
cd senti_mate_back_end
./gradlew test
```

### Frontend Testing
```bash
cd senti_mate_front_end
npm test
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
