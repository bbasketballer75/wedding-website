/**
 * 🎨 STATE-OF-THE-ART DESIGN TOKENS ✨
 *
 * Professional design system tokens for consistent, scalable design
 */

export const designTokens = {
  // 🎨 Color System - Professional Wedding Palette
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#f6f9f4',
      100: '#eaf2e4',
      200: '#d7e6cc',
      300: '#b8d1a6', // Main brand color
      400: '#9bc085',
      500: '#8fa876', // Core wedding green
      600: '#7a945f',
      700: '#637650',
      800: '#516044',
      900: '#445139',
    },

    // Neutral Grays - Modern & Sophisticated
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },

    // Accent Colors - Warm & Romantic
    accent: {
      rose: '#f43f5e',
      pink: '#ec4899',
      purple: '#a855f7',
      indigo: '#6366f1',
      blue: '#3b82f6',
      cyan: '#06b6d4',
      teal: '#14b8a6',
      emerald: '#10b981',
      lime: '#84cc16',
      yellow: '#eab308',
      amber: '#f59e0b',
      orange: '#f97316',
      red: '#ef4444',
    },

    // Semantic Colors
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },

    // Special Effects
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      dark: 'rgba(0, 0, 0, 0.1)',
      backdrop: 'rgba(255, 255, 255, 0.8)',
    },
  },

  // 📐 Spacing System - Harmonious Scale
  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
    40: '10rem', // 160px
    48: '12rem', // 192px
    56: '14rem', // 224px
    64: '16rem', // 256px
  },

  // 🔤 Typography System - Professional & Elegant
  typography: {
    fontFamilies: {
      serif: "'Playfair Display', Georgia, serif",
      sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', 'Monaco', monospace",
    },

    fontSizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem', // 72px
      '8xl': '6rem', // 96px
      '9xl': '8rem', // 128px
    },

    fontWeights: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    lineHeights: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // 📏 Border Radius - Modern & Consistent
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // 🌊 Shadows - Professional Depth
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',

    // Special Effects
    glow: '0 0 20px rgba(143, 168, 118, 0.3)',
    glowLarge: '0 0 40px rgba(143, 168, 118, 0.2)',
    glassmorphism: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },

  // 🎬 Animation System - Professional Motion
  animations: {
    durations: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
      slowest: '1000ms',
    },

    easings: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',

      // GSAP-style easings
      power1: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      power2: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      power3: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      power4: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',

      // Custom wedding-specific easings
      romantic: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      magical: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elegant: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },

  // 📱 Breakpoints - Responsive Design
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // 🎯 Z-Index System - Layered Architecture
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // 🌐 Backdrop Filters - Modern Glass Effects
  backdropFilters: {
    none: 'none',
    blur: 'blur(8px)',
    blurMd: 'blur(12px)',
    blurLg: 'blur(16px)',
    blurXl: 'blur(24px)',
    blurProfessional: 'blur(20px) saturate(180%)',
  },
};

// 🎨 Utility Functions for Design Tokens

/**
 * Get a color value from the design tokens
 */
export const getColor = (colorPath) => {
  const pathArray = colorPath.split('.');
  let result = designTokens.colors;

  for (const path of pathArray) {
    result = result[path];
    if (!result) return null;
  }

  return result;
};

/**
 * Get spacing value from design tokens
 */
export const getSpacing = (key) => {
  return designTokens.spacing[key] || key;
};

/**
 * Get typography value from design tokens
 */
export const getTypography = (category, key) => {
  return designTokens.typography[category]?.[key];
};

/**
 * Get shadow value from design tokens
 */
export const getShadow = (key) => {
  return designTokens.shadows[key];
};

/**
 * Create CSS custom properties from design tokens
 */
export const createCSSVariables = () => {
  const cssVars = {};

  // Colors
  Object.entries(designTokens.colors).forEach(([category, colors]) => {
    if (typeof colors === 'object') {
      Object.entries(colors).forEach(([shade, value]) => {
        cssVars[`--color-${category}-${shade}`] = value;
      });
    } else {
      cssVars[`--color-${category}`] = colors;
    }
  });

  // Spacing
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Typography
  Object.entries(designTokens.typography.fontSizes).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value;
  });

  return cssVars;
};

// 🎯 Component Variants System

export const componentVariants = {
  button: {
    primary: {
      backgroundColor: getColor('primary.500'),
      color: 'white',
      border: 'none',
      borderRadius: designTokens.borderRadius.lg,
      padding: `${getSpacing(3)} ${getSpacing(6)}`,
      fontSize: designTokens.typography.fontSizes.base,
      fontWeight: designTokens.typography.fontWeights.medium,
      boxShadow: designTokens.shadows.md,
      transition: `all ${designTokens.animations.durations.normal} ${designTokens.animations.easings.elegant}`,
    },

    secondary: {
      backgroundColor: 'transparent',
      color: getColor('primary.500'),
      border: `2px solid ${getColor('primary.500')}`,
      borderRadius: designTokens.borderRadius.lg,
      padding: `${getSpacing(3)} ${getSpacing(6)}`,
      fontSize: designTokens.typography.fontSizes.base,
      fontWeight: designTokens.typography.fontWeights.medium,
      transition: `all ${designTokens.animations.durations.normal} ${designTokens.animations.easings.elegant}`,
    },

    ghost: {
      backgroundColor: 'transparent',
      color: getColor('neutral.700'),
      border: 'none',
      borderRadius: designTokens.borderRadius.lg,
      padding: `${getSpacing(3)} ${getSpacing(6)}`,
      fontSize: designTokens.typography.fontSizes.base,
      fontWeight: designTokens.typography.fontWeights.medium,
      transition: `all ${designTokens.animations.durations.normal} ${designTokens.animations.easings.elegant}`,
    },
  },

  card: {
    default: {
      backgroundColor: 'white',
      borderRadius: designTokens.borderRadius['2xl'],
      padding: getSpacing(6),
      boxShadow: designTokens.shadows.lg,
      border: `1px solid ${getColor('neutral.200')}`,
    },

    glass: {
      backgroundColor: designTokens.colors.glass.backdrop,
      borderRadius: designTokens.borderRadius['2xl'],
      padding: getSpacing(6),
      boxShadow: designTokens.shadows.glassmorphism,
      border: `1px solid ${designTokens.colors.glass.light}`,
      backdropFilter: designTokens.backdropFilters.blurProfessional,
    },

    elevated: {
      backgroundColor: 'white',
      borderRadius: designTokens.borderRadius['2xl'],
      padding: getSpacing(8),
      boxShadow: designTokens.shadows['2xl'],
      border: 'none',
    },
  },
};

export default designTokens;
