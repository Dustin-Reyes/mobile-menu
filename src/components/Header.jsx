import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from 'context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderLogo from './HeaderLogo';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s4};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileTrigger = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &[data-active='true'] {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }
`;

const ThemeBtn = styled.button`
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

function Header() {
  const { isDark, toggleMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Wrapper>
      <Inner>
        <HeaderLogo />
        <Nav>
          <NavLink to="/" data-active={isActive('/')}>
            Home
          </NavLink>
          <NavLink to="/about" data-active={isActive('/about')}>
            About
          </NavLink>
        </Nav>
        <MobileTrigger>
          <MobileMenu />
        </MobileTrigger>
        <Controls>
          <LanguageSwitcher compact />
          <ThemeBtn
            onClick={toggleMode}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </ThemeBtn>
          {isAuthenticated && <UserMenu />}
        </Controls>
      </Inner>
    </Wrapper>
  );
}

export default Header;
