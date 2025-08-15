#!/usr/bin/env node
/**
 * 🚫 ESLint Legacy Config Prevention Monitor
 *
 * This script monitors for and prevents the automatic recreation of legacy
 * ESLint configuration files that can cause endless configuration conflicts.
 *
 * Usage: npm run monitor:eslint-guard
 */

import chalk from 'chalk';
import { existsSync, watch } from 'fs';
import { access, unlink } from 'fs/promises';
import path from 'path';

const LEGACY_ESLINT_FILES = [
  '.eslintrc.json',
  '.eslintrc.js',
  '.eslintrc.yml',
  '.eslintrc.yaml',
  '.eslintrc',
];

const FLAT_CONFIG_FILE = 'eslint.config.mjs';

class ESLintGuard {
  constructor() {
    this.projectRoot = process.cwd();
    this.isMonitoring = false;
    this.deletionCount = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      detection: chalk.magenta,
    };

    console.log(`${chalk.gray(`[${timestamp}]`)} ${colors[type]('🚫 ESLint Guard:')} ${message}`);
  }

  async checkForLegacyConfigs() {
    const foundFiles = [];

    for (const file of LEGACY_ESLINT_FILES) {
      const filePath = path.join(this.projectRoot, file);
      if (existsSync(filePath)) {
        foundFiles.push(file);
      }
    }

    return foundFiles;
  }

  async removeLegacyConfig(filename) {
    try {
      const filePath = path.join(this.projectRoot, filename);
      await unlink(filePath);
      this.deletionCount++;
      this.log(
        `Automatically removed legacy config: ${filename} (${this.deletionCount} total)`,
        'success'
      );

      if (this.deletionCount >= 3) {
        this.log(
          `⚠️  Multiple legacy configs detected (${this.deletionCount}). Check for tools auto-generating configs!`,
          'warning'
        );
      }
    } catch (error) {
      this.log(`Failed to remove ${filename}: ${error.message}`, 'error');
    }
  }

  async validateFlatConfig() {
    const flatConfigPath = path.join(this.projectRoot, FLAT_CONFIG_FILE);

    if (!existsSync(flatConfigPath)) {
      this.log(`❌ Flat config file missing: ${FLAT_CONFIG_FILE}`, 'error');
      return false;
    }

    this.log(`✅ Flat config file exists: ${FLAT_CONFIG_FILE}`, 'success');
    return true;
  }

  async performInitialCleanup() {
    this.log('Starting initial cleanup scan...', 'info');

    const legacyFiles = await this.checkForLegacyConfigs();

    if (legacyFiles.length > 0) {
      this.log(
        `Found ${legacyFiles.length} legacy config file(s): ${legacyFiles.join(', ')}`,
        'detection'
      );

      for (const file of legacyFiles) {
        await this.removeLegacyConfig(file);
      }
    } else {
      this.log('No legacy config files found - good!', 'success');
    }

    await this.validateFlatConfig();
  }

  startMonitoring() {
    if (this.isMonitoring) {
      this.log('Already monitoring...', 'warning');
      return;
    }

    this.log('Starting file system monitoring for legacy ESLint configs...', 'info');
    this.isMonitoring = true;

    // Watch the project root for file changes
    const watcher = watch(this.projectRoot, { persistent: true }, async (eventType, filename) => {
      if (!filename || !LEGACY_ESLINT_FILES.includes(filename)) {
        return;
      }

      if (eventType === 'rename' || eventType === 'change') {
        const filePath = path.join(this.projectRoot, filename);

        try {
          await access(filePath);
          // File exists - it was created or modified
          this.log(`🚨 DETECTED: Legacy config file created/modified: ${filename}`, 'detection');

          // Give a small delay to ensure file write is complete
          setTimeout(async () => {
            await this.removeLegacyConfig(filename);
          }, 100);
        } catch {
          // File doesn't exist - it was deleted (which is what we want)
          this.log(`✅ Legacy config file removed: ${filename}`, 'success');
        }
      }
    });

    // Handle process cleanup
    process.on('SIGINT', () => {
      this.log('Stopping monitoring...', 'info');
      watcher.close();
      this.generateReport();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      watcher.close();
      this.generateReport();
      process.exit(0);
    });
  }

  generateReport() {
    this.log(`\n📊 ESLint Guard Session Report:`, 'info');
    this.log(`   • Legacy configs removed: ${this.deletionCount}`, 'info');
    this.log(`   • Monitoring duration: ${Math.round(process.uptime())} seconds`, 'info');

    if (this.deletionCount > 0) {
      this.log(`\n💡 Recommendations:`, 'warning');
      this.log(`   • Check VS Code ESLint extension settings`, 'warning');
      this.log(`   • Verify no tools are auto-generating legacy configs`, 'warning');
      this.log(`   • Ensure eslint.useFlatConfig is set to true in VS Code`, 'warning');
    }
  }

  async run() {
    console.log(chalk.cyan.bold('\n🚫 ESLint Legacy Config Guard\n'));

    await this.performInitialCleanup();

    if (process.argv.includes('--monitor')) {
      this.startMonitoring();
      this.log('Monitoring active. Press Ctrl+C to stop and view report.', 'info');
    } else {
      this.log('One-time cleanup completed. Use --monitor flag for continuous monitoring.', 'info');
      this.generateReport();
    }
  }
}

// Run the guard
const guard = new ESLintGuard();
guard.run().catch((error) => {
  console.error(chalk.red('ESLint Guard failed:'), error);
  process.exit(1);
});
