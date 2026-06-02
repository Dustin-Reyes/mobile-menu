const React = require('react');

const ANIM_PROPS = new Set([
  'variants', 'initial', 'animate', 'exit',
  'whileHover', 'whileTap', 'whileInView', 'whileFocus', 'whileDrag',
  'transition', 'drag', 'dragConstraints', 'dragElastic',
  'layout', 'layoutId', 'onAnimationComplete', 'onLayoutAnimationComplete',
  'viewport',
]);

function createPassthrough(Tag) {
  const Component = React.forwardRef((props, ref) => {
    const rest = {};
    for (const key of Object.keys(props)) {
      if (!ANIM_PROPS.has(key)) rest[key] = props[key];
    }
    if (typeof Tag === 'string') {
      return React.createElement(Tag, { ...rest, ref });
    }
    return React.createElement(Tag, { ...rest, ref });
  });
  const name = typeof Tag === 'string' ? Tag : Tag.displayName || Tag.name || 'Component';
  Component.displayName = `Motion(${name})`;
  return Component;
}

const motion = new Proxy(
  function (Component) {
    return createPassthrough(Component);
  },
  {
    get(fn, tag) {
      if (tag === 'then') return undefined;
      return createPassthrough(tag);
    },
  }
);

function AnimatePresence({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function useReducedMotion() {
  return false;
}

function useAnimation() {
  return { start: jest.fn(), stop: jest.fn() };
}

module.exports = { motion, AnimatePresence, useReducedMotion, useAnimation };
