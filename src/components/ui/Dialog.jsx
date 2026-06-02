import React from 'react';
import styled from '@emotion/styled';
import * as RadixDialog from '@radix-ui/react-dialog';

export const DialogRoot = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogPortal = RadixDialog.Portal;
export const DialogClose = RadixDialog.Close;

export const DialogOverlay = styled(RadixDialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: ${(p) => p.theme.zIndex.modal};

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  animation: overlayShow 0.15s ease;
`;

const StyledDialogContent = styled(RadixDialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(p) => p.theme.colors.surface};
  border-radius: ${(p) => p.theme.borderRadius.s3};
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: ${(p) => p.theme.shadows.s3};
  z-index: ${(p) => p.theme.zIndex.modal};

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  animation: contentShow 0.15s ease;

  &:focus {
    outline: none;
  }
`;

export const DialogContent = React.forwardRef(({ children, ...props }, ref) => (
  <StyledDialogContent ref={ref} aria-modal="true" {...props}>
    {children}
  </StyledDialogContent>
));
DialogContent.displayName = 'DialogContent';

export const DialogTitle = styled(RadixDialog.Title)`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

export const DialogDescription = styled(RadixDialog.Description)`
  color: ${(p) => p.theme.colors.textSecondary};
  margin: 0;
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;
