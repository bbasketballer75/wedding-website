// Polyfill import.meta.env for Jest (Vite-specific)
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {};
}
if (typeof globalThis.import.meta === 'undefined') {
  globalThis.import.meta = { env: { VITE_API_BASE_URL: 'http://localhost:3000/api' } };
}
// Polyfill for Node.js globals required by some dependencies

import { TextDecoder, TextEncoder } from 'node:util';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Mock fetch for tests
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-url');

// Mock HTMLAudioElement
global.HTMLAudioElement = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock HTMLMediaElement prototype methods
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn(() => Promise.resolve()),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  // Simulate intersection for testing
  triggerIntersection: (entries) => callback(entries),
}));

// Mock ResizeObserver for Lenis smooth scroll
global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  // Simulate resize for testing
  triggerResize: (entries) => callback(entries),
}));

// Mock web-vitals library
jest.mock('web-vitals', () => ({
  getCLS: jest.fn((callback) => {
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
  getFID: jest.fn((callback) => {
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
  getFCP: jest.fn((callback) => {
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
  getLCP: jest.fn((callback) => {
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
  getTTFB: jest.fn((callback) => {
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
