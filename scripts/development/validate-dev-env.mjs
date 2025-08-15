#!/usr/bin/env node

/**
 * Development Environment Validator
 * Checks for common issues before starting the dev environment
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

class DevValidator {
  constructor() {
    this.issues = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m', // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m',
    };

    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async checkPortAvailability(port) {
    try {
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      return !stdout.trim(); // Return true if no output (port available)
    } catch {
      return true; // Assume available if command fails
    }
  }

  async validatePorts() {
    this.log('🔍 Checking port availability...', 'info');

    const portsToCheck = [3001, 3002];
    const busyPorts = [];

    for (const port of portsToCheck) {
      const available = await this.checkPortAvailability(port);
      if (!available) {
        busyPorts.push(port);
      }
    }

    if (busyPorts.length > 0) {
      this.warnings.push(
        `Ports ${busyPorts.join(', ')} are already in use. The startup script will handle this.`
      );
    } else {
      this.log('✅ All required ports are available', 'success');
    }
  }

  validateFiles() {
    this.log('📁 Checking required files...', 'info');

    const requiredFiles = [
      'package.json',
      'backend/package.json',
      'config/ports.js',
      '.env.local',
      'scripts/dev-startup.ps1',
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        this.issues.push(`Missing required file: ${file}`);
      }
    }

    if (this.issues.length === 0) {
      this.log('✅ All required files present', 'success');
    }
  }

  async validateDependencies() {
    this.log('📦 Checking dependencies...', 'info');

    try {
      // Check if node_modules exists
      if (!fs.existsSync('node_modules')) {
        this.issues.push('node_modules not found. Run: npm install');
        return;
      }

      if (!fs.existsSync('backend/node_modules')) {
        this.issues.push('Backend dependencies not found. Run: cd backend && npm install');
        return;
      }

      this.log('✅ Dependencies installed', 'success');
    } catch (error) {
      this.issues.push(`Error checking dependencies: ${error.message}`);
    }
  }

  validateEnvironment() {
    this.log('🔧 Checking environment configuration...', 'info');

    const envFile = '.env.local';
    if (fs.existsSync(envFile)) {
      const envContent = fs.readFileSync(envFile, 'utf8');

      // Check for required environment variables
      const requiredVars = ['NODE_ENV', 'FIRESTORE_EMULATOR_HOST'];
      const missingVars = requiredVars.filter((varName) => !envContent.includes(varName));

      if (missingVars.length > 0) {
        this.warnings.push(`Missing environment variables: ${missingVars.join(', ')}`);
      } else {
        this.log('✅ Environment configuration looks good', 'success');
      }
    } else {
      this.warnings.push('No .env.local file found. Some features may not work.');
    }
  }

  async validateCorsConfiguration() {
    this.log('🌐 Checking CORS configuration...', 'info');

    try {
      // Use URL for proper cross-platform path handling
      const configUrl = new URL('../config/ports.js', import.meta.url);
      const portsConfig = await import(configUrl.href);
      const corsOrigins = portsConfig.CORS_ORIGINS;

      // Check if common development ports are included
      const commonDevPorts = ['3001', '3000'];
      const missingPorts = commonDevPorts.filter(
        (port) => !corsOrigins.some((origin) => origin.includes(`:${port}`))
      );

      if (missingPorts.length > 0) {
        this.warnings.push(`CORS may not allow ports: ${missingPorts.join(', ')}`);
      } else {
        this.log('✅ CORS configuration includes common dev ports', 'success');
      }
    } catch (error) {
      this.warnings.push(`Could not validate CORS configuration: ${error.message}`);
    }
  }

  async run() {
    this.log('🚀 Wedding Website Development Environment Validator', 'info');
    this.log('================================================', 'info');

    // Run all validations
    await this.validatePorts();
    this.validateFiles();
    await this.validateDependencies();
    this.validateEnvironment();
    await this.validateCorsConfiguration();

    // Report results
    this.log('\n📋 Validation Results:', 'info');
    this.log('==================', 'info');

    if (this.issues.length === 0) {
      this.log('✅ No critical issues found!', 'success');
    } else {
      this.log('❌ Critical Issues Found:', 'error');
      this.issues.forEach((issue) => this.log(`  • ${issue}`, 'error'));
    }

    if (this.warnings.length > 0) {
      this.log('⚠️  Warnings:', 'warning');
      this.warnings.forEach((warning) => this.log(`  • ${warning}`, 'warning'));
    }

    // Provide recommendations
    this.log('\n🎯 Recommendations:', 'info');
    if (this.issues.length === 0) {
      this.log('  Run: npm run dev:start', 'success');
      this.log('  Or:  npm run dev:clean (if you have port conflicts)', 'success');
    } else {
      this.log('  Fix the critical issues above, then run the validator again', 'warning');
    }

    return this.issues.length === 0;
  }
}

// Run validator if called directly
// Handle Windows path formatting for execution check
const currentFileUrl = new URL(import.meta.url).href;
const executedFileUrl = new URL(`file:///${process.argv[1].replace(/\\/g, '/')}`).href;

if (currentFileUrl === executedFileUrl) {
  const validator = new DevValidator();
  validator.run().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

export default DevValidator;
