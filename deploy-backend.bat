@echo off
setlocal enabledelayedexpansion

echo SentiMate Backend Deployment Script
echo ==================================

REM Set default environment to development if not specified
if "%1"=="" (
    set ENVIRONMENT=development
) else (
    set ENVIRONMENT=%1
)

REM Set default deployment target to local if not specified
if "%2"=="" (
    set DEPLOY_TARGET=local
) else (
    set DEPLOY_TARGET=%2
)

echo Deploying backend for %ENVIRONMENT% environment to %DEPLOY_TARGET%...

REM Build the backend first
call build-backend.bat %ENVIRONMENT%

if %ERRORLEVEL% neq 0 (
    echo Error: Backend build failed!
    exit /b %ERRORLEVEL%
)

REM Set the JAR file path
set JAR_FILE=senti_mate_back_end\build\libs\senti_mate_back_end-0.0.1-SNAPSHOT.jar

REM Deploy based on target
if /i "%DEPLOY_TARGET%"=="local" (
    echo Starting local deployment...
    
    REM Kill any running instance on port 8080
    for /f "tokens=5" %%p in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
        echo Stopping process with PID: %%p
        taskkill /F /PID %%p 2>nul
    )
    
    REM Start the application with the appropriate profile
    echo Starting Spring Boot application...
    start "SentiMate Backend" java -jar -Dspring.profiles.active=%ENVIRONMENT% %JAR_FILE%
    
    echo Backend deployed locally. Access at http://localhost:8080
) else if /i "%DEPLOY_TARGET%"=="server" (
    echo Remote server deployment not implemented yet.
    echo To deploy to a remote server, you would typically:
    echo 1. Copy the JAR file to the server using SCP or similar
    echo 2. SSH into the server and start the application
    echo Example commands:
    echo   scp %JAR_FILE% user@server:/path/to/deployment/
    echo   ssh user@server "java -jar -Dspring.profiles.active=%ENVIRONMENT% /path/to/deployment/senti_mate_back_end-0.0.1-SNAPSHOT.jar"
) else (
    echo Error: Unknown deployment target '%DEPLOY_TARGET%'
    echo Valid targets are: local, server
    exit /b 1
)

echo Backend deployment completed!

endlocal