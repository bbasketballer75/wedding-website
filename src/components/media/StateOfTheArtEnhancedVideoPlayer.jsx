'use client';

/**
 * ✨ STATE-OF-THE-ART ENHANCED VIDEO PLAYER ✨
 *
 * Complete integration of our professional design system with the existing video player
 * Features: GSAP animations, glassmorphism controls, professional design tokens
 */

import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

// State-of-the-art components
import StateOfTheArtButton from '../ui/StateOfTheArtButton';
import StateOfTheArtCard from '../ui/StateOfTheArtCard';

// Audio system
import { useInteractionSounds } from '../AmbientSoundSystem';

// Styles
import styles from '../../styles/components/StateOfTheArtVideoPlayer.module.css';

const StateOfTheArtEnhancedVideoPlayer = ({
  src,
  posterSrc,
  title = "Austin & Jordyn's Wedding Film",
  chapters = [],
  autoplay = false,
  showChapters = true,
  className = '',
  onVideoReady,
  ...props
}) => {
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);

  // UI state
  const [showControls, setShowControls] = useState(true);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Audio effects
  const { playClick, playHover } = useInteractionSounds();

  // Animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  // Format time helper
  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Control timeout management
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    setShowControls(true);

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Video event handlers
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setShowControls(true);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Update current chapter
      if (chapters.length > 0) {
        const current = chapters.find((chapter, index) => {
          const nextChapter = chapters[index + 1];
          const chapterStart = chapter.startTime || 0;
          const chapterEnd = nextChapter ? nextChapter.startTime : duration;
          return time >= chapterStart && time < chapterEnd;
        });
        setCurrentChapter(current);
      }
    }
  }, [chapters, duration]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      onVideoReady?.();
    }
  }, [onVideoReady]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setError('Unable to load the wedding video. Please try refreshing the page.');
  }, []);

  // Control functions
  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;

    if (!hasInteracted) {
      setHasInteracted(true);
      if (videoRef.current.muted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }

    try {
      if (isPlaying) {
        videoRef.current.pause();
        playClick();
      } else {
        await videoRef.current.play();
        playClick();
      }
    } catch (error) {
      console.error('Play/pause error:', error);
    }
  }, [isPlaying, hasInteracted, playClick]);

  const handleSeek = useCallback((newTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

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
      playClick();
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullscreen, playClick]);

  const jumpToChapter = useCallback(
    (chapter) => {
      if (videoRef.current && chapter) {
        videoRef.current.currentTime = chapter.startTime || 0;
        setCurrentTime(chapter.startTime || 0);
        setShowChapterMenu(false);
        playClick();
      }
    },
    [playClick]
  );

  // Event listeners setup
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

  // Fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mouse movement for controls
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

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout, isPlaying]);

  // Error state
  if (error) {
    return (
      <StateOfTheArtCard variant="elevated" size="large" className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h3>Unable to Load Video</h3>
          <p>{error}</p>
          <StateOfTheArtButton
            variant="primary"
            size="medium"
            onClick={() => {
              setError(null);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
          >
            Try Again
          </StateOfTheArtButton>
        </div>
      </StateOfTheArtCard>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.videoPlayer} ${className} ${isFullscreen ? styles.fullscreen : ''}`}
      tabIndex={0}
      role="application"
      aria-label={`${title} - Enhanced video player`}
      {...props}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className={styles.loadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.loadingSpinner}></div>
            <p>Loading your wedding film...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video element */}
      <video
        ref={videoRef}
        className={styles.videoElement}
        src={src}
        poster={posterSrc}
        playsInline
        preload="metadata"
        muted={isMuted}
        autoPlay={autoplay}
        onLoadStart={() => setIsLoading(true)}
        onClick={togglePlay}
        onMouseEnter={playHover}
      >
        Your browser does not support the video tag.
      </video>

      {/* Big play button overlay */}
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.div
            className={styles.playOverlay}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            onMouseEnter={playHover}
          >
            <StateOfTheArtButton
              variant="primary"
              size="xl"
              className={styles.bigPlayButton}
              aria-label="Play wedding video"
            >
              ▶️
            </StateOfTheArtButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Controls */}
      <AnimatePresence>
        {showControls && !isLoading && (
          <motion.div
            className={styles.controlsOverlay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <StateOfTheArtCard variant="glass" size="medium" className={styles.controlsCard}>
              {/* Progress bar */}
              <div className={styles.progressContainer}>
                <div
                  className={styles.progressBar}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    handleSeek(pos * duration);
                  }}
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <div
                    className={styles.progressHandle}
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className={styles.timeDisplay}>
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control buttons */}
              <div className={styles.controlsRow}>
                <div className={styles.leftControls}>
                  <StateOfTheArtButton
                    variant="ghost"
                    size="medium"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </StateOfTheArtButton>

                  <div className={styles.volumeControl}>
                    <StateOfTheArtButton
                      variant="ghost"
                      size="medium"
                      onClick={toggleMute}
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                    </StateOfTheArtButton>

                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          className={styles.volumeSlider}
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0 }}
                          onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            className={styles.volumeRange}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className={styles.centerControls}>
                  {currentChapter && (
                    <div className={styles.chapterInfo}>
                      <span className={styles.chapterTitle}>{currentChapter.title}</span>
                    </div>
                  )}
                </div>

                <div className={styles.rightControls}>
                  {showChapters && chapters.length > 0 && (
                    <StateOfTheArtButton
                      variant="ghost"
                      size="medium"
                      onClick={() => setShowChapterMenu(!showChapterMenu)}
                      aria-label="Show chapters"
                    >
                      📖
                    </StateOfTheArtButton>
                  )}

                  <StateOfTheArtButton
                    variant="ghost"
                    size="medium"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? '🗗' : '⛶'}
                  </StateOfTheArtButton>
                </div>
              </div>
            </StateOfTheArtCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Menu */}
      <AnimatePresence>
        {showChapterMenu && chapters.length > 0 && (
          <motion.div
            className={styles.chapterMenu}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.4, ease: 'power3.out' }}
          >
            <StateOfTheArtCard variant="wedding" size="large" className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <h3>Wedding Film Chapters</h3>
                <StateOfTheArtButton
                  variant="ghost"
                  size="small"
                  onClick={() => setShowChapterMenu(false)}
                  aria-label="Close chapters"
                >
                  ✕
                </StateOfTheArtButton>
              </div>
              <div className={styles.chapterList}>
                {chapters.map((chapter, index) => (
                  <motion.div
                    key={index}
                    className={`${styles.chapterItem} ${
                      currentChapter?.title === chapter.title ? styles.active : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => jumpToChapter(chapter)}
                  >
                    <div className={styles.chapterNumber}>{index + 1}</div>
                    <div className={styles.chapterDetails}>
                      <h4>{chapter.title}</h4>
                      <p>{formatTime(chapter.startTime || 0)}</p>
                      {chapter.description && <small>{chapter.description}</small>}
                    </div>
                    <div className={styles.chapterEmoji}>{chapter.emoji || '🎬'}</div>
                  </motion.div>
                ))}
              </div>
            </StateOfTheArtCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

StateOfTheArtEnhancedVideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  posterSrc: PropTypes.string,
  title: PropTypes.string,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      startTime: PropTypes.number,
      endTime: PropTypes.number,
      description: PropTypes.string,
      emoji: PropTypes.string,
    })
  ),
  autoplay: PropTypes.bool,
  showChapters: PropTypes.bool,
  className: PropTypes.string,
  onVideoReady: PropTypes.func,
};

export default StateOfTheArtEnhancedVideoPlayer;
