/**
 * 🧭 MODERN 2025 NAVIGATION
 * Glassmorphism + Smooth Animations
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const ModernNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/memory-vault', label: 'Memories', icon: '📸' },
    { href: '/guest-stories', label: 'Stories', icon: '💭' },
    { href: '/anniversary', label: 'Anniversary', icon: '💕' },
    { href: '/family-legacy', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { href: '/guest-connections', label: 'Connections', icon: '🤝' },
    { href: '/time-capsule', label: 'Time Capsule', icon: '⏰' },
    { href: '/guestbook', label: 'Guestbook', icon: '✍️' },
  ];

  return (
    <>
      <motion.nav
        className={`modern-nav ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '1rem 2rem',
          background: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: 'linear-gradient(135deg, var(--sage-600), var(--blush-500))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              A & J
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'none' }}>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'center',
              }}
            >
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '1rem',
                      textDecoration: 'none',
                      color: 'var(--sage-700)',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      background:
                        pathname === item.href ? 'rgba(143, 168, 118, 0.1)' : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                    {pathname === item.href && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '20px',
                          height: '2px',
                          background: 'linear-gradient(90deg, var(--sage-500), var(--blush-500))',
                          borderRadius: '1px',
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="mobile-menu-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'flex',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '1rem',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '2rem',
                padding: '2rem',
                maxWidth: '90vw',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                }}
              >
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1.5rem',
                        background:
                          pathname === item.href
                            ? 'rgba(143, 168, 118, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '1.5rem',
                        textDecoration: 'none',
                        color: 'var(--sage-700)',
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        minHeight: '100px',
                      }}
                    >
                      <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: block !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }

        .nav-link:hover {
          background: rgba(143, 168, 118, 0.1) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
};

export default ModernNavigation;
