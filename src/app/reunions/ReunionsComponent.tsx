'use client';

import { useCallback, useEffect, useState } from 'react';

interface ReunionEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: {
    venue: string;
    address: string;
    city: string;
    state: string;
  };
  capacity: number;
  currentAttendees: number;
  organizer: {
    name: string;
    email: string;
  };
  rsvpDeadline: string;
  isPublic: boolean;
  status: string;
  createdAt: string;
}

interface RSVP {
  id: string;
  eventId: string;
  attendee: {
    name: string;
    email: string;
    plusOne?: string;
  };
  status: string;
  response: string;
  submittedAt: string;
}

interface ReunionData {
  events: ReunionEvent[];
  myRSVPs: RSVP[];
  totalEvents: number;
}

interface EventCreationData {
  title: string;
  description: string;
  date: string;
  location: {
    venue: string;
    address: string;
    city: string;
    state: string;
  };
  capacity: number;
  rsvpDeadline: string;
  organizer: {
    name: string;
    email: string;
  };
  isPublic: boolean;
}

interface RSVPData {
  attendee: {
    name: string;
    email: string;
    plusOne?: string;
  };
  response: string;
  message?: string;
}

/**
 * 🎉 Guest Reunion Planner Page
 * Plan and manage anniversary celebrations
 */
