import { useState } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import useDemoScrollspy from './useDemoScrollspy';

// ─── Styled components ─────────────────────────────────────────────────────────

const Nav = styled.nav`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const GroupHeading = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};
  padding: 0.75rem 1.25rem 0.25rem;
  margin-top: 0.5rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const NavItem = styled.a`
  display: block;
  padding: 0.375rem 1.25rem;
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) =>
    p['data-active'] === 'true' ? p.theme.colors.primary : p.theme.colors.text};
  font-weight: ${(p) =>
    p['data-active'] === 'true'
      ? p.theme.typography.fontWeights.semibold
      : p.theme.typography.fontWeights.normal};
  text-decoration: none;
  border-left: 2px solid
    ${(p) =>
      p['data-active'] === 'true' ? p.theme.colors.primary : 'transparent'};
  transition:
    color ${(p) => p.theme.transitions.fast},
    border-color ${(p) => p.theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const CollapsibleGroupBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1.25rem 0.25rem;
  margin-top: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.textMuted};

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`;

const ChevronIcon = styled.span`
  display: inline-block;
  transition: transform ${(p) => p.theme.transitions.fast};
  transform: ${(p) => (p['data-open'] === 'true' ? 'rotate(90deg)' : 'none')};
  font-size: 0.75rem;
`;

// Mobile overlay
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${(p) => p.theme.colors.overlay};
  z-index: ${(p) => p.theme.zIndex.modal - 1};
`;

const DrawerPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: ${(p) => p.theme.colors.background};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  overflow-y: auto;
  z-index: ${(p) => p.theme.zIndex.modal};
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const DrawerTitle = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.25rem;

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`;

// ─── Nav content ───────────────────────────────────────────────────────────────

const COLLAPSIBLE_GROUP = 'dev';

function NavContent({ sections, activeId, onItemClick }) {
  const [devOpen, setDevOpen] = useState(false);

  // Group sections by group key
  const groups = sections.reduce((acc, section) => {
    if (!acc[section.group]) acc[section.group] = [];
    acc[section.group].push(section);
    return acc;
  }, {});

  const GROUP_LABELS = {
    tokens: 'Design Tokens',
    components: 'Components',
    motion: 'Motion & Animation',
    dev: 'Developer Utilities',
  };

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onItemClick?.();
  };

  return (
    <Nav>
      {Object.entries(groups).map(([group, items]) => {
        const label = GROUP_LABELS[group] || group;
        const isCollapsible = group === COLLAPSIBLE_GROUP;

        if (isCollapsible) {
          return (
            <div key={group}>
              <CollapsibleGroupBtn
                onClick={() => setDevOpen((v) => !v)}
                aria-expanded={devOpen}
              >
                <span>▸ {label}</span>
                <ChevronIcon data-open={String(devOpen)}>›</ChevronIcon>
              </CollapsibleGroupBtn>
              {devOpen &&
                items.map((s) => (
                  <NavItem
                    key={s.id}
                    href={`#${s.id}`}
                    data-active={String(activeId === s.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(s.id);
                    }}
                  >
                    {s.label}
                  </NavItem>
                ))}
            </div>
          );
        }

        return (
          <div key={group}>
            <GroupHeading>{label}</GroupHeading>
            {items.map((s) => (
              <NavItem
                key={s.id}
                href={`#${s.id}`}
                data-active={String(activeId === s.id)}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(s.id);
                }}
              >
                {s.label}
              </NavItem>
            ))}
          </div>
        );
      })}
    </Nav>
  );
}

// ─── DemoSidebar ───────────────────────────────────────────────────────────────

/**
 * Sidebar navigation for the Demo page.
 * On desktop: renders inline nav.
 * When drawerOpen + mobileDrawer=true: renders a slide-in drawer overlay.
 *
 * @prop {Array}    sections     - [{ id, label, group }]
 * @prop {boolean}  mobileDrawer - true when this is the mobile drawer instance
 * @prop {boolean}  drawerOpen   - controls drawer visibility
 * @prop {function} onClose      - called when drawer should close
 */
function DemoSidebar({ sections, mobileDrawer, drawerOpen, onClose }) {
  const sectionIds = sections.map((s) => s.id);
  const activeId = useDemoScrollspy(sectionIds);

  if (mobileDrawer) {
    return (
      <AnimatePresence>
        {drawerOpen && (
          <>
            <Backdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <DrawerPanel
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <DrawerHeader>
                <DrawerTitle>Contents</DrawerTitle>
                <CloseBtn onClick={onClose} aria-label="Close navigation">
                  ✕
                </CloseBtn>
              </DrawerHeader>
              <NavContent
                sections={sections}
                activeId={activeId}
                onItemClick={onClose}
              />
            </DrawerPanel>
          </>
        )}
      </AnimatePresence>
    );
  }

  return <NavContent sections={sections} activeId={activeId} />;
}

export default DemoSidebar;
