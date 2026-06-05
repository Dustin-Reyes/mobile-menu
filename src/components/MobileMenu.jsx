import styled from '@emotion/styled';
import {
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Home,
  Info,
  ChevronRight,
  Navigation,
  TrendingUp,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useTheme } from './ThemeProvider';
import { useTranslation } from 'react-i18next';
import * as RadixDialog from '@radix-ui/react-dialog';
import Button from 'components/ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderLogo from './HeaderLogo';
import { SECTIONS_CONFIG } from 'config/sections';

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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

const Header = styled.div`
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
  padding: 1.25rem 1rem;
`;

const ProfileCard = styled(RadixDialog.Close)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  cursor: pointer;
  text-align: left;
  margin-bottom: 1.5rem;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)'};
  }
`;

const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border-radius: 50%;
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
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
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
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

const NavSection = styled.nav`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const NavTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.s1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 0.5rem 0.5rem;
`;

const NavLink = styled(RadixDialog.Close)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: ${({ $active, theme }) =>
    $active
      ? theme.mode === 'dark'
        ? 'rgba(255, 186, 0, 0.1)'
        : 'rgba(255, 186, 0, 0.08)'
      : 'none'};
  border: none;
  border-left: 3px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  border-radius: 0 ${({ theme }) => theme.borderRadius.s1}
    ${({ theme }) => theme.borderRadius.s1} 0;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ $active, theme }) =>
    $active
      ? theme.typography.fontWeights.bold
      : theme.typography.fontWeights.medium};
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? theme.mode === 'dark'
          ? 'rgba(255, 186, 0, 0.15)'
          : 'rgba(255, 186, 0, 0.12)'
        : theme.mode === 'dark'
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(0,0,0,0.05)'};
  }

  svg:first-of-type {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.textSecondary};
    flex-shrink: 0;
  }
`;

const NavLinkLabel = styled.span`
  flex: 1;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0.75rem 0 1.25rem;
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const BottomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s0};
  border-radius: ${({ theme }) => theme.borderRadius.s1};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  }
`;

const AuthButtonWrapper = styled(RadixDialog.Close)`
  flex: 1;
`;

export default function MobileMenu() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleAnchorClick = (path) => {
    const sectionId = path.replace('/#', '');
    const isHomePage = location.pathname === '/';

    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSignIn = () => {
    navigate('/admin');
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

  const getUserInitials = () => {
    const email = user?.email || '';
    const username = email.split('@')[0] || '';
    return username.slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    const email = user?.email || '';
    const username = email.split('@')[0] || '';
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  const isActive = (path) => location.pathname === path;

  const mainNavItems = [
    { label: t('nav.home'), path: '/', icon: Home },
    { label: t('nav.development'), path: '/development', icon: Info },
  ];

  const sectionNavItems = SECTIONS_CONFIG.navigation
    .filter((nav) => nav.enabled)
    .map((nav) => ({
      label: t(`nav.${nav.id}`),
      path: `/#${nav.id}`,
      icon: ChevronRight,
      isAnchor: true,
    }));

  const adminNavItems = [
    { label: t('nav.adminDashboard'), path: '/admin', icon: LayoutDashboard },
    { label: t('nav.navigation'), path: '/admin', icon: Navigation },
    { label: t('nav.analytics'), path: '/admin', icon: TrendingUp },
  ];

  return (
    <RadixDialog.Root>
      <Trigger aria-label="Open menu">
        <Menu size={24} />
      </Trigger>
      <RadixDialog.Portal>
        <Overlay />
        <Content>
          <Header>
            <HeaderLogo />
            <CloseButton aria-label="Close menu">
              <X size={18} />
            </CloseButton>
          </Header>

          <ScrollArea>
            {isAuthenticated && (
              <ProfileCard onClick={() => handleNavigate('/admin')}>
                <UserAvatar>{getUserInitials()}</UserAvatar>
                <UserDetails>
                  <UserName>{getUserDisplayName()}</UserName>
                  <UserEmail>{user?.email}</UserEmail>
                </UserDetails>
                <ChevronRight
                  size={18}
                  style={{ color: 'inherit', opacity: 0.4, flexShrink: 0 }}
                />
              </ProfileCard>
            )}

            <NavSection>
              <NavTitle>{t('nav.menuTitle')}</NavTitle>
              {mainNavItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path + label}
                  $active={isActive(path)}
                  onClick={() => handleNavigate(path)}
                >
                  <Icon size={20} />
                  <NavLinkLabel>{label}</NavLinkLabel>
                  <ChevronRight size={16} style={{ opacity: 0.4 }} />
                </NavLink>
              ))}
              {sectionNavItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path + label}
                  $active={false}
                  onClick={() => handleAnchorClick(path)}
                >
                  <Icon size={20} />
                  <NavLinkLabel>{label}</NavLinkLabel>
                  <ChevronRight size={16} style={{ opacity: 0.4 }} />
                </NavLink>
              ))}
            </NavSection>

            {isAuthenticated && (
              <>
                <SectionDivider />
                <NavSection>
                  {adminNavItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                      key={label}
                      $active={false}
                      onClick={() => handleNavigate(path)}
                    >
                      <Icon size={20} />
                      <NavLinkLabel>{label}</NavLinkLabel>
                      <ChevronRight size={16} style={{ opacity: 0.4 }} />
                    </NavLink>
                  ))}
                </NavSection>
              </>
            )}
          </ScrollArea>

          <BottomBar>
            <BottomControls>
              <LanguageSwitcher compact />
              <ThemeButton
                onClick={toggleMode}
                aria-label={
                  isDark ? 'Switch to light mode' : 'Switch to dark mode'
                }
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </ThemeButton>
            </BottomControls>
            <AuthButtonWrapper>
              {isAuthenticated ? (
                <Button onClick={handleSignOut} variant="outline" fullWidth>
                  <LogOut size={16} style={{ marginRight: '8px' }} />
                  {t('nav.signOut')}
                </Button>
              ) : (
                <Button onClick={handleSignIn} fullWidth>
                  <LogIn size={16} style={{ marginRight: '8px' }} />
                  {t('nav.signIn')}
                </Button>
              )}
            </AuthButtonWrapper>
          </BottomBar>
        </Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
