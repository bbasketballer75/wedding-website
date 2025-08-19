'use client';

/**
 * 🔧 Error Boundary Component
 * 
 * Advanced error handling with recovery options:
 * - Graceful error recovery
 * - Error reporting to analytics
 * - User-friendly error messages
 * - Development debugging tools
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (_error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36) + Math.random().toString(36).substring(2)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Report error to analytics
    this.reportError(error, errorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    // Report to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: {
          error_id: this.state.errorId,
          component_stack: errorInfo.componentStack
        }
      });
    }

    // Log to external error service (e.g., Sentry, LogRocket)
    console.error('Error Report:', errorReport);
    
    // Store in localStorage for debugging
    try {
      const errorHistory = JSON.parse(localStorage.getItem('error_history') || '[]');
      errorHistory.push(errorReport);
      // Keep only last 10 errors
      const recentErrors = errorHistory.slice(-10);
      localStorage.setItem('error_history', JSON.stringify(recentErrors));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReportBug = () => {
    const subject = encodeURIComponent(`Bug Report: ${this.state.error?.message || 'Unknown Error'}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error: ${this.state.error?.message}
URL: ${window.location.href}
Time: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}

Component Stack:
${this.state.errorInfo?.componentStack}

Error Stack:
${this.state.error?.stack}
    `);
    
    window.open(`mailto:developer@wedding-site.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
      <motion.div
            className="error-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
      <div className="error-icon">💔</div>
      <h1>Oops! Something went wrong</h1>
      <p className="error-message">
              We're sorry, but something unexpected happened. Don't worry - 
              our love story is still intact! 💕
            </p>
      <div className="error-actions">
      <button onClick={this.handleRetry} className="retry-button">
                🔄 Try Again
              </button>
      <button onClick={this.handleReload} className="reload-button">
                ↻ Reload Page
              </button>
      <button onClick={this.handleReportBug} className="report-button">
                🐛 Report Issue
              </button>
      </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
      <summary>🔍 Technical Details (Development)</summary>
      <div className="error-info">
      <h4>Error ID: {this.state.errorId}</h4>
      <h4>Error Message:</h4>
      <pre>{this.state.error?.message}</pre>
      <h4>Component Stack:</h4>
      <pre>{this.state.errorInfo?.componentStack}</pre>
      <h4>Error Stack:</h4>
      <pre>{this.state.error?.stack}</pre>
      </div>
      </details>
            )}

            <div className="error-suggestions">
      <h3>💡 What you can try:</h3>
      <ul>
      <li>🔄 Refresh the page</li>
      <li>🕐 Wait a moment and try again</li>
      <li>📱 Try a different device or browser</li>
      <li>📧 Contact us if the problem persists</li>
      </ul>
      </div>
      </motion.div>
      <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #f7f7f7 0%, #e8f2e8 100%);
              padding: 20px;
              font-family: 'Playfair Display', serif;
            }

            .error-container {
              max-width: 600px;
              text-align: center;
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }

            .error-icon {
              font-size: 4rem;
              margin-bottom: 20px;
            }

            h1 {
              color: #333;
              margin-bottom: 15px;
              font-size: 2rem;
              font-weight: 400;
            }

            .error-message {
              color: #666;
              font-size: 1.1rem;
              margin-bottom: 30px;
              line-height: 1.6;
            }

            .error-actions {
              display: flex;
              gap: 15px;
              justify-content: center;
              margin-bottom: 30px;
              flex-wrap: wrap;
            }

            .retry-button,
            .reload-button,
            .report-button {
              padding: 12px 24px;
              border: none;
              border-radius: 25px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
              transition: all 0.3s ease;
            }

            .retry-button {
              background: var(--sage-green);
              color: white;
            }

            .retry-button:hover {
              background: #8a9d7a;
              transform: translateY(-2px);
            }

            .reload-button {
              background: #f0f0f0;
              color: #333;
            }

            .reload-button:hover {
              background: #e0e0e0;
              transform: translateY(-2px);
            }

            .report-button {
              background: #ff6b6b;
              color: white;
            }

            .report-button:hover {
              background: #ff5252;
              transform: translateY(-2px);
            }

            .error-details {
              text-align: left;
              margin: 30px 0;
              padding: 20px;
              background: #f8f8f8;
              border-radius: 8px;
              border: 1px solid #e0e0e0;
            }

            .error-details summary {
              cursor: pointer;
              font-weight: bold;
              margin-bottom: 15px;
              color: #666;
            }

            .error-info {
              margin-top: 15px;
            }

            .error-info h4 {
              color: #333;
              margin: 15px 0 5px 0;
              font-size: 14px;
            }

            .error-info pre {
              background: #fff;
              padding: 10px;
              border-radius: 4px;
              border: 1px solid #ddd;
              overflow-x: auto;
              font-size: 11px;
              white-space: pre-wrap;
              word-break: break-word;
            }

            .error-suggestions {
              margin-top: 30px;
              padding: 20px;
              background: #e8f2e8;
              border-radius: 12px;
            }

            .error-suggestions h3 {
              color: #333;
              margin-bottom: 15px;
              font-size: 1.2rem;
            }

            .error-suggestions ul {
              text-align: left;
              list-style: none;
              padding: 0;
            }

            .error-suggestions li {
              padding: 5px 0;
              color: #555;
            }

            @media (max-width: 768px) {
              .error-container {
                padding: 30px 20px;
                margin: 10px;
              }

              .error-actions {
                flex-direction: column;
                align-items: center;
              }

              .retry-button,
              .reload-button,
              .report-button {
                width: 100%;
                max-width: 250px;
              }

              h1 {
                font-size: 1.5rem;
              }
            }
          `}</style>
      </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for handling async errors in functional components
 */
export const useErrorHandler = () => {
  const handleError = (error: Error) => {
    // In a real app, you might want to throw this to the nearest error boundary
    console.error('Async error caught:', error);
    
    // Report to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  };

  return { handleError };
};

export default ErrorBoundary;