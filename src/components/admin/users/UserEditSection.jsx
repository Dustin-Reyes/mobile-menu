import { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from 'context/AuthContext';
import { toast } from '@/utils/toast';
import { ROLE_LABELS, ROLES, getAssignableRoles } from 'utils/roleHelpers';
import { callUserManagement } from 'utils/admin/userHelpers';
import Button from 'components/ui/Button';

const EditForm = styled.form`
  padding: 20px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 10px 12px;
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

const FieldSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.background};
  font-family: inherit;
  outline: none;
  cursor: pointer;
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
  padding-top: 4px;
`;

export default function UserEditSection({
  targetUser,
  callerRole,
  onCancel,
  onSaved,
}) {
  const { user, refreshUserRole } = useAuth();
  const [displayName, setDisplayName] = useState(targetUser.displayName ?? '');
  const [role, setRole] = useState(targetUser.role ?? ROLES.CONTENT_MANAGER);
  const [saving, setSaving] = useState(false);

  const assignable = getAssignableRoles(callerRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const nameChanged = displayName.trim() !== (targetUser.displayName ?? '');
      const roleChanged = role !== targetUser.role;

      const tasks = [];
      if (nameChanged) {
        tasks.push(
          callUserManagement('update-profile', user, {
            uid: targetUser.uid,
            displayName: displayName.trim() || null,
          }),
        );
      }
      if (roleChanged) {
        tasks.push(
          callUserManagement('update-role', user, {
            uid: targetUser.uid,
            role,
          }),
        );
      }

      if (tasks.length > 0) {
        await Promise.all(tasks);
        if (roleChanged && targetUser.uid === user.uid) await refreshUserRole();
        toast.success('Profile updated');
        onSaved();
      } else {
        onCancel();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditForm onSubmit={handleSubmit}>
      <FieldGroup>
        <FieldLabel htmlFor="edit-display-name">Display Name</FieldLabel>
        <FieldInput
          id="edit-display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
          autoFocus
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="edit-role">Role</FieldLabel>
        <FieldSelect
          id="edit-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {assignable.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </FieldSelect>
      </FieldGroup>

      <FormActions>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </FormActions>
    </EditForm>
  );
}
