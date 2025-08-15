'use client';

/**
 * 🎨 STATE-OF-THE-ART NAVIGATION ✨
 *
 * Professional navigation with glassmorphism effects and GSAP animations
 */

import {
  Bars3Icon,
  BookOpenIcon,
  HeartIcon,
  HomeIcon,
  MapPinIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { gsap } from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { designTokens, getColor, getSpacing } from '../../styles/core/design-tokens';
import { StateOfTheArtButton } from '../ui/StateOfTheArtButton';

export const StateOfTheArtNavigation = ({
  variant = 'glass',
  fixed = true,
  showLogo = true,
  className = '',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/', icon: HomeIcon },
    { label: 'Our Story', href: '/our-story', icon: HeartIcon },
    { label: 'Gallery', href: '/gallery', icon: PhotoIcon },
    { label: 'Guestbook', href: '/guestbook', icon: BookOpenIcon },
    { label: 'Love Map', href: '/love-map', icon: MapPinIcon },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);

        // Animate navigation on scroll
        if (navRef.current) {
          gsap.to(navRef.current, {
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: scrolled ? 'blur(25px)' : 'blur(15px)',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0, 0, 0, 0.1)'
              : '0 4px 16px rgba(0, 0, 0, 0.05)',
            duration: 0.3,
            ease: designTokens.animations.easings.elegant,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Initial animation
  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: designTokens.animations.easings.power3,
      }
    );

    // Animate logo
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: designTokens.animations.easings.power3,
        }
      );
    }
  }, []);

  const handleNavigation = (href) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    if (mobileMenuRef.current) {
      if (!isMobileMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: designTokens.animations.easings.power2,
          }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: designTokens.animations.easings.power2,
        });
      }
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`state-of-the-art-nav ${variant} ${fixed ? 'fixed' : ''} ${className}`}
      >
        <div className="nav-container">
          {/* Logo */}
          {showLogo && (
            <div ref={logoRef} className="nav-logo">
              <button onClick={() => handleNavigation('/')} className="logo-button">
                <div className="logo-content">
                  <HeartIcon className="logo-icon" />
                  <span className="logo-text">Austin & Jordyn</span>
                </div>
              </button>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="nav-items desktop-only">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <StateOfTheArtButton
                  key={item.href}
                  variant={isActive ? 'primary' : 'ghost'}
                  size="medium"
                  onClick={() => handleNavigation(item.href)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  {item.label}
                </StateOfTheArtButton>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <StateOfTheArtButton
            variant="ghost"
            size="medium"
            onClick={toggleMobileMenu}
            className="mobile-menu-button mobile-only"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="menu-icon" />
            ) : (
              <Bars3Icon className="menu-icon" />
            )}
          </StateOfTheArtButton>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="mobile-menu">
          <div className="mobile-menu-content">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <StateOfTheArtButton
                  key={item.href}
                  variant={isActive ? 'primary' : 'ghost'}
                  size="large"
                  onClick={() => handleNavigation(item.href)}
                  className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  {item.label}
                </StateOfTheArtButton>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .state-of-the-art-nav {
          width: 100%;
          z-index: 100;
          transition: all ${designTokens.animations.durations.normal}
            ${designTokens.animations.easings.elegant};
        }

        .state-of-the-art-nav.fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
        }

        .state-of-the-art-nav.glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${getSpacing(4)} ${getSpacing(6)};
        }

        .nav-logo {
          flex: 0 0 auto;
        }

        .logo-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .logo-content {
          display: flex;
          align-items: center;
          gap: ${getSpacing(2)};
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          color: ${getColor('primary.500')};
        }

        .logo-text {
          font-family: ${designTokens.typography.fontFamilies.serif};
          font-size: ${designTokens.typography.fontSizes['2xl']};
          font-weight: ${designTokens.typography.fontWeights.bold};
          color: ${getColor('neutral.800')};
          background: linear-gradient(
            135deg,
            ${getColor('primary.600')} 0%,
            ${getColor('primary.400')} 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-items {
          display: flex;
          align-items: center;
          gap: ${getSpacing(2)};
          flex: 1;
          justify-content: center;
        }

        .nav-item {
          color: ${getColor('neutral.700')} !important;
          font-weight: ${designTokens.typography.fontWeights.medium};
          transition: all ${designTokens.animations.durations.fast} ease;
        }

        .nav-item:hover {
          color: ${getColor('primary.600')} !important;
          transform: translateY(-1px);
        }

        .nav-item.active {
          color: white !important;
        }

        .nav-icon {
          width: 18px;
          height: 18px;
        }

        .mobile-menu-button {
          flex: 0 0 auto;
        }

        .menu-icon {
          width: 24px;
          height: 24px;
        }

        .mobile-menu {
          position: fixed;
          top: 88px;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          z-index: 99;
        }

        .mobile-menu-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: ${getSpacing(4)} ${getSpacing(6)};
          display: flex;
          flex-direction: column;
          gap: ${getSpacing(2)};
        }

        .mobile-nav-item {
          width: 100% !important;
          justify-content: flex-start !important;
          font-size: ${designTokens.typography.fontSizes.lg} !important;
        }

        /* Responsive Design */
        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: flex;
          }

          .nav-container {
            padding: ${getSpacing(3)} ${getSpacing(4)};
          }

          .logo-text {
            font-size: ${designTokens.typography.fontSizes.xl};
          }

          .mobile-menu {
            top: 76px;
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

StateOfTheArtNavigation.propTypes = {
  variant: PropTypes.oneOf(['glass', 'solid', 'transparent']),
  fixed: PropTypes.bool,
  showLogo: PropTypes.bool,
  className: PropTypes.string,
};

export default StateOfTheArtNavigation;
