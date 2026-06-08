/**
 * Card layout components for surfaced content containers.
 * @module components/ui/Card
 */
import styled from '@emotion/styled';

/** Outer card container with surface background, border, shadow, and overflow clipping. */
export const CardRoot = styled.div`
  background: ${(p) => p.theme?.colors?.surface};
  border: 1px solid ${(p) => p.theme?.colors?.border};
  border-radius: ${(p) => p.theme?.borderRadius?.lg || '0.5rem'};
  box-shadow: ${(p) => p.theme?.shadows?.md};
  overflow: hidden;
  padding: 1.5rem;
`;

/** Card header row with bottom border and bold heading typography. */
export const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme?.colors?.border};
  font-weight: ${(p) => p.theme?.typography?.fontWeights?.semibold || '600'};
  font-size: ${(p) => p.theme?.typography?.fontSizes?.s2 || '1.125rem'};
  color: ${(p) => p.theme?.colors?.text};
`;

/** Main content area with body text sizing and relaxed line height. */
export const CardBody = styled.div`
  padding: 1.5rem;
  color: ${(p) => p.theme?.colors?.text};
  font-size: ${(p) => p.theme?.typography?.fontSizes?.s1 || '1rem'};
  line-height: ${(p) => p.theme?.typography?.lineHeights?.relaxed || '1.6'};
`;

/** Card footer row with top border; lays out action elements in a horizontal flex row. */
export const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${(p) => p.theme?.colors?.border};
  background: ${(p) => p.theme?.colors?.background};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// Default export for CardRoot as Card
const Card = CardRoot;
export default Card;
