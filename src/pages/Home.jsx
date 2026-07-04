/**
 * Home page — Main menu display page.
 *
 * Displays the complete menu with sidebar navigation, category filtering,
 * and menu item cards in a responsive grid layout.
 *
 * @returns {JSX.Element}
 */
import { useState, useMemo } from 'react';
import MainLayout from '../components/MainLayout';
import UserGreeting from '../components/UserGreeting';
import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import MenuSection from '../components/MenuSection';
import BottomNav from '../components/BottomNav';
import menuData from '../data/menu.json';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(
    menuData.categories[0]?.id,
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items by active category
  const filteredItems = useMemo(() => {
    if (!activeCategory) return menuData.items;
    return menuData.items.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Get active category data
  const activeCategoryData = useMemo(() => {
    return menuData.categories.find((cat) => cat.id === activeCategory);
  }, [activeCategory]);

  // Get popular items (first 6 items from current category)
  const popularItems = useMemo(() => {
    return filteredItems.filter((item) => item.available).slice(0, 6);
  }, [filteredItems]);

  // Get all available items from current category
  const allItems = useMemo(() => {
    return filteredItems.filter((item) => item.available);
  }, [filteredItems]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
    // TODO: Add item detail modal or navigation
  };

  return (
    <MainLayout
      activeCategory={activeCategory}
      onCategoryChange={handleCategoryChange}
    >
      <UserGreeting name="Guest" />

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFilterClick={() => console.log('Filter clicked')}
      />

      <CategoryPills
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryChange}
      />

      {popularItems.length > 0 && (
        <MenuSection
          title="Popular Food"
          items={popularItems}
          showViewAll={allItems.length > popularItems.length}
          onViewAll={() => console.log('View all popular items')}
          onItemClick={handleItemClick}
        />
      )}

      {allItems.length > 0 && (
        <MenuSection
          title={activeCategoryData?.name || 'Menu Items'}
          items={allItems}
          onItemClick={handleItemClick}
        />
      )}

      <BottomNav
        activeItem="menu"
        onItemClick={(itemId) => console.log('Nav item clicked:', itemId)}
      />
    </MainLayout>
  );
}
