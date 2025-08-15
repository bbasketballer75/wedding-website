/**
 * Interactive Mobile Testing Tool
 * Opens wedding website in browser with different device emulations
 */

import puppeteer from 'puppeteer';
import readline from 'readline';

const devices = [
  { name: 'iPhone SE', ...puppeteer.devices['iPhone SE'] },
  { name: 'iPhone 12', ...puppeteer.devices['iPhone 12'] },
  { name: 'iPhone 13', ...puppeteer.devices['iPhone 13'] },
  { name: 'Pixel 5', ...puppeteer.devices['Pixel 5'] },
  { name: 'Galaxy S9+', ...puppeteer.devices['Galaxy S9+'] },
  { name: 'iPad', ...puppeteer.devices['iPad'] },
  { name: 'iPad Pro', ...puppeteer.devices['iPad Pro'] },
];

const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/guestbook', name: 'Guestbook' },
  { path: '/albums', name: 'Photo Albums' },
  { path: '/wedding-party', name: 'Wedding Party' },
  { path: '/family-tree', name: 'Family Tree' },
  { path: '/map', name: 'Wedding Map' },
];

class InteractiveMobileTester {
  constructor(baseUrl = 'https://www.theporadas.com') {
    this.baseUrl = baseUrl;
    this.browser = null;
    this.page = null;
    this.currentDevice = null;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start() {
    console.log('🚀 Starting Interactive Mobile Testing Tool...\n');
    console.log(`Testing URL: ${this.baseUrl}\n`);

    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      devtools: true,
    });

    this.page = await this.browser.newPage();

