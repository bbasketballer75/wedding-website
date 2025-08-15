# Wedding Website Development Guide

## 🚀 Quick Start (No More Port Conflicts!)

### Option 1: Automatic Startup (Recommended)

```bash
npm run dev:start
```

This will automatically:

- Kill any processes on ports 3001 and 3002
- Update CORS configuration
- Start backend server
- Start frontend server
- Monitor both servers

### Option 2: Clean Start (If you have issues)

```bash
npm run dev:clean
```

This will clean up any hanging processes before starting.

### Option 3: Force Start (Nuclear option)

```bash
npm run dev:force
```

This will kill ALL Node.js processes and start fresh.

## 🔍 Environment Validation

Before starting development, you can validate your environment:

```bash
npm run dev:validate
```

This checks for:

- Port availability
- Required files
- Dependencies
- Environment variables
- CORS configuration

## 📋 Development Commands

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev:validate` | Check development environment          |
| `npm run dev:start`    | Start both servers automatically       |
| `npm run dev:clean`    | Clean start (kills port conflicts)     |
| `npm run dev:force`    | Force start (kills all Node processes) |
| `npm run dev`          | Start only frontend (manual)           |
| `npm run dev:backend`  | Start only backend (manual)            |

## 🔧 Port Configuration

The application uses dynamic port configuration:

- **Frontend**: Port 3001 (configurable via `PORT` env var)
- **Backend**: Port 3002 (configurable via `BACKEND_PORT` env var)
- **CORS**: Automatically includes common development ports

### Custom Ports

```bash
# Use different frontend port
PORT=3005 npm run dev:start

# Use different backend port
BACKEND_PORT=3010 npm run dev:start
```

## 🛠️ Troubleshooting

### Problem: "Port already in use"

**Solution**: Use `npm run dev:clean` or `npm run dev:force`

### Problem: CORS errors in browser

**Solution**: The startup script automatically updates CORS configuration. If you still see errors:

1. Stop all servers
2. Run `npm run dev:clean`
3. Check that `config/ports.js` includes your frontend port in `CORS_ORIGINS`

### Problem: Backend won't connect to Firestore

**Solution**:

1. Check `.env.local` has `FIRESTORE_EMULATOR_HOST=localhost:8082`
2. Start Firebase emulator: `npm run dev:emulator`

### Problem: Changes not showing up

**Solution**:

1. Check if both servers are running
2. Hard refresh browser (Ctrl+F5)
3. Check browser console for errors

## 📁 File Structure

```
wedding-website/
├── scripts/
│   ├── dev-startup.ps1        # Main startup script
│   └── validate-dev-env.mjs   # Environment validator
├── config/
│   └── ports.js               # Port and CORS configuration
├── backend/                   # Express API server
└── src/                       # Next.js frontend
```

## 🔄 Development Workflow

1. **Start Development**:

   ```bash
   npm run dev:validate  # Optional: check environment
   npm run dev:start     # Start both servers
   ```

2. **Open in Browser**: http://localhost:3001

3. **API Available at**: http://localhost:3002

4. **Stop Development**: Press Ctrl+C in the terminal

## 🎯 Production Deployment

The port configuration automatically handles production vs development:

- **Development**: Uses localhost ports (3001, 3002)
- **Production**: Uses environment variables from Netlify
- **CORS**: Automatically includes production domain

Deploy to production:

```bash
npm run deploy:prod
```

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module 'config/ports.js'"

**Cause**: Running commands from wrong directory
**Solution**: Make sure you're in the project root directory

### Issue: Frontend loads but no data

**Cause**: Backend not running or CORS blocking requests
**Solution**:

1. Check backend is running: http://localhost:3002/api/health
2. Use `npm run dev:start` instead of manual startup

### Issue: Servers start but crash immediately

**Cause**: Missing dependencies or environment variables
**Solution**:

1. Run `npm run dev:validate`
2. Check `.env.local` exists
3. Run `npm install` and `cd backend && npm install`

## 💡 Pro Tips

- **Always use `npm run dev:start`** instead of starting servers manually
- **Run `npm run dev:validate`** if you encounter issues
- **Use `npm run dev:clean`** after pulling new changes
- **Check browser console** for any client-side errors
- **Check terminal output** for server errors

## 🏗️ Architecture

The development environment uses:

- **Next.js 15** with Turbopack for frontend
- **Express.js** for backend API
- **Firebase Firestore** for database
- **Dynamic CORS** configuration
- **Automatic port management**
- **Cross-platform compatibility**

This setup ensures consistent, conflict-free development across different machines and environments.
