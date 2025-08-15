const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-message">{message}</p>
      </div>
      <style>{`
        .loading-screen {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          padding: 2rem;
          text-align: center;
        }

        .loading-content {
          max-width: 400px;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .spinner-ring {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 5px;
        }

        .spinner-ring:nth-child(2) {
          animation-delay: 0.1s;
        }

        .spinner-ring:nth-child(3) {
          animation-delay: 0.2s;
        }

        .loading-message {
          color: #4a5568;
          font-size: 1.1rem;
          font-weight: 500;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .spinner-ring {
            animation: none;
            border-top-color: #667eea;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
