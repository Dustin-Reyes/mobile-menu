import { motion } from 'framer-motion';
import Button from 'components/Button';
import useAnimationConfig from 'hooks/useAnimationConfig';

const MotionButtonBase = motion(Button);

/**
 * Button with Framer Motion micro-interactions.
 * Preserves all Button variants and props. Respects prefers-reduced-motion.
 */
function MotionButton({ children, ...props }) {
  const { buttonPress } = useAnimationConfig();

  return (
    <MotionButtonBase {...buttonPress} {...props}>
      {children}
    </MotionButtonBase>
  );
}

export default MotionButton;
