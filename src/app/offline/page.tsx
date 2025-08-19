'use client';

/**
 * 📱 PWA Offline Page
 *
 * Beautiful offline experience when users are disconnected
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function OfflinePage() {
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryAttempts((prev) => prev + 1);

    try {
      // Test connection
      const response = await fetch('/', { method: 'HEAD' });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch {
      console.error('Still offline');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="offline-page">
      <div className="content">
        <motion.div
          className="icon-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="offline-icon">📵</div>
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          You're Offline
        </motion.h1>
        <motion.p
          className="subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Don't worry! Our wedding memories are still here.
        </motion.p>
        <motion.div
          className="message"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>While you're offline, you can still:</p>
          <ul>
            <li>🖼️ Browse cached photos</li>
            <li>📖 Read our love story</li>
            <li>🎵 Listen to downloaded music</li>
            <li>✏️ Write guestbook entries (they'll sync when you're back online)</li>
          </ul>
        </motion.div>
        <motion.div
          className="actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button onClick={handleRetry} disabled={isRetrying} className="retry-button">
            {isRetrying ? (
              <>
                <div className="spinner" />
                Checking Connection...
              </>
            ) : (
              <>
                🔄 Try Again
                {retryAttempts > 0 && ` (${retryAttempts})`}
              </>
            )}
          </button>
          <button onClick={handleGoBack} className="back-button">
            ← Go Back
          </button>
        </motion.div>
        <motion.div
          className="offline-features"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Offline Features Available:</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">🖼️</span>
              <h4>Photo Gallery</h4>
              <p>View previously loaded photos</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📚</span>
              <h4>Our Story</h4>
              <p>Read our love story and timeline</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎵</span>
              <h4>Music</h4>
              <p>Listen to cached wedding songs</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">✏️</span>
              <h4>Guestbook</h4>
              <p>Write messages (will sync later)</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="tips"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h4>💡 Tips while offline:</h4>
          <ul>
            <li>Your actions will be saved and synced when you reconnect</li>
            <li>Photos you've viewed before are still available</li>
            <li>The app will automatically retry connecting in the background</li>
          </ul>
        </motion.div>
      </div>
      <style>{`
        .offline-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f7f7f7 0%, #e8f2e8 100%);
          padding: 20px;
          font-family: 'Playfair Display', serif;
        }

        .content {
          max-width: 600px;
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .icon-container {
          margin-bottom: 20px;
        }

        .offline-icon {
          font-size: 4rem;
          margin-bottom: 10px;
        }

        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 2.5rem;
          font-weight: 400;
        }

        .subtitle {
          color: #666;
          font-size: 1.2rem;
          margin-bottom: 30px;
          font-style: italic;
        }

        .message {
          text-align: left;
          margin: 30px 0;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 12px;
          border-left: 4px solid var(--sage-green);
        }

        .message p {
          margin-bottom: 15px;
          color: #555;
        }

        .message ul {
          list-style: none;
          padding: 0;
        }

        .message li {
          padding: 8px 0;
          color: #555;
        }

        .actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 30px 0;
          flex-wrap: wrap;
        }

        .retry-button {
          background: var(--sage-green);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .retry-button:hover:not(:disabled) {
          background: #8a9d7a;
          transform: translateY(-2px);
        }

        .retry-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .back-button {
          background: #f0f0f0;
          color: #333;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .offline-features {
          margin: 40px 0;
        }

        .offline-features h3 {
          color: #333;
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .feature-card {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 10px;
        }

        .feature-card h4 {
          color: #333;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }

        .feature-card p {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .tips {
          margin-top: 30px;
          padding: 20px;
          background: #e8f2e8;
          border-radius: 12px;
        }

        .tips h4 {
          color: #333;
          margin-bottom: 15px;
          text-align: left;
        }

        .tips ul {
          text-align: left;
          list-style: none;
          padding: 0;
        }

        .tips li {
          padding: 5px 0;
          color: #555;
          font-size: 0.9rem;
        }

        .tips li:before {
          content: '✓ ';
          color: var(--sage-green);
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .content {
            padding: 30px 20px;
            margin: 10px;
          }

          h1 {
            font-size: 2rem;
          }

          .actions {
            flex-direction: column;
            align-items: center;
          }

          .retry-button,
          .back-button {
            width: 100%;
            max-width: 250px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
  `}</style>
    </div>
  );
}
