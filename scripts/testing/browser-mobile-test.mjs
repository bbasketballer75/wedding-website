/**
 * Browser DevTools Mobile Testing Script
 * Automated mobile testing using Chrome DevTools
 */

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const devices = [
  { name: 'iPhone SE', ...puppeteer.devices['iPhone SE'] },
  { name: 'iPhone 12', ...puppeteer.devices['iPhone 12'] },
  { name: 'iPhone 12 Pro', ...puppeteer.devices['iPhone 12 Pro'] },
  { name: 'iPhone 13', ...puppeteer.devices['iPhone 13'] },
  { name: 'Pixel 5', ...puppeteer.devices['Pixel 5'] },
  { name: 'Galaxy S9+', ...puppeteer.devices['Galaxy S9+'] },
  { name: 'iPad', ...puppeteer.devices['iPad'] },
  { name: 'iPad Pro', ...puppeteer.devices['iPad Pro'] },
];

const testPages = [
  { path: '/', name: 'Homepage' },
  { path: '/guestbook', name: 'Guestbook' },
  { path: '/albums', name: 'Photo Albums' },
  { path: '/wedding-party', name: 'Wedding Party' },
  { path: '/map', name: 'Wedding Map' },
];

class BrowserMobileTest {
  constructor(baseUrl = 'https://www.theporadas.com') {
    this.baseUrl = baseUrl;
    this.screenshotsDir = path.join(process.cwd(), 'logs', 'mobile-screenshots');
    this.results = {
      timestamp: new Date().toISOString(),
      baseUrl,
      tests: [],
      summary: {},
    };
  }

