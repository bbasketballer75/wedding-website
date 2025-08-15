/**
 * Playwright Mobile Responsiveness Tests
 * Real browser testing for wedding website mobile experience
 */

import { devices, expect, test } from '@playwright/test';

// Test configuration
const WEDDING_SITE_URL = process.env.WEDDING_SITE_URL || 'http://localhost:3000';

const testPages = [
  { path: '/', name: 'Home Page', critical: true },
  { path: '/guestbook', name: 'Guestbook', critical: true },
  { path: '/albums', name: 'Photo Albums', critical: true },
  { path: '/wedding-party', name: 'Wedding Party', critical: false },
  { path: '/family-tree', name: 'Family Tree', critical: false },
  { path: '/map', name: 'Wedding Map', critical: false },
];

// Device configurations for testing
const mobileDevices = [
  { ...devices['iPhone 12'], name: 'iPhone 12' },
  { ...devices['iPhone 13'], name: 'iPhone 13' },
  { ...devices['Pixel 5'], name: 'Google Pixel 5' },
  { ...devices['Galaxy S9+'], name: 'Samsung Galaxy S9+' },
];

const tabletDevices = [
  { ...devices['iPad'], name: 'iPad' },
  { ...devices['iPad Pro'], name: 'iPad Pro' },
];

