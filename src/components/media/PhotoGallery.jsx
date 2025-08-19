import { motion } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { getAlbumMedia } from '../../services/api';
import {
  MagneticButton,
  ParallaxMotion,
  fadeInUp,
  romanticReveal,
} from '../animations/SophisticatedAnimations';

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center" aria-live="polite">
        <motion.div
          className="w-16 h-16 border-2 border-sage-200 border-t-blush-400 rounded-full animate-spin mb-6"
          {...fadeInUp}
          aria-hidden="true"
        />
        <motion.p
          className="text-xl font-display text-eucalyptus-700 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Awakening our cherished memories...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-[40vh] flex flex-col items-center justify-center px-8"
        role="alert"
        aria-live="assertive"
      >
        <motion.div className="text-center max-w-md" {...romanticReveal}>
          <div className="text-6xl mb-6">📸</div>
          <p className="text-xl text-sage-600 font-light mb-8 leading-relaxed">{error}</p>
          <MagneticButton
            onClick={handleRetry}
            className="bg-blush-500 hover:bg-blush-600 text-white px-8 py-3 rounded-full
                     font-medium transition-all duration-300 hover:shadow-xl hover:shadow-blush-200/30"
            aria-label="Retry loading album"
          >
            Try Again
          </MagneticButton>
        </motion.div>
      </div>
    );
  }

  return (
    <main
      className="py-16 px-4 md:px-8 bg-gradient-to-br from-sage-50 to-blush-50 min-h-screen"
      aria-label="Wedding photo gallery"
    >
      {media.length === 0 ? (
        <motion.div className="text-center max-w-2xl mx-auto py-20" {...romanticReveal}>
          <div className="text-8xl mb-8">📷</div>
          <h2 className="text-4xl md:text-5xl font-display font-light text-eucalyptus-800 mb-6">
            Awaiting Beautiful Moments
          </h2>
          <p className="text-xl text-sage-600 font-light leading-relaxed">
            The album is currently empty, ready to be filled with your precious memories. Be the
            first to contribute to our story!
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div className="text-center mb-16" {...romanticReveal}>
            <h2 className="text-5xl md:text-7xl font-display font-light text-eucalyptus-800 mb-6">
              Our Gallery
            </h2>
            <p className="text-xl md:text-2xl text-sage-600 font-light max-w-3xl mx-auto leading-relaxed">
              {media.length} precious moments captured forever, shared with love by our family and
              friends
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {media.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="group relative"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <MagneticButton className="block w-full">
                    <div
                      className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm
                                  border border-sage-100 group-hover:border-blush-200
                                  transition-all duration-500 group-hover:shadow-2xl
                                  group-hover:shadow-sage-200/20"
                    >
                      {item.mimetype.startsWith('image/') && (
                        <ParallaxMotion speed={0.1}>
                          <div className="relative w-full h-80 overflow-hidden rounded-t-2xl">
                            <Image
                              src={`/${item.filepath}`}
                              alt={
                                item.uploadedBy
                                  ? `Cherished moment shared by ${item.uploadedBy}`
                                  : `Wedding memory ${index + 1}`
                              }
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              loading="lazy"
                              className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                              onError={handleImageError}
                              unoptimized
                            />

                            {/* Luxury overlay on hover */}
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-eucalyptus-900/20 via-transparent to-transparent
                                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                          </div>
                        </ParallaxMotion>
                      )}

                      {item.mimetype.startsWith('video/') && (
                        <div className="relative w-full h-80 overflow-hidden rounded-t-2xl">
                          <video
                            src={`/${item.filepath}`}
                            controls
                            muted
                            loop
                            playsInline
                            onError={handleVideoError}
                            className="w-full h-full object-cover"
                            aria-label={`Wedding video ${index + 1}, uploaded ${new Date(item.timestamp).toLocaleDateString()}`}
                          >
                            <p>Your browser does not support the video tag.</p>
                          </video>
                        </div>
                      )}

                      {/* Elegant caption */}
                      <div className="p-6">
                        <div className="flex items-center justify-between text-sm">
                          <time
                            className="text-sage-500 font-medium tracking-wide"
                            dateTime={item.timestamp}
                            aria-label="Upload date"
                          >
                            {new Date(item.timestamp).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                          {item.uploadedBy && item.uploadedBy !== 'Anonymous Guest' && (
                            <span className="text-blush-500 font-medium" aria-label="Shared by">
                              by {item.uploadedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </MagneticButton>
                </motion.div>
              ))}
            </div>
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
