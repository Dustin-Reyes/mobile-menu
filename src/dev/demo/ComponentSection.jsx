import styled from '@emotion/styled';
import AnimatedSection from 'components/AnimatedSection';

// ─── Styled components ─────────────────────────────────────────────────────────

const SectionRoot = styled.section`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};

  &:first-of-type {
    margin-top: 2rem;
    border-top: none;
  }
`;

const SectionAnchor = styled.div`
  /* Offset for sticky header so scrollspy target isn't hidden */
  scroll-margin-top: 6rem;
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

// ─── ComponentSection ──────────────────────────────────────────────────────────

/**
 * Shared section wrapper for Demo page sections.
 * Renders an anchor-linked heading + description + children slot.
 * Wrapped in AnimatedSection for scroll reveal.
 *
 * @prop {string}    id          - Section id for anchor links and scrollspy
 * @prop {string}    title       - Section heading text
 * @prop {string}    description - One-sentence description shown below heading
 * @prop {ReactNode} children    - Section content
 */
function ComponentSection({ id, title, description, children }) {
  return (
    <SectionRoot>
      <SectionAnchor id={id} />
      <AnimatedSection>
        <SectionHeader>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </SectionHeader>
        {children}
      </AnimatedSection>
    </SectionRoot>
  );
}

export default ComponentSection;
