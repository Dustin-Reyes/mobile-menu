/**
 * @module components/admin/users/UserInfoSection
 * @description Desktop-only sidebar panel within the user detail view. Displays
 * account metadata including join date, last login, and a copyable user ID.
 */

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
    border-right: 1px solid ${(p) => p.theme.colors.border};
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
`;

const SectionTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  padding-bottom: 4px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
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
  color: ${(p) => p.theme.colors.textMuted};
  display: flex;
`;

const InfoRowLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textMuted};
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
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  font-family: monospace;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
  max-width: 180px;
  transition:
    background ${(p) => p.theme.transitions.fast},
    color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => p.theme.colors.secondaryBackground};
    color: ${(p) => p.theme.colors.textSecondary};
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

/**
 * @param {Object} props
 * @param {Object} props.targetUser - The user whose account details are displayed.
 * @param {string} [props.targetUser.createdAt] - ISO timestamp of when the account was created.
 * @param {string} [props.targetUser.lastLoginAt] - ISO timestamp of the user's last sign-in.
 * @param {string} props.targetUser.uid - The user's Firebase UID.
 * @param {function} props.onCopyUid - Callback invoked when the user ID copy button is clicked.
 * @returns {JSX.Element}
 */
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
