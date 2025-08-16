import { useState } from 'react';

/**
 * 🎉 Guest Reunion Planner Component
 * Plan anniversary parties and reunions with wedding guests
 */
const GuestReunionPlanner = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    maxGuests: 50,
    type: 'anniversary',
    virtualOption: false,
  });
  const [rsvps, setRsvps] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const eventTypes = [
    { value: 'anniversary', label: '💍 Anniversary Celebration', icon: '💍' },
    { value: 'holiday', label: '🎄 Holiday Gathering', icon: '🎄' },
    { value: 'casual', label: '☕ Casual Get-Together', icon: '☕' },
    { value: 'milestone', label: '🎊 Milestone Celebration', icon: '🎊' },
    { value: 'virtual', label: '📱 Virtual Reunion', icon: '📱' },
  ];

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const eventData = {
        ...newEvent,
        id: `event_${Date.now()}`,
        createdAt: new Date().toISOString(),
        attendees: [],
        status: 'upcoming',
      };

      const response = await fetch('/api/reunion-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        setEvents((prev) => [...prev, eventData]);
        setNewEvent({
          title: '',
          date: '',
          location: '',
          description: '',
          maxGuests: 50,
          type: 'anniversary',
          virtualOption: false,
        });
        alert('Event created! Invitations will be sent to your wedding guests. 🎉');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRSVP = async (eventId, response) => {
    try {
      const rsvpData = {
        eventId,
        response,
        guestName: prompt('Please enter your name:'),
        timestamp: new Date().toISOString(),
      };

      await fetch('/api/reunion-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData),
      });

      setRsvps((prev) => ({
        ...prev,
        [eventId]: response,
      }));

      alert('RSVP submitted! Thank you. 💕');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    }
  };

  return (
    <div className="reunion-planner">
      <style>{`
        .reunion-planner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
        }

        .planner-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .planner-header h1 {
          color: #8b7a8a;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .planner-header p {
          color: #666;
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .create-event-section {
          background: linear-gradient(135deg, #f8f6f8, #ffffff);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 8px 32px rgba(139, 122, 138, 0.1);
        }

        .section-title {
          color: #8b7a8a;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #8b7a8a;
          font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .event-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .event-type-btn {
          padding: 1rem;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          font-size: 0.9rem;
        }

        .event-type-btn.selected {
          border-color: #8b7a8a;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .create-btn {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s;
          grid-column: 1 / -1;
          margin-top: 1rem;
        }

        .create-btn:hover {
          transform: translateY(-2px);
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .event-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #d4a574;
        }

        .event-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .event-icon {
          font-size: 2rem;
        }

        .event-title {
          color: #8b7a8a;
          font-size: 1.3rem;
          margin: 0;
        }

        .event-date {
          color: #d4a574;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .event-details {
          color: #333;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .event-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem 0;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .stat {
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
          text-transform: uppercase;
        }

        .rsvp-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid #d4a574;
        }

        .rsvp-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .rsvp-btn {
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .rsvp-btn.yes {
          border-color: #4caf50;
          color: #4caf50;
        }

        .rsvp-btn.yes.selected {
          background: #4caf50;
          color: white;
        }

        .rsvp-btn.maybe {
          border-color: #ff9800;
          color: #ff9800;
        }

        .rsvp-btn.maybe.selected {
          background: #ff9800;
          color: white;
        }

        .rsvp-btn.no {
          border-color: #f44336;
          color: #f44336;
        }

        .rsvp-btn.no.selected {
          background: #f44336;
          color: white;
        }

        .virtual-badge {
          display: inline-block;
          background: #2196f3;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          margin-left: 1rem;
        }
      `}</style>

      <div className="planner-header">
        <h1>🎉 Reunion Planner</h1>
        <p>
          Stay connected with your wedding guests! Plan anniversary celebrations, holiday
          gatherings, and special reunions. Keep the love and friendships alive! 💕
        </p>
      </div>

      <div className="create-event-section">
        <h2 className="section-title">📅 Plan New Event</h2>

        <form onSubmit={handleCreateEvent}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                required
                value={newEvent.title}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., 'Austin & Jordyn's 1st Anniversary Party'"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Event Date</label>
              <input
                type="datetime-local"
                id="date"
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                required
                value={newEvent.location}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Address or venue name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxGuests">Max Guests</label>
              <input
                type="number"
                id="maxGuests"
                min="5"
                max="500"
                value={newEvent.maxGuests}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, maxGuests: parseInt(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Event Type</label>
            <div className="event-types">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`event-type-btn ${newEvent.type === type.value ? 'selected' : ''}`}
                  onClick={() => setNewEvent((prev) => ({ ...prev, type: type.value }))}
                >
                  <div>{type.icon}</div>
                  <div>{type.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Event Description</label>
            <textarea
              id="description"
              required
              value={newEvent.description}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your event, what to expect, dress code, etc..."
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="virtualOption"
              checked={newEvent.virtualOption}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, virtualOption: e.target.checked }))
              }
            />
            <label htmlFor="virtualOption">Include virtual attendance option</label>
          </div>

          <button type="submit" className="create-btn" disabled={isCreating}>
            {isCreating ? '📅 Creating Event...' : '🎉 Create Event'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="section-title">🎊 Upcoming Events</h2>

        <div className="events-grid">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const eventType = eventTypes.find((t) => t.value === event.type);
            const userRsvp = rsvps[event.id];

            return (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-icon">{eventType?.icon}</div>
                  <div>
                    <h3 className="event-title">{event.title}</h3>
                    {event.virtualOption && <span className="virtual-badge">Virtual Option</span>}
                  </div>
                </div>

                <div className="event-date">
                  📅 {eventDate.toLocaleDateString()} at{' '}
                  {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                <div className="event-details">
                  <p>
                    <strong>📍 Location:</strong> {event.location}
                  </p>
                  <p>{event.description}</p>
                </div>

                <div className="event-stats">
                  <div className="stat">
                    <div className="stat-number">23</div>
                    <div className="stat-label">Coming</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">5</div>
                    <div className="stat-label">Maybe</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{event.maxGuests}</div>
                    <div className="stat-label">Max</div>
                  </div>
                </div>

                <div className="rsvp-section">
                  <h4>Will you be attending?</h4>
                  <div className="rsvp-buttons">
                    <button
                      className={`rsvp-btn yes ${userRsvp === 'yes' ? 'selected' : ''}`}
                      onClick={() => handleRSVP(event.id, 'yes')}
                    >
                      ✅ Yes!
                    </button>
                    <button
                      className={`rsvp-btn maybe ${userRsvp === 'maybe' ? 'selected' : ''}`}
                      onClick={() => handleRSVP(event.id, 'maybe')}
                    >
                      🤔 Maybe
                    </button>
                    <button
                      className={`rsvp-btn no ${userRsvp === 'no' ? 'selected' : ''}`}
                      onClick={() => handleRSVP(event.id, 'no')}
                    >
                      ❌ Can't make it
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            No events planned yet. Create your first reunion above! 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestReunionPlanner;
