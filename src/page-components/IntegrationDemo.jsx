'use client';

/**
 * 🌟 COMPLETE INTEGRATION DEMO ✨
 *
 * Demonstrates all state-of-the-art components working together
 * in a real wedding website context
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';

// State-of-the-art components
import StateOfTheArtEnhancedVideoPlayer from '../components/media/StateOfTheArtEnhancedVideoPlayer';
import StateOfTheArtButton from '../components/ui/StateOfTheArtButton';
import StateOfTheArtCard from '../components/ui/StateOfTheArtCard';
import StateOfTheArtInput from '../components/ui/StateOfTheArtInput';
import StateOfTheArtNavigation from '../components/ui/StateOfTheArtNavigation';

// Audio provider
import { AudioProvider } from '../components/AmbientSoundSystem';

// Styles
import styles from '../styles/components/IntegrationDemo.module.css';

const IntegrationDemo = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [guestbookEntries, setGuestbookEntries] = useState([
    {
      id: 1,
      name: 'Sarah & Mike',
      message: 'What an amazing video! So beautiful to relive your special day.',
      timestamp: new Date('2025-01-10'),
    },
    {
      id: 2,
      name: 'The Johnson Family',
      message: 'We had the best time at your wedding. This video captures every magical moment!',
      timestamp: new Date('2025-01-12'),
    },
  ]);
  const [newEntry, setNewEntry] = useState({ name: '', email: '', message: '' });

  // Sample wedding chapters
  const weddingChapters = [
    {
      title: 'Getting Ready',
      startTime: 0,
      endTime: 180,
      description: 'The excitement builds as we prepare for our big day',
      emoji: '💄',
    },
    {
      title: 'First Look',
      startTime: 180,
      endTime: 300,
      description: 'The emotional moment when we saw each other',
      emoji: '👀',
    },
    {
      title: 'Ceremony',
      startTime: 300,
      endTime: 900,
      description: 'Exchanging vows in front of family and friends',
      emoji: '💒',
    },
    {
      title: 'Reception',
      startTime: 900,
      endTime: 1800,
      description: 'Celebrating with dinner, dancing, and joy',
      emoji: '🎉',
    },
  ];

  const handleGuestbookSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (newEntry.name && newEntry.message) {
        const entry = {
          id: Date.now(),
          name: newEntry.name,
          message: newEntry.message,
          timestamp: new Date(),
        };
        setGuestbookEntries((prev) => [entry, ...prev]);
        setNewEntry({ name: '', email: '', message: '' });
      }
    },
    [newEntry]
  );

  const formatDate = useCallback((date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }, []);

  return (
    <AudioProvider>
      <div className={styles.integrationDemo}>
        {/* State-of-the-art Navigation */}
        <StateOfTheArtNavigation />

        {/* Hero Section with Video Player */}
        <section id="hero" className={styles.heroSection}>
          <StateOfTheArtCard variant="glass" size="xl" className={styles.heroCard}>
            <div className={styles.heroContent}>
              <motion.div
                className={styles.heroText}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className={styles.heroTitle}>Austin & Jordyn's Wedding</h1>
                <p className={styles.heroSubtitle}>
                  Experience our special day through this professional wedding film, enhanced with
                  state-of-the-art design and interactions.
                </p>

                <div className={styles.heroStats}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>4</span>
                    <span className={styles.statLabel}>Chapters</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>30min</span>
                    <span className={styles.statLabel}>Duration</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>HD</span>
                    <span className={styles.statLabel}>Quality</span>
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <StateOfTheArtButton
                    variant="primary"
                    size="large"
                    onClick={() => setActiveSection('video')}
                  >
                    🎬 Watch Our Story
                  </StateOfTheArtButton>
                  <StateOfTheArtButton
                    variant="secondary"
                    size="large"
                    onClick={() => setActiveSection('guestbook')}
                  >
                    ✍️ Sign Guestbook
                  </StateOfTheArtButton>
                </div>
              </motion.div>
            </div>
          </StateOfTheArtCard>
        </section>

        {/* Navigation Tabs */}
        <section className={styles.tabsSection}>
          <StateOfTheArtCard variant="wedding" size="large" className={styles.tabsCard}>
            <div className={styles.tabsContainer}>
              {[
                { id: 'hero', label: '🏠 Home', desc: 'Welcome' },
                { id: 'video', label: '🎬 Video', desc: 'Our Film' },
                { id: 'guestbook', label: '📖 Guestbook', desc: 'Messages' },
                { id: 'gallery', label: '📸 Gallery', desc: 'Photos' },
              ].map((tab) => (
                <StateOfTheArtButton
                  key={tab.id}
                  variant={activeSection === tab.id ? 'primary' : 'ghost'}
                  size="medium"
                  onClick={() => setActiveSection(tab.id)}
                  className={styles.tabButton}
                >
                  <div className={styles.tabContent}>
                    <span className={styles.tabLabel}>{tab.label}</span>
                    <small className={styles.tabDesc}>{tab.desc}</small>
                  </div>
                </StateOfTheArtButton>
              ))}
            </div>
          </StateOfTheArtCard>
        </section>

        {/* Content Sections */}
        <div className={styles.contentArea}>
          <AnimatePresence mode="wait">
            {/* Video Section */}
            {activeSection === 'video' && (
              <motion.section
                key="video"
                className={styles.videoSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.videoContainer}>
                  <StateOfTheArtEnhancedVideoPlayer
                    src="/video/sample-wedding.mp4"
                    posterSrc="/images/wedding-poster.jpg"
                    title="Austin & Jordyn's Wedding Film"
                    chapters={weddingChapters}
                    showChapters={true}
                    className={styles.mainVideoPlayer}
                  />
                </div>

                <StateOfTheArtCard variant="elevated" size="large" className={styles.videoInfo}>
                  <h2>Our Wedding Film</h2>
                  <p>
                    This professional wedding film captures every magical moment of our special day,
                    from getting ready to the final dance. Each chapter tells a part of our story,
                    enhanced with state-of-the-art video controls and interactions.
                  </p>

                  <div className={styles.featureList}>
                    <div className={styles.feature}>
                      <span className={styles.featureIcon}>✨</span>
                      <span>Professional glassmorphism controls</span>
                    </div>
                    <div className={styles.feature}>
                      <span className={styles.featureIcon}>📖</span>
                      <span>Interactive chapter navigation</span>
                    </div>
                    <div className={styles.feature}>
                      <span className={styles.featureIcon}>🎯</span>
                      <span>GSAP-powered smooth animations</span>
                    </div>
                    <div className={styles.feature}>
                      <span className={styles.featureIcon}>📱</span>
                      <span>Mobile-optimized responsive design</span>
                    </div>
                  </div>
                </StateOfTheArtCard>
              </motion.section>
            )}

            {/* Guestbook Section */}
            {activeSection === 'guestbook' && (
              <motion.section
                key="guestbook"
                className={styles.guestbookSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <StateOfTheArtCard variant="wedding" size="xl" className={styles.guestbookCard}>
                  <h2 className={styles.sectionTitle}>Wedding Guestbook</h2>
                  <p className={styles.sectionDesc}>
                    Share your thoughts about our wedding video and special day.
                  </p>

                  <form onSubmit={handleGuestbookSubmit} className={styles.guestbookForm}>
                    <div className={styles.formRow}>
                      <StateOfTheArtInput
                        label="Your Name"
                        value={newEntry.name}
                        onChange={(e) => setNewEntry((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        variant="wedding"
                        size="medium"
                      />
                      <StateOfTheArtInput
                        label="Email (Optional)"
                        type="email"
                        value={newEntry.email}
                        onChange={(e) =>
                          setNewEntry((prev) => ({ ...prev, email: e.target.value }))
                        }
                        variant="glass"
                        size="medium"
                      />
                    </div>
                    <StateOfTheArtInput
                      label="Your Message"
                      value={newEntry.message}
                      onChange={(e) =>
                        setNewEntry((prev) => ({ ...prev, message: e.target.value }))
                      }
                      helperText="Tell us what you thought of our wedding video"
                      required
                      variant="default"
                      size="large"
                    />
                    <StateOfTheArtButton
                      variant="primary"
                      size="large"
                      type="submit"
                      disabled={!newEntry.name || !newEntry.message}
                    >
                      💌 Sign Guestbook
                    </StateOfTheArtButton>
                  </form>
                </StateOfTheArtCard>

                {/* Guestbook Entries */}
                <div className={styles.entriesContainer}>
                  <h3 className={styles.entriesTitle}>Guest Messages</h3>
                  <div className={styles.entriesGrid}>
                    {guestbookEntries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <StateOfTheArtCard
                          variant="glass"
                          size="medium"
                          className={styles.entryCard}
                        >
                          <div className={styles.entryHeader}>
                            <h4 className={styles.entryName}>{entry.name}</h4>
                            <span className={styles.entryDate}>{formatDate(entry.timestamp)}</span>
                          </div>
                          <p className={styles.entryMessage}>{entry.message}</p>
                        </StateOfTheArtCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Gallery Section */}
            {activeSection === 'gallery' && (
              <motion.section
                key="gallery"
                className={styles.gallerySection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <StateOfTheArtCard variant="elevated" size="xl" className={styles.galleryCard}>
                  <h2 className={styles.sectionTitle}>Photo Gallery</h2>
                  <p className={styles.sectionDesc}>
                    Beautiful moments captured throughout our wedding day.
                  </p>

                  <div className={styles.galleryGrid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        className={styles.galleryItem}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StateOfTheArtCard
                          variant="glass"
                          size="medium"
                          className={styles.photoCard}
                        >
                          <div className={styles.photoPlaceholder}>
                            <span className={styles.photoIcon}>📸</span>
                            <p>Wedding Photo {i}</p>
                          </div>
                        </StateOfTheArtCard>
                      </motion.div>
                    ))}
                  </div>

                  <div className={styles.galleryActions}>
                    <StateOfTheArtButton variant="secondary" size="large">
                      📤 Share Gallery
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="ghost" size="large">
                      💾 Download All
                    </StateOfTheArtButton>
                  </div>
                </StateOfTheArtCard>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <StateOfTheArtCard variant="wedding" size="large" className={styles.footerCard}>
            <div className={styles.footerContent}>
              <div className={styles.footerSection}>
                <h3>Austin & Jordyn Porada</h3>
                <p>Thank you for being part of our special day!</p>
              </div>
              <div className={styles.footerSection}>
                <h4>Design Features</h4>
                <ul>
                  <li>✨ GSAP Animations</li>
                  <li>🎨 Glassmorphism Effects</li>
                  <li>🎬 Professional Video Player</li>
                  <li>♿ Full Accessibility</li>
                </ul>
              </div>
              <div className={styles.footerSection}>
                <h4>Technology</h4>
                <ul>
                  <li>⚛️ React 18</li>
                  <li>🎯 Next.js 14</li>
                  <li>🎪 Framer Motion</li>
                  <li>🎨 CSS Modules</li>
                </ul>
              </div>
            </div>
          </StateOfTheArtCard>
        </footer>
      </div>
    </AudioProvider>
  );
};

export default IntegrationDemo;
