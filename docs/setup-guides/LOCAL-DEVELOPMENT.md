# Local Development Guide

## 🚀 Quick Start for Local Development

### Option 1: Automated Startup (Recommended)

```powershell
# Run the automated development script
.\start-dev.ps1
```

### Option 2: Manual Startup

```powershell
# Terminal 1: Start Firestore Emulator
npx firebase emulators:start --only firestore

# Terminal 2: Start Backend Server
cd backend
$env:NODE_ENV="development"
$env:FIRESTORE_EMULATOR_HOST="localhost:8080"
node server.js

# Terminal 3: Start Frontend (if needed)
npm run dev
```

## 🔧 Environment Configuration

### Development Environment Variables

- `NODE_ENV=development`
- `FIRESTORE_EMULATOR_HOST=localhost:8080`

### Service URLs

- **Firestore Emulator**: http://localhost:8080
- **Backend API**: http://localhost:8080/api
- **Frontend**: http://localhost:3000 (Next.js dev server)

## 🎯 Automatic API Detection

The frontend automatically detects your development environment:

- **Local Development** (localhost): Uses `http://localhost:8080/api`
- **Production**: Uses `https://wedding-backend.netlify.app/.netlify/functions`

No manual configuration needed!

## 📝 Development Workflow

1. **Start Services**: Run `.\start-dev.ps1` or start manually
2. **Develop**: Make changes to your code
3. **Test API**: Visit http://localhost:8080/api/guestbook
4. **Test Frontend**: Visit http://localhost:3000
5. **Stop Services**: Press Ctrl+C in the terminal

## 🛠 Troubleshooting

### Backend Server Issues

```powershell
# Check if services are running
netstat -an | findstr :8080
netstat -an | findstr :3000

# Kill processes if needed
taskkill /F /IM node.exe
```

### Firestore Emulator Issues

```powershell
# Restart emulator
npx firebase emulators:start --only firestore --project=wedding-website-final
```

### Port Conflicts

If port 8080 is in use, the backend will fail to start. Kill other processes using port 8080.

## 📊 Testing Your Setup

### Test Backend API

```powershell
# Test guestbook endpoint
curl http://localhost:8080/api/guestbook

# Create test entry
$body = @{name="Test User"; message="Hello World!"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/guestbook" -Method POST -Body $body -ContentType "application/json"
```

### Test Frontend Connection

1. Open http://localhost:3000
2. Navigate to guestbook section
3. Try creating an entry
4. Check browser dev tools for API calls to localhost:8080

## 🎉 Production Deployment

Your authentication is configured for both development and production:

- **Development**: Uses Firestore emulator
- **Production**: Uses real Firestore database in `wedding-website-final` project

Ready to deploy when you are! 🚀
