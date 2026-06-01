import styled from '@emotion/styled';
import * as RadixTabs from '@radix-ui/react-tabs';

export const TabsRoot = styled(RadixTabs.Root)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TabsList = styled(RadixTabs.List)`
  display: flex;
  border-bottom: 2px solid ${(p) => p.theme.colors.border};
  gap: 0;
`;

export const TabsTrigger = styled(RadixTabs.Trigger)`
  padding: 0.625rem 1.25rem;
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => p.theme.colors.textSecondary};
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }

  &[data-state='active'] {
    color: ${(p) => p.theme.colors.primary};
    border-bottom-color: ${(p) => p.theme.colors.primary};
    font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${(p) => p.theme.borderRadius.s0};
  }
`;

export const TabsContent = styled(RadixTabs.Content)`
  padding: 1.25rem 0;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${(p) => p.theme.borderRadius.s0};
  }
`;
