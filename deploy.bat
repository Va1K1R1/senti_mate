@echo off
setlocal enabledelayedexpansion

echo SentiMate Full Deployment Script
echo ===============================

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

echo Deploying SentiMate application for %ENVIRONMENT% environment to %DEPLOY_TARGET%...

REM Deploy backend
echo.
echo ===== DEPLOYING BACKEND =====
echo.
call deploy-backend.bat %ENVIRONMENT% %DEPLOY_TARGET%

if %ERRORLEVEL% neq 0 (
    echo Error: Backend deployment failed!
    exit /b %ERRORLEVEL%
)

REM Deploy frontend
echo.
echo ===== DEPLOYING FRONTEND =====
echo.
call deploy-frontend.bat %ENVIRONMENT% %DEPLOY_TARGET%

if %ERRORLEVEL% neq 0 (
    echo Error: Frontend deployment failed!
    exit /b %ERRORLEVEL%
)

echo.
echo ===== DEPLOYMENT COMPLETED =====
echo.
echo SentiMate application has been successfully deployed!
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo To access the application, open http://localhost:5173 in your browser.

endlocal