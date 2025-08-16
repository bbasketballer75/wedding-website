'use client';
import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <output className="loading-screen" aria-live="polite" aria-label={message}>
      <div className="loading-content">
        <div className="loading-spinner" aria-hidden="true">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </output>
  );
};

export default LoadingScreen;
