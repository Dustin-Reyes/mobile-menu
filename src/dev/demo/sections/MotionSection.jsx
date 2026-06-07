import { useState } from 'react';
import styled from '@emotion/styled';
import AnimatedSection from 'components/AnimatedSection';
import MotionButton from 'components/ui/MotionButton';
import CodeBlock from 'components/CodeBlock';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';

// ─── Animation variants data ───────────────────────────────────────────────────

const ANIMATION_VARIANTS = [
  {
    name: 'fadeIn',
    description:
      'Opacity fade for page transitions. Has hidden, visible, and exit states.',
  },
  {
    name: 'slideUp',
    description:
      'Fade + translateY for hero children and stagger items. Moves upward into place.',
  },
  {
    name: 'slideDown',
    description:
      'Fade + negative translateY for header entrance. Moves downward into place.',
  },
  {
    name: 'scaleIn',
    description: 'Fade + scale for modal-style reveals. Scales from 0.95 to 1.',
  },
  {
    name: 'staggerContainer',
    description:
      'Parent variant that staggers children. Spread on a motion container wrapping animated children.',
  },
  {
    name: 'buttonPress',
    description:
      'Spread as {...buttonPress} on motion elements. Provides hover scale (1.02) and tap scale (0.96).',
  },
];

// ─── Props table rows ──────────────────────────────────────────────────────────

const ANIMATED_SECTION_PROPS = [
  {
    prop: 'delay',
    type: 'number',
    default: '0',
    description: 'Animation delay in seconds before the section reveals',
  },
  {
    prop: 'children',
    type: 'ReactNode',
    default: null,
    description: 'Content to animate',
  },
];

const MOTION_BUTTON_PROPS = [
  {
    prop: 'variant',
    type: "'primary' | 'secondary' | 'outline' | 'ghost'",
    default: "'primary'",
    description:
      'Same variants as Button — MotionButton is a drop-in replacement',
  },
  {
    prop: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables motion interactions when true',
  },
];

// ─── Styled components ─────────────────────────────────────────────────────────

const VariantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const VariantCard = styled.div`
  padding: 1rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
`;

const VariantName = styled.p`
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const VariantDescription = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

const SubLabel = styled.h3`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
  margin-top: 2rem;
`;

const LiveDemoBox = styled.div`
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  margin-bottom: 1rem;
`;

const LiveDemoControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

const LiveDemoContent = styled.div`
  padding: 1rem;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

const RadixNote = styled.div`
  margin-top: 2rem;
  padding: 1rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border-left: 3px solid ${(p) => p.theme.colors.primary};
  border-radius: ${(p) => p.theme.borderRadius.s1};
`;

const RadixNoteText = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

// ─── Code snippets ────────────────────────────────────────────────────────────

const USE_ANIMATION_CONFIG_CODE = `import useAnimationConfig from 'hooks/useAnimationConfig';
import { motion } from 'framer-motion';

function MyComponent() {
  const { fadeIn, slideUp, prefersReduced } = useAnimationConfig();

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      Content
    </motion.div>
  );
}`;

const ANIMATED_SECTION_CODE = `import AnimatedSection from 'components/AnimatedSection';

// Wraps content with whileInView scroll reveal
<AnimatedSection delay={0.1}>
  <p>This animates in when scrolled into view.</p>
</AnimatedSection>`;

const MOTION_BUTTON_CODE = `import MotionButton from 'components/ui/MotionButton';

// Drop-in replacement for Button with hover/tap scale
<MotionButton variant="primary">Hover me</MotionButton>`;

// ─── MotionSection ─────────────────────────────────────────────────────────────

function MotionSection() {
  const [demoKey, setDemoKey] = useState(0);

  return (
    <ComponentSection
      id="motion"
      title="Motion & Animation"
      description="Framer Motion animation primitives with accessibility-aware reduced motion support."
    >
      {/* Animation variants */}
      <SubLabel>Animation Variants</SubLabel>
      <VariantsGrid>
        {ANIMATION_VARIANTS.map(({ name, description }) => (
          <VariantCard key={name}>
            <VariantName>{name}</VariantName>
            <VariantDescription>{description}</VariantDescription>
          </VariantCard>
        ))}
      </VariantsGrid>

      {/* Live demo */}
      <SubLabel>Live Demo — AnimatedSection</SubLabel>
      <LiveDemoBox>
        <LiveDemoControls>
          <MotionButton
            variant="secondary"
            onClick={() => setDemoKey((k) => k + 1)}
          >
            Re-mount AnimatedSection
          </MotionButton>
        </LiveDemoControls>
        <AnimatedSection key={demoKey}>
          <LiveDemoContent>
            This content animates in on scroll (or on remount). Click the button
            above to replay the entrance animation.
          </LiveDemoContent>
        </AnimatedSection>
      </LiveDemoBox>

      {/* Code snippets */}
      <SubLabel>Usage</SubLabel>
      <CodeBlock language="jsx" description="useAnimationConfig hook">
        {USE_ANIMATION_CONFIG_CODE}
      </CodeBlock>
      <CodeBlock language="jsx" description="AnimatedSection">
        {ANIMATED_SECTION_CODE}
      </CodeBlock>
      <CodeBlock language="jsx" description="MotionButton">
        {MOTION_BUTTON_CODE}
      </CodeBlock>

      {/* Props tables */}
      <PropsTable rows={ANIMATED_SECTION_PROPS} label="AnimatedSection Props" />
      <PropsTable rows={MOTION_BUTTON_PROPS} label="MotionButton Props" />

      {/* Radix note */}
      <RadixNote>
        <RadixNoteText>
          Radix components (Accordion, Dialog, DropdownMenu) use CSS @keyframes
          and data-state attributes for their animations. These are
          intentionally preserved and should not be replaced with Framer Motion.
        </RadixNoteText>
      </RadixNote>
    </ComponentSection>
  );
}

export default MotionSection;
