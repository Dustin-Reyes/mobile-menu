import {
  ShieldCheck,
  KeyRound,
  Ban,
  CircleCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import styled from '@emotion/styled';
import { SwitchRoot, SwitchThumb } from 'components/ui/Switch';

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

/* ── Desktop layout ───────────────────────────────────────── */

const DesktopLayout = styled.div`
  @media (max-width: 768px) {
    display: none;
  }

  @media (min-width: 769px) {
    flex: 1;
  }
`;

const DesktopSection = styled.div`
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ActionRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const DestructiveActionRow = styled(ActionRow)`
  margin-top: 4px;

  &:hover {
    background: rgba(239, 68, 68, 0.07);
  }
`;

const DesktopDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 4px 12px;
`;

/* ── Mobile layout ────────────────────────────────────────── */

const MobileLayout = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileSection = styled.div`
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SectionLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  padding: 2px 2px 4px;
`;

const ActionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${(p) => p.theme.borderRadius.s1};
`;

const MobileDestructiveCard = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition:
    background ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.32);
  }
`;

const SendLinkButton = styled.button`
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.65);
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const CompactSwitch = styled(SwitchRoot)`
  width: 46px;
  height: 26px;

  &[data-state='checked'] {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.55);
  }
`;

const CompactSwitchThumb = styled(SwitchThumb)`
  width: 18px;
  height: 18px;

  &[data-state='checked'] {
    transform: translateX(20px);
    background: #4ade80;
  }
`;

export default function UserActionsSection({
  targetUser,
  onEditRole,
  onResetPassword,
  onToggleDisabled,
  onDelete,
}) {
  const isActive = !targetUser.disabled;
  const hasPassword = targetUser.providers?.includes('password');

  return (
    <>
      {/* Desktop: flat chevron rows */}
      <DesktopLayout>
        <DesktopSection>
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

          {hasPassword && (
            <ActionRow onClick={onResetPassword}>
              <ActionIconWrap>
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
            <ActionIconWrap $variant={isActive ? 'warning' : 'success'}>
              {isActive ? <Ban size={16} /> : <CircleCheck size={16} />}
            </ActionIconWrap>
            <ActionText>
              <ActionTitle>
                {isActive ? 'Disable Account' : 'Enable Account'}
              </ActionTitle>
              <ActionSubtitle>
                {isActive
                  ? "Temporarily disable this user's account."
                  : "Restore access to this user's account."}
              </ActionSubtitle>
            </ActionText>
            <ActionChevron>
              <ChevronRight size={16} />
            </ActionChevron>
          </ActionRow>

          <DesktopDivider />
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
        </DesktopSection>
      </DesktopLayout>

      {/* Mobile: section labels + Send Link button + Account Status toggle */}
      <MobileLayout>
        {hasPassword && (
          <MobileSection>
            <SectionLabel>Security</SectionLabel>
            <ActionCard>
              <ActionIconWrap>
                <KeyRound size={16} />
              </ActionIconWrap>
              <ActionText>
                <ActionTitle>Reset Password</ActionTitle>
                <ActionSubtitle>Send reset link to user</ActionSubtitle>
              </ActionText>
              <SendLinkButton type="button" onClick={onResetPassword}>
                Send Link
              </SendLinkButton>
            </ActionCard>
          </MobileSection>
        )}

        <MobileSection>
          <SectionLabel>Account</SectionLabel>
          <ActionCard>
            <ActionIconWrap $variant={isActive ? 'success' : 'warning'}>
              {isActive ? <Ban size={16} /> : <CircleCheck size={16} />}
            </ActionIconWrap>
            <ActionText>
              <ActionTitle>Account Status</ActionTitle>
              <ActionSubtitle>
                {isActive ? 'Account is active' : 'Account is disabled'}
              </ActionSubtitle>
            </ActionText>
            <CompactSwitch
              checked={isActive}
              onCheckedChange={() => onToggleDisabled()}
            >
              <CompactSwitchThumb />
            </CompactSwitch>
          </ActionCard>

          <MobileDestructiveCard onClick={onDelete}>
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
          </MobileDestructiveCard>
        </MobileSection>
      </MobileLayout>
    </>
  );
}
