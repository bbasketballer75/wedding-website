'use client';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Enhanced error boundary with context
export class EnhancedErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error locally without Sentry
    console.error('Error in component:', this.props.componentName || 'Unknown', error, errorInfo);

    // Store error info for debugging
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-card">
            <h2>🌸 Oops! Something went wrong</h2>
            <p>We're sorry, but there was an issue loading this part of our wedding website.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
            <p className="error-help-text">
              If this problem persists, please let Austin & Jordyn know!
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

EnhancedErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  componentName: PropTypes.string,
};

EnhancedErrorBoundary.defaultProps = {
  componentName: 'Unknown',
};
