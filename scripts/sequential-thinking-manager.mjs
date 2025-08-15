#!/usr/bin/env node

/**
 * Sequential Thinking Server Installation and Management
 * Ensures the MCP Sequential Thinking Server is properly installed and running
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

const SERVER_PATH = 'C:/Users/Austin/Documents/GitHub/servers/src/sequentialthinking/dist/index.js';
const SERVER_NAME = 'MCP Sequential Thinking Server';

class SequentialThinkingManager {
  constructor() {
    this.serverProcess = null;
    this.restartCount = 0;
    this.maxRestarts = 5;
  }

  checkServerExists() {
    if (!existsSync(SERVER_PATH)) {
      console.error(`❌ Server not found at: ${SERVER_PATH}`);
      console.log('📦 Building server...');
      return this.buildServer();
    }
    return true;
  }

  buildServer() {
    return new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: 'C:/Users/Austin/Documents/GitHub/servers/src/sequentialthinking',
        stdio: 'inherit',
        shell: true,
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Server built successfully');
          resolve(true);
        } else {
          console.error(`❌ Build failed with code ${code}`);
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });
  }

  async startServer() {
    if (this.restartCount >= this.maxRestarts) {
      console.error(
        `❌ Maximum restart attempts (${this.maxRestarts}) reached. Server may be unstable.`
      );
      return false;
    }

    if (!this.checkServerExists()) {
      try {
        await this.buildServer();
      } catch (error) {
        console.error('❌ Failed to build server:', error.message);
        return false;
      }
    }

    console.log(`🚀 Starting ${SERVER_NAME}...`);

    this.serverProcess = spawn('node', [SERVER_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: false,
    });

    this.serverProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`📝 [${SERVER_NAME}]: ${output}`);
      }
    });

    this.serverProcess.stderr.on('data', (data) => {
      const error = data.toString().trim();
      if (error) {
        console.error(`⚠️ [${SERVER_NAME}] Error: ${error}`);
      }
    });

    this.serverProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ ${SERVER_NAME} exited with code ${code}`);
        this.restartCount++;
        console.log(`🔄 Attempting restart (${this.restartCount}/${this.maxRestarts})...`);
        setTimeout(() => this.startServer(), 2000);
      } else {
        console.log(`✅ ${SERVER_NAME} stopped cleanly`);
      }
    });

    this.serverProcess.on('error', (error) => {
      console.error(`❌ Failed to start ${SERVER_NAME}:`, error.message);
      this.restartCount++;
      if (this.restartCount < this.maxRestarts) {
        console.log(`🔄 Attempting restart (${this.restartCount}/${this.maxRestarts})...`);
        setTimeout(() => this.startServer(), 2000);
      }
    });

    return true;
  }

  stop() {
    if (this.serverProcess) {
      console.log(`🛑 Stopping ${SERVER_NAME}...`);
      this.serverProcess.kill('SIGTERM');
      this.serverProcess = null;
    }
  }

  restart() {
    this.stop();
    setTimeout(() => this.startServer(), 1000);
  }

  getStatus() {
    return {
      running: this.serverProcess !== null && !this.serverProcess.killed,
      restartCount: this.restartCount,
      maxRestarts: this.maxRestarts,
      serverPath: SERVER_PATH,
    };
  }
}

// Export for use in other modules
export default SequentialThinkingManager;

// If run directly, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new SequentialThinkingManager();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received interrupt signal, shutting down gracefully...');
    manager.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received terminate signal, shutting down gracefully...');
    manager.stop();
    process.exit(0);
  });

  // Start the server
  manager.startServer().then((success) => {
    if (success) {
      console.log(`✅ ${SERVER_NAME} management started successfully`);
      console.log('📊 Status:', manager.getStatus());
    } else {
      console.error(`❌ Failed to start ${SERVER_NAME}`);
      process.exit(1);
    }
  });
}
