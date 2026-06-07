import styled from '@emotion/styled';

export const CompactEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 5px;
  color: rgba(255, 255, 255, 0.25);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

export const CompactEmptyIcon = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s7};
  margin-bottom: 2px;
`;
