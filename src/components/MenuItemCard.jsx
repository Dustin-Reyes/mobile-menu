/**
 * @module components/MenuItemCard
 * @description Minimal menu item card displaying food image, name, description, and price.
 */
import styled from '@emotion/styled';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.s2};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.s4};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  background: ${({ theme }) => theme.colors.secondaryBackground};
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.s4};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.s2};
  margin-bottom: ${({ theme }) => theme.spacing.s2};
`;

const Name = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  flex: 1;
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.s3};
  padding: ${({ theme }) => theme.spacing.s1} ${({ theme }) => theme.spacing.s2};
  background: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-transform: capitalize;
`;

/**
 * MenuItemCard component - minimal version
 * @param {Object} props
 * @param {Object} props.item - Menu item data
 * @param {string} props.item.name - Item name
 * @param {string} props.item.description - Item description
 * @param {number} props.item.price - Item price
 * @param {string} props.item.image - Image URL
 * @param {string} props.item.category - Category name
 * @param {boolean} props.showCategory - Whether to show category badge
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element}
 */
export default function MenuItemCard({ item, showCategory = false, onClick }) {
  const handleImageError = (e) => {
    e.target.src = '/images/menu/placeholder.svg';
  };

  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <Image
          src={item.image || '/images/menu/placeholder.svg'}
          alt={item.name}
          onError={handleImageError}
          loading="lazy"
        />
      </ImageContainer>
      <Content>
        <Header>
          <Name>{item.name}</Name>
          <Price>${item.price.toFixed(2)}</Price>
        </Header>
        <Description>{item.description}</Description>
        {showCategory && <CategoryBadge>{item.category}</CategoryBadge>}
      </Content>
    </Card>
  );
}
