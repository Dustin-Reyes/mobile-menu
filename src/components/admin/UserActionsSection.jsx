import { ShieldCheck, KeyRound, Ban, CircleCheck, Trash2 } from 'lucide-react';
import {
  DetailSection,
  ActionButtonGrid,
  ActionButton,
  DestructiveButton,
} from './UserDetail.styles';

export default function UserActionsSection({
  targetUser,
  onEditRole,
  onResetPassword,
  onToggleDisabled,
  onDelete,
}) {
  return (
    <DetailSection>
      <ActionButtonGrid>
        <ActionButton onClick={onEditRole}>
          <ShieldCheck size={13} />
          Edit Role
        </ActionButton>
        {targetUser.providers?.includes('password') && (
          <ActionButton onClick={onResetPassword}>
            <KeyRound size={13} />
            Reset Password
          </ActionButton>
        )}
        <ActionButton onClick={onToggleDisabled}>
          {targetUser.disabled ? (
            <>
              <CircleCheck size={13} />
              Enable Account
            </>
          ) : (
            <>
              <Ban size={13} />
              Disable Account
            </>
          )}
        </ActionButton>
        <DestructiveButton onClick={onDelete}>
          <Trash2 size={13} />
          Delete User
        </DestructiveButton>
      </ActionButtonGrid>
    </DetailSection>
  );
}
