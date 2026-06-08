/**
 * Dropdown menu components built on Radix UI DropdownMenu with themed styling.
 * @module components/ui/DropdownMenu
 */
import styled from '@emotion/styled';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

/** Radix DropdownMenu.Root — manages open state. */
export const DropdownMenuRoot = RadixDropdownMenu.Root;
/** Radix DropdownMenu.Trigger — the element that opens the menu when activated. */
export const DropdownMenuTrigger = RadixDropdownMenu.Trigger;
/** Radix DropdownMenu.Portal — renders menu content outside the DOM hierarchy. */
export const DropdownMenuPortal = RadixDropdownMenu.Portal;

/** Floating menu panel with shadow, border, and slide-in animation. */
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

/** Individual interactive menu row with highlighted and disabled states. */
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

/** Thin horizontal rule used to group related menu items. */
export const DropdownMenuSeparator = styled(RadixDropdownMenu.Separator)`
  height: 1px;
  background: ${(p) => p.theme.colors.border};
  margin: 0.375rem 0;
`;
