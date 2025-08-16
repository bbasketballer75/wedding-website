/**
 * 🎯 Centralized App Providers
 *
 * Combines all providers with performance optimization:
 * - Performance monitoring at the root level
 * - Real-time collaboration features
 * - Error boundaries with recovery
 * - Progressive loading strategies
 */

'use client';

import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion } from 'framer-motion';

// Lazy load providers for optimal performance
const AdvancedPerformanceManager = lazy(() =>
  import('../performance/AdvancedPerformanceManager')
);

const CollaborationProvider = lazy(() =>
  import('../social/RealTimeCollaboration').then(module => ({
    default: module.CollaborationProvider
  }))
);

// Error fallback component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => (
  <div className="error-fallback">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="error-content"
    >
      <h2>Oops! Something went wrong</h2>
      <p>We apologize for the inconvenience. Please try refreshing the page.</p>
      <button
        onClick={resetErrorBoundary}
        className="retry-button"
      >
        Try Again
      </button>
      {process.env.NODE_ENV === 'development' && (
        <details className="error-details">
          <summary>Error Details (Development)</summary>
          <pre>{error.message}</pre>
        </details>
      )}
    </motion.div>

    <style jsx>{`
      .error-fallback {
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: linear-gradient(135deg, #ff6b6b, #feca57);
      }

      .error-content {
        background: rgba(255, 255, 255, 0.95);
        padding: 40px;
        border-radius: 16px;
        text-align: center;
        max-width: 500px;
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      .retry-button {
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
        transition: all 0.3s ease;
      }

      .retry-button:hover {
        background: #ff5252;
        transform: translateY(-2px);
      }

      .error-details {
        margin-top: 20px;
        text-align: left;
      }

      .error-details pre {
        background: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;
        overflow-x: auto;
      }
    `}</style>
  </div>
);

// Loading component for provider suspense
const ProviderLoadingFallback: React.FC = () => (
  <div className="provider-loading">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="loading-spinner"
    >
      ✨
    </motion.div>
    <p>Initializing magical features...</p>

    <style jsx>{`
      .provider-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        gap: 16px;
      }

      .loading-spinner {
        font-size: 24px;
      }

      p {
        color: #666;
        font-style: italic;
      }
    `}</style>
  </div>
);

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log to performance monitoring
        console.error('App Provider Error:', error, errorInfo);

        // In production, you could send this to Sentry or other monitoring
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exception', {
            description: error.message,
            fatal: false
          });
        }
      }}
      onReset={() => {
        // Clear any cached data that might be causing issues
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }}
    >
      <Suspense fallback={<ProviderLoadingFallback />}>
        <AdvancedPerformanceManager>
          <Suspense fallback={<ProviderLoadingFallback />}>
            <CollaborationProvider>
              {children}
            </CollaborationProvider>
          </Suspense>
        </AdvancedPerformanceManager>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppProviders;
