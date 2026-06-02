import styled from '@emotion/styled';

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.background};
  transition: border-color ${(p) => p.theme.transitions.fast};
  outline: none;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${(p) => p.theme.colors.border};
  }
`;

export default Input;
