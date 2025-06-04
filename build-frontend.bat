@echo off
setlocal enabledelayedexpansion

echo SentiMate Frontend Build Script
echo ===============================

REM Set default environment to development if not specified
if "%1"=="" (
    set ENVIRONMENT=development
) else (
    set ENVIRONMENT=%1
)

echo Building frontend for %ENVIRONMENT% environment...

REM Navigate to the frontend directory
cd senti_mate_front_end

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    
    if !ERRORLEVEL! neq 0 (
        echo Error: Failed to install dependencies!
        exit /b !ERRORLEVEL!
    )
)

REM Build the project with the specified environment
echo Running build for %ENVIRONMENT% environment...
call npm run build -- --mode %ENVIRONMENT%

if %ERRORLEVEL% neq 0 (
    echo Error: Build failed!
    exit /b %ERRORLEVEL%
)

echo Frontend build completed successfully!
echo Build output location: senti_mate_front_end\dist

endlocal