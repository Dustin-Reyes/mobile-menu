import styled from '@emotion/styled';
import { Menu, X, LogIn, Sun, Moon, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useTheme } from './ThemeProvider';
import { useTranslation } from 'react-i18next';
import * as RadixDialog from '@radix-ui/react-dialog';
import Button from 'components/ui/Button';
import Separator from 'components/ui/Separator';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderLogo from './HeaderLogo';
import { SECTIONS_CONFIG } from 'config/sections';
import { ADMIN_TABS } from 'components/admin/tabs/adminTabsConfig';
import { getUserInitials, getUserDisplayName } from 'utils/userHelpers';

// ─── Shell ────────────────────────────────────────────────────────────────────

const Trigger = styled(RadixDialog.Trigger)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s0};
  border-radius: ${({ theme }) => theme.borderRadius.s1};
  color: ${({ theme }) => theme.colors.text};
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  }
`;

const Overlay = styled(RadixDialog.Overlay)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndex.modal};
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Content = styled(RadixDialog.Content)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  z-index: ${({ theme }) => theme.zIndex.modal + 1};
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const CloseButton = styled(RadixDialog.Close)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)'};
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
`;

// ─── User info ────────────────────────────────────────────────────────────────

const UserInfo = styled(RadixDialog.Close)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0 16px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const UserChevron = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.4;
  flex-shrink: 0;
  margin-left: auto;
`;

const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border-radius: 50%;
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const UserEmail = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ─── Simple nav item ──────────────────────────────────────────────────────────

const NavItem = styled(RadixDialog.Close)`
  display: block;
  width: 100%;
  padding: 10px 12px;
  background: ${({ $active, theme }) =>
    $active ? `${theme.colors.primary}14` : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s1};
  cursor: pointer;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? `${theme.colors.primary}1e`
        : theme.mode === 'dark'
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.04)'};
  }
`;

// ─── Admin / sign-out items (two-line, no icon) ───────────────────────────────

const TwoLineItem = styled(RadixDialog.Close)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s1};
  cursor: pointer;
  text-align: left;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
  }
`;

const TwoLineLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
`;

const TwoLineSubtitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.3;
`;

// ─── Admin actions (pinned above bottom bar) ──────────────────────────────────

const AdminSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem 1.25rem;
  flex-shrink: 0;
`;

// ─── Bottom bar ───────────────────────────────────────────────────────────────

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const AuthButtonWrapper = styled(RadixDialog.Close)`
  flex: 1;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MobileMenu() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path, state) =>
    navigate(path, state ? { state } : undefined);

  const handleAnchorClick = (path) => {
    const sectionId = path.replace('/#', '');
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element)
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to sign out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const mainNavItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.development'), path: '/development' },
  ];

  const sectionNavItems = SECTIONS_CONFIG.navigation
    .filter((nav) => nav.enabled)
    .map((nav) => ({
      label: t(`nav.${nav.id}`),
      path: `/#${nav.id}`,
    }));

  return (
    <RadixDialog.Root>
      <Trigger aria-label="Open menu">
        <Menu size={24} />
      </Trigger>
      <RadixDialog.Portal>
        <Overlay />
        <Content>
          <MenuHeader>
            <HeaderLogo />
            <CloseButton aria-label="Close menu">
              <X size={18} />
            </CloseButton>
          </MenuHeader>

          <ScrollArea>
            {isAuthenticated && (
              <>
                <UserInfo
                  onClick={() => handleNavigate('/admin', { tab: 'profile' })}
                >
                  <UserAvatar>{getUserInitials(user?.email)}</UserAvatar>
                  <UserDetails>
                    <UserName>{getUserDisplayName(user?.email)}</UserName>
                    <UserEmail>{user?.email}</UserEmail>
                  </UserDetails>
                  <UserChevron>
                    <ChevronRight size={16} />
                  </UserChevron>
                </UserInfo>
                <Separator />
              </>
            )}

            {mainNavItems.map(({ label, path }) => (
              <NavItem
                key={path}
                $active={isActive(path)}
                onClick={() => handleNavigate(path)}
              >
                {label}
              </NavItem>
            ))}

            {location.pathname === '/' &&
              sectionNavItems.map(({ label, path }) => (
                <NavItem
                  key={path}
                  $active={false}
                  onClick={() => handleAnchorClick(path)}
                >
                  {label}
                </NavItem>
              ))}

            {isAuthenticated && location.pathname.startsWith('/admin') && (
              <>
                <Separator />
                {ADMIN_TABS.filter((tab) => tab.enabled).map(
                  ({ id, label }) => (
                    <NavItem
                      key={id}
                      $active={false}
                      onClick={() => handleNavigate('/admin', { tab: id })}
                    >
                      {label}
                    </NavItem>
                  ),
                )}
              </>
            )}
          </ScrollArea>

          {isAuthenticated && (
            <AdminSection>
              {!location.pathname.startsWith('/admin') && (
                <TwoLineItem
                  onClick={() => handleNavigate('/admin', { tab: 'dashboard' })}
                >
                  <TwoLineLabel>{t('nav.goToAdminDashboard')}</TwoLineLabel>
                  <TwoLineSubtitle>
                    {t('nav.goToAdminDashboardSubtitle')}
                  </TwoLineSubtitle>
                </TwoLineItem>
              )}

              <TwoLineItem onClick={handleSignOut}>
                <TwoLineLabel>{t('nav.signOut')}</TwoLineLabel>
                <TwoLineSubtitle>{t('nav.signOutSubtitle')}</TwoLineSubtitle>
              </TwoLineItem>
            </AdminSection>
          )}

          <BottomBar>
            <LanguageSwitcher />
            <ThemeButton
              onClick={toggleMode}
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? t('theme.light') : t('theme.dark')}
            </ThemeButton>
            {!isAuthenticated && (
              <AuthButtonWrapper>
                <Button onClick={() => navigate('/admin')} fullWidth>
                  <LogIn size={16} style={{ marginRight: '8px' }} />
                  {t('nav.signIn')}
                </Button>
              </AuthButtonWrapper>
            )}
          </BottomBar>
        </Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
