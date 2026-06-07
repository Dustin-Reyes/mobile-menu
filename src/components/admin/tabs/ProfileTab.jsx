import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { ShieldCheck, LogOut, Pencil, KeyRound } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from 'utils/roleHelpers';
import { getUserInitials, getUserDisplayName } from 'utils/userHelpers';
import { callUserManagement } from 'utils/admin/userHelpers';
import { toast } from '@/utils/toast';
import Button from 'components/ui/Button';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import { SectionCard } from '../shared/SectionCard';
import ConfirmDialog from '../shared/ConfirmDialog';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary}30;
  color: ${(p) => p.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  flex-shrink: 0;
`;

const ProfileDetails = styled.div`
  min-width: 0;
  flex: 1;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ProfileName = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 2px;
`;

const ProfileEmail = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  background: ${(p) => p.theme.colors.primary}18;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}30;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const NoRoleBadge = styled(RoleBadge)`
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.08);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: 0 0 12px;
`;

const EditRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
`;

const EditRowLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  margin-bottom: 2px;
`;

const EditRowValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.text};
`;

const EditRowMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.background};
  font-family: inherit;
  outline: none;
  transition: border-color ${(p) => p.theme.transitions.fast};

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}18;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const EditIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: #f59e0b;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(245, 158, 11, 0.15);
    border-color: rgba(245, 158, 11, 0.65);
    color: #fbbf24;
  }
`;

const SecurityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
`;

const SecurityLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.55);
`;

const SendLinkButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: rgba(255, 255, 255, 0.55);
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.28);
    color: rgba(255, 255, 255, 0.85);
  }
`;

const SignOutButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: #f87171;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export default function ProfileTab() {
  const { user, userRole, logout, reloadUser } = useAuth();
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);

  const hasPassword = user?.providerData?.some(
    (p) => p.providerId === 'password',
  );

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const handleStartEdit = () => {
    setNameValue(user?.displayName ?? '');
    setEditingName(true);
  };

  const handleSaveName = useCallback(
    async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        await callUserManagement('update-profile', user, {
          uid: user.uid,
          displayName: nameValue.trim() || null,
        });
        await reloadUser();
        toast.success('Display name updated');
        setEditingName(false);
      } catch (err) {
        toast.error(err.message || 'Failed to update name');
      } finally {
        setSaving(false);
      }
    },
    [user, nameValue, reloadUser],
  );

  const handleResetPassword = useCallback(async () => {
    try {
      await callUserManagement('reset-password', user, { email: user.email });
      toast.success('Password reset email sent');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    }
  }, [user]);

  const initials = getUserInitials(user?.email);
  const displayName = user?.displayName || getUserDisplayName(user?.email);
  const roleLabel = userRole ? ROLE_LABELS[userRole] : null;

  return (
    <motion.div key="profile" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Profile</PageTitle>
          <PageSubtitle>Your account information</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <ProfileCard>
          <Avatar>{initials}</Avatar>
          <ProfileDetails>
            <ProfileName>{displayName}</ProfileName>
            <ProfileEmail>{user?.email}</ProfileEmail>
            {roleLabel ? (
              <RoleBadge>
                <ShieldCheck size={11} />
                {roleLabel}
              </RoleBadge>
            ) : (
              <NoRoleBadge>No role assigned</NoRoleBadge>
            )}
          </ProfileDetails>
        </ProfileCard>

        <Divider />

        {editingName ? (
          <form onSubmit={handleSaveName}>
            <FieldInput
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder="Display name"
              autoFocus
              disabled={saving}
            />
            <FormActions>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingName(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </FormActions>
          </form>
        ) : (
          <EditRow>
            <EditRowMeta>
              <EditRowLabel>Display name</EditRowLabel>
              <EditRowValue>
                {user?.displayName || (
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.25)',
                      fontStyle: 'italic',
                    }}
                  >
                    Not set
                  </span>
                )}
              </EditRowValue>
            </EditRowMeta>
            <EditIconButton type="button" onClick={handleStartEdit}>
              <Pencil size={11} />
              Edit
            </EditIconButton>
          </EditRow>
        )}

        {hasPassword && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <SecurityRow>
              <SecurityLabel>
                <KeyRound size={14} />
                Password
              </SecurityLabel>
              <SendLinkButton
                type="button"
                onClick={() => setResetDialog(true)}
              >
                Send Reset Link
              </SendLinkButton>
            </SecurityRow>
          </>
        )}

        <Divider style={{ margin: '12px 0' }} />

        <SignOutButton onClick={handleSignOut}>
          <LogOut size={14} />
          Sign out
        </SignOutButton>
      </SectionCard>

      <ConfirmDialog
        open={resetDialog}
        onOpenChange={setResetDialog}
        title="Reset Password"
        description={`Send a password reset link to ${user?.email}?`}
        confirmLabel="Send Link"
        onConfirm={handleResetPassword}
      />
    </motion.div>
  );
}
