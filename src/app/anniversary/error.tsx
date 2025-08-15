'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnniversaryError({ error, reset }: Readonly<ErrorProps>) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Anniversary page error:', error);
  }, [error]);

  return (
    <div className="anniversary-error">
      <div className="error-icon">💔</div>
      <h1 className="error-title">Anniversary Page Error</h1>
      <p className="error-message">
        We encountered an issue while loading your anniversary celebrations. This might be due to a
        temporary network issue or a problem with our servers.
      </p>

      <div className="error-actions">
        <button onClick={reset} className="error-button">
          🔄 Try Again
        </button>
        <Link href="/" className="error-button secondary">
          🏠 Go Home
        </Link>
        <Link href="/guestbook" className="error-button secondary">
          📝 Visit Guestbook
        </Link>
      </div>

      <details className="error-details">
        <summary>Technical Details</summary>
        <p>
          <strong>Error:</strong> {error.message}
        </p>
        {error.digest && (
          <p>
            <strong>Error ID:</strong> {error.digest}
          </p>
        )}
        <pre>{error.stack}</pre>
      </details>
    </div>
  );
}
