// Feature detection utilities used by tests

export function supportsModernFeatures() {
  try {
    // Basic ES6 checks
    new Function('let a=1; const b=()=>a; return b();');
    return true;
  } catch {
    return false;
  }
}

export function supportsES6() {
  return supportsModernFeatures();
}

export function supportsCSSGrid() {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('display', 'grid')
  );
}

export function supportsFlexbox() {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('display', 'flex')
  );
}

export function supportsWebP() {
  try {
    const canvas = document?.createElement?.('canvas');
    return !!canvas && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
}

export function supportsLocalStorage() {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function supportsSessionStorage() {
  try {
    return typeof sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function supportsIndexedDB() {
  return typeof indexedDB !== 'undefined';
}

export async function getStorageQuota() {
  try {
    const estimate = await navigator?.storage?.estimate?.();
    return estimate || { quota: 0, usage: 0 };
  } catch {
    return { quota: 0, usage: 0 };
  }
}

export function supportsIntersectionObserver() {
  return typeof IntersectionObserver !== 'undefined';
}

export function supportsResizeObserver() {
  return typeof ResizeObserver !== 'undefined';
}

export function supportsMutationObserver() {
  return typeof MutationObserver !== 'undefined';
}

export function supportsWebSocket() {
  return typeof WebSocket !== 'undefined';
}

export function supportsGeolocation() {
  return !!navigator?.geolocation;
}

export function getConnectionInfo() {
  return navigator?.connection || {};
}

export function isOnline() {
  return !!navigator?.onLine;
}

export function isSlowNetwork() {
  const type = navigator?.connection?.effectiveType;
  return type === '2g' || type === 'slow-2g';
}

export function supportsTouchEvents() {
  return (
    'ontouchstart' in globalThis ||
    // eslint-disable-next-line no-undef
    (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch) ||
    'createTouch' in document
  );
}

export function getDevicePixelRatio() {
  const dpr = globalThis?.devicePixelRatio;
  return typeof dpr === 'number' ? dpr : 1;
}

export function getScreenCategory() {
  const w = globalThis?.screen?.width || 0;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  if (w < 1440) return 'desktop';
  return 'large';
}

export function supportsOrientation() {
  return !!globalThis?.screen?.orientation;
}

export function supportsRequestAnimationFrame() {
  return typeof requestAnimationFrame === 'function';
}

export function supportsRequestIdleCallback() {
  return typeof requestIdleCallback === 'function';
}

export function supportsWebWorkers() {
  return typeof Worker !== 'undefined';
}

export function supportsServiceWorker() {
  return !!navigator?.serviceWorker;
}

export function supportsAudioFormat(type) {
  try {
    const audio = new Audio();
    const map = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg' };
    return audio.canPlayType(map[type] || '') !== '';
  } catch {
    return false;
  }
}

export function supportsVideoFormat(type) {
  try {
    const video = document.createElement('video');
    const map = { mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg' };
    return video.canPlayType(map[type] || '') !== '';
  } catch {
    return false;
  }
}

export function supportsMediaDevices() {
  return !!navigator?.mediaDevices;
}

export function needsFallback(features = []) {
  const supportMap = {
    'css-grid': supportsCSSGrid(),
    'intersection-observer': supportsIntersectionObserver(),
    webp: supportsWebP(),
  };
  return features.some((f) => supportMap[f] === false);
}

export function createFeatureMap() {
  return {
    storage: {
      local: supportsLocalStorage(),
      session: supportsSessionStorage(),
      indexedDB: supportsIndexedDB(),
    },
    apis: {
      intersectionObserver: supportsIntersectionObserver(),
      resizeObserver: supportsResizeObserver(),
      mutationObserver: supportsMutationObserver(),
      websocket: supportsWebSocket(),
      geolocation: supportsGeolocation(),
    },
    css: {
      grid: supportsCSSGrid(),
      flex: supportsFlexbox(),
    },
    media: {
      audioMp3: supportsAudioFormat('mp3'),
      videoMp4: supportsVideoFormat('mp4'),
      devices: supportsMediaDevices(),
    },
  };
}

export function suggestPolyfills(missing = []) {
  const catalog = {
    'intersection-observer': {
      feature: 'intersection-observer',
      polyfill: 'intersection-observer',
      cdn: 'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.2/intersection-observer.js',
    },
    'resize-observer': {
      feature: 'resize-observer',
      polyfill: 'resize-observer-polyfill',
      cdn: 'https://cdn.jsdelivr.net/npm/resize-observer-polyfill@1.5.1/dist/ResizeObserver.global.js',
    },
  };
  return missing.map((f) => catalog[f]).filter(Boolean);
}

export function getBrowserInfo() {
  const ua = navigator?.userAgent || '';
  let name = 'Unknown';
  if (/Chrome/.test(ua)) name = 'Chrome';
  else if (/Firefox/.test(ua)) name = 'Firefox';
  else if (/Safari/.test(ua)) name = 'Safari';
  const versionMatch = ua.match(/(Chrome|Firefox)\/([\d.]+)/);
  const version = versionMatch ? versionMatch[2] : '0';
  let engine = 'Unknown';
  if (/AppleWebKit/.test(ua)) {
    engine = 'WebKit';
  } else if (/Gecko/.test(ua)) {
    engine = 'Gecko';
  }
  return { name, version, engine };
}

export function isMobileBrowser() {
  const ua = navigator?.userAgent || '';
  return /Mobi|Android/i.test(ua);
}

export function isLegacyBrowser() {
  // naive: treat no ES6 as legacy
  return !supportsES6();
}
