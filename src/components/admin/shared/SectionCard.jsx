/**
 * Styled card components for grouping related content within admin sections.
 * @module components/admin/shared/SectionCard
 */

import styled from '@emotion/styled';

export const SectionCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
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
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
`;
