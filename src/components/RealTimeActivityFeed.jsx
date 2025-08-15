'use client';

/**
 * 🎉 REAL-TIME ACTIVITY FEED ✨
 * Shows live guest activities and creates excitement
 */

import { useEffect, useRef, useState } from 'react';
import { ConfettiCelebration } from '../utils/features/magicalInteractions.js';

const RealTimeActivityFeed = ({ className = '' }) => {
  const [activities, setActivities] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const feedRef = useRef(null);
  const wsRef = useRef(null);

  // Mock activities for demonstration (replace with real API)
  const mockActivities = [
    {
      id: 1,
      type: 'photo_upload',
      user: 'Sarah M.',
      action: 'uploaded a beautiful memory',
      timestamp: new Date(),
      icon: '📸',
    },
    {
      id: 2,
      type: 'guestbook',
      user: 'Mike & Jenny',
      action: 'signed the guestbook',
      timestamp: new Date(Date.now() - 60000),
      icon: '✍️',
    },
    {
      id: 3,
      type: 'viewing',
      user: '12 people',
      action: 'are viewing the album right now',
      timestamp: new Date(Date.now() - 120000),
      icon: '👀',
    },
    {
      id: 4,
      type: 'celebration',
      user: 'Emma L.',
      action: 'left a sweet message',
      timestamp: new Date(Date.now() - 180000),
      icon: '💕',
    },
  ];

  useEffect(() => {
    // Initialize with mock data
    setActivities(mockActivities);
    setOnlineCount(Math.floor(Math.random() * 20) + 5);

    // Simulate real-time updates
    const interval = setInterval(() => {
      addRandomActivity();
      updateOnlineCount();
    }, 15000); // New activity every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const addRandomActivity = () => {
    const names = [
      'Jessica K.',
      'David & Lisa',
      'The Johnson Family',
      'Maria S.',
      'Alex P.',
      'Grandma Rose',
      'The Smith Crew',
      'Tommy & Kate',
      'Uncle Bob',
      'Cousin Rachel',
      'Best Friend Amy',
      'Neighbor Joe',
    ];

    const actions = [
      { action: 'uploaded a stunning photo', icon: '📸', type: 'photo_upload' },
      { action: 'signed the guestbook', icon: '✍️', type: 'guestbook' },
      { action: 'shared a favorite memory', icon: '💭', type: 'memory' },
      { action: 'left a heartfelt message', icon: '💕', type: 'message' },
      { action: 'viewed the wedding album', icon: '👀', type: 'viewing' },
      { action: 'downloaded a photo', icon: '⬇️', type: 'download' },
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    const newActivity = {
      id: Date.now(),
      type: randomAction.type,
      user: randomName,
      action: randomAction.action,
      timestamp: new Date(),
      icon: randomAction.icon,
    };

    setActivities((prev) => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent

    // Trigger celebration for photo uploads
    if (randomAction.type === 'photo_upload') {
      ConfettiCelebration.trigger(feedRef.current, 15);
    }
  };

  const updateOnlineCount = () => {
    const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
    setOnlineCount((prev) => Math.max(1, prev + change));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const getActivityColor = (type) => {
    const colors = {
      photo_upload: '#4CAF50',
      guestbook: '#2196F3',
      viewing: '#FF9800',
      memory: '#9C27B0',
      message: '#E91E63',
      download: '#607D8B',
    };
    return colors[type] || '#8B9467';
  };

  return (
    <div className={`real-time-activity-feed ${className}`} ref={feedRef}>
      {/* Header with Online Counter */}
      <div className="activity-header">
        <div className="online-indicator">
          <div className="pulse-dot"></div>
          <span className="online-text">
            <span className="online-count heart-pulse">{onlineCount}</span> guests online
          </span>
        </div>
        <button
          className="toggle-feed btn-magical"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={isVisible ? 'Hide activity feed' : 'Show activity feed'}
        >
          {isVisible ? '🔼' : '🔽'} Live Activity
        </button>
      </div>

      {/* Activity Feed */}
      {isVisible && (
        <div className="activity-list fade-in-up">
          <div className="activity-title text-shimmer">✨ Latest Guest Activity</div>

          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`activity-item stagger-animation elegant-lift`}
              style={{
                '--delay': `${index * 0.1}s`,
                '--activity-color': getActivityColor(activity.type),
              }}
            >
              <div className="activity-icon sparkle">{activity.icon}</div>
              <div className="activity-content">
                <div className="activity-text">
                  <span className="activity-user">{activity.user}</span>{' '}
                  <span className="activity-action">{activity.action}</span>
                </div>
                <div className="activity-time">{formatTimeAgo(activity.timestamp)}</div>
              </div>
              <div className="activity-celebration">
                {activity.type === 'photo_upload' && <span className="celebration-icon">🎉</span>}
                {activity.type === 'guestbook' && <span className="celebration-icon">✨</span>}
              </div>
            </div>
          ))}

          {/* Encouragement Message */}
          <div className="encouragement-message fade-in-up">
            <div className="encouragement-text">
              🌟 Be part of the magic! Upload your photos and sign our guestbook! 🌟
            </div>
            <div className="action-buttons">
              <button className="btn-magical gradient-magic ripple">📸 Upload Photos</button>
              <button className="btn-magical gradient-magic ripple">✍️ Sign Guestbook</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Activity Notifications */}
      <div className="floating-notifications">
        {/* These will be populated by JavaScript for new activities */}
      </div>
    </div>
  );
};

export default RealTimeActivityFeed;
