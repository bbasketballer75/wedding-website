'use client';

/**
 * ✨ MAGICAL PHOTO GALLERY ✨
 * Enhanced photo gallery with incredible UX features
 */

import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfettiCelebration, TouchMagic } from '../../utils/features/magicalInteractions.js';

const MagicalPhotoGallery = ({ photos = [], onPhotoClick, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef(null);
  const touchRef = useRef(null);

  // Initialize touch gestures
  useEffect(() => {
    if (galleryRef.current) {
      touchRef.current = new TouchMagic(galleryRef.current);

      // Add swipe navigation
      galleryRef.current.addEventListener('swipeleft', () => nextPhoto());
      galleryRef.current.addEventListener('swiperight', () => prevPhoto());
    }

    return () => {
      // Cleanup touch listeners
    };
  }, []);

  // Helper function to handle successful image load
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  // Helper function to handle image loading errors
  const handleImageError = () => {
    // Continue even if image fails to load
  };

  // Preload images for smooth experience
  useEffect(() => {
    const preloadImages = async () => {
      setIsLoading(true);
      const imagePromises = photos.slice(0, 5).map((photo, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            handleImageLoad(index);
            resolve();
          };
          img.onerror = () => {
            handleImageError();
            resolve();
          };
          img.src = photo.url;
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    if (photos.length > 0) {
      preloadImages();
    }
  }, [photos]);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    ConfettiCelebration.trigger(galleryRef.current, 10);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const handlePhotoClick = (photo, index) => {
    setCurrentIndex(index);
    ConfettiCelebration.trigger(galleryRef.current, 20);
    if (onPhotoClick) onPhotoClick(photo, index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      ConfettiCelebration.trigger(document.body, 30);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPhoto, prevPhoto]);

  if (isLoading) {
    return (
      <div className={`magical-gallery-loading ${className}`}>
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-loading-${i}`} className="skeleton photo-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`magical-photo-gallery ${className}`} ref={galleryRef}>
      {/* Main Featured Photo */}
      <div className="featured-photo-container">
        <div className="featured-photo-wrapper">
          <img
            src={photos[currentIndex]?.url}
            alt={photos[currentIndex]?.caption || `Wedding photo ${currentIndex + 1}`}
            className="featured-photo photo-magic elegant-lift"
             role="button" tabIndex={0} onClick={toggleFullscreen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFullscreen(e); } }}
            onLoad={() => setLoadedImages((prev) => new Set([...prev, currentIndex]))}
          />

          {/* Navigation Arrows */}
          <button
            className="nav-arrow nav-prev btn-magical focus-magic"
            onClick={prevPhoto}
            aria-label="Previous photo"
          >
            <span className="arrow-icon">❮</span>
          </button>
          <button
            className="nav-arrow nav-next btn-magical focus-magic"
            onClick={nextPhoto}
            aria-label="Next photo"
          >
            <span className="arrow-icon">❯</span>
          </button>

          {/* Photo Counter */}
          <div className="photo-counter text-shimmer">
            {currentIndex + 1} / {photos.length}
          </div>

          {/* Caption */}
          {photos[currentIndex]?.caption && (
            <div className="photo-caption fade-in-up">{photos[currentIndex].caption}</div>
          )}
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="thumbnail-grid">
        {photos.map((photo, index) => (
          <div
            key={photo.url || photo.src || `photo-${index}`}
            className={`thumbnail-wrapper stagger-animation ${
              index === currentIndex ? 'active' : ''
            }`}
            style={{ '--delay': `${index * 0.1}s` }}
          >
            <img
              src={photo.url}
              alt={photo.caption || `Wedding photo ${index + 1}`}
              className="thumbnail photo-magic ripple"
               role="button" tabIndex={0} onClick={() => handlePhotoClick(photo, index)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault();  => handlePhotoClickphoto, index(e); } }}
              loading="lazy"
            />
            {loadedImages.has(index) && (
              <div className="thumbnail-overlay">
                <span className="heart-pulse">💖</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fullscreen-modal"  role="button" tabIndex={0} onClick={toggleFullscreen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFullscreen(e); } }}>
          <div className="fullscreen-content">
            <img
              src={photos[currentIndex]?.url}
              alt={photos[currentIndex]?.caption}
              className="fullscreen-image"
               role="button" tabIndex={0} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e => e.stopPropagation(e); } }}
            />
            <button
              className="close-fullscreen btn-magical"
              onClick={toggleFullscreen}
              aria-label="Close fullscreen"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Touch Instructions for Mobile */}
      <div className="touch-instructions fade-in-up">
        <span className="instruction-text">
          👆 Tap photos • 👈👉 Swipe to navigate • 🔍 Tap main photo for fullscreen
        </span>
      </div>
    </div>
  );
};

export default MagicalPhotoGallery;

// PropTypes validation
MagicalPhotoGallery.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      caption: PropTypes.string,
    })
  ),
  onPhotoClick: PropTypes.func,
  className: PropTypes.string,
};
