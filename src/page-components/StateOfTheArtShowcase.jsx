'use client';

/**
 * 🎨 STATE-OF-THE-ART DESIGN SYSTEM SHOWCASE ✨
 *
 * Complete demonstration of all professional components and capabilities
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';

// Design System Components
import StateOfTheArtButton from '../components/ui/StateOfTheArtButton';
import StateOfTheArtCard from '../components/ui/StateOfTheArtCard';
import StateOfTheArtInput from '../components/ui/StateOfTheArtInput';

// Styles
import styles from '../styles/components/StateOfTheArtShowcase.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const StateOfTheArtShowcase = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);

  const showcaseRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!showcaseRef.current || !headerRef.current) return;

    // Header animation
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }
    );

    // Stagger animation for showcase sections
    const sections = showcaseRef.current.querySelectorAll('.showcase-section');
    gsap.fromTo(
      sections,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission would go here in a real app
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className={styles.showcase}>
      {/* Header */}
      <section ref={headerRef} className={styles.header}>
        <StateOfTheArtCard variant="glass" size="xl" className={styles.headerCard}>
          <div className={styles.headerContent}>
            <div className={styles.headerBadge}>
              <span>🎨 Professional Grade</span>
            </div>
            <h1 className={styles.headerTitle}>State-of-the-Art Design System</h1>
            <p className={styles.headerSubtitle}>
              Experience our complete collection of professional components built with GSAP
              animations, glassmorphism effects, and modern design principles.
            </p>
            <div className={styles.headerStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>15+</span>
                <span className={styles.statLabel}>Components</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>60fps</span>
                <span className={styles.statLabel}>Animations</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Accessible</span>
              </div>
            </div>
          </div>
        </StateOfTheArtCard>
      </section>

      {/* Navigation Tabs */}
      <section className={styles.tabsSection}>
        <StateOfTheArtCard variant="wedding" size="medium" className={styles.tabsCard}>
          <div className={styles.tabsContainer}>
            {[
              { id: 'components', label: '🎯 Components', desc: 'Buttons, Cards, Inputs' },
              { id: 'animations', label: '🎬 Animations', desc: 'GSAP & Motion' },
              { id: 'examples', label: '🌟 Examples', desc: 'Real Use Cases' },
            ].map((tab) => (
              <StateOfTheArtButton
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                size="large"
                onClick={() => setActiveTab(tab.id)}
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

      {/* Showcase Content */}
      <div ref={showcaseRef} className={styles.showcaseContent}>
        {/* Components Tab */}
        {activeTab === 'components' && (
          <>
            {/* Buttons Showcase */}
            <section className={`${styles.showcaseSection} showcase-section`}>
              <StateOfTheArtCard variant="elevated" size="large">
                <h2 className={styles.sectionTitle}>Professional Buttons</h2>
                <p className={styles.sectionDesc}>
                  GSAP-powered buttons with hover effects, loading states, and accessibility.
                </p>

                <div className={styles.buttonGrid}>
                  <div className={styles.buttonGroup}>
                    <h4>Variants</h4>
                    <StateOfTheArtButton variant="primary" size="medium">
                      Primary
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="secondary" size="medium">
                      Secondary
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="ghost" size="medium">
                      Ghost
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="danger" size="medium">
                      Danger
                    </StateOfTheArtButton>
                  </div>

                  <div className={styles.buttonGroup}>
                    <h4>Sizes</h4>
                    <StateOfTheArtButton variant="primary" size="small">
                      Small
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="primary" size="medium">
                      Medium
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="primary" size="large">
                      Large
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="primary" size="xl">
                      Extra Large
                    </StateOfTheArtButton>
                  </div>

                  <div className={styles.buttonGroup}>
                    <h4>States</h4>
                    <StateOfTheArtButton variant="primary" size="medium" loading>
                      Loading...
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="secondary" size="medium" disabled>
                      Disabled
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="ghost" size="medium" onClick={handleLike}>
                      ❤️ Like ({likes})
                    </StateOfTheArtButton>
                  </div>
                </div>
              </StateOfTheArtCard>
            </section>

            {/* Cards Showcase */}
            <section className={`${styles.showcaseSection} showcase-section`}>
              <StateOfTheArtCard variant="glass" size="large">
                <h2 className={styles.sectionTitle}>Professional Cards</h2>
                <p className={styles.sectionDesc}>
                  Glassmorphism effects with scroll animations and hover interactions.
                </p>

                <div className={styles.cardsGrid}>
                  <StateOfTheArtCard variant="default" size="medium" className={styles.demoCard}>
                    <h4>Default Card</h4>
                    <p>Clean white background with subtle shadows for traditional layouts.</p>
                  </StateOfTheArtCard>

                  <StateOfTheArtCard variant="glass" size="medium" className={styles.demoCard}>
                    <h4>Glass Card</h4>
                    <p>Modern glassmorphism effect with backdrop blur and transparency.</p>
                  </StateOfTheArtCard>

                  <StateOfTheArtCard variant="elevated" size="medium" className={styles.demoCard}>
                    <h4>Elevated Card</h4>
                    <p>Dramatic shadows and depth for important content highlights.</p>
                  </StateOfTheArtCard>

                  <StateOfTheArtCard variant="wedding" size="medium" className={styles.demoCard}>
                    <h4>Wedding Card</h4>
                    <p>Romantic design with wedding-themed colors and effects.</p>
                  </StateOfTheArtCard>
                </div>
              </StateOfTheArtCard>
            </section>

            {/* Inputs Showcase */}
            <section className={`${styles.showcaseSection} showcase-section`}>
              <StateOfTheArtCard variant="wedding" size="large">
                <h2 className={styles.sectionTitle}>Professional Forms</h2>
                <p className={styles.sectionDesc}>
                  Floating labels, validation, and smooth animations for the best user experience.
                </p>

                <form onSubmit={handleSubmit} className={styles.demoForm}>
                  <div className={styles.formRow}>
                    <StateOfTheArtInput
                      label="Your Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      required
                      variant="default"
                      size="medium"
                    />
                    <StateOfTheArtInput
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      required
                      variant="glass"
                      size="medium"
                    />
                  </div>
                  <StateOfTheArtInput
                    label="Your Message"
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    helperText="Share your thoughts about our wedding website"
                    variant="wedding"
                    size="large"
                  />
                  <StateOfTheArtButton variant="primary" size="large" type="submit">
                    💌 Send Message
                  </StateOfTheArtButton>
                </form>
              </StateOfTheArtCard>
            </section>
          </>
        )}

        {/* Animations Tab */}
        {activeTab === 'animations' && (
          <section className={`${styles.showcaseSection} showcase-section`}>
            <StateOfTheArtCard variant="glass" size="xl">
              <h2 className={styles.sectionTitle}>60fps GSAP Animations</h2>
              <p className={styles.sectionDesc}>
                Professional-grade animations that bring your interface to life.
              </p>

              <div className={styles.animationDemos}>
                <div className={styles.animationCategory}>
                  <h4>Hover Effects</h4>
                  <p>Smooth scale, glow, and transform animations on interaction</p>
                  <div className={styles.demoButtons}>
                    <StateOfTheArtButton variant="primary" size="medium">
                      Hover Me
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="secondary" size="medium">
                      Scale Effect
                    </StateOfTheArtButton>
                    <StateOfTheArtButton variant="ghost" size="medium">
                      Glow Animation
                    </StateOfTheArtButton>
                  </div>
                </div>

                <div className={styles.animationCategory}>
                  <h4>Entrance Animations</h4>
                  <p>Elements fade in with staggered timing and easing</p>
                  <div className={styles.staggerDemo}>
                    {[1, 2, 3, 4].map((i) => (
                      <StateOfTheArtCard
                        key={i}
                        variant="elevated"
                        size="small"
                        className={styles.staggerCard}
                      >
                        <div className={styles.staggerContent}>
                          <span className={styles.staggerNumber}>{i}</span>
                          <span className={styles.staggerText}>Animated</span>
                        </div>
                      </StateOfTheArtCard>
                    ))}
                  </div>
                </div>

                <div className={styles.animationCategory}>
                  <h4>Glassmorphism</h4>
                  <p>Modern backdrop filters and transparency effects</p>
                  <StateOfTheArtCard variant="glass" size="medium" className={styles.glassDemo}>
                    <div className={styles.glassContent}>
                      <h5>Glass Effect</h5>
                      <p>Backdrop blur with subtle transparency creates modern depth</p>
                    </div>
                  </StateOfTheArtCard>
                </div>
              </div>
            </StateOfTheArtCard>
          </section>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <>
            <section className={`${styles.showcaseSection} showcase-section`}>
              <StateOfTheArtCard variant="wedding" size="xl">
                <h2 className={styles.sectionTitle}>Wedding Website Examples</h2>
                <p className={styles.sectionDesc}>
                  Real-world applications of our design system in your wedding website.
                </p>

                <div className={styles.examplesGrid}>
                  <div className={styles.exampleItem}>
                    <h4>🎬 Video Player Controls</h4>
                    <p>Professional video controls with GSAP animations and glassmorphism</p>
                    <StateOfTheArtButton variant="primary" size="medium">
                      ▶️ Watch Wedding Video
                    </StateOfTheArtButton>
                  </div>

                  <div className={styles.exampleItem}>
                    <h4>📖 Interactive Guestbook</h4>
                    <p>Beautiful form inputs with floating labels and validation</p>
                    <StateOfTheArtButton variant="secondary" size="medium">
                      ✍️ Sign Guestbook
                    </StateOfTheArtButton>
                  </div>

                  <div className={styles.exampleItem}>
                    <h4>📸 Photo Gallery</h4>
                    <p>Elegant card layouts with hover effects and smooth transitions</p>
                    <StateOfTheArtButton variant="ghost" size="medium">
                      🖼️ View Gallery
                    </StateOfTheArtButton>
                  </div>

                  <div className={styles.exampleItem}>
                    <h4>🗺️ Love Map</h4>
                    <p>Interactive elements with professional styling and animations</p>
                    <StateOfTheArtButton variant="primary" size="medium">
                      📍 Explore Map
                    </StateOfTheArtButton>
                  </div>
                </div>
              </StateOfTheArtCard>
            </section>

            <section className={`${styles.showcaseSection} showcase-section`}>
              <StateOfTheArtCard variant="elevated" size="large">
                <h2 className={styles.sectionTitle}>Design System Capabilities</h2>

                <div className={styles.capabilitiesGrid}>
                  <div className={styles.capability}>
                    <div className={styles.capabilityIcon}>🎨</div>
                    <h4>Design Tokens</h4>
                    <p>Comprehensive color, typography, and spacing system</p>
                  </div>

                  <div className={styles.capability}>
                    <div className={styles.capabilityIcon}>⚡</div>
                    <h4>Performance</h4>
                    <p>60fps animations with optimized rendering</p>
                  </div>

                  <div className={styles.capability}>
                    <div className={styles.capabilityIcon}>♿</div>
                    <h4>Accessibility</h4>
                    <p>WCAG AA compliant with keyboard navigation</p>
                  </div>

                  <div className={styles.capability}>
                    <div className={styles.capabilityIcon}>📱</div>
                    <h4>Responsive</h4>
                    <p>Mobile-first design with adaptive layouts</p>
                  </div>

                  <div className={styles.capability}>
                    <div className={styles.capabilityIcon}>🧪</div>
                    <h4>Storybook</h4>
                    <p>Interactive component documentation</p>
                  </div>

                  <div className={styles.capability}>
                    <div className={styles.capabilityIcon}>✨</div>
                    <h4>Modern Effects</h4>
                    <p>Glassmorphism and advanced visual effects</p>
                  </div>
                </div>
              </StateOfTheArtCard>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default StateOfTheArtShowcase;
