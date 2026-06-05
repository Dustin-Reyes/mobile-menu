import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from './ThemeProvider';
import PROJECT_CONFIG from 'config/project';
import { usePage } from 'hooks/useContent';

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

function HeaderLogo() {
  const { isDark } = useTheme();
  const { content: siteContent } = usePage('site');

  // Use CMS link URL if set, otherwise default to home
  const linkUrl = siteContent?.header?.linkUrl || '/';

  return (
    <LogoLink to={linkUrl} aria-label={`${PROJECT_CONFIG.name} – Home`}>
      <LogoImage
        src={isDark ? '/Transpiled-W.webp' : '/Transpiled-B.webp'}
        alt={PROJECT_CONFIG.name}
      />
    </LogoLink>
  );
}

export default HeaderLogo;