export default function ReunionsPage() {
  const [reunionData, setReunionData] = useState<ReunionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ReunionEvent | null>(null);
  const [showRSVPForm, setShowRSVPForm] = useState<string | null>(null);

  const loadReunionData = useCallback(async () => {
    try {
      setLoading(true);

      const eventsResponse = await fetch('/api/reunions');

      if (!eventsResponse.ok) {
        throw new Error('Failed to load reunion data');
      }

      const eventsResult = await eventsResponse.json();

      setReunionData({
        events: eventsResult.data || [],
        myRSVPs: [], // Would load based on user
        totalEvents: eventsResult.pagination?.total || 0,
      });

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback data
      const fallbackData = {
        events: [
          {
            id: '1',
            title: 'First Anniversary Celebration',
            description: 'Join us as we celebrate our first year of marriage!',
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            location: {
              venue: 'The Grand Ballroom',
              address: '123 Celebration Ave',
              city: 'Wedding City',
              state: 'CA',
            },
            capacity: 100,
            currentAttendees: 25,
            organizer: { name: 'Austin & Jordyn', email: 'couple@example.com' },
            rsvpDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            isPublic: true,
            status: 'active',
            createdAt: new Date().toISOString(),
          },
        ],
        myRSVPs: [],
        totalEvents: 1,
      };
      setReunionData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReunionData();
  }, [loadReunionData]);

  const handleCreateEvent = async (eventData: EventCreationData) => {
    try {
      const response = await fetch('/api/reunions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create reunion event');
      }

      await loadReunionData();
      setShowCreateForm(false);
      alert('Reunion event created successfully!');
    } catch (err) {
      alert('Failed to create event. Please try again.');
      console.error('Event creation error:', err);
    }
  };

  const handleRSVP = async (eventId: string, rsvpData: RSVPData) => {
    try {
      const response = await fetch(`/api/reunions/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit RSVP');
      }

      await loadReunionData();
      setShowRSVPForm(null);
      alert('RSVP submitted successfully!');
    } catch (err) {
      alert('Failed to submit RSVP. Please try again.');
      console.error('RSVP error:', err);
    }
  };

  if (loading) {
    return (
      <div className="reunion-loading">
        <div className="loading-spinner"></div>
        <p>Loading reunion events...</p>
      </div>
    );
  }

  if (error && !reunionData) {
    return (
      <div className="reunion-error">
        <h2>Unable to load reunion events</h2>
        <p>{error}</p>
        <button onClick={loadReunionData}>Try Again</button>
      </div>
    );
  }

  const events = reunionData?.events || [];
  const upcomingEvents = events.filter((event) => new Date(event.date) > new Date());
  const pastEvents = events.filter((event) => new Date(event.date) <= new Date());

  return (
    <div className="reunions-page">
      <style>{`
        .reunions-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #f8f6f8 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .reunion-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 16px;
          color: white;
        }

        .reunion-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .reunion-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .create-event-btn {
          background: linear-gradient(135deg, #d4a574, #8b7a8a);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .create-event-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 122, 138, 0.3);
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          color: #8b7a8a;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .event-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          border-left: 4px solid #8b7a8a;
        }

        .event-card:hover {
          transform: translateY(-4px);
        }

        .event-card.upcoming {
          border-left-color: #48bb78;
          background: linear-gradient(135deg, #f0fff4, #ffffff);
        }

        .event-card.past {
          border-left-color: #a0aec0;
          opacity: 0.8;
        }

        .event-header {
          margin-bottom: 1rem;
        }

        .event-title {
          color: #8b7a8a;
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .event-date {
          font-size: 1.1rem;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .event-location {
          color: #666;
          font-size: 0.9rem;
        }

        .event-description {
          color: #4a5568;
          line-height: 1.6;
          margin: 1rem 0;
        }

        .event-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 1rem 0;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #8b7a8a;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .event-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .event-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
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

        .event-btn:hover {
          transform: translateY(-1px);
        }

        .event-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .capacity-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin: 0.5rem 0;
        }

        .capacity-fill {
          height: 100%;
          background: linear-gradient(135deg, #48bb78, #38a169);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .capacity-fill.full {
          background: linear-gradient(135deg, #e53e3e, #c53030);
        }

        .deadline-warning {
          background: #fed7d7;
          color: #c53030;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          margin: 0.5rem 0;
        }

        .event-form {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(139, 122, 138, 0.1);
          margin-bottom: 3rem;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h3 {
          color: #8b7a8a;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-weight: bold;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #8b7a8a;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .form-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-btn.primary {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .form-btn.secondary {
          background: transparent;
          border: 2px solid #8b7a8a;
          color: #8b7a8a;
        }

        .form-btn:hover {
          transform: translateY(-2px);
        }

        .reunion-loading {
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

        .reunion-error {
          text-align: center;
          padding: 3rem;
          color: #e53e3e;
        }

        .reunion-error button {
          background: #8b7a8a;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .reunions-page {
            padding: 1rem;
          }

          .reunion-header h1 {
            font-size: 2rem;
          }

          .reunion-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .event-stats {
            grid-template-columns: 1fr;
          }

          .event-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="reunion-header">
        <h1>🎉 Anniversary Reunions</h1>
        <p>Celebrate milestones with family and friends</p>
      </div>

      <div className="reunion-actions">
        <div>
          <h3>Total Events: {reunionData?.totalEvents || 0}</h3>
        </div>
        <button className="create-event-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          🎊 Plan Reunion Event
        </button>
      </div>

      {showCreateForm && (
        <EventCreationForm onSubmit={handleCreateEvent} onCancel={() => setShowCreateForm(false)} />
      )}

      {upcomingEvents.length > 0 && (
        <div className="upcoming-section">
          <div className="section-header">
            <h2>🗓️ Upcoming Events</h2>
            <p>Join us for these special celebrations!</p>
          </div>

          <div className="events-grid">
            {upcomingEvents.map((event) => {
              const eventDate = new Date(event.date);
              const rsvpDeadline = new Date(event.rsvpDeadline);
              const now = new Date();
              const isDeadlineSoon =
                rsvpDeadline.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;
              const capacityPercentage = (event.currentAttendees / event.capacity) * 100;
              const isFull = capacityPercentage >= 100;

              return (
                <div key={event.id} className="event-card upcoming">
                  <div className="event-header">
                    <div className="event-title">{event.title}</div>
                    <div className="event-date">
                      📅{' '}
                      {eventDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="event-location">
                      📍 {event.location.venue}, {event.location.city}, {event.location.state}
                    </div>
                  </div>

                  <div className="event-description">{event.description}</div>

                  <div className="event-stats">
                    <div className="stat-item">
                      <div className="stat-number">{event.currentAttendees}</div>
                      <div className="stat-label">Attending</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">{event.capacity}</div>
                      <div className="stat-label">Capacity</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">
                        {Math.max(
                          0,
                          Math.ceil(
                            (rsvpDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                          )
                        )}
                      </div>
                      <div className="stat-label">Days to RSVP</div>
                    </div>
                  </div>

                  <div className="capacity-bar">
                    <div
                      className={`capacity-fill ${isFull ? 'full' : ''}`}
                      style={{ width: `${Math.min(100, capacityPercentage)}%` }}
                    ></div>
                  </div>

                  {isDeadlineSoon && !isFull && (
                    <div className="deadline-warning">
                      ⚠️ RSVP deadline approaching: {rsvpDeadline.toLocaleDateString()}
                    </div>
                  )}

                  <div className="event-actions">
                    <button className="event-btn secondary" onClick={() => setSelectedEvent(event)}>
                      📋 View Details
                    </button>

                    {!isFull && rsvpDeadline > now && (
                      <button
                        className="event-btn primary"
                        onClick={() => setShowRSVPForm(event.id)}
                      >
                        ✉️ RSVP Now
                      </button>
                    )}

                    {isFull && (
                      <button className="event-btn primary" disabled>
                        🎫 Event Full
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="past-section">
          <div className="section-header">
            <h2>📚 Past Celebrations</h2>
            <p>Beautiful memories from previous events</p>
          </div>

          <div className="events-grid">
            {pastEvents.map((event) => {
              const eventDate = new Date(event.date);

              return (
                <div key={event.id} className="event-card past">
                  <div className="event-header">
                    <div className="event-title">{event.title}</div>
                    <div className="event-date">📅 {eventDate.toLocaleDateString()}</div>
                    <div className="event-location">📍 {event.location.venue}</div>
                  </div>

                  <div className="event-description">{event.description}</div>

                  <div className="event-stats">
                    <div className="stat-item">
                      <div className="stat-number">{event.currentAttendees}</div>
                      <div className="stat-label">Attended</div>
                    </div>
                  </div>

                  <div className="event-actions">
                    <button className="event-btn secondary" onClick={() => setSelectedEvent(event)}>
                      📸 View Memories
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showRSVPForm && (
        <RSVPForm
          eventId={showRSVPForm}
          onSubmit={(data) => handleRSVP(showRSVPForm, data)}
          onCancel={() => setShowRSVPForm(null)}
        />
      )}

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}

function EventCreationForm({
  onSubmit,
  onCancel,
}: {
  readonly onSubmit: (data: EventCreationData) => void;
  readonly onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: {
      venue: '',
      address: '',
      city: '',
      state: '',
    },
    capacity: 50,
    rsvpDeadline: '',
    organizer: {
      name: '',
      email: '',
    },
    isPublic: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else if (field.startsWith('organizer.')) {
      const organizerField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        organizer: {
          ...prev.organizer,
          [organizerField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Set minimum dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="event-form">
      <div className="form-header">
        <h3>Plan a Reunion Event</h3>
        <p>Create a celebration for your anniversary milestone</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="event-title-">
            Event Title *
          </label>
          <input
            id="event-title-"
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., 5th Anniversary Celebration"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-description" className="form-label">
            Description
          </label>
          <textarea
            id="event-description"
            className="form-textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Tell guests about this special celebration..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="event-date-">
              Event Date *
            </label>
            <input
              id="event-date-"
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              min={minDate}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rsvp-deadline-">
              RSVP Deadline *
            </label>
            <input
              id="rsvp-deadline-"
              type="date"
              className="form-input"
              value={formData.rsvpDeadline}
              onChange={(e) => handleChange('rsvpDeadline', e.target.value)}
              min={minDate}
              max={formData.date}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="venue-name-">
            Venue Name *
          </label>
          <input
            id="venue-name-"
            type="text"
            className="form-input"
            value={formData.location.venue}
            onChange={(e) => handleChange('location.venue', e.target.value)}
            placeholder="e.g., The Grand Ballroom"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="address-">
            Address *
          </label>
          <input
            id="address-"
            type="text"
            className="form-input"
            value={formData.location.address}
            onChange={(e) => handleChange('location.address', e.target.value)}
            placeholder="Street address"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="city-">
              City *
            </label>
            <input
              id="city-"
              type="text"
              className="form-input"
              value={formData.location.city}
              onChange={(e) => handleChange('location.city', e.target.value)}
              placeholder="City"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="state-">
              State *
            </label>
            <input
              id="state-"
              type="text"
              className="form-input"
              value={formData.location.state}
              onChange={(e) => handleChange('location.state', e.target.value)}
              placeholder="State"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="capacity-">
            Capacity *
          </label>
          <input
            id="capacity-"
            type="number"
            className="form-input"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
            min="1"
            max="500"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="your-name-">
              Your Name *
            </label>
            <input
              id="your-name-"
              type="text"
              className="form-input"
              value={formData.organizer.name}
              onChange={(e) => handleChange('organizer.name', e.target.value)}
              placeholder="Event organizer name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email-">
              Email *
            </label>
            <input
              id="email-"
              type="email"
              className="form-input"
              value={formData.organizer.email}
              onChange={(e) => handleChange('organizer.email', e.target.value)}
              placeholder="organizer@example.com"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="form-btn primary">
            Create Event
          </button>
          <button type="button" className="form-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function RSVPForm({
  eventId: _eventId,
  onSubmit,
  onCancel,
}: {
  readonly eventId: string;
  readonly onSubmit: (data: RSVPData) => void;
  readonly onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    attendee: {
      name: '',
      email: '',
      plusOne: '',
    },
    response: 'yes',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h3 style={{ color: '#8B7A8A', textAlign: 'center', marginBottom: '1rem' }}>
          RSVP for Event
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="rsvp-name"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
            >
              Your Name *
            </label>
            <input
              id="rsvp-name"
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
              }}
              value={formData.attendee.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  attendee: { ...prev.attendee, name: e.target.value },
                }))
              }
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="rsvp-email"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
            >
              Email *
            </label>
            <input
              id="rsvp-email"
              type="email"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
              }}
              value={formData.attendee.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  attendee: { ...prev.attendee, email: e.target.value },
                }))
              }
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="rsvp-plus-one"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
            >
              Plus One (Optional)
            </label>
            <input
              id="rsvp-plus-one"
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
              }}
              value={formData.attendee.plusOne}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  attendee: { ...prev.attendee, plusOne: e.target.value },
                }))
              }
              placeholder="Guest name"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="rsvp-response"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
            >
              Response *
            </label>
            <select
              id="rsvp-response"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E2E8F0',
                borderRadius: '8px',
              }}
              value={formData.response}
              onChange={(e) => setFormData((prev) => ({ ...prev, response: e.target.value }))}
            >
              <option value="yes">Yes, I&apos;ll attend</option>
              <option value="no">Sorry, can&apos;t make it</option>
              <option value="maybe">Maybe</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #8B7A8A, #D4A574)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Submit RSVP
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: '2px solid #8B7A8A',
                color: '#8B7A8A',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventModal({
  event,
  onClose,
}: {
  readonly event: ReunionEvent;
  readonly onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ color: '#8B7A8A', margin: 0 }}>{event.title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          <br />
          <strong>Location:</strong> {event.location.venue}
          <br />
          <strong>Address:</strong> {event.location.address}, {event.location.city},{' '}
          {event.location.state}
          <br />
          <strong>Capacity:</strong> {event.currentAttendees}/{event.capacity}
          <br />
          <strong>Organizer:</strong> {event.organizer.name}
        </div>

        <p style={{ lineHeight: 1.6, color: '#666' }}>{event.description}</p>
      </div>
    </div>
  );
}
