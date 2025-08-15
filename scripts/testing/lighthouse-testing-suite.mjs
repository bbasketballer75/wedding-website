#!/usr/bin/env node

/**
 * Lighthouse Testing Suite
 * Comprehensive local testing before production deployment
 */

import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔍 LIGHTHOUSE AUDIT & MANUAL TESTING SUITE');
console.log('==========================================\n');

async function installLighthouse() {
  try {
    await execAsync('lighthouse --version');
    console.log('✅ Lighthouse already installed');
    return true;
  } catch {
    console.log('📦 Installing Lighthouse...');
    try {
      await execAsync('npm install -g lighthouse');
      console.log('✅ Lighthouse installed successfully');
      return true;
    } catch (error) {
      console.log('❌ Failed to install Lighthouse:', error.message);
      return false;
    }
  }
}

// Available functions for manual testing (uncomment in main() to use):

async function _startLocalServer() {
  console.log('🚀 Starting local production server...');

  // Build first
  try {
    await execAsync('npm run build');
    console.log('✅ Production build completed');
  } catch (error) {
    console.log('❌ Build failed:', error.message);
    return null;
  }

  // Start server
  try {
    exec('npm start');
    console.log('✅ Local server starting on http://localhost:3000');

    // Wait for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return 'http://localhost:3000';
  } catch (error) {
    console.log('❌ Failed to start server:', error.message);
    return null;
  }
}

async function _runLighthouseAudit(url) {
  // Available for manual testing
  console.log('\n🔍 RUNNING LIGHTHOUSE AUDIT');
  console.log('============================\n');

  const reportPath = './lighthouse-report.html';
  const jsonPath = './lighthouse-report.json';

  try {
    console.log(`⏳ Auditing ${url}...`);
    await execAsync(
      `lighthouse ${url} --output=html --output=json --output-path=${reportPath.replace('.html', '')} --chrome-flags="--headless"`
    );

    console.log('✅ Lighthouse audit completed');
    console.log(`📄 Report saved: ${reportPath}`);
    console.log(`📊 JSON data: ${jsonPath}`);

    // Parse and display key metrics
    if (fs.existsSync(jsonPath)) {
      const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const categories = report.categories;

      console.log('\n📊 LIGHTHOUSE SCORES:');
      console.log('====================');
      console.log(`🎯 Performance: ${Math.round(categories.performance.score * 100)}/100`);
      console.log(`♿ Accessibility: ${Math.round(categories.accessibility.score * 100)}/100`);
      console.log(`⚡ Best Practices: ${Math.round(categories['best-practices'].score * 100)}/100`);
      console.log(`🔍 SEO: ${Math.round(categories.seo.score * 100)}/100`);

      // Core Web Vitals
      const audits = report.audits;
      console.log('\n⚡ CORE WEB VITALS:');
      console.log('==================');
      console.log(
        `🚀 First Contentful Paint: ${audits['first-contentful-paint']?.displayValue || 'N/A'}`
      );
      console.log(
        `🖼️  Largest Contentful Paint: ${audits['largest-contentful-paint']?.displayValue || 'N/A'}`
      );
      console.log(
        `📏 Cumulative Layout Shift: ${audits['cumulative-layout-shift']?.displayValue || 'N/A'}`
      );
      console.log(`⏱️  Speed Index: ${audits['speed-index']?.displayValue || 'N/A'}`);

      return categories;
    }
  } catch (error) {
    console.log('❌ Lighthouse audit failed:', error.message);
    return null;
  }
}

async function main() {
  console.log('🔧 SETTING UP COMPREHENSIVE TESTING SUITE');
  console.log('==========================================\n');

  // Install Lighthouse if needed
  const lighthouseInstalled = await installLighthouse();

  if (lighthouseInstalled) {
    console.log('\n📋 LIGHTHOUSE TESTING OPTIONS:');
    console.log('==============================');
    console.log('1. 🌐 Test local server: http://localhost:3000');
    console.log('2. 🚀 Test live Vercel URL after deployment');
    console.log('3. 📊 Generate comprehensive reports');

    // For manual testing, uncomment below lines:
    // const serverUrl = await startLocalServer();
    // if (serverUrl) {
    //   await runLighthouseAudit(serverUrl);
    // }
  }

  console.log('\n🎯 MANUAL TESTING NEXT STEPS:');
  console.log('=============================');
  console.log('1. 🚀 Deploy to Vercel first using deployment-guide.txt');
  console.log('2. 🔍 Run Lighthouse on live URL:');
  console.log('   lighthouse https://your-site.vercel.app --output=html');
  console.log('3. ♿ Follow accessibility-testing-guide.txt');
  console.log('4. 📊 Use web-vitals-monitoring.js in production browser console');
  console.log('5. 🛡️  Monitor with sentry-monitoring-guide.txt');

  console.log('\n✅ TESTING SUITE READY!');
  console.log('======================');
  console.log('📄 Available testing guides:');
  console.log('  - accessibility-testing-guide.txt');
  console.log('  - web-vitals-monitoring.js');
  console.log('  - sentry-monitoring-guide.txt');
  console.log('  - deployment-guide.txt');
  console.log('  - DEPLOY-NOW-CHECKLIST.txt');
}

main().catch(console.error);
