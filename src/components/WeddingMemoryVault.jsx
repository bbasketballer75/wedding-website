import styles from '../styles/components/WeddingMemoryVault.module.css';
import { useState } from 'react';

/**
 * 🏛️ Wedding Memory Vault Component
 * Professional archival system for wedding memories and media
 */
const WeddingMemoryVault = () => {
  const [activeCategory, setActiveCategory] = useState('photos');
  const [activeSubcategory, setActiveSubcategory] = useState('professional');
  const [viewMode, setViewMode] = useState('grid'); // grid, timeline, slideshow
  const [searchQuery, setSearchQuery] = useState('');

  const categories = {
    photos: {
      icon: '📸',
      label: 'Photos',
      color: '#E53E3E',
      subcategories: {
        professional: { label: 'Professional Photos', count: 247 },
        guest: { label: 'Guest Photos', count: 189 },
        behindScenes: { label: 'Behind the Scenes', count: 76 },
        reception: { label: 'Reception', count: 156 },
        ceremony: { label: 'Ceremony', count: 98 },
      },
    },
    videos: {
      icon: '🎥',
      label: 'Videos',
      color: '#3182CE',
      subcategories: {
        ceremony: { label: 'Ceremony Video', count: 12 },
        reception: { label: 'Reception Video', count: 18 },
        speeches: { label: 'Speeches', count: 8 },
        highlights: { label: 'Highlight Reels', count: 5 },
      },
    },
    documents: {
      icon: '📄',
      label: 'Documents',
      color: '#38A169',
      subcategories: {
        invitations: { label: 'Invitations', count: 15 },
        programs: { label: 'Programs', count: 8 },
        menus: { label: 'Menus', count: 6 },
        contracts: { label: 'Vendor Contracts', count: 22 },
        planning: { label: 'Planning Documents', count: 45 },
      },
    },
    audio: {
      icon: '🎵',
      label: 'Audio',
      color: '#805AD5',
      subcategories: {
        vows: { label: 'Vows Recording', count: 3 },
        speeches: { label: 'Speech Audio', count: 12 },
        music: { label: 'Wedding Playlist', count: 87 },
        sounds: { label: 'Ambient Sounds', count: 24 },
      },
    },
  };

  const mockItems = {
    photos: {
      professional: [
        {
          id: 'photo_1',
          filename: 'ceremony-kiss.jpg',
          title: 'The First Kiss',
          description: "Austin and Jordyn's first kiss as husband and wife",
          uploadDate: '2025-06-15',
          photographer: 'Sarah Photography',
          location: "St. Mary's Church",
          tags: ['ceremony', 'romantic', 'highlight'],
          fileSize: '2.4 MB',
          dimensions: '4000x6000',
          quality: 'RAW',
          thumbnail: '/api/placeholder/300/200',
        },
        {
          id: 'photo_2',
          filename: 'walking-down-aisle.jpg',
          title: 'Walking Down the Aisle',
          description: 'Jordyn walking down the aisle with her father',
          uploadDate: '2025-06-15',
          photographer: 'Sarah Photography',
          location: "St. Mary's Church",
          tags: ['ceremony', 'emotional', 'family'],
          fileSize: '3.1 MB',
          dimensions: '4000x6000',
          quality: 'RAW',
          thumbnail: '/api/placeholder/300/200',
        },
      ],
    },
    videos: {
      ceremony: [
        {
          id: 'video_1',
          filename: 'full-ceremony.mp4',
          title: 'Complete Wedding Ceremony',
          description: 'Full recording of the wedding ceremony',
          uploadDate: '2025-06-20',
          videographer: 'Eternal Moments Films',
          duration: '45:32',
          fileSize: '1.2 GB',
          quality: '4K',
          thumbnail: '/api/placeholder/300/200',
        },
      ],
    },
  };

  const getVaultStats = () => {
    let totalItems = 0;
    const totalSize = 0;

    Object.keys(categories).forEach((cat) => {
      Object.keys(categories[cat].subcategories).forEach((subcat) => {
        totalItems += categories[cat].subcategories[subcat].count;
      });
    });

    return {
      totalItems,
      totalSize: '12.7 GB',
      lastUpdate: 'Today',
      backupStatus: 'Cloud synced',
    };
  };

  const vaultStats = getVaultStats();

  const renderVaultOverview = () => (
    <div className="vault-overview">
      <div className="vault-stats-banner">
        <div className="stat">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{vaultStats.totalItems}</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <div className="stat-number">{vaultStats.totalSize}</div>
            <div className="stat-label">Storage Used</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon">☁️</div>
          <div className="stat-content">
            <div className="stat-number">{vaultStats.backupStatus}</div>
            <div className="stat-label">Backup Status</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-number">{vaultStats.lastUpdate}</div>
            <div className="stat-label">Last Updated</div>
          </div>
        </div>
      </div>

      <div className="categories-overview">
        <h3>🗂️ Categories Overview</h3>
        <div className="categories-grid">
          {Object.entries(categories).map(([key, category]) => (
            <div
              key={key}
              className="category-overview-card"
              onClick={() => {
                setActiveCategory(key);
                setActiveSubcategory(Object.keys(category.subcategories)[0]);
              }}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h4>{category.label}</h4>
              <div className="category-stats">
                {Object.values(category.subcategories).reduce((sum, sub) => sum + sub.count, 0)}{' '}
                items
              </div>
              <div className="subcategories-list">
                {Object.entries(category.subcategories).map(([subKey, sub]) => (
                  <div key={subKey} className="subcategory-item">
                    <span>{sub.label}</span>
                    <span className="count">{sub.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategoryBrowser = () => (
    <div className="category-browser">
      <div className="browser-header">
        <div className="category-navigation">
          <h2>
            <span style={{ color: categories[activeCategory].color }}>
              {categories[activeCategory].icon}
            </span>
            {categories[activeCategory].label} /{' '}
            {categories[activeCategory].subcategories[activeSubcategory].label}
          </h2>

          <div className="subcategory-tabs">
            {Object.entries(categories[activeCategory].subcategories).map(([key, sub]) => (
              <button
                key={key}
                className={`subcategory-tab ${activeSubcategory === key ? 'active' : ''}`}
                onClick={() => setActiveSubcategory(key)}
              >
                {sub.label} ({sub.count})
              </button>
            ))}
          </div>
        </div>

        <div className="browser-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              📅 Timeline
            </button>
            <button
              className={`view-btn ${viewMode === 'slideshow' ? 'active' : ''}`}
              onClick={() => setViewMode('slideshow')}
            >
              🎭 Slideshow
            </button>
          </div>

          <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
            ⬆️ Upload
          </button>
        </div>
      </div>

      <div className="content-area">
        {viewMode === 'grid' && renderGridView()}
        {viewMode === 'timeline' && renderTimelineView()}
        {viewMode === 'slideshow' && renderSlideshowView()}
      </div>
    </div>
  );

  const renderGridView = () => {
    const items = mockItems[activeCategory]?.[activeSubcategory] || [];

    return (
      <div className="grid-view">
        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-thumbnail">
                <img src={item.thumbnail} alt={item.title} />
                <div className="item-overlay">
                  <button className="preview-btn">👁️</button>
                  <button className="download-btn">⬇️</button>
                  <button className="share-btn">↗️</button>
                </div>
              </div>

              <div className="item-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>

                <div className="item-meta">
                  <div className="meta-row">
                    <span className="meta-label">📅</span>
                    <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                  </div>

                  {item.photographer && (
                    <div className="meta-row">
                      <span className="meta-label">📷</span>
                      <span>{item.photographer}</span>
                    </div>
                  )}

                  {item.videographer && (
                    <div className="meta-row">
                      <span className="meta-label">🎬</span>
                      <span>{item.videographer}</span>
                    </div>
                  )}

                  <div className="meta-row">
                    <span className="meta-label">💾</span>
                    <span>{item.fileSize}</span>
                  </div>

                  {item.dimensions && (
                    <div className="meta-row">
                      <span className="meta-label">📐</span>
                      <span>{item.dimensions}</span>
                    </div>
                  )}

                  {item.duration && (
                    <div className="meta-row">
                      <span className="meta-label">⏱️</span>
                      <span>{item.duration}</span>
                    </div>
                  )}
                </div>

                {item.tags && (
                  <div className="item-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">{categories[activeCategory].icon}</div>
            <h3>
              No {categories[activeCategory].subcategories[activeSubcategory].label.toLowerCase()}{' '}
              yet
            </h3>
            <p>Upload your first {activeCategory.slice(0, -1)} to get started!</p>
            <button className="upload-first-btn" onClick={() => setShowUploadModal(true)}>
              ⬆️ Upload First{' '}
              {activeCategory.slice(0, -1).charAt(0).toUpperCase() + activeCategory.slice(1, -1)}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTimelineView = () => (
    <div className="timeline-view">
      <div className="timeline-container">
        <div className="timeline-item">
          <div className="timeline-date">June 14, 2025</div>
          <div className="timeline-content">
            <h3>🎊 Wedding Day</h3>
            <p>247 photos and 12 videos uploaded</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-date">June 20, 2025</div>
          <div className="timeline-content">
            <h3>📷 Professional Photos Delivered</h3>
            <p>Professional photographer delivered final edited photos</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-date">July 2, 2025</div>
          <div className="timeline-content">
            <h3>🎥 Wedding Video Complete</h3>
            <p>Videographer delivered final ceremony and reception videos</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSlideshowView = () => (
    <div className="slideshow-view">
      <div className="slideshow-container">
        <div className="slideshow-controls">
          <button className="control-btn">⏮️</button>
          <button className="control-btn">⏸️</button>
          <button className="control-btn">⏭️</button>
          <button className="control-btn">🔄</button>
        </div>

        <div className="slideshow-content">
          <img src="/api/placeholder/800/600" alt="Wedding slideshow" />
        </div>

        <div className="slideshow-info">
          <h3>Professional Wedding Photos</h3>
          <p>Photo 1 of 247 • Auto-advance every 5 seconds</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wedding-memory-vault">
      <div className="vault-header">
        <h1>🏛️ Wedding Memory Vault</h1>
        <p>Professional archival system for preserving your wedding memories</p>
      </div>

      <div className="main-navigation">
        <button
          className={`nav-tab ${activeCategory === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveCategory('overview')}
        >
          📊 Overview
        </button>
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`nav-tab ${activeCategory === key ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(key);
              setActiveSubcategory(Object.keys(category.subcategories)[0]);
            }}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      <div className="vault-content">
        {activeCategory === 'overview' ? renderVaultOverview() : renderCategoryBrowser()}
      </div>
    </div>
  );
};

export default WeddingMemoryVault;
