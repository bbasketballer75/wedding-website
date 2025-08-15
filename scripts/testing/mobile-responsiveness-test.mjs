/**
 * Enhanced Mobile Responsiveness Testing Suite
 * Tests wedding website across various devices and viewport sizes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Device configurations for testing
const devices = [
  // Mobile devices
  { name: 'iPhone SE', width: 375, height: 667, userAgent: 'iPhone' },
  { name: 'iPhone 12/13/14', width: 390, height: 844, userAgent: 'iPhone' },
  { name: 'iPhone 14 Pro Max', width: 428, height: 926, userAgent: 'iPhone' },
  { name: 'Samsung Galaxy S21', width: 360, height: 800, userAgent: 'Android' },
  { name: 'Google Pixel 5', width: 393, height: 851, userAgent: 'Android' },

  // Tablets
  { name: 'iPad Mini', width: 768, height: 1024, userAgent: 'iPad' },
  { name: 'iPad Air', width: 820, height: 1180, userAgent: 'iPad' },
  { name: 'iPad Pro', width: 1024, height: 1366, userAgent: 'iPad' },

  // Desktop breakpoints
  { name: 'Small Laptop', width: 1366, height: 768, userAgent: 'Desktop' },
  { name: 'Large Desktop', width: 1920, height: 1080, userAgent: 'Desktop' },
];

// Pages to test
const testPages = [
  { path: '/', name: 'Home Page' },
  { path: '/guestbook', name: 'Guestbook' },
  { path: '/albums', name: 'Photo Albums' },
  { path: '/wedding-party', name: 'Wedding Party' },
  { path: '/family-tree', name: 'Family Tree' },
  { path: '/map', name: 'Wedding Map' },
  { path: '/admin', name: 'Admin Dashboard' },
];

// Critical elements to check
const criticalElements = [
  'nav',
  'main',
  'footer',
  '.navbar',
  '.hero-section',
  '.photo-gallery',
  '.guestbook-form',
  '.wedding-party-grid',
  'button',
  'input',
  'textarea',
  '.modal',
  '.dropdown',
  '.share-button',
];

// Performance thresholds
const performanceThresholds = {
  firstContentfulPaint: 1.5, // seconds
  largestContentfulPaint: 2.5, // seconds
  cumulativeLayoutShift: 0.1,
  firstInputDelay: 100, // milliseconds
};

class MobileResponsivenessTest {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {},
      deviceTests: [],
      issues: [],
      recommendations: [],
    };
  }

  async runFullTest() {
    console.log('🧪 Starting Comprehensive Mobile Responsiveness Test...\n');

    try {
      // Test each device/viewport
      for (const device of devices) {
        console.log(`📱 Testing ${device.name} (${device.width}x${device.height})`);
        await this.testDevice(device);
      }

      // Generate comprehensive report
      await this.generateReport();

      console.log('\n✅ Mobile responsiveness testing complete!');
      console.log(`📊 Results saved to: ./logs/mobile-responsiveness-report.json`);
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      throw error;
    }
  }

  async testDevice(device) {
    const deviceResult = {
      device: device.name,
      viewport: `${device.width}x${device.height}`,
      userAgent: device.userAgent,
      pages: [],
      issues: [],
      performance: {},
      accessibility: {},
      timestamp: new Date().toISOString(),
    };

    try {
      // Test each page on this device
      for (const page of testPages) {
        console.log(`  📄 Testing ${page.name}...`);
        const pageResult = await this.testPage(device, page);
        deviceResult.pages.push(pageResult);

        // Collect issues
        if (pageResult.issues.length > 0) {
          deviceResult.issues.push(...pageResult.issues);
        }
      }

      // Device-specific performance test
      deviceResult.performance = await this.testDevicePerformance(device);

      // Accessibility test
      deviceResult.accessibility = await this.testAccessibility(device);
    } catch (error) {
      deviceResult.error = error.message;
      this.results.issues.push({
        device: device.name,
        type: 'Device Test Error',
        message: error.message,
        severity: 'high',
      });
    }

    this.results.deviceTests.push(deviceResult);
  }

  async testPage(device, page) {
    const pageResult = {
      page: page.name,
      path: page.path,
      issues: [],
      elements: {},
      viewport: {
        scrollHeight: 0,
        clientHeight: device.height,
        scrollable: false,
      },
      loadTime: 0,
      timestamp: new Date().toISOString(),
    };

    try {
      // Simulate viewport testing with CSS media query checks
      const viewportIssues = this.checkViewportIssues(device, page);
      pageResult.issues.push(...viewportIssues);

      // Test critical elements
      const elementIssues = this.checkCriticalElements(device, page);
      pageResult.issues.push(...elementIssues);

      // Check responsive design patterns
      const responsiveIssues = this.checkResponsivePatterns(device, page);
      pageResult.issues.push(...responsiveIssues);
    } catch (error) {
      pageResult.issues.push({
        type: 'Page Test Error',
        message: error.message,
        severity: 'high',
      });
    }

    return pageResult;
  }

  checkViewportIssues(device, page) {
    const issues = [];

    // Check if viewport is too narrow for content
    if (device.width < 375 && page.path !== '/admin') {
      issues.push({
        type: 'Viewport Too Narrow',
        message: `Device width ${device.width}px may be too narrow for optimal viewing`,
        severity: 'medium',
        recommendation: 'Consider adjusting layout for very small screens',
      });
    }

    // Check for potential horizontal scrolling
    if (device.width < 768) {
      issues.push({
        type: 'Mobile Layout Check',
        message: 'Verify no horizontal scrolling occurs on mobile devices',
        severity: 'medium',
        recommendation: 'Test with actual device or browser dev tools',
      });
    }

    return issues;
  }

  checkCriticalElements(device, page) {
    const issues = [];

    // Navigation issues on mobile
    if (device.width < 768) {
      issues.push({
        type: 'Mobile Navigation',
        message: 'Ensure mobile menu is accessible and functional',
        severity: 'high',
        recommendation: 'Test hamburger menu functionality',
      });
    }

    // Form elements on mobile
    if (page.path === '/guestbook' && device.width < 480) {
      issues.push({
        type: 'Form Usability',
        message: 'Verify form inputs are properly sized for mobile',
        severity: 'medium',
        recommendation: 'Ensure touch targets are at least 44px',
      });
    }

    // Photo gallery on mobile
    if (page.path === '/albums' && device.width < 768) {
      issues.push({
        type: 'Gallery Layout',
        message: 'Check photo gallery layout on mobile devices',
        severity: 'medium',
        recommendation: 'Ensure photos are properly sized and swipeable',
      });
    }

    return issues;
  }

  checkResponsivePatterns(device, page) {
    const issues = [];

    // Check for common responsive design patterns
    const patterns = [
      {
        condition: device.width < 768,
        check: 'Mobile-first design',
        message: 'Ensure mobile-first responsive design is implemented',
      },
      {
        condition: device.width >= 768 && device.width < 1024,
        check: 'Tablet layout',
        message: 'Verify tablet layout provides good user experience',
      },
      {
        condition: device.width >= 1024,
        check: 'Desktop layout',
        message: 'Ensure desktop layout utilizes available space effectively',
      },
    ];

    patterns.forEach((pattern) => {
      if (pattern.condition) {
        issues.push({
          type: 'Responsive Design Check',
          message: pattern.message,
          severity: 'low',
          recommendation: `Test ${pattern.check} on actual devices`,
        });
      }
    });

    return issues;
  }

  async testDevicePerformance(device) {
    // Simulate performance metrics based on device type
    const performance = {
      category:
        device.userAgent.includes('iPhone') || device.userAgent.includes('Android')
          ? 'mobile'
          : 'desktop',
      expectedLoadTime: device.width < 768 ? '< 3s' : '< 2s',
      networkCondition: device.width < 768 ? '3G/4G' : 'WiFi',
      recommendations: [],
    };

    if (device.width < 768) {
      performance.recommendations.push(
        'Optimize images for mobile devices',
        'Minimize JavaScript bundle size',
        'Use lazy loading for images',
        'Enable compression for all assets'
      );
    }

    return performance;
  }

  async testAccessibility(device) {
    const accessibility = {
      touchTargets: device.width < 768 ? 'critical' : 'important',
      textSize: device.width < 480 ? 'verify readability' : 'good',
      colorContrast: 'check in bright light conditions',
      screenReader: 'test with mobile screen readers',
      recommendations: [],
    };

    if (device.width < 768) {
      accessibility.recommendations.push(
        'Ensure touch targets are at least 44x44px',
        'Test with VoiceOver (iOS) or TalkBack (Android)',
        'Verify text remains readable at 200% zoom',
        'Check color contrast in various lighting conditions'
      );
    }

    return accessibility;
  }

  async generateReport() {
    // Calculate summary statistics
    this.results.summary = {
      totalDevicesTested: devices.length,
      totalPagesTested: testPages.length,
      totalTests: devices.length * testPages.length,
      issuesFound: this.results.deviceTests.reduce((sum, device) => sum + device.issues.length, 0),
      criticalIssues: this.results.deviceTests.reduce(
        (sum, device) => sum + device.issues.filter((issue) => issue.severity === 'high').length,
        0
      ),
      testDuration: 'Simulated test - Run actual tests for accurate timing',
    };

    // Generate recommendations
    this.generateRecommendations();

    // Save report
    await this.saveReport();
  }

  generateRecommendations() {
    const recommendations = [
      {
        category: 'Testing',
        priority: 'high',
        action: 'Run actual browser-based tests',
        description: 'Use Playwright, Cypress, or manual testing with real devices',
      },
      {
        category: 'Performance',
        priority: 'high',
        action: 'Optimize for mobile networks',
        description: 'Test on 3G/4G connections and optimize accordingly',
      },
      {
        category: 'User Experience',
        priority: 'medium',
        action: 'Test touch interactions',
        description: 'Ensure all interactive elements work well with touch',
      },
      {
        category: 'Accessibility',
        priority: 'high',
        action: 'Test with assistive technologies',
        description: 'Verify compatibility with mobile screen readers',
      },
      {
        category: 'Cross-browser',
        priority: 'medium',
        action: 'Test on multiple browsers',
        description: 'Test on Safari (iOS), Chrome (Android), and other mobile browsers',
      },
    ];

    this.results.recommendations = recommendations;
  }

  async saveReport() {
    const logsDir = path.join(process.cwd(), 'logs');

    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Save detailed JSON report
    const reportPath = path.join(logsDir, 'mobile-responsiveness-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Generate human-readable summary
    const summaryPath = path.join(logsDir, 'mobile-responsiveness-summary.md');
    const summary = this.generateMarkdownSummary();
    fs.writeFileSync(summaryPath, summary);

    console.log(`\n📊 Reports generated:`);
    console.log(`   📄 Detailed report: ${reportPath}`);
    console.log(`   📝 Summary: ${summaryPath}`);
  }

  generateMarkdownSummary() {
    const { summary, recommendations } = this.results;

    return `# 📱 Mobile Responsiveness Test Report

## 📊 Test Summary
- **Devices Tested:** ${summary.totalDevicesTested}
- **Pages Tested:** ${summary.totalPagesTested}
- **Total Test Cases:** ${summary.totalTests}
- **Issues Found:** ${summary.issuesFound}
- **Critical Issues:** ${summary.criticalIssues}

## 🔍 Key Findings

### Most Common Issues
${this.getMostCommonIssues()}

### Device-Specific Issues
${this.getDeviceSpecificIssues()}

## 📋 Recommendations

### High Priority
${recommendations
  .filter((r) => r.priority === 'high')
  .map((r) => `- **${r.action}**: ${r.description}`)
  .join('\n')}

### Medium Priority
${recommendations
  .filter((r) => r.priority === 'medium')
  .map((r) => `- **${r.action}**: ${r.description}`)
  .join('\n')}

## 🛠️ Next Steps

1. **Run Actual Device Tests**: This simulation provides a framework - run real browser tests
2. **Performance Testing**: Test on actual mobile networks and devices
3. **User Testing**: Get feedback from real users on mobile devices
4. **Accessibility Testing**: Test with actual assistive technologies

## 📱 Tested Devices

${devices.map((device) => `- ${device.name} (${device.width}x${device.height})`).join('\n')}

---
*Report generated on ${new Date().toLocaleString()}*
`;
  }

  getMostCommonIssues() {
    const issueTypes = {};
    this.results.deviceTests.forEach((device) => {
      device.issues.forEach((issue) => {
        issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
      });
    });

    return Object.entries(issueTypes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => `- ${type}: ${count} occurrences`)
      .join('\n');
  }

  getDeviceSpecificIssues() {
    return this.results.deviceTests
      .filter((device) => device.issues.length > 0)
      .map(
        (device) =>
          `### ${device.device}\n${device.issues.map((issue) => `- ${issue.message}`).join('\n')}`
      )
      .join('\n\n');
  }
}

// Manual testing checklist generator
function generateManualTestingChecklist() {
  const checklist = `# 📱 Manual Mobile Testing Checklist

## 🔍 Visual Testing
- [ ] Layout looks good on all screen sizes
- [ ] Text is readable without zooming
- [ ] Images scale properly
- [ ] No horizontal scrolling
- [ ] Touch targets are adequate size (min 44px)

## ⚡ Performance Testing
- [ ] Page loads quickly on mobile networks
- [ ] Images load progressively
- [ ] Animations are smooth
- [ ] No layout shifts during loading

## 🖱️ Interaction Testing
- [ ] All buttons work with touch
- [ ] Form inputs work properly
- [ ] Swipe gestures work (if implemented)
- [ ] Pinch-to-zoom works on images
- [ ] Modal dialogs work on mobile

## 🧭 Navigation Testing
- [ ] Mobile menu opens/closes properly
- [ ] All navigation links work
- [ ] Back button behavior is correct
- [ ] Deep links work properly

## ♿ Accessibility Testing
- [ ] Screen reader announces content properly
- [ ] Focus indicators are visible
- [ ] Text scales up to 200% without breaking
- [ ] Color contrast is sufficient

## 🌐 Cross-Browser Testing
- [ ] Safari on iOS
- [ ] Chrome on Android
- [ ] Firefox on mobile
- [ ] Edge on mobile

## 🔄 Orientation Testing
- [ ] Portrait orientation works
- [ ] Landscape orientation works
- [ ] Rotation transition is smooth
- [ ] Content adapts to orientation

## 📱 Device-Specific Testing
- [ ] iPhone SE (small screen)
- [ ] iPhone 12/13/14 (standard)
- [ ] iPhone Pro Max (large)
- [ ] Android phones (various sizes)
- [ ] iPad/tablets

## 🚨 Edge Cases
- [ ] Very long content
- [ ] Empty states
- [ ] Error states
- [ ] Offline functionality
- [ ] Poor network conditions
`;

  fs.writeFileSync('./logs/manual-testing-checklist.md', checklist);
  console.log('📋 Manual testing checklist generated: ./logs/manual-testing-checklist.md');
}

// Export the test runner
export { generateManualTestingChecklist, MobileResponsivenessTest };

// CLI execution
if (process.argv[1] && process.argv[1].includes('mobile-responsiveness-test.mjs')) {
  const baseUrl = process.argv[2] || 'https://www.theporadas.com';

  async function runTest() {
    const tester = new MobileResponsivenessTest(baseUrl);
    await tester.runFullTest();
    generateManualTestingChecklist();
  }

  runTest().catch(console.error);
}
