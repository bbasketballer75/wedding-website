'use client';

/**
 * 🎬 LUXURY VIDEO-CENTRIC HOMEPAGE ✨
 *
 * A sophisticated wedding homepage featuring 2025 luxury design standards:
 * - Minimalist grandeur with oversized luxury typography
 * - Sage green and blush color palette
 * - Smooth scroll animations and sophisticated micro-interactions
 * - Premium Cormorant Garamond typography
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { AudioProvider, useInteractionSounds } from '../components/AmbientSoundSystem';
import {
  fadeInUp,
  MagneticButton,
  ParallaxMotion,
  romanticReveal,
  WeddingTextReveal,
} from '../components/animations/SophisticatedAnimations';
import VideoHero from '../components/features/VideoHero';
import ModernNavigation from '../components/ui/ModernNavigation';

const VideoHomePage = () => {
  const { playClick, playHover } = useInteractionSounds();

  // State for extended content
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
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-blush-50">
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
              className="relative z-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Chapter Overview Section - Luxury 2025 Design */}
              <section id="chapters" className="py-32 bg-gradient-to-br from-sage-50 to-blush-50">
                <div className="max-w-6xl mx-auto px-8">
                  <motion.div
                    className="text-center mb-20"
                    {...romanticReveal}
                    viewport={{ once: true }}
                  >
                    <WeddingTextReveal
                      text="Our Wedding Story"
                      className="text-6xl md:text-8xl font-display font-light text-eucalyptus-800 mb-8"
                    />
                    <motion.p
                      className="text-xl md:text-2xl text-sage-600 max-w-3xl mx-auto leading-relaxed font-light"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      Discover the moments that made our day extraordinary, from the quiet
                      preparations to the euphoric celebration beneath the stars
                    </motion.p>
                  </motion.div>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {weddingChapters.map((chapter, index) => (
                      <motion.div
                        key={chapter.id}
                        className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8
                                 border border-sage-100 hover:border-blush-200 transition-all duration-500
                                 hover:shadow-2xl hover:shadow-sage-200/20 cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        onMouseEnter={playHover}
                      >
                        <MagneticButton className="w-full h-full">
                          <ParallaxMotion speed={0.2}>
                            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                              {chapter.emoji}
                            </div>
                          </ParallaxMotion>
                          <h3
                            className="text-2xl font-display font-medium text-eucalyptus-800 mb-4
                                       group-hover:text-blush-600 transition-colors duration-300"
                          >
                            {chapter.title}
                          </h3>
                          <p className="text-sage-600 leading-relaxed mb-6 font-light">
                            {chapter.description}
                          </p>
                          <div className="text-sm font-medium text-blush-500 tracking-wider uppercase">
                            {Math.floor((chapter.endTime - chapter.startTime) / 60)}m{' '}
                            {Math.floor((chapter.endTime - chapter.startTime) % 60)}s
                          </div>

                          {/* Luxury hover overlay */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-blush-50/0 to-sage-50/0
                                        group-hover:from-blush-50/30 group-hover:to-sage-50/30
                                        transition-all duration-500 rounded-3xl pointer-events-none"
                          />
                        </MagneticButton>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Film Features Section - Luxury Design */}
              <section
                id="features"
                className="py-32 bg-gradient-to-br from-eucalyptus-50 to-sage-100"
              >
                <div className="max-w-6xl mx-auto px-8">
                  <motion.div className="text-center mb-20" {...fadeInUp} viewport={{ once: true }}>
                    <h2 className="text-5xl md:text-7xl font-display font-light text-eucalyptus-800 mb-8">
                      Film Features
                    </h2>
                    <p className="text-xl md:text-2xl text-sage-600 max-w-3xl mx-auto leading-relaxed font-light">
                      An immersive cinematic experience crafted for sharing precious memories and
                      reliving our most cherished moments
                    </p>
                  </motion.div>
                  <div className="grid md:grid-cols-3 gap-12">
                    <motion.div
                      className="group text-center"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      onMouseEnter={playHover}
                    >
                      <MagneticButton>
                        <div
                          className="bg-white/80 backdrop-blur-sm rounded-full w-32 h-32 mx-auto mb-8
                                      flex items-center justify-center border border-sage-200
                                      group-hover:border-blush-200 transition-all duration-500
                                      group-hover:shadow-2xl group-hover:shadow-sage-200/20"
                        >
                          <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                            🎬
                          </div>
                        </div>
                        <h3
                          className="text-2xl font-display font-medium text-eucalyptus-800 mb-4
                                     group-hover:text-blush-600 transition-colors duration-300"
                        >
                          Chapter Navigation
                        </h3>
                        <p className="text-sage-600 leading-relaxed font-light max-w-xs mx-auto">
                          Navigate seamlessly through our wedding story with intuitive chapter
                          markers
                        </p>
                      </MagneticButton>
                    </motion.div>
                    <motion.div
                      className="group text-center"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      onMouseEnter={playHover}
                    >
                      <MagneticButton>
                        <div
                          className="bg-white/80 backdrop-blur-sm rounded-full w-32 h-32 mx-auto mb-8
                                      flex items-center justify-center border border-sage-200
                                      group-hover:border-blush-200 transition-all duration-500
                                      group-hover:shadow-2xl group-hover:shadow-sage-200/20"
                        >
                          <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                            📱
                          </div>
                        </div>
                        <h3
                          className="text-2xl font-display font-medium text-eucalyptus-800 mb-4
                                     group-hover:text-blush-600 transition-colors duration-300"
                        >
                          Responsive Design
                        </h3>
                        <p className="text-sage-600 leading-relaxed font-light max-w-xs mx-auto">
                          Experience our film beautifully on every device with adaptive controls
                        </p>
                      </MagneticButton>
                    </motion.div>
                    <motion.div
                      className="group text-center"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      onMouseEnter={playHover}
                    >
                      <MagneticButton>
                        <div
                          className="bg-white/80 backdrop-blur-sm rounded-full w-32 h-32 mx-auto mb-8
                                      flex items-center justify-center border border-sage-200
                                      group-hover:border-blush-200 transition-all duration-500
                                      group-hover:shadow-2xl group-hover:shadow-sage-200/20"
                        >
                          <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                            🔗
                          </div>
                        </div>
                        <h3
                          className="text-2xl font-display font-medium text-eucalyptus-800 mb-4
                                     group-hover:text-blush-600 transition-colors duration-300"
                        >
                          Share Moments
                        </h3>
                        <p className="text-sage-600 leading-relaxed font-light max-w-xs mx-auto">
                          Share specific moments with family using precise timestamps
                        </p>
                      </MagneticButton>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Call to Action Section - Luxury Design */}
              <section
                id="explore"
                className="py-32 bg-gradient-to-br from-eucalyptus-600 via-sage-700 to-blush-600 relative overflow-hidden"
              >
                {/* Elegant background patterns */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-20 right-20 w-80 h-80 bg-blush-200 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-5xl mx-auto px-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  >
                    <h2 className="text-5xl md:text-7xl font-display font-light text-white mb-8">
                      Explore More Wedding Memories
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light mb-16">
                      Our wedding film is just the beginning. Discover intimate photo galleries,
                      heartfelt guest messages, and interactive features that keep our celebration
                      alive in your heart.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                      <MagneticButton
                        onClick={() => scrollToSection('chapters')}
                        onMouseEnter={playHover}
                        className="group bg-white text-eucalyptus-700 px-12 py-6 rounded-full font-medium text-lg
                                 hover:bg-blush-50 transition-all duration-500 hover:shadow-2xl
                                 hover:shadow-white/20 min-w-[220px] flex items-center justify-center gap-4"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          📸
                        </span>{' '}
                        Photo Gallery
                      </MagneticButton>
                      <MagneticButton
                        onClick={() => scrollToSection('chapters')}
                        onMouseEnter={playHover}
                        className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30
                                 px-12 py-6 rounded-full font-medium text-lg hover:bg-white/20 hover:border-white/50
                                 transition-all duration-500 min-w-[220px] flex items-center justify-center gap-4"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          💌
                        </span>{' '}
                        Guest Messages
                      </MagneticButton>
                      <MagneticButton
                        onClick={() => scrollToSection('chapters')}
                        onMouseEnter={playHover}
                        className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30
                                 px-12 py-6 rounded-full font-medium text-lg hover:bg-white/20 hover:border-white/50
                                 transition-all duration-500 min-w-[220px] flex items-center justify-center gap-4"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          🗺️
                        </span>{' '}
                        Interactive Map
                      </MagneticButton>
                    </div>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AudioProvider>
  );
};

export default VideoHomePage;
