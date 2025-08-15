'use client';

import { useCallback, useEffect, useState } from 'react';

interface CapsuleContent {
  id: string;
  type: string;
  content: string;
  author: string;
  addedAt: string;
}

interface TimeCapsule {
  id: string;
  title: string;
  description: string;
  creator: {
    name: string;
    email: string;
  };
  openDate: string;
  isSealed: boolean;
  contents: CapsuleContent[];
  viewCount: number;
  createdAt: string;
  sealedAt?: string;
  openedAt?: string;
}

interface TimeCapsuleData {
  capsules: TimeCapsule[];
  upcoming: TimeCapsule[];
  totalCapsules: number;
}

interface CapsuleCreationData {
  title: string;
  description: string;
  openDate: string;
  creator: {
    name: string;
    email: string;
  };
}

/**
 * ⏰ Digital Time Capsule Page
 * Preserve memories to be opened in the future
 */
export default function TimeCapsulePage() {
  const [capsuleData, setCapsuleData] = useState<TimeCapsuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);

  // Helper functions to extract nested ternary operations
  const getCapsuleStatusClass = (isOpened: boolean, canOpen: boolean): string => {
    if (isOpened) return 'open';
    if (canOpen) return 'pending';
    return 'sealed';
  };

  const getCapsuleStatusText = (isOpened: boolean, canOpen: boolean): string => {
    if (isOpened) return '🔓 Opened';
    if (canOpen) return '⏰ Ready';
    return '🔒 Sealed';
  };

  const loadCapsuleData = useCallback(async () => {
    try {
      setLoading(true);

      const [capsulesResponse, upcomingResponse] = await Promise.all([
        fetch('/api/time-capsules'),
        fetch('/api/time-capsules/schedule/upcoming'),
      ]);

      if (!capsulesResponse.ok || !upcomingResponse.ok) {
        throw new Error('Failed to load time capsule data');
      }

      const [capsulesResult, upcomingResult] = await Promise.all([
        capsulesResponse.json(),
        upcomingResponse.json(),
      ]);

      setCapsuleData({
        capsules: capsulesResult.data || [],
        upcoming: upcomingResult.data || [],
        totalCapsules: capsulesResult.pagination?.total || 0,
      });

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback data
      const fallbackData = {
        capsules: [
          {
            id: '1',
            title: 'Our First Year Memories',
            description: 'Collecting memories from our first year of marriage',
            creator: { name: 'Austin & Jordyn', email: 'couple@example.com' },
            openDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            isSealed: false,
            contents: [],
            viewCount: 0,
            createdAt: new Date().toISOString(),
          },
        ],
        upcoming: [],
        totalCapsules: 1,
      };
      setCapsuleData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCapsuleData();
  }, [loadCapsuleData]);

  const handleCreateCapsule = async (capsuleData: CapsuleCreationData) => {
    try {
      const response = await fetch('/api/time-capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(capsuleData),
      });

      if (!response.ok) {
        throw new Error('Failed to create time capsule');
      }

      await loadCapsuleData();
      setShowCreateForm(false);
      alert('Time capsule created successfully!');
    } catch (err) {
      alert('Failed to create time capsule. Please try again.');
      console.error('Capsule creation error:', err);
    }
  };

  const handleOpenCapsule = async (capsuleId: string) => {
    try {
      const response = await fetch(`/api/time-capsules/${capsuleId}/open`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to open time capsule');
      }

      await loadCapsuleData();
      alert('Time capsule opened! 🎉');
    } catch (err) {
      alert('Failed to open time capsule. Please try again.');
      console.error('Capsule opening error:', err);
    }
  };

  if (loading) {
    return (
      <div className="capsule-loading">
        <div className="loading-spinner"></div>
        <p>Loading time capsules...</p>
      </div>
    );
  }

  if (error && !capsuleData) {
    return (
      <div className="capsule-error">
        <h2>Unable to load time capsules</h2>
        <p>{error}</p>
        <button onClick={loadCapsuleData}>Try Again</button>
      </div>
    );
  }

  const capsules = capsuleData?.capsules || [];
  const upcoming = capsuleData?.upcoming || [];

  return (
    <div className="time-capsule-page">
      <div className="capsule-header">
        <h1>⏰ Digital Time Capsules</h1>
        <p>Preserve memories to be discovered in the future</p>
      </div>

      <div className="capsule-actions">
        <div>
          <h3>Total Capsules: {capsuleData?.totalCapsules || 0}</h3>
        </div>
        <button className="create-capsule-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          🕰️ Create Time Capsule
        </button>
      </div>

      {showCreateForm && (
        <CapsuleCreationForm
          onSubmit={handleCreateCapsule}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {upcoming.length > 0 && (
        <div className="upcoming-section">
          <div className="section-header">
            <h2>⏳ Opening Soon</h2>
            <p>These capsules are ready to be opened!</p>
          </div>

          <div className="upcoming-grid">
            {upcoming.map((capsule) => {
              const openDate = new Date(capsule.openDate);
              const now = new Date();
              const canOpen = openDate <= now;
              const daysUntil = Math.ceil(
                (openDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={capsule.id} className="upcoming-capsule">
                  <div className="countdown-display">
                    <div className="countdown-number">{canOpen ? '🎉' : daysUntil}</div>
                    <div className="countdown-label">
                      {canOpen ? 'Ready to Open!' : `Days Until Opening`}
                    </div>
                  </div>

                  <div className="capsule-title">{capsule.title}</div>
                  <div className="capsule-description">{capsule.description}</div>

                  <div className="capsule-meta">
                    <span>By {capsule.creator.name}</span>
                    <span>{capsule.contents.length} items</span>
                  </div>

                  {canOpen && (
                    <button
                      className="capsule-btn primary"
                      onClick={() => handleOpenCapsule(capsule.id)}
                      style={{ marginTop: '1rem', width: '100%' }}
                    >
                      🔓 Open Capsule
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="all-capsules">
        <div className="section-header">
          <h2>All Time Capsules</h2>
          <p>Your collection of preserved memories</p>
        </div>

        <div className="capsules-grid">
          {capsules.map((capsule) => {
            const openDate = new Date(capsule.openDate);
            const now = new Date();
            const canOpen = openDate <= now && !capsule.openedAt;
            const isOpened = !!capsule.openedAt;

            return (
              <div
                key={capsule.id}
                className={`capsule-card ${capsule.isSealed ? 'sealed' : ''} ${canOpen ? 'openable' : ''}`}
              >
                <div className={`capsule-status ${getCapsuleStatusClass(isOpened, canOpen)}`}>
                  {getCapsuleStatusText(isOpened, canOpen)}
                </div>

                <div className="capsule-title">{capsule.title}</div>
                <div className="capsule-description">{capsule.description}</div>

                <div className="capsule-content-count">
                  📦 {capsule.contents.length} items preserved
                </div>

                <div className="capsule-meta">
                  <span>Created by {capsule.creator.name}</span>
                  <span>Opens: {openDate.toLocaleDateString()}</span>
                </div>

                <div className="capsule-actions-row">
                  <button
                    className="capsule-btn secondary"
                    onClick={() => setSelectedCapsule(capsule)}
                  >
                    👁️ View
                  </button>

                  {canOpen && (
                    <button
                      className="capsule-btn primary"
                      onClick={() => handleOpenCapsule(capsule.id)}
                    >
                      🔓 Open
                    </button>
                  )}

                  {!capsule.isSealed && !isOpened && (
                    <button className="capsule-btn secondary">➕ Add Content</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCapsule && (
        <CapsuleModal capsule={selectedCapsule} onClose={() => setSelectedCapsule(null)} />
      )}
    </div>
  );
}

function CapsuleCreationForm({
  onSubmit,
  onCancel,
}: {
  readonly onSubmit: (data: CapsuleCreationData) => void;
  readonly onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    openDate: '',
    creator: {
      name: '',
      email: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('creator.')) {
      const creatorField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        creator: {
          ...prev.creator,
          [creatorField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="creation-form">
      <div className="form-header">
        <h3>Create Time Capsule</h3>
        <p>Preserve memories for the future</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="capsule-title-1">
            Capsule Title *
          </label>
          <input
            id="capsule-title-1"
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Give your time capsule a meaningful name..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="capsule-description" className="form-label">
            Description
          </label>
          <textarea
            id="capsule-description"
            className="form-textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What memories will this capsule contain?"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="opening-date-2">
            Opening Date *
          </label>
          <input
            id="opening-date-2"
            type="date"
            className="form-input"
            value={formData.openDate}
            onChange={(e) => handleChange('openDate', e.target.value)}
            min={minDate}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="your-name-3">
            Your Name *
          </label>
          <input
            id="your-name-3"
            type="text"
            className="form-input"
            value={formData.creator.name}
            onChange={(e) => handleChange('creator.name', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email-4">
            Email *
          </label>
          <input
            id="email-4"
            type="email"
            className="form-input"
            value={formData.creator.email}
            onChange={(e) => handleChange('creator.email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="form-btn primary">
            Create Capsule
          </button>
          <button type="button" className="form-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function CapsuleModal({
  capsule,
  onClose,
}: {
  readonly capsule: TimeCapsule;
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
          <h3 style={{ color: '#8B7A8A', margin: 0 }}>{capsule.title}</h3>
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

        <p style={{ color: '#666', marginBottom: '1rem' }}>{capsule.description}</p>

        <div
          style={{
            background: '#F7FAFC',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          <strong>Opening Date:</strong> {new Date(capsule.openDate).toLocaleDateString()}
          <br />
          <strong>Created by:</strong> {capsule.creator.name}
          <br />
          <strong>Contents:</strong> {capsule.contents.length} items
        </div>

        {capsule.contents.length > 0 && (
          <div>
            <h4 style={{ color: '#8B7A8A' }}>Contents:</h4>
            {capsule.contents.map((content) => (
              <div
                key={content.id}
                style={{
                  background: '#F7FAFC',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                }}
              >
                <strong>{content.type}:</strong> {content.content}
                <br />
                <small style={{ color: '#666' }}>By {content.author}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
