import { motion } from 'framer-motion';
import useAnimationConfig from 'hooks/useAnimationConfig';

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
