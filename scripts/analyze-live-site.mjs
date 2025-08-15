#!/usr/bin/env node

/**
 * Live Site Test Results Analyzer
 * Quickly analyze Lighthouse results from your live site
 */

import fs from 'fs';

console.log('🌐 LIVE SITE TEST RESULTS: www.theporadas.com');
console.log('==============================================\n');

// Check if Lighthouse report exists
const reportFile = './lighthouse-live-test.report.json';
if (fs.existsSync(reportFile)) {
  try {
    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    const categories = report.categories;
    const audits = report.audits;

    console.log('📊 LIGHTHOUSE SCORES:');
    console.log('====================');
    console.log(`🎯 Performance: ${Math.round(categories.performance.score * 100)}/100`);
    console.log(`♿ Accessibility: ${Math.round(categories.accessibility.score * 100)}/100`);
    console.log(`⚡ Best Practices: ${Math.round(categories['best-practices'].score * 100)}/100`);
    console.log(`🔍 SEO: ${Math.round(categories.seo.score * 100)}/100`);

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
    console.log(`🖱️  Total Blocking Time: ${audits['total-blocking-time']?.displayValue || 'N/A'}`);

    console.log('\n🎯 OPTIMIZATION VALIDATION:');
    console.log('===========================');

    // Check specific optimizations
    const performanceScore = Math.round(categories.performance.score * 100);
    const accessibilityScore = Math.round(categories.accessibility.score * 100);

    // Determine performance status
    let performanceStatus;
    if (performanceScore >= 90) {
      performanceStatus = '(Excellent!)';
    } else if (performanceScore >= 75) {
      performanceStatus = '(Good)';
    } else {
      performanceStatus = '(Needs improvement)';
    }

    // Determine accessibility status
    let accessibilityStatus;
    if (accessibilityScore >= 95) {
      accessibilityStatus = '(Excellent!)';
    } else if (accessibilityScore >= 80) {
      accessibilityStatus = '(Good)';
    } else {
      accessibilityStatus = '(Needs improvement)';
    }

    console.log(`✅ Performance Score: ${performanceScore}/100 ${performanceStatus}`);
    console.log(`✅ Accessibility Score: ${accessibilityScore}/100 ${accessibilityStatus}`);

    // Check specific audits
    const nextGenFormats = audits['modern-image-formats'];
    const unusedCSS = audits['unused-css-rules'];
    const unusedJS = audits['unused-javascript'];

    console.log('\n🔍 OPTIMIZATION CHECKS:');
    console.log('======================');
    if (nextGenFormats) {
      console.log(
        `🖼️  Next-gen image formats: ${nextGenFormats.score === 1 ? '✅ Optimized' : '⚠️ Can improve'}`
      );
    }
    if (unusedCSS) {
      console.log(`🎨 Unused CSS: ${unusedCSS.score === 1 ? '✅ Optimized' : '⚠️ Can improve'}`);
    }
    if (unusedJS) {
      console.log(
        `📦 Unused JavaScript: ${unusedJS.score === 1 ? '✅ Optimized' : '⚠️ Can improve'}`
      );
    }

    console.log('\n📈 COMPARISON TO GOALS:');
    console.log('=======================');
    console.log(
      `Target: Performance > 90: ${performanceScore >= 90 ? '✅ ACHIEVED' : '❌ Not yet'}`
    );
    console.log(
      `Target: Accessibility > 95: ${accessibilityScore >= 95 ? '✅ ACHIEVED' : '❌ Not yet'}`
    );

    const lcpValue = parseFloat(audits['largest-contentful-paint']?.numericValue || 0) / 1000;
    const clsValue = parseFloat(audits['cumulative-layout-shift']?.numericValue || 0);

    console.log(
      `Target: LCP < 2.5s: ${lcpValue < 2.5 ? '✅ ACHIEVED' : '❌ Not yet'} (${lcpValue.toFixed(2)}s)`
    );
    console.log(
      `Target: CLS < 0.1: ${clsValue < 0.1 ? '✅ ACHIEVED' : '❌ Not yet'} (${clsValue.toFixed(3)})`
    );

    console.log('\n🎊 LIVE SITE VALIDATION COMPLETE!');
    console.log('=================================');
    console.log('📄 Full report: lighthouse-live-test.report.html');
    console.log('📊 JSON data: lighthouse-live-test.report.json');
  } catch (error) {
    console.log('❌ Error reading Lighthouse report:', error.message);
  }
} else {
  console.log('❌ Lighthouse report not found. Run the audit first:');
  console.log(
    'npx lighthouse https://www.theporadas.com --output=html --output=json --output-path=./lighthouse-live-test'
  );
}

console.log('\n💡 Next Steps:');
console.log('==============');
console.log('1. ♿ Test accessibility manually with keyboard navigation');
console.log('2. 📱 Test on mobile devices');
console.log('3. 🛡️  Check Sentry dashboard for any errors');
console.log('4. 📊 Monitor real user Web Vitals with web-vitals-monitoring.js');
