import { motion } from 'framer-motion';
import useAnimationConfig from 'hooks/useAnimationConfig';

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
