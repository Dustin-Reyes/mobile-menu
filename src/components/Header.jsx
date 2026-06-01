import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { navigation } from '../content/navigation';
import useActiveSection from 'hooks/useActiveSection';
import useBodyScrollLock from 'hooks/useBodyScrollLock';
import useScrollToSection from 'hooks/useScrollToSection';
import HeaderLogo from './HeaderLogo';
import HeaderDesktopNav from './HeaderDesktopNav';
import HeaderControls from './HeaderControls';
import HeaderMobileMenu from './HeaderMobileMenu';

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
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.s2};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.s6};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
  }
`;

const navItems = navigation.main;
const sectionIds = navItems.map((item) => item.sectionId).filter(Boolean);

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useActiveSection(sectionIds);
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useBodyScrollLock(menuOpen);

  // Handle scroll before navigation
  const handleBeforeScroll = useCallback(
    (sectionId) => {
      setMenuOpen(false);
      if (!sectionId) setActiveSection('home');
    },
    [setActiveSection],
  );

  const scrollToSection = useScrollToSection({
    onBeforeScroll: handleBeforeScroll,
  });

  return (
    <>
      <Wrapper>
        <Inner>
          <HeaderLogo />
          <HeaderDesktopNav
            navItems={navItems}
            activeId={activeSection}
            lang={lang}
            onNavigate={scrollToSection}
          />
          <HeaderControls
            menuOpen={menuOpen}
            onMenuToggle={() => setMenuOpen((prev) => !prev)}
            onNavigate={scrollToSection}
          />
        </Inner>
      </Wrapper>

      <HeaderMobileMenu
        open={menuOpen}
        navItems={navItems}
        activeId={activeSection}
        lang={lang}
        onNavigate={scrollToSection}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

export default Header;
