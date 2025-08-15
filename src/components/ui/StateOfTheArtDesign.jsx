'use client';

/**
 * 🎨 STATE-OF-THE-ART DESIGN SYSTEM ✨
 *
 * Professional-grade components using GSAP, Headless UI, and modern design principles
 */

import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';
import { PauseIcon, PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Professional Video Controls with GSAP animations
 */
export const StateOfTheArtVideoControls = ({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  currentTime = 0,
  duration = 0,
  onSeek,
}) => {
  const controlsRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    if (!controlsRef.current) return;

    // GSAP entrance animation
    gsap.fromTo(
      controlsRef.current,
      {
        y: 50,
        opacity: 0,
        filter: 'blur(10px)',
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
      }
    );

    // Hover animations
    const buttons = controlsRef.current.querySelectorAll('.control-button');
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener('mouseenter', () => {});
        button.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Update progress bar with GSAP
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

  return (
    <div ref={controlsRef} className="state-of-the-art-controls">
      {/* Progress Bar */}
      <div className="progress-container">
        <div
          className="progress-track"
           role="button" tabIndex={0} onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            onSeek(percent * duration);
          } onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e => {
            const rect = e.currentTarget.getBoundingClientRect;
            const percent = e.clientX - rect.left / rect.width;
            onSeekpercent * duration;
          (e); } }}}
        >
          <div ref={progressRef} className="progress-fill" />
            <div className="progress-glow" />
            </div>
      </div>

      {/* Control Buttons */}
      <div className="controls-row">
        <button
          className="control-button play-pause"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="button-background" />
          {isPlaying ? (
            <PauseIcon className="control-icon" />
          ) : (
            <PlayIcon className="control-icon play-icon" />
          )}
        </button>

        <div className="volume-control">
          <button
            className="control-button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <div className="button-background" />
            {isMuted ? (
              <SpeakerXMarkIcon className="control-icon" />
            ) : (
              <SpeakerWaveIcon className="control-icon" />
            )}
          </button>

          <div className="volume-slider-container">
            <input
              ref={volumeRef}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="volume-slider"
            />
            </div>
        </div>

        <div className="time-display">
          <span className="time-current">{formatTime(currentTime)}</span>
          <span className="time-separator">/</span>
          <span className="time-total">{formatTime(duration)}</span>
        </div>
      </div>

      <style>{`
        .state-of-the-art-controls {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.5rem;
          margin: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .progress-container {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .progress-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8fa876 0%, #b8d1a6 100%);
          border-radius: 3px;
          position: relative;
          width: 0%;
        }

        .progress-glow {
          position: absolute;
          top: -2px;
          left: 0;
          right: 0;
          bottom: -2px;
          background: linear-gradient(90deg, #8fa876 0%, #b8d1a6 100%);
          border-radius: 5px;
          opacity: 0;
          filter: blur(4px);
          transition: opacity 0.3s ease;
        }

        .progress-track:hover .progress-glow {
          opacity: 0.3;
        }

        .controls-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .control-button {
          position: relative;
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 50%;
          background: transparent;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .button-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .control-button:hover .button-background {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .control-icon {
          width: 20px;
          height: 20px;
          position: relative;
          z-index: 1;
        }

        .play-pause {
          width: 56px;
          height: 56px;
        }

        .play-pause .control-icon {
          width: 24px;
          height: 24px;
        }

        .play-icon {
          margin-left: 2px;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .volume-slider-container {
          position: relative;
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
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
          transition: all 0.3s ease;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(143, 168, 118, 0.4);
        }

        .time-display {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .time-separator {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

/**
 * Professional Modal Dialog with GSAP animations
 */
StateOfTheArtVideoControls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  isMuted: PropTypes.bool.isRequired,
  onToggleMute: PropTypes.func.isRequired,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  onSeek: PropTypes.func.isRequired
};

export const StateOfTheArtModal = ({ isOpen, onClose, title, children }) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        {
          scale: 0.8,
          opacity: 0,
          rotationY: -15,
          transformPerspective: 1000,
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 0.6,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as="div" className="modal-container" onClose={onClose}>
          <div ref={overlayRef} className="modal-overlay" aria-hidden="true" />
            <div className="modal-wrapper">
            <div className="modal-content-wrapper">
              <Dialog.Panel ref={modalRef} className="modal-panel">
                <Dialog.Title className="modal-title">{title}</Dialog.Title>

                <div className="modal-content">{children}</div>

                <button className="modal-close" onClick={onClose}>
                  ×
                </button>
              </Dialog.Panel>
            </div>
          </div>

          <style>{`
            .modal-container {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1000;
            }

            .modal-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(8px);
            }

            .modal-wrapper {
              position: relative;
              z-index: 1001;
              display: flex;
              min-height: 100vh;
              align-items: center;
              justify-content: center;
              padding: 2rem;
            }

            .modal-content-wrapper {
              width: 100%;
              max-width: 600px;
            }

            .modal-panel {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.95) 0%,
                rgba(255, 255, 255, 0.9) 100%
              );
              backdrop-filter: blur(20px);
              border-radius: 20px;
              padding: 2rem;
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
              position: relative;
            }

            .modal-title {
              font-size: 1.5rem;
              font-weight: 700;
              color: #2d3748;
              margin-bottom: 1.5rem;
              font-family: 'Playfair Display', serif;
            }

            .modal-content {
              color: #4a5568;
              line-height: 1.6;
            }

            .modal-close {
              position: absolute;
              top: 1rem;
              right: 1rem;
              width: 32px;
              height: 32px;
              border: none;
              background: rgba(0, 0, 0, 0.1);
              border-radius: 50%;
              color: #4a5568;
              font-size: 1.5rem;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
            }

            .modal-close:hover {
              background: rgba(0, 0, 0, 0.2);
              transform: scale(1.1);
            }
          `}</style>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

/**
 * Advanced Parallax Section with GSAP ScrollTrigger
 */
StateOfTheArtModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export const StateOfTheArtParallax = ({ children, speed = 0.5, className = '' }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;

    // Parallax effect
    gsap.to(content, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Fade in animation
    gsap.fromTo(
      content,
      {
        opacity: 0,
        y: 100,
        filter: 'blur(10px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [speed]);

  return (
    <div ref={sectionRef} className={`parallax-section ${className}`}>
      <div ref={contentRef} className="parallax-content">
        {children}
      </div>

      <style>{`
        .parallax-section {
          position: relative;
          overflow: hidden;
        }

        .parallax-content {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
};

