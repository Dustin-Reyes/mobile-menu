/**
 * @module components/HeaderControls
 * @description Right-side header control group containing the language switcher,
 * theme toggle button, a desktop-only CTA button, and a mobile hamburger toggle.
 * Desktop-only elements are hidden below the desktop breakpoint.
 */
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import LanguageSwitcher from './LanguageSwitcher';

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s1};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.s2};
  }
`;

const DesktopOnly = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: flex;
    align-items: center;
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
    background: ${({ theme }) => theme.colors.secondaryBackground};
  }
`;

const CTAButton = styled.button`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s0};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.s2};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s1} ${({ theme }) => theme.spacing.s3};
  border-radius: ${({ theme }) => theme.borderRadius.s0};
  white-space: nowrap;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateX(2px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: flex;
  }
`;

const HamburgerBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s0};
  border-radius: ${({ theme }) => theme.borderRadius.s1};
  color: ${({ theme }) => theme.colors.text};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: none;
  }
`;

/**
 * @param {Object} props
 * @param {boolean} props.menuOpen - Whether the mobile menu is currently open.
 * @param {Function} props.onMenuToggle - Callback to toggle the mobile menu open/closed.
 * @param {Function} props.onNavigate - Callback to scroll/navigate to a section by ID.
 * @returns {JSX.Element}
 */
function HeaderControls({ menuOpen, onMenuToggle, onNavigate }) {
  const { isDark, toggleMode } = useTheme();
  const { t } = useTranslation();

  return (
    <RightGroup>
      <DesktopOnly>
        <LanguageSwitcher compact />
      </DesktopOnly>

      <DesktopOnly>
        <ThemeBtn
          onClick={toggleMode}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </ThemeBtn>
      </DesktopOnly>

      <CTAButton onClick={() => onNavigate('contact-form')}>
        {t('nav.getAQuote')}
        <ArrowRight size={15} aria-hidden="true" />
      </CTAButton>

      <HamburgerBtn
        onClick={onMenuToggle}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </HamburgerBtn>
    </RightGroup>
  );
}

export default HeaderControls;
