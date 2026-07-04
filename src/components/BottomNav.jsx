/**
 * @module components/BottomNav
 * @description Fixed bottom navigation for mobile devices.
 * Visual only - no routing functionality (for template purposes).
 */
import styled from '@emotion/styled';
import {
  Home,
  UtensilsCrossed,
  ClipboardList,
  Heart,
  User,
} from 'lucide-react';

const NavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  box-shadow: 0 -2px 8px ${({ theme }) => theme.colors.shadow};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s1};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s2};
  min-width: 64px;
  min-height: 48px;
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.textSecondary};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s1};
  font-weight: ${({ theme, active }) =>
    active
      ? theme.typography.fontWeights.semibold
      : theme.typography.fontWeights.regular};
`;

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
];

/**
 * BottomNav component - mobile only
 * @param {Object} props
 * @param {string} props.activeItem - Currently active nav item ID
 * @param {Function} props.onItemClick - Callback when nav item is clicked
 * @returns {JSX.Element}
 */
export default function BottomNav({ activeItem = 'menu', onItemClick }) {
  return (
    <NavWrapper>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;

        return (
          <NavItem
            key={item.id}
            active={isActive}
            onClick={() => onItemClick?.(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon />
            <Label active={isActive}>{item.label}</Label>
          </NavItem>
        );
      })}
    </NavWrapper>
  );
}
