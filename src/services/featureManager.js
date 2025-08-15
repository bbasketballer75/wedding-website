// Feature Integration Manager for Wedding Website
import { analyticsManager } from '../../services/api/analyticsManager';

class FeatureManager {
  constructor() {
    this.features = new Map();
    this.isInitialized = false;
    this.config = {
      analytics: true,
      lazyLoading: true,
      serviceWorker: true,
      errorBoundary: true,
      performance: true,
      security: true,
    };
  }

  // Initialize all features
  async init(userConfig = {}) {
    if (this.isInitialized) return;

    this.config = { ...this.config, ...userConfig };

    try {
      // Initialize core features
      await this.initializeAnalytics();
      await this.initializeServiceWorker();
      await this.initializePerformanceMonitoring();
      await this.initializeSecurity();

      this.isInitialized = true;
      console.log('🚀 Wedding Website Features Initialized:', {
        features: Array.from(this.features.keys()),
        timestamp: new Date().toISOString(),
      });

      // Track successful initialization
      analyticsManager.trackEvent('feature_manager_initialized', {
        enabledFeatures: Array.from(this.features.keys()),
        config: this.config,
      });
    } catch (error) {
      console.error('❌ Feature initialization failed:', error);
      analyticsManager.trackEvent('feature_manager_init_failed', {
        error: error.message,
        stack: error.stack,
      });
    }
  }

  // Analytics initialization
  async initializeAnalytics() {
    if (!this.config.analytics) return;

    try {
      analyticsManager.init();
      this.features.set('analytics', {
        status: 'active',
        instance: analyticsManager,
        initialized: Date.now(),
      });
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
      this.features.set('analytics', { status: 'failed', error: error.message });
    }
  }

  // Service Worker initialization
  async initializeServiceWorker() {
    if (
      !this.config.serviceWorker ||
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      this.features.set('serviceWorker', { status: 'unavailable' });
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/enhanced-sw.js', {
        scope: '/',
        updateViaCache: 'imports',
      });

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              this.notifyUpdate();
            }
          });
        }
      });

      this.features.set('serviceWorker', {
        status: 'active',
        registration,
        initialized: Date.now(),
      });

      analyticsManager.trackEvent('service_worker_registered');
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
      this.features.set('serviceWorker', { status: 'failed', error: error.message });
    }
  }

  // Performance monitoring
  async initializePerformanceMonitoring() {
    if (!this.config.performance) return;

    try {
      // Web Vitals tracking
      if (typeof window !== 'undefined') {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

        getCLS((metric) => this.trackPerformanceMetric('CLS', metric));
        getFID((metric) => this.trackPerformanceMetric('FID', metric));
        getFCP((metric) => this.trackPerformanceMetric('FCP', metric));
        getLCP((metric) => this.trackPerformanceMetric('LCP', metric));
        getTTFB((metric) => this.trackPerformanceMetric('TTFB', metric));
      }

      // Resource timing observer
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              analyticsManager.trackEvent('lcp_measurement', {
                value: entry.startTime,
                element: entry.element?.tagName || 'unknown',
              });
            }
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      this.features.set('performance', {
        status: 'active',
        initialized: Date.now(),
      });
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
      this.features.set('performance', { status: 'failed', error: error.message });
    }
  }

  // Security initialization
  async initializeSecurity() {
    if (!this.config.security) return;

    try {
      // CSP violation reporting
      document.addEventListener('securitypolicyviolation', (event) => {
        analyticsManager.trackEvent('csp_violation', {
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
          originalPolicy: event.originalPolicy,
        });
      });

      // Basic security headers validation
      this.validateSecurityHeaders();

      this.features.set('security', {
        status: 'active',
        initialized: Date.now(),
      });
    } catch (error) {
      console.warn('Security initialization failed:', error);
      this.features.set('security', { status: 'failed', error: error.message });
    }
  }

  // Track performance metrics
  trackPerformanceMetric(name, metric) {
    analyticsManager.trackEvent('core_web_vital', {
      name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });

    // Log performance issues
    if (metric.rating === 'poor') {
      console.warn(`⚠️ Poor ${name} performance:`, metric.value);
    }
  }

  // Validate security headers
  validateSecurityHeaders() {
    if (typeof window === 'undefined') return;

    // Check for HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.warn('🔒 Site not served over HTTPS');
      analyticsManager.trackEvent('security_warning', { type: 'no_https' });
    }

    // Check for mixed content
    if (location.protocol === 'https:' && document.querySelector('[src^="http:"]')) {
      console.warn('🔒 Mixed content detected');
      analyticsManager.trackEvent('security_warning', { type: 'mixed_content' });
    }
  }

  // Notify about updates
  notifyUpdate() {
    if (typeof window === 'undefined') return;

    // Create update notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--sage-green);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
      ">
        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">New content available!</p>
        <button onclick="window.location.reload()" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        ">Refresh Page</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);

    analyticsManager.trackEvent('update_notification_shown');
  }

  // Get feature status
  getFeatureStatus(featureName) {
    return this.features.get(featureName) || { status: 'not_initialized' };
  }

  // Get all features status
  getAllFeatures() {
    const status = {};
    for (const [name, feature] of this.features.entries()) {
      status[name] = feature.status;
    }
    return status;
  }

  // Enable/disable features dynamically
  toggleFeature(featureName, enabled) {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.enabled = enabled;
      analyticsManager.trackEvent('feature_toggled', { feature: featureName, enabled });
    }
  }

  // Feature health check
  async healthCheck() {
    const results = {};

    for (const [name, feature] of this.features.entries()) {
      try {
        switch (name) {
          case 'analytics':
            results[name] = analyticsManager.isInitialized ? 'healthy' : 'unhealthy';
            break;
          case 'serviceWorker':
            results[name] = navigator.serviceWorker.controller ? 'healthy' : 'unhealthy';
            break;
          default:
            results[name] = feature.status === 'active' ? 'healthy' : 'unhealthy';
        }
      } catch {
        results[name] = 'error';
      }
    }

    analyticsManager.trackEvent('feature_health_check', results);
    return results;
  }
}

// Create global instance
export const featureManager = new FeatureManager();

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => featureManager.init());
  } else {
    featureManager.init();
  }
}

export default featureManager;
