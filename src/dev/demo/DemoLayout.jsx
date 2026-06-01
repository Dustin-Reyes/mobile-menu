import { useState } from 'react';
import styled from '@emotion/styled';
import DemoSidebar from './DemoSidebar';

// ─── Styled layout ─────────────────────────────────────────────────────────────

const PageRoot = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  transition:
    background 0.2s ease,
    color 0.2s ease;
`;

const LayoutBody = styled.div`
  display: flex;
  /* Push content below the absolute-positioned Header (~5rem) */
  padding-top: 5rem;

  @media (max-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding-top: 5rem;
  }
`;

const SidebarWrapper = styled.aside`
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 8rem;
  height: calc(100vh - 5rem);
  overflow-y: auto;
  border-right: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  margin-top: 4rem;

  /* Hide scrollbar visually but keep it functional */
  scrollbar-width: thin;
  scrollbar-color: ${(p) => p.theme.colors.border} transparent;

  @media (max-width: ${(p) => p.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  min-width: 0;
  padding: 0 2.5rem 4rem;

  @media (max-width: ${(p) => p.theme.breakpoints.desktop}) {
    padding: 0 1.5rem 3rem;
  }

  @media (max-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding: 0 1rem 3rem;
  }
`;

const MobileTopBar = styled.div`
  display: none;
  position: sticky;
  top: 0;
  z-index: ${(p) => p.theme.zIndex.sticky};
  background: ${(p) => p.theme.colors.background};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  padding: 0.625rem 1rem;

  @media (max-width: ${(p) => p.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const ContentsBtn = styled.button`
  background: none;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  padding: 0.375rem 0.75rem;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  cursor: pointer;
  transition: background ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => p.theme.colors.surface};
  }
`;

// ─── DemoLayout ────────────────────────────────────────────────────────────────

/**
 * Docs-style layout for the Demo page.
 * Desktop: sticky 240px sidebar + scrollable content area.
 * Mobile: sidebar hidden, sticky "Contents ☰" button opens a slide-in drawer.
 *
 * @prop {Array}    sections  - Passed to DemoSidebar [{ id, label, group }]
 * @prop {ReactNode} children - Section content
 */
function DemoLayout({ sections, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <PageRoot>
      <LayoutBody>
        {/* Desktop sidebar */}
        <SidebarWrapper>
          <DemoSidebar sections={sections} />
        </SidebarWrapper>

        {/* Main content */}
        <ContentArea>
          <MobileTopBar>
            <ContentsBtn onClick={() => setDrawerOpen(true)}>
              ☰ Contents
            </ContentsBtn>
          </MobileTopBar>
          {children}
        </ContentArea>
      </LayoutBody>

      {/* Mobile drawer */}
      <DemoSidebar
        sections={sections}
        mobileDrawer
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </PageRoot>
  );
}

export default DemoLayout;
