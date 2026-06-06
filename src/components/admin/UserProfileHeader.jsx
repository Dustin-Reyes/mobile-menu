import { Pencil, ShieldCheck, Check, X } from 'lucide-react';
import { ROLE_LABELS } from 'utils/roleHelpers';
import { getUserInitials } from 'utils/userHelpers';
import { getUserStatus, getProviderLabel } from 'utils/admin/userHelpers';
import {
  DetailProfile,
  DetailAvatarWrap,
  DetailInfo,
  NameRow,
  NameDisplay,
  NamePlaceholder,
  EditNameButton,
  NameEditForm,
  IconButton,
  DetailEmail,
  DetailBadges,
  RoleBadge,
  StatusBadge,
  ProviderBadge,
  AvatarImage,
  NameEditInput,
} from './UserDetail.styles';

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
