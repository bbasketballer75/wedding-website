'use client';

import React, { useCallback, useEffect, useState } from 'react';
import styles from './MemoryVault.module.css';

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: 'photo' | 'video' | 'audio';
  mimeType: string;
  size: number;
  duration?: number; // for videos/audio
  dimensions?: { width: number; height: number }; // for images/videos
  uploadedBy: {
    name: string;
    email: string;
  };
  caption?: string;
  tags: string[];
  album?: string;
  isPrivate: boolean;
  metadata: {
    camera?: string;
    location?: string;
    takenAt?: string;
    device?: string;
  };
  uploadedAt: string;
  viewCount: number;
  downloadCount: number;
  favoriteCount: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: {
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

interface Album {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  mediaCount: number;
  totalSize: number;
  createdBy: {
    name: string;
    email: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MemoryVaultData {
  media: MediaFile[];
  albums: Album[];
  stats: {
    totalFiles: number;
    totalSize: number;
    photoCount: number;
    videoCount: number;
    audioCount: number;
    albumCount: number;
    totalViews: number;
    popularTags: Array<{ tag: string; count: number }>;
  };
  uploadProgress: Record<string, number>;
}

/**
 * 📸 Memory Vault - Digital Archive
 * Upload, organize, and share photos, videos, and memories
 */
export default function MemoryVaultPage() {
  const [vaultData, setVaultData] = useState<MemoryVaultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'albums' | 'upload' | 'favorites'>(
    'browse'
  );
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const loadVaultData = useCallback(async () => {
    try {
      setLoading(true);

      const [mediaResponse, albumsResponse, statsResponse] = await Promise.all([
        fetch('/api/memory-vault/media'),
        fetch('/api/memory-vault/albums'),
        fetch('/api/memory-vault/stats'),
      ]);

      const [mediaResult, albumsResult, statsResult] = await Promise.all([
        mediaResponse.ok ? mediaResponse.json() : { data: { files: [] } },
        albumsResponse.ok ? albumsResponse.json() : { data: { albums: [] } },
        statsResponse.ok
          ? statsResponse.json()
          : {
              data: {
                totalFiles: 0,
                totalSize: 0,
                photoCount: 0,
                videoCount: 0,
                audioCount: 0,
                albumCount: 0,
                totalViews: 0,
                popularTags: [],
              },
            },
      ]);

      setVaultData({
        media: mediaResult.data?.files || [],
        albums: albumsResult.data?.albums || [],
        stats: statsResult.data || {
          totalFiles: 0,
          totalSize: 0,
          photoCount: 0,
          videoCount: 0,
          audioCount: 0,
          albumCount: 0,
          totalViews: 0,
          popularTags: [],
        },
        uploadProgress: {},
      });

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback data
      const fallbackData = {
        media: [
          {
            id: '1',
            filename: 'sample-photo.jpg',
            originalName: 'Wedding Photo.jpg',
            url: '/images/sample-wedding-photo.jpg',
            type: 'photo' as const,
            mimeType: 'image/jpeg',
            size: 2048000,
            dimensions: { width: 1920, height: 1080 },
            uploadedBy: { name: 'Austin Porada', email: 'austin@example.com' },
            caption: 'Beautiful moment captured',
            tags: ['wedding', 'ceremony', 'love'],
            isPrivate: false,
            metadata: { camera: 'Canon EOS R5', takenAt: new Date().toISOString() },
            uploadedAt: new Date().toISOString(),
            viewCount: 12,
            downloadCount: 3,
            favoriteCount: 8,
            comments: [],
          },
        ],
        albums: [
          {
            id: '1',
            name: 'Wedding Ceremony',
            description: 'Photos from the ceremony',
            mediaCount: 24,
            totalSize: 48000000,
            createdBy: { name: 'Austin Porada', email: 'austin@example.com' },
            isPublic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        stats: {
          totalFiles: 1,
          totalSize: 2048000,
          photoCount: 1,
          videoCount: 0,
          audioCount: 0,
          albumCount: 1,
          totalViews: 12,
          popularTags: [{ tag: 'wedding', count: 1 }],
        },
        uploadProgress: {},
      };
      setVaultData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVaultData();
  }, [loadVaultData]);

  const handleFileUpload = async (files: File[], albumId?: string, tags?: string[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      if (albumId) formData.append('albumId', albumId);
      if (tags) formData.append('tags', JSON.stringify(tags));

      const response = await fetch('/api/memory-vault/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      await loadVaultData();
      setUploadFiles([]);
      alert('Files uploaded successfully!');
    } catch (err) {
      alert('Failed to upload files. Please try again.');
      console.error('Upload error:', err);
    }
  };

  const _handleCreateAlbum = async (albumData: {
    name: string;
    description: string;
    isPublic: boolean;
  }) => {
    try {
      const response = await fetch('/api/memory-vault/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(albumData),
      });

      if (!response.ok) {
        throw new Error('Failed to create album');
      }

      await loadVaultData();
      alert('Album created successfully!');
    } catch (err) {
      alert('Failed to create album. Please try again.');
      console.error('Album creation error:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.vaultLoading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading memory vault...</p>
      </div>
    );
  }

  if (error && !vaultData) {
    return (
      <div className={styles.vaultError}>
        <h2>Unable to load memory vault</h2>
        <p>{error}</p>
        <button onClick={loadVaultData}>Try Again</button>
      </div>
    );
  }

  const data = vaultData!;
  const filteredMedia = data.media.filter((media) => {
    const albumMatch = selectedAlbum === 'all' || media.album === selectedAlbum;
    const typeMatch = selectedType === 'all' || media.type === selectedType;
    return albumMatch && typeMatch;
  });

  return (
    <div className={styles.memoryVaultPage}>
      <div className={styles.vaultHeader}>
        <h1>📸 Memory Vault</h1>
        <p>Your digital archive of precious moments and memories</p>
      </div>

      <div className={styles.navigationTabs}>
        <button
          className={`${styles.navTab} ${activeTab === 'browse' ? styles.active : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          🔍 Browse Media
        </button>
        <button
          className={`${styles.navTab} ${activeTab === 'albums' ? styles.active : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          📁 Albums
        </button>
        <button
          className={`${styles.navTab} ${activeTab === 'upload' ? styles.active : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          ⬆️ Upload
        </button>
        <button
          className={`${styles.navTab} ${activeTab === 'favorites' ? styles.active : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favorites
        </button>
      </div>

      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{data.stats.totalFiles}</div>
          <div className={styles.statLabel}>Total Files</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{formatFileSize(data.stats.totalSize)}</div>
          <div className={styles.statLabel}>Storage Used</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{data.stats.photoCount}</div>
          <div className={styles.statLabel}>Photos</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{data.stats.videoCount}</div>
          <div className={styles.statLabel}>Videos</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{data.stats.audioCount}</div>
          <div className={styles.statLabel}>Audio Files</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{data.stats.albumCount}</div>
          <div className={styles.statLabel}>Albums</div>
        </div>
      </div>

      {activeTab === 'browse' && (
        <>
          <div className="controls-section">
            <div className="filters">
              <select
                className="filter-select"
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
              >
                <option value="all">All Albums</option>
                {data.albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name} ({album.mediaCount})
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="photo">Photos ({data.stats.photoCount})</option>
                <option value="video">Videos ({data.stats.videoCount})</option>
                <option value="audio">Audio ({data.stats.audioCount})</option>
              </select>
            </div>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰
              </button>
            </div>

            <button className="upload-btn" onClick={() => setActiveTab('upload')}>
              ⬆️ Upload Files
            </button>
          </div>

          <div className={`media-grid ${viewMode}`}>
            {filteredMedia.map((media) => (
              <button
                key={media.id}
                className="media-card"
                onClick={() => setSelectedMedia(media)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMedia(media);
                  }
                }}
                aria-label={`View ${media.originalName}`}
                type="button"
              >
                <div className="media-preview">
                  {media.type === 'photo' && media.url && (
                    <img
                      src={media.thumbnailUrl || media.url}
                      alt={media.caption || media.originalName}
                    />
                  )}
                  {media.type === 'video' && '🎥'}
                  {media.type === 'audio' && '🎵'}

                  <div className="media-overlay">
                    {media.type === 'photo' && '📷'}
                    {media.type === 'video' && media.duration && formatDuration(media.duration)}
                    {media.type === 'audio' && media.duration && formatDuration(media.duration)}
                  </div>
                </div>

                <div className="media-info">
                  <div className="media-title">{media.originalName}</div>
                  <div className="media-meta">
                    {formatFileSize(media.size)} • {new Date(media.uploadedAt).toLocaleDateString()}
                  </div>
                  <div className="media-meta">By {media.uploadedBy.name}</div>

                  {media.tags.length > 0 && (
                    <div className="media-tags">
                      {media.tags.slice(0, 3).map((tag) => (
                        <span key={`${media.id}-${tag}`} className="media-tag">
                          {tag}
                        </span>
                      ))}
                      {media.tags.length > 3 && (
                        <span className="media-tag">+{media.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="media-stats">
                    <span>👁️ {media.viewCount}</span>
                    <span>💾 {media.downloadCount}</span>
                    <span>❤️ {media.favoriteCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {activeTab === 'albums' && (
        <div className="albums-grid">
          {data.albums.map((album) => (
            <button
              key={album.id}
              className="album-card"
              onClick={() => setSelectedAlbum(album.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedAlbum(album.id);
                  setActiveTab('browse');
                }
              }}
              aria-label={`View album ${album.name} with ${album.mediaCount} files`}
              type="button"
            >
              <div className="album-cover">
                {album.coverImageUrl ? (
                  <img
                    src={album.coverImageUrl}
                    alt={album.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  '📁'
                )}
              </div>
              <div className="album-title">{album.name}</div>
              {album.description && (
                <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {album.description}
                </div>
              )}
              <div className="album-stats">
                <span>{album.mediaCount} files</span>
                <span>{formatFileSize(album.totalSize)}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                By {album.createdBy.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {activeTab === 'upload' && (
        <UploadForm
          onUpload={handleFileUpload}
          albums={data.albums}
          files={uploadFiles}
          setFiles={setUploadFiles}
        />
      )}

      {activeTab === 'favorites' && (
        <div className="media-grid">
          {data.media
            .filter((media) => media.favoriteCount > 0)
            .map((media) => (
              <button
                key={media.id}
                className="media-card"
                onClick={() => setSelectedMedia(media)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMedia(media);
                  }
                }}
                aria-label={`View favorite ${media.originalName}`}
                type="button"
              >
                <div className="media-preview">
                  {media.type === 'photo' && media.url && (
                    <img
                      src={media.thumbnailUrl || media.url}
                      alt={media.caption || media.originalName}
                    />
                  )}
                  {media.type === 'video' && '🎥'}
                  {media.type === 'audio' && '🎵'}

                  <div className="media-overlay">❤️ {media.favoriteCount}</div>
                </div>

                <div className="media-info">
                  <div className="media-title">{media.originalName}</div>
                  <div className="media-meta">
                    {formatFileSize(media.size)} • {new Date(media.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}

      {selectedMedia && <MediaModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />}
    </div>
  );
}

function UploadForm({
  onUpload,
  albums,
  files,
  setFiles,
}: {
  readonly onUpload: (files: File[], albumId?: string, tags?: string[]) => void;
  readonly albums: Album[];
  readonly files: File[];
  readonly setFiles: (files: File[]) => void;
}) {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }

    const tagList = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    onUpload(files, selectedAlbum || undefined, tagList.length > 0 ? tagList : undefined);
  };

  return (
    <div className="upload-form">
      <div className="upload-header">
        <h3>Upload Media Files</h3>
        <p>Share your photos, videos, and audio memories</p>
      </div>

      <div className={`upload-dropzone ${dragOver ? 'dragover' : ''}`}>
        <button
          type="button"
          className="upload-trigger"
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => document.getElementById('file-input')?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              document.getElementById('file-input')?.click();
            }
          }}
          aria-label="Upload files by clicking or drag and drop"
        >
          <div className="upload-icon">📁</div>
          <p>Drag & drop files here or click to browse</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Supports: JPG, PNG, MP4, MOV, MP3, WAV
          </p>
        </button>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h4 style={{ marginBottom: '1rem', color: '#8B7A8A' }}>Selected Files:</h4>
          {files.map((file, index) => (
            <div key={`${file.name}-${file.size}-${file.lastModified}`} className="file-item">
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button type="button" className="remove-file-btn" onClick={() => removeFile(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="album-select">
            Album (Optional)
          </label>
          <select
            id="album-select"
            className="form-select"
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
          >
            <option value="">No Album</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tags-input">
            Tags (comma-separated)
          </label>
          <input
            id="tags-input"
            type="text"
            className="form-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="wedding, ceremony, family, fun..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="form-btn primary">
            Upload {files.length} File{files.length !== 1 ? 's' : ''}
          </button>
          <button type="button" className="form-btn secondary" onClick={() => setFiles([])}>
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
}

function MediaModal({
  media,
  onClose,
}: {
  readonly media: MediaFile;
  readonly onClose: () => void;
}) {
  return (
    <div className="media-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button
        className="modal-backdrop"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        aria-label="Close modal by clicking backdrop"
      />
      <div className="modal-content" role="document">
        <div className="modal-header">
          <div id="modal-title" className="modal-title">
            {media.originalName}
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-body">
          {media.type === 'photo' && (
            <img
              src={media.url}
              alt={media.caption || media.originalName}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
            />
          )}

          {media.type === 'video' && (
            <video
              src={media.url}
              controls
              style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
            >
              <track kind="captions" srcLang="en" label="English captions" />
              Your browser does not support the video tag.
            </video>
          )}

          {media.type === 'audio' && (
            <audio src={media.url} controls style={{ width: '100%', marginBottom: '1rem' }}>
              <track kind="captions" srcLang="en" label="English captions" />
              Your browser does not support the audio tag.
            </audio>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#8B7A8A' }}>Details:</strong>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              <div>Size: {(media.size / 1024 / 1024).toFixed(2)} MB</div>
              <div>Uploaded: {new Date(media.uploadedAt).toLocaleString()}</div>
              <div>By: {media.uploadedBy.name}</div>
              {media.dimensions && (
                <div>
                  Dimensions: {media.dimensions.width} × {media.dimensions.height}
                </div>
              )}
              {media.duration && (
                <div>
                  Duration: {Math.floor(media.duration / 60)}:
                  {(media.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </div>

          {media.caption && (
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#8B7A8A' }}>Caption:</strong>
              <p style={{ marginTop: '0.5rem', color: '#666' }}>{media.caption}</p>
            </div>
          )}

          {media.tags.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#8B7A8A' }}>Tags:</strong>
              <div
                style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}
              >
                {media.tags.map((tag) => (
                  <span
                    key={`modal-${media.id}-${tag}`}
                    style={{
                      background: 'linear-gradient(135deg, #8B7A8A, #D4A574)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}
          >
            <button className="form-btn primary">⬇️ Download</button>
            <button className="form-btn secondary">❤️ Favorite</button>
            <button className="form-btn secondary">💬 Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