// Test suite for mobile devices
mobileDevices.forEach((device) => {
  test.describe(`Mobile: ${device.name}`, () => {
    test.use({ ...device });

    testPages.forEach((page) => {
      test(`${page.name} - Mobile Layout`, async ({ page: playwright }) => {
        // Navigate to page
        await playwright.goto(`${WEDDING_SITE_URL}${page.path}`);

        // Wait for page to load
        await playwright.waitForLoadState('networkidle');

        // Check viewport
        const viewportSize = playwright.viewportSize();
        expect(viewportSize.width).toBeLessThan(768);

        // Take screenshot for visual regression
        await playwright.screenshot({
          path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-${page.name.replace(/\s+/g, '-')}.png`,
          fullPage: true,
        });

        // Check no horizontal scroll
        const scrollWidth = await playwright.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await playwright.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // Allow 10px tolerance

        // Check critical elements are visible
        await expect(playwright.locator('header')).toBeVisible();
        await expect(playwright.locator('main')).toBeVisible();
        await expect(playwright.locator('footer')).toBeVisible();

        // Check mobile navigation
        if (viewportSize.width < 768) {
          // Look for mobile menu button
          const mobileMenuButton = playwright
            .locator('[aria-label*="menu"], .mobile-menu-button, button:has-text("Menu")')
            .first();
          if ((await mobileMenuButton.count()) > 0) {
            await expect(mobileMenuButton).toBeVisible();

            // Test mobile menu functionality
            await mobileMenuButton.click();
            // Check if menu opens (implementation depends on your nav component)
            await playwright.waitForTimeout(500); // Wait for animation
          }
        }

        // Page-specific tests
        if (page.path === '/guestbook') {
          await testGuestbookMobile(playwright);
        } else if (page.path === '/albums') {
          await testPhotoGalleryMobile(playwright);
        } else if (page.path === '/') {
          await testHomepageMobile(playwright);
        }
      });

      // Performance test for critical pages
      if (page.critical) {
        test(`${page.name} - Mobile Performance`, async ({ page: playwright }) => {
          // Start measuring performance
          await playwright.goto(`${WEDDING_SITE_URL}${page.path}`);

          // Measure Core Web Vitals
          const metrics = await playwright.evaluate(() => {
            return new Promise((resolve) => {
              new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const vitals = {};

                entries.forEach((entry) => {
                  if (entry.name === 'first-contentful-paint') {
                    vitals.fcp = entry.startTime;
                  }
                  if (entry.entryType === 'largest-contentful-paint') {
                    vitals.lcp = entry.startTime;
                  }
                  if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                    vitals.cls = (vitals.cls || 0) + entry.value;
                  }
                });

                setTimeout(() => resolve(vitals), 3000);
              }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
            });
          });

          // Assert performance thresholds for mobile
          if (metrics.fcp) {
            expect(metrics.fcp).toBeLessThan(2000); // 2 seconds
          }
          if (metrics.lcp) {
            expect(metrics.lcp).toBeLessThan(4000); // 4 seconds for mobile
          }
          if (metrics.cls) {
            expect(metrics.cls).toBeLessThan(0.1); // Good CLS score
          }
        });
      }

      // Accessibility test
      test(`${page.name} - Mobile Accessibility`, async ({ page: playwright }) => {
        await playwright.goto(`${WEDDING_SITE_URL}${page.path}`);
        await playwright.waitForLoadState('networkidle');

        // Test keyboard navigation
        await playwright.keyboard.press('Tab');
        const focusedElement = await playwright.locator(':focus');
        await expect(focusedElement).toBeVisible();

        // Test touch target sizes
        const buttons = await playwright
          .locator('button, a, input[type="submit"], input[type="button"]')
          .all();
        for (const button of buttons) {
          const box = await button.boundingBox();
          if (box) {
            // Touch targets should be at least 44x44px
            expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
          }
        }

        // Test zoom functionality
        await playwright.setViewportSize({
          width: device.viewport.width,
          height: device.viewport.height,
        });

        // Simulate zoom to 200%
        await playwright.evaluate(() => {
          document.body.style.zoom = '2';
        });

        // Check that content is still accessible
        await expect(playwright.locator('main')).toBeVisible();

        // Reset zoom
        await playwright.evaluate(() => {
          document.body.style.zoom = '1';
        });
      });
    });
  });
});

// Test suite for tablet devices
tabletDevices.forEach((device) => {
  test.describe(`Tablet: ${device.name}`, () => {
    test.use({ ...device });

    testPages.forEach((page) => {
      test(`${page.name} - Tablet Layout`, async ({ page: playwright }) => {
        await playwright.goto(`${WEDDING_SITE_URL}${page.path}`);
        await playwright.waitForLoadState('networkidle');

        // Check viewport
        const viewportSize = playwright.viewportSize();
        expect(viewportSize.width).toBeGreaterThanOrEqual(768);
        expect(viewportSize.width).toBeLessThan(1024);

        // Take screenshot
        await playwright.screenshot({
          path: `test-results/tablet-${device.name.replace(/\s+/g, '-')}-${page.name.replace(/\s+/g, '-')}.png`,
          fullPage: true,
        });

        // Test orientation changes
        await playwright.setViewportSize({
          width: device.viewport.height,
          height: device.viewport.width,
        });

        await playwright.waitForTimeout(1000);

        // Check layout still works in landscape
        await expect(playwright.locator('main')).toBeVisible();

        // Reset to portrait
        await playwright.setViewportSize({
          width: device.viewport.width,
          height: device.viewport.height,
        });
      });
    });
  });
});

// Helper functions for page-specific tests
async function testHomepageMobile(page) {
  // Test hero section
  await expect(page.locator('.hero-section, [data-testid="hero"]').first()).toBeVisible();

  // Test that main content is accessible
  const mainContent = page.locator('main');
  await expect(mainContent).toBeVisible();

  // Test that images load properly
  const images = await page.locator('img').all();
  for (const img of images.slice(0, 3)) {
    // Test first 3 images
    await expect(img).toBeVisible();
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
  }
}

async function testGuestbookMobile(page) {
  // Test form elements
  const nameInput = page.locator('input[name="name"], input[placeholder*="name"]').first();
  const messageInput = page
    .locator('textarea[name="message"], textarea[placeholder*="message"]')
    .first();

  if ((await nameInput.count()) > 0) {
    await expect(nameInput).toBeVisible();

    // Test that inputs are properly sized for mobile
    const inputBox = await nameInput.boundingBox();
    if (inputBox) {
      expect(inputBox.height).toBeGreaterThanOrEqual(44); // Minimum touch target
    }
  }

  if ((await messageInput.count()) > 0) {
    await expect(messageInput).toBeVisible();
  }

  // Test submit button
  const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
  if ((await submitButton.count()) > 0) {
    await expect(submitButton).toBeVisible();
  }
}

async function testPhotoGalleryMobile(page) {
  // Test photo grid
  const photoGrid = page.locator('.photo-grid, .gallery, [data-testid="photo-grid"]').first();
  if ((await photoGrid.count()) > 0) {
    await expect(photoGrid).toBeVisible();
  }

  // Test that photos are properly sized
  const photos = await page.locator('img').all();
  for (const photo of photos.slice(0, 3)) {
    await expect(photo).toBeVisible();

    const photoBox = await photo.boundingBox();
    if (photoBox) {
      // Photos should not overflow viewport
      const viewportSize = page.viewportSize();
      expect(photoBox.width).toBeLessThanOrEqual(viewportSize.width);
    }
  }
}

// Cross-device compatibility test
test.describe('Cross-Device Compatibility', () => {
  test('Consistent navigation across devices', async ({ browser }) => {
    const devices = [
      { ...devices['iPhone 12'], name: 'iPhone 12' },
      { ...devices['iPad'], name: 'iPad' },
      { ...devices['Desktop Chrome'], name: 'Desktop' },
    ];

    const results = [];

    for (const device of devices) {
      const context = await browser.newContext({
        ...device,
      });

      const page = await context.newPage();
      await page.goto(WEDDING_SITE_URL);

      // Check navigation elements
      const navElements = await page.locator('nav a, header a').allTextContents();
      results.push({
        device: device.name,
        navElements: navElements.length,
      });

      await context.close();
    }

    // Ensure navigation is consistent across devices
    const navCounts = results.map((r) => r.navElements);
    const uniqueCounts = [...new Set(navCounts)];

    // Allow some variation but not too much
    expect(uniqueCounts.length).toBeLessThanOrEqual(2);
  });
});

// Performance comparison across devices
test.describe('Performance Comparison', () => {
  test('Load time comparison', async ({ browser }) => {
    const testDevices = [
      { ...devices['iPhone 12'], name: 'iPhone 12' },
      { ...devices['Desktop Chrome'], name: 'Desktop' },
    ];

    const loadTimes = [];

    for (const device of testDevices) {
      const context = await browser.newContext({
        ...device,
      });

      const page = await context.newPage();

      const startTime = Date.now();
      await page.goto(WEDDING_SITE_URL);
      await page.waitForLoadState('networkidle');
      const endTime = Date.now();

      loadTimes.push({
        device: device.name,
        loadTime: endTime - startTime,
      });

      await context.close();
    }

    // Mobile should load within reasonable time
    const mobileLoadTime = loadTimes.find((lt) => lt.device.includes('iPhone'))?.loadTime;
    if (mobileLoadTime) {
      expect(mobileLoadTime).toBeLessThan(5000); // 5 seconds max
    }
  });
});
