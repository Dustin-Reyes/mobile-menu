import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTheme } from './ThemeProvider';
import PROJECT_CONFIG from 'config/project';

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

  return (
    <LogoLink to="/" aria-label={`${PROJECT_CONFIG.name} – Home`}>
      <LogoImage
        src={isDark ? '/Transpiled-W.webp' : '/Transpiled-B.webp'}
        alt={PROJECT_CONFIG.name}
      />
    </LogoLink>
  );
}

export default HeaderLogo;
