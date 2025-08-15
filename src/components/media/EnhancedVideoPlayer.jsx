'use client';

/**
 * 🎬 ENHANCED WEDDING VIDEO PLAYER ✨
 *
 * Advanced video player designed specifically for feature-length wedding videos
 * with chapter navigation, smart autoplay handling, and magical interactions.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInteractionSounds } from '../AmbientSoundSystem';

const EnhancedVideoPlayer = ({
  src,
  posterSrc,
  title = 'Our Wedding Film',
  chapters = [],
  autoplay = false,
  showChapters = true,
  className = '',
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true); // Start muted to allow autoplay
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [error, setError] = useState(null);

  const { playClick, playHover } = useInteractionSounds();

  // Hide controls after inactivity
  const controlsTimeoutRef = useRef(null);

  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  // Parse chapter data
  const parseChapters = useCallback((chaptersData) => {
    if (!Array.isArray(chaptersData)) return [];

    return chaptersData.map((chapter, index) => {
      // Handle different chapter formats
      if (typeof chapter === 'string') {
        // Parse VTT-style format: "00:00:00.000 --> 00:00:44.640\nTitle"
        const lines = chapter.split('\n');
        if (lines.length >= 2) {
          const timeMatch = lines[0].match(
            /(\d{2}:\d{2}:\d{2}.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}.\d{3})/
          );
          if (timeMatch) {
            return {
              id: index,
              title: lines[1] || `Chapter ${index + 1}`,
              startTime: parseTimeToSeconds(timeMatch[1]),
              endTime: parseTimeToSeconds(timeMatch[2]),
            };
          }
        }
      }

      // Handle object format
      return {
        id: chapter.id || index,
        title: chapter.title || `Chapter ${index + 1}`,
        startTime: chapter.startTime || 0,
        endTime: chapter.endTime || 0,
      };
    });
  }, []);

  const parsedChapters = parseChapters(chapters);

  // Convert time string to seconds
  function parseTimeToSeconds(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':');
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
  }

  // Format time for display
  const formatTime = useCallback((seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  // Smart autoplay with user interaction detection
  const handleSmartAutoplay = useCallback(async () => {
    if (!videoRef.current || !autoplay) return;

    try {
      // Try to play muted first (most browsers allow this)
      videoRef.current.muted = true;
      setIsMuted(true);
      await videoRef.current.play();
      setIsPlaying(true);

      // Show a user-friendly prompt to unmute
      if (!hasInteracted) {
        // Could show a toast or overlay encouraging interaction
      }
    } catch (error) {
      // Autoplay blocked, show play button prominently
    }
  }, [autoplay, hasInteracted]);

  // Handle user's first interaction
  const handleFirstInteraction = useCallback(async () => {
    if (hasInteracted) return;

    setHasInteracted(true);

    // Try to unmute and play if autoplay was intended
    if (autoplay && videoRef.current) {
      try {
        if (isMuted) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
        if (!isPlaying) {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {}
    }
  }, [hasInteracted, autoplay, isMuted, isPlaying]);

  // Video event handlers
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    resetControlsTimeout();
    playClick();
  }, [resetControlsTimeout, playClick]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Update current chapter
    const chapter = parsedChapters.find((ch) => time >= ch.startTime && time < ch.endTime);
    setCurrentChapter(chapter);
  }, [parsedChapters]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      handleSmartAutoplay();
    }
  }, [handleSmartAutoplay]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setError('Unable to load the wedding video. Please try refreshing the page.');
  }, []);

  // Control handlers
  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;

    if (!hasInteracted) {
      await handleFirstInteraction();
    }

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Play/pause error:', error);
    }
  }, [isPlaying, hasInteracted, handleFirstInteraction]);

  const handleSeek = useCallback((newTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleVolumeChange = useCallback(
    (newVolume) => {
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setVolume(newVolume);

        if (newVolume === 0) {
          setIsMuted(true);
          videoRef.current.muted = true;
        } else if (isMuted) {
          setIsMuted(false);
          videoRef.current.muted = false;
        }
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      playClick();
    }
  }, [isMuted, playClick]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullscreen]);

  const jumpToChapter = useCallback(
    (chapter) => {
      if (videoRef.current && chapter) {
        videoRef.current.currentTime = chapter.startTime;
        setCurrentTime(chapter.startTime);
        setShowChapterMenu(false);
        playClick();
      }
    },
    [playClick]
  );

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (!hasInteracted) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek(Math.min(duration, currentTime + 10));
          break;
      }
    },
    [hasInteracted, togglePlay, toggleFullscreen, toggleMute, handleSeek, currentTime, duration]
  );

  // Setup event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [handlePlay, handlePause, handleTimeUpdate, handleLoadedMetadata, handleError]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mouse movement detection for controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = () => resetControlsTimeout();
    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout, isPlaying, handleKeyDown]);

  if (error) {
    return (
      <div className="enhanced-video-player error">
        <div className="video-error">
          <h3>Unable to Load Video</h3>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
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
    <div
      ref={containerRef}
      className={`enhanced-video-player ${className} ${isFullscreen ? 'fullscreen' : ''}`}
      tabIndex={0}
      role="application"
      aria-label={`${title} - Enhanced video player`}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="video-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="loading-spinner"></div>
            <p>Loading your wedding film...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video element */}
      <video
        ref={videoRef}
        className="video-element"
        src={src}
        poster={posterSrc}
        playsInline
        preload="metadata"
        muted={isMuted}
        onLoadStart={() => setIsLoading(true)}
        onClick={togglePlay}
      >
        {/* Add chapter tracks if available */}
        {parsedChapters.length > 0 && (
          <track kind="chapters" src="/video/main-film-chapters.vtt" default />
        )}
        Your browser does not support the video tag.
      </video>

      {/* Big play button overlay (when paused) */}
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.div
            className="play-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            onMouseEnter={playHover}
          >
            <button className="big-play-button" aria-label="Play wedding video">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            {!hasInteracted && autoplay && (
              <p className="interaction-hint">Click to start your wedding film</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Controls */}
      <AnimatePresence>
        {showControls && !isLoading && (
          <motion.div
            className="video-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Progress bar */}
            <div className="progress-container">
              <div
                className="progress-bar"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  handleSeek(percent * duration);
                }}
              >
                <div
                  className="progress-filled"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
                <div
                  className="progress-handle"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>

              {/* Chapter markers */}
              {parsedChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="chapter-marker"
                  style={{ left: `${(chapter.startTime / duration) * 100}%` }}
                  title={chapter.title}
                  onClick={() => jumpToChapter(chapter)}
                />
              ))}
            </div>

            {/* Control buttons */}
            <div className="controls-row">
              <div className="controls-left">
                <button
                  className="control-button play-pause"
                  onClick={togglePlay}
                  onMouseEnter={playHover}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div className="volume-control">
                  <button
                    className="control-button"
                    onClick={toggleMute}
                    onMouseEnter={playHover}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>

                  <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    aria-label="Volume"
                  />
                </div>

                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span className="time-separator">/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="controls-center">
                {currentChapter && (
                  <div className="current-chapter">
                    <span className="chapter-label">Now Playing:</span>
                    <span className="chapter-title">{currentChapter.title}</span>
                  </div>
                )}
              </div>

              <div className="controls-right">
                {showChapters && parsedChapters.length > 0 && (
                  <button
                    className="control-button chapters-button"
                    onClick={() => setShowChapterMenu(!showChapterMenu)}
                    onMouseEnter={playHover}
                    aria-label="Show chapters"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                  </button>
                )}

                <button
                  className="control-button"
                  onClick={toggleFullscreen}
                  onMouseEnter={playHover}
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Menu */}
      <AnimatePresence>
        {showChapterMenu && parsedChapters.length > 0 && (
          <motion.div
            className="chapter-menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="chapter-menu-header">
              <h3>Wedding Film Chapters</h3>
              <button
                className="close-button"
                onClick={() => setShowChapterMenu(false)}
                aria-label="Close chapters"
              >
                ×
              </button>
            </div>
            <div className="chapter-list">
              {parsedChapters.map((chapter) => (
                <button
                  key={chapter.id}
                  className={`chapter-item ${currentChapter?.id === chapter.id ? 'active' : ''}`}
                  onClick={() => jumpToChapter(chapter)}
                  onMouseEnter={playHover}
                >
                  <span className="chapter-time">{formatTime(chapter.startTime)}</span>
                  <span className="chapter-title">{chapter.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .enhanced-video-player {
          position: relative;
          width: 100%;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .enhanced-video-player.fullscreen {
          border-radius: 0;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
        }

        .video-element {
          width: 100%;
          height: auto;
          display: block;
          cursor: pointer;
        }

        .video-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 10;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left: 4px solid #8fa876;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          z-index: 5;
        }

        .big-play-button {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(143, 168, 118, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          margin-bottom: 1rem;
        }

        .big-play-button:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(143, 168, 118, 0.6);
        }

        .big-play-button svg {
          width: 32px;
          height: 32px;
          margin-left: 4px;
        }

        .interaction-hint {
          color: white;
          font-size: 1.1rem;
          font-weight: 500;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 2rem 1.5rem 1.5rem;
          z-index: 10;
        }

        .progress-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          cursor: pointer;
          position: relative;
        }

        .progress-filled {
          height: 100%;
          background: linear-gradient(90deg, #8fa876 0%, #b8d1a6 100%);
          border-radius: 3px;
          transition: width 0.1s ease;
        }

        .progress-handle {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .progress-bar:hover .progress-handle {
          opacity: 1;
        }

        .chapter-marker {
          position: absolute;
          top: 0;
          width: 2px;
          height: 100%;
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          z-index: 1;
        }

        .chapter-marker:hover {
          background: white;
          width: 3px;
        }

        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .controls-left,
        .controls-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .controls-center {
          flex: 1;
          text-align: center;
        }

        .control-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .control-button svg {
          width: 20px;
          height: 20px;
        }

        .play-pause svg {
          width: 24px;
          height: 24px;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          outline: none;
          -webkit-appearance: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }

        .time-display {
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .time-separator {
          opacity: 0.6;
        }

        .current-chapter {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .chapter-label {
          font-size: 0.75rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chapter-title {
          font-size: 1rem;
          font-weight: 600;
        }

        .chapter-menu {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 320px;
          max-height: 400px;
          background: rgba(0, 0, 0, 0.95);
          border-radius: 12px;
          color: white;
          z-index: 15;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chapter-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chapter-menu-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          line-height: 1;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .chapter-list {
          max-height: 300px;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .chapter-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          background: none;
          border: none;
          color: white;
          text-align: left;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chapter-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .chapter-item.active {
          background: linear-gradient(
            135deg,
            rgba(143, 168, 118, 0.3) 0%,
            rgba(184, 209, 166, 0.3) 100%
          );
          border: 1px solid rgba(143, 168, 118, 0.5);
        }

        .chapter-time {
          font-size: 0.9rem;
          opacity: 0.8;
          min-width: 60px;
          font-family: monospace;
        }

        .chapter-title {
          font-weight: 500;
          flex: 1;
        }

        .video-error {
          text-align: center;
          padding: 3rem 2rem;
          color: white;
        }

        .video-error h3 {
          margin-bottom: 1rem;
          color: #ff6b6b;
        }

        .retry-button {
          background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 1rem;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(143, 168, 118, 0.4);
        }

        @media (max-width: 768px) {
          .video-controls {
            padding: 1.5rem 1rem 1rem;
          }

          .controls-row {
            flex-direction: column;
            gap: 0.75rem;
          }

          .controls-center {
            order: -1;
          }

          .chapter-menu {
            top: 0.5rem;
            right: 0.5rem;
            left: 0.5rem;
            width: auto;
          }

          .volume-slider {
            width: 60px;
          }

          .big-play-button {
            width: 60px;
            height: 60px;
          }

          .big-play-button svg {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedVideoPlayer;
