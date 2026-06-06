import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAuth } from 'context/AuthContext';
import { toast } from '@/utils/toast';
import { ROLE_LABELS, ROLES, getAssignableRoles } from 'utils/roleHelpers';
import { callUserManagement } from 'utils/admin/userHelpers';
import Button from 'components/ui/Button';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from 'components/ui/Dialog';

// ─── Styled Components ───────────────────────────────────────────────────────────

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FormLabel = styled.label`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.65rem 1rem;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.background};
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color ${(p) => p.theme.transitions.fast};

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}20;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const EmailDescription = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
`;

// ─── Component ───────────────────────────────────────────────────────────────────

export default function EditRoleModal({
  open,
  onOpenChange,
  targetUser,
  onUpdated,
  callerRole,
}) {
  const { user, refreshUserRole } = useAuth();
  const [role, setRole] = useState(targetUser?.role ?? ROLES.CONTENT_MANAGER);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (targetUser) setRole(targetUser.role ?? ROLES.CONTENT_MANAGER);
  }, [targetUser]);

  const assignable = getAssignableRoles(callerRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await callUserManagement('update-role', user, {
        uid: targetUser.uid,
        role,
      });
      if (targetUser.uid === user.uid) await refreshUserRole();
      toast.success('Role updated');
      onUpdated();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Edit Role</DialogTitle>
          {targetUser && (
            <EmailDescription>{targetUser.email}</EmailDescription>
          )}
          <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="edit-role">Role</FormLabel>
              <FormSelect
                id="edit-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {assignable.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
            <ModalActions>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save Role'}
              </Button>
            </ModalActions>
          </FormContainer>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
