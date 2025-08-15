/**
 * ✨ MAGICAL INTERACTIONS UTILITIES ✨
 * Powers the incredible user experience enhancements
 */

// 🌟 Intersection Observer for Scroll Animations
export class MagicalScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Check if we're in the browser
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Create intersection observer for fade-in animations
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px',
      }
    );

    // Observe all elements with animation classes
    this.observeElements();
  }

  observeElements() {
    if (typeof document === 'undefined' || !this.observer) return;

    const animatedElements = document.querySelectorAll(
      '.fade-in-up, .stagger-animation, .elegant-lift'
    );

    animatedElements.forEach((el) => {
      this.observer.observe(el);
    });
  }

  // Add new elements to observer (for dynamic content)
  observe(element) {
    if (this.observer && element) {
      this.observer.observe(element);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// 🎪 Confetti Celebration System
export class ConfettiCelebration {
  static trigger(element, count = 50) {
    if (typeof document === 'undefined') return;

    const colors = ['#8B9467', '#E8C5A0', '#F4E8D4', '#D4AF37'];
    const container = element || document.body;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createConfettiPiece(container, colors);
      }, i * 50);
    }
  }

  static createConfettiPiece(container, colors) {
    if (typeof document === 'undefined') return;

    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.animationDuration = Math.random() * 2 + 2 + 's';

    container.appendChild(confetti);

    // Remove after animation
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 4000);
  }
}

// 💫 Ripple Effect for Button Clicks
export class RippleEffect {
  static addTo(element) {
    if (typeof document === 'undefined') return;

    element.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.position = 'absolute';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'scale(0)';
      ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);

      // Trigger animation
      setTimeout(() => {
        ripple.style.transform = 'scale(4)';
        ripple.style.opacity = '0';
      }, 10);

      // Remove ripple
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });
  }
}

// 🎵 Sound Effects Manager
export class SoundEffects {
  constructor() {
    this.sounds = new Map();
    this.enabled = false;
    this.volume = 0.3;
    this.loadSounds();
  }

  loadSounds() {
    // Define sound effects (you'll need to add these audio files)
    const soundList = {
      click: '/audio/gentle-click.mp3',
      success: '/audio/soft-chime.mp3',
      upload: '/audio/upload-success.mp3',
      celebration: '/audio/gentle-applause.mp3',
    };

    Object.entries(soundList).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.volume = this.volume;
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    });
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((audio) => {
      audio.volume = this.volume;
    });
  }

  play(soundName) {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Handle autoplay restrictions gracefully
      });
    }
  }
}

// 🌈 Dynamic Theme Manager
export class MagicalThemes {
  constructor() {
    this.currentTheme = 'default';
    this.themes = {
      default: {
        primary: '#8B9467',
        secondary: '#E8C5A0',
        accent: '#F4E8D4',
      },
      sunset: {
        primary: '#FF6B6B',
        secondary: '#FFE66D',
        accent: '#FF8E53',
      },
      midnight: {
        primary: '#4A5568',
        secondary: '#A0AEC0',
        accent: '#E2E8F0',
      },
    };
  }

  applyTheme(themeName) {
    if (typeof document === 'undefined') return;

    const theme = this.themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(`--theme-${property}`, value);
    });

    this.currentTheme = themeName;
  }

  // Apply theme based on time of day
  applyTimeBasedTheme() {
    const hour = new Date().getHours();

    if (hour >= 18 || hour <= 6) {
      this.applyTheme('midnight');
    } else if (hour >= 16 && hour < 18) {
      this.applyTheme('sunset');
    } else {
      this.applyTheme('default');
    }
  }
}

