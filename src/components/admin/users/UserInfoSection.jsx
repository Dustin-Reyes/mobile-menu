import { Copy } from 'lucide-react';
import styled from '@emotion/styled';
import { formatDate } from 'utils/formatDate';

const DetailSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const InfoRowLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
`;

const InfoRowValue = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.text};
  text-align: right;
`;

const UidField = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  font-family: monospace;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.25);
  max-width: 180px;
  transition:
    background ${(p) => p.theme.transitions.fast},
    color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.55);
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CopyIcon = styled.span`
  flex-shrink: 0;
`;

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
