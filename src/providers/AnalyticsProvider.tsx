'use client';

/**
 * 📊 Advanced Analytics Provider
 *
 * Comprehensive analytics integration for production monitoring:
 * - Google Analytics 4
 * - Vercel Analytics
 * - Custom event tracking
 * - Performance insights
 * - User behavior analytics
 */

import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, unknown>;
}

interface AnalyticsContextType {
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (path: string, title?: string) => void;
  trackUserInteraction: (element: string, action: string) => void;
  trackWeddingAction: (action: string, details?: Record<string, unknown>) => void;
  trackPerformance: (metric: string, value: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Google Analytics 4 event tracking
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    const w = window as unknown as {
      gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
      va?: { track: (action: string, params?: Record<string, unknown>) => void };
    };
    if (typeof window !== 'undefined' && w.gtag) {
      w.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customParameters,
      });
    }

    // Also track with Vercel Analytics
    if (typeof window !== 'undefined' && w.va) {
      w.va.track(event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.customParameters,
      });
    }

    console.error('📊 Analytics Event:', event);
  }, []);

  // Page view tracking
  const trackPageView = useCallback((path: string, title?: string) => {
    const w = window as unknown as {
      gtag?: (command: string, id: string | undefined, params?: Record<string, unknown>) => void;
    };
    if (typeof window !== 'undefined' && w.gtag) {
      w.gtag('config', GA_TRACKING_ID, {
        page_path: path,
        page_title: title,
      });
    }
  }, []);

  // User interaction tracking
  const trackUserInteraction = useCallback(
    (element: string, action: string) => {
      trackEvent({
        action: 'user_interaction',
        category: 'engagement',
        label: `${element}_${action}`,
        customParameters: {
          element_type: element,
          interaction_type: action,
          timestamp: Date.now(),
        },
      });
    },
    [trackEvent]
  );

  // Wedding-specific actions
  const trackWeddingAction = useCallback(
    (action: string, details?: Record<string, unknown>) => {
      trackEvent({
        action: 'wedding_action',
        category: 'wedding',
        label: action,
        customParameters: {
          action_type: action,
          ...details,
          timestamp: Date.now(),
        },
      });
    },
    [trackEvent]
  );

  // Performance tracking
  const trackPerformance = useCallback(
    (metric: string, value: number) => {
      trackEvent({
        action: 'performance_metric',
        category: 'performance',
        label: metric,
        value: value,
        customParameters: {
          metric_name: metric,
          metric_value: value,
          user_agent: navigator.userAgent,
          timestamp: Date.now(),
        },
      });
    },
    [trackEvent]
  );

  // Initialize tracking on mount
  useEffect(() => {
    // Track initial page view
    trackPageView(window.location.pathname, document.title);

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScrollDepth && scrollPercent > 0) {
        maxScrollDepth = scrollPercent;

        // Track at 25%, 50%, 75%, and 100% scroll depths
        if (scrollPercent >= 25 && scrollPercent < 50 && maxScrollDepth < 25) {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: '25_percent',
            value: 25,
          });
        } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScrollDepth < 50) {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: '50_percent',
            value: 50,
          });
        } else if (scrollPercent >= 75 && scrollPercent < 100 && maxScrollDepth < 75) {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: '75_percent',
            value: 75,
          });
        } else if (scrollPercent >= 100 && maxScrollDepth < 100) {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: '100_percent',
            value: 100,
          });
        }
      }
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent({
        action: 'time_on_page',
        category: 'engagement',
        label: window.location.pathname,
        value: timeSpent,
      });
    };

    // Add event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', trackTimeOnPage);
    };
  }, [trackEvent, trackPageView]);

  const contextValue = useMemo(
    () => ({
      trackEvent,
      trackPageView,
      trackUserInteraction,
      trackWeddingAction,
      trackPerformance,
    }),
    [trackEvent, trackPageView, trackUserInteraction, trackWeddingAction, trackPerformance]
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {/* Google Analytics 4 */}
      {GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `}
          </Script>
        </>
      )}

      {/* Vercel Analytics */}
      <Analytics />

      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

export default AnalyticsProvider;
