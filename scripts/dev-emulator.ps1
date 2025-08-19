# Safely start Firestore emulator if Firebase CLI is available
param()

$ErrorActionPreference = 'SilentlyContinue'
$firebaseCmd = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseCmd) {
    Write-Host "[dev-emulator] Firebase CLI not found. Skipping emulator startup."
    Write-Host "Install with: npm i -g firebase-tools"
    exit 0
}

$ErrorActionPreference = 'Stop'
try {
    Write-Host "[dev-emulator] Starting Firestore emulator..."
    firebase emulators:start --only firestore
}
catch {
    Write-Warning "[dev-emulator] Emulator failed to start: $($_.Exception.Message)"
    exit 0
}
