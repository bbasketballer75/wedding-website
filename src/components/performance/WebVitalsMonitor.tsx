'use client';

import React, { useEffect } from 'react';

/**
 * 📊 Core Web Vitals Monitoring
 * Real-time tracking of LCP, FID, CLS, INP metrics
 */

type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

interface WebVitalMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  rating: PerformanceRating;
}

interface PerformanceData {
  url: string;
  userAgent: string;
  connection?: string;
  metrics: WebVitalMetric[];
  timestamp: number;
  sessionId: string;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 }, // First Input Delay
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
};

class WebVitalsMonitor {
  private readonly sessionId: string;
  private readonly metrics: Map<string, WebVitalMetric> = new Map();
  private readonly isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled =
      typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  private getRating(name: string, value: number): PerformanceRating {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private async sendMetric(metric: WebVitalMetric): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const connection = (navigator as { connection?: { effectiveType?: string } }).connection
        ?.effectiveType;

      const performanceData: PerformanceData = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        connection,
        metrics: [metric],
        timestamp: Date.now(),
        sessionId: this.sessionId,
      };

      // Send to analytics endpoint
      await fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(performanceData),
        keepalive: true,
      }).catch((error) => {
        console.warn('Failed to send performance metric:', error);
      });

      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🔍 Web Vital: ${metric.name}`, {
          value: `${(metric as any).value}ms`,
          rating: metric.rating,
          id: metric.id,
        });
      }
    } catch (error) {
      console.warn('Performance monitoring error:', error);
    }
  }
  public trackMetric(name: string, value: number, id: string): void {
    const delta = this.metrics.has(name) ? value - this.metrics.get(name)!.value : value;

    const metric: WebVitalMetric = {
      name,
      value,
      delta,
      id,
      rating: this.getRating(name, value),
    };

    this.metrics.set(name, metric);
    this.sendMetric(metric);
  }

  public async init(): Promise<void> {
    if (!this.isEnabled || typeof window === 'undefined') return;

    try {
      // Dynamic import of web-vitals library (updated for web-vitals v3+)
      const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

      // Track Core Web Vitals
      onLCP((metric: { value: number; id: string }) =>
        this.trackMetric('LCP', metric.value, metric.id)
      );
      onCLS((metric: { value: number; id: string }) =>
        this.trackMetric('CLS', metric.value * 1000, metric.id)
      ); // Convert to ms
      onFCP((metric: { value: number; id: string }) =>
        this.trackMetric('FCP', metric.value, metric.id)
      );
      onTTFB((metric: { value: number; id: string }) =>
        this.trackMetric('TTFB', metric.value, metric.id)
      );

      // Track INP if supported (modern browsers)
      if (onINP) {
        onINP((metric: { value: number; id: string }) =>
          this.trackMetric('INP', metric.value, metric.id)
        );
      }

      // Track custom metrics
      this.trackCustomMetrics();
    } catch (error) {
      console.warn('Failed to initialize web vitals monitoring:', error);
    }
  }
  private trackCustomMetrics(): void {
    // Track Navigation Timing (modern API)
    if (window.performance?.getEntriesByType) {
      const navigationEntries = window.performance.getEntriesByType('navigation');

      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0];

        // DOM Content Loaded
        const domContentLoaded =
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        this.trackMetric('DCL', domContentLoaded, 'navigation');

        // Page Load Complete
        const loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
        this.trackMetric('Load', loadComplete, 'navigation');
      }
    }

    // Track Resource Timing
    if (window.performance?.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource');
      const totalResourceSize = resources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);

      this.trackMetric('ResourceSize', totalResourceSize / 1024, 'resources'); // KB
    }
  }

  public getMetrics(): WebVitalMetric[] {
    return Array.from(this.metrics.values());
  }

  public getMetricsByRating(rating: 'good' | 'needs-improvement' | 'poor'): WebVitalMetric[] {
    return this.getMetrics().filter((metric) => metric.rating === rating);
  }
}

// Global instance
let webVitalsMonitor: WebVitalsMonitor | null = null;

export function useWebVitals() {
  useEffect(() => {
    if (!webVitalsMonitor) {
      webVitalsMonitor = new WebVitalsMonitor();
      webVitalsMonitor.init();
    }
  }, []);

  return {
    getMetrics: () => webVitalsMonitor?.getMetrics() || [],
    getMetricsByRating: (rating: PerformanceRating) =>
      webVitalsMonitor?.getMetricsByRating(rating) || [],
  };
}

export default function WebVitalsProvider({ children }: { readonly children: React.ReactNode }) {
  useWebVitals();

  return <>{children}</>;
}

// Export for manual tracking
export { THRESHOLDS, WebVitalsMonitor };
export type { PerformanceData, WebVitalMetric };
