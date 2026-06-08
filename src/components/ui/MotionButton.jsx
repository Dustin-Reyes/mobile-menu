/**
 * Convenience wrapper around Button with Framer Motion press animations always enabled.
 * @module components/ui/MotionButton
 */
import { motion } from 'framer-motion';
import Button from 'components/ui/Button';
import useAnimationConfig from 'hooks/useAnimationConfig';

const MotionButtonBase = motion(Button);

/**
 * Button with Framer Motion micro-interactions.
 * Preserves all Button variants and props. Respects prefers-reduced-motion.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
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
