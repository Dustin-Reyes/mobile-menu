/**
 * @module components/admin/users/UserDetail
 * @description Detailed view for a single user record. Combines the profile
 * header, action bar, and inline edit form; handles enable/disable, password
 * reset, and deletion with confirmation dialogs.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { toast } from '@/utils/toast';
import { canManageUsers, canActOnUser } from 'utils/roleHelpers';
import { callUserManagement } from 'utils/admin/userHelpers';
import ConfirmDialog from '../shared/ConfirmDialog';
import { SectionCard } from '../shared/SectionCard';
import UserProfileHeader from './UserProfileHeader';
import UserActionsSection from './UserActionsSection';
import UserEditSection from './UserEditSection';
import globalErrorHandler from 'utils/errorHandler';

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
  margin-bottom: 12px;
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  transition: color ${(p) => p.theme.transitions.fast};

  &:hover {
    color: ${(p) => p.theme.colors.text};
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

/**
 * @param {Object} props
 * @param {Object} props.targetUser - The user object being viewed.
 * @param {string} props.callerRole - Role of the currently authenticated admin.
 * @param {function} props.onBack - Callback invoked to return to the user list.
 * @param {function} props.onUpdated - Callback invoked after any mutation to refresh data.
 * @param {function} props.onDeleted - Callback invoked after the user is deleted.
 * @returns {JSX.Element}
 */
export default function UserDetail({
  targetUser,
  callerRole,
  onBack,
  onUpdated,
  onDeleted,
}) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);

  const canEdit =
    canManageUsers(callerRole) && canActOnUser(callerRole, targetUser.role);

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
      globalErrorHandler.reportError(err, {
        action: 'toggle-disabled',
        uid: targetUser.uid,
      });
    }
  }, [targetUser.disabled, user, targetUser.uid, onUpdated]);

  const confirmDelete = useCallback(async () => {
    try {
      await callUserManagement('delete', user, { uid: targetUser.uid });
      toast.success('User deleted');
      onDeleted();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
      globalErrorHandler.reportError(err, {
        action: 'delete-user',
        uid: targetUser.uid,
      });
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
      globalErrorHandler.reportError(err, {
        action: 'reset-password',
        uid: targetUser.uid,
      });
    }
  }, [user, targetUser.email, targetUser.uid]);

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
          editing={editing}
          onEdit={() => setEditing(true)}
        />

        {editing ? (
          <UserEditSection
            targetUser={targetUser}
            callerRole={callerRole}
            onCancel={() => setEditing(false)}
            onSaved={() => {
              setEditing(false);
              onUpdated();
            }}
          />
        ) : (
          <>
            {canEdit && (
              <UserActionsSection
                targetUser={targetUser}
                onResetPassword={() => setResetDialog(true)}
                onToggleDisabled={handleToggleDisabled}
                onDelete={() => setDeleteDialog(true)}
              />
            )}
          </>
        )}
      </SectionCard>

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
        description={`Send a password reset link to ${targetUser.email}?`}
        confirmLabel="Send Link"
        onConfirm={confirmResetPassword}
      />
    </motion.div>
  );
}
