import { Pencil, ShieldCheck, Check, X } from 'lucide-react';
import styled from '@emotion/styled';
import { ROLE_LABELS } from 'utils/roleHelpers';
import { getUserInitials } from 'utils/userHelpers';
import { getUserStatus, getProviderLabel } from 'utils/admin/userHelpers';

const DetailProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.025);
  border-radius: ${(p) => p.theme.borderRadius.s2}
    ${(p) => p.theme.borderRadius.s2} 0 0;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const StatusDot = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${(p) => (p.$disabled ? '#f87171' : '#4ade80')};
  border: 2px solid rgba(14, 14, 14, 0.9);

  @media (max-width: 768px) {
    width: 13px;
    height: 13px;
    bottom: 3px;
    right: 3px;
  }
`;

const DetailAvatarWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary}28;
  color: ${(p) => p.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid ${(p) => p.theme.colors.primary}20;

  @media (max-width: 768px) {
    width: 76px;
    height: 76px;
    font-size: ${(p) => p.theme.typography.fontSizes.s5};
  }
`;

const DetailInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const NameDisplay = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NamePlaceholder = styled(NameDisplay)`
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
  font-weight: ${(p) => p.theme.typography.fontWeights.normal};
`;

const EditNameButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  padding: 2px;
  display: flex;
  flex-shrink: 0;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  transition:
    color ${(p) => p.theme.transitions.fast},
    background ${(p) => p.theme.transitions.fast};

  &:hover {
    color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.06);
  }
`;

const NameEditForm = styled.form`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px;
  display: flex;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  flex-shrink: 0;
  transition:
    background ${(p) => p.theme.transitions.fast},
    color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${(p) => (p.$danger ? '#f87171' : 'rgba(255,255,255,0.8)')};
  }
`;

const DetailEmail = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DetailBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    justify-content: center;
    padding: 10px 16px;
  }
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  background: ${(p) => p.theme.colors.primary}18;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}30;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  background: ${(p) =>
    p.$disabled ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'};
  color: ${(p) => (p.$disabled ? '#f87171' : '#4ade80')};
  border: 1px solid
    ${(p) => (p.$disabled ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)')};
  white-space: nowrap;
`;

const ProviderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NameEditInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 4px 10px;
  font-size: 0.875rem;
`;

export default function UserProfileHeader({
  targetUser,
  canEdit,
  editingName,
  displayName,
  savingName,
  onEditName,
  onSaveName,
  onCancelEdit,
  onDisplayNameChange,
}) {
  const status = getUserStatus(targetUser);

  return (
    <DetailProfile>
      <AvatarContainer>
        <DetailAvatarWrap>
          {targetUser.photoURL ? (
            <AvatarImage
              src={targetUser.photoURL}
              alt=""
              referrerPolicy="no-referrer"
            />
          ) : (
            getUserInitials(targetUser.email)
          )}
        </DetailAvatarWrap>
        <StatusDot $disabled={status === 'disabled'} />
      </AvatarContainer>

      <DetailInfo>
        {editingName ? (
          <NameEditForm onSubmit={onSaveName}>
            <NameEditInput
              value={displayName}
              onChange={onDisplayNameChange}
              placeholder="Display name"
              autoFocus
            />
            <IconButton type="submit" disabled={savingName} title="Save">
              <Check size={14} />
            </IconButton>
            <IconButton
              type="button"
              $danger
              onClick={onCancelEdit}
              title="Cancel"
            >
              <X size={14} />
            </IconButton>
          </NameEditForm>
        ) : (
          <NameRow>
            {targetUser.displayName ? (
              <NameDisplay>{targetUser.displayName}</NameDisplay>
            ) : (
              <NamePlaceholder>No display name</NamePlaceholder>
            )}
            {canEdit && (
              <EditNameButton onClick={onEditName} title="Edit display name">
                <Pencil size={11} />
              </EditNameButton>
            )}
          </NameRow>
        )}
        <DetailEmail>{targetUser.email}</DetailEmail>
        <DetailBadges>
          {targetUser.role && (
            <RoleBadge>
              <ShieldCheck size={10} />
              {ROLE_LABELS[targetUser.role] ?? targetUser.role}
            </RoleBadge>
          )}
          <ProviderBadge>
            {getProviderLabel(targetUser.providers)}
          </ProviderBadge>
          <StatusBadge $disabled={status === 'disabled'}>
            {status === 'disabled' ? 'Disabled' : 'Active'}
          </StatusBadge>
        </DetailBadges>
      </DetailInfo>
    </DetailProfile>
  );
}
