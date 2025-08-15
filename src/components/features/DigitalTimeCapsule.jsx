import { useState } from 'react';

/**
 * ⏰ Digital Time Capsule Component
 * Allows creation of time capsules to be opened on future anniversaries
 */
const DigitalTimeCapsule = () => {
  const [capsules, setCapsules] = useState([]);
  const [newCapsule, setNewCapsule] = useState({
    title: '',
    openDate: '',
    message: '',
    predictions: '',
    currentMoments: '',
    photos: [],
    contributors: [],
  });
  const [isCreating, setIsCreating] = useState(false);

  const predefinedDates = [
    { label: '1st Anniversary', date: new Date('2026-06-14') },
    { label: '5th Anniversary', date: new Date('2030-06-14') },
    { label: '10th Anniversary', date: new Date('2035-06-14') },
    { label: '25th Anniversary', date: new Date('2050-06-14') },
  ];

  const handleCreateCapsule = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const capsuleData = {
        ...newCapsule,
        id: `capsule_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'sealed',
        canOpen: new Date() >= new Date(newCapsule.openDate),
      };

      const response = await fetch('/api/time-capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capsuleData),
      });

      if (response.ok) {
        setCapsules((prev) => [...prev, capsuleData]);
        setNewCapsule({
          title: '',
          openDate: '',
          message: '',
          predictions: '',
          currentMoments: '',
          photos: [],
          contributors: [],
        });
        alert('Time Capsule sealed! 🔒✨');
      }
    } catch (error) {
      console.error('Error creating time capsule:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const openCapsule = async (capsuleId) => {
    if (window.confirm('Are you ready to open this time capsule? This action cannot be undone!')) {
      try {
        await fetch(`/api/time-capsules/${capsuleId}/open`, { method: 'POST' });
        setCapsules((prev) =>
          prev.map((cap) =>
            cap.id === capsuleId
              ? { ...cap, status: 'opened', openedAt: new Date().toISOString() }
              : cap
          )
        );
      } catch (error) {
        console.error('Error opening capsule:', error);
      }
    }
  };

  return (
    <div className="time-capsule-container">
      <style>{`
        .time-capsule-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
        }

        .capsule-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .capsule-header h1 {
          color: #8b7a8a;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .capsule-header p {
          color: #666;
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .create-capsule-section {
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

        .quick-dates {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .quick-date-btn {
          padding: 0.75rem;
          border: 2px solid #d4a574;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          color: #8b7a8a;
        }

        .quick-date-btn:hover {
          background: #d4a574;
          color: white;
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
          width: 100%;
          margin-top: 1rem;
        }

        .create-btn:hover {
          transform: translateY(-2px);
        }

        .capsules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .capsule-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .capsule-card.sealed {
          border: 3px solid #d4a574;
        }

        .capsule-card.opened {
          border: 3px solid #8b7a8a;
          background: linear-gradient(135deg, #f8f6f8, #ffffff);
        }

        .capsule-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .capsule-status.sealed {
          background: #d4a574;
          color: white;
        }

        .capsule-status.opened {
          background: #8b7a8a;
          color: white;
        }

        .capsule-title {
          color: #8b7a8a;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          padding-right: 5rem;
        }

        .capsule-date {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .capsule-preview {
          color: #333;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .open-capsule-btn {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
          width: 100%;
        }

        .open-capsule-btn:hover {
          transform: translateY(-2px);
        }

        .open-capsule-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .countdown {
          text-align: center;
          color: #d4a574;
          font-weight: bold;
          margin: 0.5rem 0;
        }

        .capsule-content {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid #d4a574;
        }

        .content-section {
          margin-bottom: 1rem;
        }

        .content-section h4 {
          color: #8b7a8a;
          margin-bottom: 0.5rem;
        }
      `}</style>

      <div className="capsule-header">
        <h1>⏰ Digital Time Capsules</h1>
        <p>
          Create time capsules filled with memories, predictions, and messages to be opened on your
          future anniversaries. Capture this moment in time and rediscover it years from now! ✨
        </p>
      </div>

      <div className="create-capsule-section">
        <h2 className="section-title">🔒 Create New Time Capsule</h2>

        <form onSubmit={handleCreateCapsule}>
          <div className="form-group">
            <label htmlFor="title">Capsule Title</label>
            <input
              type="text"
              id="title"
              required
              value={newCapsule.title}
              onChange={(e) => setNewCapsule((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., 'Our First Year Memories' or 'Dreams for the Future'"
            />
          </div>

          <div className="form-group">
            <label htmlFor="openDate">When should this capsule be opened?</label>
            <input
              type="date"
              id="openDate"
              required
              value={newCapsule.openDate}
              onChange={(e) => setNewCapsule((prev) => ({ ...prev, openDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />

            <div className="quick-dates">
              {predefinedDates.map(({ label, date }) => (
                <button
                  key={label}
                  type="button"
                  className="quick-date-btn"
                  onClick={() =>
                    setNewCapsule((prev) => ({
                      ...prev,
                      openDate: date.toISOString().split('T')[0],
                    }))
                  }
                >
                  {label}
                  <br />
                  <small>{date.getFullYear()}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message to Future Selves</label>
            <textarea
              id="message"
              required
              value={newCapsule.message}
              onChange={(e) => setNewCapsule((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Write a message to yourselves in the future..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentMoments">Current Life Snapshot</label>
            <textarea
              id="currentMoments"
              value={newCapsule.currentMoments}
              onChange={(e) =>
                setNewCapsule((prev) => ({ ...prev, currentMoments: e.target.value }))
              }
              placeholder="Describe your life right now - where you live, work, favorite things, current events..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="predictions">Predictions & Dreams</label>
            <textarea
              id="predictions"
              value={newCapsule.predictions}
              onChange={(e) => setNewCapsule((prev) => ({ ...prev, predictions: e.target.value }))}
              placeholder="What do you predict will happen? What are your dreams and goals?"
            />
          </div>

          <button type="submit" className="create-btn" disabled={isCreating}>
            {isCreating ? '🔒 Sealing Capsule...' : '✨ Create Time Capsule'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="section-title">📦 Your Time Capsules</h2>

        <div className="capsules-grid">
          {capsules.map((capsule) => {
            const openDate = new Date(capsule.openDate);
            const now = new Date();
            const canOpen = now >= openDate;
            const daysUntil = Math.ceil((openDate - now) / (1000 * 60 * 60 * 24));

            return (
              <div key={capsule.id} className={`capsule-card ${capsule.status}`}>
                <div className={`capsule-status ${capsule.status}`}>
                  {capsule.status === 'sealed' ? '🔒 Sealed' : '🔓 Opened'}
                </div>

                <h3 className="capsule-title">{capsule.title}</h3>

                <div className="capsule-date">Open Date: {openDate.toLocaleDateString()}</div>

                {capsule.status === 'sealed' && !canOpen && (
                  <div className="countdown">Opens in {daysUntil} days</div>
                )}

                {capsule.status === 'sealed' && (
                  <div className="capsule-preview">
                    This time capsule contains memories, predictions, and messages from{' '}
                    {new Date(capsule.createdAt).toLocaleDateString()}.
                  </div>
                )}

                {capsule.status === 'sealed' ? (
                  <button
                    className="open-capsule-btn"
                    onClick={() => openCapsule(capsule.id)}
                    disabled={!canOpen}
                  >
                    {canOpen
                      ? '🔓 Open Capsule'
                      : `🔒 Sealed until ${openDate.toLocaleDateString()}`}
                  </button>
                ) : (
                  <div className="capsule-content">
                    <div className="content-section">
                      <h4>💌 Message:</h4>
                      <p>{capsule.message}</p>
                    </div>

                    {capsule.currentMoments && (
                      <div className="content-section">
                        <h4>📸 Life Snapshot:</h4>
                        <p>{capsule.currentMoments}</p>
                      </div>
                    )}

                    {capsule.predictions && (
                      <div className="content-section">
                        <h4>🔮 Predictions:</h4>
                        <p>{capsule.predictions}</p>
                      </div>
                    )}

                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        color: '#666',
                      }}
                    >
                      Opened on {new Date(capsule.openedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {capsules.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            No time capsules created yet. Create your first one above! 🎁
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalTimeCapsule;
