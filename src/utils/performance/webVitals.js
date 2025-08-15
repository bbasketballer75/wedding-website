import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Thresholds for Web Vitals (Google's recommended values)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

function sendToAnalytics(metric) {
  // Determine performance rating
  const threshold = THRESHOLDS[metric.name];
  let rating = 'poor';
  if (threshold) {
    if (metric.value <= threshold.good) {
      rating = 'good';
    } else if (metric.value <= threshold.poor) {
      rating = 'needs-improvement';
    }
  }

  // Send to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_map: {
        rating: rating,
        delta: metric.delta,
        entries: metric.entries.length,
      },
    });
  }

  // Send to Sentry for monitoring
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: `${metric.name}: ${metric.value}`,
      level: rating === 'poor' ? 'warning' : 'info',
      data: {
        rating,
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
      },
    });

    // Send as performance issue if poor rating
    if (rating === 'poor') {
      window.Sentry.captureMessage(`Poor ${metric.name} performance: ${metric.value}`, {
        level: 'warning',
        tags: {
          webVitals: metric.name,
          rating: rating,
        },
        extra: {
          value: metric.value,
          threshold: threshold,
          delta: metric.delta,
        },
      });
    }
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
  }

  // Send to custom analytics endpoint if available
  if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
    fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'web-vitals',
        metric: metric.name,
        value: metric.value,
        rating: rating,
        delta: metric.delta,
        id: metric.id,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  }
}

export function initWebVitals() {
  // Only initialize in browser environment
  if (typeof window === 'undefined') return;

  // Cumulative Layout Shift (CLS)
  getCLS(sendToAnalytics);

  // First Input Delay (FID)
  getFID(sendToAnalytics);

  // First Contentful Paint (FCP)
  getFCP(sendToAnalytics);

  // Largest Contentful Paint (LCP)
  getLCP(sendToAnalytics);

  // Time to First Byte (TTFB)
  getTTFB(sendToAnalytics);
}

// Performance observer for additional metrics
export function initPerformanceObserver() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;

  try {
    // Monitor navigation timing
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navigationTiming = {
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            request: entry.responseStart - entry.requestStart,
            response: entry.responseEnd - entry.responseStart,
            domComplete: entry.domComplete - entry.navigationStart,
            loadComplete: entry.loadEventEnd - entry.navigationStart,
          };

          if (process.env.NODE_ENV === 'development') {
          }

          // Send to analytics
          if (typeof gtag !== 'undefined') {
            Object.entries(navigationTiming).forEach(([key, value]) => {
              gtag('event', 'navigation_timing', {
                event_category: 'Performance',
                event_label: key,
                value: Math.round(value),
              });
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
  } catch (error) {
    console.warn('Failed to initialize PerformanceObserver:', error);
  }
}

// Export for Next.js reportWebVitals function
export default function reportWebVitals(metric) {
  sendToAnalytics(metric);
}
