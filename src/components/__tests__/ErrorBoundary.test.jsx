import { render, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../ErrorBoundary';

// Mock console.error to suppress expected error logs in tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

// Test component that throws an error
const ThrowError = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/i)).toBeInTheDocument();
  });

  it('shows retry button when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveTextContent('3 attempts left');
  });

  it('has proper accessibility features in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Check for accessible heading
    const heading = screen.getByRole('heading', { name: /something went wrong/i });
    expect(heading).toBeInTheDocument();

    // Check for retry button accessibility
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    // Check for home button accessibility
    const homeButton = screen.getByRole('button', { name: /go to home page/i });
    expect(homeButton).toBeInTheDocument();
  });

  it('provides error details when in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorDetails = screen.getByText('Error Details (Development)');
    expect(errorDetails).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('handles multiple error types gracefully', () => {
    const NetworkError = () => {
      throw new Error('Network error: Failed to fetch');
    };

    render(
      <ErrorBoundary>
        <NetworkError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('maintains error state between re-renders of same failing component', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Re-render with same failing component
    rerender(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Should still show error state
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('handles errors in event handlers correctly', () => {
    const EventHandlerError = () => {
      const handleClick = () => {
        throw new Error('Event handler error');
      };

      return <button onClick={handleClick}>Click me</button>;
    };

    render(
      <ErrorBoundary>
        <EventHandlerError />
      </ErrorBoundary>
    );

    // Should render normally (ErrorBoundary doesn't catch event handler errors)
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();

    // The error boundary won't catch this, but we can test the component renders
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });
});

ThrowError.propTypes = {
  shouldThrow: PropTypes.bool,
};
