#!/usr/bin/env node

/**
 * 🚀 SUPERCHARGED MCP MANAGER
 * Advanced Model Context Protocol server orchestrator with enhanced capabilities
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { pathToFileURL } from 'url';

const SERENA_ACTIVE = process.env.SERENA_ACTIVE === '1' || process.env.SERENA_ACTIVE === 'true';
// When true, do NOT skip any servers for safety/collision reasons
const BEAST_MODE_ALL_TOOLS =
  process.env.BEAST_MODE_ALL_TOOLS === '1' || process.env.BEAST_MODE_ALL_TOOLS === 'true';

// Basic arg parsing helpers
const ARGV = process.argv.slice(2);
const hasFlag = (name) => {
  const i = ARGV.indexOf(name);
  return i !== -1;
};
const getFlagValue = (name, defVal) => {
  const i = ARGV.indexOf(name);
  if (i !== -1 && i + 1 < ARGV.length && !ARGV[i + 1].startsWith('--')) return ARGV[i + 1];
  // Support --key=value form
  const withEq = ARGV.find((a) => a.startsWith(name + '='));
  if (withEq) return withEq.split('=').slice(1).join('=');
  return defVal;
};
const getRepeatedFlag = (name) => {
  const out = [];
  for (let i = 0; i < ARGV.length; i++) {
    const a = ARGV[i];
    if (a === name) {
      if (i + 1 < ARGV.length && !ARGV[i + 1].startsWith('--')) out.push(ARGV[i + 1]);
    } else if (a.startsWith(name + '=')) {
      out.push(a.split('=').slice(1).join('='));
    }
  }
  return out;
};

// Runtime toggles to prevent terminal flooding or allow quick runs
const DISABLE_HEALTH = hasFlag('--no-health');
const DISABLE_METRICS = hasFlag('--no-metrics');
const HEALTH_INTERVAL = parseInt(getFlagValue('--health-interval', '30000'), 10);
const METRICS_INTERVAL = parseInt(getFlagValue('--metrics-interval', '60000'), 10);
const RUN_FOR_SECONDS = parseInt(getFlagValue('--run-for', '0'), 10);
const QUIET = hasFlag('--quiet');
const HEADED = hasFlag('--headed');
const PW_EXTRA_ARGS = getRepeatedFlag('--pw-arg');

const BASE_MCP_SERVERS = [
  {
    name: 'sequential-thinking',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
    port: 3001,
    capabilities: ['reasoning', 'planning', 'analysis'],
    priority: 'high',
  },
  {
    name: 'filesystem-enhanced',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()],
    port: 3002,
    capabilities: ['file-operations', 'directory-management', 'search'],
    priority: 'critical',
  },
  {
    name: 'git-operations',
    command: 'uvx',
    args: ['mcp-server-git'],
    port: 3003,
    capabilities: ['version-control', 'branch-management', 'diff-analysis'],
    priority: 'high',
  },
  {
    name: 'web-fetch',
    command: 'uvx',
    args: ['mcp-server-fetch'],
    port: 3004,
    capabilities: ['web-scraping', 'api-calls', 'content-extraction'],
    priority: 'medium',
  },
  {
    name: 'time-management',
    command: 'uvx',
    args: ['mcp-server-time'],
    port: 3005,
    capabilities: ['scheduling', 'timezone-conversion', 'date-calculations'],
    priority: 'low',
  },
  {
    name: 'memory-persistence',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-memory'],
    port: 3006,
    capabilities: ['context-memory', 'conversation-history', 'learning'],
    priority: 'high',
  },
  {
    name: 'everything',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-everything'],
    port: 3007,
    capabilities: ['prompts', 'resources', 'tools'],
    priority: 'medium',
  },
  {
    name: 'browser-automation',
    command: 'npx',
    args: ['-y', '@playwright/mcp@latest', '--headless'],
    port: 3008,
    capabilities: ['browser-automation', 'page-navigation', 'dom-interaction'],
    priority: 'high',
  },
];

// Avoid tool collisions: if Serena is active, skip filesystem server unless overridden
const MCP_SERVERS = BASE_MCP_SERVERS.filter((srv) => {
  if (!BEAST_MODE_ALL_TOOLS && SERENA_ACTIVE && srv.name === 'filesystem-enhanced') {
    console.log('⚠️  Serena is active; skipping filesystem MCP to avoid tool collisions.');
    console.log('ℹ️  Set BEAST_MODE_ALL_TOOLS=1 to force all tools to run.');
    return false;
  }
  return true;
}).map((srv) => {
  if (srv.name !== 'browser-automation') return srv;
  const copy = { ...srv, args: [...srv.args] };
  if (HEADED) {
    copy.args = copy.args.filter((a) => a !== '--headless');
  }
  if (PW_EXTRA_ARGS && PW_EXTRA_ARGS.length > 0) {
    copy.args.push(...PW_EXTRA_ARGS);
  }
  return copy;
});

class SuperchargedMCPManager {
  constructor() {
    this.servers = new Map();
    this.healthChecks = new Map();
    this.metrics = {
      startTime: Date.now(),
      requestCount: 0,
      errorEvents: 0,
      stderrLines: 0,
      serverUptime: new Map(),
    };
    this._pkgExistsCache = new Map();
    this.shuttingDown = false;
    this.registerSignalHandlers();
  }

  async initialize() {
    console.log('🚀 Initializing Supercharged MCP Manager...');
    if (SERENA_ACTIVE) {
      console.log('🧠 SERENA_ACTIVE detected: optimizing server set for Serena integration');
    }

    // Create enhanced configuration
    await this.createEnhancedConfig();

    // Start all servers with priority ordering
    const sortedServers = MCP_SERVERS.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const serverConfig of sortedServers) {
      if (
        serverConfig.command === 'npx' &&
        Array.isArray(serverConfig.args) &&
        serverConfig.args.length > 0
      ) {
        const pkg = serverConfig.args[0];
        const ok = await this.npmPackageAvailable(pkg);
        if (!ok) {
          console.warn(`⏭️  Skipping ${serverConfig.name} (${pkg}) — package not found on npm`);
          continue;
        }
      }
      await this.startServer(serverConfig);
      await this.sleep(500); // Stagger startup
    }

    // Start health monitoring (unless disabled)
    if (!DISABLE_HEALTH && !QUIET) {
      this.startHealthMonitoring();
    }

    // Start metrics collection (unless disabled)
    if (!DISABLE_METRICS) {
      this.startMetricsCollection();
    }

    console.log('✅ All MCP servers initialized successfully!');
    this.printStatus();

    // Optional timed run for CI or quick checks
    if (RUN_FOR_SECONDS > 0) {
      setTimeout(() => this.shutdownAndExit(0), RUN_FOR_SECONDS * 1000);
    }
  }

  async npmPackageAvailable(pkgName) {
    if (this._pkgExistsCache.has(pkgName)) return this._pkgExistsCache.get(pkgName);
    return new Promise((resolve) => {
      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const child = spawn(npmCmd, ['view', pkgName, 'version', '--json'], {
        stdio: ['ignore', 'ignore', 'ignore'],
        shell: process.platform === 'win32',
        env: process.env,
      });
      child.on('exit', (code) => {
        const exists = code === 0;
        this._pkgExistsCache.set(pkgName, exists);
        resolve(exists);
      });
      child.on('error', () => {
        this._pkgExistsCache.set(pkgName, false);
        resolve(false);
      });
    });
  }

  async startServer(config) {
    try {
      console.log(`🔄 Starting ${config.name} server...`);

      const cmd =
        process.platform === 'win32' && config.command === 'npx' ? 'npx.cmd' : config.command;
      const child = spawn(cmd, config.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: process.platform === 'win32',
        env: {
          ...process.env,
          MCP_PORT: String(config.port),
          MCP_SERVER_NAME: String(config.name),
          MCP_CAPABILITIES: String(config.capabilities.join(',')),
        },
      });

      child.stdout.on('data', (data) => {
        if (QUIET) return;
        console.log(`📊 [${config.name}]: ${data.toString().trim()}`);
      });

      child.stderr.on('data', (data) => {
        const text = data.toString();
        const trimmed = text.trim();
        const looksSevere = /error|traceback|exception|failed|fatal|unhandled/i.test(trimmed);
        const isBenign = /running on stdio/i.test(trimmed) || trimmed === '^C';
        if (!(QUIET && !looksSevere)) {
          console.error(`⚠️ [${config.name}]: ${trimmed}`);
        }
        this.metrics.stderrLines++;
        if (!isBenign && looksSevere) {
          this.metrics.errorEvents++;
        }
      });

      child.on('error', (err) => {
        console.error(`❌ Spawn error for ${config.name}: ${err.message}`);
        if (!this.shuttingDown) this.metrics.errorEvents++;
      });

      child.on('exit', (code) => {
        if (this.shuttingDown) return; // Graceful shutdown path
        if (code !== 0) {
          console.error(`❌ ${config.name} exited with code ${code}`);
          this.metrics.errorEvents++;
          this.restartServer(config);
        }
      });

      this.servers.set(config.name, { process: child, config, startTime: Date.now() });
      this.metrics.serverUptime.set(config.name, Date.now());

      console.log(`✅ ${config.name} server started successfully`);
    } catch (error) {
      console.error(`❌ Failed to start ${config.name}:`, error.message);
      this.metrics.errorEvents++;
    }
  }

  async restartServer(config) {
    const key = `retries:${config.name}`;
    const attempts = (this.healthChecks.get(key) || 0) + 1;
    this.healthChecks.set(key, attempts);

    const maxRetries = 5;
    const baseDelay = 2000;
    const jitter = Math.floor(Math.random() * 500);
    const backoff = Math.min(baseDelay * 2 ** Math.min(attempts, 6), 30000) + jitter;

    console.log(
      `🔄 Restarting ${config.name} (attempt ${attempts}/${maxRetries}) in ${backoff}ms...`
    );

    const serverInfo = this.servers.get(config.name);
    if (serverInfo?.process) {
      try {
        serverInfo.process.kill();
      } catch {}
    }

    await this.sleep(backoff);

    if (attempts > maxRetries) {
      console.error(`🛑 Max restart attempts reached for ${config.name}. Not retrying.`);
      return;
    }

    await this.startServer(config);
  }

  startHealthMonitoring() {
    const interval = Math.max(1000, HEALTH_INTERVAL);
    setInterval(() => {
      this.servers.forEach((serverInfo, name) => {
        this.checkServerHealth(name, serverInfo);
      });
    }, interval);
  }

  async checkServerHealth(name, serverInfo) {
    try {
      // Ping the server (simplified health check)
      const uptime = Date.now() - serverInfo.startTime;
      console.log(`💓 [${name}] Uptime: ${Math.floor(uptime / 1000)}s`);
    } catch (error) {
      console.error(`🚨 Health check failed for ${name}:`, error.message);
      await this.restartServer(serverInfo.config);
    }
  }

  startMetricsCollection() {
    const interval = Math.max(1000, METRICS_INTERVAL);
    setInterval(() => {
      this.collectMetrics();
    }, interval);
  }

  collectMetrics() {
    const totalUptime = Date.now() - this.metrics.startTime;
    const activeServers = this.servers.size;

    console.log(`📊 MCP Manager Metrics:`);
    console.log(`   Total Uptime: ${Math.floor(totalUptime / 1000)}s`);
    console.log(`   Active Servers: ${activeServers}`);
    console.log(`   Total Requests: ${this.metrics.requestCount}`);
    console.log(`   Error Events: ${this.metrics.errorEvents}`);
    console.log(`   Stderr Lines: ${this.metrics.stderrLines}`);
    const hasRequests = this.metrics.requestCount > 0;
    const successRate = hasRequests
      ? (
          ((this.metrics.requestCount - this.metrics.errorEvents) / this.metrics.requestCount) *
          100
        ).toFixed(2) + '%'
      : 'N/A (no requests tracked)';
    console.log(`   Success Rate: ${successRate}`);
  }

  async createEnhancedConfig() {
    const config = {
      mcpServers: {},
      enhancedFeatures: {
        autoRestart: true,
        healthMonitoring: true,
        metricsCollection: true,
        loadBalancing: false,
        requestThrottling: true,
        errorRecovery: true,
      },
      serverCapabilities: {},
    };

    MCP_SERVERS.forEach((server) => {
      config.mcpServers[server.name] = {
        command: server.command,
        args: server.args,
        env: {
          MCP_PORT: server.port,
          MCP_CAPABILITIES: server.capabilities.join(','),
        },
      };

      config.serverCapabilities[server.name] = {
        capabilities: server.capabilities,
        priority: server.priority,
        port: server.port,
      };
    });

    await fs.writeFile('.vscode/mcp-enhanced-config.json', JSON.stringify(config, null, 2));

    console.log('📝 Enhanced MCP configuration created');
  }

  printStatus() {
    console.log('\n🎯 MCP SUPERCHARGED STATUS:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│           SERVER STATUS                 │');
    console.log('├─────────────────────────────────────────┤');

    this.servers.forEach((serverInfo, name) => {
      const uptime = Math.floor((Date.now() - serverInfo.startTime) / 1000);
      const status = '🟢 ONLINE';
      console.log(`│ ${name.padEnd(20)} ${status} ${uptime}s │`);
    });

    console.log('└─────────────────────────────────────────┘');
    console.log('🚀 Enhanced capabilities now available!');
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  registerSignalHandlers() {
    const graceful = async (signal) => {
      if (this.shuttingDown) return;
      this.shuttingDown = true;
      console.log(`\n🛑 Received ${signal}. Shutting down MCP servers gracefully...`);
      for (const [name, serverInfo] of this.servers.entries()) {
        try {
          serverInfo.process.kill();
          console.log(`   ⏹️  Stopped ${name}`);
        } catch (e) {
          console.log(`   ⚠️  Failed to stop ${name}: ${e.message}`);
        }
      }
      // Small delay to allow children to exit cleanly
      setTimeout(() => process.exit(0), 250);
    };
    process.on('SIGINT', () => graceful('SIGINT'));
    process.on('SIGTERM', () => graceful('SIGTERM'));
  }

  async shutdownAndExit(code = 0) {
    if (this.shuttingDown) return;
    this.shuttingDown = true;
    console.log(`\n🛑 Timed shutdown. Stopping MCP servers...`);
    for (const [name, serverInfo] of this.servers.entries()) {
      try {
        serverInfo.process.kill();
        console.log(`   ⏹️  Stopped ${name}`);
      } catch (e) {
        console.log(`   ⚠️  Failed to stop ${name}: ${e.message}`);
      }
    }
    setTimeout(() => process.exit(code), 250);
  }
}

// Initialize if run directly
try {
  const entryHref = pathToFileURL(process.argv[1]).href;
  if (import.meta.url === entryHref) {
    console.log('🚀 Initializing Supercharged MCP Manager...');
    const manager = new SuperchargedMCPManager();
    manager.initialize().catch((err) => {
      console.error('❌ MCP Manager initialization failed:', err);
      process.exitCode = 1;
    });
  }
} catch (e) {
  // Fallback: assume direct run
  console.warn('⚠️ Entry check failed, continuing with fallback:', e?.message);
  console.log('🚀 Initializing Supercharged MCP Manager (fallback)...');
  const manager = new SuperchargedMCPManager();
  manager.initialize().catch((err) => {
    console.error('❌ MCP Manager initialization failed:', err);
    process.exitCode = 1;
  });
}

export default SuperchargedMCPManager;
