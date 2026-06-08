/**
 * @module components/admin/users/UserProfileHeader
 * @description Profile header card shown at the top of the user detail view.
 * Displays the user's avatar, name, email, role badge, and an Edit button when
 * the caller has permission to edit.
 */

import { ShieldCheck, KeyRound, Pencil } from 'lucide-react';
import styled from '@emotion/styled';
import { ROLE_LABELS } from 'utils/roleHelpers';
import { getUserInitials } from 'utils/userHelpers';

const DetailProfile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: ${(p) => p.theme.colors.surface};
  border-radius: ${(p) => p.theme.borderRadius.s2}
    ${(p) => p.theme.borderRadius.s2} 0 0;
`;

const EditButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: ${(p) => `${p.theme.colors.primary}14`};
  border: 1px solid ${(p) => `${p.theme.colors.primary}73`};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: ${(p) => p.theme.colors.primary};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  transition:
    color ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast},
    background ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => `${p.theme.colors.primary}26`};
    border-color: ${(p) => `${p.theme.colors.primary}b3`};
    color: ${(p) => p.theme.colors.primary};
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
  border: 2px solid ${(p) => p.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) =>
    p.$provider === 'google' ? '#4285F4' : p.theme.colors.surface};
  color: ${(p) =>
    p.$provider === 'google'
      ? p.theme.colors.text
      : p.theme.colors.textSecondary};
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
  color: ${(p) => p.theme.colors.textMuted};
  font-style: italic;
  font-weight: ${(p) => p.theme.typography.fontWeights.normal};
`;

const DetailEmail = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textMuted};
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
  border-top: 1px solid ${(p) => p.theme.colors.border};
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

/**
 * @param {Object} props
 * @param {Object} props.targetUser - The user whose profile is being displayed.
 * @param {string} [props.targetUser.displayName] - The user's display name.
 * @param {string} props.targetUser.email - The user's email address.
 * @param {string} [props.targetUser.role] - The user's role identifier.
 * @param {string} [props.targetUser.photoURL] - URL of the user's profile photo.
 * @param {string[]} [props.targetUser.providers] - Auth providers linked to this account.
 * @param {boolean} props.canEdit - Whether the current admin has permission to edit this user.
 * @param {boolean} props.editing - Whether the edit form is currently open.
 * @param {function} props.onEdit - Callback invoked when the Edit button is clicked.
 * @returns {JSX.Element}
 */
export default function UserProfileHeader({
  targetUser,
  canEdit,
  editing,
  onEdit,
}) {
  const isGoogle = targetUser.providers?.includes('google.com');
  const displayName = targetUser.displayName
    ? targetUser.displayName.length > 15
      ? `${targetUser.displayName.slice(0, 15)}…`
      : targetUser.displayName
    : null;

  return (
    <DetailProfile>
      {canEdit && !editing && (
        <EditButton type="button" onClick={onEdit}>
          <Pencil size={13} />
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
          <NameRow>
            {displayName ? (
              <NameDisplay>{displayName}</NameDisplay>
            ) : (
              <NamePlaceholder>No display name</NamePlaceholder>
            )}
          </NameRow>
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
