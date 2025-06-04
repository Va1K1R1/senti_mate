@echo off
setlocal enabledelayedexpansion

echo SentiMate Frontend Deployment Script
echo ===================================

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

echo Deploying frontend for %ENVIRONMENT% environment to %DEPLOY_TARGET%...

REM Build the frontend first
call build-frontend.bat %ENVIRONMENT%

if %ERRORLEVEL% neq 0 (
    echo Error: Frontend build failed!
    exit /b %ERRORLEVEL%
)

REM Set the build directory
set BUILD_DIR=senti_mate_front_end\dist

REM Deploy based on target
if /i "%DEPLOY_TARGET%"=="local" (
    echo Starting local deployment...
    
    REM Check if http-server is installed
    call npm list -g http-server >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo Installing http-server globally...
        call npm install -g http-server
        
        if !ERRORLEVEL! neq 0 (
            echo Error: Failed to install http-server!
            exit /b !ERRORLEVEL!
        )
    )
    
    REM Kill any running instance on port 5173
    for /f "tokens=5" %%p in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
        echo Stopping process with PID: %%p
        taskkill /F /PID %%p 2>nul
    )
    
    REM Start the http-server
    echo Starting http-server...
    start "SentiMate Frontend" cmd /c "cd %BUILD_DIR% && http-server -p 5173 --cors"
    
    echo Frontend deployed locally. Access at http://localhost:5173
) else if /i "%DEPLOY_TARGET%"=="server" (
    echo Remote server deployment not implemented yet.
    echo To deploy to a remote server, you would typically:
    echo 1. Copy the build files to the server using SCP or similar
    echo 2. Configure the web server (Nginx, Apache, etc.) to serve the files
    echo Example commands:
    echo   scp -r %BUILD_DIR% user@server:/path/to/deployment/
    echo   ssh user@server "cd /path/to/deployment && http-server -p 80"
) else (
    echo Error: Unknown deployment target '%DEPLOY_TARGET%'
    echo Valid targets are: local, server
    exit /b 1
)

echo Frontend deployment completed!

endlocal