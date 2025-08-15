/**
 * Feature Detection Utilities for Cross-Browser Compatibility
 * Provides comprehensive browser and feature support detection
 */

// CSS Feature Support Detection
export const supportsCSSGrid = () => {
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports('display', 'grid');
  }
  return false;
};

export const supportsFlexbox = () => {
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports('display', 'flex');
  }
  return false;
};

export const supportsWebP = () => {
  if (typeof document === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
};

// Storage Support Detection
export const supportsLocalStorage = () => {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
};

export const supportsSessionStorage = () => {
  try {
    if (typeof sessionStorage === 'undefined') return false;
    sessionStorage.setItem('test', 'test');
    sessionStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
};

export const supportsIndexedDB = () => {
  return typeof indexedDB !== 'undefined';
};

export const getStorageQuota = async () => {
  if (navigator && navigator.storage && navigator.storage.estimate) {
    try {
      return await navigator.storage.estimate();
    } catch {
      return { quota: 0, usage: 0 };
    }
  }
  return { quota: 0, usage: 0 };
};

// API Support Detection
export const supportsIntersectionObserver = () => {
  return typeof IntersectionObserver !== 'undefined';
};

export const supportsResizeObserver = () => {
  return typeof ResizeObserver !== 'undefined';
};

export const supportsMutationObserver = () => {
  return typeof MutationObserver !== 'undefined';
};

export const supportsWebSocket = () => {
  return typeof WebSocket !== 'undefined';
};

export const supportsGeolocation = () => {
  return navigator && 'geolocation' in navigator;
};

// Network Information
export const getConnectionInfo = () => {
  if (navigator && navigator.connection) {
    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
    };
  }
  return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
};

export const isOnline = () => {
  return navigator ? navigator.onLine : true;
};

export const isSlowNetwork = () => {
  const connection = getConnectionInfo();
  return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
};

// Device Capabilities
export const supportsTouchEvents = () => {
  return (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch) ||
    navigator.maxTouchPoints > 0
  );
};

export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

export const getScreenCategory = () => {
  if (typeof screen === 'undefined') return 'unknown';

  const width = screen.width;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1920) return 'desktop';
  return 'large';
};

export const supportsOrientation = () => {
  return screen && 'orientation' in screen;
};

// Performance Capabilities
export const supportsRequestAnimationFrame = () => {
  return typeof requestAnimationFrame !== 'undefined';
};

export const supportsRequestIdleCallback = () => {
  return typeof requestIdleCallback !== 'undefined';
};

export const supportsWebWorkers = () => {
  return typeof Worker !== 'undefined';
};

export const supportsServiceWorker = () => {
  return navigator && 'serviceWorker' in navigator;
};

// Media Capabilities
export const supportsAudioFormat = (format) => {
  try {
    const audio = new Audio();
    const mimeMap = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      m4a: 'audio/mp4',
    };

    const mimeType = mimeMap[format];
    if (!mimeType) return false;

    const support = audio.canPlayType(mimeType);
    return support === 'probably' || support === 'maybe';
  } catch {
    return false;
  }
};

export const supportsVideoFormat = (format) => {
  try {
    const video = document.createElement('video');
    const mimeMap = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogv: 'video/ogg',
    };

    const mimeType = mimeMap[format];
    if (!mimeType) return false;

    const support = video.canPlayType(mimeType);
    return support === 'probably' || support === 'maybe';
  } catch {
    return false;
  }
};

export const supportsMediaDevices = () => {
  return !!(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// ES6+ Feature Detection
export const supportsES6 = () => {
  try {
    // Test for arrow functions, const/let, template literals
    eval('const test = () => `test`; let x = 1;');
    return true;
  } catch {
    return false;
  }
};

export const supportsModernFeatures = () => {
  return supportsES6() && supportsCSSGrid() && supportsFlexbox() && supportsIntersectionObserver();
};

// Progressive Enhancement Helpers
export const needsFallback = (features) => {
  const featureMap = {
    'css-grid': supportsCSSGrid(),
    flexbox: supportsFlexbox(),
    webp: supportsWebP(),
    'intersection-observer': supportsIntersectionObserver(),
    'resize-observer': supportsResizeObserver(),
    'local-storage': supportsLocalStorage(),
    'web-workers': supportsWebWorkers(),
    'service-worker': supportsServiceWorker(),
  };

  return features.some((feature) => !featureMap[feature]);
};

export const createFeatureMap = () => {
  return {
    css: {
      grid: supportsCSSGrid(),
      flexbox: supportsFlexbox(),
    },
    storage: {
      localStorage: supportsLocalStorage(),
      sessionStorage: supportsSessionStorage(),
      indexedDB: supportsIndexedDB(),
    },
    apis: {
      intersectionObserver: supportsIntersectionObserver(),
      resizeObserver: supportsResizeObserver(),
      mutationObserver: supportsMutationObserver(),
      webSocket: supportsWebSocket(),
      geolocation: supportsGeolocation(),
    },
    media: {
      webp: supportsWebP(),
      touch: supportsTouchEvents(),
    },
    performance: {
      requestAnimationFrame: supportsRequestAnimationFrame(),
      requestIdleCallback: supportsRequestIdleCallback(),
      webWorkers: supportsWebWorkers(),
      serviceWorker: supportsServiceWorker(),
    },
  };
};

export const suggestPolyfills = (missingFeatures) => {
  const polyfillMap = {
    'intersection-observer': {
      feature: 'IntersectionObserver',
      polyfill: 'intersection-observer',
      cdn: 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver',
    },
    'resize-observer': {
      feature: 'ResizeObserver',
      polyfill: 'resize-observer-polyfill',
      cdn: 'https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver',
    },
    'css-grid': {
      feature: 'CSS Grid',
      polyfill: 'css-grid-polyfill',
      cdn: 'https://unpkg.com/css-grid-polyfill',
    },
  };

  return missingFeatures
    .filter((feature) => polyfillMap[feature])
    .map((feature) => polyfillMap[feature]);
};

// Browser Information
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;

  let browser = 'unknown';
  let version = 'unknown';
  let engine = 'unknown';

  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
    engine = 'Blink';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    engine = 'Gecko';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
    engine = 'WebKit';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'unknown';
  }

  return { name: browser, version, engine };
};

export const isMobileBrowser = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isLegacyBrowser = () => {
  const browser = getBrowserInfo();
  const legacyVersions = {
    Chrome: 60,
    Firefox: 55,
    Safari: 12,
  };

  const minVersion = legacyVersions[browser.name];
  if (!minVersion) return true;

  return parseInt(browser.version) < minVersion;
};
