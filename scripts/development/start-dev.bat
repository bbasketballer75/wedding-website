@echo off
echo Starting Firebase Emulator and Backend Server for Development...
echo.

REM Check if Firebase CLI is available
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Firebase CLI not found. Installing...
    npm install -g firebase-tools
)

REM Start Firebase emulator in background
echo Starting Firebase Emulator...
start /B firebase emulators:start --only firestore

REM Wait for emulator to start
timeout /t 5 /nobreak >nul

REM Set environment variables and start backend
echo Starting Backend Server...
cd backend
set NODE_ENV=development
set FIRESTORE_EMULATOR_HOST=localhost:8080
set PORT=3001
npm start

echo.
echo Both services should now be running:
echo - Firebase Emulator: http://localhost:4000 (UI)
echo - Firestore Emulator: localhost:8080
echo - Backend API: http://localhost:3001
