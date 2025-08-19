import { useEffect, useState } from 'react';
import styles from './WeddingMemoryVault.module.css';

/**
 * 🏛️ Wedding Memory Vault Component
 * Professional archival system for wedding memories and media
 */

// Type definitions
interface Subcategory {
  label: string;
  count: number;
}

interface Category {
  icon: string;
  label: string;
  color: string;
  subcategories: Record<string, Subcategory>;
}

type CategoryKey = 'photos' | 'videos' | 'documents' | 'audio';
type ActiveCategory = 'overview' | CategoryKey;

const WeddingMemoryVault = () => {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('overview');
  const [activeSubcategory, setActiveSubcategory] = useState('professional');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && showUploadModal) {
        setShowUploadModal(false);
      }
    };

    if (showUploadModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showUploadModal]);

  // Category structure with proper typing
  const categories: Record<CategoryKey, Category> = {
    photos: {
      icon: '📸',
      label: 'Photos',
      color: '#9caf88',
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
      color: '#c4a484',
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
      color: '#8fa0a6',
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
      color: '#d4a574',
      subcategories: {
        music: { label: 'Ceremony Music', count: 12 },
        speeches: { label: 'Speech Recordings', count: 15 },
        ambient: { label: 'Ambient Sounds', count: 8 },
      },
    },
  };

  // Vault statistics
  const vaultStats = {
    totalItems: '1,247',
    totalSize: '15.6 GB',
    backupStatus: 'Synced',
    lastUpdate: '2 hours ago',
  };

  const renderVaultOverview = () => (
    <div className={styles.vaultOverview}>
      <div className={styles.vaultStatsBanner}>
      <div className={styles.stat}>
      <div className={styles.statIcon}>📊</div>
      <div className={styles.statContent}>
      <div className={styles.statNumber}>{vaultStats.totalItems}</div>
      <div className={styles.statLabel}>Total Items</div>
      </div>
      </div>
      <div className={styles.stat}>
      <div className={styles.statIcon}>💾</div>
      <div className={styles.statContent}>
      <div className={styles.statNumber}>{vaultStats.totalSize}</div>
      <div className={styles.statLabel}>Storage Used</div>
      </div>
      </div>
      <div className={styles.stat}>
      <div className={styles.statIcon}>☁️</div>
      <div className={styles.statContent}>
      <div className={styles.statNumber}>{vaultStats.backupStatus}</div>
      <div className={styles.statLabel}>Backup Status</div>
      </div>
      </div>
      <div className={styles.stat}>
      <div className={styles.statIcon}>⏰</div>
      <div className={styles.statContent}>
      <div className={styles.statNumber}>{vaultStats.lastUpdate}</div>
      <div className={styles.statLabel}>Last Updated</div>
      </div>
      </div>
      </div>
      <div className={styles.categoriesOverview}>
      <h3>🗂️ Categories Overview</h3>
      <div className={styles.categoriesGrid}>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              className={styles.categoryOverviewCard}
              onClick={() => {
                setActiveCategory(key as CategoryKey);
                setActiveSubcategory(Object.keys(category.subcategories)[0]);
              }}
              type="button"
              aria-label={`View ${category.label} category`}
            >
      <div className={styles.categoryIcon} style={{ color: category.color }}>
                {category.icon}
              </div>
      <h4>{category.label}</h4>
      <div className={styles.categoryStats}>
                {Object.values(category.subcategories).reduce((sum, sub) => sum + sub.count, 0)}{' '}
                items
              </div>
      <div className={styles.subcategoriesList}>
                {Object.entries(category.subcategories).map(([subKey, sub]) => (
                  <div key={subKey} className={styles.subcategoryItem}>
      <span>{sub.label}</span>
      <span className="count">{sub.count}</span>
      </div>
                ))}
              </div>
      </button>
          ))}
        </div>
      </div>
      </div>
  );

  const renderCategoryBrowser = () => {
    if (activeCategory === 'overview') return null;

    const currentCategory = categories[activeCategory];
    const currentSubcategory = currentCategory.subcategories[activeSubcategory];

    return (
      <div className={styles.categoryBrowser}>
      <div className={styles.browserHeader}>
      <div className={styles.categoryNavigation}>
      <h2>
      <span style={{ color: currentCategory.color }}>{currentCategory.icon}</span>
              {currentCategory.label} / {currentSubcategory.label}
            </h2>
      <div className={styles.subcategoryTabs}>
              {Object.entries(currentCategory.subcategories).map(([key, sub]) => (
                <button
                  key={key}
                  className={`${styles.subcategoryTab} ${activeSubcategory === key ? styles.active : ''}`}
                  onClick={() => setActiveSubcategory(key)}
                >
                  {sub.label} ({sub.count})
                </button>
              ))}
            </div>
      </div>
      <div className={styles.browserControls}>
      <div className={styles.searchContainer}>
      <input
                type="text"
                placeholder="🔍 Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
      />
      </div>
      <div className={styles.viewControls}>
      <button
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞ Grid
              </button>
      <button
                className={`${styles.viewBtn} ${viewMode === 'timeline' ? styles.active : ''}`}
                onClick={() => setViewMode('timeline')}
              >
                📅 Timeline
              </button>
      </div>
      <button className={styles.uploadBtn} onClick={() => setShowUploadModal(true)}>
              📤 Upload Memory
            </button>
      </div>
      </div>
      <div className={styles.itemsContainer}>
          {currentSubcategory.count > 0 ? (
            <div className={styles[`items${viewMode === 'grid' ? 'Grid' : 'Timeline'}`]}>
              {/* Sample items - replace with real data */}
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className={styles.memoryItem}>
      <div className={styles.itemThumbnail}>
      <div className={styles.placeholderContent}>{currentCategory.icon}</div>
      </div>
      <div className={styles.itemInfo}>
      <h4>Memory {i + 1}</h4>
      <p>Added 2 days ago</p>
      </div>
      </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{currentCategory.icon}</div>
      <h3>No {currentSubcategory.label} Yet</h3>
      <p>Upload your first memory to get started!</p>
      <button className={styles.uploadFirstBtn} onClick={() => setShowUploadModal(true)}>
                📤 Upload First Memory
              </button>
      </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className={styles.weddingMemoryVault}>
      {/* Header */}
      <div className={styles.vaultHeader}>
      <div className={styles.headerContent}>
      <h1>🏛️ Wedding Memory Vault</h1>
      <p>Your precious wedding memories, professionally archived and organized</p>
      </div>
      </div>

      {/* Navigation */}
      <div className={styles.vaultNavigation}>
      <button
          className={`${styles.navTab} ${activeCategory === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveCategory('overview')}
        >
          📊 Overview
        </button>
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`${styles.navTab} ${activeCategory === key ? styles.active : ''}`}
            onClick={() => {
              setActiveCategory(key as CategoryKey);
              setActiveSubcategory(Object.keys(category.subcategories)[0]);
            }}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.vaultContent}>
        {activeCategory === 'overview' ? renderVaultOverview() : renderCategoryBrowser()}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.uploadModalOverlay}>
      <dialog className={styles.uploadModal} open aria-labelledby="upload-modal-title">
      <h2 id="upload-modal-title">📤 Upload Memory</h2>
      <p>Upload your wedding memories to the vault</p>
      <div className={styles.uploadForm}>
      <input type="file" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />
      <button type="button">Upload Files</button>
      </div>
      <button type="button" onClick={() => setShowUploadModal(false)}>
              Close
            </button>
      </dialog>
      </div>
      )}
    </div>
  );
};

export default WeddingMemoryVault;
