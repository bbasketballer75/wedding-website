'use client';

/**
 * 🎨 STATE-OF-THE-ART BUTTON COMPONENT ✨
 *
 * Professional button with design tokens integration and GSAP animations
 */

import { gsap } from 'gsap';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef } from 'react';
import { designTokens, getColor, getSpacing } from '../../styles/core/design-tokens';

export const StateOfTheArtButton = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef(null);
    const rippleRef = useRef(null);

    useEffect(() => {
      if (!buttonRef.current) return;

      const button = buttonRef.current;

      // Entrance animation
      gsap.fromTo(
        button,
        {
          scale: 0.95,
          opacity: 0.8,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: designTokens.animations.easings.elegant,
        }
      );

      // Hover animations
      const handleMouseEnter = () => {
        if (disabled || loading) return;

        gsap.to(button, {
          scale: 1.05,
          duration: 0.2,
          ease: designTokens.animations.easings.power2,
        });

        // Glow effect
        gsap.to(button, {
          boxShadow:
            variant === 'primary' ? `0 8px 25px rgba(143, 168, 118, 0.4)` : designTokens.shadows.lg,
          duration: 0.2,
        });
      };

      const handleMouseLeave = () => {
        if (disabled || loading) return;

        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: designTokens.animations.easings.power2,
        });

        gsap.to(button, {
          boxShadow: getButtonStyles(variant, size).boxShadow,
          duration: 0.2,
        });
      };

      const handleMouseDown = () => {
        if (disabled || loading) return;

        gsap.to(button, {
          scale: 0.98,
          duration: 0.1,
          ease: designTokens.animations.easings.power3,
        });
      };

      const handleMouseUp = () => {
        if (disabled || loading) return;

        gsap.to(button, {
          scale: 1.05,
          duration: 0.1,
          ease: designTokens.animations.easings.power3,
        });
      };

      // Ripple effect on click
      const handleClick = (e) => {
        if (disabled || loading) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (rippleRef.current) {
          gsap.set(rippleRef.current, {
            x: x - 50,
            y: y - 50,
            scale: 0,
            opacity: 0.6,
          });

          gsap.to(rippleRef.current, {
            scale: 4,
            opacity: 0,
            duration: 0.6,
            ease: designTokens.animations.easings.power2,
          });
        }

        if (onClick) onClick(e);
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      button.addEventListener('mousedown', handleMouseDown);
      button.addEventListener('mouseup', handleMouseUp);
      button.addEventListener('click', handleClick);

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
        button.removeEventListener('mousedown', handleMouseDown);
        button.removeEventListener('mouseup', handleMouseUp);
        button.removeEventListener('click', handleClick);
      };
    }, [disabled, loading, onClick, variant, size]);

    const buttonStyles = getButtonStyles(variant, size);
    const combinedRef = ref || buttonRef;

    return (
      <button
        ref={combinedRef}
        className={`state-of-the-art-button ${variant} ${size} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''} ${className}`}
        disabled={disabled || loading}
        style={buttonStyles}
        {...props}
      >
        <div className="button-content">
          {loading && (
            <div className="button-spinner">
              <div className="spinner-ring" />
            </div>
          )}
          <span className={`button-text ${loading ? 'loading' : ''}`}>{children}</span>
        </div>

        <div ref={rippleRef} className="button-ripple" />

        <style>{`
          .state-of-the-art-button {
            position: relative;
            overflow: hidden;
            border: none;
            cursor: pointer;
            font-family: ${designTokens.typography.fontFamilies.sans};
            font-weight: ${designTokens.typography.fontWeights.medium};
            transition: all ${designTokens.animations.durations.normal}
              ${designTokens.animations.easings.elegant};
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            user-select: none;
            outline: none;
            transform-origin: center;
          }

          .state-of-the-art-button:focus {
            box-shadow: 0 0 0 3px rgba(143, 168, 118, 0.3);
          }

          .state-of-the-art-button.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
          }

          .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: ${getSpacing(2)};
            position: relative;
            z-index: 1;
          }

          .button-text {
            transition: opacity ${designTokens.animations.durations.fast}
              ${designTokens.animations.easings.ease};
          }

          .button-text.loading {
            opacity: 0.7;
          }

          .button-spinner {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .spinner-ring {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 2px solid currentColor;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .button-ripple {
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
          }

          /* Variant-specific styles */
          .state-of-the-art-button.primary {
            background: linear-gradient(
              135deg,
              ${getColor('primary.500')} 0%,
              ${getColor('primary.600')} 100%
            );
            color: white;
          }

          .state-of-the-art-button.secondary {
            background: transparent;
            color: ${getColor('primary.600')};
            border: 2px solid ${getColor('primary.500')};
          }

          .state-of-the-art-button.secondary:hover {
            background: ${getColor('primary.50')};
          }

          .state-of-the-art-button.ghost {
            background: transparent;
            color: ${getColor('neutral.700')};
          }

          .state-of-the-art-button.ghost:hover {
            background: ${getColor('neutral.100')};
          }

          .state-of-the-art-button.danger {
            background: linear-gradient(
              135deg,
              ${designTokens.colors.semantic.error} 0%,
              #dc2626 100%
            );
            color: white;
          }

          /* Size-specific styles */
          .state-of-the-art-button.small {
            padding: ${getSpacing(2)} ${getSpacing(4)};
            font-size: ${designTokens.typography.fontSizes.sm};
            border-radius: ${designTokens.borderRadius.md};
          }

          .state-of-the-art-button.medium {
            padding: ${getSpacing(3)} ${getSpacing(6)};
            font-size: ${designTokens.typography.fontSizes.base};
            border-radius: ${designTokens.borderRadius.lg};
          }

          .state-of-the-art-button.large {
            padding: ${getSpacing(4)} ${getSpacing(8)};
            font-size: ${designTokens.typography.fontSizes.lg};
            border-radius: ${designTokens.borderRadius.xl};
          }

          .state-of-the-art-button.xl {
            padding: ${getSpacing(5)} ${getSpacing(10)};
            font-size: ${designTokens.typography.fontSizes.xl};
            border-radius: ${designTokens.borderRadius['2xl']};
          }
        `}</style>
      </button>
    );
  }
);

