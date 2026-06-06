import styled from '@emotion/styled';

export const SectionCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 16px;
  margin-bottom: 12px;
`;

export const FlushSectionCard = styled(SectionCard)`
  padding: 0;
  overflow: hidden;
`;

export const SectionCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: rgba(255, 255, 255, 0.7);
`;
