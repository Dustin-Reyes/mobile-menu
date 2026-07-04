/**
 * @module components/Header
 * @description Minimal sticky header for the menu app containing the logo,
 * theme toggle, and language switcher.
 */
import styled from '@emotion/styled';
import { Sun, Moon, Search, Bell } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderLogo from './HeaderLogo';

const Wrapper = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.surface : theme.colors.background};
  border-bottom: 3px solid ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.s2};
`;

const Inner = styled.div`
  max-width: 2000px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.s4};
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.s6};
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s2};
`;

const IconBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s2};
  border-radius: ${({ theme }) => theme.borderRadius.s1};
  color: ${({ theme }) => theme.colors.text};
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.secondaryBackground};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'flex')};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: ${({ theme }) => theme.colors.error || '#ef4444'};
  color: white;
  border-radius: 9px;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

/**
 * @returns {JSX.Element}
 */
function Header() {
  const { isDark, toggleMode } = useTheme();

  return (
    <Wrapper>
      <Inner>
        <HeaderLogo />
        <Controls>
          {/* Mobile-only search icon */}
          <IconBtn
            hideOnDesktop
            onClick={() => console.log('Search clicked')}
            aria-label="Search"
          >
            <Search size={20} />
          </IconBtn>

          {/* Mobile-only notification bell */}
          <IconBtn
            hideOnDesktop
            onClick={() => console.log('Notifications clicked')}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <NotificationBadge>2</NotificationBadge>
          </IconBtn>

          {/* Desktop controls */}
          <LanguageSwitcher compact />
          <IconBtn
            onClick={toggleMode}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </IconBtn>
        </Controls>
      </Inner>
    </Wrapper>
  );
}

export default Header;
