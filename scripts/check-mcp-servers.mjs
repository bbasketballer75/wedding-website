#!/usr/bin/env node

/**
 * Comprehensive MCP Server Status Check
 * Monitors all MCP servers including Sequential Thinking
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

const servers = [
  {
    name: 'Sequential Thinking Server',
    path: 'C:/Users/Austin/Documents/GitHub/servers/src/sequentialthinking/dist/index.js',
    port: null,
    description: 'Provides sequential thinking capabilities for complex reasoning',
  },
  {
    name: 'Memory Server',
    path: 'C:/Users/Austin/Documents/GitHub/servers/src/memory/dist/index.js',
    port: null,
    description: 'Provides persistent memory and knowledge graph capabilities',
  },
  {
    name: 'Filesystem Server',
    path: 'C:/Users/Austin/Documents/GitHub/servers/src/filesystem/dist/index.js',
    port: null,
    description: 'Provides filesystem access and manipulation capabilities',
  },
  {
    name: 'Frontend Dev Server',
    path: null,
    port: 3001,
    description: 'Next.js development server',
  },
  {
    name: 'Backend API Server',
    path: null,
    port: 3002,
    description: 'Express.js backend API server',
  },
];

function checkProcess(processName, pathFilter = null) {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32' ? 'wmic' : 'ps';
    const args =
      process.platform === 'win32'
        ? ['process', 'where', `name="${processName}"`, 'get', 'ProcessId,CommandLine']
        : ['aux'];

    const proc = spawn(cmd, args, { stdio: 'pipe' });
    let output = '';

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', () => {
      if (pathFilter) {
        const isRunning = output.includes(pathFilter);
        resolve(isRunning);
      } else {
        // For port-based services, we'll check differently
        resolve(false);
      }
    });

    proc.on('error', () => {
      resolve(false);
    });
  });
}

function checkPort(port) {
  return new Promise((resolve) => {
    const cmd = 'netstat';
    const args = ['-an'];

    const proc = spawn(cmd, args, { stdio: 'pipe' });
    let output = '';

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', () => {
      const isListening = output.includes(`:${port}`) && output.includes('LISTENING');
      resolve(isListening);
    });

    proc.on('error', () => {
      resolve(false);
    });
  });
}

async function checkServer(server) {
  let isRunning = false;

  if (server.port) {
    isRunning = await checkPort(server.port);
  } else if (server.path) {
    const fileExists = existsSync(server.path);
    if (fileExists) {
      isRunning = await checkProcess('node.exe', server.path);
    }
  }

  return {
    name: server.name,
    running: isRunning,
    path: server.path,
    port: server.port,
    description: server.description,
    fileExists: server.path ? existsSync(server.path) : null,
  };
}

async function checkAllServers() {
  console.log('🔍 Checking MCP Server Status...\n');

  const results = await Promise.all(servers.map(checkServer));

  let allRunning = true;
  let runningCount = 0;

  results.forEach((result) => {
    const status = result.running ? '✅ RUNNING' : '❌ STOPPED';
    const statusColor = result.running ? '\x1b[32m' : '\x1b[31m';
    const resetColor = '\x1b[0m';

    console.log(`${statusColor}${status}${resetColor} ${result.name}`);
    console.log(`   📝 ${result.description}`);

    if (result.port) {
      console.log(`   🌐 Port: ${result.port}`);
    }

    if (result.path) {
      console.log(`   📁 Path: ${result.path}`);
      if (result.fileExists === false) {
        console.log(`   ⚠️  File not found! Server needs to be built.`);
      }
    }

    console.log('');

    if (result.running) {
      runningCount++;
    } else {
      allRunning = false;
    }
  });

  console.log(`📊 Summary: ${runningCount}/${results.length} servers running`);

  if (allRunning) {
    console.log('🎉 All servers are running successfully!');
  } else {
    console.log('⚠️  Some servers are not running. Use management scripts to start them.');
    console.log('\n🚀 Quick start commands:');
    console.log('   npm run dev:full              # Start all development servers');
    console.log('   npm run mcp:sequential        # Start Sequential Thinking server');
    console.log('   scripts/start-sequential-thinking.ps1  # Manage Sequential Thinking server');
  }

  return allRunning;
}

// Run if called directly
if (process.argv[1].includes('check-mcp-servers.mjs')) {
  checkAllServers()
    .then((allRunning) => {
      process.exit(allRunning ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Error checking servers:', error.message);
      process.exit(1);
    });
}

export default checkAllServers;
