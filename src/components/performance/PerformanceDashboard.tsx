'use client';

import { useEffect, useState } from 'react';
import { useWebVitals } from './WebVitalsMonitor';

/**
 * 📊 Performance Dashboard
 * Real-time Core Web Vitals monitoring and analytics
 */

interface PerformanceSummary {
  totalSessions: number;
  totalMetrics: number;
  poorPerformance: number;
  averageLCP: number;
  averageFCP: number;
}

interface PerformanceAnalytics {
  success: boolean;
  timeframe: string;
  summary: PerformanceSummary;
}

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FCP: { good: 1800, poor: 3000 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
};

export default function PerformanceDashboard() {
  const { getMetrics, getMetricsByRating } = useWebVitals();
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('24h');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/performance?timeframe=${timeframe}`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.warn('Failed to fetch performance analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/performance?timeframe=${timeframe}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.warn('Failed to fetch performance analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentMetrics = getMetrics();
  const poorMetrics = getMetricsByRating('poor');
  const needsImprovementMetrics = getMetricsByRating('needs-improvement');

  const getMetricStatus = (metricName: string, value: number) => {
    const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#22c55e';
      case 'needs-improvement':
        return '#f59e0b';
      case 'poor':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatMetricValue = (name: string, value: number) => {
    if (name === 'CLS') return (value / 1000).toFixed(3);
    return `${Math.round(value)}ms`;
  };

  if (!analytics && isLoading) {
    return (
      <div className="performance-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className="performance-dashboard">
      <style>{`
        .performance-dashboard {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin: 2rem 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', roboto, sans-serif;
        }

        .performance-dashboard.loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #6b7280;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #8b7a8a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid #f3f4f6;
          padding-bottom: 1rem;
        }

        .dashboard-title {
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timeframe-selector {
          display: flex;
          gap: 0.5rem;
        }

        .timeframe-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .timeframe-btn.active {
          background: #8b7a8a;
          color: white;
          border-color: #8b7a8a;
        }

        .timeframe-btn:hover:not(.active) {
          background: #f9fafb;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: transform 0.2s;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .metric-card.good {
          border-color: #22c55e;
          background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
        }

        .metric-card.needs-improvement {
          border-color: #f59e0b;
          background: linear-gradient(135deg, #fffbeb, #fefce8);
        }

        .metric-card.poor {
          border-color: #ef4444;
          background: linear-gradient(135deg, #fef2f2, #fef7f7);
        }

        .metric-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .analytics-summary {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .summary-item {
          text-align: center;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .summary-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .current-metrics {
          margin-top: 2rem;
        }

        .section-title {
          color: #374151;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .metrics-list {
          display: grid;
          gap: 0.5rem;
        }

        .metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #d1d5db;
        }

        .metric-item.good {
          border-left-color: #22c55e;
          background: #f0fdf4;
        }

        .metric-item.needs-improvement {
          border-left-color: #f59e0b;
          background: #fefce8;
        }

        .metric-item.poor {
          border-left-color: #ef4444;
          background: #fef2f2;
        }

        .metric-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .metric-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .refresh-btn {
          background: #8b7a8a;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .refresh-btn:hover {
          background: #7a6b7a;
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .performance-dashboard {
            padding: 1rem;
            margin: 1rem 0;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h2 className="dashboard-title">📊 Performance Dashboard</h2>
        <div className="dashboard-controls">
          <div className="timeframe-selector">
            {['1h', '24h', '7d'].map((period) => (
              <button
                key={period}
                className={`timeframe-btn ${timeframe === period ? 'active' : ''}`}
                onClick={() => setTimeframe(period)}
              >
                {period}
              </button>
            ))}
          </div>
          <button className="refresh-btn" onClick={handleRefresh} disabled={isLoading}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {analytics && (
        <div className="analytics-summary">
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>
            Analytics Summary ({analytics.timeframe})
          </h3>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-value">{analytics.summary.totalSessions}</div>
              <div className="summary-label">Sessions</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{analytics.summary.totalMetrics}</div>
              <div className="summary-label">Total Metrics</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{analytics.summary.poorPerformance}</div>
              <div className="summary-label">Poor Performance</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{analytics.summary.averageLCP}ms</div>
              <div className="summary-label">Avg LCP</div>
            </div>
          </div>
        </div>
      )}

      <div className="metrics-grid">
        {currentMetrics.slice(0, 6).map((metric) => {
          const status = getMetricStatus(metric.name, metric.value);
          return (
            <div key={`${metric.name}-${metric.id}`} className={`metric-card ${status}`}>
              <div className="metric-name">{metric.name}</div>
              <div className="metric-value" style={{ color: getStatusColor(status) }}>
                {formatMetricValue(metric.name, metric.value)}
              </div>
              <div className="metric-label">{status.replace('-', ' ')}</div>
            </div>
          );
        })}
      </div>

      {poorMetrics.length > 0 && (
        <div className="current-metrics">
          <h3 className="section-title">🚨 Poor Performance Metrics</h3>
          <div className="metrics-list">
            {poorMetrics.slice(0, 5).map((metric) => (
              <div key={`poor-${metric.name}-${metric.id}`} className="metric-item poor">
                <div className="metric-info">
                  <div
                    className="metric-status"
                    style={{ backgroundColor: getStatusColor('poor') }}
                  ></div>
                  <span>{metric.name}</span>
                </div>
                <span>{formatMetricValue(metric.name, metric.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {needsImprovementMetrics.length > 0 && (
        <div className="current-metrics">
          <h3 className="section-title">⚠️ Needs Improvement</h3>
          <div className="metrics-list">
            {needsImprovementMetrics.slice(0, 5).map((metric) => (
              <div
                key={`improvement-${metric.name}-${metric.id}`}
                className="metric-item needs-improvement"
              >
                <div className="metric-info">
                  <div
                    className="metric-status"
                    style={{ backgroundColor: getStatusColor('needs-improvement') }}
                  ></div>
                  <span>{metric.name}</span>
                </div>
                <span>{formatMetricValue(metric.name, metric.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="current-metrics">
        <h3 className="section-title">📈 Recent Metrics ({currentMetrics.length})</h3>
        <div className="metrics-list">
          {currentMetrics.slice(0, 10).map((metric) => {
            const status = getMetricStatus(metric.name, metric.value);
            return (
              <div key={`recent-${metric.name}-${metric.id}`} className={`metric-item ${status}`}>
                <div className="metric-info">
                  <div
                    className="metric-status"
                    style={{ backgroundColor: getStatusColor(status) }}
                  ></div>
                  <span>{metric.name}</span>
                </div>
                <span>{formatMetricValue(metric.name, metric.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
