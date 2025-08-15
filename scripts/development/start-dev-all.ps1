# Wedding Website Development Startup Script
# This script starts all services with consistent port configuration

Write-Host '🎉 Starting Wedding Website Development Environment' -ForegroundColor Green
Write-Host 'Port Configuration:' -ForegroundColor Yellow
Write-Host '  Frontend: http://localhost:3005' -ForegroundColor White
Write-Host '  Backend:  http://localhost:3002' -ForegroundColor White
Write-Host '  Firebase: 127.0.0.1:8082' -ForegroundColor White
Write-Host '  Firebase UI: http://localhost:4001' -ForegroundColor White
Write-Host ''

# Change to the project directory
Set-Location $PSScriptRoot

# Function to start a service in a new PowerShell window
function Start-Service {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory = $PSScriptRoot
    )
    
    Write-Host "Starting $Title..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$WorkingDirectory'; $Command" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Start Firebase Emulator
Start-Service 'Firebase Emulator' 'npx firebase emulators:start --only firestore'

# Wait for emulator to start
Write-Host 'Waiting for Firebase Emulator to initialize...' -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Backend Server
Start-Service 'Backend Server' "`$env:NODE_ENV='development'; `$env:FIRESTORE_EMULATOR_HOST='127.0.0.1:8082'; `$env:PORT='3002'; Set-Location backend; npm start" $PSScriptRoot

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Start-Service 'Frontend Server' "`$env:PORT='3005'; npm run dev"

Write-Host ''
Write-Host '🚀 All services starting up!' -ForegroundColor Green
Write-Host 'Visit http://localhost:3005 to view the website' -ForegroundColor Yellow
Write-Host ''
Write-Host 'Press any key to exit...' -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
