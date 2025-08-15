# Development Setup - Firebase Emulator

This document explains how to run the wedding website in development mode using Firebase emulators instead of connecting to production Firebase services.

## Problem Solved

The original error was:

```
FirebaseAppError: Failed to parse private key: Error: Too few bytes to read ASN.1 value.
```

This occurred because the `backend/config/gcs-key.json` file contained dummy/placeholder credentials that aren't valid for Firebase authentication.

## Solution

We've configured the project to use **Firebase Emulators** for local development, which:

- ✅ Eliminates the need for real Firebase credentials during development
- ✅ Provides a local Firestore database that resets on each restart
- ✅ Allows full offline development
- ✅ Includes a web UI for inspecting data

## Quick Start

### Option 1: Use the convenience scripts

**PowerShell (Recommended):**

```powershell
.\start-dev.ps1
```

**Command Prompt:**

```cmd
start-dev.bat
```

### Option 2: Manual setup

1. **Start Firebase Emulator** (in one terminal):

```bash
npm run emulator
# OR
firebase emulators:start --only firestore
```

2. **Start Backend Server** (in another terminal):

```bash
cd backend
$env:NODE_ENV="development"
$env:FIRESTORE_EMULATOR_HOST="localhost:8080"
npm start
```

3. **Start Frontend** (in a third terminal):

```bash
npm run dev
```

## Services URLs

When running in development mode:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore Emulator**: localhost:8080

## Environment Variables

The following environment variables enable development mode:

```bash
NODE_ENV=development
FIRESTORE_EMULATOR_HOST=localhost:8080
```

## What happens in Development Mode

1. **Firestore**: Uses local emulator instead of production database
2. **Google Cloud Storage**: Operations are mocked with console logging
3. **Authentication**: Admin middleware still works with the same admin key

## Files Modified

- `backend/config/firestore.js` - Added emulator detection and setup
- `backend/config/gcp-credentials.js` - Better error handling for dummy credentials
- `backend/services/cloudStorage.js` - Added development mode mocking
- `firebase.json` - Firebase emulator configuration
- `package.json` - Added emulator npm scripts

## Production Deployment

For production deployment, you'll still need:

1. Valid Firebase service account credentials in `backend/config/gcs-key.json`
2. OR base64-encoded credentials in `GCP_SERVICE_ACCOUNT_JSON_BASE64` environment variable
3. Google Cloud Storage bucket configured

## Troubleshooting

### Firebase CLI not found

```bash
npm install -g firebase-tools
```

### Port conflicts

The emulator uses these ports by default:

- Firestore: 8080
- UI: 4000
- Websocket: 9150

### Emulator data persistence

Emulator data is reset on each restart. For persistent test data, consider adding seed scripts or using the Firebase Emulator data export/import features.
