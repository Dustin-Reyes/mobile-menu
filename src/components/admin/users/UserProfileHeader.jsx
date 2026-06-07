import { ShieldCheck, Check, X, KeyRound } from 'lucide-react';
import styled from '@emotion/styled';
import { ROLE_LABELS } from 'utils/roleHelpers';
import { getUserInitials } from 'utils/userHelpers';

const DetailProfile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: rgba(255, 255, 255, 0.025);
  border-radius: ${(p) => p.theme.borderRadius.s2}
    ${(p) => p.theme.borderRadius.s2} 0 0;
`;

const EditButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: rgba(255, 255, 255, 0.45);
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  cursor: pointer;
  transition:
    color ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast},
    background ${(p) => p.theme.transitions.fast};

  &:hover {
    color: rgba(255, 255, 255, 0.85);
    border-color: rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ProfileTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ProviderDot = styled.div`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  border: 2px solid rgba(14, 14, 14, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) =>
    p.$provider === 'google' ? '#4285F4' : 'rgba(255,255,255,0.1)'};
  color: ${(p) =>
    p.$provider === 'google' ? '#fff' : 'rgba(255,255,255,0.6)'};
  font-size: 9px;
  font-weight: 700;
  line-height: 1;

  @media (max-width: 768px) {
    width: 23px;
    height: 23px;
    font-size: 11px;
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
    width: 80px;
    height: 80px;
    font-size: ${(p) => p.theme.typography.fontSizes.s5};
  }
`;

const DetailInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
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
  const isGoogle = targetUser.providers?.includes('google.com');

  return (
    <DetailProfile>
      {canEdit && !editingName && (
        <EditButton type="button" onClick={onEditName}>
          Edit
        </EditButton>
      )}
      <ProfileTopRow>
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
          <ProviderDot $provider={isGoogle ? 'google' : 'password'}>
            {isGoogle ? 'G' : <KeyRound size={9} />}
          </ProviderDot>
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
            </NameRow>
          )}
          <DetailEmail>{targetUser.email}</DetailEmail>
        </DetailInfo>
      </ProfileTopRow>

      <DetailBadges>
        {targetUser.role && (
          <RoleBadge>
            <ShieldCheck size={10} />
            {ROLE_LABELS[targetUser.role] ?? targetUser.role}
          </RoleBadge>
        )}
      </DetailBadges>
    </DetailProfile>
  );
}
