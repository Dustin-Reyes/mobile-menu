import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { toast } from '@/utils/toast';
import { canManageUsers } from 'utils/roleHelpers';
import { callUserManagement } from 'utils/admin/userHelpers';
import ConfirmDialog from '../shared/ConfirmDialog';
import EditRoleModal from './EditRoleModal';
import { SectionCard } from '../shared/SectionCard';
import UserProfileHeader from './UserProfileHeader';
import UserInfoSection from './UserInfoSection';
import UserActionsSection from './UserActionsSection';

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
  margin-bottom: 12px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  transition: color ${(p) => p.theme.transitions.fast};

  &:hover {
    color: rgba(255, 255, 255, 0.75);
  }

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

// ─── Motion ───────────────────────────────────────────────────────────────────

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

// ─── Component ───────────────────────────────────────────────────────────────────

export default function UserDetail({
  targetUser,
  callerRole,
  onBack,
  onUpdated,
  onDeleted,
}) {
  const { user } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(targetUser.displayName ?? '');
  const [savingName, setSavingName] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);

  const canEdit = canManageUsers(callerRole);

  const handleSaveName = useCallback(
    async (e) => {
      e.preventDefault();
      setSavingName(true);
      try {
        await callUserManagement('update-profile', user, {
          uid: targetUser.uid,
          displayName: displayName.trim() || null,
        });
        toast.success('Display name updated');
        setEditingName(false);
        onUpdated();
      } catch (err) {
        toast.error(err.message || 'Failed to update display name');
      } finally {
        setSavingName(false);
      }
    },
    [user, targetUser.uid, displayName, onUpdated],
  );

  const handleCancelEdit = useCallback(() => {
    setDisplayName(targetUser.displayName ?? '');
    setEditingName(false);
  }, [targetUser.displayName]);

  const handleToggleDisabled = useCallback(async () => {
    try {
      const action = targetUser.disabled ? 'enable' : 'disable';
      await callUserManagement(action, user, { uid: targetUser.uid });
      toast.success(
        targetUser.disabled ? 'Account enabled' : 'Account disabled',
      );
      onUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to update account status');
    }
  }, [targetUser.disabled, user, targetUser.uid, onUpdated]);

  const confirmDelete = useCallback(async () => {
    try {
      await callUserManagement('delete', user, { uid: targetUser.uid });
      toast.success('User deleted');
      onDeleted();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  }, [user, targetUser.uid, onDeleted]);

  const confirmResetPassword = useCallback(async () => {
    try {
      await callUserManagement('reset-password', user, {
        email: targetUser.email,
      });
      toast.success('Password reset email sent');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    }
  }, [user, targetUser.email]);

  const handleCopyUid = useCallback(() => {
    navigator.clipboard.writeText(targetUser.uid).then(() => {
      toast.success('User ID copied');
    });
  }, [targetUser.uid]);

  const handleEditName = useCallback(() => {
    setEditingName(true);
  }, []);

  const handleDisplayNameChange = useCallback((e) => {
    setDisplayName(e.target.value);
  }, []);

  return (
    <motion.div key="detail" {...motionProps}>
      <BackButton onClick={onBack}>
        <ChevronLeft size={15} />
        All Users
      </BackButton>

      <SectionCard style={{ padding: 0 }}>
        <UserProfileHeader
          targetUser={targetUser}
          canEdit={canEdit}
          editingName={editingName}
          displayName={displayName}
          savingName={savingName}
          onEditName={handleEditName}
          onSaveName={handleSaveName}
          onCancelEdit={handleCancelEdit}
          onDisplayNameChange={handleDisplayNameChange}
        />

        <UserInfoSection targetUser={targetUser} onCopyUid={handleCopyUid} />

        {canEdit && (
          <UserActionsSection
            targetUser={targetUser}
            onEditRole={() => setShowEditRole(true)}
            onResetPassword={() => setResetDialog(true)}
            onToggleDisabled={handleToggleDisabled}
            onDelete={() => setDeleteDialog(true)}
          />
        )}
      </SectionCard>

      <EditRoleModal
        open={showEditRole}
        onOpenChange={setShowEditRole}
        targetUser={targetUser}
        onUpdated={onUpdated}
        callerRole={callerRole}
      />

      <ConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete User"
        description={`Permanently delete ${targetUser.email}? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={resetDialog}
        onOpenChange={setResetDialog}
        title="Reset Password"
        description={`Send a password reset email to ${targetUser.email}?`}
        confirmLabel="Send Email"
        onConfirm={confirmResetPassword}
      />
    </motion.div>
  );
}
