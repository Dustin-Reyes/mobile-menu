/**
 * @module components/CategoryPills
 * @description Horizontal scrollable category selector with icons.
 * Allows filtering menu items by category.
 */
import styled from '@emotion/styled';
import { Coffee, Salad, UtensilsCrossed, Cookie, Wine } from 'lucide-react';
import menuData from '../data/menu.json';

const PillsWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.s6};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PillsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s3};
  padding: ${({ theme }) => theme.spacing.s2} 0;
  min-width: min-content;
`;

const Pill = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s2};
  padding: ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s4};
  background: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, active }) =>
    active ? theme.colors.onPrimary : theme.colors.text};
  border: 2px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s4};
  cursor: pointer;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-weight: ${({ theme, active }) =>
    active
      ? theme.typography.fontWeights.semibold
      : theme.typography.fontWeights.regular};
  transition: all ${({ theme }) => theme.transitions.fast};
  min-height: 44px;

  &:hover {
    background: ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.secondaryBackground};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Map category IDs to icons
const CATEGORY_ICONS = {
  drinks: Wine,
  appetizers: Salad,
  entrees: UtensilsCrossed,
  sides: Coffee,
  desserts: Cookie,
};

/**
 * CategoryPills component
 * @param {Object} props
 * @param {string} props.activeCategory - Currently active category ID
 * @param {Function} props.onCategoryClick - Callback when category is clicked
 * @returns {JSX.Element}
 */
export default function CategoryPills({ activeCategory, onCategoryClick }) {
  const categories = menuData.categories.sort((a, b) => a.order - b.order);

  return (
    <PillsWrapper>
      <PillsContainer>
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.id] || UtensilsCrossed;
          return (
            <Pill
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => onCategoryClick(category.id)}
              aria-label={`Filter by ${category.name}`}
              aria-pressed={activeCategory === category.id}
            >
              <Icon />
              {category.name}
            </Pill>
          );
        })}
      </PillsContainer>
    </PillsWrapper>
  );
}
