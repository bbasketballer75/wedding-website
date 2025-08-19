'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import for the heavy GuestConnections component
const GuestConnectionsComponent = dynamic(
  () => import('./GuestConnectionsComponent'),
  {
    loading: () => (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontFamily: 'Georgia, serif'
      }}>
      <div className="loading-content" style={{ textAlign: 'center' }}>
      <div 
            className="loading-spinner" 
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #8b7a8a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          ></div>
      <p style={{ color: '#8b7a8a', margin: 0 }}>Loading Guest Connections...</p>
      </div>
      <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    ),
    ssr: false // This page has interactive features that need client-side
  }
);

export default function GuestConnectionsPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        Loading...
      </div>
    }>
      <GuestConnectionsComponent
      />
      </Suspense>
  );
}