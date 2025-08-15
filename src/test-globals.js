// Global test mocks for network requests
import { vi } from 'vitest';

// Set up environment variables for tests
process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
process.env.NODE_ENV = 'test';

// Mock window.HTMLMediaElement.prototype.play for MusicPlayer tests
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock all axios requests to prevent network calls
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
    put: vi.fn().mockResolvedValue({ data: { success: true } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

// Mock API service to prevent network calls
vi.mock('../../services/api.js', () => ({
  logVisit: vi.fn().mockResolvedValue({}),
  getAlbumMedia: vi.fn().mockResolvedValue({ data: [] }),
  uploadMedia: vi.fn().mockResolvedValue({ data: { success: true } }),
  getGuestbookEntries: vi.fn().mockResolvedValue({ data: [] }),
  createGuestbookEntry: vi
    .fn()
    .mockResolvedValue({ data: { id: 1, name: 'Test', message: 'Hello' } }),
  getMapLocations: vi.fn().mockResolvedValue({ data: [] }),
  getAllAlbumMedia: vi.fn().mockResolvedValue({ data: [] }),
  moderateMedia: vi.fn().mockResolvedValue({ data: { success: true } }),
}));

// Ensure window is available in test environment
global.window = global.window || {};
global.document = global.document || {};

// Set up jsdom environment properly
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock URL.createObjectURL to prevent warnings
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock ResizeObserver for Lenis smooth scroll in tests
global.ResizeObserver = vi.fn().mockImplementation((_callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Auto-cleanup for React components to prevent act() warnings
afterEach(() => {
  // Clean up any pending timers
  vi.clearAllTimers();
  vi.useRealTimers();
});
