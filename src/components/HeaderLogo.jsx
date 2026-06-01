import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import PROJECT_CONFIG from 'config/project';

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: 0.04em;
  transition: color ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function HeaderLogo() {
  return (
    <LogoLink to="/" aria-label={`${PROJECT_CONFIG.name} – Home`}>
      {PROJECT_CONFIG.name}
    </LogoLink>
  );
}

export default HeaderLogo;
