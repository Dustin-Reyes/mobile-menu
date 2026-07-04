/**
 * @module components/MenuSection
 * @description Section component to group and display menu items in a responsive grid.
 */
import styled from '@emotion/styled';
import MenuItemCard from './MenuItemCard';

const SectionWrapper = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.s8};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.s4};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.s6};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.s7};
  }
`;

const ViewAllLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.s4};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.s6};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.s8} ${({ theme }) => theme.spacing.s4};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
`;

/**
 * MenuSection component
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {Array} props.items - Array of menu items to display
 * @param {boolean} props.showViewAll - Whether to show "View All" link
 * @param {Function} props.onViewAll - Callback for "View All" click
 * @param {Function} props.onItemClick - Callback for item click
 * @param {boolean} props.showCategory - Whether to show category badge on cards
 * @returns {JSX.Element}
 */
export default function MenuSection({
  title,
  items = [],
  showViewAll = false,
  onViewAll,
  onItemClick,
  showCategory = false,
}) {
  if (items.length === 0) {
    return (
      <SectionWrapper>
        <SectionHeader>
          <Title>{title}</Title>
        </SectionHeader>
        <EmptyState>No items available in this category</EmptyState>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <SectionHeader>
        <Title>{title}</Title>
        {showViewAll && onViewAll && (
          <ViewAllLink onClick={onViewAll}>View All →</ViewAllLink>
        )}
      </SectionHeader>
      <Grid>
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            showCategory={showCategory}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </Grid>
    </SectionWrapper>
  );
}
