import styled from '@emotion/styled';
import {
  LogOut,
  LayoutDashboard,
  Home,
  Info,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useTranslation } from 'react-i18next';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from 'components/ui/DropdownMenu';
import { getUserInitials, getUserDisplayName } from 'utils/userHelpers';
import { ROLE_LABELS } from 'utils/roleHelpers';

// ─── Trigger ─────────────────────────────────────────────────────────────────

const TriggerPill = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px 5px 6px;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.onPrimary};
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => p.theme.colors.secondary};
  }
`;

const TriggerAvatar = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  flex-shrink: 0;
`;

// ─── Dropdown ─────────────────────────────────────────────────────────────────

const WideContent = styled(DropdownMenuContent)`
  min-width: 260px;
`;

// ─── User info header (non-interactive) ──────────────────────────────────────

const UserInfoHeader = styled(RadixDropdownMenu.Item)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px 12px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  transition: background ${(p) => p.theme.transitions.fast};
  text-align: left;
  outline: none;

  &[data-highlighted] {
    background: ${(p) =>
      p.theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
  }
`;

const HeaderAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.onPrimary};
  border-radius: 50%;
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  flex-shrink: 0;
`;

const HeaderDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const HeaderName = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderEmail = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ─── Menu item ────────────────────────────────────────────────────────────────

const MenuItem = styled(RadixDropdownMenu.Item)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  outline: none;
  transition: background ${(p) => p.theme.transitions.fast};
  user-select: none;

  &[data-highlighted] {
    background: ${(p) => p.theme.colors.primary}18;
  }
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${(p) =>
    p.theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: ${(p) => p.theme.colors.textSecondary};
  flex-shrink: 0;

  ${MenuItem}[data-highlighted] & {
    color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primary}20;
  }
`;

const MenuText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const MenuLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => p.theme.colors.text};
  line-height: 1.3;
`;

const MenuSubtitle = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: 1.3;
`;

const MenuChevron = styled.div`
  color: ${(p) => p.theme.colors.textSecondary};
  flex-shrink: 0;
  opacity: 0.5;
`;

// ─── Destructive item (sign out) ──────────────────────────────────────────────

const DestructiveItem = styled(MenuItem)`
  &[data-highlighted] {
    background: rgba(239, 68, 68, 0.08);
  }

  ${MenuIcon} {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }

  ${MenuLabel} {
    color: #ef4444;
  }

  ${MenuSubtitle} {
    color: rgba(239, 68, 68, 0.6);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserMenu() {
  const { t } = useTranslation();
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const initials = getUserInitials(user.email);
  const displayName = getUserDisplayName(user.email);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <TriggerPill aria-label="User menu">
          <TriggerAvatar>{initials}</TriggerAvatar>
          <ChevronDown size={13} />
        </TriggerPill>
      </DropdownMenuTrigger>

      <WideContent align="end" sideOffset={21}>
        <UserInfoHeader
          onClick={() => navigate('/admin', { state: { tab: 'profile' } })}
        >
          <HeaderAvatar>{initials}</HeaderAvatar>
          <HeaderDetails>
            <HeaderName>{displayName}</HeaderName>
            <HeaderEmail>{user.email}</HeaderEmail>
            {userRole && (
              <HeaderEmail style={{ marginTop: '2px' }}>
                {ROLE_LABELS[userRole]}
              </HeaderEmail>
            )}
          </HeaderDetails>
          <MenuChevron>
            <ChevronRight size={14} />
          </MenuChevron>
        </UserInfoHeader>

        <DropdownMenuSeparator />

        {location.pathname !== '/' && (
          <MenuItem onClick={() => navigate('/')}>
            <MenuIcon>
              <Home size={15} />
            </MenuIcon>
            <MenuText>
              <MenuLabel>{t('nav.home')}</MenuLabel>
              <MenuSubtitle>{t('nav.homeSubtitle')}</MenuSubtitle>
            </MenuText>
            <MenuChevron>
              <ChevronRight size={14} />
            </MenuChevron>
          </MenuItem>
        )}

        <MenuItem onClick={() => navigate('/development')}>
          <MenuIcon>
            <Info size={15} />
          </MenuIcon>
          <MenuText>
            <MenuLabel>{t('nav.development')}</MenuLabel>
            <MenuSubtitle>{t('nav.developmentSubtitle')}</MenuSubtitle>
          </MenuText>
          <MenuChevron>
            <ChevronRight size={14} />
          </MenuChevron>
        </MenuItem>

        <DropdownMenuSeparator />

        <MenuItem
          onClick={() => navigate('/admin', { state: { tab: 'dashboard' } })}
        >
          <MenuIcon>
            <LayoutDashboard size={15} />
          </MenuIcon>
          <MenuText>
            <MenuLabel>{t('nav.goToAdminDashboard')}</MenuLabel>
            <MenuSubtitle>{t('nav.goToAdminDashboardSubtitle')}</MenuSubtitle>
          </MenuText>
          <MenuChevron>
            <ChevronRight size={14} />
          </MenuChevron>
        </MenuItem>

        <MenuItem
          onClick={() => navigate('/admin', { state: { tab: 'settings' } })}
        >
          <MenuIcon>
            <Settings size={15} />
          </MenuIcon>
          <MenuText>
            <MenuLabel>{t('nav.settings')}</MenuLabel>
            <MenuSubtitle>{t('nav.settingsSubtitle')}</MenuSubtitle>
          </MenuText>
          <MenuChevron>
            <ChevronRight size={14} />
          </MenuChevron>
        </MenuItem>

        <DropdownMenuSeparator />

        <DestructiveItem onClick={handleSignOut}>
          <MenuIcon>
            <LogOut size={15} />
          </MenuIcon>
          <MenuText>
            <MenuLabel>{t('nav.signOut')}</MenuLabel>
            <MenuSubtitle>{t('nav.signOutSubtitle')}</MenuSubtitle>
          </MenuText>
        </DestructiveItem>
      </WideContent>
    </DropdownMenuRoot>
  );
}
