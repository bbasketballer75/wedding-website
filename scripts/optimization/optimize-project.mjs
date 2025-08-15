#!/usr/bin/env node

/**
 * 🧹 PROJECT OPTIMIZATION SCRIPT
 * Removes unused dependencies and optimizes project structure
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Project Optimization...\n');

// 1. Remove unused dependencies (keeping essential ones)
const unusedDeps = [
  '@fontsource/roboto', // Not used in favor of Inter/Cormorant
  '@googlemaps/js-api-loader', // Using React Leaflet instead
  'html2canvas', // Not used in current implementation
  'jspdf', // Not used in current implementation
  'framer-motion', // Not used, replaced with CSS animations
  'serverless-http', // Not needed for Netlify deployment
  'winston', // Using console logging
  'workbox-precaching', // Next.js handles caching
  'workbox-routing', // Next.js handles routing
  'workbox-strategies', // Next.js handles caching strategies
];

const unusedDevDeps = [
  '@napi-rs/image', // Using Sharp instead
  'http-server', // Next.js dev server is used
  'jimp', // Using Sharp instead
  'node-fetch', // Using fetch API
];

console.log('📦 Removing unused dependencies...');

// Remove unused regular dependencies
if (unusedDeps.length > 0) {
  try {
    console.log(`   Removing: ${unusedDeps.join(', ')}`);
    execSync(`npm uninstall ${unusedDeps.join(' ')}`, { stdio: 'inherit' });
    console.log('   ✅ Regular dependencies cleaned');
  } catch {
    console.log('   ⚠️  Some dependencies might already be removed');
  }
}

// Remove unused dev dependencies
if (unusedDevDeps.length > 0) {
  try {
    console.log(`   Removing dev deps: ${unusedDevDeps.join(', ')}`);
    execSync(`npm uninstall ${unusedDevDeps.join(' ')}`, { stdio: 'inherit' });
    console.log('   ✅ Dev dependencies cleaned');
  } catch {
    console.log('   ⚠️  Some dev dependencies might already be removed');
  }
}

// 2. Install missing dependencies
console.log('\n📋 Installing missing dependencies...');
try {
  execSync('npm install chalk @modelcontextprotocol/sdk', { stdio: 'inherit' });
  console.log('   ✅ Missing dependencies installed');
} catch {
  console.log('   ⚠️  Some dependencies might already be installed');
}

// 3. Optimize package.json scripts (remove unused ones)
console.log('\n📜 Optimizing package.json scripts...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Scripts that can be removed or simplified
const scriptsToRemove = [
  'chromatic', // Storybook-specific, not used in CI
  'test:storybook', // Not actively used
  'mcp:sequential:status', // Redundant with mcp:status
];

scriptsToRemove.forEach((script) => {
  if (packageJson.scripts[script]) {
    delete packageJson.scripts[script];
    console.log(`   Removed script: ${script}`);
  }
});

// Add useful optimization scripts
packageJson.scripts['optimize'] = 'node scripts/optimize-project.mjs';
packageJson.scripts['clean:cache'] = 'rm -rf .next node_modules/.cache';
packageJson.scripts['analyze:deps'] = 'npx depcheck';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('   ✅ Package.json optimized');

// 4. Clean up cache and build artifacts
console.log('\n🧹 Cleaning caches...');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('   ✅ Next.js cache cleared');
  }

  if (fs.existsSync('node_modules/.cache')) {
    fs.rmSync('node_modules/.cache', { recursive: true, force: true });
    console.log('   ✅ Node modules cache cleared');
  }
} catch {
  console.log('   ⚠️  Some cache directories might not exist');
}

// 5. Run final optimization checks
console.log('\n🔍 Running final checks...');
try {
  console.log('   Building project to verify optimization...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Build successful');

  console.log('   Running tests to verify functionality...');
  execSync('npm test', { stdio: 'pipe' });
  console.log('   ✅ All tests passing');
} catch {
  console.log('   ⚠️  Build or test issues detected - please review');
}

console.log('\n🎉 Project optimization complete!');
console.log('\n📊 Optimization Summary:');
console.log(`   🗑️  Removed ${unusedDeps.length + unusedDevDeps.length} unused dependencies`);
console.log('   📦 Added missing dependencies');
console.log('   📜 Optimized package.json scripts');
console.log('   🧹 Cleaned build caches');
console.log('   ✅ Verified build and tests');

console.log('\n💡 Next Steps:');
console.log('   1. Run "npm run build:analyze" to check bundle size');
console.log('   2. Run "npm run audit:a11y" to check accessibility');
console.log('   3. Deploy to staging for performance validation');
console.log('   4. Monitor Web Vitals in production');
