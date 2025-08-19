# Safely start backend with optional emulator host
param()

$env:FIRESTORE_EMULATOR_HOST = if ($env:FIRESTORE_EMULATOR_HOST) { $env:FIRESTORE_EMULATOR_HOST } else { 'localhost:8082' }
$env:NODE_ENV = 'development'
$env:PORT = if ($env:PORT) { $env:PORT } else { '3002' }

Write-Host "[dev-backend] Starting backend on port $env:PORT (FIRESTORE_EMULATOR_HOST=$env:FIRESTORE_EMULATOR_HOST)"
try {
    Push-Location backend
    npm start
}
finally {
    Pop-Location
}
