import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../PostWeddingAnalytics.css';

/**
 * MetricCard Component
 * Displays a single metric with optional trend information
 */
const MetricCard = ({ title, value, subtitle, trend, color = 'blue' }) => (
  <div className={`metric-card ${color}`}>
    <div className="metric-header">
      <h3>{title}</h3>
      {trend && (
        <span className={`trend ${trend.direction}`}>
          {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
        </span>
      )}
    </div>
    <div className="metric-value">{value}</div>
    {subtitle && <div className="metric-subtitle">{subtitle}</div>}
  </div>
);

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.shape({
    direction: PropTypes.oneOf(['up', 'down']),
    value: PropTypes.string,
  }),
  color: PropTypes.string,
};

/**
 * PostWeddingAnalytics Component
 * Comprehensive analytics dashboard for post-wedding engagement
 */
const PostWeddingAnalytics = ({
  apiBaseUrl = '/api',
  refreshInterval = 30000, // 30 seconds
  adminAuth = null,
}) => {
  const [analyticsData, setAnalyticsData] = useState({
    visitors: { total: 0, unique: 0, returning: 0 },
    memories: { total: 0, pending: 0, approved: 0, featured: 0 },
    photos: { total: 0, tagged: 0, tags: 0 },
    guestbook: { entries: 0, approved: 0 },
    engagement: { avgSessionTime: 0, pageViews: 0, bounceRate: 0 },
    topPages: [],
    recentActivity: [],
    demographics: { devices: {}, browsers: {}, locations: {} },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Time range options
  const timeRanges = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: 'all', label: 'All Time' },
  ];

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);

      const headers = {};
      if (adminAuth) {
        headers.Authorization = `Bearer ${adminAuth}`;
      }

      const endpoints = [
        `${apiBaseUrl}/analytics/visitors?range=${selectedTimeRange}`,
        `${apiBaseUrl}/memories/stats`,
        `${apiBaseUrl}/analytics/photos?range=${selectedTimeRange}`,
        `${apiBaseUrl}/guestbook/stats`,
        `${apiBaseUrl}/analytics/engagement?range=${selectedTimeRange}`,
        `${apiBaseUrl}/analytics/pages?range=${selectedTimeRange}`,
        `${apiBaseUrl}/analytics/activity?range=${selectedTimeRange}&limit=10`,
        `${apiBaseUrl}/analytics/demographics?range=${selectedTimeRange}`,
      ];

      const responses = await Promise.all(
        endpoints.map((url) =>
          fetch(url, { headers }).then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
        )
      );

      // Process responses
      const [
        visitorsRes,
        memoriesRes,
        photosRes,
        guestbookRes,
        engagementRes,
        pagesRes,
        activityRes,
        demographicsRes,
      ] = responses;

      setAnalyticsData({
        visitors: visitorsRes.data || { total: 0, unique: 0, returning: 0 },
        memories: memoriesRes.data || { total: 0, pending: 0, approved: 0, featured: 0 },
        photos: photosRes.data || { total: 0, tagged: 0, tags: 0 },
        guestbook: guestbookRes.data || { entries: 0, approved: 0 },
        engagement: engagementRes.data || { avgSessionTime: 0, pageViews: 0, bounceRate: 0 },
        topPages: pagesRes.data?.pages || [],
        recentActivity: activityRes.data?.activities || [],
        demographics: demographicsRes.data || { devices: {}, browsers: {}, locations: {} },
      });

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [apiBaseUrl, selectedTimeRange, adminAuth]);

  // Initial load and periodic refresh
  useEffect(() => {
    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchAnalytics, refreshInterval]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    setLoading(true);
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  // Format duration in seconds to human readable
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${Math.round((value || 0) * 100)}%`;
  };

  if (loading && !analyticsData.visitors.total) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <h3>Unable to load analytics</h3>
        <p>{error}</p>
        <button onClick={fetchAnalytics} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="post-wedding-analytics">
      <div className="analytics-header">
        <div className="header-content">
          <h2>Wedding Website Analytics</h2>
          <p>Comprehensive insights into post-wedding engagement</p>
        </div>

        <div className="analytics-controls">
          <div className="time-range-selector">
            <label htmlFor="timeRange">Time Range:</label>
            <select
              id="timeRange"
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchAnalytics}
            className="refresh-button"
            disabled={loading}
            aria-label="Refresh analytics data"
          >
            🔄 {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {lastUpdated && (
        <div className="last-updated">Last updated: {lastUpdated.toLocaleString()}</div>
      )}

      {/* Key Metrics Overview */}
      <section className="metrics-overview">
        <h3>Key Metrics</h3>
        <div className="metrics-grid">
          <MetricCard
            title="Total Visitors"
            value={formatNumber(analyticsData.visitors.total)}
            subtitle={`${formatNumber(analyticsData.visitors.unique)} unique`}
            color="blue"
          />
          <MetricCard
            title="Guest Memories"
            value={formatNumber(analyticsData.memories.approved)}
            subtitle={`${analyticsData.memories.pending} pending approval`}
            color="green"
          />
          <MetricCard
            title="Photo Tags"
            value={formatNumber(analyticsData.photos.tags)}
            subtitle={`${analyticsData.photos.tagged} photos tagged`}
            color="purple"
          />
          <MetricCard
            title="Guestbook Entries"
            value={formatNumber(analyticsData.guestbook.approved)}
            subtitle={`${formatNumber(analyticsData.guestbook.entries)} total`}
            color="orange"
          />
        </div>
      </section>

      {/* Engagement Metrics */}
      <section className="engagement-section">
        <h3>Engagement Insights</h3>
        <div className="engagement-grid">
          <MetricCard
            title="Avg. Session Time"
            value={formatDuration(analyticsData.engagement.avgSessionTime)}
            color="teal"
          />
          <MetricCard
            title="Page Views"
            value={formatNumber(analyticsData.engagement.pageViews)}
            color="indigo"
          />
          <MetricCard
            title="Bounce Rate"
            value={formatPercentage(analyticsData.engagement.bounceRate)}
            color="red"
          />
        </div>
      </section>

      {/* Top Pages */}
      <section className="top-pages-section">
        <h3>Most Popular Pages</h3>
        <div className="top-pages-list">
          {analyticsData.topPages.length > 0 ? (
            analyticsData.topPages.map((page, index) => (
              <div key={page.path} className="page-item">
                <div className="page-rank">#{index + 1}</div>
                <div className="page-info">
                  <div className="page-path">{page.path}</div>
                  <div className="page-stats">
                    {formatNumber(page.views)} views •{formatDuration(page.avgTime)} avg. time
                  </div>
                </div>
                <div className="page-chart">
                  <div
                    className="page-bar"
                    style={{
                      width: `${(page.views / analyticsData.topPages[0]?.views || 1) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No page data available for selected time range</p>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-feed">
          {analyticsData.recentActivity.length > 0 ? (
            analyticsData.recentActivity.map((activity) => (
              <div
                key={`${activity.type}-${activity.timestamp}-${activity.description.slice(0, 20)}`}
                className="activity-item"
              >
                <div className="activity-icon">
                  {activity.type === 'memory' && '💭'}
                  {activity.type === 'tag' && '🏷️'}
                  {activity.type === 'guestbook' && '📝'}
                  {activity.type === 'visit' && '👁️'}
                </div>
                <div className="activity-content">
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-time">{activity.timestamp}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No recent activity</p>
          )}
        </div>
      </section>

      {/* Demographics */}
      <section className="demographics-section">
        <h3>Visitor Demographics</h3>
        <div className="demographics-grid">
          {/* Device Types */}
          <div className="demo-chart">
            <h4>Device Types</h4>
            <div className="chart-data">
              {Object.entries(analyticsData.demographics.devices).map(([device, count]) => (
                <div key={device} className="chart-item">
                  <span className="chart-label">{device}</span>
                  <span className="chart-value">{formatNumber(count)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Browsers */}
          <div className="demo-chart">
            <h4>Browsers</h4>
            <div className="chart-data">
              {Object.entries(analyticsData.demographics.browsers).map(([browser, count]) => (
                <div key={browser} className="chart-item">
                  <span className="chart-label">{browser}</span>
                  <span className="chart-value">{formatNumber(count)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="demo-chart">
            <h4>Top Locations</h4>
            <div className="chart-data">
              {Object.entries(analyticsData.demographics.locations).map(([location, count]) => (
                <div key={location} className="chart-item">
                  <span className="chart-label">{location}</span>
                  <span className="chart-value">{formatNumber(count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

PostWeddingAnalytics.propTypes = {
  apiBaseUrl: PropTypes.string,
  refreshInterval: PropTypes.number,
  adminAuth: PropTypes.string,
};

export default PostWeddingAnalytics;
