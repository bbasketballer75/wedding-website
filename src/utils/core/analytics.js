// Basic analytics utility with local/session storage persistence and privacy gating

const ANALYTICS_STORAGE_KEY = 'analytics:events';
const ANALYTICS_PREFS_KEY = 'privacy:prefs';
const SESSION_STORAGE_KEY = 'analytics:session';

// In-memory cache so privacy works even if storage is mocked/non-persistent
let privacyPrefsCache = null;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getPrefs() {
  if (privacyPrefsCache && typeof privacyPrefsCache === 'object') return privacyPrefsCache;
  const raw =
    (typeof localStorage !== 'undefined' && localStorage.getItem(ANALYTICS_PREFS_KEY)) || null;
  const parsed = raw ? safeParse(raw) || {} : {};
  privacyPrefsCache = parsed;
  return parsed;
}

function setPrefs(prefs) {
  privacyPrefsCache = { ...(prefs || {}) };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ANALYTICS_PREFS_KEY, JSON.stringify(privacyPrefsCache));
  }
}

function isEnabled(channel = 'analytics') {
  const prefs = getPrefs();
  if (Object.hasOwn(prefs, channel)) {
    return !!prefs[channel];
  }
  return true; // default enabled
}

function getEventStore() {
  const raw =
    (typeof localStorage !== 'undefined' && localStorage.getItem(ANALYTICS_STORAGE_KEY)) || null;
  const parsed = raw ? safeParse(raw) : null;
  return parsed && typeof parsed === 'object' ? parsed : { events: [] };
}

function setEventStore(store) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(store));
  }
}

export function reset() {
  // Clear event and session state for tests
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
  privacyPrefsCache = null;
}

export function setPrivacyPreference(channel, enabled) {
  const prefs = getPrefs();
  prefs[channel || 'analytics'] = !!enabled;
  setPrefs(prefs);
  // If disabling analytics, clear any queued data immediately
  if ((channel || 'analytics') === 'analytics' && !enabled) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    }
  }
}

export function trackEvent(type, payload = {}) {
  if (!isEnabled('analytics') || !type) return;
  const store = getEventStore();
  store.events.push({ type, payload, timestamp: Date.now() });
  setEventStore(store);
}

export function initSession() {
  if (typeof sessionStorage === 'undefined') return;
  const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!existing) {
    const session = { id: `session_${Date.now()}`, startTime: Date.now(), events: [] };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }
}

export function getSessionDuration() {
  if (typeof sessionStorage === 'undefined') return 0;
  const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return 0;
  const session = safeParse(raw);
  if (!session || !session.startTime) return 0;
  return Date.now() - session.startTime;
}

export function trackPageView(data = {}) {
  trackEvent('page_view', {
    path: data.path || (typeof location !== 'undefined' ? location.pathname : undefined),
    title: data.title || (typeof document !== 'undefined' ? document.title : undefined),
    referrer: data.referrer || (typeof document !== 'undefined' ? document.referrer : undefined),
  });
}

export function trackPagePerformance() {
  if (typeof performance === 'undefined') return;
  const timing = performance.timing || {};
  const metrics = {
    loadTime: (timing.loadEventEnd || 0) - (timing.navigationStart || 0),
    domContentLoaded: (timing.domContentLoadedEventEnd || 0) - (timing.navigationStart || 0),
    paints:
      typeof performance.getEntriesByType === 'function'
        ? performance.getEntriesByType('paint')
        : [],
  };
  trackEvent('page_performance', metrics);
}

function sanitizeErrorMessage(message) {
  if (!message) return '';
  return String(message).replace(/password\s*[:=]\s*[^\s]+/gi, 'password:[REDACTED]');
}

export function trackError(error, context = {}) {
  if (!isEnabled('analytics')) return;
  const payload = {
    message: sanitizeErrorMessage(error?.message || String(error)),
    stack: error?.stack ? String(error.stack).split('\n').slice(0, 5).join('\n') : undefined,
    context,
  };
  trackEvent('error', payload);
}

export function trackNetworkError(url, status, message) {
  trackEvent('network_error', { url, status, message });
}

export function trackInteraction(kind, details = {}) {
  trackEvent('interaction', { kind, details });
}

let lastScrollTs = 0;
export function trackScroll(details = {}) {
  const now = Date.now();
  if (now - lastScrollTs < 200) return; // debounce
  lastScrollTs = now;
  trackEvent('scroll', details);
}

export function exportUserData() {
  return getEventStore();
}

export function clearUserData() {
  reset();
}

export function flushEvents() {
  // Respect privacy settings: if analytics is disabled, do not send or write
  if (!isEnabled('analytics')) {
    return;
  }
  const store = getEventStore();
  const payload = JSON.stringify({ events: store.events, flushedAt: Date.now() });
  let sent = false;
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      sent = navigator.sendBeacon('/analytics', payload);
    }
  } catch {
    // ignore
  }
  if (!sent) {
    // re-queue for later
    setEventStore({ events: store.events });
  } else {
    setEventStore({ events: [] });
  }
}

export default {
  reset,
  setPrivacyPreference,
  trackEvent,
  initSession,
  getSessionDuration,
  trackPageView,
  trackPagePerformance,
  trackError,
  trackNetworkError,
  trackInteraction,
  trackScroll,
  exportUserData,
  clearUserData,
  flushEvents,
};
