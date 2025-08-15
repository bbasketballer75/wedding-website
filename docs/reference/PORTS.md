# Port Configuration Documentation

## Wedding Website Port Allocation

This document outlines the consistent port allocation for the wedding website to avoid conflicts with MCP servers and other system services.

### Production Services

| Service            | Port | URL                       | Purpose                  |
| ------------------ | ---- | ------------------------- | ------------------------ |
| Frontend (Next.js) | 3005 | http://localhost:3005     | Main website interface   |
| Backend (Express)  | 3002 | http://localhost:3002/api | API server               |
| Firebase Emulator  | 8082 | localhost:8082            | Local Firestore database |
| Firebase UI        | 4001 | http://localhost:4001     | Firebase emulator UI     |

### Development Tools

| Service   | Port | URL                   | Purpose               |
| --------- | ---- | --------------------- | --------------------- |
| Storybook | 6006 | http://localhost:6006 | Component development |

### Reserved Ports (Future Use)

| Service         | Port | Purpose                         |
| --------------- | ---- | ------------------------------- |
| Webhook Handler | 3003 | For future webhook integrations |
| Testing Server  | 3004 | For integration testing         |

### Avoided Ports (MCP Server Conflicts)

| Port  | Service                   | Reason                       |
| ----- | ------------------------- | ---------------------------- |
| 8080  | MCP Filesystem/Git Server | Conflict avoidance           |
| 27017 | MongoDB                   | Conflict avoidance           |
| 3000  | Default Next.js           | Often used by other projects |
| 3001  | Common backend port       | Often used by other projects |

## Quick Start Commands

### Individual Services

```powershell
# Start all services automatically
.\start-dev-all.ps1

# OR start manually:

# 1. Firebase Emulator
npx firebase emulators:start --only firestore

# 2. Backend (in new terminal)
cd backend
$env:NODE_ENV='development'
$env:FIRESTORE_EMULATOR_HOST='localhost:8082'
$env:PORT='3002'
npm start

# 3. Frontend (in new terminal)
$env:PORT='3005'
npm run dev
```

### Using NPM Scripts

```powershell
# Start frontend with consistent port
npm run dev

# Start backend (from backend directory)
cd backend && npm start

# Start Firebase emulator
npm run emulator
```

## Environment Variables

The following environment variables are used to maintain consistent configuration:

```bash
NODE_ENV=development
FIRESTORE_EMULATOR_HOST=localhost:8082
PORT=3002  # for backend
PORT=3005  # for frontend
```

## CORS Configuration

The backend is configured to allow requests from:

- http://localhost:3005 (Frontend)
- http://localhost:3000 (Fallback)
- http://localhost:6006 (Storybook)
- https://www.theporadas.com (Production)
- https://theporadas.com (Production)

## Troubleshooting

### Port Already in Use

If you encounter "port already in use" errors:

1. Check what's using the port:

   ```powershell
   netstat -ano | findstr ":3005"
   ```

2. Kill the process if necessary:

   ```powershell
   taskkill /PID <process_id> /F
   ```

3. Restart the service

### MCP Server Conflicts

If MCP servers are using our configured ports:

1. Update `config/ports.js` with alternative ports
2. Restart all services
3. Update this documentation

## File Locations

- Port configuration: `config/ports.js`
- Firebase config: `firebase.json`
- Backend server: `backend/server.js`
- Frontend API client: `src/services/api.js`
- Startup script: `start-dev-all.ps1`
