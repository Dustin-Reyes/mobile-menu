/**
 * Modal dialog components built on Radix UI Dialog with themed styling.
 * @module components/ui/Dialog
 */
import React from 'react';
import styled from '@emotion/styled';
import * as RadixDialog from '@radix-ui/react-dialog';

/** Radix Dialog.Root — manages open state. Pass `open` and `onOpenChange` to control it. */
export const DialogRoot = RadixDialog.Root;
/** Radix Dialog.Trigger — the element that opens the dialog when activated. */
export const DialogTrigger = RadixDialog.Trigger;
/** Radix Dialog.Portal — renders overlay and content outside the DOM hierarchy. */
export const DialogPortal = RadixDialog.Portal;
/** Radix Dialog.Close — button that closes the dialog when activated. */
export const DialogClose = RadixDialog.Close;

/** Full-screen dimmed backdrop rendered behind the dialog content. */
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

/**
 * Centered modal panel. Wraps Radix Dialog.Content with themed styling and aria-modal.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const DialogContent = React.forwardRef(({ children, ...props }, ref) => (
  <StyledDialogContent ref={ref} aria-modal="true" {...props}>
    {children}
  </StyledDialogContent>
));
DialogContent.displayName = 'DialogContent';

/** Bold dialog heading; required by Radix for accessibility. */
export const DialogTitle = styled(RadixDialog.Title)`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

/** Secondary description text beneath the dialog title. */
export const DialogDescription = styled(RadixDialog.Description)`
  color: ${(p) => p.theme.colors.textSecondary};
  margin: 0;
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;