// 📱 Mobile Touch Gestures
export class TouchMagic {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.threshold = 50;
    this.init();
  }

  init() {
    this.element.addEventListener(
      'touchstart',
      (e) => {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      },
      { passive: true }
    );

    this.element.addEventListener(
      'touchend',
      (e) => {
        if (!this.startX || !this.startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const diffX = this.startX - endX;
        const diffY = this.startY - endY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
          // Horizontal swipe
          if (Math.abs(diffX) > this.threshold) {
            if (diffX > 0) {
              this.onSwipeLeft();
            } else {
              this.onSwipeRight();
            }
          }
        } else {
          // Vertical swipe
          if (Math.abs(diffY) > this.threshold) {
            if (diffY > 0) {
              this.onSwipeUp();
            } else {
              this.onSwipeDown();
            }
          }
        }

        this.startX = 0;
        this.startY = 0;
      },
      { passive: true }
    );
  }

  onSwipeLeft() {
    this.element.dispatchEvent(new CustomEvent('swipeleft'));
  }

  onSwipeRight() {
    this.element.dispatchEvent(new CustomEvent('swiperight'));
  }

  onSwipeUp() {
    this.element.dispatchEvent(new CustomEvent('swipeup'));
  }

  onSwipeDown() {
    this.element.dispatchEvent(new CustomEvent('swipedown'));
  }
}

// 🎯 Smart Loading States
export class MagicalLoading {
  static createSkeleton(element, config = {}) {
    if (typeof document === 'undefined') return null;

    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    skeleton.style.width = config.width || '100%';
    skeleton.style.height = config.height || '20px';
    skeleton.style.marginBottom = config.margin || '10px';

    return skeleton;
  }

  static showSkeletonFor(element, count = 3) {
    if (typeof document === 'undefined') return;

    const container = document.createElement('div');
    container.className = 'skeleton-container';

    for (let i = 0; i < count; i++) {
      const skeleton = this.createSkeleton(element, {
        height: `${Math.random() * 20 + 15}px`,
        width: `${Math.random() * 30 + 70}%`,
      });
      container.appendChild(skeleton);
    }

    element.appendChild(container);
    return container;
  }

  static removeSkeleton(element) {
    const skeleton = element.querySelector('.skeleton-container');
    if (skeleton) {
      skeleton.remove();
    }
  }
}

// 🚀 Initialize All Magical Systems
export class MagicalExperienceManager {
  constructor() {
    this.scrollAnimations = null;
    this.sounds = null;
    this.themes = null;
    this.init();
  }

  init() {
    // Check if we're in the browser
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Initialize scroll animations
    this.scrollAnimations = new MagicalScrollAnimations();

    // Initialize sound effects
    this.sounds = new SoundEffects();

    // Initialize themes
    this.themes = new MagicalThemes();

    // Apply time-based theme
    this.themes.applyTimeBasedTheme();

    // Add ripple effects to buttons
    this.addRippleEffects();

    // Add photo magic to images
    this.addPhotoMagic();

    // Setup celebration triggers
    this.setupCelebrationTriggers();
  }

  addRippleEffects() {
    if (typeof document === 'undefined') return;

    const buttons = document.querySelectorAll('button, .btn, .btn-magical');
    buttons.forEach((button) => {
      RippleEffect.addTo(button);
    });
  }

  addPhotoMagic() {
    if (typeof document === 'undefined') return;

    const images = document.querySelectorAll('img, .photo');
    images.forEach((img) => {
      img.classList.add('photo-magic');
    });
  }

  setupCelebrationTriggers() {
    if (typeof document === 'undefined') return;

    // Trigger confetti on form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      form.addEventListener('submit', () => {
        ConfettiCelebration.trigger(form);
        this.sounds.play('success');
      });
    });

    // Trigger celebration on photo uploads
    const uploadInputs = document.querySelectorAll('input[type="file"]');
    uploadInputs.forEach((input) => {
      input.addEventListener('change', () => {
        if (input.files.length > 0) {
          ConfettiCelebration.trigger(input.parentElement);
          this.sounds.play('upload');
        }
      });
    });
  }

  enableSounds() {
    if (this.sounds) {
      this.sounds.enable();
    }
  }

  disableSounds() {
    this.sounds.disable();
  }

  destroy() {
    if (this.scrollAnimations) {
      this.scrollAnimations.disconnect();
    }
  }
}

// 🎉 Auto-initialize the magical experience
export const magicalExperience = new MagicalExperienceManager();
