/**
 * Optimized GSAP Utilities with Dynamic Loading
 * Reduces initial bundle size by lazy-loading GSAP modules
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Export GSAP for direct use when needed
export { gsap };

// Common GSAP animations that can be reused
export const fadeInUp = (target, options = {}) => {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      ...options,
    }
  );
};

export const fadeIn = (target, options = {}) => {
  return gsap.fromTo(
    target,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      ...options,
    }
  );
};

export const slideInFromLeft = (target, options = {}) => {
  return gsap.fromTo(
    target,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      ...options,
    }
  );
};

export const slideInFromRight = (target, options = {}) => {
  return gsap.fromTo(
    target,
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      ...options,
    }
  );
};

export const scaleIn = (target, options = {}) => {
  return gsap.fromTo(
    target,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      ...options,
    }
  );
};

export const staggerFadeIn = (targets, options = {}) => {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      ...options,
    }
  );
};

// Scroll-triggered animations
export const createScrollAnimation = (target, animation, options = {}) => {
  return ScrollTrigger.create({
    trigger: target,
    start: 'top 80%',
    end: 'bottom 20%',
    animation: animation,
    toggleActions: 'play none none reverse',
    ...options,
  });
};

// Utility for creating timeline
export const createTimeline = (options = {}) => {
  return gsap.timeline(options);
};

// Hover animations
export const hoverScale = (target, scale = 1.05) => {
  const enter = () => gsap.to(target, { scale, duration: 0.3, ease: 'power2.out' });
  const leave = () => gsap.to(target, { scale: 1, duration: 0.3, ease: 'power2.out' });

  return { enter, leave };
};

// Loading animation
export const createLoadingAnimation = (target) => {
  return gsap.to(target, {
    rotation: 360,
    duration: 1,
    ease: 'none',
    repeat: -1,
  });
};
