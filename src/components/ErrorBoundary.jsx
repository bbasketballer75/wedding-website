import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log to monitoring service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          errorBoundary: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      // Redirect to home page after 3 retries
      window.location.href = '/';
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-sage-100 to-dusty-rose-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-2xl font-serif text-gray-800 mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error while loading this page. Don't worry, your data
                is safe!
              </p>
            </div>

            <div className="space-y-4">
              {this.state.retryCount < 3 ? (
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-sage-600 text-white py-2 px-4 rounded-lg hover:bg-sage-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again ({3 - this.state.retryCount} attempts left)
                </button>
              ) : (
                <p className="text-sm text-gray-500 mb-4">Maximum retry attempts reached</p>
              )}

              <button
                onClick={this.handleGoHome}
                className="w-full bg-dusty-rose-600 text-white py-2 px-4 rounded-lg hover:bg-dusty-rose-700 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go to Home Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// PropTypes for validation
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
