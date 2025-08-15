import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './VideoPlayer.css';

const VideoPlayer = ({ src, title = 'Wedding Video' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Removed unused isPlaying/setIsPlaying
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setError('Could not load the video. Please try refreshing the page.');
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return (
      <div className="video-container">
        <div className="video-error" role="alert">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              videoRef.current?.load();
            }}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-container">
      {isLoading && (
        <output className="video-loading" aria-live="polite">
          <div className="loading-spinner"></div>
          <p>Loading video...</p>
        </output>
      )}
      <video
        ref={videoRef}
        controls
        muted
        playsInline
        className="video-player"
        data-testid="video-player"
        aria-label={`${title} - Wedding video player`}
        preload="metadata"
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <source src={src} type="video/mp4" />
        <p>
          Your browser doesn&apos;t support HTML video.{' '}
          <a href={src} download>
            Download the video
          </a>{' '}
          instead.
        </p>
      </video>
      <div className="video-controls-info">
        <p className="video-title">{title}</p>
        <p className="video-instructions">
          Use the video controls to play, pause, adjust volume, and view in fullscreen.
        </p>
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default VideoPlayer;
