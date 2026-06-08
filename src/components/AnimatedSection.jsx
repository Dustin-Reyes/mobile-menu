/**
 * @module components/AnimatedSection
 * @description Wraps content in a Framer Motion `div` that fades and slides into
 * view when it enters the viewport. Respects the user's reduced-motion preference
 * by disabling animation offset and duration when `prefersReduced` is true.
 */
import { motion } from 'framer-motion';
import useAnimationConfig from 'hooks/useAnimationConfig';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate into view.
 * @param {number} [props.delay=0] - Entrance animation delay in seconds.
 * @returns {JSX.Element}
 */
function AnimatedSection({ children, delay = 0, ...props }) {
  const { prefersReduced } = useAnimationConfig();

  const variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.45,
        ease: 'easeOut',
        delay: prefersReduced ? 0 : delay,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedSection;