  async runTests() {
    console.log('🚀 Starting Browser-Based Mobile Testing...\n');

    // Ensure screenshots directory exists
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      for (const device of devices) {
        console.log(`📱 Testing on ${device.name}...`);
        await this.testDevice(browser, device);
      }

      await this.generateReport();
      console.log('\n✅ Browser mobile testing complete!');
      console.log(`📸 Screenshots saved to: ${this.screenshotsDir}`);
      console.log(`📊 Report saved to: ./logs/browser-mobile-test-report.json`);
    } finally {
      await browser.close();
    }
  }

  async testDevice(browser, device) {
    const page = await browser.newPage();
    await page.emulate(device);

    const deviceResults = {
      device: device.name,
      viewport: device.viewport,
      userAgent: device.userAgent,
      pages: [],
      issues: [],
      performance: {},
      accessibility: {},
    };

    try {
      for (const testPage of testPages) {
        console.log(`  📄 Testing ${testPage.name}...`);
        const pageResult = await this.testPage(page, device, testPage);
        deviceResults.pages.push(pageResult);
      }

      // Overall device performance test
      deviceResults.performance = await this.testDevicePerformance(page, device);
    } catch (error) {
      console.error(`❌ Error testing ${device.name}:`, error.message);
      deviceResults.error = error.message;
    } finally {
      await page.close();
    }

    this.results.tests.push(deviceResults);
  }

  async testPage(page, device, testPage) {
    const pageResult = {
      page: testPage.name,
      path: testPage.path,
      url: `${this.baseUrl}${testPage.path}`,
      loadTime: 0,
      screenshot: '',
      layout: {},
      performance: {},
      accessibility: {},
      issues: [],
    };

    try {
      const startTime = Date.now();

      // Navigate to page
      await page.goto(pageResult.url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      pageResult.loadTime = Date.now() - startTime;

      // Take screenshot
      const screenshotName = `${device.name.replace(/\s+/g, '-')}-${testPage.name.replace(/\s+/g, '-')}.png`;
      const screenshotPath = path.join(this.screenshotsDir, screenshotName);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      pageResult.screenshot = screenshotPath;

      // Test layout
      pageResult.layout = await this.testLayout(page, device);

      // Test performance
      pageResult.performance = await this.testPagePerformance(page);

      // Test accessibility
      pageResult.accessibility = await this.testPageAccessibility(page);

      // Collect issues
      pageResult.issues = this.collectPageIssues(pageResult, device);
    } catch (error) {
      console.error(`  ❌ Error testing ${testPage.name}:`, error.message);
      pageResult.error = error.message;
      pageResult.issues.push({
        type: 'Test Error',
        message: error.message,
        severity: 'high',
      });
    }

    return pageResult;
  }

  async testLayout(page, device) {
    const layout = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;

      return {
        scrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
        clientWidth: html.clientWidth,
        scrollHeight: Math.max(body.scrollHeight, html.scrollHeight),
        clientHeight: html.clientHeight,
        hasHorizontalScroll: Math.max(body.scrollWidth, html.scrollWidth) > html.clientWidth,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };
    });

    // Check for layout issues
    layout.issues = [];

    if (layout.hasHorizontalScroll) {
      layout.issues.push({
        type: 'Horizontal Scroll',
        message: 'Page has horizontal scrolling',
        severity: 'high',
      });
    }

    if (layout.scrollWidth > layout.clientWidth + 50) {
      layout.issues.push({
        type: 'Content Overflow',
        message: `Content width (${layout.scrollWidth}px) exceeds viewport (${layout.clientWidth}px)`,
        severity: 'medium',
      });
    }

    return layout;
  }

  async testPagePerformance(page) {
    const performance = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      const fcp = paint.find((entry) => entry.name === 'first-contentful-paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0];

      return {
        domContentLoaded: navigation
          ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
          : 0,
        loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        firstContentfulPaint: fcp ? fcp.startTime : 0,
        largestContentfulPaint: lcp ? lcp.startTime : 0,
        resourceCount: performance.getEntriesByType('resource').length,
      };
    });

    // Add performance assessment
    performance.assessment = {};

    if (performance.firstContentfulPaint > 2000) {
      performance.assessment.fcp = 'slow';
    } else if (performance.firstContentfulPaint > 1000) {
      performance.assessment.fcp = 'moderate';
    } else {
      performance.assessment.fcp = 'good';
    }

    if (performance.largestContentfulPaint > 4000) {
      performance.assessment.lcp = 'slow';
    } else if (performance.largestContentfulPaint > 2500) {
      performance.assessment.lcp = 'moderate';
    } else {
      performance.assessment.lcp = 'good';
    }

    return performance;
  }

  async testPageAccessibility(page) {
    const accessibility = await page.evaluate(() => {
      const elements = {
        buttonsWithoutAriaLabel: Array.from(
          document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])')
        ).length,
        imagesWithoutAlt: Array.from(document.querySelectorAll('img:not([alt])')).length,
        linksWithoutText: Array.from(
          document.querySelectorAll('a:empty, a:not([aria-label]):not([aria-labelledby])')
        ).filter((link) => !link.textContent.trim()).length,
        headingsStructure: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
          (h) => h.tagName
        ),
        formInputsWithoutLabels: Array.from(
          document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')
        ).filter((input) => {
          const id = input.id;
          return !id || !document.querySelector(`label[for="${id}"]`);
        }).length,
      };

      // Test color contrast (simplified)
      const textElements = Array.from(
        document.querySelectorAll('p, span, div, a, button, h1, h2, h3, h4, h5, h6')
      );
      let contrastIssues = 0;

      textElements.slice(0, 10).forEach((el) => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;

        // Simple check for very light text on light background
        if (color.includes('rgb(255') && backgroundColor.includes('rgb(255')) {
          contrastIssues++;
        }
      });

      elements.contrastIssues = contrastIssues;

      return elements;
    });

    // Calculate accessibility score
    let score = 100;
    score -= accessibility.buttonsWithoutAriaLabel * 5;
    score -= accessibility.imagesWithoutAlt * 10;
    score -= accessibility.linksWithoutText * 5;
    score -= accessibility.formInputsWithoutLabels * 10;
    score -= accessibility.contrastIssues * 3;

    accessibility.score = Math.max(0, score);
    accessibility.grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'F';

    return accessibility;
  }

  collectPageIssues(pageResult, device) {
    const issues = [];

    // Layout issues
    if (pageResult.layout.issues) {
      issues.push(...pageResult.layout.issues);
    }

    // Performance issues
    if (pageResult.performance.assessment) {
      if (pageResult.performance.assessment.fcp === 'slow') {
        issues.push({
          type: 'Performance',
          message: 'Slow First Contentful Paint',
          severity: 'medium',
        });
      }

      if (pageResult.performance.assessment.lcp === 'slow') {
        issues.push({
          type: 'Performance',
          message: 'Slow Largest Contentful Paint',
          severity: 'high',
        });
      }
    }

    // Accessibility issues
    if (pageResult.accessibility.score < 80) {
      issues.push({
        type: 'Accessibility',
        message: `Low accessibility score: ${pageResult.accessibility.grade}`,
        severity: pageResult.accessibility.score < 60 ? 'high' : 'medium',
      });
    }

    return issues;
  }

  async testDevicePerformance(page, device) {
    // Test overall device performance with a simple page
    await page.goto(this.baseUrl, { waitUntil: 'networkidle2' });

    const devicePerf = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        platform: navigator.platform,
        screenResolution: {
          width: screen.width,
          height: screen.height,
          availWidth: screen.availWidth,
          availHeight: screen.availHeight,
        },
      };
    });

    return devicePerf;
  }

  async generateReport() {
    // Calculate summary statistics
    const totalTests = this.results.tests.length * testPages.length;
    const totalIssues = this.results.tests.reduce(
      (sum, test) =>
        sum + test.pages.reduce((pageSum, page) => pageSum + (page.issues?.length || 0), 0),
      0
    );

    const criticalIssues = this.results.tests.reduce(
      (sum, test) =>
        sum +
        test.pages.reduce(
          (pageSum, page) =>
            pageSum + (page.issues?.filter((issue) => issue.severity === 'high')?.length || 0),
          0
        ),
      0
    );

    this.results.summary = {
      devicesTestedSuccessfully: this.results.tests.filter((test) => !test.error).length,
      totalDevices: devices.length,
      totalPages: testPages.length,
      totalTests,
      totalIssues,
      criticalIssues,
      avgLoadTime: this.calculateAverageLoadTime(),
      screenshotsGenerated: this.results.tests.reduce(
        (sum, test) => sum + test.pages.filter((page) => page.screenshot).length,
        0
      ),
    };

    // Save detailed report
    const reportPath = path.join(process.cwd(), 'logs', 'browser-mobile-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Generate summary report
    const summaryPath = path.join(process.cwd(), 'logs', 'browser-mobile-test-summary.md');
    const summary = this.generateSummaryMarkdown();
    fs.writeFileSync(summaryPath, summary);
  }

  calculateAverageLoadTime() {
    let totalTime = 0;
    let count = 0;

    this.results.tests.forEach((test) => {
      test.pages.forEach((page) => {
        if (page.loadTime) {
          totalTime += page.loadTime;
          count++;
        }
      });
    });

    return count > 0 ? Math.round(totalTime / count) : 0;
  }

  generateSummaryMarkdown() {
    const { summary } = this.results;

    return `# 🚀 Browser Mobile Testing Report

## 📊 Test Summary
- **Base URL:** ${this.baseUrl}
- **Devices Tested:** ${summary.totalDevices}
- **Successful Tests:** ${summary.devicesTestedSuccessfully}
- **Pages per Device:** ${summary.totalPages}
- **Total Test Cases:** ${summary.totalTests}
- **Total Issues Found:** ${summary.totalIssues}
- **Critical Issues:** ${summary.criticalIssues}
- **Average Load Time:** ${summary.avgLoadTime}ms
- **Screenshots Generated:** ${summary.screenshotsGenerated}

## 📱 Device Test Results

${this.results.tests.map((test) => this.generateDeviceSection(test)).join('\n\n')}

## 🎯 Key Recommendations

1. **Review Critical Issues:** ${summary.criticalIssues} critical issues need immediate attention
2. **Performance Optimization:** Average load time is ${summary.avgLoadTime}ms
3. **Visual Review:** Check generated screenshots for layout issues
4. **Real Device Testing:** Test on actual devices for touch interactions

## 📸 Screenshots Location
All screenshots saved to: \`${this.screenshotsDir}\`

---
*Report generated on ${new Date().toLocaleString()}*
`;
  }

  generateDeviceSection(test) {
    const issueCount = test.pages.reduce((sum, page) => sum + (page.issues?.length || 0), 0);
    const avgLoadTime =
      test.pages.reduce((sum, page) => sum + (page.loadTime || 0), 0) / test.pages.length;

    return `### ${test.device}
- **Status:** ${test.error ? '❌ Failed' : '✅ Passed'}
- **Issues Found:** ${issueCount}
- **Average Load Time:** ${Math.round(avgLoadTime)}ms
- **Viewport:** ${test.viewport.width}x${test.viewport.height}
${test.error ? `- **Error:** ${test.error}` : ''}`;
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].includes('browser-mobile-test.mjs')) {
  const baseUrl = process.argv[2] || 'https://www.theporadas.com';

  async function runTest() {
    const tester = new BrowserMobileTest(baseUrl);
    await tester.runTests();
  }

  runTest().catch(console.error);
}

export { BrowserMobileTest };
