'use client';

/**
 * 🎨 STATE-OF-THE-ART CARD COMPONENT ✨
 *
 * Professional card with glassmorphism effects and GSAP animations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef } from 'react';
import { designTokens, getColor, getSpacing } from '../../styles/core/design-tokens';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const StateOfTheArtCard = forwardRef(
  (
    {
      children,
      variant = 'default',
      size = 'medium',
      hoverable = true,
      animateOnScroll = true,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const cardRef = useRef(null);
    const combinedRef = ref || cardRef;

    useEffect(() => {
      if (!cardRef.current) return;

      const card = cardRef.current;

      // Entrance animation on scroll
      if (animateOnScroll) {
        gsap.fromTo(
          card,
          {
            y: 60,
            opacity: 0,
            scale: 0.95,
            rotationX: 15,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.8,
            ease: designTokens.animations.easings.power3,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      } else {
        // Simple entrance animation
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: designTokens.animations.easings.elegant }
        );
      }

      // Hover animations
      if (hoverable) {
        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            boxShadow:
              variant === 'glass'
                ? '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(143, 168, 118, 0.1)'
                : '0 20px 60px rgba(0, 0, 0, 0.15)',
            duration: 0.3,
            ease: designTokens.animations.easings.power2,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: getCardStyles(variant, size).boxShadow,
            duration: 0.3,
            ease: designTokens.animations.easings.power2,
          });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          card.removeEventListener('mouseenter', handleMouseEnter);
          card.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, [variant, size, hoverable, animateOnScroll]);

    const cardStyles = getCardStyles(variant, size);

    return (
      <div
        ref={combinedRef}
        className={`state-of-the-art-card ${variant} ${size} ${hoverable ? 'hoverable' : ''} ${className}`}
        style={{ ...cardStyles, ...style }}
        {...props}
      >
        <div className="card-content">{children}</div>

        {variant === 'glass' && <div className="glass-overlay" />}

        <style>{`
          .state-of-the-art-card {
            position: relative;
            transform-origin: center;
            transform-style: preserve-3d;
            transition: all ${designTokens.animations.durations.normal}
              ${designTokens.animations.easings.elegant};
          }

          .state-of-the-art-card.hoverable {
            cursor: pointer;
          }

          .card-content {
            position: relative;
            z-index: 2;
          }

          .glass-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0.1) 100%
            );
            border-radius: inherit;
            z-index: 1;
            pointer-events: none;
          }

          /* Variant styles */
          .state-of-the-art-card.default {
            background: white;
            border: 1px solid ${getColor('neutral.200')};
          }

          .state-of-the-art-card.glass {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
          }

          .state-of-the-art-card.elevated {
            background: white;
            border: none;
          }

          .state-of-the-art-card.wedding {
            background: linear-gradient(
              135deg,
              rgba(246, 249, 244, 0.95) 0%,
              rgba(234, 242, 228, 0.9) 100%
            );
            backdrop-filter: blur(10px);
            border: 1px solid rgba(143, 168, 118, 0.2);
          }

          /* Size styles */
          .state-of-the-art-card.small {
            padding: ${getSpacing(4)};
            border-radius: ${designTokens.borderRadius.lg};
          }

          .state-of-the-art-card.medium {
            padding: ${getSpacing(6)};
            border-radius: ${designTokens.borderRadius['2xl']};
          }

          .state-of-the-art-card.large {
            padding: ${getSpacing(8)};
            border-radius: ${designTokens.borderRadius['3xl']};
          }

          .state-of-the-art-card.xl {
            padding: ${getSpacing(10)};
            border-radius: ${designTokens.borderRadius['3xl']};
          }
        `}</style>
      </div>
    );
  }
);

StateOfTheArtCard.displayName = 'StateOfTheArtCard';

StateOfTheArtCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'glass', 'elevated', 'wedding']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xl']),
  hoverable: PropTypes.bool,
  animateOnScroll: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

// Helper function to get card styles
const getCardStyles = (variant, size) => {
  const baseStyles = {
    overflow: 'hidden',
    transition: `all ${designTokens.animations.durations.normal} ${designTokens.animations.easings.elegant}`,
  };

  const variantStyles = {
    default: {
      backgroundColor: 'white',
      border: `1px solid ${getColor('neutral.200')}`,
      boxShadow: designTokens.shadows.lg,
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: designTokens.backdropFilters.blurProfessional,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: designTokens.shadows.glassmorphism,
    },
    elevated: {
      backgroundColor: 'white',
      border: 'none',
      boxShadow: designTokens.shadows['2xl'],
    },
    wedding: {
      backgroundColor: 'rgba(246, 249, 244, 0.95)',
      backdropFilter: 'blur(10px)',
      border: `1px solid rgba(143, 168, 118, 0.2)`,
      boxShadow: `0 8px 32px rgba(143, 168, 118, 0.1)`,
    },
  };

  const sizeStyles = {
    small: {
      padding: getSpacing(4),
      borderRadius: designTokens.borderRadius.lg,
    },
    medium: {
      padding: getSpacing(6),
      borderRadius: designTokens.borderRadius['2xl'],
    },
    large: {
      padding: getSpacing(8),
      borderRadius: designTokens.borderRadius['3xl'],
    },
    xl: {
      padding: getSpacing(10),
      borderRadius: designTokens.borderRadius['3xl'],
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };
};

export default StateOfTheArtCard;
