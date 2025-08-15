'use client';

/**
 * 🎨 STATE-OF-THE-ART INPUT COMPONENT ✨
 *
 * Professional input with validation, animations, and accessibility
 */

import { gsap } from 'gsap';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { designTokens, getColor, getSpacing } from '../../styles/core/design-tokens';

export const StateOfTheArtInput = forwardRef(
  (
    {
      label,
      placeholder = '',
      type = 'text',
      required = false,
      disabled = false,
      error = '',
      helperText = '',
      value = '',
      onChange,
      onFocus,
      onBlur,
      variant = 'default',
      size = 'medium',
      icon = null,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(value !== '');

    const inputRef = useRef(null);
    const labelRef = useRef(null);
    const borderRef = useRef(null);
    const iconRef = useRef(null);
    const combinedRef = ref || inputRef;

    useEffect(() => {
      setHasValue(value !== '');
    }, [value]);

    useEffect(() => {
      if (!inputRef.current || !labelRef.current) return;

      // Entrance animation
      gsap.fromTo(
        [inputRef.current, labelRef.current],
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: designTokens.animations.easings.elegant,
          stagger: 0.1,
        }
      );
    }, []);

    const handleFocus = (e) => {
      setIsFocused(true);

      // Focus animations
      if (labelRef.current) {
        gsap.to(labelRef.current, {
          y: -24,
          scale: 0.85,
          color: error ? designTokens.colors.semantic.error : getColor('primary.500'),
          duration: 0.2,
          ease: designTokens.animations.easings.power2,
        });
      }

      if (borderRef.current) {
        gsap.to(borderRef.current, {
          scaleX: 1,
          duration: 0.2,
          ease: designTokens.animations.easings.power2,
        });
      }

      if (iconRef.current) {
        gsap.to(iconRef.current, {
          scale: 1.1,
          color: getColor('primary.500'),
          duration: 0.2,
        });
      }

      if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);

      // Blur animations - only move label back if no value
      if (!hasValue && labelRef.current) {
        gsap.to(labelRef.current, {
          y: 0,
          scale: 1,
          color: getColor('neutral.500'),
          duration: 0.2,
          ease: designTokens.animations.easings.power2,
        });
      }

      if (borderRef.current) {
        gsap.to(borderRef.current, {
          scaleX: 0,
          duration: 0.2,
          ease: designTokens.animations.easings.power2,
        });
      }

      if (iconRef.current) {
        gsap.to(iconRef.current, {
          scale: 1,
          color: getColor('neutral.400'),
          duration: 0.2,
        });
      }

      if (onBlur) onBlur(e);
    };

    const handleChange = (e) => {
      const newValue = e.target.value;
      setHasValue(newValue !== '');

      // Animate label if value changes
      if (labelRef.current) {
        if (newValue !== '' && !isFocused) {
          gsap.to(labelRef.current, {
            y: -24,
            scale: 0.85,
            duration: 0.2,
          });
        }
      }

      if (onChange) onChange(e);
    };

    const inputStyles = getInputStyles(variant, size, error, disabled);

    return (
      <div className={`state-of-the-art-input-container ${variant} ${size} ${className}`}>
        <div className="input-wrapper">
          {/* Icon */}
          {icon && (
            <div ref={iconRef} className="input-icon">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={combinedRef}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={isFocused ? placeholder : ''}
            className="input-field"
            style={inputStyles}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              ref={labelRef}
              className={`input-label ${isFocused || hasValue ? 'active' : ''} ${required ? 'required' : ''}`}
            >
              {label}
              {required && <span className="required-indicator">*</span>}
            </label>
          )}

          {/* Animated Border */}
          <div
            ref={borderRef}
            className="input-border"
            style={{
              background: error ? designTokens.colors.semantic.error : getColor('primary.500'),
            }}
          />
        </div>

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <div className={`input-helper ${error ? 'error' : ''}`}>{error || helperText}</div>
        )}

        <style>{`
          .state-of-the-art-input-container {
            position: relative;
            margin-bottom: ${getSpacing(4)};
            font-family: ${designTokens.typography.fontFamilies.sans};
          }

          .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-field {
            width: 100%;
            border: 2px solid ${getColor('neutral.200')};
            background: white;
            color: ${getColor('neutral.800')};
            font-size: ${designTokens.typography.fontSizes.base};
            font-family: inherit;
            outline: none;
            transition: all ${designTokens.animations.durations.normal}
              ${designTokens.animations.easings.elegant};
            position: relative;
            z-index: 1;
          }

          .input-field:focus {
            border-color: ${error ? designTokens.colors.semantic.error : getColor('primary.500')};
            box-shadow: 0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(143, 168, 118, 0.1)'};
          }

          .input-field:disabled {
            background: ${getColor('neutral.50')};
            color: ${getColor('neutral.400')};
            cursor: not-allowed;
          }

          .input-field::placeholder {
            color: ${getColor('neutral.400')};
            opacity: 1;
          }

          .input-label {
            position: absolute;
            left: ${getSpacing(3)};
            top: 50%;
            transform: translateY(-50%);
            color: ${getColor('neutral.500')};
            font-size: ${designTokens.typography.fontSizes.base};
            font-weight: ${designTokens.typography.fontWeights.medium};
            pointer-events: none;
            transition: all ${designTokens.animations.durations.normal}
              ${designTokens.animations.easings.elegant};
            background: white;
            padding: 0 ${getSpacing(1)};
            z-index: 2;
            transform-origin: left center;
          }

          .input-label.active {
            transform: translateY(-50%) translateY(-24px) scale(0.85);
            color: ${error ? designTokens.colors.semantic.error : getColor('primary.500')};
          }

          .input-label.required .required-indicator {
            color: ${designTokens.colors.semantic.error};
            margin-left: 2px;
          }

          .input-icon {
            position: absolute;
            left: ${getSpacing(3)};
            color: ${getColor('neutral.400')};
            z-index: 2;
            display: flex;
            align-items: center;
            transition: all ${designTokens.animations.durations.normal};
          }

          .input-icon + .input-field {
            padding-left: ${getSpacing(10)};
          }

          .input-icon + .input-field + .input-label {
            left: ${getSpacing(10)};
          }

          .input-border {
            position: absolute;
            bottom: 0;
            left: 50%;
            height: 2px;
            width: 100%;
            transform: translateX(-50%) scaleX(0);
            transform-origin: center;
            z-index: 3;
          }

          .input-helper {
            margin-top: ${getSpacing(1)};
            font-size: ${designTokens.typography.fontSizes.sm};
            color: ${getColor('neutral.600')};
            line-height: ${designTokens.typography.lineHeights.normal};
          }

          .input-helper.error {
            color: ${designTokens.colors.semantic.error};
          }

          /* Variant styles */
          .state-of-the-art-input-container.wedding .input-field {
            border-color: rgba(143, 168, 118, 0.3);
            background: rgba(246, 249, 244, 0.5);
            backdrop-filter: blur(8px);
          }

          .state-of-the-art-input-container.wedding .input-field:focus {
            background: rgba(246, 249, 244, 0.8);
            border-color: ${getColor('primary.500')};
          }

          .state-of-the-art-input-container.glass .input-field {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          /* Size styles */
          .state-of-the-art-input-container.small .input-field {
            padding: ${getSpacing(2)} ${getSpacing(3)};
            font-size: ${designTokens.typography.fontSizes.sm};
            border-radius: ${designTokens.borderRadius.md};
          }

          .state-of-the-art-input-container.medium .input-field {
            padding: ${getSpacing(3)} ${getSpacing(4)};
            font-size: ${designTokens.typography.fontSizes.base};
            border-radius: ${designTokens.borderRadius.lg};
          }

          .state-of-the-art-input-container.large .input-field {
            padding: ${getSpacing(4)} ${getSpacing(5)};
            font-size: ${designTokens.typography.fontSizes.lg};
            border-radius: ${designTokens.borderRadius.xl};
          }
        `}</style>
      </div>
    );
  }
);

StateOfTheArtInput.displayName = 'StateOfTheArtInput';

StateOfTheArtInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'wedding', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.node,
  className: PropTypes.string,
};

// Helper function to get input styles
const getInputStyles = (variant, size, error, disabled) => {
  const baseStyles = {
    transition: `all ${designTokens.animations.durations.normal} ${designTokens.animations.easings.elegant}`,
  };

  if (error) {
    baseStyles.borderColor = designTokens.colors.semantic.error;
  }

  if (disabled) {
    baseStyles.opacity = 0.6;
    baseStyles.cursor = 'not-allowed';
  }

  return baseStyles;
};

export default StateOfTheArtInput;
