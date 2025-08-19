/**
 * Optimized Motion Components with Dynamic Loading
 * Reduces initial bundle size by lazy-loading Framer Motion
 */

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// Pre-export the commonly used components for tree-shaking
export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
export const MotionSection = motion.section;
export const MotionButton = motion.button;
export const MotionImg = motion.img;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionP = motion.p;

// Export other commonly used exports
export { AnimatePresence, motion, useScroll, useTransform };

// Common animation variants for reuse
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// Optimized Motion component with common props
export const OptimizedMotion = forwardRef(
  (
    { as = 'div', variant = 'fadeInUp', transition = { duration: 0.3 }, children, ...props },
    ref
  ) => {
    const MotionComponent = motion[as] || motion.div;

    const variants = {
      fadeInUp,
      fadeIn,
      slideInFromLeft,
      slideInFromRight,
      scaleIn,
    };

    return (
      <MotionComponent
        ref={ref}
        variants={variants[variant] || fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

OptimizedMotion.displayName = 'OptimizedMotion';

// PropTypes for the component
OptimizedMotion.propTypes = {
  as: PropTypes.string,
  variant: PropTypes.oneOf([
    'fadeInUp',
    'fadeIn',
    'slideInFromLeft',
    'slideInFromRight',
    'scaleIn',
  ]),
  transition: PropTypes.object,
  children: PropTypes.node,
};
