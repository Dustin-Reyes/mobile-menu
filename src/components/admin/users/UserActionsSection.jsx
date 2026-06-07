import { KeyRound, Ban, CircleCheck, Trash2, ChevronRight } from 'lucide-react';
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
    if (p.$variant === 'warning') return `${p.theme.colors.warning}1f`;
    if (p.$variant === 'success') return `${p.theme.colors.success}1f`;
    if (p.$variant === 'danger') return `${p.theme.colors.error}1f`;
    return p.theme.colors.secondaryBackground;
  }};
  color: ${(p) => {
    if (p.$variant === 'primary') return p.theme.colors.primary;
    if (p.$variant === 'warning') return p.theme.colors.warning;
    if (p.$variant === 'success') return p.theme.colors.success;
    if (p.$variant === 'danger') return p.theme.colors.error;
    return p.theme.colors.textSecondary;
  }};
`;

const ActionText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActionTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => (p.$danger ? p.theme.colors.error : p.theme.colors.text)};
  line-height: 1.2;
`;

const ActionSubtitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) =>
    p.$danger ? p.theme.colors.error : p.theme.colors.textMuted};
  margin-top: 3px;
`;

/* ── Desktop layout ───────────────────────────────────────── */

const DesktopLayout = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const DesktopActionBar = styled.div`
  display: flex;
  align-items: stretch;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const BarItem = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 12px;
  background: transparent;
  border: none;
  border-right: 1px solid ${(p) => p.theme.colors.border};
  cursor: pointer;
  font-family: inherit;
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  transition:
    background ${(p) => p.theme.transitions.fast},
    color ${(p) => p.theme.transitions.fast};

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${(p) => p.theme.colors.secondaryBackground};
    color: ${(p) => p.theme.colors.text};
  }
`;

const DestructiveBarItem = styled(BarItem)`
  color: ${(p) => p.theme.colors.error};

  &:hover {
    background: ${(p) => `${p.theme.colors.error}0f`};
    color: ${(p) => p.theme.colors.error};
  }
`;

const BarToggleItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 12px;
  border-right: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
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
  border-top: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SectionLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
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
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
`;

const MobileDestructiveCard = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: ${(p) => `${p.theme.colors.error}0a`};
  border: 1px solid ${(p) => `${p.theme.colors.error}33`};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition:
    background ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => `${p.theme.colors.error}14`};
    border-color: ${(p) => `${p.theme.colors.error}52`};
  }
`;

const SendLinkButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${(p) => p.theme.colors.secondaryBorder};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.secondaryBackground};
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => p.theme.colors.secondaryBackground};
    color: ${(p) => p.theme.colors.text};
    border-color: ${(p) => p.theme.colors.secondaryBorder};
  }
`;

const CompactSwitch = styled(SwitchRoot)`
  width: 46px;
  height: 26px;

  &[data-state='checked'] {
    background: ${(p) => `${p.theme.colors.success}26`};
    border-color: ${(p) => `${p.theme.colors.success}8c`};
  }
`;

const CompactSwitchThumb = styled(SwitchThumb)`
  width: 18px;
  height: 18px;

  &[data-state='checked'] {
    transform: translateX(20px);
    background: ${(p) => p.theme.colors.success};
  }
`;

const ChevronIconSpan = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
  flex-shrink: 0;
`;

export default function UserActionsSection({
  targetUser,
  onResetPassword,
  onToggleDisabled,
  onDelete,
}) {
  const isActive = !targetUser.disabled;
  const hasPassword = targetUser.providers?.includes('password');

  return (
    <>
      {/* Desktop: horizontal action bar */}
      <DesktopLayout>
        <DesktopActionBar>
          {hasPassword && (
            <BarItem onClick={onResetPassword}>
              <KeyRound size={15} />
              Reset Password
            </BarItem>
          )}
          <BarToggleItem>
            {isActive ? <Ban size={15} /> : <CircleCheck size={15} />}
            {isActive ? 'Disable Account' : 'Enable Account'}
            <CompactSwitch
              checked={isActive}
              onCheckedChange={() => onToggleDisabled()}
            >
              <CompactSwitchThumb />
            </CompactSwitch>
          </BarToggleItem>
          <DestructiveBarItem onClick={onDelete}>
            <Trash2 size={15} />
            Delete User
          </DestructiveBarItem>
        </DesktopActionBar>
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
            <ChevronIconSpan>
              <ChevronRight size={16} />
            </ChevronIconSpan>
          </MobileDestructiveCard>
        </MobileSection>
      </MobileLayout>
    </>
  );
}
