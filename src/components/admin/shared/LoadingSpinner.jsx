/**
 * Styled spinning indicator for loading states across the admin panel.
 * @module components/admin/shared/LoadingSpinner
 */

import styled from '@emotion/styled';

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-top: 2px solid ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
