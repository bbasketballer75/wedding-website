'use client';

import { useEffect, useState } from 'react';
import AnniversaryManager from '../../utils/features/AnniversaryManager';

interface Milestone {
  name: string;
  date: string;
  daysUntil: number;
  percentage?: number;
  year?: number;
  type?: string;
}

interface AnniversaryData {
  nextMilestone: Milestone;
  upcomingMilestones: Milestone[];
  inspirationalQuote: string;
  daysSinceWedding: number;
  monthsMarried?: number;
  yearsMarried?: number;
}

/**
 * 🎊 Anniversary Page
 * Displays anniversary milestones, countdowns, and celebration content
 */
export default function AnniversaryPage() {
  const [anniversaryData, setAnniversaryData] = useState<AnniversaryData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnniversaryData();
  }, []);

  const loadAnniversaryData = async () => {
    try {
      setLoading(true);

      // Fetch from API
      const response = await fetch('/api/anniversaries/milestones');

      if (!response.ok) {
        throw new Error('Failed to load anniversary data');
      }

      const result = await response.json();
      setAnniversaryData(result.data);
      setMilestones(result.data.upcomingMilestones);

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback to local calculation
      const manager = new AnniversaryManager();
      const localData = manager.generateAnniversaryContent();
      if (localData) {
        setAnniversaryData({
          nextMilestone: localData.milestone,
          upcomingMilestones: [localData.milestone],
          inspirationalQuote: 'Every love story is beautiful, but ours is my favorite.',
          daysSinceWedding: Math.floor(
            (new Date().getTime() - new Date('2025-06-14').getTime()) / (1000 * 60 * 60 * 24)
          ),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="anniversary-loading">
        <div className="loading-spinner"></div>
        <p>Loading anniversary celebrations...</p>
      </div>
    );
  }

  if (error && !anniversaryData) {
    return (
      <div className="anniversary-error">
        <h2>Unable to load anniversary data</h2>
        <p>{error}</p>
        <button onClick={loadAnniversaryData}>Try Again</button>
      </div>
    );
  }

  const nextMilestone = anniversaryData?.nextMilestone;

  return (
    <div className="anniversary-page">
      <style>{`
        .anniversary-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #f8f6f8 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .anniversary-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 16px;
          color: white;
        }

        .anniversary-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .anniversary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.9);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          color: #2d3748;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #8b7a8a;
        }

        .stat-label {
          color: #666;
          margin-top: 0.5rem;
        }

        .countdown-section {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(139, 122, 138, 0.1);
          margin-bottom: 3rem;
        }

        .countdown-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .countdown-header h2 {
          color: #8b7a8a;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .countdown-display {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin: 2rem 0;
        }

        .countdown-number {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          box-shadow: 0 4px 20px rgba(139, 122, 138, 0.3);
        }

        .countdown-label {
          font-size: 0.9rem;
          margin-top: 0.5rem;
          opacity: 0.9;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          margin: 1rem 0;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 6px;
          transition: width 0.5s ease;
        }

        .quote-section {
          text-align: center;
          margin: 2rem 0;
          padding: 2rem;
          background: #f7fafc;
          border-radius: 12px;
          border-left: 4px solid #d4a574;
        }

        .quote-text {
          font-style: italic;
          font-size: 1.2rem;
          color: #4a5568;
          margin-bottom: 1rem;
        }

        .milestones-section {
          margin-top: 3rem;
        }

        .milestones-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .milestones-header h2 {
          color: #8b7a8a;
          font-size: 1.8rem;
        }

        .milestones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .milestone-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #d4a574;
          transition: transform 0.3s;
        }

        .milestone-card:hover {
          transform: translateY(-4px);
        }

        .milestone-card.next {
          border-left-color: #8b7a8a;
          background: linear-gradient(135deg, #f8f6f8, #ffffff);
        }

        .milestone-title {
          color: #8b7a8a;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .milestone-countdown {
          font-size: 2rem;
          font-weight: bold;
          color: #d4a574;
          margin-bottom: 0.5rem;
        }

        .milestone-date {
          color: #666;
          margin-bottom: 1rem;
        }

        .milestone-percentage {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .milestone-percentage-fill {
          height: 100%;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .share-section {
          text-align: center;
          margin-top: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 16px;
          color: white;
        }

        .share-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .share-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .share-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .anniversary-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: #8b7a8a;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #8b7a8a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .anniversary-error {
          text-align: center;
          padding: 3rem;
          color: #e53e3e;
        }

        .anniversary-error button {
          background: #8b7a8a;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .anniversary-page {
            padding: 1rem;
          }

          .anniversary-header h1 {
            font-size: 2rem;
          }

          .countdown-display {
            flex-direction: column;
            gap: 1rem;
          }

          .countdown-number {
            width: 100px;
            height: 100px;
            font-size: 1.5rem;
          }

          .anniversary-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .milestones-grid {
            grid-template-columns: 1fr;
          }

          .share-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      <div className="anniversary-header">
        <h1>🎊 Our Anniversary Journey</h1>
        <p>Celebrating the beautiful milestones of Austin & Jordyn</p>

        {anniversaryData && (
          <div className="anniversary-stats">
            <div className="stat-card">
              <div className="stat-number">{anniversaryData.daysSinceWedding}</div>
              <div className="stat-label">Days Together</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {anniversaryData.monthsMarried || Math.floor(anniversaryData.daysSinceWedding / 30)}
              </div>
              <div className="stat-label">Months Married</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {anniversaryData.yearsMarried || Math.floor(anniversaryData.daysSinceWedding / 365)}
              </div>
              <div className="stat-label">Years Together</div>
            </div>
          </div>
        )}
      </div>

      {nextMilestone && (
        <div className="countdown-section">
          <div className="countdown-header">
            <h2>Next Milestone: {nextMilestone.name}</h2>
            <p>Coming up on {new Date(nextMilestone.date).toLocaleDateString()}</p>
          </div>

          <div className="countdown-display">
            <div className="countdown-number">
              <div>{nextMilestone.daysUntil}</div>
              <div className="countdown-label">Days</div>
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${nextMilestone.percentage || 0}%` }}
            ></div>
          </div>

          <p style={{ textAlign: 'center', color: '#666', marginTop: '1rem' }}>
            {nextMilestone.percentage
              ? `${Math.round(nextMilestone.percentage)}% complete`
              : 'Progress tracking'}
          </p>
        </div>
      )}

      {anniversaryData?.inspirationalQuote && (
        <div className="quote-section">
          <div className="quote-text">&ldquo;{anniversaryData.inspirationalQuote}&rdquo;</div>
          <div style={{ color: '#8B7A8A', fontWeight: 'bold' }}>💕 Austin & Jordyn</div>
        </div>
      )}

      {milestones.length > 0 && (
        <div className="milestones-section">
          <div className="milestones-header">
            <h2>Upcoming Milestones</h2>
            <p>Special moments to look forward to</p>
          </div>

          <div className="milestones-grid">
            {milestones.slice(0, 6).map((milestone, index) => (
              <div
                key={`${milestone.name}-${milestone.daysUntil}`}
                className={`milestone-card ${index === 0 ? 'next' : ''}`}
              >
                <div className="milestone-title">{milestone.name}</div>
                <div className="milestone-countdown">{milestone.daysUntil} days</div>
                <div className="milestone-date">
                  {new Date(milestone.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="milestone-percentage">
                  <div
                    className="milestone-percentage-fill"
                    style={{ width: `${milestone.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="share-section">
        <h3>Share Our Anniversary Journey</h3>
        <p>Help us celebrate these special moments!</p>
        <div className="share-buttons">
          <a
            href={`https://twitter.com/intent/tweet?text=Austin & Jordyn are ${anniversaryData?.daysSinceWedding || 0} days into their beautiful marriage journey! 💕 %23ThePoradas&url=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn"
          >
            🐦 Share on Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn"
          >
            📘 Share on Facebook
          </a>
          <button
            className="share-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Austin & Jordyn Anniversary Journey',
                  text: `Austin & Jordyn are ${anniversaryData?.daysSinceWedding || 0} days into their beautiful marriage!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
          >
            📋 Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
