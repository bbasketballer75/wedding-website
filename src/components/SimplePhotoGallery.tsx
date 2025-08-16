/**
 * 🖼️ Wedding Photo Gallery (Phase 2C)
 * 
 * Enhanced with performance optimization and social features
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface WeddingPhoto {
  id: string;
  src: string;
  alt: string;
  title?: string;
  category: 'ceremony' | 'reception' | 'portraits' | 'candid' | 'details';
  timestamp: Date;
  photographer?: string;
  location?: string;
  people?: string[];
  tags?: string[];
  aspectRatio: number;
  priority?: boolean;
}

interface PhotoGalleryProps {
  photos: WeddingPhoto[];
  className?: string;
}

// Photo item component
const PhotoItem: React.FC<{ 
  photo: WeddingPhoto; 
  index: number; 
  onPhotoClick: (photo: WeddingPhoto) => void;
}> = ({ photo, index, onPhotoClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    console.warn(`Failed to load photo: ${photo.src}`);
  }, [photo.src]);

  const handleClick = useCallback(() => {
    onPhotoClick(photo);
  }, [photo, onPhotoClick]);

  return (
    <motion.div
      className="photo-item"
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{
        aspectRatio: photo.aspectRatio,
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#f0f0f0'
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {!error && (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          onLoad={handleLoad}
          onError={handleError}
          className={`photo-image ${isLoaded ? 'loaded' : ''}`}
          style={{
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0
          }}
          priority={photo.priority || index < 3}
        />
      )}

      {error && (
        <div className="photo-error">
          <span>📷</span>
          <p>Photo unavailable</p>
        </div>
      )}

      {/* Photo overlay with info */}
      <motion.div
        className="photo-overlay"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="photo-info">
          {photo.title && <h3>{photo.title}</h3>}
          {photo.location && <p>📍 {photo.location}</p>}
        </div>

        {/* Placeholder for reactions */}
        <div className="photo-reactions">
          <button className="reaction-button">❤️</button>
        </div>
      </motion.div>

      <style jsx>{`
        .photo-item {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .photo-item:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .photo-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #f5f5f5;
          color: #999;
          font-size: 14px;
        }

        .photo-error span {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .photo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, 0) 70%,
            rgba(0, 0, 0, 0.6) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          color: white;
        }

        .photo-info h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .photo-info p {
          margin: 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .photo-reactions {
          align-self: flex-end;
        }

        .reaction-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 20px;
          padding: 8px 12px;
          color: white;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }
      `}</style>
    </motion.div>
  );
};

// Main gallery component
export const SimplePhotoGallery: React.FC<PhotoGalleryProps> = ({ 
  photos: initialPhotos, 
  className = '' 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<WeddingPhoto | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Filter photos
  const filteredPhotos = initialPhotos.filter(photo => 
    filter === 'all' || photo.category === filter
  );

  const handlePhotoClick = useCallback((photo: WeddingPhoto) => {
    setSelectedPhoto(photo);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const categories = ['all', 'ceremony', 'reception', 'portraits', 'candid', 'details'];

  return (
    <div className={`photo-gallery ${className}`}>
      {/* Gallery header */}
      <div className="gallery-header">
        <h2>Wedding Photo Gallery</h2>
        <p>{filteredPhotos.length} photos</p>
      </div>

      {/* Category filters */}
      <div className="gallery-controls">
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`filter-button ${filter === category ? 'active' : ''}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Photo grid */}
      <div className="photo-grid">
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo, index) => (
            <PhotoItem
              key={photo.id}
              photo={photo}
              index={index}
              onPhotoClick={handlePhotoClick}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Photo modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="photo-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-button" onClick={closeModal}>×</button>
              
              <div className="modal-image-container">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  fill
                  sizes="90vw"
                  quality={95}
                  className="modal-image"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div className="modal-sidebar">
                <div className="photo-details">
                  <h3>{selectedPhoto.title || 'Wedding Photo'}</h3>
                  {selectedPhoto.location && <p>📍 {selectedPhoto.location}</p>}
                  {selectedPhoto.photographer && <p>📸 {selectedPhoto.photographer}</p>}
                  <p>🗓️ {selectedPhoto.timestamp.toLocaleDateString()}</p>
                  
                  {selectedPhoto.people && selectedPhoto.people.length > 0 && (
                    <div className="photo-people">
                      <p><strong>People:</strong></p>
                      <div className="people-tags">
                        {selectedPhoto.people.map(person => (
                          <span key={person} className="person-tag">{person}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .photo-gallery {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .gallery-header h2 {
          margin: 0;
          font-size: 2.5rem;
          font-family: var(--font-display);
          color: var(--sage-green);
        }

        .gallery-header p {
          margin: 4px 0 0 0;
          color: #666;
          font-size: 14px;
        }

        .gallery-controls {
          margin-bottom: 32px;
          text-align: center;
        }

        .category-filters {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .filter-button {
          padding: 8px 16px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .filter-button:hover {
          border-color: var(--sage-green);
        }

        .filter-button.active {
          background: var(--sage-green);
          color: white;
          border-color: var(--sage-green);
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .photo-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          display: flex;
          max-width: 95vw;
          max-height: 90vh;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          z-index: 1001;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image-container {
          flex: 1;
          min-height: 400px;
          max-width: 70%;
          position: relative;
        }

        .modal-sidebar {
          width: 400px;
          padding: 24px;
          background: #f9f9f9;
          overflow-y: auto;
          max-height: 90vh;
        }

        .photo-details h3 {
          margin-top: 0;
          color: var(--sage-green);
          font-family: var(--font-display);
        }

        .people-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .person-tag {
          background: var(--sage-green);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .photo-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }

          .modal-content {
            flex-direction: column;
            max-height: 95vh;
          }

          .modal-image-container {
            max-width: 100%;
            height: 60vh;
          }

          .modal-sidebar {
            width: 100%;
            max-height: 35vh;
          }
        }
      `}</style>
    </div>
  );
};

export default SimplePhotoGallery;