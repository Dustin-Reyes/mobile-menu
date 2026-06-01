import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
`;

const LogoImg = styled.img`
  height: 38px;
  width: auto;
  object-fit: contain;
  /* Invert white logo to black in light mode — same file, same dimensions, no layout shift */
  filter: ${({ theme }) => (theme.mode === 'light' ? 'brightness(0)' : 'none')};
  transition:
    filter ${({ theme }) => theme.transitions.base},
    opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: ${({ theme }) => theme.opacity.hover};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 46px;
  }
`;

function HeaderLogo() {
  return (
    <LogoLink to="/" aria-label="Titan Demo – Home">
      <LogoImg
        src="/titan-logo-clean-wordmark-white-transparent.png"
        alt="Titan Demo"
      />
    </LogoLink>
  );
}

export default HeaderLogo;
