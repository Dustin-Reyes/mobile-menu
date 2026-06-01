import styled from '@emotion/styled';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

export const DropdownMenuRoot = RadixDropdownMenu.Root;
export const DropdownMenuTrigger = RadixDropdownMenu.Trigger;
export const DropdownMenuPortal = RadixDropdownMenu.Portal;

export const DropdownMenuContent = styled(RadixDropdownMenu.Content)`
  min-width: 180px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 0.375rem;
  box-shadow: ${(p) => p.theme.shadows.s3};
  z-index: ${(p) => p.theme.zIndex.dropdown || 100};

  @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: slideDownAndFade 0.15s ease;
`;

export const DropdownMenuItem = styled(RadixDropdownMenu.Item)`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  outline: none;
  transition: background ${(p) => p.theme.transitions.fast};
  user-select: none;

  &[data-highlighted] {
    background: ${(p) => p.theme.colors.primary}18;
    color: ${(p) => p.theme.colors.primary};
  }

  &[data-disabled] {
    color: ${(p) => p.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

export const DropdownMenuSeparator = styled(RadixDropdownMenu.Separator)`
  height: 1px;
  background: ${(p) => p.theme.colors.border};
  margin: 0.375rem 0;
`;
