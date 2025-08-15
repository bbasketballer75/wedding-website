'use client';

/**
 * 🎨 ENHANCED VIDEO HOMEPAGE WITH STATE-OF-THE-ART DESIGN ✨
 *
 * A professional video-centric homepage using our new design system
 * with GSAP animations, glassmorphism effects, and modern interactions
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import EnhancedVideoPlayer from '../components/media/EnhancedVideoPlayer';
import { StateOfTheArtButton } from '../components/ui/StateOfTheArtButton';
import { StateOfTheArtCard } from '../components/ui/StateOfTheArtCard';
import { designTokens, getColor, getSpacing } from '../styles/core/design-tokens';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const StateOfTheArtVideoHomePage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showExtendedContent, setShowExtendedContent] = useState(false);

  // Wedding video chapters with enhanced data
  const weddingChapters = [
    {
      id: 1,
      title: 'Bachelor/ette Weekend',
      time: 0,
      description: 'The adventure begins with our bachelor and bachelorette parties',
      emoji: '🎉',
    },
    {
      id: 2,
      title: 'Getting Ready',
      time: 44.64,
      description: 'Morning preparations and getting dressed for our big day',
      emoji: '💄',
    },
    {
      id: 3,
      title: 'First Look',
      time: 131.798,
      description: 'The magical moment we first saw each other',
      emoji: '😍',
    },
    {
      id: 4,
      title: 'Bridal Party Photos',
      time: 280.613,
      description: 'Fun times with our favorite people',
      emoji: '📸',
    },
    {
      id: 5,
      title: 'Ceremony',
      time: 397.73,
      description: 'We say "I do" surrounded by love',
      emoji: '💍',
    },
    {
      id: 6,
      title: 'Reception',
      time: 580.914,
      description: 'Dancing, dining, and celebrating',
      emoji: '🎊',
    },
    {
      id: 7,
      title: 'Speeches',
      time: 720.487,
      description: 'Heartfelt words from family and friends',
      emoji: '🎤',
    },
    {
      id: 8,
      title: 'First Dance',
      time: 850.182,
      description: 'Our special moment on the dance floor',
      emoji: '💃',
    },
    {
      id: 9,
      title: 'Party Time',
      time: 920.639,
      description: 'The celebration continues',
      emoji: '🕺',
    },
    {
      id: 10,
      title: 'Grand Exit',
      time: 1050.341,
      description: 'A magical send-off',
      emoji: '✨',
    },
    {
      id: 11,
      title: 'Honeymoon Preview',
      time: 1150.789,
      description: 'A glimpse of our romantic getaway',
      emoji: '🌴',
    },
  ];

  // GSAP Animations
  useEffect(() => {
    if (!heroRef.current) return;

    // Hero entrance animation
    gsap.fromTo(
      heroRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: designTokens.animations.easings.power3,
      }
    );

    // Features scroll animation
    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.children,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: designTokens.animations.easings.power3,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: designTokens.animations.easings.elegant,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleVideoReady = () => {
    setIsVideoReady(true);
  };

  const handleExploreMore = () => {
    setShowExtendedContent(true);

    // Smooth scroll to features
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="state-of-the-art-video-homepage">
      {/* Hero Section with Video */}
      <section ref={heroRef} className="hero-section">
        <StateOfTheArtCard variant="glass" size="xl" hoverable={false} className="hero-card">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Our Wedding Story</h1>
              <p className="hero-subtitle">
                A 45-minute cinematic journey through our magical wedding day
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">45</span>
                  <span className="stat-label">Minutes</span>
                </div>
                <div className="stat">
                  <span className="stat-number">11</span>
                  <span className="stat-label">Chapters</span>
                </div>
                <div className="stat">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">Memories</span>
                </div>
              </div>
            </div>

            <div className="video-container">
              <EnhancedVideoPlayer
                src="/video/wedding-full.mp4"
                posterSrc="/images/wedding-poster.jpg"
                title="Austin & Jordyn's Wedding Film"
                chapters={weddingChapters}
                autoplay={false}
                showChapters={true}
                onReady={handleVideoReady}
              />
            </div>
          </div>
        </StateOfTheArtCard>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features-section">
        <div className="features-header">
          <h2 className="section-title">Experience Our Love Story</h2>
          <p className="section-subtitle">
            Discover the magic through different perspectives and moments
          </p>
        </div>

        <div className="features-grid">
          <StateOfTheArtCard variant="wedding" size="large" className="feature-card">
            <div className="feature-content">
              <div className="feature-icon">📖</div>
              <h3 className="feature-title">Interactive Chapters</h3>
              <p className="feature-description">
                Navigate through 11 beautifully crafted chapters, each telling a unique part of our
                wedding day story.
              </p>
              <StateOfTheArtButton
                variant="primary"
                size="medium"
                onClick={() => document.querySelector('.video-container')?.scrollIntoView()}
              >
                Watch Now
              </StateOfTheArtButton>
            </div>
          </StateOfTheArtCard>

          <StateOfTheArtCard variant="glass" size="large" className="feature-card">
            <div className="feature-content">
              <div className="feature-icon">📸</div>
              <h3 className="feature-title">Photo Gallery</h3>
              <p className="feature-description">
                Browse through hundreds of professional photos capturing every emotion and detail of
                our special day.
              </p>
              <StateOfTheArtButton
                variant="secondary"
                size="medium"
                onClick={() => (window.location.href = '/gallery')}
              >
                View Gallery
              </StateOfTheArtButton>
            </div>
          </StateOfTheArtCard>

          <StateOfTheArtCard variant="elevated" size="large" className="feature-card">
            <div className="feature-content">
              <div className="feature-icon">💌</div>
              <h3 className="feature-title">Share Your Love</h3>
              <p className="feature-description">
                Leave us a message in our digital guestbook and become part of our forever story.
              </p>
              <StateOfTheArtButton
                variant="ghost"
                size="medium"
                onClick={() => (window.location.href = '/guestbook')}
              >
                Sign Guestbook
              </StateOfTheArtButton>
            </div>
          </StateOfTheArtCard>
        </div>
      </section>

      {/* Call to Action Section */}
      <section ref={ctaRef} className="cta-section">
        <StateOfTheArtCard variant="wedding" size="xl" className="cta-card">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Our Love Story?</h2>
            <p className="cta-description">
              Grab some popcorn, get comfortable, and join us for this cinematic journey through our
              magical wedding day.
            </p>
            <div className="cta-buttons">
              <StateOfTheArtButton
                variant="primary"
                size="xl"
                onClick={() => document.querySelector('.video-container')?.scrollIntoView()}
              >
                ▶️ Start Watching
              </StateOfTheArtButton>
              <StateOfTheArtButton variant="secondary" size="xl" onClick={handleExploreMore}>
                🌟 Explore More
              </StateOfTheArtButton>
            </div>
          </div>
        </StateOfTheArtCard>
      </section>

      <style>{`
        .state-of-the-art-video-homepage {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(246, 249, 244, 0.4) 0%,
            rgba(234, 242, 228, 0.3) 50%,
            rgba(255, 255, 255, 0.2) 100%
          );
        }

        .hero-section {
          padding: ${getSpacing(8)} ${getSpacing(6)};
          margin-bottom: ${getSpacing(16)};
        }

        .hero-card {
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: ${getSpacing(12)};
          align-items: center;
        }

        .hero-text {
          text-align: left;
        }

        .hero-title {
          font-family: ${designTokens.typography.fontFamilies.serif};
          font-size: ${designTokens.typography.fontSizes['6xl']};
          font-weight: ${designTokens.typography.fontWeights.bold};
          color: ${getColor('neutral.800')};
          margin: 0 0 ${getSpacing(4)} 0;
          line-height: ${designTokens.typography.lineHeights.tight};
          background: linear-gradient(
            135deg,
            ${getColor('primary.600')} 0%,
            ${getColor('primary.400')} 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: ${designTokens.typography.fontSizes['2xl']};
          color: ${getColor('neutral.600')};
          margin: 0 0 ${getSpacing(8)} 0;
          line-height: ${designTokens.typography.lineHeights.relaxed};
        }

        .hero-stats {
          display: flex;
          gap: ${getSpacing(8)};
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-family: ${designTokens.typography.fontFamilies.serif};
          font-size: ${designTokens.typography.fontSizes['4xl']};
          font-weight: ${designTokens.typography.fontWeights.bold};
          color: ${getColor('primary.500')};
          line-height: 1;
        }

        .stat-label {
          display: block;
          font-size: ${designTokens.typography.fontSizes.sm};
          color: ${getColor('neutral.500')};
          text-transform: uppercase;
          letter-spacing: ${designTokens.typography.letterSpacing.wide};
          margin-top: ${getSpacing(1)};
        }

        .video-container {
          border-radius: ${designTokens.borderRadius['3xl']};
          overflow: hidden;
          box-shadow: ${designTokens.shadows['2xl']};
        }

        .features-section {
          padding: ${getSpacing(16)} ${getSpacing(6)};
          max-width: 1400px;
          margin: 0 auto;
        }

        .features-header {
          text-align: center;
          margin-bottom: ${getSpacing(12)};
        }

        .section-title {
          font-family: ${designTokens.typography.fontFamilies.serif};
          font-size: ${designTokens.typography.fontSizes['5xl']};
          font-weight: ${designTokens.typography.fontWeights.bold};
          color: ${getColor('neutral.800')};
          margin: 0 0 ${getSpacing(4)} 0;
        }

        .section-subtitle {
          font-size: ${designTokens.typography.fontSizes['xl']};
          color: ${getColor('neutral.600')};
          max-width: 600px;
          margin: 0 auto;
          line-height: ${designTokens.typography.lineHeights.relaxed};
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: ${getSpacing(8)};
        }

        .feature-card {
          height: 100%;
        }

        .feature-content {
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .feature-icon {
          font-size: ${designTokens.typography.fontSizes['6xl']};
          margin-bottom: ${getSpacing(4)};
        }

        .feature-title {
          font-family: ${designTokens.typography.fontFamilies.serif};
          font-size: ${designTokens.typography.fontSizes['2xl']};
          font-weight: ${designTokens.typography.fontWeights.bold};
          color: ${getColor('neutral.800')};
          margin: 0 0 ${getSpacing(3)} 0;
        }

        .feature-description {
          color: ${getColor('neutral.600')};
          line-height: ${designTokens.typography.lineHeights.relaxed};
          margin: 0 0 ${getSpacing(6)} 0;
          flex: 1;
        }

        .cta-section {
          padding: ${getSpacing(16)} ${getSpacing(6)};
          margin-bottom: ${getSpacing(8)};
        }

        .cta-card {
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-content {
          text-align: center;
        }

        .cta-title {
          font-family: ${designTokens.typography.fontFamilies.serif};
          font-size: ${designTokens.typography.fontSizes['4xl']};
          font-weight: ${designTokens.typography.fontWeights.bold};
          color: ${getColor('neutral.800')};
          margin: 0 0 ${getSpacing(4)} 0;
          line-height: ${designTokens.typography.lineHeights.tight};
        }

        .cta-description {
          font-size: ${designTokens.typography.fontSizes['xl']};
          color: ${getColor('neutral.600')};
          line-height: ${designTokens.typography.lineHeights.relaxed};
          margin: 0 0 ${getSpacing(8)} 0;
        }

        .cta-buttons {
          display: flex;
          gap: ${getSpacing(4)};
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: ${getSpacing(8)};
          }

          .hero-title {
            font-size: ${designTokens.typography.fontSizes['5xl']};
          }
        }

        @media (max-width: 768px) {
          .hero-section,
          .features-section,
          .cta-section {
            padding-left: ${getSpacing(4)};
            padding-right: ${getSpacing(4)};
          }

          .hero-title {
            font-size: ${designTokens.typography.fontSizes['4xl']};
          }

          .hero-subtitle {
            font-size: ${designTokens.typography.fontSizes['xl']};
          }

          .section-title {
            font-size: ${designTokens.typography.fontSizes['4xl']};
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .hero-stats {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: ${designTokens.typography.fontSizes['3xl']};
          }

          .cta-title {
            font-size: ${designTokens.typography.fontSizes['3xl']};
          }
        }
      `}</style>
    </div>
  );
};

export default StateOfTheArtVideoHomePage;
