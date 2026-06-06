import styled from '@emotion/styled';

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
  margin-bottom: 12px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  transition: color ${(p) => p.theme.transitions.fast};

  &:hover {
    color: rgba(255, 255, 255, 0.75);
  }
`;

export const DetailProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.025);
  border-radius: ${(p) => p.theme.borderRadius.s2}
    ${(p) => p.theme.borderRadius.s2} 0 0;
`;

export const DetailAvatarWrap = styled.div`
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
`;

export const DetailInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const NameDisplay = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NamePlaceholder = styled(NameDisplay)`
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
  font-weight: ${(p) => p.theme.typography.fontWeights.normal};
`;

export const EditNameButton = styled.button`
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

export const NameEditForm = styled.form`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
`;

export const IconButton = styled.button`
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

export const DetailEmail = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DetailBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

export const RoleBadge = styled.span`
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

export const StatusBadge = styled.span`
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

export const ProviderBadge = styled.span`
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

export const DetailSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const InfoRowLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
`;

export const InfoRowValue = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.text};
  text-align: right;
`;

export const UidField = styled.button`
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

export const ActionButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.s2};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  color: ${(p) => p.theme.colors.text};
  transition:
    background ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export const DestructiveButton = styled(ActionButton)`
  margin-left: auto;
  color: #f87171;
  background: rgba(239, 68, 68, 0.06);
  border-color: rgba(239, 68, 68, 0.22);

  &:hover {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.4);
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const NameEditInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 4px 10px;
  font-size: 0.875rem;
`;

export const CopyIcon = styled.span`
  flex-shrink: 0;
`;
