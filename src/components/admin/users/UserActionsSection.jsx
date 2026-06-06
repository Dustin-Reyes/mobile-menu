import { ShieldCheck, KeyRound, Ban, CircleCheck, Trash2 } from 'lucide-react';
import styled from '@emotion/styled';

const DetailSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const ActionButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  color: ${(p) => p.theme.colors.text};
  transition:
    background ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const DestructiveButton = styled(ActionButton)`
  margin-left: auto;
  color: #f87171;
  background: rgba(239, 68, 68, 0.06);
  border-color: rgba(239, 68, 68, 0.22);

  &:hover {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.4);
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

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
