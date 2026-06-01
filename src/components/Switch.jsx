import styled from '@emotion/styled';
import * as RadixSwitch from '@radix-ui/react-switch';

export const SwitchRoot = styled(RadixSwitch.Root)`
  position: relative;
  width: 60px;
  height: 32px;
  background: ${(p) => p.theme.colors.surface};
  border: 2px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s100};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.base};
  padding: 0;
  flex-shrink: 0;

  &[data-state='checked'] {
    border-color: ${(p) => p.theme.colors.primary};
  }

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const SwitchThumb = styled(RadixSwitch.Thumb)`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primary} 0%,
    ${(p) => p.theme.colors.secondary} 100%
  );
  border-radius: ${(p) => p.theme.borderRadius.s100};
  transition: transform ${(p) => p.theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.onPrimary || '#ffffff'};
  box-shadow: ${(p) => p.theme.shadows.s0};

  &[data-state='checked'] {
    transform: translateX(26px);
  }
`;
