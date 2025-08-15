'use client';

import { useCallback, useEffect, useState } from 'react';

interface ConnectionProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  interests: string[];
  location: string;
  avatar?: string;
  relationshipToCouple: string;
  isPublic: boolean;
  contactPreferences: {
    allowDirectContact: boolean;
    allowGroupInvites: boolean;
    preferredMethods: string[];
  };
  createdAt: string;
}

interface ConnectionMatch {
  id: string;
  profile1Id: string;
  profile2Id: string;
  profile1: ConnectionProfile;
  profile2: ConnectionProfile;
  matchScore: number;
  commonInterests: string[];
  reason: string;
  status: 'suggested' | 'viewed' | 'connected' | 'declined';
  createdAt: string;
}

interface ConnectionRequest {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  fromProfile: ConnectionProfile;
  toProfile: ConnectionProfile;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

interface NetworkingEvent {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'in_person';
  datetime: string;
  location?: string;
  meetingUrl?: string;
  hostId: string;
  host: ConnectionProfile;
  participants: string[];
  maxParticipants?: number;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

interface ConnectionsData {
  myProfile: ConnectionProfile | null;
  suggestedMatches: ConnectionMatch[];
  myConnections: ConnectionProfile[];
  pendingRequests: ConnectionRequest[];
  upcomingEvents: NetworkingEvent[];
  stats: {
    totalConnections: number;
    newMatches: number;
    upcomingEvents: number;
    popularInterests: Array<{ interest: string; count: number }>;
  };
}

/**
 * 🤝 Guest Connections & Networking Hub
 * Connect with other wedding guests and build lasting relationships
 */
export default function GuestConnectionsPage() {
  const [connectionsData, setConnectionsData] = useState<ConnectionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'connections' | 'events' | 'profile'>(
    'discover'
  );
  const [_showProfileForm, setShowProfileForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<ConnectionMatch | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<NetworkingEvent | null>(null);

  const loadConnectionsData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        profileResponse,
        matchesResponse,
        connectionsResponse,
        requestsResponse,
        eventsResponse,
        statsResponse,
      ] = await Promise.all([
        fetch('/api/guest-connections/profile'),
        fetch('/api/guest-connections/matches'),
        fetch('/api/guest-connections/connections'),
        fetch('/api/guest-connections/requests'),
        fetch('/api/guest-connections/events'),
        fetch('/api/guest-connections/stats'),
      ]);

      const [
        profileResult,
        matchesResult,
        connectionsResult,
        requestsResult,
        eventsResult,
        statsResult,
      ] = await Promise.all([
        profileResponse.ok ? profileResponse.json() : { data: null },
        matchesResponse.ok ? matchesResponse.json() : { data: { matches: [] } },
        connectionsResponse.ok ? connectionsResponse.json() : { data: { connections: [] } },
        requestsResponse.ok ? requestsResponse.json() : { data: { requests: [] } },
        eventsResponse.ok ? eventsResponse.json() : { data: { events: [] } },
        statsResponse.ok
          ? statsResponse.json()
          : {
              data: { totalConnections: 0, newMatches: 0, upcomingEvents: 0, popularInterests: [] },
            },
      ]);

      setConnectionsData({
        myProfile: profileResult.data?.profile || null,
        suggestedMatches: matchesResult.data?.matches || [],
        myConnections: connectionsResult.data?.connections || [],
        pendingRequests: requestsResult.data?.requests || [],
        upcomingEvents: eventsResult.data?.events || [],
        stats: statsResult.data || {
          totalConnections: 0,
          newMatches: 0,
          upcomingEvents: 0,
          popularInterests: [],
        },
      });

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback data
      const fallbackData = {
        myProfile: null,
        suggestedMatches: [],
        myConnections: [],
        pendingRequests: [],
        upcomingEvents: [
          {
            id: '1',
            title: 'Wedding Guest Mixer',
            description: 'Virtual meetup before the big day!',
            type: 'virtual' as const,
            datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            meetingUrl: 'https://zoom.us/j/example',
            hostId: '1',
            host: {
              id: '1',
              name: 'Austin & Jordyn',
              email: 'couple@example.com',
              interests: ['wedding planning'],
              location: 'Host',
              relationshipToCouple: 'couple',
              isPublic: true,
              contactPreferences: {
                allowDirectContact: true,
                allowGroupInvites: true,
                preferredMethods: ['email'],
              },
              createdAt: new Date().toISOString(),
            },
            participants: [],
            tags: ['mixer', 'virtual'],
            status: 'upcoming' as const,
            createdAt: new Date().toISOString(),
          },
        ],
        stats: { totalConnections: 0, newMatches: 0, upcomingEvents: 1, popularInterests: [] },
      };
      setConnectionsData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConnectionsData();
  }, [loadConnectionsData]);

