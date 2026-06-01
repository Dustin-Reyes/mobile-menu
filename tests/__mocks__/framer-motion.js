const React = require('react');

function makeMotionComponent(tag, displayName) {
  const Component = React.forwardRef(({ children, ...props }, ref) => {
    const {
      initial,
      animate,
      exit,
      variants,
      transition,
      whileHover,
      whileTap,
      whileFocus,
      whileInView,
      viewport,
      layout,
      layoutId,
      onAnimationStart,
      onAnimationComplete,
      ...domProps
    } = props;
    return React.createElement(tag, { ...domProps, ref }, children);
  });
  Component.displayName = displayName;
  return Component;
}

// motion.div / motion.header etc. (element access)
// motion(Component) factory call
const motion = new Proxy(
  function motionFactory(Component) {
    const name = `motion(${Component.displayName || Component.name || 'Component'})`;
    const Wrapped = React.forwardRef(({ children, ...props }, ref) => {
      const {
        initial,
        animate,
        exit,
        variants,
        transition,
        whileHover,
        whileTap,
        whileFocus,
        whileInView,
        viewport,
        layout,
        layoutId,
        onAnimationStart,
        onAnimationComplete,
        ...rest
      } = props;
      return React.createElement(Component, { ...rest, ref }, children);
    });
    Wrapped.displayName = name;
    return Wrapped;
  },
  {
    get: (_, tag) => makeMotionComponent(tag, `motion.${tag}`),
  },
);

const AnimatePresence = ({ children }) =>
  React.createElement(React.Fragment, null, children);
AnimatePresence.displayName = 'AnimatePresence';

const useReducedMotion = () => false;
const useAnimation = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  set: jest.fn(),
});
const useMotionValue = (initial) => ({ get: () => initial, set: jest.fn() });
const useTransform = () => ({ get: () => 0 });
const useSpring = (val) => val;

module.exports = {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
};
