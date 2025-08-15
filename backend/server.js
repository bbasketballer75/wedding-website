import http from 'http';
import dotenv from 'dotenv';

// Load environment variables first before any other imports
dotenv.config();

// Now import modules that depend on environment variables
import app from './app.js';
import logger from './config/logger.js';
import { PORTS } from '../config/ports.js';

// MongoDB removed: now using Google Firestore
// connectDB(); // No longer needed

const server = http.createServer(app);
const PORT = process.env.PORT || PORTS.BACKEND;

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use. Please check if another instance is running.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
