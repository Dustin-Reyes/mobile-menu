import { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from 'context/AuthContext';
import { toast } from '@/utils/toast';
import { ROLE_LABELS, ROLES, getAssignableRoles } from 'utils/roleHelpers';
import { getPasswordStrength } from 'utils/passwordStrength';
import { callUserManagement } from 'utils/admin/userHelpers';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
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

const PasswordStrengthBar = styled.div`
  height: 3px;
  border-radius: 9999px;
  background: ${(p) =>
    p.$strength === 'strong'
      ? '#4ade80'
      : p.$strength === 'medium'
        ? '#fbbf24'
        : 'rgba(255,255,255,0.1)'};
  width: ${(p) =>
    p.$strength === 'strong'
      ? '100%'
      : p.$strength === 'medium'
        ? '60%'
        : p.$hasInput
          ? '25%'
          : '0%'};
  transition: all 0.2s;
`;

const PasswordStrengthLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) =>
    p.$strength === 'strong'
      ? '#4ade80'
      : p.$strength === 'medium'
        ? '#fbbf24'
        : 'rgba(255,255,255,0.25)'};
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  user-select: none;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const WideDialogContent = styled(DialogContent)`
  max-width: 440px;

  @media (max-width: 768px) {
    max-width: 90vw;
    margin: 16px;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const OptionalLabel = styled.span`
  color: rgba(255, 255, 255, 0.2);
  font-weight: normal;
`;

const PasswordStrengthContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

// ─── Component ───────────────────────────────────────────────────────────────────

export default function CreateUserModal({
  open,
  onOpenChange,
  onCreated,
  callerRole,
}) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    email: '',
    displayName: '',
    password: '',
    role: ROLES.CONTENT_MANAGER,
    sendWelcomeEmail: true,
  });
  const [saving, setSaving] = useState(false);

  const assignable = getAssignableRoles(callerRole);
  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await callUserManagement('create', user, form);
      toast.success(`User ${form.email} created`);
      onCreated();
      onOpenChange(false);
      setForm({
        email: '',
        displayName: '',
        password: '',
        role: ROLES.CONTENT_MANAGER,
        sendWelcomeEmail: true,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <WideDialogContent>
          <DialogTitle>Add User</DialogTitle>
          <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="new-email">Email</FormLabel>
              <Input
                id="new-email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                autoComplete="off"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="new-display-name">
                Display Name <OptionalLabel>optional</OptionalLabel>
              </FormLabel>
              <Input
                id="new-display-name"
                type="text"
                placeholder="Full name"
                value={form.displayName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, displayName: e.target.value }))
                }
                autoComplete="off"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="new-password">Password</FormLabel>
              <Input
                id="new-password"
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                minLength={8}
                autoComplete="new-password"
              />
              <PasswordStrengthContainer>
                <PasswordStrengthBar
                  $strength={strength}
                  $hasInput={form.password.length > 0}
                  style={{ flex: 1 }}
                />
                {form.password && (
                  <PasswordStrengthLabel $strength={strength}>
                    {strength}
                  </PasswordStrengthLabel>
                )}
              </PasswordStrengthContainer>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="new-role">Role</FormLabel>
              <FormSelect
                id="new-role"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                {assignable.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            <CheckboxRow>
              <input
                type="checkbox"
                checked={form.sendWelcomeEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sendWelcomeEmail: e.target.checked }))
                }
              />
              Send password reset email (lets user set their own password)
            </CheckboxRow>

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
                {saving ? 'Creating…' : 'Create User'}
              </Button>
            </ModalActions>
          </FormContainer>
        </WideDialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
