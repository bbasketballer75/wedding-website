import { useEffect, useState } from 'react';

/**
 * 🤝 Guest Connection Portal Component
 * Facilitate ongoing connections between wedding guests
 */
const GuestConnectionPortal = () => {
  const [guestDirectory, setGuestDirectory] = useState([]);
  const [networkStats, setNetworkStats] = useState({
    totalConnections: 0,
    newConnections: 0,
    activeGroups: 0,
    upcomingEvents: 0,
  });
  const [activeTab, setActiveTab] = useState('directory');
  const [showConnectionForm, setShowConnectionForm] = useState(false);

  // Mock guest data - would come from wedding database
  const mockGuests = [
    {
      id: 'guest_1',
      name: 'Sarah Johnson',
      relationship: 'College Friend',
      location: 'Chicago, IL',
      interests: ['Photography', 'Travel', 'Cooking'],
      contactPreferences: ['email', 'social'],
      status: 'active',
      joinDate: '2025-07-01',
      mutualConnections: 3,
    },
    {
      id: 'guest_2',
      name: 'Mike Chen',
      relationship: 'Work Colleague',
      location: 'San Francisco, CA',
      interests: ['Tech', 'Hiking', 'Board Games'],
      contactPreferences: ['email'],
      status: 'active',
      joinDate: '2025-07-15',
      mutualConnections: 2,
    },
    {
      id: 'guest_3',
      name: 'Emily Davis',
      relationship: 'High School Friend',
      location: 'Austin, TX',
      interests: ['Music', 'Art', 'Yoga'],
      contactPreferences: ['social', 'phone'],
      status: 'active',
      joinDate: '2025-06-20',
      mutualConnections: 5,
    },
  ];

  const interestGroups = [
    {
      id: 'photography',
      name: '📸 Photography Enthusiasts',
      description: 'Share photos and photography tips',
      members: 8,
      recentActivity: '2 hours ago',
      isPublic: true,
    },
    {
      id: 'travel',
      name: '✈️ Travel Buddies',
      description: 'Plan trips and share travel experiences',
      members: 12,
      recentActivity: '1 day ago',
      isPublic: true,
    },
    {
      id: 'foodie',
      name: '🍽️ Foodie Friends',
      description: 'Restaurant recommendations and cooking tips',
      members: 15,
      recentActivity: '3 hours ago',
      isPublic: true,
    },
    {
      id: 'parents',
      name: '👶 New Parents Network',
      description: 'Support and advice for new and expecting parents',
      members: 6,
      recentActivity: '30 minutes ago',
      isPublic: false,
    },
  ];

  useEffect(() => {
    // Load guest directory and connection data
    setGuestDirectory(mockGuests);
    setNetworkStats({
      totalConnections: 42,
      newConnections: 7,
      activeGroups: 8,
      upcomingEvents: 3,
    });
  }, []);

  const handleConnectionRequest = (guestId) => {
    // In real app, would send connection request
  };

  const renderDashboard = () => (
    <div className="dashboard-section">
      <h2>🌐 Connection Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-content">
            <div className="stat-number">{networkStats.totalConnections}</div>
            <div className="stat-label">Total Connections</div>
          </div>
        </div>

        <div className="stat-card new">
          <div className="stat-icon">✨</div>
          <div className="stat-content">
            <div className="stat-number">{networkStats.newConnections}</div>
            <div className="stat-label">New This Month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{networkStats.activeGroups}</div>
            <div className="stat-label">Active Groups</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-number">{networkStats.upcomingEvents}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>🔄 Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🤝</div>
            <div className="activity-content">
              <strong>Sarah Johnson</strong> connected with <strong>Mike Chen</strong>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📸</div>
            <div className="activity-content">
              <strong>Photography Group</strong> shared new wedding photos
              <div className="activity-time">4 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✈️</div>
            <div className="activity-content">
              <strong>Travel Buddies</strong> planned a group trip to Italy
              <div className="activity-time">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDirectory = () => (
    <div className="directory-section">
      <div className="section-header">
        <h2>📋 Guest Directory</h2>
        <div className="directory-controls">
          <label htmlFor="guest-search" className="sr-only">
            Search guests by name
          </label>
          <input
            type="text"
            id="guest-search"
            placeholder="🔍 Search guests..."
            className="search-input"
            aria-label="Search guests by name"
          />
          <label htmlFor="guest-filter" className="sr-only">
            Filter guests by category
          </label>
          <select
            id="guest-filter"
            className="filter-select"
            aria-label="Filter guests by category"
          >
            <option value="all">All Guests</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="colleagues">Colleagues</option>
          </select>
        </div>
      </div>

      <div className="guest-grid">
        {guestDirectory.map((guest) => (
          <div key={guest.id} className="guest-card">
            <div className="guest-header">
              <div className="guest-avatar">
                {guest.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="guest-info">
                <h3>{guest.name}</h3>
                <div className="guest-relationship">{guest.relationship}</div>
                <div className="guest-location">📍 {guest.location}</div>
              </div>
            </div>

            <div className="guest-interests">
              <strong>Interests:</strong>
              <div className="interests-tags">
                {guest.interests.map((interest) => (
                  <span key={interest} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="guest-stats">
              <div className="stat">
                <span className="stat-value">{guest.mutualConnections}</span>
                <span className="stat-label">Mutual Connections</span>
              </div>
              <div className="stat">
                <span className="stat-value">{guest.status}</span>
                <span className="stat-label">Status</span>
              </div>
            </div>

            <div className="guest-actions">
              <button className="connect-btn" onClick={() => handleConnectionRequest(guest.id)}>
                🤝 Connect
              </button>
              <button className="message-btn">💬 Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGroups = () => (
    <div className="groups-section">
      <div className="section-header">
        <h2>👥 Interest Groups</h2>
        <button className="create-group-btn" onClick={() => setShowConnectionForm(true)}>
          ➕ Create Group
        </button>
      </div>

      <div className="groups-grid">
        {interestGroups.map((group) => (
          <div key={group.id} className="group-card">
            <div className="group-header">
              <h3>{group.name}</h3>
              <div className="group-privacy">{group.isPublic ? '🌐 Public' : '🔒 Private'}</div>
            </div>

            <p className="group-description">{group.description}</p>

            <div className="group-stats">
              <div className="group-members">
                <strong>{group.members}</strong> members
              </div>
              <div className="group-activity">Last active: {group.recentActivity}</div>
            </div>

            <div className="group-actions">
              <button className="join-btn">
                {group.isPublic ? 'Join Group' : 'Request to Join'}
              </button>
              <button className="view-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="events-section">
      <div className="section-header">
        <h2>📅 Upcoming Events</h2>
        <button className="create-event-btn">➕ Plan Event</button>
      </div>

      <div className="events-list">
        <div className="event-card upcoming">
          <div className="event-date">
            <div className="event-month">AUG</div>
            <div className="event-day">15</div>
          </div>
          <div className="event-content">
            <h3>🍽️ Foodie Friends Dinner</h3>
            <div className="event-details">
              <div className="event-location">📍 Chicago, IL</div>
              <div className="event-attendees">👥 8 attending</div>
            </div>
            <div className="event-organizer">Organized by Sarah Johnson</div>
          </div>
          <div className="event-actions">
            <button className="rsvp-btn">RSVP</button>
          </div>
        </div>

        <div className="event-card">
          <div className="event-date">
            <div className="event-month">SEP</div>
            <div className="event-day">22</div>
          </div>
          <div className="event-content">
            <h3>📸 Photography Workshop</h3>
            <div className="event-details">
              <div className="event-location">📍 San Francisco, CA</div>
              <div className="event-attendees">👥 12 interested</div>
            </div>
            <div className="event-organizer">Organized by Mike Chen</div>
          </div>
          <div className="event-actions">
            <button className="rsvp-btn">RSVP</button>
          </div>
        </div>

        <div className="event-card">
          <div className="event-date">
            <div className="event-month">OCT</div>
            <div className="event-day">10</div>
          </div>
          <div className="event-content">
            <h3>✈️ Italy Trip Planning</h3>
            <div className="event-details">
              <div className="event-location">📍 Virtual Meeting</div>
              <div className="event-attendees">👥 6 attending</div>
            </div>
            <div className="event-organizer">Organized by Travel Buddies Group</div>
          </div>
          <div className="event-actions">
            <button className="rsvp-btn">RSVP</button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: '🌐 Dashboard', component: renderDashboard },
    { id: 'directory', label: '📋 Directory', component: renderDirectory },
    { id: 'groups', label: '👥 Groups', component: renderGroups },
    { id: 'events', label: '📅 Events', component: renderEvents },
  ];

  return (
    <div className="guest-connection-portal">
      <style>{`
        .guest-connection-portal {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
        }

        .portal-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .portal-header h1 {
          color: #2d3748;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .portal-subtitle {
          color: #718096;
          font-size: 1.1rem;
        }

        .tab-navigation {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          border-bottom: 2px solid #e2e8f0;
          overflow-x: auto;
        }

        .tab-btn {
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          font-size: 0.95rem;
          color: #718096;
        }

        .tab-btn.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        }

        .tab-btn:hover {
          color: #4c51bf;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-card.new {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .stat-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 50%;
        }

        .stat-card.new .stat-icon {
          background: rgba(255, 255, 255, 0.2);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #2d3748;
        }

        .stat-card.new .stat-number {
          color: white;
        }

        .stat-label {
          color: #718096;
          font-size: 0.9rem;
        }

        .stat-card.new .stat-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .recent-activity {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .recent-activity h3 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
        }

        .activity-list {
          space-y: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .activity-item:hover {
          background: #f7fafc;
        }

        .activity-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
        }

        .activity-content {
          flex: 1;
        }

        .activity-time {
          color: #718096;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          color: #2d3748;
          margin: 0;
        }

        .directory-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-input,
        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .search-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .guest-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .guest-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
        }

        .guest-card:hover {
          transform: translateY(-4px);
        }

        .guest-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .guest-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .guest-info h3 {
          margin: 0;
          color: #2d3748;
          font-size: 1.1rem;
        }

        .guest-relationship {
          color: #667eea;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }

        .guest-location {
          color: #718096;
          font-size: 0.85rem;
        }

        .guest-interests {
          margin: 1rem 0;
          font-size: 0.9rem;
        }

        .interests-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .interest-tag {
          background: #edf2f7;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .guest-stats {
          display: flex;
          justify-content: space-between;
          margin: 1rem 0;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-weight: bold;
          color: #2d3748;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #718096;
        }

        .guest-actions {
          display: flex;
          gap: 0.5rem;
        }

        .connect-btn,
        .message-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .connect-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .connect-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .message-btn {
          background: #edf2f7;
          color: #4a5568;
        }

        .message-btn:hover {
          background: #e2e8f0;
        }

        .groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .group-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
        }

        .group-card:hover {
          transform: translateY(-4px);
        }

        .group-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .group-header h3 {
          margin: 0;
          color: #2d3748;
          font-size: 1.1rem;
        }

        .group-privacy {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .group-description {
          color: #718096;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .group-stats {
          display: flex;
          justify-content: space-between;
          margin: 1rem 0;
          font-size: 0.9rem;
        }

        .group-members {
          color: #2d3748;
        }

        .group-activity {
          color: #718096;
        }

        .group-actions {
          display: flex;
          gap: 0.5rem;
        }

        .join-btn,
        .view-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .join-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .join-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .view-btn {
          background: #edf2f7;
          color: #4a5568;
        }

        .view-btn:hover {
          background: #e2e8f0;
        }

        .create-group-btn,
        .create-event-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .events-list {
          space-y: 1.5rem;
        }

        .event-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 2rem;
          transition: transform 0.3s;
        }

        .event-card:hover {
          transform: translateY(-2px);
        }

        .event-card.upcoming {
          border-left: 4px solid #48bb78;
        }

        .event-date {
          text-align: center;
          background: #f7fafc;
          padding: 1rem;
          border-radius: 8px;
          min-width: 80px;
        }

        .event-month {
          color: #667eea;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .event-day {
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .event-content {
          flex: 1;
        }

        .event-content h3 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
        }

        .event-details {
          display: flex;
          gap: 2rem;
          margin: 0.5rem 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .event-organizer {
          color: #667eea;
          font-size: 0.85rem;
        }

        .event-actions {
          display: flex;
          gap: 0.5rem;
        }

        .rsvp-btn {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .rsvp-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
        }

        @media (max-width: 768px) {
          .guest-connection-portal {
            padding: 1rem;
          }

          .tab-navigation {
            gap: 0.5rem;
          }

          .tab-btn {
            padding: 0.75rem 1rem;
            font-size: 0.85rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .directory-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .guest-grid,
          .groups-grid {
            grid-template-columns: 1fr;
          }

          .event-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .event-details {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="portal-header">
        <h1>🤝 Guest Connection Portal</h1>
        <p className="portal-subtitle">
          Stay connected with your wedding guests and build lasting friendships
        </p>
      </div>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content-area">{tabs.find((tab) => tab.id === activeTab)?.component()}</div>
    </div>
  );
};

export default GuestConnectionPortal;
