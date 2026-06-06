import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from 'utils/roleHelpers';
import { getUserInitials, getUserDisplayName } from 'utils/userHelpers';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import { SectionCard } from '../shared/SectionCard';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary}30;
  color: ${(p) => p.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  flex-shrink: 0;
`;

const ProfileDetails = styled.div`
  min-width: 0;
  flex: 1;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ProfileName = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 2px;
`;

const ProfileEmail = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  background: ${(p) => p.theme.colors.primary}18;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}30;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const NoRoleBadge = styled(RoleBadge)`
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.08);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: 0 0 12px;
`;

const SignOutButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: #f87171;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export default function ProfileTab() {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const initials = getUserInitials(user?.email);
  const displayName = getUserDisplayName(user?.email);
  const roleLabel = userRole ? ROLE_LABELS[userRole] : null;

  return (
    <motion.div key="profile" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Profile</PageTitle>
          <PageSubtitle>Your account information</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <ProfileCard>
          <Avatar>{initials}</Avatar>
          <ProfileDetails>
            <ProfileName>{displayName}</ProfileName>
            <ProfileEmail>{user?.email}</ProfileEmail>
            {roleLabel ? (
              <RoleBadge>
                <ShieldCheck size={11} />
                {roleLabel}
              </RoleBadge>
            ) : (
              <NoRoleBadge>No role assigned</NoRoleBadge>
            )}
          </ProfileDetails>
        </ProfileCard>

        <Divider />

        <SignOutButton onClick={handleSignOut}>
          <LogOut size={14} />
          Sign out
        </SignOutButton>
      </SectionCard>
    </motion.div>
  );
}
