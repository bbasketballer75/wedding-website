# Wedding Website Connection Monitor

## Overview

This automated connection tracking system ensures your frontend (Next.js) and backend (Express) services are healthy and connected while VS Code is open. It provides real-time monitoring, visual status displays, and automatic startup capabilities.

## 🚀 Quick Start

### Instant Status Check

```powershell
# Quick health check of both services
.\scripts\status-check.ps1
```

### Start Everything with Monitoring

```powershell
# Start both services and connection monitor
.\start-dev-with-monitor.ps1
```

### VS Code Tasks (Auto-start on workspace open)

- **Connection Monitor** - Full visual monitoring with detailed output
- **Connection Monitor (Quiet)** - Minimal output, logs errors only

## 📊 What It Monitors

### Frontend (Next.js)

- **URL:** http://localhost:3005
- **Status:** Checks if the site loads
- **Response Time:** Measures page load performance

### Backend (Express API)

- **URL:** http://localhost:3002/api/health
- **Status:** Comprehensive health check with system info
- **Response Time:** API response performance
- **Details:** Memory usage, uptime, environment info

## 🛠️ System Components

### 1. Health Endpoint (`/api/health`)

```json
{
  "status": "healthy",
  "timestamp": "2025-07-31T03:42:55.000Z",
  "uptime": 81.75,
  "environment": "development",
  "version": "1.0.0",
  "memory": {
    "used": 27,
    "total": 30,
    "external": 4
  }
}
```

### 2. Connection Monitor Script

**Location:** `scripts/connection-monitor.ps1`

**Features:**

- ✅ Real-time status display with color coding
- ⏱️ Response time monitoring
- 📊 Uptime statistics
- 📝 Optional file logging
- 🔄 Automatic service detection
- 🎯 Helpful restart commands when services are down

**Usage:**

```powershell
# Full monitoring (default)
.\scripts\connection-monitor.ps1

# Quiet mode (errors only)
.\scripts\connection-monitor.ps1 -Quiet

# Custom check interval
.\scripts\connection-monitor.ps1 -CheckInterval 10

# With file logging
.\scripts\connection-monitor.ps1 -LogToFile
```

### 3. Status Check Script

**Location:** `scripts/status-check.ps1`

**Features:**

- 🏃‍♂️ Quick one-time health check
- 🎯 Instant service status
- 📋 Available URLs display
- 💡 Helpful startup commands

### 4. Development Startup Script

**Location:** `start-dev-with-monitor.ps1`

**Features:**

- 🔍 Checks current service status
- 🚀 Starts services if not running
- 📱 Launches connection monitor
- 📊 Shows all available URLs

## 🎨 Visual Status Display

### Healthy Status

```
✓ Frontend (Next.js) - OK (195ms)
✓ Backend API Health - OK (4ms)

🎉 All services are healthy!

Available URLs:
  🌐 Website:  http://localhost:3005
  🔧 API:      http://localhost:3002
  📚 Docs:     http://localhost:3002/api-docs
  ❤️ Health:   http://localhost:3002/api/health
```

### Unhealthy Status

```
✗ Frontend (Next.js) - FAILED (Connection refused)
    └─ Run: npm run dev (in main folder)

✗ Backend API Health - FAILED (Service unavailable)
    └─ Run: npm start (in backend folder)
```

## 📁 File Structure

```
wedding-website/
├── scripts/
│   ├── connection-monitor.ps1    # Main monitoring script
│   └── status-check.ps1          # Quick status check
├── start-dev-with-monitor.ps1    # Complete startup script
├── backend/
│   └── routes/
│       └── healthRoutes.js       # Health endpoint
└── .vscode/
    └── tasks.json               # VS Code tasks for monitoring
```

## ⚙️ Configuration

### Port Configuration

- **Frontend:** 3005 (configured in `config/ports.js`)
- **Backend:** 3002 (configured in `config/ports.js`)
- **Health Endpoint:** `/api/health`

### VS Code Tasks

The monitoring tasks are configured to:

- ✅ Auto-start when workspace opens
- 📺 Display in dedicated terminal panels
- 🔄 Run continuously in background
- 📝 Log to files for debugging

### Monitoring Intervals

- **Default:** 15 seconds between checks
- **Customizable:** Use `-CheckInterval` parameter
- **Quick Check:** Instant one-time status

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use:**

```powershell
# Check what's using the port
netstat -ano | findstr :3002

# Kill process if needed
taskkill /PID <process_id> /F
```

**Services Won't Start:**

```powershell
# Manual startup
cd backend && npm start          # Backend
npm run dev                      # Frontend (from root)
```

**Monitor Not Working:**

```powershell
# Test health endpoint directly
curl http://localhost:3002/api/health

# Check VS Code tasks
# View → Command Palette → "Tasks: Run Task"
```

### Log Files

- **Connection Monitor:** `connection-monitor.log`
- **Location:** Root directory
- **Rotation:** Automatic when > 10MB

## 🎯 Usage Examples

### Development Workflow

1. **Open VS Code** → Monitor auto-starts
2. **Check status** → `.\scripts\status-check.ps1`
3. **Start services** → `.\start-dev-with-monitor.ps1`
4. **Monitor continuously** → VS Code Connection Monitor task

### Integration with Existing Scripts

```powershell
# Add to your existing dev scripts
.\start-dev-with-monitor.ps1 -QuietMonitor

# Or skip monitor entirely
.\start-dev-with-monitor.ps1 -NoMonitor
```

## 📈 Benefits

- ⏰ **Saves Time:** No more manual checking if services are running
- 👀 **Visual Feedback:** Instant status with color-coded output
- 🔄 **Auto-Recovery:** Clear instructions when services are down
- 📊 **Performance Monitoring:** Response times and uptime tracking
- 🛠️ **Developer Friendly:** Integrates seamlessly with VS Code workflow
- 📝 **Debugging Support:** Optional logging for troubleshooting

## 🚀 Next Steps

This monitoring system is ready to use! It will:

1. **Auto-start** when you open the VS Code workspace
2. **Continuously monitor** both frontend and backend
3. **Alert you immediately** if any service goes down
4. **Provide clear instructions** on how to fix issues

The system is designed to be non-intrusive but informative, giving you peace of mind that your development environment is healthy and ready for work.
