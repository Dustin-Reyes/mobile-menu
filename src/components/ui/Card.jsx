import styled from '@emotion/styled';

export const CardRoot = styled.div`
  background: ${(p) => p.theme?.colors?.surface || '#f8fafc'};
  border: 1px solid ${(p) => p.theme?.colors?.border || '#e2e8f0'};
  border-radius: ${(p) => p.theme?.borderRadius?.lg || '0.5rem'};
  box-shadow: ${(p) => p.theme?.shadows?.md || '0 1px 3px rgba(0, 0, 0, 0.1)'};
  overflow: hidden;
  padding: 1.5rem;
`;

export const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme?.colors?.border || '#e2e8f0'};
  font-weight: ${(p) => p.theme?.typography?.fontWeights?.semibold || '600'};
  font-size: ${(p) => p.theme?.typography?.fontSizes?.s2 || '1.125rem'};
  color: ${(p) => p.theme?.colors?.text || '#1e293b'};
`;

export const CardBody = styled.div`
  padding: 1.5rem;
  color: ${(p) => p.theme?.colors?.text || '#1e293b'};
  font-size: ${(p) => p.theme?.typography?.fontSizes?.s1 || '1rem'};
  line-height: ${(p) => p.theme?.typography?.lineHeights?.relaxed || '1.6'};
`;

export const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${(p) => p.theme?.colors?.border || '#e2e8f0'};
  background: ${(p) => p.theme?.colors?.background || '#ffffff'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// Default export for CardRoot as Card
const Card = CardRoot;
export default Card;
