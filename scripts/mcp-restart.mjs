#!/usr/bin/env node

/**
 * MCP Server Restart and Repair Tool
 * Fixes common MCP server issues and restarts them properly
 */

import { exec, spawn } from 'child_process';
import { promises as fs } from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

class MCPServerManager {
  constructor() {
    this.mcpConfig = null;
    this.serverProcesses = new Map();
  }

  async loadMCPConfig() {
    try {
      const configContent = await fs.readFile('.vscode/mcp.json', 'utf-8');
      this.mcpConfig = JSON.parse(configContent);
      console.log('✅ MCP configuration loaded');
      return true;
    } catch (error) {
      console.error('❌ Failed to load MCP configuration:', error.message);
      return false;
    }
  }

  async killExistingProcesses() {
    console.log('🔄 Stopping existing MCP server processes...');

    try {
      // Kill any existing MCP processes
      await execPromise(
        'Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*python*"} | Where-Object {$_.CommandLine -like "*mcp*"} | Stop-Process -Force -ErrorAction SilentlyContinue',
        {
          shell: 'powershell',
        }
      );
      console.log('✅ Stopped existing MCP processes');
    } catch {
      console.log('ℹ️  No existing MCP processes to stop');
    }

    // Wait a moment for processes to fully terminate
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  async installMissingDependencies() {
    console.log('📦 Checking and installing missing dependencies...');

    const dependencies = [
      { name: 'npx', check: 'npx --version', install: null }, // Already available with npm
      { name: 'tsx', check: 'npx tsx --version', install: 'npm install -g tsx' },
      { name: 'python', check: 'python --version', install: 'Install Python from python.org' },
      { name: 'node', check: 'node --version', install: null },
    ];

    for (const dep of dependencies) {
      try {
        await execPromise(dep.check, { timeout: 5000 });
        console.log(`  ✅ ${dep.name}: Available`);
      } catch {
        console.log(`  ❌ ${dep.name}: Missing`);
        if (dep.install && dep.install.startsWith('npm')) {
          console.log(`  🔧 Installing ${dep.name}...`);
          try {
            await execPromise(dep.install, { timeout: 30000 });
            console.log(`  ✅ ${dep.name}: Installed`);
          } catch (installError) {
            console.log(`  ❌ Failed to install ${dep.name}: ${installError.message}`);
          }
        } else if (dep.install) {
          console.log(`  💡 Manual installation required: ${dep.install}`);
        }
      }
    }
  }

  async startServer(serverName, config) {
    console.log(`🚀 Starting ${serverName} server...`);

    try {
      const process = spawn(config.command, config.args || [], {
        stdio: ['ignore', 'pipe', 'pipe'],
        cwd: process.cwd(),
      });

      this.serverProcesses.set(serverName, process);

      // Handle process output
      process.stdout?.on('data', (data) => {
        console.log(`  📡 ${serverName}: ${data.toString().trim()}`);
      });

      process.stderr?.on('data', (data) => {
        const message = data.toString().trim();
        if (!message.includes('ExperimentalWarning') && !message.includes('punycode')) {
          console.log(`  ⚠️  ${serverName}: ${message}`);
        }
      });

      process.on('close', (code) => {
        if (code !== 0 && code !== null) {
          console.log(`  ❌ ${serverName}: Exited with code ${code}`);
        } else {
          console.log(`  ✅ ${serverName}: Running`);
        }
      });

      process.on('error', (error) => {
        console.log(`  ❌ ${serverName}: Error - ${error.message}`);
      });

      // Give the process a moment to start
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!process.killed && process.pid) {
        console.log(`  ✅ ${serverName}: Started (PID: ${process.pid})`);
        return true;
      } else {
        console.log(`  ❌ ${serverName}: Failed to start`);
        return false;
      }
    } catch (error) {
      console.log(`  ❌ ${serverName}: Failed to start - ${error.message}`);
      return false;
    }
  }

  async startAllServers() {
    if (!this.mcpConfig?.mcpServers) {
      console.log('❌ No MCP servers configured');
      return;
    }

    console.log('🚀 Starting all MCP servers...\n');

    const results = [];
    for (const [serverName, config] of Object.entries(this.mcpConfig.mcpServers)) {
      const success = await this.startServer(serverName, config);
      results.push({ name: serverName, success });
    }

    console.log('\n📊 MCP Server Startup Summary:');
    results.forEach((result) => {
      const icon = result.success ? '✅' : '❌';
      console.log(`  ${icon} ${result.name}`);
    });

    const successCount = results.filter((r) => r.success).length;
    console.log(`\n🎯 Result: ${successCount}/${results.length} servers started successfully`);

    return results;
  }

  async runFullRestart() {
    console.log('🔄 MCP Server Full Restart and Repair\n');

    // Step 1: Load configuration
    if (!(await this.loadMCPConfig())) {
      return false;
    }

    // Step 2: Stop existing processes
    await this.killExistingProcesses();

    // Step 3: Install missing dependencies
    await this.installMissingDependencies();

    // Step 4: Start all servers
    const results = await this.startAllServers();

    console.log('\n✨ MCP Server restart complete!');
    console.log('💡 To check server status, run: npm run mcp:status');
    console.log('💡 Pylance MCP integration has been disabled in VS Code settings');

    return results;
  }
}

// Run the restart
const manager = new MCPServerManager();
manager
  .runFullRestart()
  .then(() => {
    console.log('\n🎉 All done! Your MCP servers should now be running properly.');
    console.log('🔧 If you still see errors, restart VS Code to reload the settings.');
  })
  .catch((error) => {
    console.error('❌ Restart failed:', error);
    process.exit(1);
  });
