import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import useAnimationConfig from 'hooks/useAnimationConfig';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: 0;
  font-family: ${(p) => p.theme.typography.fontFamilies.sans};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  border: 2px solid transparent;

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${(p) =>
    (!p.variant || p.variant === 'primary') &&
    `
    background: ${p.theme.colors.primary};
    color: ${p.theme.colors.onPrimary};
    border-color: ${p.theme.colors.primary};
    &:hover:not(:disabled) { opacity: 0.88; }
    &:active:not(:disabled) { opacity: 0.76; }
  `}

  ${(p) =>
    p.variant === 'secondary' &&
    `
    background: ${p.theme.colors.secondary};
    color: ${p.theme.colors.onPrimary};
    border-color: ${p.theme.colors.secondary};
    &:hover:not(:disabled) { opacity: 0.88; }
    &:active:not(:disabled) { opacity: 0.76; }
  `}

  ${(p) =>
    p.variant === 'outline' &&
    `
    background: rgba(0, 0, 0, 0.75);
    color: ${p.theme.colors.onDark};
    border-color: ${p.theme.colors.primary};
    &:hover:not(:disabled) { background: ${p.theme.colors.primary}; color: ${p.theme.colors.onPrimary}; }
    &:active:not(:disabled) { background: ${p.theme.colors.secondary}; color: ${p.theme.colors.onPrimary}; border-color: ${p.theme.colors.secondary}; }
  `}

  ${(p) =>
    p.variant === 'ghost' &&
    `
    background: transparent;
    color: ${p.theme.colors.text};
    border-color: transparent;
    &:hover:not(:disabled) { background: ${p.theme.colors.border}; }
    &:active:not(:disabled) { background: ${p.theme.colors.border}cc; }
  `}
`;

const MotionButton = motion(StyledButton);

/**
 * Button component with optional Framer Motion micro-interactions.
 * Set `motion={true}` to enable animations. Respects prefers-reduced-motion.
 */
const Button = React.forwardRef(
  ({ motion: enableMotion = false, children, ...props }, ref) => {
    const { buttonPress } = useAnimationConfig();

    if (enableMotion) {
      return (
        <MotionButton ref={ref} {...buttonPress} {...props}>
          {children}
        </MotionButton>
      );
    }

    return (
      <StyledButton ref={ref} {...props}>
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;
