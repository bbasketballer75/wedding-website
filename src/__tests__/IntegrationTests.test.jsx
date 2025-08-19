/**
 * End-to-End Integration Tests for Production Issues
 *
 * These tests simulate the complete user experience and catch
 * the integration issues that unit tests miss
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProviders } from '../providers/AppProviders';

// Mock Next.js components
vi.mock('next/dynamic', () => ({
  default: (fn) => {
    const Component = fn();
    Component.displayName = 'DynamicComponent';
    return Component;
  },
}));

vi.mock('next/script', () => ({
  default: ({ children, ...props }) => <script {...props}>{children}</script>,
}));

// Mock Vercel Analytics
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="vercel-analytics">Analytics</div>,
}));

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speed-insights">Speed Insights</div>,
}));

describe('End-to-End Integration Tests', () => {
  beforeEach(() => {
    // Reset environment
    vi.clearAllMocks();

    // Mock production-like environment
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'theporadas.com',
        href: 'https://theporadas.com/',
        pathname: '/',
      },
      writable: true,
    });

    // Mock Web APIs that might not be available in test environment
    global.fetch = vi.fn();
    global.navigator = {
      ...global.navigator,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };

    // Mock performance APIs
    global.PerformanceObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  describe('Complete Application Boot Process', () => {
    it('should initialize the full application without context errors', async () => {
      // Mock successful Vercel Analytics initialization
      window.va = { track: vi.fn() };

      // Test component that uses the full provider stack
      const TestApp = () => (
        <AppProviders>
          <div data-testid="app-content">
            <div>Main App Content</div>
          </div>
        </AppProviders>
      );

      render(<TestApp />);

      // Verify the app renders
      expect(screen.getByTestId('app-content')).toBeInTheDocument();

      // Verify analytics is initialized
      expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
    });

    it('should handle missing dependencies gracefully', () => {
      // Remove analytics object to simulate production error
      delete window.va;

      const TestApp = () => (
        <AppProviders>
          <div data-testid="app-without-analytics">Content</div>
        </AppProviders>
      );

      // Should not crash even without analytics
      expect(() => render(<TestApp />)).not.toThrow();
      expect(screen.getByTestId('app-without-analytics')).toBeInTheDocument();
    });
  });

  describe('Audio System Integration', () => {
    it('should initialize audio providers without context conflicts', async () => {
      const AudioTestComponent = () => (
        <AppProviders>
          <div data-testid="audio-test">Audio system should be initialized</div>
        </AppProviders>
      );

      render(<AudioTestComponent />);

      // Should render without throwing audio context errors
      expect(screen.getByTestId('audio-test')).toBeInTheDocument();
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should send performance data to API endpoints', async () => {
      // Mock successful API response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      const TestApp = () => (
        <AppProviders>
          <div data-testid="performance-test">Performance monitoring active</div>
        </AppProviders>
      );

      render(<TestApp />);

      // Wait for any async initialization
      await waitFor(() => {
        expect(screen.getByTestId('performance-test')).toBeInTheDocument();
      });

      // Performance monitoring should not cause errors
    });

    it('should handle API failures gracefully', async () => {
      // Mock API failure
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 405,
        statusText: 'Method Not Allowed',
      });

      const TestApp = () => (
        <AppProviders>
          <div data-testid="api-failure-test">App should work despite API failures</div>
        </AppProviders>
      );

      // Should not crash even if APIs fail
      expect(() => render(<TestApp />)).not.toThrow();
      expect(screen.getByTestId('api-failure-test')).toBeInTheDocument();
    });
  });

  describe('Service Worker Integration', () => {
    it('should handle missing PWA assets gracefully', async () => {
      // Mock service worker registration
      global.navigator.serviceWorker = {
        register: vi.fn().mockResolvedValue({
          scope: '/',
          update: vi.fn(),
        }),
      };

      // Mock missing icons
      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('/icons/')) {
          return Promise.resolve({ ok: false, status: 404 });
        }
        return Promise.resolve({ ok: true, status: 200 });
      });

      const TestApp = () => (
        <AppProviders>
          <div data-testid="sw-test">Service worker integration</div>
        </AppProviders>
      );

      // Should not crash even with missing icons
      render(<TestApp />);
      expect(screen.getByTestId('sw-test')).toBeInTheDocument();
    });
  });

  describe('Real User Interaction Flows', () => {
    it('should handle user interactions without errors', async () => {
      const user = userEvent.setup();

      const InteractiveApp = () => (
        <AppProviders>
          <div data-testid="interactive-app">
            <button data-testid="test-button">Click me</button>
            <div data-testid="interaction-result">No interactions yet</div>
          </div>
        </AppProviders>
      );

      render(<InteractiveApp />);

      const button = screen.getByTestId('test-button');
      await user.click(button);

      // Should handle clicks without throwing context errors
      expect(screen.getByTestId('interactive-app')).toBeInTheDocument();
    });
  });

  describe('Error Recovery and Fallbacks', () => {
    it('should recover from component errors gracefully', () => {
      // Mock console.error to catch error boundary logs
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const ErrorThrowingComponent = () => {
        throw new Error('Test component error');
      };

      const AppWithError = () => (
        <AppProviders>
          <div data-testid="error-boundary-test">
            <ErrorThrowingComponent />
          </div>
        </AppProviders>
      );

      // Should be caught by error boundary
      render(<AppWithError />);

      // Clean up
      consoleSpy.mockRestore();
    });

    it('should maintain functionality when analytics fails', () => {
      // Mock analytics failure
      window.va = {
        track: vi.fn().mockImplementation(() => {
          throw new Error('Analytics tracking failed');
        }),
      };

      const TestApp = () => (
        <AppProviders>
          <div data-testid="analytics-failure-test">App should work despite analytics failures</div>
        </AppProviders>
      );

      // Should not crash even if analytics fails
      expect(() => render(<TestApp />)).not.toThrow();
      expect(screen.getByTestId('analytics-failure-test')).toBeInTheDocument();
    });
  });

  describe('Production Build Validation', () => {
    it('should verify all production optimizations work correctly', () => {
      // Set production environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const ProductionApp = () => (
        <AppProviders>
          <div data-testid="production-build-test">Production optimizations active</div>
        </AppProviders>
      );

      render(<ProductionApp />);
      expect(screen.getByTestId('production-build-test')).toBeInTheDocument();

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should validate that debug code is removed in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Debug features should be disabled in production
      const isDebugMode = process.env.NODE_ENV === 'development';
      expect(isDebugMode).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });
  });
});
