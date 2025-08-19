'use client';

/**
 * ✨ MAGICAL PHOTO GALLERY ✨
 * Enhanced photo gallery with incredible UX features
 */

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfettiCelebration, TouchMagic } from '../../utils/features/magicalInteractions.js';
import { OptimizedImage as OptimizedImageComponent } from '../../utils/optimization/ImageOptimizer';

const MagicalPhotoGallery = ({ photos = [], onPhotoClick, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef(null);
  const touchRef = useRef(null);

  // Initialize touch gestures
  useEffect(() => {
    const currentGalleryRef = galleryRef.current;
    if (currentGalleryRef) {
      touchRef.current = new TouchMagic(currentGalleryRef);

      // Add swipe navigation
      const handleSwipeLeft = () => nextPhoto();
      const handleSwipeRight = () => prevPhoto();

      currentGalleryRef.addEventListener('swipeleft', handleSwipeLeft);
      currentGalleryRef.addEventListener('swiperight', handleSwipeRight);

      return () => {
        currentGalleryRef.removeEventListener('swipeleft', handleSwipeLeft);
        currentGalleryRef.removeEventListener('swiperight', handleSwipeRight);
      };
    }
  }, [nextPhoto, prevPhoto]);

  // Global keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPhoto, prevPhoto, toggleFullscreen]);

  // Helper function to handle successful image load
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  // Helper function to handle image loading errors
  const handleImageError = () => {
    // Continue even if image fails to load
  };

  // Standalone helpers to avoid nested function declarations inside effects
  const createPreloadPromise = useCallback(
    (photo, index) =>
      new Promise((resolve) => {
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
      }),
    []
  );

  // Preload images for smooth experience
  useEffect(() => {
    let active = true;
    const preloadImages = async () => {
      // Respect Save-Data or constrained networks
      try {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn && (conn.saveData || (conn.effectiveType && /2g/i.test(conn.effectiveType)))) {
          setIsLoading(false);
          return;
        }
      } catch {
        // ignore network info access issues
      }

      setIsLoading(true);
      const imagePromises = photos.slice(0, 5).map(createPreloadPromise);
      await Promise.all(imagePromises);
      if (active) setIsLoading(false);
    };
    if (photos.length > 0) {
      preloadImages();
    }
    return () => {
      active = false;
    };
  }, [photos, createPreloadPromise]);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    ConfettiCelebration.trigger(galleryRef.current, 10);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const handlePhotoClick = useCallback(
    (photo, index) => {
      setCurrentIndex(index);
      ConfettiCelebration.trigger(galleryRef.current, 20);
      if (onPhotoClick) onPhotoClick(photo, index);
    },
    [onPhotoClick]
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      ConfettiCelebration.trigger(document.body, 30);
    }
  }, [isFullscreen]);

  if (isLoading) {
    return (
      <div className={`magical-gallery-loading ${className}`}>
        <div className="skeleton-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={`skeleton-${i}`} className="skeleton photo-skeleton" />
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
          {(() => {
            const currentPhoto = photos[currentIndex];
            const photoLabel = currentPhoto?.caption || `Wedding photo ${currentIndex + 1}`;
            return (
              <button
                className="featured-photo-button"
                onClick={toggleFullscreen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFullscreen();
                  }
                }}
                aria-label={`View fullscreen: ${photoLabel}`}
              >
                <OptimizedImageComponent
                  src={currentPhoto?.url || currentPhoto?.src || ''}
                  alt={photoLabel}
                  width={1200}
                  height={800}
                  className="featured-photo"
                  priority={false}
                  quality={85}
                  onLoad={() => setLoadedImages((prev) => new Set([...prev, currentIndex]))}
                />
              </button>
            );
          })()}

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
            key={photo.url || photo.src || `photo-${Date.now()}-${index}`}
            className={`thumbnail-wrapper stagger-animation ${
              index === currentIndex ? 'active' : ''
            }`}
            style={{ '--delay': `${index * 0.1}s` }}
          >
            <button
              className="thumbnail-button"
              onClick={() => handlePhotoClick(photo, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePhotoClick(photo, index);
                }
              }}
              aria-label={`Select photo ${index + 1}: ${photo.caption || 'Wedding photo'}`}
            >
              <div className="relative w-full h-0 pb-[66%]">
                <Image
                  src={photo.url || photo.src || ''}
                  alt={photo.caption || `Wedding photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  loading="lazy"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
            </button>
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
        <dialog className="fullscreen-modal" aria-label="Photo fullscreen view" open={isFullscreen}>
          <div className="fullscreen-content">
            <div className="relative w-full h-0 pb-[66%]">
              <Image
                src={photos[currentIndex]?.url || photos[currentIndex]?.src || ''}
                alt={photos[currentIndex]?.caption || `Wedding photo ${currentIndex + 1}`}
                fill
                sizes="100vw"
                loading="lazy"
                style={{ objectFit: 'contain', backgroundColor: '#000' }}
                unoptimized
              />
            </div>
            <button
              className="close-fullscreen btn-magical"
              onClick={toggleFullscreen}
              aria-label="Close fullscreen"
            >
              ✕
            </button>
            <button
              className="fullscreen-backdrop"
              onClick={toggleFullscreen}
              aria-label="Close fullscreen view"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            />
          </div>
        </dialog>
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
