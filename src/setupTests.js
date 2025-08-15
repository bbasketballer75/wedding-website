// Mock window.matchMedia for jsdom
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {},
    };
  };
}
// Vitest/Testing Library setup

import '@testing-library/jest-dom';

// Global teardown: clear all timers and ensure window is defined
afterEach(() => {
  // Clear all timeouts/intervals
  if (typeof jest !== 'undefined' && typeof jest.clearAllTimers === 'function')
    jest.clearAllTimers();
  if (typeof vi !== 'undefined' && typeof vi.clearAllTimers === 'function') vi.clearAllTimers();
});

// Prevent "window is not defined" teardown errors
if (typeof global.window === 'undefined') {
  global.window = {};
}

// Mock IntersectionObserver for lazy loading components
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
    }

    observe() {
      // Immediately trigger intersection for testing
      setTimeout(() => {
        this.callback([{ isIntersecting: true }]);
      }, 0);
    }

    unobserve() {
      // Mock implementation
    }

    disconnect() {
      // Mock implementation
    }
  };
}

// Mock ResizeObserver for Lenis smooth scroll
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }

    observe() {
      // Mock implementation
    }

    unobserve() {
      // Mock implementation
    }

    disconnect() {
      // Mock implementation
    }
  };
}

// If you need to mock axios or fetch, use Vitest's vi.mock in your test files.

// Mock web-vitals library for performance testing
if (typeof vi !== 'undefined') {
  vi.mock('web-vitals', () => ({
    getCLS: vi.fn((callback) => {
      // Simulate CLS metric
      setTimeout(() => {
        callback({
          name: 'CLS',
          value: 0.05,
          rating: 'good',
          delta: 0.05,
          entries: [],
        });
      }, 100);
    }),
    getFID: vi.fn((callback) => {
      // Simulate FID metric
      setTimeout(() => {
        callback({
          name: 'FID',
          value: 50,
          rating: 'good',
          delta: 50,
          entries: [],
        });
      }, 100);
    }),
    getFCP: vi.fn((callback) => {
      // Simulate FCP metric
      setTimeout(() => {
        callback({
          name: 'FCP',
          value: 1200,
          rating: 'good',
          delta: 1200,
          entries: [],
        });
      }, 100);
    }),
    getLCP: vi.fn((callback) => {
      // Simulate LCP metric
      setTimeout(() => {
        callback({
          name: 'LCP',
          value: 1800,
          rating: 'good',
          delta: 1800,
          entries: [],
        });
      }, 100);
    }),
    getTTFB: vi.fn((callback) => {
      // Simulate TTFB metric
      setTimeout(() => {
        callback({
          name: 'TTFB',
          value: 400,
          rating: 'good',
          delta: 400,
          entries: [],
        });
      }, 100);
    }),
  }));
}
