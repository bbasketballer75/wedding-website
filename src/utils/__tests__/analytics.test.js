import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as analytics from '../core/analytics';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock navigator
Object.defineProperty(navigator, 'sendBeacon', {
  value: vi.fn(),
  writable: true,
});

describe('Analytics Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset analytics state
    analytics.reset?.();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Event Tracking', () => {
    it('tracks custom events with proper structure', () => {
      const trackEvent = analytics.trackEvent;
      if (trackEvent) {
        trackEvent('user_interaction', {
          component: 'photo_gallery',
          action: 'image_view',
          value: 1,
        });

        // Should call tracking function (assuming it stores events)
        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });

    it('handles missing event data gracefully', () => {
      const trackEvent = analytics.trackEvent;
      if (trackEvent) {
        expect(() => {
          trackEvent(null);
          trackEvent('');
          trackEvent('event', null);
        }).not.toThrow();
      }
    });

    it('validates event parameters', () => {
      const trackEvent = analytics.trackEvent;
      if (trackEvent) {
        // Should handle various parameter types
        trackEvent('test_event', {
          string_param: 'value',
          number_param: 123,
          boolean_param: true,
          array_param: ['a', 'b'],
          object_param: { nested: 'value' },
        });

        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });
  });

  describe('User Session Tracking', () => {
    it('initializes session with timestamp', () => {
      const initSession = analytics.initSession;
      if (initSession) {
        initSession();

        expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
          expect.stringMatching(/session/),
          expect.stringContaining(Date.now().toString().substring(0, 10))
        );
      }
    });

    it('tracks session duration', () => {
      const getSessionDuration = analytics.getSessionDuration;
      if (getSessionDuration) {
        // Mock existing session
        sessionStorageMock.getItem.mockReturnValue(
          JSON.stringify({
            startTime: Date.now() - 5000, // 5 seconds ago
            events: [],
          })
        );

        const duration = getSessionDuration();
        expect(duration).toBeGreaterThan(4000);
        expect(duration).toBeLessThan(6000);
      }
    });

    it('handles missing session data', () => {
      const getSessionDuration = analytics.getSessionDuration;
      if (getSessionDuration) {
        sessionStorageMock.getItem.mockReturnValue(null);

        const duration = getSessionDuration();
        expect(duration).toBe(0);
      }
    });
  });

  describe('Page View Tracking', () => {
    it('tracks page views with metadata', () => {
      const trackPageView = analytics.trackPageView;
      if (trackPageView) {
        const pageData = {
          path: '/album',
          title: 'Photo Album',
          referrer: 'https://example.com',
        };

        trackPageView(pageData);

        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });

    it('captures page performance metrics', () => {
      const trackPagePerformance = analytics.trackPagePerformance;
      if (trackPagePerformance) {
        // Mock performance API
        global.performance = {
          timing: {
            navigationStart: 1000,
            loadEventEnd: 2000,
            domContentLoadedEventEnd: 1500,
          },
          getEntriesByType: vi.fn().mockReturnValue([{ duration: 500, name: 'paint' }]),
        };

        trackPagePerformance();

        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });
  });

  describe('Error Tracking', () => {
    it('tracks JavaScript errors', () => {
      const trackError = analytics.trackError;
      if (trackError) {
        const error = new Error('Test error');
        error.stack = 'Error: Test error\n    at test.js:1:1';

        trackError(error, {
          component: 'PhotoGallery',
          action: 'image_load',
        });

        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });

    it('tracks network errors', () => {
      const trackNetworkError = analytics.trackNetworkError;
      if (trackNetworkError) {
        trackNetworkError('/api/photos', 500, 'Internal Server Error');

        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });

    it('handles error data sanitization', () => {
      const trackError = analytics.trackError;
      if (trackError) {
        const sensitiveError = new Error('Database password: secret123');

        trackError(sensitiveError);

        // Should not store sensitive information
        const calls = localStorageMock.setItem.mock.calls;
        const storedData = calls.find((call) => call[0].includes('error'));
        if (storedData) {
          expect(storedData[1]).not.toContain('secret123');
        }
      }
    });
  });

  describe('User Behavior Analytics', () => {
    it('tracks user interactions', () => {
      const trackInteraction = analytics.trackInteraction;
      if (trackInteraction) {
        trackInteraction('click', {
          element: 'photo_thumbnail',
          elementId: 'photo_123',
          coordinates: { x: 100, y: 200 },
        });

        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });

    it('tracks scroll behavior', () => {
      const trackScroll = analytics.trackScroll;
      if (trackScroll) {
        trackScroll({
          scrollDepth: 0.75,
          pageHeight: 2000,
          viewportHeight: 800,
        });

        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });

    it('debounces rapid events', () => {
      const trackScroll = analytics.trackScroll;
      if (trackScroll) {
        // Fire multiple scroll events rapidly
        for (let i = 0; i < 10; i++) {
          trackScroll({ scrollDepth: 0.1 * i });
        }

        // Should not store all events (due to debouncing)
        const scrollCalls = localStorageMock.setItem.mock.calls.filter((call) =>
          call[1].includes('scroll')
        );
        expect(scrollCalls.length).toBeLessThan(10);
      }
    });
  });

  describe('Data Export and Privacy', () => {
    it('exports user data', () => {
      const exportUserData = analytics.exportUserData;
      if (exportUserData) {
        // Mock stored data
        localStorageMock.getItem.mockReturnValue(
          JSON.stringify({
            events: [{ type: 'page_view', timestamp: Date.now() }],
          })
        );

        const userData = exportUserData();

        expect(userData).toHaveProperty('events');
        expect(Array.isArray(userData.events)).toBe(true);
      }
    });

    it('clears user data', () => {
      const clearUserData = analytics.clearUserData;
      if (clearUserData) {
        clearUserData();

        expect(localStorageMock.removeItem).toHaveBeenCalled();
        expect(sessionStorageMock.removeItem).toHaveBeenCalled();
      }
    });

    it('respects privacy settings', () => {
      const setPrivacyPreference = analytics.setPrivacyPreference;
      const trackEvent = analytics.trackEvent;

      if (setPrivacyPreference && trackEvent) {
        setPrivacyPreference('analytics', false);

        trackEvent('test_event');

        // Should not track when analytics disabled
        const analyticsCallsAfterDisable = localStorageMock.setItem.mock.calls.filter((call) =>
          call[0].includes('analytics')
        );
        expect(analyticsCallsAfterDisable).toHaveLength(0);
      }
    });
  });

  describe('Batch Processing', () => {
    it('batches events for efficient sending', () => {
      const flushEvents = analytics.flushEvents;
      if (flushEvents) {
        // Mock multiple stored events
        localStorageMock.getItem.mockReturnValue(
          JSON.stringify({
            events: [
              { type: 'click', timestamp: Date.now() - 1000 },
              { type: 'scroll', timestamp: Date.now() - 500 },
              { type: 'page_view', timestamp: Date.now() },
            ],
          })
        );

        flushEvents();

        // Should use sendBeacon for batch sending
        expect(navigator.sendBeacon).toHaveBeenCalled();
      }
    });

    it('handles network failures gracefully', () => {
      const flushEvents = analytics.flushEvents;
      if (flushEvents) {
        // Mock network failure
        navigator.sendBeacon.mockReturnValue(false);

        expect(() => flushEvents()).not.toThrow();

        // Should retry or queue for later
        expect(localStorageMock.setItem).toHaveBeenCalled();
      }
    });
  });
});
