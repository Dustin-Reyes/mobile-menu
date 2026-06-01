import { useReducedMotion } from 'framer-motion';

/**
 * Central accessibility bridge for Framer Motion animations.
 * All animated components should call this hook to get prefers-reduced-motion-aware configs.
 *
 * When prefersReduced is true: instant transitions (duration: 0, no movement)
 * When prefersReduced is false: standard eased transitions
 */
function useAnimationConfig() {
  const prefersReduced = useReducedMotion();

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: prefersReduced ? 0 : 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      transition: { duration: prefersReduced ? 0 : 0.2, ease: 'easeIn' },
    },
  };

  const slideUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.45, ease: 'easeOut' },
    },
  };

  const slideDown = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.35, ease: 'easeOut' },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: prefersReduced ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: prefersReduced ? 0 : 0.3, ease: 'easeOut' },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.12,
        delayChildren: prefersReduced ? 0 : 0.1,
      },
    },
  };

  const buttonPress = prefersReduced
    ? {}
    : { whileTap: { scale: 0.96 }, whileHover: { scale: 1.02 } };

  return {
    fadeIn,
    slideUp,
    slideDown,
    scaleIn,
    staggerContainer,
    buttonPress,
    prefersReduced,
  };
}

export default useAnimationConfig;
