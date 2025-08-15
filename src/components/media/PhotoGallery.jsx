import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { getAlbumMedia } from '../../services/api';
import './PhotoGallery.css';

const PhotoGallery = ({ refreshKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAlbumMedia();

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setMedia(response.data);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        console.error('Error fetching album media:', err);

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          // More specific error messages based on error type
          if (err.response?.status === 404) {
            setError('Album not found. Please check back later.');
          } else if (err.response?.status >= 500) {
            setError('Server error. Please try again in a few moments.');
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            setError('Network connection issue. Please check your internet connection.');
          } else {
            setError('Could not fetch the album. Please try again later.');
          }
        }
      } finally {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchMedia();
  }, [refreshKey, retryCount]); // Include retryCount to trigger refetch

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg'; // Fallback image
    e.target.alt = 'Image failed to load';
    console.warn('Image failed to load:', e.target.src);
  };

  const handleVideoError = (e) => {
    console.warn('Video failed to load:', e.target.src);
    e.target.style.display = 'none'; // Hide broken video
  };

  if (isLoading) {
    return (
      <div className="loading-container" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p>Awakening our gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" role="alert" aria-live="assertive">
        <p className="error-message">{error}</p>
        <button onClick={handleRetry} className="retry-button" aria-label="Retry loading album">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="photo-gallery" aria-label="Wedding photo gallery">
      {media.length === 0 ? (
        <div className="empty-state">
          <p>The album is currently empty. Be the first to contribute!</p>
        </div>
      ) : (
        <>
          <h2 className="sr-only">{media.length} wedding photos and videos</h2>
          <div className="gallery-grid">
            {media.map((item, index) => (
              <div key={item._id} className="gallery-item">
                {item.mimetype.startsWith('image/') && (
                  <picture>
                    <source
                      srcSet={`/${item.filepath}`.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                      type="image/webp"
                    />
                    <source srcSet={`/${item.filepath}`} type="image/jpeg" />
                    <img
                      src={`/${item.filepath}`}
                      alt={`Wedding memory ${index + 1}, uploaded ${new Date(item.timestamp).toLocaleDateString()}`}
                      loading="lazy"
                      width="400"
                      height="300"
                      style={{ maxWidth: '100%', height: 'auto' }}
                      onError={handleImageError}
                      className="gallery-image"
                    />
                  </picture>
                )}
                {item.mimetype.startsWith('video/') && (
                  <video
                    src={`/${item.filepath}`}
                    controls
                    muted
                    loop
                    playsInline
                    onError={handleVideoError}
                    className="gallery-video"
                    aria-label={`Wedding video ${index + 1}, uploaded ${new Date(item.timestamp).toLocaleDateString()}`}
                  >
                    <p>Your browser does not support the video tag.</p>
                  </video>
                )}
                <div className="item-info">
                  <small className="upload-date" aria-label="Upload date">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </small>
                  {item.uploadedBy && item.uploadedBy !== 'Anonymous Guest' && (
                    <small className="uploaded-by" aria-label="Uploaded by">
                      by {item.uploadedBy}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

PhotoGallery.propTypes = {
  refreshKey: PropTypes.number,
};

PhotoGallery.defaultProps = {
  refreshKey: 0,
};

export default PhotoGallery;
