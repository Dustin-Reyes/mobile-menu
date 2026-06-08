/**
 * @module components/HeaderLogo
 * @description Linked site logo that switches between light and dark image
 * variants based on the active theme. Clicking it scrolls instantly to the top
 * of the page and navigates to the URL configured in CMS site content.
 */
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from './ThemeProvider';
import PROJECT_CONFIG from 'config/project';
import { usePage } from 'hooks/useContent';
import { useCallback } from 'react';

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.img`
  height: 32px;
  width: auto;
`;

/**
 * @returns {JSX.Element}
 */
function HeaderLogo() {
  const { isDark } = useTheme();
  const { content: siteContent } = usePage('site');

  // Use CMS link URL if set, otherwise default to home
  const linkUrl = siteContent?.header?.linkUrl || '/';

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <LogoLink
      to={linkUrl}
      aria-label={`${PROJECT_CONFIG.name} – Home`}
      onClick={handleClick}
    >
      <LogoImage
        src={isDark ? '/Transpiled-W.webp' : '/Transpiled-B.webp'}
        alt={PROJECT_CONFIG.name}
      />
    </LogoLink>
  );
}

export default HeaderLogo;
