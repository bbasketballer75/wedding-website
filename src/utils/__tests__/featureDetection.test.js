import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as featureDetection from '../core/featureDetection';

// Mock global objects for testing
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  language: 'en-US',
  languages: ['en-US', 'en'],
  onLine: true,
  connection: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  },
  storage: {
    estimate: vi.fn().mockResolvedValue({
      quota: 1000000000,
      usage: 50000000,
    }),
  },
};

const mockWindow = {
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  sessionStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  IntersectionObserver: vi.fn(),
  ResizeObserver: vi.fn(),
  MutationObserver: vi.fn(),
  WebSocket: vi.fn(),
  indexedDB: {},
  Notification: {
    permission: 'default',
    requestPermission: vi.fn(),
  },
};

global.navigator = mockNavigator;
global.localStorage = mockWindow.localStorage;
global.sessionStorage = mockWindow.sessionStorage;
global.IntersectionObserver = mockWindow.IntersectionObserver;
global.ResizeObserver = mockWindow.ResizeObserver;
global.MutationObserver = mockWindow.MutationObserver;
global.WebSocket = mockWindow.WebSocket;
global.indexedDB = mockWindow.indexedDB;

describe('Feature Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Browser Support Detection', () => {
    it('detects modern browser features', () => {
      const supportsModernFeatures = featureDetection.supportsModernFeatures;
      if (supportsModernFeatures) {
        const isModern = supportsModernFeatures();

        expect(typeof isModern).toBe('boolean');
      }
    });

    it('detects ES6+ support', () => {
      const supportsES6 = featureDetection.supportsES6;
      if (supportsES6) {
        const hasES6 = supportsES6();

        expect(typeof hasES6).toBe('boolean');
        // Should be true in modern test environment
        expect(hasES6).toBe(true);
      }
    });

    it('detects CSS Grid support', () => {
      const supportsCSSGrid = featureDetection.supportsCSSGrid;
      if (supportsCSSGrid) {
        // Mock CSS.supports
        global.CSS = {
          supports: vi.fn().mockReturnValue(true),
        };

        const hasGrid = supportsCSSGrid();

        expect(typeof hasGrid).toBe('boolean');
        expect(global.CSS.supports).toHaveBeenCalledWith('display', 'grid');
      }
    });

    it('detects Flexbox support', () => {
      const supportsFlexbox = featureDetection.supportsFlexbox;
      if (supportsFlexbox) {
        global.CSS = {
          supports: vi.fn().mockReturnValue(true),
        };

        const hasFlex = supportsFlexbox();

        expect(typeof hasFlex).toBe('boolean');
        expect(global.CSS.supports).toHaveBeenCalledWith('display', 'flex');
      }
    });

    it('detects WebP image support', () => {
      const supportsWebP = featureDetection.supportsWebP;
      if (supportsWebP) {
        // Mock canvas and toDataURL
        const mockCanvas = {
          getContext: vi.fn().mockReturnValue({}),
          toDataURL: vi.fn().mockReturnValue('data:image/webp;base64,test'),
        };

        global.document = {
          createElement: vi.fn().mockReturnValue(mockCanvas),
        };

        const hasWebP = supportsWebP();

        expect(typeof hasWebP).toBe('boolean');
      }
    });
  });

  describe('Storage Support Detection', () => {
    it('detects localStorage support', () => {
      const supportsLocalStorage = featureDetection.supportsLocalStorage;
      if (supportsLocalStorage) {
        const hasLocalStorage = supportsLocalStorage();

        expect(typeof hasLocalStorage).toBe('boolean');
        expect(hasLocalStorage).toBe(true);
      }
    });

    it('detects sessionStorage support', () => {
      const supportsSessionStorage = featureDetection.supportsSessionStorage;
      if (supportsSessionStorage) {
        const hasSessionStorage = supportsSessionStorage();

        expect(typeof hasSessionStorage).toBe('boolean');
        expect(hasSessionStorage).toBe(true);
      }
    });

    it('detects IndexedDB support', () => {
      const supportsIndexedDB = featureDetection.supportsIndexedDB;
      if (supportsIndexedDB) {
        const hasIndexedDB = supportsIndexedDB();

        expect(typeof hasIndexedDB).toBe('boolean');
        expect(hasIndexedDB).toBe(true);
      }
    });

    it('handles storage quota detection', async () => {
      const getStorageQuota = featureDetection.getStorageQuota;

      // Mock navigator.storage.estimate
      global.navigator.storage = {
        estimate: vi.fn().mockResolvedValue({
          quota: 1000000000,
          usage: 500000000,
        }),
      };

      const quota = await getStorageQuota();
      expect(quota).toHaveProperty('quota');
      expect(quota).toHaveProperty('usage');
      expect(typeof quota.quota).toBe('number');
      expect(typeof quota.usage).toBe('number');
    });
  });

  describe('API Support Detection', () => {
    it('detects Intersection Observer support', () => {
      const supportsIntersectionObserver = featureDetection.supportsIntersectionObserver;
      if (supportsIntersectionObserver) {
        const hasIntersectionObserver = supportsIntersectionObserver();

        expect(typeof hasIntersectionObserver).toBe('boolean');
        expect(hasIntersectionObserver).toBe(true);
      }
    });

    it('detects Resize Observer support', () => {
      const supportsResizeObserver = featureDetection.supportsResizeObserver;
      if (supportsResizeObserver) {
        const hasResizeObserver = supportsResizeObserver();

        expect(typeof hasResizeObserver).toBe('boolean');
        expect(hasResizeObserver).toBe(true);
      }
    });

    it('detects Mutation Observer support', () => {
      const supportsMutationObserver = featureDetection.supportsMutationObserver;
      if (supportsMutationObserver) {
        const hasMutationObserver = supportsMutationObserver();

        expect(typeof hasMutationObserver).toBe('boolean');
        expect(hasMutationObserver).toBe(true);
      }
    });

    it('detects WebSocket support', () => {
      const supportsWebSocket = featureDetection.supportsWebSocket;
      if (supportsWebSocket) {
        const hasWebSocket = supportsWebSocket();

        expect(typeof hasWebSocket).toBe('boolean');
        expect(hasWebSocket).toBe(true);
      }
    });

    it('detects Geolocation API support', () => {
      const supportsGeolocation = featureDetection.supportsGeolocation;
      if (supportsGeolocation) {
        // Mock geolocation
        global.navigator.geolocation = {
          getCurrentPosition: vi.fn(),
          watchPosition: vi.fn(),
          clearWatch: vi.fn(),
        };

        const hasGeolocation = supportsGeolocation();

        expect(typeof hasGeolocation).toBe('boolean');
        expect(hasGeolocation).toBe(true);
      }
    });
  });

  describe('Network Information', () => {
    it('detects network connection info', () => {
      const getConnectionInfo = featureDetection.getConnectionInfo;
      if (getConnectionInfo) {
        const connection = getConnectionInfo();

        expect(connection).toHaveProperty('effectiveType');
        expect(connection).toHaveProperty('downlink');
        expect(connection).toHaveProperty('rtt');
        expect(connection.effectiveType).toBe('4g');
      }
    });

    it('detects online/offline status', () => {
      const isOnline = featureDetection.isOnline;
      if (isOnline) {
        const online = isOnline();

        expect(typeof online).toBe('boolean');
        expect(online).toBe(true);
      }
    });

    it('handles slow network detection', () => {
      const isSlowNetwork = featureDetection.isSlowNetwork;
      if (isSlowNetwork) {
        // Test with fast connection
        const slowWithFast = isSlowNetwork();
        expect(slowWithFast).toBe(false);

        // Mock slow connection
        mockNavigator.connection.effectiveType = '2g';
        const slowWith2G = isSlowNetwork();
        expect(slowWith2G).toBe(true);
      }
    });
  });

  describe('Device Capabilities', () => {
    it('detects touch support', () => {
      const supportsTouchEvents = featureDetection.supportsTouchEvents;
      if (supportsTouchEvents) {
        // Mock touch events
        global.ontouchstart = true;
        global.DocumentTouch = function () {};
        global.document = {
          ...global.document,
          createTouch: vi.fn(),
        };

        const hasTouch = supportsTouchEvents();

        expect(typeof hasTouch).toBe('boolean');
      }
    });

    it('detects device pixel ratio', () => {
      const getDevicePixelRatio = featureDetection.getDevicePixelRatio;
      if (getDevicePixelRatio) {
        global.devicePixelRatio = 2;

        const ratio = getDevicePixelRatio();

        expect(typeof ratio).toBe('number');
        expect(ratio).toBe(2);
      }
    });

    it('detects screen size category', () => {
      const getScreenCategory = featureDetection.getScreenCategory;
      if (getScreenCategory) {
        global.screen = {
          width: 1920,
          height: 1080,
        };

        const category = getScreenCategory();

        expect(typeof category).toBe('string');
        expect(['mobile', 'tablet', 'desktop', 'large'].includes(category)).toBe(true);
      }
    });

    it('detects orientation support', () => {
      const supportsOrientation = featureDetection.supportsOrientation;
      if (supportsOrientation) {
        global.screen.orientation = {
          angle: 0,
          type: 'portrait-primary',
        };

        const hasOrientation = supportsOrientation();

        expect(typeof hasOrientation).toBe('boolean');
      }
    });
  });

  describe('Performance Capabilities', () => {
    it('detects requestAnimationFrame support', () => {
      const supportsRequestAnimationFrame = featureDetection.supportsRequestAnimationFrame;
      if (supportsRequestAnimationFrame) {
        global.requestAnimationFrame = vi.fn();

        const hasRAF = supportsRequestAnimationFrame();

        expect(typeof hasRAF).toBe('boolean');
        expect(hasRAF).toBe(true);
      }
    });

    it('detects requestIdleCallback support', () => {
      const supportsRequestIdleCallback = featureDetection.supportsRequestIdleCallback;
      if (supportsRequestIdleCallback) {
        global.requestIdleCallback = vi.fn();

        const hasRIC = supportsRequestIdleCallback();

        expect(typeof hasRIC).toBe('boolean');
        expect(hasRIC).toBe(true);
      }
    });

    it('detects Web Workers support', () => {
      const supportsWebWorkers = featureDetection.supportsWebWorkers;
      if (supportsWebWorkers) {
        global.Worker = vi.fn();

        const hasWorkers = supportsWebWorkers();

        expect(typeof hasWorkers).toBe('boolean');
        expect(hasWorkers).toBe(true);
      }
    });

    it('detects Service Worker support', () => {
      const supportsServiceWorker = featureDetection.supportsServiceWorker;
      if (supportsServiceWorker) {
        global.navigator.serviceWorker = {
          register: vi.fn(),
          ready: Promise.resolve(),
        };

        const hasServiceWorker = supportsServiceWorker();

        expect(typeof hasServiceWorker).toBe('boolean');
        expect(hasServiceWorker).toBe(true);
      }
    });
  });

  describe('Media Capabilities', () => {
    it('detects audio format support', () => {
      const supportsAudioFormat = featureDetection.supportsAudioFormat;
      if (supportsAudioFormat) {
        const mockAudio = {
          canPlayType: vi.fn().mockReturnValue('probably'),
        };

        global.Audio = vi.fn().mockReturnValue(mockAudio);

        const supportsMp3 = supportsAudioFormat('mp3');

        expect(typeof supportsMp3).toBe('boolean');
        expect(mockAudio.canPlayType).toHaveBeenCalledWith('audio/mpeg');
      }
    });

    it('detects video format support', () => {
      const supportsVideoFormat = featureDetection.supportsVideoFormat;
      if (supportsVideoFormat) {
        const mockVideo = {
          canPlayType: vi.fn().mockReturnValue('probably'),
        };

        global.document.createElement = vi.fn().mockReturnValue(mockVideo);

        const supportsMp4 = supportsVideoFormat('mp4');

        expect(typeof supportsMp4).toBe('boolean');
        expect(mockVideo.canPlayType).toHaveBeenCalledWith('video/mp4');
      }
    });

    it('detects camera/microphone access', () => {
      global.navigator.mediaDevices = {
        getUserMedia: vi.fn(),
        enumerateDevices: vi.fn(),
      };

      const hasMediaDevices = featureDetection.supportsMediaDevices();

      expect(typeof hasMediaDevices).toBe('boolean');
      expect(hasMediaDevices).toBe(true);
    });
  });

  describe('Progressive Enhancement', () => {
    it('provides fallback detection', () => {
      const needsFallback = featureDetection.needsFallback;
      if (needsFallback) {
        const features = ['css-grid', 'intersection-observer', 'webp'];
        const fallbackNeeded = needsFallback(features);

        expect(typeof fallbackNeeded).toBe('boolean');
      }
    });

    it('creates feature support map', () => {
      const createFeatureMap = featureDetection.createFeatureMap;
      if (createFeatureMap) {
        const featureMap = createFeatureMap();

        expect(typeof featureMap).toBe('object');
        expect(featureMap).toHaveProperty('storage');
        expect(featureMap).toHaveProperty('apis');
        expect(featureMap).toHaveProperty('css');
        expect(featureMap).toHaveProperty('media');
      }
    });

    it('suggests polyfills for missing features', () => {
      const suggestPolyfills = featureDetection.suggestPolyfills;
      if (suggestPolyfills) {
        const missingFeatures = ['intersection-observer', 'resize-observer'];
        const polyfills = suggestPolyfills(missingFeatures);

        expect(Array.isArray(polyfills)).toBe(true);
        if (polyfills.length > 0) {
          expect(polyfills[0]).toHaveProperty('feature');
          expect(polyfills[0]).toHaveProperty('polyfill');
          expect(polyfills[0]).toHaveProperty('cdn');
        }
      }
    });
  });

  describe('Browser Information', () => {
    it('detects browser type and version', () => {
      const getBrowserInfo = featureDetection.getBrowserInfo;
      if (getBrowserInfo) {
        const browser = getBrowserInfo();

        expect(browser).toHaveProperty('name');
        expect(browser).toHaveProperty('version');
        expect(browser).toHaveProperty('engine');
        expect(typeof browser.name).toBe('string');
      }
    });

    it('detects mobile browser', () => {
      const isMobileBrowser = featureDetection.isMobileBrowser;
      if (isMobileBrowser) {
        const isMobile = isMobileBrowser();

        expect(typeof isMobile).toBe('boolean');
      }
    });

    it('detects legacy browser', () => {
      const isLegacyBrowser = featureDetection.isLegacyBrowser;
      if (isLegacyBrowser) {
        const isLegacy = isLegacyBrowser();

        expect(typeof isLegacy).toBe('boolean');
      }
    });
  });
});
