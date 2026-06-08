/**
 * Static Framer Motion animation variants.
 *
 * These are **not** `prefers-reduced-motion`-aware. For motion-safe variants
 * that respect the OS accessibility setting, use `useAnimationConfig()` instead.
 * These static variants are useful in contexts where the hook is unavailable
 * (e.g. non-React entry points or tests).
 *
 * @module utils/animations
 */

/**
 * Simple opacity fade-in variant.
 *
 * @type {import('framer-motion').Variants}
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Fade in while moving upward.
 *
 * @type {import('framer-motion').Variants}
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Fade in while moving downward.
 *
 * @type {import('framer-motion').Variants}
 */
export const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Fade in while sliding in from the left.
 *
 * @type {import('framer-motion').Variants}
 */
export const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Fade in while sliding in from the right.
 *
 * @type {import('framer-motion').Variants}
 */
export const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Fade in while scaling up from 80 % to 100 %.
 *
 * @type {import('framer-motion').Variants}
 */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Container variant that staggers entrance animations of child elements.
 *
 * @type {import('framer-motion').Variants}
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Child item variant used inside a `staggerContainer`.
 *
 * @type {import('framer-motion').Variants}
 */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Hover animation that scales the element up slightly.
 *
 * @type {import('framer-motion').TargetAndTransition}
 */
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: 'easeInOut',
  },
};

/**
 * Hover animation that lifts the element upward.
 *
 * @type {import('framer-motion').TargetAndTransition}
 */
export const hoverLift = {
  y: -8,
  transition: {
    duration: 0.2,
    ease: 'easeInOut',
  },
};

/**
 * Full-page enter/exit transition variant.
 *
 * @type {import('framer-motion').Variants}
 */
export const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};