/**
 * Professional Loading Animation with GSAP
 */
export const StateOfTheArtLoader = ({
  isLoading,
  message = 'Loading your wedding memories...',
}) => {
  const loaderRef = useRef(null);
  const dotsRef = useRef(null);

  useEffect(() => {
    if (!isLoading || !loaderRef.current || !dotsRef.current) return;

    // Entrance animation
    gsap.fromTo(
      loaderRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );

    // Animated dots
    const dots = dotsRef.current.children;
    gsap.to(dots, {
      y: -10,
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
    });

    return () => {
      gsap.killTweensOf([loaderRef.current, dots]);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div ref={loaderRef} className="loader-content">
        <div className="loader-animation">
          <div className="loader-ring">
            <div className="loader-ring-inner" />
            </div>
        </div>

        <p className="loader-message">{message}</p>

        <div ref={dotsRef} className="loader-dots">
          <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            </div>
      </div>

      <style>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(143, 168, 118, 0.95) 0%,
            rgba(184, 209, 166, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .loader-content {
          text-align: center;
          color: white;
        }

        .loader-animation {
          margin-bottom: 2rem;
        }

        .loader-ring {
          width: 80px;
          height: 80px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid white;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }

        .loader-ring-inner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          border-right: 3px solid white;
          margin: 6px;
          animation: spin 0.8s linear infinite reverse;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loader-message {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .loader-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          display: block;
        }
      `}</style>
    </div>
  );
};

// Utility function
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};