    await this.showMainMenu();
  }

  async showMainMenu() {
    console.log('📱 Interactive Mobile Testing Menu:');
    console.log('1. Test specific device');
    console.log('2. Test all devices automatically');
    console.log('3. Manual testing mode');
    console.log('4. Performance testing');
    console.log('5. Accessibility testing');
    console.log('6. Exit');

    this.rl.question('\nSelect an option (1-6): ', async (answer) => {
      switch (answer.trim()) {
        case '1':
          await this.testSpecificDevice();
          break;
        case '2':
          await this.testAllDevices();
          break;
        case '3':
          await this.manualTestingMode();
          break;
        case '4':
          await this.performanceTestingMode();
          break;
        case '5':
          await this.accessibilityTestingMode();
          break;
        case '6':
          await this.exit();
          return;
        default:
          console.log('Invalid option. Please select 1-6.');
          await this.showMainMenu();
      }
    });
  }

  async testSpecificDevice() {
    console.log('\n📱 Available Devices:');
    devices.forEach((device, index) => {
      console.log(
        `${index + 1}. ${device.name} (${device.viewport.width}x${device.viewport.height})`
      );
    });

    this.rl.question('\nSelect device (1-' + devices.length + '): ', async (answer) => {
      const deviceIndex = parseInt(answer.trim()) - 1;
      if (deviceIndex >= 0 && deviceIndex < devices.length) {
        const device = devices[deviceIndex];
        await this.emulateDevice(device);
        await this.testDevicePages(device);
      } else {
        console.log('Invalid device selection.');
      }
      await this.showMainMenu();
    });
  }

  async testAllDevices() {
    console.log('\n🔄 Testing all devices automatically...\n');

    for (const device of devices) {
      console.log(`📱 Testing ${device.name}...`);
      await this.emulateDevice(device);

      // Quick test of homepage
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });

      // Take screenshot
      const screenshotPath = `./logs/auto-test-${device.name.replace(/\s+/g, '-')}.png`;
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  📸 Screenshot saved: ${screenshotPath}`);

      // Quick layout check
      const hasHorizontalScroll = await this.page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        console.log(`  ⚠️  Warning: Horizontal scroll detected on ${device.name}`);
      } else {
        console.log(`  ✅ Layout looks good on ${device.name}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Brief pause
    }

    console.log('\n✅ Automatic testing complete!');
    await this.showMainMenu();
  }

  async manualTestingMode() {
    console.log('\n🖱️  Manual Testing Mode');
    console.log('The browser will stay open for manual testing.');
    console.log('Use browser dev tools to test different devices and viewport sizes.');
    console.log('Test the following areas:');
    console.log('- Navigation menu on mobile');
    console.log('- Photo galleries');
    console.log('- Form inputs in guestbook');
    console.log('- Touch targets and buttons');
    console.log('- Scroll behavior');

    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });

    this.rl.question('\nPress Enter when finished with manual testing...', async () => {
      await this.showMainMenu();
    });
  }

  async performanceTestingMode() {
    console.log('\n⚡ Performance Testing Mode');

    // Test on mobile device (iPhone 12)
    const mobileDevice = devices.find((d) => d.name === 'iPhone 12');
    await this.emulateDevice(mobileDevice);

    console.log('Testing performance on mobile device...');

    const performanceResults = [];

    for (const testPage of pages) {
      console.log(`  📄 Testing ${testPage.name}...`);

      const startTime = Date.now();
      await this.page.goto(`${this.baseUrl}${testPage.path}`, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;

      const metrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');

        return {
          domContentLoaded: navigation
            ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
            : 0,
          firstContentfulPaint:
            paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
          resourceCount: performance.getEntriesByType('resource').length,
        };
      });

      const result = {
        page: testPage.name,
        loadTime,
        ...metrics,
      };

      performanceResults.push(result);

      console.log(`    Load Time: ${loadTime}ms`);
      console.log(`    FCP: ${Math.round(result.firstContentfulPaint)}ms`);
      console.log(`    Resources: ${result.resourceCount}`);
    }

    // Save performance report
    const reportPath = './logs/performance-test-report.json';
    const fs = await import('fs');
    fs.default.writeFileSync(reportPath, JSON.stringify(performanceResults, null, 2));
    console.log(`\n📊 Performance report saved: ${reportPath}`);

    await this.showMainMenu();
  }

  async accessibilityTestingMode() {
    console.log('\n♿ Accessibility Testing Mode');

    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });

    const a11yResults = await this.page.evaluate(() => {
      const results = {
        missingAltText: [],
        emptyLinks: [],
        lowContrastElements: [],
        missingLabels: [],
        headingStructure: [],
      };

      // Check images without alt text
      document.querySelectorAll('img:not([alt])').forEach((img) => {
        results.missingAltText.push(img.src || 'Unknown image');
      });

      // Check empty links
      document.querySelectorAll('a').forEach((link) => {
        if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
          results.emptyLinks.push(link.href || 'Unknown link');
        }
      });

      // Check form inputs without labels
      document.querySelectorAll('input, textarea, select').forEach((input) => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel =
          input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');

        if (!hasLabel && !hasAriaLabel) {
          results.missingLabels.push(input.name || input.type || 'Unknown input');
        }
      });

      // Check heading structure
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
        results.headingStructure.push({
          level: heading.tagName,
          text: heading.textContent.trim().substring(0, 50),
        });
      });

      return results;
    });

    console.log('\n📋 Accessibility Test Results:');
    console.log(`  Missing Alt Text: ${a11yResults.missingAltText.length} images`);
    console.log(`  Empty Links: ${a11yResults.emptyLinks.length} links`);
    console.log(`  Missing Labels: ${a11yResults.missingLabels.length} form elements`);
    console.log(`  Heading Structure: ${a11yResults.headingStructure.length} headings`);

    if (a11yResults.headingStructure.length > 0) {
      console.log('\n📝 Heading Structure:');
      a11yResults.headingStructure.forEach((heading) => {
        console.log(`    ${heading.level}: ${heading.text}`);
      });
    }

    // Save accessibility report
    const reportPath = './logs/accessibility-test-report.json';
    const fs = await import('fs');
    fs.default.writeFileSync(reportPath, JSON.stringify(a11yResults, null, 2));
    console.log(`\n📊 Accessibility report saved: ${reportPath}`);

    await this.showMainMenu();
  }

  async emulateDevice(device) {
    await this.page.emulate(device);
    this.currentDevice = device;
    console.log(`📱 Emulating ${device.name} (${device.viewport.width}x${device.viewport.height})`);
  }

  async testDevicePages(device) {
    console.log(`\n🔍 Testing all pages on ${device.name}:`);

    for (const testPage of pages) {
      console.log(`  📄 Loading ${testPage.name}...`);

      try {
        await this.page.goto(`${this.baseUrl}${testPage.path}`, {
          waitUntil: 'networkidle2',
          timeout: 10000,
        });

        // Quick visual check
        await this.page.waitForTimeout(1000);

        const issues = await this.page.evaluate(() => {
          const issues = [];

          // Check for horizontal scroll
          if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
            issues.push('Horizontal scroll detected');
          }

          // Check for very small text
          const textElements = document.querySelectorAll('p, span, div, a, button');
          let smallTextCount = 0;
          textElements.forEach((el) => {
            const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
            if (fontSize < 14) smallTextCount++;
          });

          if (smallTextCount > 5) {
            issues.push('Multiple elements with small text (< 14px)');
          }

          return issues;
        });

        if (issues.length > 0) {
          console.log(`    ⚠️  Issues found:`);
          issues.forEach((issue) => console.log(`      - ${issue}`));
        } else {
          console.log(`    ✅ No obvious issues detected`);
        }
      } catch (error) {
        console.log(`    ❌ Error loading page: ${error.message}`);
      }
    }
  }

  async exit() {
    console.log('\n👋 Closing mobile testing tool...');

    if (this.browser) {
      await this.browser.close();
    }

    this.rl.close();
    process.exit(0);
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].includes('interactive-mobile-test.mjs')) {
  const baseUrl = process.argv[2] || 'https://www.theporadas.com';

  const tester = new InteractiveMobileTester(baseUrl);
  tester.start().catch(console.error);
}

export { InteractiveMobileTester };
