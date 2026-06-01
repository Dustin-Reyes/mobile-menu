# Animations

Framer Motion handles page transitions, entrance animations, scroll-triggered reveals, and button micro-interactions. All animations respect `prefers-reduced-motion`.

---

## Quick start

### Scroll-reveal a page section

Wrap any section with `AnimatedSection` and it fades up when it enters the viewport:

```jsx
import AnimatedSection from 'components/AnimatedSection';

<AnimatedSection>
  <Section>...</Section>
</AnimatedSection>
```

Add a `delay` (seconds) to stagger sibling sections:

```jsx
<AnimatedSection delay={0.1}>...</AnimatedSection>
<AnimatedSection delay={0.2}>...</AnimatedSection>
```

### Button micro-interactions

`MotionButton` is a drop-in replacement for `Button` with subtle press and hover scale:

```jsx
import MotionButton from 'components/ui/MotionButton';

<MotionButton variant="outline">Save</MotionButton>
```

---

## Custom animations

### Animate any element with a variant

Call `useAnimationConfig` to get reduced-motion-aware variants, then apply them to a `motion.*` element:

```jsx
import { motion } from 'framer-motion';
import useAnimationConfig from 'hooks/useAnimationConfig';

function MyComponent() {
  const { slideUp } = useAnimationConfig();

  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible">
      content
    </motion.div>
  );
}
```

### Stagger children

Use `staggerContainer` on the parent so children animate in sequence:

```jsx
const { staggerContainer, slideUp } = useAnimationConfig();

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.div variants={slideUp}>First</motion.div>
  <motion.div variants={slideUp}>Second</motion.div>
  <motion.div variants={slideUp}>Third</motion.div>
</motion.div>
```

### Animate a styled component

Two options — wrap an existing component with `motion()`, or build an animated styled component directly:

```jsx
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

// Option A — wrap existing component
const MotionCard = motion(Card);
<MotionCard variants={slideUp} initial="hidden" animate="visible" />

// Option B — styled component that is already a motion element
const AnimatedBox = styled(motion.div)`
  color: ${(props) => props.theme.colors.text};
`;
```

### Add a page transition to a new route

Wrap the route element in `PageTransition` inside `App.jsx`:

```jsx
<Route path="/new" element={<PageTransition><NewPage /></PageTransition>} />
```

---

## Available variants

All variants come from `useAnimationConfig` (`src/hooks/useAnimationConfig.js`):

| Variant | Use case |
|---|---|
| `fadeIn` | Page transitions — includes an `exit` variant |
| `slideUp` | Hero children, stagger items, general reveals |
| `slideDown` | Header entrance, dropdown-style reveals |
| `scaleIn` | Modal-style or card entrance |
| `staggerContainer` | Parent wrapper that sequences child animations |
| `buttonPress` | Spread onto a motion element for hover/tap scale: `{...buttonPress}` |

When `prefers-reduced-motion: reduce` is active, all movement (`y`, `scale`) is disabled and durations are set to `0`. Opacity transitions are always preserved.

---

## Rules

- **Do not replace Radix CSS animations.** Accordion, Dialog, and DropdownMenu rely on `data-state` attributes and CSS custom properties — Framer Motion cannot drive these. The existing `@keyframes` must remain.
- **Always go through `useAnimationConfig`.** Direct use of hardcoded `transition` values bypasses reduced-motion support.
