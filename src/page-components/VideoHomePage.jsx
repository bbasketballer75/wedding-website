'use client';

/**
 * 🎬 VIDEO-CENTRIC HOMEPAGE ✨
 *
 * A completely redesigned homepage that makes the wedding video the centerpiece
 * while maintaining all magical UX elements and providing an amazing experience.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { AudioProvider, useInteractionSounds } from '../components/AmbientSoundSystem';
import VideoHero from '../components/features/VideoHero';
import ModernNavigation from '../components/ui/ModernNavigation';

const VideoHomePage = () => {
  const { playClick, playHover } = useInteractionSounds();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showExtendedContent, setShowExtendedContent] = useState(false);

  // Wedding video chapters (loaded from VTT file data)
  const weddingChapters = [
    {
      id: 1,
      title: 'Bachelor/ette Weekend',
      startTime: 0,
      endTime: 44.64,
      description: 'The adventure begins with our bachelor and bachelorette parties',
      emoji: '🎉',
    },
    {
      id: 2,
      title: 'Getting Ready',
      startTime: 44.64,
      endTime: 131.798,
      description: 'Morning preparations and getting dressed for our big day',
      emoji: '💄',
    },
    {
      id: 3,
      title: 'First Look',
      startTime: 131.798,
      endTime: 280.613,
      description: 'The magical moment we first saw each other',
      emoji: '😍',
    },
    {
      id: 4,
      title: 'Bridal Party Photos',
      startTime: 280.613,
      endTime: 397.73,
      description: 'Capturing memories with our closest friends',
      emoji: '📸',
    },
    {
      id: 5,
      title: 'Family Photos',
      startTime: 397.73,
      endTime: 495.995,
      description: 'Precious moments with our beloved families',
      emoji: '👨‍👩‍👧‍👦',
    },
    {
      id: 6,
      title: 'Ceremony Prep',
      startTime: 495.995,
      endTime: 571.738,
      description: 'Final preparations before walking down the aisle',
      emoji: '🌸',
    },
    {
      id: 7,
      title: 'Wedding Ceremony',
      startTime: 571.738,
      endTime: 863.029,
      description: 'We become husband and wife in front of our loved ones',
      emoji: '💒',
    },
    {
      id: 8,
      title: 'Gameshow',
      startTime: 863.029,
      endTime: 1137.136,
      description: 'Fun and games with our wedding party',
      emoji: '🎮',
    },
    {
      id: 9,
      title: 'Cocktail Hour',
      startTime: 1137.136,
      endTime: 1537.536,
      description: 'Celebrating with drinks and appetizers',
      emoji: '🍸',
    },
    {
      id: 10,
      title: 'Vows',
      startTime: 1537.536,
      endTime: 1688.52,
      description: 'Our heartfelt promises to each other',
      emoji: '💕',
    },
    {
      id: 11,
      title: 'Reception & Dancing',
      startTime: 1688.52,
      endTime: 2705.0,
      description: 'The party continues with dinner, toasts, and dancing',
      emoji: '💃',
    },
  ];

  const handleVideoReady = useCallback(() => {
    setIsVideoReady(true);
    setTimeout(() => {
      setShowExtendedContent(true);
    }, 2000);
  }, []);

  const scrollToSection = useCallback(
    (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        playClick();
      }
    },
    [playClick]
  );

  return (
    <AudioProvider>
      <div className="video-homepage">
        {/* Modern Navigation */}
        <ModernNavigation />

        {/* Video Hero Section */}
        <VideoHero
          videoSrc="/video/wedding-film.mp4"
          posterSrc="/images/wedding-poster.jpg"
          chapters={weddingChapters}
          showWelcomeOverlay={true}
          autoplay={true}
          onVideoReady={handleVideoReady}
        />

        {/* Extended Content - appears after video interaction */}
        <AnimatePresence>
          {showExtendedContent && (
            <motion.div
              className="extended-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Chapter Overview Section */}
              <section id="chapters" className="chapters-section">
                <div className="container">
                  <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="section-title">Our Wedding Story</h2>
                    <p className="section-subtitle">
                      Discover the moments that made our day special, from getting ready to the last
                      dance
                    </p>
                  </motion.div>

                  <div className="chapters-grid">
                    {weddingChapters.map((chapter, index) => (
                      <motion.div
                        key={chapter.id}
                        className="chapter-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onMouseEnter={playHover}
                      >
                        <div className="chapter-emoji">{chapter.emoji}</div>
                        <h3 className="chapter-title">{chapter.title}</h3>
                        <p className="chapter-description">{chapter.description}</p>
                        <div className="chapter-duration">
                          {Math.floor((chapter.endTime - chapter.startTime) / 60)}m{' '}
                          {Math.floor((chapter.endTime - chapter.startTime) % 60)}s
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Video Features Section */}
              <section id="features" className="features-section">
                <div className="container">
                  <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="section-title">Film Features</h2>
                    <p className="section-subtitle">
                      An interactive viewing experience designed for sharing memories
                    </p>
                  </motion.div>

                  <div className="features-grid">
                    <motion.div
                      className="feature-card"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      whileHover={{ scale: 1.03 }}
                      onMouseEnter={playHover}
                    >
                      <div className="feature-icon">🎬</div>
                      <h3 className="feature-title">Chapter Navigation</h3>
                      <p className="feature-description">
                        Jump to any moment in our wedding story with easy chapter navigation
                      </p>
                    </motion.div>

                    <motion.div
                      className="feature-card"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      onMouseEnter={playHover}
                    >
                      <div className="feature-icon">📱</div>
                      <h3 className="feature-title">Mobile Optimized</h3>
                      <p className="feature-description">
                        Watch seamlessly on any device with responsive video controls
                      </p>
                    </motion.div>

                    <motion.div
                      className="feature-card"
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      whileHover={{ scale: 1.03 }}
                      onMouseEnter={playHover}
                    >
                      <div className="feature-icon">🔗</div>
                      <h3 className="feature-title">Share Moments</h3>
                      <p className="feature-description">
                        Share specific moments with timestamps to relive favorite scenes
                      </p>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Call to Action Section */}
              <section id="explore" className="cta-section">
                <div className="container">
                  <motion.div
                    className="cta-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="cta-title">Explore More Wedding Memories</h2>
                    <p className="cta-subtitle">
                      Our wedding film is just the beginning. Discover photo galleries, guest
                      messages, and interactive features that keep our celebration alive.
                    </p>

                    <div className="cta-buttons">
                      <motion.button
                        className="cta-button primary"
                        onClick={() => scrollToSection('chapters')}
                        onMouseEnter={playHover}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>📸</span>
                        Photo Gallery
                      </motion.button>

                      <motion.button
                        className="cta-button secondary"
                        onClick={() => scrollToSection('chapters')}
                        onMouseEnter={playHover}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>💌</span>
                        Guest Messages
                      </motion.button>

                      <motion.button
                        className="cta-button secondary"
                        onClick={() => scrollToSection('chapters')}
                        onMouseEnter={playHover}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>🗺️</span>
                        Interactive Map
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .video-homepage {
            min-height: 100vh;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }

          .extended-content {
            background: linear-gradient(180deg, transparent 0%, #ffffff 10%);
            padding-top: 4rem;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          .section-header {
            text-align: center;
            margin-bottom: 4rem;
          }

          .section-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 1rem;
            font-family: 'Playfair Display', serif;
            background: linear-gradient(135deg, #2d3748 0%, #8fa876 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .section-subtitle {
            font-size: 1.25rem;
            color: #4a5568;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
          }

          /* Chapters Section */
          .chapters-section {
            padding: 6rem 0;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          }

          .chapters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
          }

          .chapter-card {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(143, 168, 118, 0.1);
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .chapter-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #8fa876 0%, #b8d1a6 100%);
          }

          .chapter-card:hover {
            box-shadow: 0 8px 40px rgba(143, 168, 118, 0.15);
            border-color: rgba(143, 168, 118, 0.3);
          }

          .chapter-emoji {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
          }

          .chapter-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.75rem;
            font-family: 'Playfair Display', serif;
          }

          .chapter-description {
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 1rem;
          }

          .chapter-duration {
            color: #8fa876;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          /* Features Section */
          .features-section {
            padding: 6rem 0;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2.5rem;
            margin-top: 2rem;
          }

          .feature-card {
            background: white;
            border-radius: 16px;
            padding: 2.5rem 2rem;
            text-align: center;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.8);
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
            backdrop-filter: blur(10px);
          }

          .feature-card:hover {
            box-shadow: 0 12px 50px rgba(143, 168, 118, 0.2);
            border-color: rgba(143, 168, 118, 0.2);
          }

          .feature-icon {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            display: block;
          }

          .feature-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 1rem;
            font-family: 'Playfair Display', serif;
          }

          .feature-description {
            color: #4a5568;
            line-height: 1.6;
            font-size: 1rem;
          }

          /* CTA Section */
          .cta-section {
            padding: 6rem 0;
            background: linear-gradient(135deg, #8fa876 0%, #6b8a4f 100%);
            color: white;
            text-align: center;
          }

          .cta-content {
            max-width: 800px;
            margin: 0 auto;
          }

          .cta-title {
            font-size: clamp(2rem, 4vw, 3.5rem);
            font-weight: 700;
            margin-bottom: 1.5rem;
            font-family: 'Playfair Display', serif;
          }

          .cta-subtitle {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 3rem;
            opacity: 0.95;
          }

          .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            flex-wrap: wrap;
          }

          .cta-button {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
            text-decoration: none;
            min-width: 180px;
            justify-content: center;
          }

          .cta-button.primary {
            background: white;
            color: #8fa876;
            box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
          }

          .cta-button.primary:hover {
            background: #f8f9fa;
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(255, 255, 255, 0.3);
          }

          .cta-button.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
          }

          .cta-button.secondary:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
          }

          .cta-button span {
            font-size: 1.2rem;
          }

          @media (max-width: 768px) {
            .container {
              padding: 0 1rem;
            }

            .chapters-grid,
            .features-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }

            .chapter-card,
            .feature-card {
              padding: 1.5rem;
            }

            .cta-buttons {
              flex-direction: column;
              align-items: center;
            }

            .cta-button {
              width: 100%;
              max-width: 280px;
            }

            .chapters-section,
            .features-section,
            .cta-section {
              padding: 4rem 0;
            }
          }
        `}</style>
      </div>
    </AudioProvider>
  );
};

export default VideoHomePage;
