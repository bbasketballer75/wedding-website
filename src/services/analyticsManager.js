// Analytics integration for wedding website
import { WeddingAnalytics } from '../utils/weddingAnalytics';

class AnalyticsManager {
  constructor() {
    this.analytics = null;
    this.isInitialized = false;
    this.eventQueue = [];
  }

  // Initialize analytics system
  init() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    this.analytics = new WeddingAnalytics();
    this.isInitialized = true;

    // Process queued events
    this.eventQueue.forEach((event) => {
      this.analytics.trackEvent(event.name, event.properties);
    });
    this.eventQueue = [];

    // Setup global error tracking
    this.setupErrorTracking();

    // Setup performance monitoring
    this.setupPerformanceTracking();
  }

  // Track events with queueing support
  trackEvent(eventName, properties = {}) {
    if (!this.isInitialized) {
      this.eventQueue.push({ name: eventName, properties });
      return;
    }

    this.analytics.trackEvent(eventName, properties);
  }

  // Wedding-specific tracking methods
  trackPhotoView(photoId, category) {
    this.trackEvent('photo_viewed', {
      photoId,
      category,
      timestamp: Date.now(),
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    });
  }

  trackGuestbookEntry(messageLength, hasImage) {
    this.trackEvent('guestbook_entry_submitted', {
      messageLength,
      hasImage,
      device: this.getDeviceType(),
      timestamp: Date.now(),
    });
  }

  trackPageView(path) {
    this.trackEvent('page_view', {
      path,
      referrer: document.referrer,
      timestamp: Date.now(),
      loadTime: performance.now(),
    });
  }

  trackUserEngagement(action, element) {
    this.trackEvent('user_engagement', {
      action,
      element,
      timestamp: Date.now(),
      sessionDuration: Date.now() - (this.analytics?.startTime || Date.now()),
    });
  }

  trackError(error, errorInfo) {
    this.trackEvent('error_boundary_triggered', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: Date.now(),
    });
  }

  // Setup error tracking
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        message: event.error?.message || 'Unknown error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('promise_rejection', {
        reason: event.reason?.toString() || 'Unknown rejection',
        timestamp: Date.now(),
      });
    });
  }

  // Setup performance tracking
  setupPerformanceTracking() {
    // Track Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => this.trackEvent('core_web_vital', { name: 'CLS', value: metric.value }));
        getFID((metric) => this.trackEvent('core_web_vital', { name: 'FID', value: metric.value }));
        getFCP((metric) => this.trackEvent('core_web_vital', { name: 'FCP', value: metric.value }));
        getLCP((metric) => this.trackEvent('core_web_vital', { name: 'LCP', value: metric.value }));
        getTTFB((metric) =>
          this.trackEvent('core_web_vital', { name: 'TTFB', value: metric.value })
        );
      });
    }

    // Track navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.trackEvent('page_performance', {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded:
              navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            timeToInteractive: navigation.loadEventEnd - navigation.fetchStart,
          });
        }
      }, 1000);
    });
  }

  // Utility methods
  getDeviceType() {
    if (typeof window === 'undefined') return 'unknown';

    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
}

// Create global instance
export const analyticsManager = new AnalyticsManager();

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => analyticsManager.init());
  } else {
    analyticsManager.init();
  }
}

// Export for manual initialization
export default analyticsManager;
