/**
 * @module components/Header
 * @description Minimal sticky header for the menu app containing the logo,
 * theme toggle, and language switcher.
 */
import styled from '@emotion/styled';
import { Sun, Moon } from 'lucide-react';
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
    background: ${({ theme }) => theme.colors.secondaryBackground};
  }
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
          <LanguageSwitcher compact />
          <ThemeBtn
            onClick={toggleMode}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </ThemeBtn>
        </Controls>
      </Inner>
    </Wrapper>
  );
}

export default Header;
