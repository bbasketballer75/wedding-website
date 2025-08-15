#!/usr/bin/env node

/**
 * Comprehensive MCP Server Health Check and Diagnostic Tool
 * Checks all configured MCP servers and fixes connection issues
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import net from 'net';

const MCP_CONFIG_PATH = '.vscode/mcp.json';
const COMMON_PORTS = [5188, 3001, 3002, 8080, 8000, 5000];

class MCPHealthChecker {
  constructor() {
    this.mcpConfig = null;
    this.results = {
      servers: {},
      ports: {},
      processes: {},
      issues: [],
      recommendations: [],
    };
  }

  async loadMCPConfig() {
    try {
      const configContent = await fs.readFile(MCP_CONFIG_PATH, 'utf-8');
      this.mcpConfig = JSON.parse(configContent);
      console.log('✅ MCP configuration loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to load MCP configuration:', error.message);
      this.results.issues.push('MCP configuration file not found or invalid');
      return false;
    }
  }

  async checkPortAvailability(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      server.on('error', () => resolve(false));
    });
  }

  async checkPortUsage(port) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.on('error', () => resolve(false));
      socket.connect(port, 'localhost');
    });
  }

  async testServerConnection(serverName, config) {
    console.log(`🔍 Testing ${serverName} server...`);

    const result = {
      name: serverName,
      command: config.command,
      args: config.args,
      status: 'unknown',
      issues: [],
      recommendations: [],
    };

    // Check if command exists
    try {
      const process = spawn(config.command, ['--version'], { stdio: 'pipe' });
      await new Promise((resolve, reject) => {
        process.on('close', (code) => {
          if (code === 0 || code === null) {
            result.commandAvailable = true;
            resolve();
          } else {
            result.commandAvailable = false;
            reject(new Error(`Command not available: ${config.command}`));
          }
        });
        process.on('error', reject);
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });
    } catch {
      result.commandAvailable = false;
      result.issues.push(`Command '${config.command}' not available`);
      result.recommendations.push(`Install ${config.command} or update PATH`);
    }

    // Check if server files exist
    if (config.args && config.args.length > 0) {
      const serverPath = config.args[0];
      if ((serverPath && serverPath.includes('.js')) || serverPath.includes('.ts')) {
        try {
          await fs.access(serverPath);
          result.fileExists = true;
        } catch {
          result.fileExists = false;
          result.issues.push(`Server file not found: ${serverPath}`);
          result.recommendations.push(`Check if ${serverPath} exists`);
        }
      }
    }

    // Determine overall status
    if (result.commandAvailable && result.fileExists !== false) {
      result.status = 'healthy';
      console.log(`  ✅ ${serverName}: Healthy`);
    } else {
      result.status = 'issues';
      console.log(`  ❌ ${serverName}: Issues detected`);
    }

    return result;
  }

  async checkCommonPorts() {
    console.log('🔍 Checking common MCP ports...');

    for (const port of COMMON_PORTS) {
      const available = await this.checkPortAvailability(port);
      const inUse = await this.checkPortUsage(port);

      this.results.ports[port] = {
        available: available,
        inUse: inUse,
        status: inUse ? 'occupied' : 'free',
      };

      if (port === 5188) {
        console.log(`  🎯 Port 5188 (Pylance MCP): ${inUse ? '✅ In use' : '❌ Not in use'}`);
        if (!inUse) {
          this.results.issues.push('Port 5188 (expected by Pylance) not in use');
          this.results.recommendations.push(
            'Start Pylance MCP server or disable Pylance MCP integration'
          );
        }
      } else {
        console.log(`  📡 Port ${port}: ${inUse ? 'In use' : 'Free'}`);
      }
    }
  }

  async generateReport() {
    console.log('\n📊 MCP Server Health Report');
    console.log('='.repeat(50));

    // Server status summary
    const healthyServers = Object.values(this.results.servers).filter(
      (s) => s.status === 'healthy'
    ).length;
    const totalServers = Object.keys(this.results.servers).length;

    console.log(`\n🖥️  Server Status: ${healthyServers}/${totalServers} healthy`);

    Object.values(this.results.servers).forEach((server) => {
      const icon = server.status === 'healthy' ? '✅' : '❌';
      console.log(`  ${icon} ${server.name}: ${server.status}`);
    });

    // Port summary
    console.log(`\n🔌 Port Usage:`);
    Object.entries(this.results.ports).forEach(([port, info]) => {
      let icon = '📡';
      if (port === '5188') {
        icon = info.inUse ? '✅' : '❌';
      }
      console.log(`  ${icon} Port ${port}: ${info.status}`);
    });

    // Issues and recommendations
    if (this.results.issues.length > 0) {
      console.log(`\n⚠️  Issues Found:`);
      this.results.issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
    }

    if (this.results.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`);
      this.results.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }

    // Pylance specific guidance
    if (!this.results.ports[5188]?.inUse) {
      console.log(`\n🎯 Pylance MCP Server Fix:`);
      console.log(`  The error you're seeing is because VS Code Pylance extension`);
      console.log(`  expects an MCP server on port 5188, but none is running.`);
      console.log(`  \n  Options to fix:`);
      console.log(`  1. Disable Pylance MCP in VS Code settings`);
      console.log(`  2. Install and configure Pylance MCP server`);
      console.log(`  3. Add port 5188 configuration to mcp.json`);
    }

    return this.results;
  }

  async runFullDiagnostic() {
    console.log('🚀 Starting MCP Server Health Check...\n');

    // Load configuration
    if (!(await this.loadMCPConfig())) {
      return this.results;
    }

    // Test each configured server
    if (this.mcpConfig?.mcpServers) {
      for (const [serverName, config] of Object.entries(this.mcpConfig.mcpServers)) {
        const result = await this.testServerConnection(serverName, config);
        this.results.servers[serverName] = result;
      }
    }

    // Check ports
    await this.checkCommonPorts();

    // Generate report
    await this.generateReport();

    return this.results;
  }
}

// Run the diagnostic
const checker = new MCPHealthChecker();
checker
  .runFullDiagnostic()
  .then((results) => {
    console.log('\n✨ Diagnostic complete!');
    process.exit(results.issues.length > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('❌ Diagnostic failed:', error);
    process.exit(1);
  });
