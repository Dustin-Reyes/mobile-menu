import { Copy } from 'lucide-react';
import { formatDate } from 'utils/formatDate';
import {
  DetailSection,
  InfoRow,
  InfoRowLabel,
  InfoRowValue,
  UidField,
  CopyIcon,
} from './UserDetail.styles';

export default function UserInfoSection({ targetUser, onCopyUid }) {
  return (
    <DetailSection>
      <InfoRow>
        <InfoRowLabel>Joined</InfoRowLabel>
        <InfoRowValue>{formatDate(targetUser.createdAt)}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLabel>Last login</InfoRowLabel>
        <InfoRowValue>{formatDate(targetUser.lastLoginAt)}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLabel>User ID</InfoRowLabel>
        <UidField type="button" onClick={onCopyUid} title="Copy user ID">
          <span>{targetUser.uid}</span>
          <CopyIcon>
            <Copy size={10} />
          </CopyIcon>
        </UidField>
      </InfoRow>
    </DetailSection>
  );
}
