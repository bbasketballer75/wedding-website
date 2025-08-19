'use client';

import { useEffect } from 'react';

// Type definitions
interface WeddingEvent {
  event: string;
  data: Record<string, unknown>;
  timestamp: number;
}

declare global {
  interface Window {
    weddingAnalytics?: WeddingAnalyticsManager;
  }
}

class WeddingAnalyticsManager {
  private readonly events: WeddingEvent[] = [];
  private readonly sessionStart: number;
  private readonly visitorId: string;

  constructor() {
    this.sessionStart = Date.now();
    this.visitorId = this.generateVisitorId();
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden', { duration: Date.now() - this.sessionStart });
      } else {
        this.trackEvent('page_visible', { timestamp: Date.now() });
      }
    });

    // Track scroll depth for engagement
    this.setupScrollTracking();

    // Track wedding-specific interactions
    this.setupWeddingInteractionTracking();
  }

  private generateVisitorId(): string {
    const stored = localStorage.getItem('wedding-visitor-id');
    if (stored) return stored;

    const id = 'visitor_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('wedding-visitor-id', id);
    return id;
  }

  private setupScrollTracking() {
    let maxScroll = 0;
    let scrollTimeout: number;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent;
          this.trackEvent('scroll_milestone', {
            percentage: scrollPercent,
            page: window.location.pathname,
          });
        }
      }, 100);
    });
  }

  private setupWeddingInteractionTracking() {
    // Track photo gallery interactions
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target || typeof target !== 'object' || !('closest' in target)) return;

      const element = target as {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        closest: (selector: string) => any;
        tagName?: string;
        textContent?: string;
        getAttribute?: (_name: string) => string | null;
      };

      // Photo clicks
      if (element.closest('[data-photo-id]')) {
        const photoElement = element.closest('[data-photo-id]');
        this.trackEvent('photo_view', {
          photoId: photoElement?.getAttribute('data-photo-id'),
          gallery: photoElement?.getAttribute('data-gallery') || 'unknown',
          position: photoElement?.getAttribute('data-position') || '0',
        });
      }

      // Guestbook interactions
      if (element.closest('[data-guestbook-action]')) {
        const action = element.closest('[data-guestbook-action]');
        this.trackEvent('guestbook_interaction', {
          action: action?.getAttribute('data-guestbook-action'),
          timestamp: Date.now(),
        });
      }

      // Navigation tracking
      if (element.closest('nav a') || element.tagName === 'A') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const link = element.closest('a') || (element.tagName === 'A' ? (element as any) : null);
        if (link?.getAttribute?.('href')) {
          this.trackEvent('navigation_click', {
            href: link.getAttribute('href'),
            text: link.textContent?.trim(),
            internal: link.getAttribute('href')?.includes(window.location.hostname),
          });
        }
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as { getAttribute?: (_name: string) => string | null } | null;
      if (form?.getAttribute) {
        this.trackEvent('form_submit', {
          formId: form.getAttribute('id') || 'unknown',
          action: form.getAttribute('action'),
          method: form.getAttribute('method'),
        });
      }
    });
  }

  public trackEvent(event: string, data: Record<string, unknown> = {}) {
    const eventData: WeddingEvent = {
      event,
      data: {
        ...data,
        visitorId: this.visitorId,
        sessionDuration: Date.now() - this.sessionStart,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    this.events.push(eventData);
    this.sendToAnalytics(eventData);

    // Also send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        custom_parameter_1: JSON.stringify(data),
        event_category: 'wedding_interaction',
        event_label: event,
      });
    }
  }

  private async sendToAnalytics(event: WeddingEvent) {
    try {
      // Send to your backend analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      // Fallback to localStorage for offline tracking
      console.warn('Analytics request failed, storing locally:', error);
      const stored = localStorage.getItem('wedding-analytics-queue') || '[]';
      const queue = JSON.parse(stored);
      queue.push(event);
      localStorage.setItem('wedding-analytics-queue', JSON.stringify(queue.slice(-100))); // Keep last 100 events
    }
  }

  public getSessionSummary() {
    return {
      visitorId: this.visitorId,
      sessionDuration: Date.now() - this.sessionStart,
      totalEvents: this.events.length,
      eventTypes: [...new Set(this.events.map((e) => e.event))],
      pagesViewed: [...new Set(this.events.map((e) => e.data.page))].length,
      engagementScore: this.calculateEngagementScore(),
    };
  }

  private calculateEngagementScore(): number {
    const sessionMinutes = (Date.now() - this.sessionStart) / 60000;
    const interactions = this.events.filter((e) =>
      ['photo_view', 'guestbook_interaction', 'scroll_milestone'].includes(e.event)
    ).length;

    return Math.min(Math.round((interactions / Math.max(sessionMinutes, 1)) * 10), 100);
  }
}

// Global analytics instance
let weddingAnalytics: WeddingAnalyticsManager;

export function WeddingAnalytics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !weddingAnalytics) {
      weddingAnalytics = new WeddingAnalyticsManager();
      window.weddingAnalytics = weddingAnalytics;

      // Track initial page load
      weddingAnalytics.trackEvent('page_load', {
        loadTime: performance.now(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      });

      // Track when user leaves
      window.addEventListener('beforeunload', () => {
        const summary = weddingAnalytics.getSessionSummary();
        weddingAnalytics.trackEvent('session_end', summary);
      });
    }
  }, []);

  return null; // This component doesn't render anything
}

export default WeddingAnalytics;

// Export the analytics instance for manual tracking
export function trackWeddingEvent(event: string, data: Record<string, unknown> = {}) {
  if (weddingAnalytics) {
    weddingAnalytics.trackEvent(event, data);
  }
}

// Export common wedding-specific tracking functions
export const weddingTracker = {
  photoView: (photoId: string, gallery: string) =>
    trackWeddingEvent('photo_view', { photoId, gallery }),

  guestbookSubmission: (messageLength: number) =>
    trackWeddingEvent('guestbook_submit', { messageLength }),

  guestbookView: () => trackWeddingEvent('guestbook_view', {}),

  albumView: (albumName: string) => trackWeddingEvent('album_view', { albumName }),

  musicPlay: (songTitle: string) => trackWeddingEvent('music_play', { songTitle }),

  videoPlay: (videoTitle: string, progress: number = 0) =>
    trackWeddingEvent('video_play', { videoTitle, progress }),

  shareAction: (type: 'facebook' | 'twitter' | 'email' | 'copy_link', content: string) =>
    trackWeddingEvent('share_action', { type, content }),

  downloadAction: (item: string, type: 'photo' | 'video' | 'document') =>
    trackWeddingEvent('download_action', { item, type }),
};