  const handleCreateProfile = async (profileData: ConnectionProfile) => {
    try {
      const response = await fetch('/api/guest-connections/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      await loadConnectionsData();
      setShowProfileForm(false);
      alert('Profile created successfully!');
    } catch (err) {
      alert('Failed to create profile. Please try again.');
      console.error('Profile creation error:', err);
    }
  };

  const handleConnectionRequest = async (targetProfileId: string, message?: string) => {
    try {
      const response = await fetch('/api/guest-connections/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toProfileId: targetProfileId,
          message: message || 'Hi! I&apos;d love to connect with you!',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send connection request');
      }

      await loadConnectionsData();
      alert('Connection request sent!');
      setSelectedMatch(null);
    } catch (err) {
      alert('Failed to send request. Please try again.');
      console.error('Connection request error:', err);
    }
  };

  const handleEventRSVP = async (eventId: string, attending: boolean) => {
    try {
      const response = await fetch(`/api/guest-connections/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending }),
      });

      if (!response.ok) {
        throw new Error('Failed to update RSVP');
      }

      await loadConnectionsData();
      alert(attending ? 'RSVP confirmed!' : 'RSVP updated');
      setSelectedEvent(null);
    } catch (err) {
      alert('Failed to update RSVP. Please try again.');
      console.error('RSVP error:', err);
    }
  };

  if (loading) {
    return (
      <div className="connections-loading">
        <div className="loading-spinner"></div>
        <p>Loading connections...</p>
      </div>
    );
  }

  if (error && !connectionsData) {
    return (
      <div className="connections-error">
        <h2>Unable to load connections</h2>
        <p>{error}</p>
        <button onClick={loadConnectionsData}>Try Again</button>
      </div>
    );
  }

  const data = connectionsData!;
  const hasProfile = !!data.myProfile;

  return (
    <div className="guest-connections-page">
      <style>{`
        .guest-connections-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #f8f6f8 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .connections-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 16px;
          color: white;
        }

        .connections-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .navigation-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          background: white;
          padding: 0.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .nav-tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .nav-tab:hover {
          background: #f0f0f0;
        }

        .nav-tab.active:hover {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #8b7a8a;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }

        .no-profile-prompt {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          margin-bottom: 2rem;
        }

        .no-profile-prompt h3 {
          color: #8b7a8a;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .create-profile-btn {
          background: linear-gradient(135deg, #d4a574, #8b7a8a);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.3s;
        }

        .create-profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 122, 138, 0.3);
        }

        .matches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .match-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          border-top: 4px solid #8b7a8a;
        }

        .match-card:hover {
          transform: translateY(-4px);
        }

        .match-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .match-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .match-info h4 {
          color: #8b7a8a;
          margin-bottom: 0.25rem;
        }

        .match-score {
          color: #d4a574;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .match-details {
          margin-bottom: 1rem;
        }

        .match-bio {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .common-interests {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .interest-tag {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .match-actions {
          display: flex;
          gap: 0.5rem;
        }

        .match-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .match-btn.primary {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .match-btn.secondary {
          background: transparent;
          border: 1px solid #8b7a8a;
          color: #8b7a8a;
        }

        .match-btn:hover {
          transform: translateY(-1px);
        }

        .connections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .connection-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .connection-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          margin: 0 auto 1rem;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .event-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #d4a574;
        }

        .event-header {
          margin-bottom: 1rem;
        }

        .event-title {
          color: #8b7a8a;
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .event-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .event-type {
          background: #f7fafc;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #8b7a8a;
        }

        .event-description {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .event-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .event-tag {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .event-actions {
          display: flex;
          gap: 0.5rem;
        }

        .event-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .event-btn.primary {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .event-btn.secondary {
          background: transparent;
          border: 1px solid #8b7a8a;
          color: #8b7a8a;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .modal-header h3 {
          color: #8b7a8a;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .connections-loading {
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

        .connections-error {
          text-align: center;
          padding: 3rem;
          color: #e53e3e;
        }

        .connections-error button {
          background: #8b7a8a;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .guest-connections-page {
            padding: 1rem;
          }

          .connections-header h1 {
            font-size: 2rem;
          }

          .navigation-tabs {
            flex-direction: column;
          }

          .matches-grid,
          .connections-grid,
          .events-grid {
            grid-template-columns: 1fr;
          }

          .stats-overview {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="connections-header">
        <h1>🤝 Guest Connections</h1>
        <p>Connect with fellow guests and build lasting friendships</p>
      </div>

      <div className="navigation-tabs">
        <button
          className={`nav-tab ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          🔍 Discover
        </button>
        <button
          className={`nav-tab ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          👥 My Connections
        </button>
        <button
          className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          📅 Events
        </button>
        <button
          className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-number">{data.stats.totalConnections}</div>
          <div className="stat-label">Your Connections</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.stats.newMatches}</div>
          <div className="stat-label">New Matches</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.stats.upcomingEvents}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.pendingRequests.length}</div>
          <div className="stat-label">Pending Requests</div>
        </div>
      </div>

      {!hasProfile && activeTab !== 'profile' && (
        <div className="no-profile-prompt">
          <h3>Create Your Connection Profile</h3>
          <p>Set up your profile to start connecting with other wedding guests!</p>
          <button className="create-profile-btn" onClick={() => setActiveTab('profile')}>
            Create Profile
          </button>
        </div>
      )}

      {activeTab === 'discover' && hasProfile && (
        <div className="matches-grid">
          {data.suggestedMatches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="match-header">
                <div className="match-avatar">{match.profile2.name.charAt(0)}</div>
                <div className="match-info">
                  <h4>{match.profile2.name}</h4>
                  <div className="match-score">{match.matchScore}% match</div>
                </div>
              </div>

              <div className="match-details">
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  {match.profile2.relationshipToCouple} • {match.profile2.location}
                </div>

                {match.profile2.bio && <div className="match-bio">{match.profile2.bio}</div>}

                {match.commonInterests.length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#8B7A8A',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Common Interests:
                    </div>
                    <div className="common-interests">
                      {match.commonInterests.map((interest, index) => (
                        <span key={index} className="interest-tag">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                  {match.reason}
                </div>
              </div>

              <div className="match-actions">
                <button className="match-btn primary" onClick={() => setSelectedMatch(match)}>
                  Connect
                </button>
                <button className="match-btn secondary">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="connections-grid">
          {data.myConnections.map((connection) => (
            <div key={connection.id} className="connection-card">
              <div className="connection-avatar">{connection.name.charAt(0)}</div>
              <h4 style={{ color: '#8B7A8A', marginBottom: '0.5rem' }}>{connection.name}</h4>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                {connection.relationshipToCouple} • {connection.location}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="match-btn primary">Message</button>
                <button className="match-btn secondary">Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="events-grid">
          {data.upcomingEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <div className="event-title">{event.title}</div>
                <div className="event-meta">
                  <span>{new Date(event.datetime).toLocaleDateString()}</span>
                  <span className="event-type">{event.type}</span>
                </div>
              </div>

              <div className="event-description">{event.description}</div>

              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Hosted by {event.host.name}
                {event.maxParticipants && (
                  <span>
                    {' '}
                    • {event.participants.length}/{event.maxParticipants} attending
                  </span>
                )}
              </div>

              {event.tags.length > 0 && (
                <div className="event-tags">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="event-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="event-actions">
                <button className="event-btn primary" onClick={() => setSelectedEvent(event)}>
                  Join Event
                </button>
                <button className="event-btn secondary">Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'profile' && (
        <ProfileForm profile={data.myProfile} onSubmit={handleCreateProfile} />
      )}

      {selectedMatch && (
        <ConnectionModal
          match={selectedMatch}
          onConnect={handleConnectionRequest}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onRSVP={handleEventRSVP}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

function ProfileForm({
  profile,
  onSubmit,
}: {
  profile: ConnectionProfile | null;
  onSubmit: (data: ConnectionProfile) => void;
}) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    bio: profile?.bio || '',
    interests: profile?.interests.join(', ') || '',
    location: profile?.location || '',
    relationshipToCouple: profile?.relationshipToCouple || '',
    isPublic: profile?.isPublic ?? true,
    contactPreferences: {
      allowDirectContact: profile?.contactPreferences.allowDirectContact ?? true,
      allowGroupInvites: profile?.contactPreferences.allowGroupInvites ?? true,
      preferredMethods: profile?.contactPreferences.preferredMethods.join(', ') || 'email',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: ConnectionProfile = {
      id: profile?.id || '',
      ...formData,
      interests: formData.interests
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i),
      contactPreferences: {
        ...formData.contactPreferences,
        preferredMethods: formData.contactPreferences.preferredMethods
          .split(',')
          .map((m) => m.trim())
          .filter((m) => m),
      },
      createdAt: profile?.createdAt || new Date().toISOString(),
    };
    onSubmit(submissionData);
  };

  return (
    <div
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(139, 122, 138, 0.1)',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: '#8B7A8A', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {profile ? 'Update Your Profile' : 'Create Your Connection Profile'}
        </h3>
        <p>Help other guests find and connect with you!</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4A5568',
              fontWeight: 'bold',
            }}
          >
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Your full name"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
            required
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4A5568',
              fontWeight: 'bold',
            }}
          >
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
            required
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4A5568',
              fontWeight: 'bold',
            }}
          >
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell other guests about yourself..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '1rem',
              minHeight: '100px',
              resize: 'vertical',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4A5568',
              fontWeight: 'bold',
            }}
          >
            Interests (comma-separated)
          </label>
          <input
            type="text"
            value={formData.interests}
            onChange={(e) => setFormData((prev) => ({ ...prev, interests: e.target.value }))}
            placeholder="photography, travel, music, cooking..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4A5568',
              fontWeight: 'bold',
            }}
          >
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="City, State/Country"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4A5568',
              fontWeight: 'bold',
            }}
          >
            Relationship to Couple
          </label>
          <select
            value={formData.relationshipToCouple}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, relationshipToCouple: e.target.value }))
            }
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          >
            <option value="">Select relationship...</option>
            <option value="friend">Friend</option>
            <option value="family">Family</option>
            <option value="colleague">Colleague</option>
            <option value="classmate">Classmate</option>
            <option value="neighbor">Neighbor</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
            />
            Make profile public
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={formData.contactPreferences.allowDirectContact}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactPreferences: {
                    ...prev.contactPreferences,
                    allowDirectContact: e.target.checked,
                  },
                }))
              }
            />
            Allow direct contact
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #8B7A8A, #D4A574)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s',
            }}
          >
            {profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ConnectionModal({
  match,
  onConnect,
  onClose,
}: {
  match: ConnectionMatch;
  onConnect: (profileId: string, message?: string) => void;
  onClose: () => void;
}) {
  const [message, setMessage] = useState(
    'Hi! I&apos;d love to connect with you after seeing we have so much in common!'
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Connect with {match.profile2.name}</h3>
          <p>Send a connection request</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#8B7A8A' }}>
            Common Interests:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {match.commonInterests.map((interest, index) => (
              <span key={index} className="interest-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4A5568',
              fontWeight: 'bold',
            }}
          >
            Personal Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '1rem',
              minHeight: '100px',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => onConnect(match.profile2.id, message)}
            style={{
              background: 'linear-gradient(135deg, #8B7A8A, #D4A574)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Send Request
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '2px solid #8B7A8A',
              color: '#8B7A8A',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function EventModal({
  event,
  onRSVP,
  onClose,
}: {
  event: NetworkingEvent;
  onRSVP: (eventId: string, attending: boolean) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{event.title}</h3>
          <p>{new Date(event.datetime).toLocaleString()}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', lineHeight: 1.6 }}>{event.description}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#8B7A8A' }}>
            Event Details:
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            <div>Type: {event.type}</div>
            <div>Host: {event.host.name}</div>
            {event.location && <div>Location: {event.location}</div>}
            {event.meetingUrl && <div>Meeting URL: {event.meetingUrl}</div>}
            {event.maxParticipants && (
              <div>
                Capacity: {event.participants.length}/{event.maxParticipants}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => onRSVP(event.id, true)}
            style={{
              background: 'linear-gradient(135deg, #8B7A8A, #D4A574)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Join Event
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '2px solid #8B7A8A',
              color: '#8B7A8A',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
