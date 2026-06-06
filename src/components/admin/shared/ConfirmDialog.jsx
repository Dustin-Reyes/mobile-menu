import styled from '@emotion/styled';
import Button from 'components/ui/Button';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from 'components/ui/Dialog';

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const DestructiveButton = styled(Button)`
  background: ${(p) => p.theme.colors.error};
  border-color: ${(p) => p.theme.colors.error};
  color: #fff;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.error};
    opacity: 0.9;
  }
`;

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
        <DialogContent>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          <Actions>
            <Button variant="secondary" onClick={() => onOpenChange?.(false)}>
              {cancelLabel}
            </Button>
            <ConfirmButton onClick={handleConfirm}>
              {confirmLabel}
            </ConfirmButton>
          </Actions>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
