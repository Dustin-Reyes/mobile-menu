import { Copy, Calendar, LogIn, CreditCard } from 'lucide-react';
import styled from '@emotion/styled';
import { formatDate } from 'utils/formatDate';

const DetailSection = styled.div`
  @media (max-width: 768px) {
    display: none;
  }

  @media (min-width: 769px) {
    width: 220px;
    flex-shrink: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
`;

const SectionTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const InfoRowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoRowIcon = styled.div`
  color: rgba(255, 255, 255, 0.2);
  display: flex;
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
      <SectionTitle>Account Details</SectionTitle>
      <InfoRow>
        <InfoRowLeft>
          <InfoRowIcon>
            <Calendar size={13} />
          </InfoRowIcon>
          <InfoRowLabel>Joined</InfoRowLabel>
        </InfoRowLeft>
        <InfoRowValue>{formatDate(targetUser.createdAt)}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLeft>
          <InfoRowIcon>
            <LogIn size={13} />
          </InfoRowIcon>
          <InfoRowLabel>Last login</InfoRowLabel>
        </InfoRowLeft>
        <InfoRowValue>{formatDate(targetUser.lastLoginAt)}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLeft>
          <InfoRowIcon>
            <CreditCard size={13} />
          </InfoRowIcon>
          <InfoRowLabel>User ID</InfoRowLabel>
        </InfoRowLeft>
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
