'use client';

/**
 * 🎬 VIDEO-CENTRIC HERO SECTION ✨
 *
 * A magical hero section that prominently features the wedding video
 * with elegant overlays, smart autoplay handling, and seamless UX.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useInteractionSounds } from '../AmbientSoundSystem';
import EnhancedVideoPlayer from '../media/EnhancedVideoPlayer';

const VideoHero = ({
  videoSrc = '/video/wedding-film.mp4',
  posterSrc = '/images/wedding-poster.jpg',
  chapters = [],
  showWelcomeOverlay = true,
  autoplay = true,
}) => {
  const [showWelcome, setShowWelcome] = useState(showWelcomeOverlay);
  const [hasStartedVideo, setHasStartedVideo] = useState(false);
  const { playClick, playHover } = useInteractionSounds();

  // Load default chapters if none provided
  const defaultChapters = [
    { title: 'Bachelor/ette Weekend', startTime: 0, endTime: 44.64 },
    { title: 'Getting Ready', startTime: 44.64, endTime: 131.798 },
    { title: 'First Look', startTime: 131.798, endTime: 280.613 },
    { title: 'Bridal Party Photos', startTime: 280.613, endTime: 397.73 },
    { title: 'Family Photos', startTime: 397.73, endTime: 495.995 },
    { title: 'Ceremony Prep', startTime: 495.995, endTime: 571.738 },
    { title: 'Wedding Ceremony', startTime: 571.738, endTime: 863.029 },
    { title: 'Gameshow', startTime: 863.029, endTime: 1137.136 },
    { title: 'Cocktail Hour', startTime: 1137.136, endTime: 1537.536 },
    { title: 'Vows', startTime: 1537.536, endTime: 1688.52 },
    { title: 'Reception & Dancing', startTime: 1688.52, endTime: 2705.0 },
  ];

  const videoChapters = chapters.length > 0 ? chapters : defaultChapters;

  const handleStartVideo = useCallback(() => {
    setShowWelcome(false);
    setHasStartedVideo(true);
    playClick();
  }, [playClick]);

  // Keyboard shortcut to start video
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && showWelcome) {
        e.preventDefault();
        handleStartVideo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showWelcome, handleStartVideo]);

  return (
    <section className="video-hero">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="welcome-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="welcome-content">
              <motion.div
                className="welcome-text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="hero-title">
                  <span className="title-line">Austin & Jordyn</span>
                  <span className="title-line title-accent">Our Wedding Film</span>
                </h1>

                <p className="hero-subtitle">
                  Experience our special day through this feature-length wedding film, capturing
                  every magical moment from beginning to end.
                </p>

                <div className="hero-details">
                  <div className="detail-item">
                    <span className="detail-icon">🎬</span>
                    <span>45 minutes of memories</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📖</span>
                    <span>11 chapters to explore</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💕</span>
                    <span>Our complete story</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="welcome-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <button
                  className="start-video-button"
                  onClick={handleStartVideo}
                  onMouseEnter={playHover}
                >
                  <span className="button-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="button-text">Watch Our Wedding Film</span>
                </button>

                <p className="interaction-hint">
                  Press <kbd>Space</kbd> or <kbd>Enter</kbd> to begin
                </p>
              </motion.div>

              {/* Floating elements */}
              <div className="floating-elements">
                <motion.div
                  className="floating-heart"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ left: '15%', top: '20%' }}
                >
                  💕
                </motion.div>
                <motion.div
                  className="floating-heart"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, -3, 3, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  style={{ right: '20%', top: '30%' }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="floating-heart"
                  animate={{
                    y: [0, -25, 0],
                    rotate: [0, 7, -7, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                  }}
                  style={{ left: '75%', top: '60%' }}
                >
                  🎬
                </motion.div>
              </div>
            </div>

            {/* Background gradient overlay */}
            <div className="welcome-background">
              <div className="gradient-overlay"></div>
              <div className="pattern-overlay"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player */}
      <motion.div
        className="video-container"
        initial={{ scale: showWelcome ? 0.95 : 1, opacity: showWelcome ? 0 : 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      >
        <EnhancedVideoPlayer
          src={videoSrc}
          posterSrc={posterSrc}
          title="Austin & Jordyn's Wedding Film"
          chapters={videoChapters}
          autoplay={autoplay && hasStartedVideo}
          showChapters={true}
          className="hero-video-player"
        />
      </motion.div>

      {/* Video Info Overlay (appears after video starts) */}
      <AnimatePresence>
        {hasStartedVideo && !showWelcome && (
          <motion.div
            className="video-info-overlay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="video-info-content">
              <h2 className="video-title">Our Wedding Film</h2>
              <p className="video-description">Relive our special day with family and friends</p>
              <div className="video-stats">
                <span className="stat">
                  <strong>{videoChapters.length}</strong> Chapters
                </span>
                <span className="stat-separator">•</span>
                <span className="stat">
                  <strong>45</strong> Minutes
                </span>
                <span className="stat-separator">•</span>
                <span className="stat">
                  <strong>HD</strong> Quality
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .video-hero {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .welcome-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .welcome-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(143, 168, 118, 0.9) 0%,
            rgba(184, 209, 166, 0.8) 50%,
            rgba(255, 255, 255, 0.9) 100%
          );
        }

        .pattern-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(143, 168, 118, 0.1) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(1deg);
          }
        }

        .welcome-content {
          text-align: center;
          max-width: 800px;
          padding: 2rem;
          position: relative;
          z-index: 10;
        }

        .welcome-text {
          margin-bottom: 3rem;
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          font-family: 'Playfair Display', serif;
        }

        .title-line {
          display: block;
          color: #2d3748;
        }

        .title-accent {
          background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: italic;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-details {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          color: #2d3748;
          font-weight: 500;
        }

        .detail-icon {
          font-size: 1.3rem;
        }

        .welcome-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .start-video-button {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
          color: white;
          border: none;
          padding: 1.25rem 2.5rem;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 10px 30px rgba(143, 168, 118, 0.3);
          position: relative;
          overflow: hidden;
        }

        .start-video-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .start-video-button:hover::before {
          left: 100%;
        }

        .start-video-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 40px rgba(143, 168, 118, 0.4);
        }

        .button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .button-icon svg {
          width: 20px;
          height: 20px;
          margin-left: 2px;
        }

        .interaction-hint {
          color: #718096;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .interaction-hint kbd {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #cbd5e0;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2d3748;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .floating-heart {
          position: absolute;
          font-size: 2rem;
          opacity: 0.6;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .video-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 10;
        }

        .hero-video-player {
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
          border-radius: 16px;
          overflow: hidden;
        }

        .video-info-overlay {
          position: absolute;
          top: 2rem;
          left: 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 300px;
          z-index: 15;
        }

        .video-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-family: 'Playfair Display', serif;
        }

        .video-description {
          color: #4a5568;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .video-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #718096;
        }

        .stat {
          font-weight: 500;
        }

        .stat strong {
          color: #8fa876;
          font-weight: 700;
        }

        .stat-separator {
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .video-hero {
            min-height: 100vh;
            padding: 1rem;
          }

          .welcome-content {
            padding: 1rem;
          }

          .hero-title {
            font-size: clamp(2.5rem, 10vw, 4rem);
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          .hero-details {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }

          .start-video-button {
            padding: 1rem 2rem;
            font-size: 1.1rem;
          }

          .video-container {
            padding: 1rem;
          }

          .video-info-overlay {
            position: static;
            margin-top: 1rem;
            max-width: none;
          }

          .floating-heart {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-details {
            gap: 0.75rem;
          }

          .detail-item {
            font-size: 1rem;
          }

          .start-video-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default VideoHero;
