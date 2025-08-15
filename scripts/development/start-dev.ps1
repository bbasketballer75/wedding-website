# Wedding Website Development Setup

Write-Host "🚀 Starting Wedding Website Development Environment..." -ForegroundColor Green
Write-Host ""

# Check if Firebase CLI is available
try {
    npx firebase --version | Out-Null
    Write-Host "✅ Firebase CLI available" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
}

# Start Firebase emulator in background
Write-Host "🔥 Starting Firestore emulator..." -ForegroundColor Yellow
Start-Process -WindowStyle Hidden pwsh -ArgumentList "-Command", "npx firebase emulators:start --only firestore"

# Wait for emulator to start
Write-Host "⏳ Waiting for Firestore emulator to start..."
Start-Sleep -Seconds 8

# Test if emulator is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Firestore emulator running on localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Firestore emulator may still be starting..." -ForegroundColor Yellow
}

# Set environment variables and start backend
Write-Host "🚀 Starting Express backend server..." -ForegroundColor Yellow
Set-Location backend
$env:NODE_ENV = "development"
$env:FIRESTORE_EMULATOR_HOST = "localhost:8080"

Write-Host ""
Write-Host "🎯 Development services configured:" -ForegroundColor Cyan
Write-Host "   NODE_ENV: $env:NODE_ENV"
Write-Host "   FIRESTORE_EMULATOR_HOST: $env:FIRESTORE_EMULATOR_HOST"
Write-Host ""
Write-Host "✅ Backend server starting on localhost:8080/api" -ForegroundColor Green
Write-Host "📱 Frontend will automatically connect to local backend when accessed via localhost" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 Press Ctrl+C to stop all services" -ForegroundColor Red
Write-Host ""

# Start the backend server (this will block)
try {
    node "C:\Users\Austin\Downloads\wedding-website\backend\server.js"
} catch {
    Write-Host "❌ Failed to start backend server" -ForegroundColor Red
    Write-Host "Make sure dependencies are installed: npm install" -ForegroundColor Yellow
}
Write-Host "- Firebase Emulator UI: http://localhost:4000" -ForegroundColor Cyan
Write-Host "- Firestore Emulator: localhost:8080" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

npm start
