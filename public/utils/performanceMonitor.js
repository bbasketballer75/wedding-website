/**
 * Performance monitoring script for wedding website
 * Tracks real-time metrics and sends alerts
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      coreWebVitals: {},
      apiResponseTimes: {},
      errorRate: 0,
      userSatisfaction: 0,
    };

    this.thresholds = {
      pageLoadTime: 3000, // 3 seconds
      lcp: 2500, // Largest Contentful Paint
      fid: 100, // First Input Delay
      cls: 0.1, // Cumulative Layout Shift
      apiResponseTime: 1000,
    };

    this.init();
  }

  init() {
    this.trackPagePerformance();
    this.trackCoreWebVitals();
    this.trackAPIPerformance();
    this.trackUserExperience();
    this.setupReporting();
  }

  trackPagePerformance() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;

      // Check if page load exceeds threshold
      if (this.metrics.pageLoadTime > this.thresholds.pageLoadTime) {
        this.sendAlert('slow_page_load', {
          loadTime: this.metrics.pageLoadTime,
          threshold: this.thresholds.pageLoadTime,
        });
      }
    });
  }

  trackCoreWebVitals() {
    // Basic Core Web Vitals tracking without import
    if ('PerformanceObserver' in window) {
      // Track LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.coreWebVitals.lcp = lastEntry.startTime;

        if (lastEntry.startTime > this.thresholds.lcp) {
          this.sendAlert('poor_lcp', { value: lastEntry.startTime });
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observer not supported:', error.message);
      }

      // Track FID
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.coreWebVitals.fid = entry.processingStart - entry.startTime;

          if (entry.processingStart - entry.startTime > this.thresholds.fid) {
            this.sendAlert('poor_fid', { value: entry.processingStart - entry.startTime });
          }
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observer not supported:', error.message);
      }

      // Track CLS
      let cumulativeLayoutShift = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
            this.metrics.coreWebVitals.cls = cumulativeLayoutShift;

            if (cumulativeLayoutShift > this.thresholds.cls) {
              this.sendAlert('poor_cls', { value: cumulativeLayoutShift });
            }
          }
        });
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observer not supported:', error.message);
      }
    }
  }

  trackAPIPerformance() {
    // Intercept fetch requests to monitor API performance
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Track API response times
        if (url.includes('/api/')) {
          this.metrics.apiResponseTimes[url] = duration;

          if (duration > this.thresholds.apiResponseTime) {
            this.sendAlert('slow_api_response', {
              url,
              duration,
              threshold: this.thresholds.apiResponseTime,
            });
          }
        }

        return response;
      } catch (error) {
        this.trackError(error, url);
        throw error;
      }
    };
  }

  trackUserExperience() {
    // Track rage clicks
    let clickCount = 0;
    let clickTimer;

    document.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);

      clickTimer = setTimeout(() => {
        if (clickCount > 3) {
          this.sendAlert('rage_clicks', { clickCount });
        }
        clickCount = 0;
      }, 1000);
    });

    // Track long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            // Long task threshold
            this.sendAlert('long_task', {
              duration: entry.duration,
              name: entry.name,
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.warn('Long task observer not supported:', error.message);
      }
    }
  }

  trackError(error, context = '') {
    this.metrics.errorRate++;

    this.sendAlert('javascript_error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    });
  }

  setupReporting() {
    // Send metrics every 30 seconds
    setInterval(() => {
      this.sendMetrics();
    }, 30000);

    // Send final metrics when user leaves
    window.addEventListener('beforeunload', () => {
      this.sendMetrics();
    });
  }

  async sendMetrics() {
    try {
      await fetch('/api/performance-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: this.metrics,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (error) {
      console.warn('Failed to send performance metrics:', error);
    }
  }

  async sendAlert(type, data) {
    try {
      await fetch('/api/performance-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data,
          severity: this.getAlertSeverity(type),
          timestamp: Date.now(),
          url: window.location.href,
        }),
      });
    } catch (error) {
      console.warn('Failed to send performance alert:', error);
    }
  }

  getAlertSeverity(type) {
    const severityMap = {
      slow_page_load: 'medium',
      poor_cls: 'high',
      poor_fid: 'high',
      poor_lcp: 'medium',
      slow_api_response: 'medium',
      rage_clicks: 'high',
      long_task: 'low',
      javascript_error: 'high',
    };

    return severityMap[type] || 'low';
  }

  // Public API for manual performance tracking
  trackCustomMetric(name, value, unit = 'ms') {
    this.metrics[name] = { value, unit, timestamp: Date.now() };
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Global error handler
window.addEventListener('error', (event) => {
  performanceMonitor.trackError(event.error, event.filename);
});

window.addEventListener('unhandledrejection', (event) => {
  performanceMonitor.trackError(new Error(event.reason), 'unhandled_promise');
});

// Export for use in other parts of the application
window.performanceMonitor = performanceMonitor;
