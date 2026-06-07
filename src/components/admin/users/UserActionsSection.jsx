import {
  ShieldCheck,
  KeyRound,
  Ban,
  CircleCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import styled from '@emotion/styled';

const DetailSection = styled.div`
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActionRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition:
    background ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const DestructiveActionRow = styled(ActionRow)`
  border-color: rgba(239, 68, 68, 0.15);
  background: rgba(239, 68, 68, 0.03);

  &:hover {
    background: rgba(239, 68, 68, 0.07);
    border-color: rgba(239, 68, 68, 0.28);
  }
`;

const ActionIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(p) => {
    if (p.$variant === 'primary') return `${p.theme.colors.primary}20`;
    if (p.$variant === 'warning') return 'rgba(245,158,11,0.12)';
    if (p.$variant === 'success') return 'rgba(34,197,94,0.12)';
    if (p.$variant === 'danger') return 'rgba(239,68,68,0.12)';
    return 'rgba(255,255,255,0.06)';
  }};
  color: ${(p) => {
    if (p.$variant === 'primary') return p.theme.colors.primary;
    if (p.$variant === 'warning') return '#fbbf24';
    if (p.$variant === 'success') return '#4ade80';
    if (p.$variant === 'danger') return '#f87171';
    return 'rgba(255,255,255,0.5)';
  }};
`;

const ActionText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActionTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => (p.$danger ? '#f87171' : p.theme.colors.text)};
  line-height: 1.2;
`;

const ActionSubtitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) =>
    p.$danger ? 'rgba(248,113,113,0.65)' : 'rgba(255,255,255,0.35)'};
  margin-top: 3px;
`;

const ActionChevron = styled.div`
  color: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  display: flex;
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
      <ActionRow onClick={onEditRole}>
        <ActionIconWrap $variant="primary">
          <ShieldCheck size={16} />
        </ActionIconWrap>
        <ActionText>
          <ActionTitle>Edit Role</ActionTitle>
          <ActionSubtitle>
            Update this user&apos;s role and permissions.
          </ActionSubtitle>
        </ActionText>
        <ActionChevron>
          <ChevronRight size={16} />
        </ActionChevron>
      </ActionRow>

      {targetUser.providers?.includes('password') && (
        <ActionRow onClick={onResetPassword}>
          <ActionIconWrap $variant="default">
            <KeyRound size={16} />
          </ActionIconWrap>
          <ActionText>
            <ActionTitle>Reset Password</ActionTitle>
            <ActionSubtitle>
              Send a password reset link to this user.
            </ActionSubtitle>
          </ActionText>
          <ActionChevron>
            <ChevronRight size={16} />
          </ActionChevron>
        </ActionRow>
      )}

      <ActionRow onClick={onToggleDisabled}>
        <ActionIconWrap $variant={targetUser.disabled ? 'success' : 'warning'}>
          {targetUser.disabled ? <CircleCheck size={16} /> : <Ban size={16} />}
        </ActionIconWrap>
        <ActionText>
          <ActionTitle>
            {targetUser.disabled ? 'Enable Account' : 'Disable Account'}
          </ActionTitle>
          <ActionSubtitle>
            {targetUser.disabled
              ? "Restore access to this user's account."
              : "Temporarily disable this user's account."}
          </ActionSubtitle>
        </ActionText>
        <ActionChevron>
          <ChevronRight size={16} />
        </ActionChevron>
      </ActionRow>

      <DestructiveActionRow onClick={onDelete}>
        <ActionIconWrap $variant="danger">
          <Trash2 size={16} />
        </ActionIconWrap>
        <ActionText>
          <ActionTitle $danger>Delete User</ActionTitle>
          <ActionSubtitle $danger>
            Permanently delete this user and all data.
          </ActionSubtitle>
        </ActionText>
        <ActionChevron>
          <ChevronRight size={16} />
        </ActionChevron>
      </DestructiveActionRow>
    </DetailSection>
  );
}
