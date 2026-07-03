/**
 * @module components/MainLayout
 * @description Main layout wrapper combining Sidebar and content area.
 * Handles responsive layout with sidebar on desktop, drawer on mobile.
 */
import { useState } from 'react';
import styled from '@emotion/styled';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
  position: relative;
`;

const MobileMenuButton = styled.button`
  position: fixed;
  top: 76px;
  left: ${({ theme }) => theme.spacing.s4};
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.s3};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.s4};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndex.dropdown - 1};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'all' : 'none')};
  transition: opacity ${({ theme }) => theme.transitions.normal};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  margin-left: 0;
  padding: ${({ theme }) => theme.spacing.s6} ${({ theme }) => theme.spacing.s4};
  background: ${({ theme }) => theme.colors.background};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 250px;
    padding: ${({ theme }) => theme.spacing.s6};
  }
`;

/**
 * MainLayout component - wraps sidebar and content
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render in main area
 * @param {string} props.activeCategory - Currently active category
 * @param {Function} props.onCategoryChange - Callback when category changes
 * @returns {JSX.Element}
 */
export default function MainLayout({
  children,
  activeCategory,
  onCategoryChange,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <LayoutWrapper>
      <MobileMenuButton onClick={toggleSidebar} aria-label="Toggle menu">
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </MobileMenuButton>

      <Overlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
        isOpen={sidebarOpen}
      />

      <ContentArea>{children}</ContentArea>
    </LayoutWrapper>
  );
}
