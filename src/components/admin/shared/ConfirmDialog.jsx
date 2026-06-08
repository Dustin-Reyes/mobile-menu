/**
 * Reusable confirmation dialog built on Radix UI Dialog, with optional destructive styling.
 * Adapts to a bottom sheet on mobile.
 * @module components/admin/shared/ConfirmDialog
 */

import styled from '@emotion/styled';
import * as RadixDialog from '@radix-ui/react-dialog';
import Button from 'components/ui/Button';
import { DialogRoot, DialogPortal, DialogOverlay } from 'components/ui/Dialog';

const SheetContent = styled(RadixDialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s3};
  padding: 28px 28px 24px;
  width: 90%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: ${(p) => p.theme.zIndex.modal};
  outline: none;

  @keyframes dialogIn {
    from {
      opacity: 0;
      transform: translate(-50%, -47%) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  animation: dialogIn 0.18s ease;

  @media (max-width: 768px) {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    transform: none;
    border-radius: 20px 20px 0 0;
    border-bottom: none;
    padding: 24px 20px 40px;

    @keyframes sheetIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    animation: sheetIn 0.22s ease;
  }
`;

const Title = styled(RadixDialog.Title)`
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

const Description = styled(RadixDialog.Description)`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textMuted};
  margin: 0;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    margin-top: 12px;

    & > * {
      width: 100%;
      justify-content: center;
    }
  }
`;

const DestructiveButton = styled(Button)`
  background: ${(p) => p.theme.colors.error};
  border-color: ${(p) => p.theme.colors.error};
  color: ${(p) => p.theme.colors.text};

  &:hover:not(:disabled) {
    opacity: 0.88;
  }
`;

/**
 * Modal confirmation dialog with customizable title, description, and action labels.
 * @param {Object} props
 * @param {boolean} props.open - Controls whether the dialog is visible.
 * @param {function} props.onOpenChange - Callback invoked when the open state changes.
 * @param {string} [props.title='Are you sure?'] - Dialog heading text.
 * @param {string} [props.description] - Optional body text describing the action.
 * @param {string} [props.confirmLabel='Confirm'] - Label for the confirm button.
 * @param {string} [props.cancelLabel='Cancel'] - Label for the cancel button.
 * @param {boolean} [props.destructive=false] - When true, styles the confirm button as destructive.
 * @param {function} [props.onConfirm] - Callback invoked when the confirm button is clicked.
 * @returns {JSX.Element}
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  const ConfirmButton = destructive ? DestructiveButton : Button;

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <SheetContent>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
          <Actions>
            <Button variant="secondary" onClick={() => onOpenChange?.(false)}>
              {cancelLabel}
            </Button>
            <ConfirmButton onClick={handleConfirm}>
              {confirmLabel}
            </ConfirmButton>
          </Actions>
        </SheetContent>
      </DialogPortal>
    </DialogRoot>
  );
}
