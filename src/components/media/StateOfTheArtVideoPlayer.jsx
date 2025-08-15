'use client';

/**
 * 🎨 STATE-OF-THE-ART VIDEO PLAYER ✨
 *
 * Professional wedding video player using our design system components
 * with GSAP animations, glassmorphism effects, and modern interactions
 */

import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronDownIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { designTokens, getColor } from '../../styles/core/design-tokens';
import { StateOfTheArtButton } from '../ui/StateOfTheArtButton';
import { StateOfTheArtCard } from '../ui/StateOfTheArtCard';

export const StateOfTheArtVideoPlayer = ({
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
  const controlsRef = useRef(null);
  const progressRef = useRef(null);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  // Enhanced state for design system
  const [isHovering, setIsHovering] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const controlsTimeoutRef = useRef(null);

  // GSAP Animations Setup
  useEffect(() => {
    if (!containerRef.current || !controlsRef.current) return;

    // Initial entrance animation
    gsap.fromTo(
      containerRef.current,
      {
        scale: 0.95,
        opacity: 0,
        borderRadius: '8px',
      },
      {
        scale: 1,
        opacity: 1,
        borderRadius: '24px',
        duration: 1,
        ease: designTokens.animations.easings.power3,
      }
    );

    // Controls entrance animation
    gsap.fromTo(
      controlsRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        ease: designTokens.animations.easings.power3,
      }
    );
  }, []);

  // Enhanced progress update with GSAP
  useEffect(() => {
    if (progressRef.current && duration > 0) {
      const progress = (currentTime / duration) * 100;
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.1,
        ease: 'none',
      });
    }
  }, [currentTime, duration]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isHovering) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying, isHovering]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // Update current chapter
      if (chapters.length > 0) {
        const current = chapters.find((chapter, index) => {
          const nextChapter = chapters[index + 1];
          const chapterStart = chapter.time || 0;
          const chapterEnd = nextChapter ? nextChapter.time : duration;
          return currentTime >= chapterStart && currentTime < chapterEnd;
        });
        setCurrentChapter(current);
      }
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const togglePlay = () => {
    if (!hasInteracted) setHasInteracted(true);

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowPlayButton(false);
      }
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const jumpToChapter = (chapter) => {
    if (chapter.time !== undefined) {
      handleSeek(chapter.time);
      setShowChapterMenu(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);

      // Celebratory animation
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 1.02,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: designTokens.animations.easings.power2,
        });
      }
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`state-of-the-art-video-player ${className}`}>
      <StateOfTheArtCard
        variant="glass"
        size="large"
        hoverable={false}
        animateOnScroll={true}
        className="video-container-card"
      >
        <div
          ref={containerRef}
          className="video-container"
          onMouseEnter={() => {
            setIsHovering(true);
            resetControlsTimeout();
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            resetControlsTimeout();
          }}
          onMouseMove={resetControlsTimeout}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src={src}
            poster={posterSrc}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            muted={isMuted}
            playsInline
            preload="metadata"
            className="video-element"
          />

          {/* Loading State */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
            <p>Loading your wedding memories...</p>
            </div>
          )}

          {/* Play Button Overlay */}
          <AnimatePresence>
            {showPlayButton && !isPlaying && !isLoading && (
              <motion.div
                className="play-overlay"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <StateOfTheArtButton
                  variant="primary"
                  size="xl"
                  onClick={togglePlay}
                  className="main-play-button"
                >
                  <PlayIcon className="play-icon" />
                  Watch Our Story
                </StateOfTheArtButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Controls */}
          <AnimatePresence>
            {showControls && !isLoading && (
              <motion.div
                ref={controlsRef}
                className="video-controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress Bar */}
                <div className="progress-container">
                  <div
                    className="progress-track"
                     role="button" tabIndex={0} onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      handleSeek(percent * duration);
                    } onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e => {
                      const rect = e.currentTarget.getBoundingClientRect;
                      const percent = e.clientX - rect.left / rect.width;
                      handleSeekpercent * duration;
                    (e); } }}}
                  >
                    <div ref={progressRef} className="progress-fill" />
            <div className="progress-glow" />
            </div>
                </div>

                {/* Control Buttons */}
                <div className="controls-row">
                  <div className="left-controls">
                    <StateOfTheArtButton
                      variant="ghost"
                      size="medium"
                      onClick={togglePlay}
                      className="control-button"
                    >
                      {isPlaying ? (
                        <PauseIcon className="control-icon" />
                      ) : (
                        <PlayIcon className="control-icon" />
                      )}
                    </StateOfTheArtButton>

                    <StateOfTheArtButton
                      variant="ghost"
                      size="medium"
                      onClick={toggleMute}
                      className="control-button"
                    >
                      {isMuted ? (
                        <SpeakerXMarkIcon className="control-icon" />
                      ) : (
                        <SpeakerWaveIcon className="control-icon" />
                      )}
                    </StateOfTheArtButton>

                    <div className="volume-slider-container">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="volume-slider"
                      />
            </div>

                    <div className="time-display">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="center-controls">
                    {currentChapter && (
                      <div className="current-chapter">{currentChapter.title}</div>
                    )}
                  </div>

                  <div className="right-controls">
                    {showChapters && chapters.length > 0 && (
                      <StateOfTheArtButton
                        variant="ghost"
                        size="medium"
                        onClick={() => setShowChapterMenu(!showChapterMenu)}
                        className="control-button"
                      >
                        <ChevronDownIcon className="control-icon" />
                        Chapters
                      </StateOfTheArtButton>
                    )}

                    <StateOfTheArtButton
                      variant="ghost"
                      size="medium"
                      onClick={handleLike}
                      className={`control-button like-button ${hasLiked ? 'liked' : ''}`}
                    >
                      <HeartIcon className="control-icon" />
                      {likes > 0 && <span className="like-count">{likes}</span>}
                    </StateOfTheArtButton>

                    <StateOfTheArtButton
                      variant="ghost"
                      size="medium"
                      onClick={toggleFullscreen}
                      className="control-button"
                    >
                      {isFullscreen ? (
                        <ArrowsPointingInIcon className="control-icon" />
                      ) : (
                        <ArrowsPointingOutIcon className="control-icon" />
                      )}
                    </StateOfTheArtButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter Menu */}
          <AnimatePresence>
            {showChapterMenu && chapters.length > 0 && (
              <motion.div
                className="chapter-menu"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <StateOfTheArtCard variant="glass" size="medium">
                  <h3 className="chapter-menu-title">Wedding Chapters</h3>
                  <div className="chapter-list">
                    {chapters.map((chapter, index) => (
                      <StateOfTheArtButton
                        key={index}
                        variant={currentChapter === chapter ? 'primary' : 'ghost'}
                        size="medium"
                        onClick={() => jumpToChapter(chapter)}
                        className="chapter-button"
                      >
                        <div className="chapter-info">
                          <span className="chapter-title">{chapter.title}</span>
                          <span className="chapter-time">{formatTime(chapter.time || 0)}</span>
                        </div>
                      </StateOfTheArtButton>
                    ))}
                  </div>
                </StateOfTheArtCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </StateOfTheArtCard>

      <style>{`
        .state-of-the-art-video-player {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .video-container-card {
          overflow: hidden !important;
          padding: 0 !important;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.7) 100%
          ) !important;
        }

        .video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: ${designTokens.borderRadius['3xl']};
          overflow: hidden;
          background: black;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: inherit;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(143, 168, 118, 0.9) 0%,
            rgba(184, 209, 166, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.1rem;
          gap: 1rem;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid white;
          animation: spin 1s linear infinite;
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
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
        }

        .main-play-button {
          font-size: 1.2rem !important;
          padding: 1.5rem 3rem !important;
          gap: 1rem;
        }

        .play-icon {
          width: 28px;
          height: 28px;
          margin-left: 4px;
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            transparent 100%
          );
          padding: 2rem 1.5rem 1.5rem;
          color: white;
        }

        .progress-container {
          margin-bottom: 1rem;
          position: relative;
        }

        .progress-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            ${getColor('primary.500')} 0%,
            ${getColor('primary.400')} 100%
          );
          border-radius: 3px;
          width: 0%;
          transition: width 0.1s ease;
        }

        .progress-glow {
          position: absolute;
          top: -2px;
          left: 0;
          right: 0;
          bottom: -2px;
          background: linear-gradient(
            90deg,
            ${getColor('primary.500')} 0%,
            ${getColor('primary.400')} 100%
          );
          border-radius: 5px;
          opacity: 0;
          filter: blur(4px);
          transition: opacity 0.3s ease;
        }

        .progress-track:hover .progress-glow {
          opacity: 0.4;
        }

        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .left-controls,
        .right-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .center-controls {
          flex: 1;
          text-align: center;
        }

        .control-button {
          color: white !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(10px);
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }

        .control-icon {
          width: 20px;
          height: 20px;
        }

        .volume-slider-container {
          width: 80px;
          margin: 0 0.5rem;
        }

        .volume-slider {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          outline: none;
          appearance: none;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .time-display {
          font-family: 'Monaco', monospace;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          min-width: 100px;
        }

        .current-chapter {
          font-size: 0.9rem;
          color: ${getColor('primary.300')};
          font-weight: 500;
        }

        .like-button.liked {
          color: #ef4444 !important;
        }

        .like-count {
          margin-left: 0.25rem;
          font-size: 0.8rem;
        }

        .chapter-menu {
          position: absolute;
          bottom: 100px;
          right: 1rem;
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 10;
        }

        .chapter-menu-title {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: ${getColor('neutral.800')};
        }

        .chapter-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .chapter-button {
          width: 100% !important;
          text-align: left !important;
          justify-content: flex-start !important;
        }

        .chapter-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          width: 100%;
        }

        .chapter-title {
          font-weight: 500;
        }

        .chapter-time {
          font-size: 0.8rem;
          opacity: 0.7;
          font-family: 'Monaco', monospace;
        }

        @media (max-width: 768px) {
          .controls-row {
            flex-direction: column;
            gap: 0.5rem;
          }

          .left-controls,
          .right-controls {
            justify-content: center;
          }

          .chapter-menu {
            right: 0.5rem;
            left: 0.5rem;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};


StateOfTheArtVideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  posterSrc: PropTypes.string
};

export default StateOfTheArtVideoPlayer;
