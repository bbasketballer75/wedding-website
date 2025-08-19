'use client';

/**
 * ⚡ Advanced Performance Manager (Simplified)
 *
 * Implements essential performance optimizations for August 2025:
 * - Resource preloading
 * - Performance monitoring
 * - Smart caching
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  preloadResource: (href: string, type?: string) => void;
  preloadResources: (hrefs: string[], type?: string) => void;
  measurePerformance: (event: string, data?: unknown) => void;
  cacheData: (key: string, data: unknown) => Promise<void>;
  getCachedData: (key: string) => Promise<any>;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const AdvancedPerformanceManager: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  // Preload a single resource
  const preloadResource = useCallback((href: string, type: string = 'script') => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;

    if (type === 'image') {
      link.as = 'image';
    } else if (type === 'script') {
      link.as = 'script';
    } else if (type === 'style') {
      link.as = 'style';
    }

    document.head.appendChild(link);
  }, []);

  // Preload multiple resources
  const preloadResources = useCallback(
    (hrefs: string[], type: string = 'script') => {
      hrefs.forEach((href) => preloadResource(href, type));
    },
    [preloadResource]
  );

  // Measure performance events
  const measurePerformance = useCallback((event: string, data?: unknown) => {
    if (typeof window === 'undefined') return;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Performance Event: ${event}`, data);
    }

    // Send to analytics in production
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', event, {
        custom_parameter: JSON.stringify(data),
        timestamp: Date.now(),
      });
    }
  }, []);

  // Simple cache implementation using localStorage
  const cacheData = useCallback(async (key: string, data: unknown) => {
    if (typeof window === 'undefined') return;

    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: 3600000, // 1 hour
      };
      localStorage.setItem(`performance_cache_${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }, []);

  // Get cached data
  const getCachedData = useCallback(async (key: string) => {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(`performance_cache_${key}`);
      if (!cached) return null;

      const cacheEntry = JSON.parse(cached);
      const now = Date.now();

      if (now - cacheEntry.timestamp > cacheEntry.ttl) {
        localStorage.removeItem(`performance_cache_${key}`);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Basic performance observer
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              // Simple fallback for navigation timing
              setMetrics((prev) => ({
                ...prev,
                ttfb: Date.now() - performance.timeOrigin,
              }));
            } else if (entry.entryType === 'largest-contentful-paint') {
              setMetrics((prev) => ({
                ...prev,
                lcp: entry.startTime,
              }));
            }
          });
        });

        observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });

        return () => observer.disconnect();
      } catch (error) {
        console.warn('Performance observer failed:', error);
      }
    }

    // Web Vitals integration
    import('web-vitals')
      .then((vitals) => {
        if (vitals.onCLS) {
          vitals.onCLS((metric: unknown) => {
            setMetrics((prev) => ({ ...prev, cls: (metric as any).value }));
          });
        }
        if (vitals.onINP) {
          vitals.onINP((metric: unknown) => {
            setMetrics((prev) => ({ ...prev, fid: (metric as any).value }));
          });
        }
        if (vitals.onFCP) {
          vitals.onFCP((metric: unknown) => {
            setMetrics((prev) => ({ ...prev, fcp: (metric as any).value }));
          });
        }
        if (vitals.onLCP) {
          vitals.onLCP((metric: unknown) => {
            setMetrics((prev) => ({ ...prev, lcp: (metric as any).value }));
          });
        }
      })
      .catch(() => {
        console.warn('Web Vitals not available');
      });
  }, []);

  const contextValue = useMemo(
    () => ({
      metrics,
      preloadResource,
      preloadResources,
      measurePerformance,
      cacheData,
      getCachedData,
    }),
    [metrics, preloadResource, preloadResources, measurePerformance, cacheData, getCachedData]
  );

  return <PerformanceContext.Provider value={contextValue}>{children}</PerformanceContext.Provider>;
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within AdvancedPerformanceManager');
  }
  return context;
};

export default AdvancedPerformanceManager;
