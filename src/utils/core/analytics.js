/**
 * Enhanced Analytics for Wedding Website
 * Tracks user engagement and performance metrics
 */

class WeddingAnalytics {
  constructor() {
    this.sessionStart = Date.now();
    this.interactions = [];
    this.pageViews = [];
    this.init();
  }

  init() {
    this.trackPageView();
    this.setupIntersectionObserver();
    this.trackCoreWebVitals();
    this.setupPerformanceObserver();
  }

  // Track section visibility and engagement
  setupIntersectionObserver() {
    const sections = document.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.trackSectionView(entry.target.dataset.section);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Track Core Web Vitals
  async trackCoreWebVitals() {
    // Only run on client side
    if (typeof window === 'undefined') {
      this.setupWebVitalsFallback();
      return;
    }

    try {
      // Use dynamic import with better error handling
      const webVitalsModule = await import('web-vitals');
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitalsModule;

      getCLS(this.sendMetric.bind(this));
      getFID(this.sendMetric.bind(this));
      getFCP(this.sendMetric.bind(this));
      getLCP(this.sendMetric.bind(this));
      getTTFB(this.sendMetric.bind(this));
    } catch (error) {
      console.warn('web-vitals module not available, using fallback:', error.message);
      this.setupWebVitalsFallback();
    }
  }

  // Fallback implementation for web vitals
  setupWebVitalsFallback() {
    // Simple performance tracking fallback
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'largest-contentful-paint') {
            this.sendMetric({ name: 'LCP', value: entry.startTime });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch {
        console.warn('Performance Observer not supported');
      }
    }
  }

  // Performance monitoring
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.trackPageLoadMetrics(entry);
          } else if (entry.entryType === 'largest-contentful-paint') {
            this.sendMetric({ name: 'LCP', value: entry.startTime });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });
    }
  }

  // Track user interactions
  trackInteraction(type, target, details = {}) {
    const interaction = {
      type,
      target,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.sessionStart,
      ...details,
    };

    this.interactions.push(interaction);
    this.sendToAnalytics('interaction', interaction);
  }

  // Track section views
  trackSectionView(section) {
    const view = {
      section,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.sessionStart,
    };

    this.pageViews.push(view);
    this.sendToAnalytics('section_view', view);
  }

  // Track page performance
  trackPageLoadMetrics(entry) {
    const metrics = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
      domLoad: entry.domContentLoadedEventEnd - entry.navigationStart,
      windowLoad: entry.loadEventEnd - entry.navigationStart,
    };

    this.sendToAnalytics('page_performance', metrics);
  }

  // Send Core Web Vitals
  sendMetric(metric) {
    this.sendToAnalytics('web_vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Track page views
  trackPageView(page = window.location.pathname) {
    this.sendToAnalytics('page_view', {
      page,
      referrer: document.referrer,
      timestamp: Date.now(),
    });
  }

  // Send data to analytics endpoint
  async sendToAnalytics(event, data) {
    try {
      // Try Next.js API route first (will fail in static export)
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          data,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
      });
    } catch {
      // Fallback to backend API or Vercel Functions
      try {
        const backendUrl = process.env.REACT_APP_API_URL || window.location.origin;
        await fetch(`${backendUrl}/api/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event,
            data,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          }),
        });
      } catch (backendError) {
        // Silently fail - analytics is non-critical
      }
    }
  }

  // Get session summary
  getSessionSummary() {
    return {
      duration: Date.now() - this.sessionStart,
      interactions: this.interactions.length,
      sectionsViewed: this.pageViews.length,
      totalScrolls: this.interactions.filter((i) => i.type === 'scroll').length,
      totalClicks: this.interactions.filter((i) => i.type === 'click').length,
    };
  }
}

// Initialize analytics
const analytics = new WeddingAnalytics();

// Export for global use
window.weddingAnalytics = analytics;

// Track common interactions
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-track]')) {
    const element = e.target.closest('[data-track]');
    analytics.trackInteraction('click', element.dataset.track, {
      text: element.textContent?.slice(0, 50),
      href: element.href,
    });
  }
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
  const scrollPercent = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );

  if (scrollPercent > maxScroll) {
    maxScroll = scrollPercent;
    if (scrollPercent % 25 === 0) {
      // Track at 25%, 50%, 75%, 100%
      analytics.trackInteraction('scroll', `${scrollPercent}%`);
    }
  }
});

export default analytics;
