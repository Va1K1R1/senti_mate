@echo off
setlocal enabledelayedexpansion

echo SentiMate Backend Build Script
echo ==============================

REM Set default environment to development if not specified
if "%1"=="" (
    set ENVIRONMENT=development
) else (
    set ENVIRONMENT=%1
)

echo Building backend for %ENVIRONMENT% environment...

REM Navigate to the backend directory
cd senti_mate_back_end

REM Clean and build the project
echo Running Gradle build...
call gradlew clean build -Penv=%ENVIRONMENT%

if %ERRORLEVEL% neq 0 (
    echo Error: Build failed!
    exit /b %ERRORLEVEL%
)

echo Backend build completed successfully!
echo JAR file location: senti_mate_back_end\build\libs\senti_mate_back_end-0.0.1-SNAPSHOT.jar

endlocal