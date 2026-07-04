/**
 * @module components/MenuItemCard
 * @description Minimal menu item card displaying food image, name, description, and price.
 */
import styled from '@emotion/styled';
import { Star, Heart, ShoppingCart } from 'lucide-react';

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

const FavoriteButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.s3};
  right: ${({ theme }) => theme.spacing.s3};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.s2};
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 2;

  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }
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
  padding: ${({ theme }) => theme.spacing.s3};
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

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.s3};
  gap: ${({ theme }) => theme.spacing.s2};
`;

const Rating = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};

  svg {
    width: 16px;
    height: 16px;
    fill: #fbbf24;
    color: #fbbf24;
  }
`;

const PriceTag = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: #10b981;
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.s3};
  left: ${({ theme }) => theme.spacing.s3};
  padding: ${({ theme }) => theme.spacing.s1} ${({ theme }) => theme.spacing.s2};
  background: #10b981;
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-transform: capitalize;
  z-index: 2;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s2};
  margin-top: ${({ theme }) => theme.spacing.s3};
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s2};
  padding: ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s4};
  background: #dc2626;
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-height: 40px;

  &:hover {
    background: #b91c1c;
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

const HeartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: #dc2626;
    background: #fee2e2;
  }

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.text};
  }

  &:hover svg {
    color: #dc2626;
  }
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

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Add to cart:', item.name);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    console.log('Toggle favorite:', item.name);
  };

  // Mock rating - in real app this would come from item data
  const rating = item.rating || 4.5;

  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <Image
          src={item.image || '/images/menu/placeholder.svg'}
          alt={item.name}
          onError={handleImageError}
          loading="lazy"
        />
        {showCategory && <CategoryBadge>{item.category}</CategoryBadge>}
        <FavoriteButton onClick={handleFavorite} aria-label="Add to favorites">
          <Heart />
        </FavoriteButton>
      </ImageContainer>
      <Content>
        <Header>
          <Name>{item.name}</Name>
        </Header>
        <Description>{item.description}</Description>
        <Footer>
          <Rating>
            <Star />
            {rating.toFixed(1)}
          </Rating>
          <PriceTag>{item.price.toFixed(0)} EGP</PriceTag>
        </Footer>
        <Actions>
          <AddToCartButton onClick={handleAddToCart}>
            <ShoppingCart />
            Add to Cart
          </AddToCartButton>
          <HeartButton onClick={handleFavorite} aria-label="Add to favorites">
            <Heart />
          </HeartButton>
        </Actions>
      </Content>
    </Card>
  );
}
