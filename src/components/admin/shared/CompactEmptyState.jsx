/**
 * Styled components for a compact empty-state placeholder with an optional icon.
 * @module components/admin/shared/CompactEmptyState
 */

import styled from '@emotion/styled';

export const CompactEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 5px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

export const CompactEmptyIcon = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  margin-bottom: 2px;
`;
