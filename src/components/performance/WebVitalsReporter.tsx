'use client';

/**
 * 📊 Web Vitals Reporter
 *
 * Advanced performance monitoring for Core Web Vitals:
 * - Real-time performance tracking
 * - Visual feedback for developers
 * - Production analytics integration
 */

import { useAnalytics } from '@/providers/AnalyticsProvider';
import React, { useCallback, useEffect, useState } from 'react';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsState {
  lcp?: WebVital;
  fid?: WebVital;
  cls?: WebVital;
  ttfb?: WebVital;
  fcp?: WebVital;
}

export const WebVitalsReporter: React.FC = () => {
  const [vitals, setVitals] = useState<WebVitalsState>({});
  const [showDevOverlay, setShowDevOverlay] = useState(false);
  const analytics = useAnalytics();

  const threshold = (value: number, good: number, needs: number) => {
    if (value <= good) return 'good' as const;
    if (value <= needs) return 'needs-improvement' as const;
    return 'poor' as const;
  };

  const getRating = useCallback(
    (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
      switch (name) {
        case 'LCP':
          return threshold(value, 2500, 4000);
        case 'FID':
          return threshold(value, 100, 300);
        case 'CLS':
          return threshold(value, 0.1, 0.25);
        case 'TTFB':
          return threshold(value, 800, 1800);
        case 'FCP':
          return threshold(value, 1800, 3000);
        default:
          return 'good';
      }
    },
    []
  );

  const reportVital = useCallback(
    (name: string, value: number) => {
      const rating = getRating(name, value);
      const vital: WebVital = {
        name,
        value: Math.round(value),
        rating,
        timestamp: Date.now(),
      };

      setVitals((prev) => ({
        ...prev,
        [name.toLowerCase()]: vital,
      }));

      // Report to analytics
      analytics.trackPerformance(name, vital.value);

      console.error(`📊 ${name}: ${vital.value}ms (${rating})`);
    },
    [analytics, getRating]
  );

  useEffect(() => {
    // URL toggle (?vitals=1 to enable, ?vitals=0 to disable)
    try {
      const url = new URL(window.location.href);
      const v = url.searchParams.get('vitals');
      if (v === '1') {
        localStorage.setItem('web-vitals-overlay', 'true');
      } else if (v === '0') {
        localStorage.setItem('web-vitals-overlay', 'false');
      }
    } catch {
      // Ignore malformed URL in non-browser environments
    }

    // Only enable in development or when explicitly enabled
    const isDev = process.env.NODE_ENV === 'development';
    const enableOverlay = localStorage.getItem('web-vitals-overlay') === 'true';

    if (isDev || enableOverlay) {
      setShowDevOverlay(true);
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          reportVital('LCP', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        type PerfEventTiming = PerformanceEntry & { processingStart?: number; startTime: number };
        entries.forEach((entry) => {
          const e = entry as PerfEventTiming;
          reportVital('FID', (e.processingStart || 0) - e.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const e = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
          if (!e.hadRecentInput && typeof e.value === 'number') {
            clsValue += e.value;
            reportVital('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      const ttfbObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        type PerfNavTiming = PerformanceEntry & { responseStart: number };
        entries.forEach((entry) => {
          const e = entry as PerfNavTiming;
          reportVital('TTFB', e.responseStart || 0);
        });
      });
      ttfbObserver.observe({ entryTypes: ['navigation'] });

      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          reportVital('FCP', entry.startTime);
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        ttfbObserver.disconnect();
        fcpObserver.disconnect();
      };
    }
  }, [reportVital]);

  if (!showDevOverlay) {
    return null;
  }

  return (
    <div className="web-vitals-overlay">
      <div className="vitals-header">
        <h4>📊 Web Vitals</h4>
        <button onClick={() => setShowDevOverlay(false)} className="close-button">
          ✕
        </button>
      </div>
      <div className="vitals-grid">
        {Object.entries(vitals).map(([key, vital]) => (
          <div key={key} className={`vital-card vital-${vital.rating}`}>
            <div className="vital-name">{vital.name}</div>
            <div className="vital-value">
              {vital.name === 'CLS' ? vital.value.toFixed(3) : `${vital.value}ms`}
            </div>
            <div className="vital-rating">{vital.rating}</div>
          </div>
        ))}
      </div>
      <div className="vitals-actions">
        <button onClick={() => window.location.reload()} className="refresh-button">
          🔄 Refresh
        </button>
        <button
          onClick={() => {
            localStorage.setItem('web-vitals-overlay', 'false');
            setShowDevOverlay(false);
          }}
          className="disable-button"
        >
          Hide Overlay
        </button>
      </div>
      <style>{`
        .web-vitals-overlay {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 16px;
          border-radius: 12px;
          font-family: monospace;
          font-size: 12px;
          z-index: 10000;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          min-width: 200px;
        }

        .vitals-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 8px;
        }

        .vitals-header h4 {
          margin: 0;
          font-size: 14px;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 12px;
          opacity: 0.7;
        }

        .close-button:hover {
          opacity: 1;
        }

        .vitals-grid {
          display: grid;
          gap: 8px;
          margin-bottom: 12px;
        }

        .vital-card {
          padding: 8px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .vital-good {
          background: rgba(76, 175, 80, 0.2);
          border-left: 3px solid #4caf50;
        }

        .vital-needs-improvement {
          background: rgba(255, 193, 7, 0.2);
          border-left: 3px solid #ffc107;
        }

        .vital-poor {
          background: rgba(244, 67, 54, 0.2);
          border-left: 3px solid #f44336;
        }

        .vital-name {
          font-weight: bold;
          font-size: 11px;
        }

        .vital-value {
          font-weight: normal;
          font-size: 11px;
        }

        .vital-rating {
          font-size: 10px;
          opacity: 0.8;
        }

        .vitals-actions {
          display: flex;
          gap: 8px;
        }

        .refresh-button,
        .disable-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          flex: 1;
        }

        .refresh-button:hover,
        .disable-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .web-vitals-overlay {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default WebVitalsReporter;
