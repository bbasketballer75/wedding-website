#!/usr/bin/env node

/**
 * Enhanced Production Server Startup Script
 * Handles graceful startup, health checks, and service initialization
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './app.js';
import wsManager from './services/websocketManager.js';
import performanceManager from './services/performanceManager.js';
import { firestoreManager } from './config/firestore-enhanced.js';
import aiServices from './services/aiServices.js';

// Production configuration
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || '0.0.0.0';
const ENV = process.env.NODE_ENV || 'development';

/**
 * Enhanced server startup with proper initialization sequence
 */
class ProductionServer {
  constructor() {
    this.server = null;
    this.isShuttingDown = false;
    this.startupTime = new Date();
    this.healthChecks = new Map();
  }

  /**
   * Initialize all services and start the server
   */
  async start() {
    try {
      console.log('🚀 Starting Wedding Website Production Server...');
      console.log(`📍 Environment: ${ENV}`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`📍 Host: ${HOST}`);

      // Step 1: Pre-flight checks
      await this.performPreflightChecks();

      // Step 2: Initialize core services
      await this.initializeServices();

      // Step 3: Create HTTP server
      this.server = createServer(app);

      // Step 4: Initialize WebSocket server
      wsManager.initialize(this.server);

      // Step 5: Setup graceful shutdown handlers
      this.setupGracefulShutdown();

      // Step 6: Start listening
      await this.startListening();

      // Step 7: Post-startup initialization
      await this.postStartupTasks();

      console.log('✅ Wedding Website Production Server started successfully!');
      console.log(`🌐 Server running at http://${HOST}:${PORT}`);
      console.log(`📊 Health check: http://${HOST}:${PORT}/api/health`);
      console.log(`🔌 WebSocket: ws://${HOST}:${PORT}/ws`);
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Perform pre-flight checks before starting services
   */
  async performPreflightChecks() {
    console.log('🔍 Performing pre-flight checks...');

    // Check required environment variables
    const requiredEnvVars = ['NODE_ENV'];
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      console.warn('⚠️ Missing environment variables:', missingVars.join(', '));
    }

    // Check memory availability
    const memUsage = process.memoryUsage();
    console.log(`💾 Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);

    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`⚙️ Node.js version: ${nodeVersion}`);

    console.log('✅ Pre-flight checks completed');
  }

  /**
   * Initialize all backend services
   */
  async initializeServices() {
    console.log('🔧 Initializing services...');

    try {
      // Initialize Firestore connection
      console.log('📊 Connecting to Firestore...');
      const dbHealth = await firestoreManager.healthCheck();
      this.healthChecks.set('firestore', dbHealth);
      console.log(`📊 Firestore status: ${dbHealth.status}`);

      // Initialize AI services
      console.log('🤖 Initializing AI services...');
      const aiHealth = await aiServices.healthCheck();
      this.healthChecks.set('ai', aiHealth);
      console.log(
        `🤖 AI services status: ${Object.values(aiHealth).filter((s) => s === 'healthy' || s === 'available').length} services available`
      );

      // Warm up caches
      if (process.env.ENABLE_CACHING !== 'false') {
        console.log('🔥 Warming up caches...');
        await performanceManager.warmCache();
      }

      console.log('✅ All services initialized successfully');
    } catch (error) {
      console.error('❌ Service initialization failed:', error);
      throw error;
    }
  }

  /**
   * Start the HTTP server
   */
  async startListening() {
    return new Promise((resolve, reject) => {
      this.server.listen(PORT, HOST, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });

      this.server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Port ${PORT} is already in use`);
        } else {
          console.error('❌ Server error:', error);
        }
        reject(error);
      });
    });
  }

  /**
   * Post-startup tasks
   */
  async postStartupTasks() {
    console.log('🔧 Running post-startup tasks...');

    // Start periodic health checks
    this.startHealthCheckMonitoring();

    // Start memory optimization
    this.startMemoryOptimization();

    // Log startup metrics
    const startupDuration = Date.now() - this.startupTime.getTime();
    console.log(`⏱️ Server startup completed in ${startupDuration}ms`);
  }

  /**
   * Setup graceful shutdown handlers
   */
  setupGracefulShutdown() {
    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

    signals.forEach((signal) => {
      process.on(signal, async () => {
        if (this.isShuttingDown) {
          console.log('🛑 Force shutdown initiated');
          process.exit(1);
        }

        console.log(`🛑 Received ${signal}, starting graceful shutdown...`);
        await this.gracefulShutdown();
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      this.gracefulShutdown().then(() => process.exit(1));
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      this.gracefulShutdown().then(() => process.exit(1));
    });
  }

  /**
   * Graceful shutdown sequence
   */
  async gracefulShutdown() {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log('🛑 Graceful shutdown initiated...');

    try {
      // Stop accepting new connections
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 HTTP server closed');
        });
      }

      // Shutdown WebSocket manager
      wsManager.shutdown();

      // Shutdown performance manager
      performanceManager.shutdown();

      // Shutdown Firestore connections
      await firestoreManager.shutdown();

      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }

  /**
   * Start periodic health check monitoring
   */
  startHealthCheckMonitoring() {
    setInterval(async () => {
      try {
        // Update health checks
        const dbHealth = await firestoreManager.healthCheck();
        this.healthChecks.set('firestore', dbHealth);

        const aiHealth = await aiServices.healthCheck();
        this.healthChecks.set('ai', aiHealth);

        // Log if any services are unhealthy
        const unhealthyServices = Array.from(this.healthChecks.entries())
          .filter(([_, health]) => health.status !== 'healthy' && health.status !== 'available')
          .map(([service]) => service);

        if (unhealthyServices.length > 0) {
          console.warn('⚠️ Unhealthy services detected:', unhealthyServices);
        }
      } catch (error) {
        console.error('❌ Health check error:', error);
      }
    }, 60000); // Check every minute
  }

  /**
   * Start periodic memory optimization
   */
  startMemoryOptimization() {
    setInterval(() => {
      performanceManager.optimizeMemory();
    }, 300000); // Every 5 minutes
  }

  /**
   * Get server status for health checks
   */
  getStatus() {
    return {
      status: 'healthy',
      environment: ENV,
      uptime: Date.now() - this.startupTime.getTime(),
      services: Object.fromEntries(this.healthChecks),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }
}

// Create and start the production server
const productionServer = new ProductionServer();

// Add health status endpoint
app.get('/api/status', (req, res) => {
  res.json(productionServer.getStatus());
});

// Start the server
productionServer.start().catch((error) => {
  console.error('💥 Fatal startup error:', error);
  process.exit(1);
});

// Export for testing
export default productionServer;