StateOfTheArtButton.displayName = 'StateOfTheArtButton';

StateOfTheArtButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

// Helper function to get button styles
const getButtonStyles = (variant, size) => {
  const baseStyles = {
    borderRadius: designTokens.borderRadius.lg,
    transition: `all ${designTokens.animations.durations.normal} ${designTokens.animations.easings.elegant}`,
  };

  const variantStyles = {
    primary: {
      backgroundColor: getColor('primary.500'),
      color: 'white',
      boxShadow: designTokens.shadows.md,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: getColor('primary.600'),
      border: `2px solid ${getColor('primary.500')}`,
      boxShadow: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: getColor('neutral.700'),
      boxShadow: 'none',
    },
    danger: {
      backgroundColor: designTokens.colors.semantic.error,
      color: 'white',
      boxShadow: designTokens.shadows.md,
    },
  };

  const sizeStyles = {
    small: {
      padding: `${getSpacing(2)} ${getSpacing(4)}`,
      fontSize: designTokens.typography.fontSizes.sm,
      borderRadius: designTokens.borderRadius.md,
    },
    medium: {
      padding: `${getSpacing(3)} ${getSpacing(6)}`,
      fontSize: designTokens.typography.fontSizes.base,
      borderRadius: designTokens.borderRadius.lg,
    },
    large: {
      padding: `${getSpacing(4)} ${getSpacing(8)}`,
      fontSize: designTokens.typography.fontSizes.lg,
      borderRadius: designTokens.borderRadius.xl,
    },
    xl: {
      padding: `${getSpacing(5)} ${getSpacing(10)}`,
      fontSize: designTokens.typography.fontSizes.xl,
      borderRadius: designTokens.borderRadius['2xl'],
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };
};

export default StateOfTheArtButton;
