import { useState } from 'react';
import styled from '@emotion/styled';
import { UserPlus } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { toast } from '@/utils/toast';
import { ROLE_LABELS, ROLES, getAssignableRoles } from 'utils/roleHelpers';
import { getPasswordStrength } from 'utils/passwordStrength';
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

const ModalContent = styled(DialogContent)`
  max-width: 520px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 92vw;
    margin: 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 20px;
`;

const HeaderIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.primary}20;
  color: ${(p) => p.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderText = styled.div`
  flex: 1;
`;

const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.02em;
`;

const OptionalLabel = styled.span`
  color: rgba(255, 255, 255, 0.3);
  font-weight: normal;
  margin-left: 4px;
`;

const FormInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  outline: none;
  transition:
    border-color ${(p) => p.theme.transitions.fast},
    background ${(p) => p.theme.transitions.fast},
    box-shadow ${(p) => p.theme.transitions.fast};

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.05);
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.primary}60;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}14;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition:
    border-color ${(p) => p.theme.transitions.fast},
    background ${(p) => p.theme.transitions.fast},
    box-shadow ${(p) => p.theme.transitions.fast};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.05);
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.primary}60;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}14;
  }

  option {
    background: #1a1a1a;
    color: #fff;
  }
`;

const PasswordStrengthContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
`;

const StrengthBar = styled.div`
  height: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  background: ${(p) =>
    p.$strength === 'strong'
      ? '#4ade80'
      : p.$strength === 'medium'
        ? '#fbbf24'
        : p.$strength === 'weak'
          ? '#f87171'
          : 'rgba(255,255,255,0.1)'};
  width: ${(p) =>
    p.$strength === 'strong'
      ? '100%'
      : p.$strength === 'medium'
        ? '66%'
        : p.$strength === 'weak'
          ? '33%'
          : '0%'};
  transition: all 0.25s ease-out;
`;

const StrengthLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) =>
    p.$strength === 'strong'
      ? '#4ade80'
      : p.$strength === 'medium'
        ? '#fbbf24'
        : p.$strength === 'weak'
          ? '#f87171'
          : 'rgba(255,255,255,0.25)'};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all ${(p) => p.theme.transitions.fast};
  margin-top: 1px;

  &:checked {
    background: ${(p) => p.theme.colors.primary};
    border-color: ${(p) => p.theme.colors.primary};
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const CheckboxText = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
`;

const CheckboxSubtext = styled.span`
  display: block;
  margin-top: 2px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.3;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 8px;
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
        <ModalContent>
          <ModalHeader>
            <HeaderIcon>
              <UserPlus size={18} strokeWidth={2.2} />
            </HeaderIcon>
            <HeaderText>
              <DialogTitle>Add User</DialogTitle>
              <HeaderSubtitle>
                Invite a new team member to your workspace
              </HeaderSubtitle>
            </HeaderText>
          </ModalHeader>

          <FormContainer onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="new-display-name">
                  Display Name <OptionalLabel>required</OptionalLabel>
                </FormLabel>
                <FormInput
                  id="new-display-name"
                  type="text"
                  placeholder="Full name"
                  value={form.displayName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, displayName: e.target.value }))
                  }
                  required
                  autoComplete="off"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="new-email">
                  Email <OptionalLabel>required</OptionalLabel>
                </FormLabel>
                <FormInput
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
            </FormRow>

            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="new-password">
                  Password <OptionalLabel>required</OptionalLabel>
                </FormLabel>
                <FormInput
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
                  <StrengthBar>
                    <StrengthFill
                      $strength={strength}
                      $hasInput={form.password.length > 0}
                    />
                  </StrengthBar>
                  {form.password && (
                    <StrengthLabel $strength={strength}>
                      {strength === 'strong'
                        ? 'Strong'
                        : strength === 'medium'
                          ? 'Good'
                          : 'Weak'}
                    </StrengthLabel>
                  )}
                </PasswordStrengthContainer>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="new-role">
                  Role <OptionalLabel>required</OptionalLabel>
                </FormLabel>
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
            </FormRow>

            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                checked={form.sendWelcomeEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sendWelcomeEmail: e.target.checked }))
                }
              />
              <div>
                <CheckboxText>Send password reset email</CheckboxText>
                <CheckboxSubtext>
                  Lets user set their own password
                </CheckboxSubtext>
              </div>
            </CheckboxRow>

            <ModalActions>
              <Button
                type="button"
                variant="outline"
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
        </ModalContent>
      </DialogPortal>
    </DialogRoot>
  );
}
