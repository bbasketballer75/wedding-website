'use client';

import React, { useCallback, useEffect, useState } from 'react';

interface LegacyEntryData {
  title: string;
  content: string;
  category: string;
  generation: string;
  author: {
    name: string;
    email: string;
    relationship: string;
  };
  tags: string[];
  isPrivate: boolean;
}

interface LegacyEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  generation: string;
  author: {
    name: string;
    email: string;
    relationship: string;
  };
  tags: string[];
  mediaUrls: string[];
  isPrivate: boolean;
  status: string;
  createdAt: string;
  viewCount: number;
  favoriteCount: number;
}

interface Relationship {
  id: string;
  from: string;
  to: string;
  type: string;
  description?: string;
}

interface FamilyTreeData {
  generations: Record<string, LegacyEntry[]>;
  relationships: Relationship[];
  timeline: LegacyEntry[];
}

interface LegacyData {
  entries: LegacyEntry[];
  familyTree: FamilyTreeData;
  stats: {
    totalEntries: number;
    categories: Record<string, number>;
    generations: Record<string, number>;
    topContributors: Array<{ name: string; count: number }>;
  };
}

/**
 * 🏗️ Family Legacy Builder Page
 * Preserve family heritage and traditions
 */
export default function FamilyLegacyPage() {
  const [legacyData, setLegacyData] = useState<LegacyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<'entries' | 'tree' | 'timeline'>('entries');

  const loadLegacyData = useCallback(async () => {
    try {
      setLoading(true);

      const [entriesResponse, treeResponse, statsResponse] = await Promise.all([
        fetch('/api/family-legacy'),
        fetch('/api/family-legacy/family-tree'),
        fetch('/api/family-legacy/stats'),
      ]);

      if (!entriesResponse.ok || !treeResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to load family legacy data');
      }

      const [entriesResult, treeResult, statsResult] = await Promise.all([
        entriesResponse.json(),
        treeResponse.json(),
        statsResponse.json(),
      ]);

      setLegacyData({
        entries: entriesResult.data.entries || [],
        familyTree: treeResult.data || { generations: {}, relationships: [], timeline: [] },
        stats: statsResult.data || {
          totalEntries: 0,
          categories: {},
          generations: {},
          topContributors: [],
        },
      });

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback data
      const fallbackData = {
        entries: [
          {
            id: '1',
            title: 'Our Family Story',
            content: 'This is where our beautiful legacy begins...',
            category: 'family_history',
            generation: 'current',
            author: { name: 'Austin Porada', email: 'austin@example.com', relationship: 'husband' },
            tags: ['family', 'heritage'],
            mediaUrls: [],
            isPrivate: false,
            status: 'active',
            createdAt: new Date().toISOString(),
            viewCount: 0,
            favoriteCount: 0,
          },
        ],
        familyTree: { generations: {}, relationships: [], timeline: [] },
        stats: {
          totalEntries: 1,
          categories: { family_history: 1 },
          generations: { current: 1 },
          topContributors: [],
        },
      };
      setLegacyData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLegacyData();
  }, [loadLegacyData]);

  const handleCreateEntry = async (entryData: LegacyEntryData) => {
    try {
      const response = await fetch('/api/family-legacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create legacy entry');
      }

      await loadLegacyData();
      setShowCreateForm(false);
      alert('Family legacy entry created successfully!');
    } catch (err) {
      alert('Failed to create entry. Please try again.');
      console.error('Entry creation error:', err);
    }
  };

  if (loading) {
    return (
      <div className="legacy-loading">
        <div className="loading-spinner"></div>
        <p>Loading family heritage...</p>
      </div>
    );
  }

  if (error && !legacyData) {
    return (
      <div className="legacy-error">
        <h2>Unable to load family legacy</h2>
        <p>{error}</p>
        <button onClick={loadLegacyData}>Try Again</button>
      </div>
    );
  }

  const entries = legacyData?.entries || [];
  const stats = legacyData?.stats || {
    totalEntries: 0,
    categories: {},
    generations: {},
    topContributors: [],
  };
  const filteredEntries = entries.filter((entry) => {
    const categoryMatch = selectedCategory === 'all' || entry.category === selectedCategory;
    const generationMatch = selectedGeneration === 'all' || entry.generation === selectedGeneration;
    return categoryMatch && generationMatch;
  });

  return (
    <div className="family-legacy-page">
      <style>{`
        .family-legacy-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #f8f6f8 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .legacy-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          border-radius: 16px;
          color: white;
        }

        .legacy-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .legacy-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .view-mode-tabs {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 0.25rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .view-tab {
          background: transparent;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .view-tab.active {
          background: #8b7a8a;
          color: white;
        }

        .view-tab:hover {
          background: #f0f0f0;
        }

        .view-tab.active:hover {
          background: #8b7a8a;
        }

        .filters {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #8b7a8a;
        }

        .create-btn {
          background: linear-gradient(135deg, #d4a574, #8b7a8a);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 122, 138, 0.3);
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

        .entries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .entry-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          border-left: 4px solid #8b7a8a;
        }

        .entry-card:hover {
          transform: translateY(-4px);
        }

        .entry-header {
          margin-bottom: 1rem;
        }

        .entry-title {
          color: #8b7a8a;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .entry-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .entry-category {
          background: #f7fafc;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #8b7a8a;
        }

        .entry-content {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .entry-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .entry-tag {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .entry-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .entry-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .entry-btn.primary {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
        }

        .entry-btn.secondary {
          background: transparent;
          border: 1px solid #8b7a8a;
          color: #8b7a8a;
        }

        .entry-btn:hover {
          transform: translateY(-1px);
        }

        .family-tree-view {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .tree-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .tree-header h3 {
          color: #8b7a8a;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .generations-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .generation-section {
          padding: 1.5rem;
          background: #f7fafc;
          border-radius: 12px;
          border-left: 4px solid #d4a574;
        }

        .generation-title {
          color: #8b7a8a;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-transform: capitalize;
        }

        .generation-entries {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .generation-entry {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .timeline-view {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .timeline-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .timeline-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-left: 2rem;
          border-left: 2px solid #d4a574;
          position: relative;
        }

        .timeline-item::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 0;
          width: 10px;
          height: 10px;
          background: #8b7a8a;
          border-radius: 50%;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-date {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .creation-form {
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
          min-height: 120px;
          resize: vertical;
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

        .legacy-loading {
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

        .legacy-error {
          text-align: center;
          padding: 3rem;
          color: #e53e3e;
        }

        .legacy-error button {
          background: #8b7a8a;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .family-legacy-page {
            padding: 1rem;
          }

          .legacy-header h1 {
            font-size: 2rem;
          }

          .legacy-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .view-mode-tabs {
            justify-content: center;
          }

          .entries-grid {
            grid-template-columns: 1fr;
          }

          .stats-overview {
            grid-template-columns: repeat(2, 1fr);
          }

          .generation-entries {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="legacy-header">
        <h1>🏗️ Family Legacy Builder</h1>
        <p>Preserving our heritage for future generations</p>
      </div>

      <div className="legacy-controls">
        <div className="view-mode-tabs">
          <button
            className={`view-tab ${viewMode === 'entries' ? 'active' : ''}`}
            onClick={() => setViewMode('entries')}
          >
            📝 All Entries
          </button>
          <button
            className={`view-tab ${viewMode === 'tree' ? 'active' : ''}`}
            onClick={() => setViewMode('tree')}
          >
            🌳 Family Tree
          </button>
          <button
            className={`view-tab ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            ⏰ Timeline
          </button>
        </div>

        <div className="filters">
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.keys(stats.categories).map((category) => (
              <option key={category} value={category}>
                {category.replace('_', ' ').toUpperCase()} ({stats.categories[category]})
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedGeneration}
            onChange={(e) => setSelectedGeneration(e.target.value)}
          >
            <option value="all">All Generations</option>
            {Object.keys(stats.generations).map((generation) => (
              <option key={generation} value={generation}>
                {generation.toUpperCase()} ({stats.generations[generation]})
              </option>
            ))}
          </select>
        </div>

        <button className="create-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          ✍️ Add Legacy Entry
        </button>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-number">{stats.totalEntries}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Object.keys(stats.categories).length}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Object.keys(stats.generations).length}</div>
          <div className="stat-label">Generations</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.topContributors.length}</div>
          <div className="stat-label">Contributors</div>
        </div>
      </div>

      {showCreateForm && (
        <LegacyCreationForm
          onSubmit={handleCreateEntry}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {viewMode === 'entries' && (
        <div className="entries-grid">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <div className="entry-title">{entry.title}</div>
                <div className="entry-meta">
                  <span>By {entry.author.name}</span>{' '}
                  <span className="entry-category">{entry.category.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="entry-content">{entry.content}</div>

              {entry.tags.length > 0 && (
                <div className="entry-tags">
                  {entry.tags.slice(0, 4).map((tag, index) => (
                    <span key={`${entry.id || 'tag'}-${tag}-${index}`} className="entry-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="entry-actions">
                <button className="entry-btn secondary">👁️ Read More</button>
                <button className="entry-btn secondary">❤️ {entry.favoriteCount}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'tree' && (
        <div className="family-tree-view">
          <div className="tree-header">
            <h3>🌳 Family Heritage Tree</h3>
            <p>Organized by generations and relationships</p>
          </div>

          <div className="generations-view">
            {Object.entries(legacyData?.familyTree.generations || {}).map(
              ([generation, generationEntries]) => (
                <div key={generation} className="generation-section">
                  <div className="generation-title">{generation} Generation</div>
                  <div className="generation-entries">
                    {generationEntries.map((entry) => (
                      <div key={entry.id} className="generation-entry">
                        <div
                          style={{ fontWeight: 'bold', color: '#8B7A8A', marginBottom: '0.5rem' }}
                        >
                          {entry.title}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          By {entry.author.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {viewMode === 'timeline' && (
        <div className="timeline-view">
          <div className="timeline-header">
            <h3>⏰ Family Legacy Timeline</h3>
            <p>Chronological journey through our heritage</p>
          </div>

          {legacyData?.familyTree.timeline.map((entry) => (
            <div key={entry.id} className="timeline-item">
              <div className="timeline-content">
                <div className="timeline-date">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </div>
                <div className="entry-title" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {entry.title}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  By {entry.author.name} • {entry.category.replace('_', ' ')}
                </div>
                <div style={{ color: '#4A5568', lineHeight: 1.6 }}>
                  {entry.content.substring(0, 200)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LegacyCreationForm({
  onSubmit,
  onCancel,
}: {
  readonly onSubmit: (data: LegacyEntryData) => void;
  readonly onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'family_history',
    generation: 'current',
    author: {
      name: '',
      email: '',
      relationship: '',
    },
    tags: '',
    isPrivate: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };
    onSubmit(submissionData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    if (field.startsWith('author.')) {
      const authorField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="creation-form">
      <div className="form-header">
        <h3>Add to Family Legacy</h3>
        <p>Share a piece of our family heritage</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="legacy-title" className="form-label">
            Title *
          </label>
          <input
            id="legacy-title"
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Give your legacy entry a meaningful title..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="legacy-content" className="form-label">
            Content *
          </label>
          <textarea
            className="form-textarea"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Share your story, tradition, recipe, or family wisdom..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category-1">
            Category
          </label>
          <select
            id="category-1"
            className="form-select"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="family_history">Family History</option>
            <option value="traditions">Traditions</option>
            <option value="recipes">Recipes</option>
            <option value="stories">Stories</option>
            <option value="wisdom">Wisdom</option>
            <option value="achievements">Achievements</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="generation-2">
            Generation
          </label>
          <select
            id="generation-2"
            className="form-select"
            value={formData.generation}
            onChange={(e) => handleChange('generation', e.target.value)}
          >
            <option value="current">Current</option>
            <option value="parents">Parents</option>
            <option value="grandparents">Grandparents</option>
            <option value="great_grandparents">Great Grandparents</option>
            <option value="ancestors">Ancestors</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="your-name-3">
            Your Name *
          </label>
          <input
            id="your-name-3"
            type="text"
            className="form-input"
            value={formData.author.name}
            onChange={(e) => handleChange('author.name', e.target.value)}
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
            value={formData.author.email}
            onChange={(e) => handleChange('author.email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="your-relationship-5">
            Your Relationship
          </label>
          <select
            id="your-relationship-5"
            className="form-select"
            value={formData.author.relationship}
            onChange={(e) => handleChange('author.relationship', e.target.value)}
          >
            <option value="">Select relationship...</option>
            <option value="family_member">Family Member</option>
            <option value="spouse">Spouse</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="grandparent">Grandparent</option>
            <option value="cousin">Cousin</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tags-comma-separated-6">
            Tags (comma-separated)
          </label>
          <input
            id="tags-comma-separated-6"
            type="text"
            className="form-input"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="family, heritage, tradition, love..."
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={formData.isPrivate}
              onChange={(e) => handleChange('isPrivate', e.target.checked)}
            />
            Keep this entry private (family only)
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="form-btn primary">
            Add to Legacy
          </button>
          <button type="button" className="form-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
