import { useState } from 'react';

/**
 * 🌳 Family Legacy Builder Component
 * Create and maintain family history and legacy content
 */
const FamilyLegacyBuilder = () => {
  const [familyData, setFamilyData] = useState({
    couples: [
      {
        id: 'austin_jordyn',
        names: ['Austin Porada', 'Jordyn Porada'],
        weddingDate: '2025-06-14',
        story: '',
        photos: [],
        isMainCouple: true,
      },
    ],
    individuals: [],
    stories: [],
    traditions: [],
    timeline: [],
  });

  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const sections = [
    { id: 'overview', label: '🏠 Family Overview', icon: '🏠' },
    { id: 'tree', label: '🌳 Family Tree', icon: '🌳' },
    { id: 'stories', label: '📖 Family Stories', icon: '📖' },
    { id: 'traditions', label: '🎋 Traditions', icon: '🎋' },
    { id: 'timeline', label: '📅 Family Timeline', icon: '📅' },
    { id: 'legacy', label: '💎 Legacy Archive', icon: '💎' },
  ];

  const addFamilyStory = (story) => {
    const newStory = {
      id: `story_${Date.now()}`,
      title: story.title,
      content: story.content,
      author: story.author,
      date: story.date || new Date().toISOString(),
      category: story.category || 'memory',
      photos: story.photos || [],
    };

    setFamilyData((prev) => ({
      ...prev,
      stories: [...prev.stories, newStory],
    }));
  };

  const addTradition = (tradition) => {
    const newTradition = {
      id: `tradition_${Date.now()}`,
      name: tradition.name,
      description: tradition.description,
      origin: tradition.origin,
      whenPracticed: tradition.whenPracticed,
      participants: tradition.participants || ['Austin & Jordyn'],
      photos: tradition.photos || [],
    };

    setFamilyData((prev) => ({
      ...prev,
      traditions: [...prev.traditions, newTradition],
    }));
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="main-couple-card">
        <h2>💕 Austin & Jordyn Porada</h2>
        <div className="wedding-info">
          <p>
            <strong>Wedding Date:</strong> June 14, 2025
          </p>
          <p>
            <strong>Anniversary:</strong>{' '}
            {Math.floor((new Date() - new Date('2025-06-14')) / (1000 * 60 * 60 * 24))} days married
          </p>
        </div>

        <div className="family-stats">
          <div className="stat">
            <div className="stat-number">{familyData.stories.length}</div>
            <div className="stat-label">Family Stories</div>
          </div>
          <div className="stat">
            <div className="stat-number">{familyData.traditions.length}</div>
            <div className="stat-label">Family Traditions</div>
          </div>
          <div className="stat">
            <div className="stat-number">{familyData.timeline.length}</div>
            <div className="stat-label">Timeline Events</div>
          </div>
        </div>

        <div className="quick-actions">
          <button onClick={() => setActiveSection('stories')}>📖 Add Family Story</button>
          <button onClick={() => setActiveSection('traditions')}>🎋 Add Tradition</button>
          <button onClick={() => setActiveSection('timeline')}>📅 Add Timeline Event</button>
        </div>
      </div>
    </div>
  );

  const renderFamilyTree = () => (
    <div className="family-tree-section">
      <h2>🌳 Porada Family Tree</h2>

      <div className="tree-container">
        <div className="generation-label">Current Generation</div>
        <div className="couple-node main-couple">
          <div className="person austin">
            <div className="person-photo">👨</div>
            <div className="person-name">Austin Porada</div>
            <div className="person-details">Groom</div>
          </div>
          <div className="heart">💕</div>
          <div className="person jordyn">
            <div className="person-photo">👩</div>
            <div className="person-name">Jordyn Porada</div>
            <div className="person-details">Bride</div>
          </div>
        </div>

        <div className="add-family-section">
          <button className="add-family-btn">➕ Add Family Members</button>
          <p>Build your family tree by adding parents, siblings, and future children</p>
        </div>
      </div>
    </div>
  );

  const renderStories = () => (
    <div className="stories-section">
      <div className="section-header">
        <h2>📖 Family Stories</h2>
        <button className="add-btn" onClick={() => setIsEditing('story')}>
          ➕ Add Story
        </button>
      </div>

      {isEditing === 'story' && (
        <div className="add-form">
          <h3>Add New Family Story</h3>
          <StoryForm onSubmit={addFamilyStory} onCancel={() => setIsEditing(false)} />
        </div>
      )}

      <div className="stories-grid">
        {familyData.stories.map((story) => (
          <div key={story.id} className="story-card">
            <h3>{story.title}</h3>
            <div className="story-meta">
              By {story.author} • {new Date(story.date).toLocaleDateString()}
            </div>
            <p>{story.content}</p>
            <div className="story-category">{story.category}</div>
          </div>
        ))}

        {familyData.stories.length === 0 && (
          <div className="empty-state">
            <p>Start building your family's story collection!</p>
            <button onClick={() => setIsEditing('story')}>📖 Add First Story</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderTraditions = () => (
    <div className="traditions-section">
      <div className="section-header">
        <h2>🎋 Family Traditions</h2>
        <button className="add-btn" onClick={() => setIsEditing('tradition')}>
          ➕ Add Tradition
        </button>
      </div>

      {isEditing === 'tradition' && (
        <div className="add-form">
          <h3>Add New Family Tradition</h3>
          <TraditionForm onSubmit={addTradition} onCancel={() => setIsEditing(false)} />
        </div>
      )}

      <div className="traditions-grid">
        {familyData.traditions.map((tradition) => (
          <div key={tradition.id} className="tradition-card">
            <h3>{tradition.name}</h3>
            <p>
              <strong>Origin:</strong> {tradition.origin}
            </p>
            <p>
              <strong>When:</strong> {tradition.whenPracticed}
            </p>
            <p>{tradition.description}</p>
            <div className="participants">
              <strong>Participants:</strong> {tradition.participants.join(', ')}
            </div>
          </div>
        ))}

        {familyData.traditions.length === 0 && (
          <div className="empty-state">
            <p>Document your family traditions and customs!</p>
            <button onClick={() => setIsEditing('tradition')}>🎋 Add First Tradition</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="family-legacy-builder">
      <style>{`
        .family-legacy-builder {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
        }

        .legacy-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .legacy-header h1 {
          color: #8b7a8a;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .navigation {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .nav-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .nav-btn.active {
          border-color: #8b7a8a;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .nav-btn:hover {
          border-color: #8b7a8a;
        }

        .main-couple-card {
          background: linear-gradient(135deg, #f8f6f8, #ffffff);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(139, 122, 138, 0.1);
          text-align: center;
        }

        .main-couple-card h2 {
          color: #8b7a8a;
          margin-bottom: 1rem;
        }

        .wedding-info {
          margin-bottom: 2rem;
          color: #666;
        }

        .family-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }

        .stat {
          text-align: center;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #8b7a8a;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          text-transform: uppercase;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .quick-actions button {
          padding: 1rem;
          border: 2px solid #d4a574;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .quick-actions button:hover {
          background: #d4a574;
          color: white;
        }

        .tree-container {
          text-align: center;
          padding: 2rem;
        }

        .generation-label {
          color: #8b7a8a;
          font-weight: bold;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .couple-node {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin: 2rem 0;
        }

        .person {
          text-align: center;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          min-width: 150px;
        }

        .person-photo {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .person-name {
          font-weight: bold;
          color: #8b7a8a;
          margin-bottom: 0.25rem;
        }

        .person-details {
          color: #666;
          font-size: 0.9rem;
        }

        .heart {
          font-size: 2rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .add-family-section {
          margin-top: 3rem;
          padding: 2rem;
          border: 2px dashed #d4a574;
          border-radius: 12px;
          text-align: center;
          color: #666;
        }

        .add-family-btn {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          color: #8b7a8a;
          margin: 0;
        }

        .add-btn {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .add-form {
          background: #f9f9f9;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .stories-grid,
        .traditions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .story-card,
        .tradition-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #d4a574;
        }

        .story-card h3,
        .tradition-card h3 {
          color: #8b7a8a;
          margin-bottom: 1rem;
        }

        .story-meta {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .story-category {
          display: inline-block;
          background: #d4a574;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          margin-top: 1rem;
        }

        .participants {
          margin-top: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
          grid-column: 1 / -1;
        }

        .empty-state button {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }
      `}</style>

      <div className="legacy-header">
        <h1>🌳 Porada Family Legacy</h1>
        <p>Building a digital legacy for future generations</p>
      </div>

      <div className="navigation">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span>{section.icon}</span>
            <span>{section.label.split(' ').slice(1).join(' ')}</span>
          </button>
        ))}
      </div>

      <div className="content-area">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'tree' && renderFamilyTree()}
        {activeSection === 'stories' && renderStories()}
        {activeSection === 'traditions' && renderTraditions()}
      </div>
    </div>
  );
};

// Helper Components
const StoryForm = ({ onSubmit, onCancel }) => {
  const [story, setStory] = useState({
    title: '',
    content: '',
    author: '',
    category: 'memory',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(story);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Story Title"
        value={story.title}
        onChange={(e) => setStory((prev) => ({ ...prev, title: e.target.value }))}
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={story.author}
        onChange={(e) => setStory((prev) => ({ ...prev, author: e.target.value }))}
        required
      />
      <select
        value={story.category}
        onChange={(e) => setStory((prev) => ({ ...prev, category: e.target.value }))}
      >
        <option value="memory">Memory</option>
        <option value="milestone">Milestone</option>
        <option value="funny">Funny Story</option>
        <option value="achievement">Achievement</option>
      </select>
      <textarea
        placeholder="Tell your story..."
        value={story.content}
        onChange={(e) => setStory((prev) => ({ ...prev, content: e.target.value }))}
        rows="5"
        required
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit">Add Story</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const TraditionForm = ({ onSubmit, onCancel }) => {
  const [tradition, setTradition] = useState({
    name: '',
    description: '',
    origin: '',
    whenPracticed: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tradition);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Tradition Name"
        value={tradition.name}
        onChange={(e) => setTradition((prev) => ({ ...prev, name: e.target.value }))}
        required
      />
      <input
        type="text"
        placeholder="Origin/History"
        value={tradition.origin}
        onChange={(e) => setTradition((prev) => ({ ...prev, origin: e.target.value }))}
        required
      />
      <input
        type="text"
        placeholder="When practiced (e.g., Every Christmas, Annually)"
        value={tradition.whenPracticed}
        onChange={(e) => setTradition((prev) => ({ ...prev, whenPracticed: e.target.value }))}
        required
      />
      <textarea
        placeholder="Describe the tradition..."
        value={tradition.description}
        onChange={(e) => setTradition((prev) => ({ ...prev, description: e.target.value }))}
        rows="4"
        required
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit">Add Tradition</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default FamilyLegacyBuilder;
