/**
 * @module components/PageTransition
 * @description Wraps page content in a Framer Motion fade animation that plays
 * on mount and exit. Animation variants are sourced from useAnimationConfig to
 * respect the user's reduced-motion preference.
 */
import { motion } from 'framer-motion';
import useAnimationConfig from 'hooks/useAnimationConfig';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to animate in and out.
 * @returns {JSX.Element}
 */
function PageTransition({ children }) {
  const { fadeIn } = useAnimationConfig();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
