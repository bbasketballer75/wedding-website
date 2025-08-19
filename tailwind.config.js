/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/page-components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 🎨 2025 Luxury Typography Stack
        display: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        script: ['Allura', 'Dancing Script', 'cursive'],
        body: ['Inter', 'system-ui', 'sans-serif'],

        // Legacy support
        dancing: ['Dancing Script', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      fontSize: {
        // 🎯 Perfect Typography Scale (1.25 ratio)
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'hero-xl': ['6rem', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'hero-lg': ['5rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      },
      colors: {
        // 🌿 Sophisticated 2025 Wedding Palette
        sage: {
          50: '#f0f7ea',
          100: '#d4e5c7',
          200: '#a8c090',
          300: '#8fa876',
          400: '#6b8a4f',
          500: '#4a6139',
          600: '#3a4d2c',
          700: '#2d3b22',
          800: '#1f2917',
          900: '#14190f',
        },
        blush: {
          50: '#fdf6f7',
          100: '#fae6e8',
          200: '#f2c9cd',
          300: '#e8b4b8',
          400: '#d49ca1',
          500: '#c18489',
          600: '#a96d72',
          700: '#8b565b',
          800: '#6d4044',
          900: '#4f2a2d',
        },
        eucalyptus: {
          50: '#f4f9f0',
          100: '#e8f1dd',
          200: '#cde0ba',
          300: '#b8d1a6',
          400: '#9cb587',
          500: '#809968',
          600: '#657d54',
          700: '#4a6140',
          800: '#30452c',
          900: '#152918',
        },
        // Premium neutrals
        pearl: '#fefcfa',
        champagne: '#f9f5f0',
        dove: '#f2efeb',
        slate: '#e8e5e1',
        charcoal: '#2c2c2c',
        midnight: '#1a1a1a',

        // Legacy support
        'dusty-rose': '#D4A574',
        'sage-green': '#87A96B',
        cream: '#F5F5DC',
        'soft-pink': '#F8E8E8',
        'deep-burgundy': '#722F37',
        'warm-gold': '#D4A574',
      },
      spacing: {
        // 🎯 Consistent spacing based on 8px grid
        18: '4.5rem',
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
      animation: {
        // 🎭 Sophisticated Animations
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        float: 'float 6s ease-in-out infinite',
        'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gentleBounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-5px)' },
          '60%': { transform: 'translateY(-3px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        // ✨ Elegant shadows with wedding colors
        soft: '0 1px 3px rgba(139, 168, 118, 0.08), 0 1px 2px rgba(139, 168, 118, 0.04)',
        medium: '0 4px 6px rgba(139, 168, 118, 0.05), 0 2px 4px rgba(139, 168, 118, 0.03)',
        large: '0 10px 15px rgba(139, 168, 118, 0.08), 0 4px 6px rgba(139, 168, 118, 0.03)',
        xl: '0 20px 25px rgba(139, 168, 118, 0.08), 0 8px 10px rgba(139, 168, 118, 0.03)',
        '2xl': '0 25px 50px rgba(139, 168, 118, 0.12)',
        inner: 'inset 0 2px 4px rgba(139, 168, 118, 0.04)',
        glow: '0 0 20px rgba(139, 168, 118, 0.15)',
      },
    },
  },
  plugins: [],
};
