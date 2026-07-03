/**
 * @module components/Sidebar
 * @description Desktop sidebar navigation with category links.
 * Shows logo at top and category list. Collapsible on mobile via hamburger menu.
 */
import styled from '@emotion/styled';
import { Coffee, Salad, UtensilsCrossed, Cookie, Wine } from 'lucide-react';
import menuData from '../data/menu.json';

const SidebarWrapper = styled.aside`
  position: fixed;
  top: 64px;
  left: 0;
  width: 250px;
  height: calc(100vh - 64px);
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  transition: transform ${({ theme }) => theme.transitions.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: ${({ isOpen }) =>
      isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const CategoryList = styled.nav`
  padding: ${({ theme }) => theme.spacing.s4} 0;
`;

const CategoryItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s3};
  padding: ${({ theme }) => theme.spacing.s3} ${({ theme }) => theme.spacing.s4};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ theme, active }) =>
    active
      ? theme.typography.fontWeights.semibold
      : theme.typography.fontWeights.regular};

  &:hover {
    background: ${({ theme }) => theme.colors.secondaryBackground};
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CategoryName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
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
 * Sidebar component with category navigation
 * @param {Object} props
 * @param {string} props.activeCategory - Currently active category ID
 * @param {Function} props.onCategoryClick - Callback when category is clicked
 * @param {boolean} props.isOpen - Whether sidebar is open (mobile)
 * @returns {JSX.Element}
 */
export default function Sidebar({
  activeCategory,
  onCategoryClick,
  isOpen = false,
}) {
  const categories = menuData.categories.sort((a, b) => a.order - b.order);

  return (
    <SidebarWrapper isOpen={isOpen}>
      <CategoryList>
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.id] || UtensilsCrossed;
          return (
            <CategoryItem
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => onCategoryClick(category.id)}
              aria-label={`View ${category.name}`}
            >
              <Icon />
              <CategoryName>{category.name}</CategoryName>
            </CategoryItem>
          );
        })}
      </CategoryList>
    </SidebarWrapper>
  );
}
