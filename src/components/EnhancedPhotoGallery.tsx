'use client';

/**
 * 🖼️ Enhanced Wedding Photo Gallery (Clean & Modern)
 *
 * Features:
 * - Optimized image loading with Next.js Image
 * - Responsive grid layout
 * - Lightbox functionality
 * - Full accessibility compliance
 * - Modern React patterns with TypeScript
 */

/* eslint-disable react/prop-types */

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import styles from './EnhancedPhotoGallery.module.css';

interface Photo {
  id: string;
  src: string;
  alt: string;
  title?: string;
  aspectRatio?: number;
  priority?: boolean;
}

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onPhotoClick: (photo: Photo) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = React.memo(({ photo, index, onPhotoClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    console.warn(`Failed to load photo: ${photo.src}`);
  }, [photo.src]);

  const handleClick = useCallback(() => {
    onPhotoClick(photo);
  }, [photo, onPhotoClick]);

  if (hasError) {
    return (
      <div className={`${styles.photoCard} ${styles.photoCardError}`}>
      <div className={styles.photoError}>
      <span>📷</span>
      <p>Image unavailable</p>
      </div>
      </div>
    );
  }

  return (
    <motion.button
      className={styles.photoCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={handleClick}
      aria-label={`View photo: ${photo.title || photo.alt}`}
      type="button"
    >
      <div className={styles.photoContainer}>
      <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`${styles.photoImage} ${isLoaded ? styles.photoImageLoaded : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          priority={photo.priority || index < 6}
      />

        {!isLoaded && (
          <div className={styles.photoSkeleton}>
      <div className={styles.skeletonShimmer}
      />
      </div>
        )}
      </div>

      {photo.title && (
        <div className={styles.photoOverlay}>
      <h3 className={styles.photoTitle}>{photo.title}</h3>
      </div>
      )}
    </motion.button>
  );
});

PhotoCard.displayName = 'PhotoCard';

interface EnhancedPhotoGalleryProps {
  photos: Photo[];
  title?: string;
  className?: string;
}

const EnhancedPhotoGallery: React.FC<EnhancedPhotoGalleryProps> = ({
  photos = [],
  title = 'Wedding Photos',
  className = '',
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePhotoClick = useCallback(
    (photo: Photo) => {
      const index = photos.findIndex((p) => p.id === photo.id);
      setCurrentIndex(index);
      setSelectedPhoto(photo);
    },
    [photos]
  );

  const handleClose = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  }, [currentIndex, photos]);

  const handlePrevious = useCallback(() => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  }, [currentIndex, photos]);

  if (photos.length === 0) {
    return (
      <div className={`${styles.photoGallery} ${styles.photoGalleryEmpty}`}>
      <div className={styles.emptyState}>
      <span className={styles.emptyIcon}>📷</span>
      <h3>No Photos Yet</h3>
      <p>Photos will appear here as they&apos;re added to the gallery.</p>
      </div>
      </div>
    );
  }

  return (
    <div className={`${styles.photoGallery} ${className}`}>
      <div className={styles.galleryHeader}>
      <h2 className={styles.galleryTitle}>{title}</h2>
      <div className={styles.galleryStats}>
      <span>
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </span>
      </div>
      </div>
      <div className={styles.photoGrid}>
        {photos.map((photo, index) => (
          <PhotoCard key={photo.id} photo={photo} index={index} onPhotoClick={handlePhotoClick}
      />
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className={styles.photoLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
      <dialog className={styles.lightboxContent} open aria-label="Photo viewer">
      <button
                className={styles.lightboxClose}
                onClick={handleClose}
                aria-label="Close photo viewer"
                type="button"
              >
                ✕
              </button>
      <button
                className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
                onClick={handlePrevious}
                aria-label="Previous photo"
                disabled={photos.length <= 1}
                type="button"
              >
                ←
              </button>
      <div className={styles.lightboxImageContainer}>
      <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  fill
                  className={styles.lightboxImage}
                  sizes="100vw"
                  priority
      />
      </div>
      <button
                className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
                onClick={handleNext}
                aria-label="Next photo"
                disabled={photos.length <= 1}
                type="button"
              >
                →
              </button>

              {selectedPhoto.title && (
                <div className={styles.lightboxInfo}>
      <h3>{selectedPhoto.title}</h3>
      <p>
                    {currentIndex + 1} of {photos.length}
                  </p>
      </div>
              )}
            </dialog>
      </motion.div>
        )}
      </AnimatePresence>
      </div>
  );
};

export default EnhancedPhotoGallery;