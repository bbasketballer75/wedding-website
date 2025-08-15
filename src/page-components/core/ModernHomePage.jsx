/**
 * 🌟 ELEGANT WEDDING HOME PAGE 🌟
 * Post-Wedding Celebration Website
 * Beautiful, Elegant, Wedding-Themed
 */

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { useIntersectionObserver } from '../../page-components/hooks/useIntersectionObserver';
import '../../styles/modern-2025-design.css';

const ModernHomePage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="modern-home-container">
      {/* 🌟 HERO SECTION - Elegant & Beautiful */}
      <motion.section
        className="hero-modern"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        {/* Floating decorative elements */}
        <motion.div
          className="floating-element-modern"
          style={{
            top: '20%',
            left: '10%',
            fontSize: '2rem',
            y: y1,
          }}
        >
          🌿
        </motion.div>

        <motion.div
          className="floating-element-modern"
          style={{
            top: '60%',
            right: '15%',
            fontSize: '1.5rem',
            y: y2,
          }}
        >
          💕
        </motion.div>

        <motion.div
          className="floating-element-modern"
          style={{
            bottom: '30%',
            left: '20%',
            fontSize: '1.8rem',
            y: y1,
          }}
        >
          ✨
        </motion.div>

        <motion.div className="hero-content-modern" style={{ opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="celebration-badge"
          >
            ✨ Celebrating Our Forever
          </motion.div>

          <motion.h1
            className="hero-title-modern"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Austin & Jordyn
          </motion.h1>

          <motion.p
            className="hero-subtitle-modern"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Eternal love, captured moments, cherished memories
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2rem',
            }}
          >
            <Link href="/memory-vault" className="btn-modern">
              <span>📸</span>
              <span>Our Beautiful Memories</span>
            </Link>
            <Link href="/guest-stories" className="btn-modern-outline">
              <span>💝</span>
              <span>Share Your Love</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 🎬 WEDDING VIDEO SECTION */}
      <VideoSection />

      {/* 💕 OUR LOVE STORY SECTION */}
      <OurStorySection />

      {/* 🖼️ PHOTO HIGHLIGHTS SECTION */}
      <PhotoHighlightsSection />

      {/* 💌 GUEST MEMORIES SECTION */}
      <GuestMemoriesSection />

      {/* 🎉 CELEBRATION STATS */}
      <CelebrationStatsSection />
    </div>
  );
};

// 🎬 Wedding Video Section Component
const VideoSection = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.3 });

  return (
    <motion.section
      ref={ref}
      className="section-wedding"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="wedding-content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="heading-modern-1">Our Wedding Day Highlights</h2>
          <p className="wedding-story">
            Experience the magic of our special day through this beautiful video capturing our most
            treasured moments, from{' '}
            <span className="wedding-highlight">walking down the aisle</span> to our
            <span className="wedding-highlight">first dance as husband and wife</span>.
          </p>
        </motion.div>

        <motion.div
          className="glass-card hover-lift"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            padding: '1rem',
            borderRadius: '1.5rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%',
              height: 0,
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/ZOIRb_ghdh0"
              title="Austin & Jordyn's Wedding Day Highlights"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '1rem',
              }}
            />
          </div>
        </motion.div>

        {/* 💐 Elegant Wedding Divider */}
        <div className="wedding-divider">
          <span className="wedding-divider-icon">💐</span>
        </div>
      </div>
    </motion.section>
  );
};

// 💕 Our Love Story Section Component
const OurStorySection = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.2 });

  const storyMilestones = [
    {
      icon: '☕',
      title: 'First Meeting',
      description:
        'A serendipitous encounter at a cozy coffee shop where two souls discovered they were meant to find each other.',
    },
    {
      icon: '💕',
      title: 'Falling in Love',
      description:
        'What began as gentle conversation blossomed into a beautiful romance filled with laughter, dreams, and endless joy.',
    },
    {
      icon: '💍',
      title: 'The Proposal',
      description:
        'A perfect moment under the stars that captured years of love, hope, and the promise of forever together.',
    },
    {
      icon: '💒',
      title: 'Our Wedding Day',
      description:
        'The most magical day of our lives, surrounded by the love of family and friends who mean everything to us.',
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="section-modern section-modern-alt"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-modern">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 className="heading-modern-1">Our Love Story</h2>
          <p className="text-modern-large" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Every love story is beautiful, but ours is our favorite
          </p>
        </motion.div>

        <div className="grid-modern grid-modern-2" style={{ gap: '2rem' }}>
          {storyMilestones.map((milestone, index) => (
            <motion.div
              key={index}
              className="memory-card hover-lift"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div
                style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                {milestone.icon}
              </div>
              <h3 className="heading-modern-3" style={{ textAlign: 'center' }}>
                {milestone.title}
              </h3>
              <p className="text-modern-body" style={{ textAlign: 'center' }}>
                {milestone.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// 🖼️ Photo Highlights Section
const PhotoHighlightsSection = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <motion.section
      ref={ref}
      className="section-modern"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-modern">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 className="heading-modern-1">Treasured Moments</h2>
          <p className="text-modern-body">
            A glimpse into the beautiful memories we created on our special day
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <Link href="/memory-vault" className="btn-modern">
            <span>📸</span>
            <span>View Our Wedding Gallery</span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

// 💌 Guest Memories Section
const GuestMemoriesSection = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <motion.section
      ref={ref}
      className="section-modern section-modern-alt"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-modern container-modern-narrow">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 className="heading-modern-1">Share in Our Joy</h2>
          <p className="text-modern-body">
            Your presence made our day perfect. Share your favorite moments and memories with us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/guest-stories" className="btn-modern">
            <span>💭</span>
            <span>Share Your Story</span>
          </Link>
          <Link href="/guestbook" className="btn-modern-outline">
            <span>✍️</span>
            <span>Sign Our Guestbook</span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

// 🎉 Celebration Stats Section
const CelebrationStatsSection = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.3 });

  const stats = [
    { number: '150+', label: 'Beloved Guests', icon: '👥' },
    { number: '500+', label: 'Beautiful Photos', icon: '📸' },
    { number: '12', label: 'Hours of Dancing', icon: '💃' },
    { number: '∞', label: 'Happy Memories', icon: '💕' },
  ];

  return (
    <motion.section
      ref={ref}
      className="section-modern"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: 'linear-gradient(135deg, var(--sage-50) 0%, var(--blush-50) 100%)',
      }}
    >
      <div className="container-modern">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 className="heading-modern-1">Our Perfect Day in Numbers</h2>
        </motion.div>

        <div className="grid-modern grid-modern-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="glass-card-strong hover-glow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
              <div className="heading-modern-2">{stat.number}</div>
              <p className="text-modern-body" style={{ marginBottom: 0 }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ModernHomePage;
