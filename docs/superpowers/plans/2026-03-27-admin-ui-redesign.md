# Admin Dashboard UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `AdminDashboard.jsx` so the entire admin page matches the ContentEditor's design language — 160px grouped sidebar, glass cards, teal accents, compact empty states, and a mobile bottom tab bar.

**Architecture:** All changes are contained in `src/components/AdminDashboard.jsx`. No new files. No logic changes — only styled component definitions and JSX structure. The `ContentEditor` and its sub-components are untouched.

**Tech Stack:** React 18, Emotion styled-components, Lucide icons (already imported), `useMediaQuery` hook (already exists at `src/hooks/useMediaQuery.js`).

---

## Context

`src/components/AdminDashboard.jsx` (1193 lines) has:
- A 280px sidebar with a full-teal active background on nav items
- A global `<Header>` that shows "CMS Dashboard" above every tab
- `StatCard` components with colored `StatIcon` badge boxes
- `EmptyState` with 48px icons and buttons inside the empty state
- Hardcoded `border: '1px solid #e2e8f0'` in Analytics tab JSX
- No mobile responsiveness

The `ContentEditor` (already built, untouched) uses `rgba(255,255,255,0.03)` glass cards, `rgba(255,255,255,0.06)` borders, and `${theme.colors.primary}` teal accents. This plan extends those exact values to the whole admin shell.

---

## File Map

| File | Change |
|------|--------|
| `src/components/AdminDashboard.jsx` | Full styled-component replacement + JSX restructure. Logic/handlers untouched. |

---

## Task 1 — Replace Shell Styled Components

Replace the outer shell styled components: `AdminContainer`, `Sidebar`, `Logo`, `NavigationItem`, `MainContent`, `Header`, `Title`, `StatusBadge`, `ContentArea`. Add new ones: `SidebarBrand`, `SidebarSection`, `SidebarItem`, `TabContent`, `PageHeader`, `PageTitle`, `PageSubtitle`, `CmsBadge`, `BottomTabBar`, `BottomTab`.

**Files:**
- Modify: `src/components/AdminDashboard.jsx:36-165` (the styled components block)

- [ ] **Step 1: Add `useMediaQuery` import**

At the top of `AdminDashboard.jsx`, add the import after the existing hook imports:

```js
import { useMediaQuery } from 'hooks/useMediaQuery';
```

The existing imports block (lines 8–32) already has `useState`, `useEffect`, `useMemo` from react, `styled` from emotion, `motion`/`AnimatePresence` from framer-motion, and all the hooks. Add this import after `useCMS`/`useSettings`/`useNavigation`/`usePosts`.

- [ ] **Step 2: Replace the entire styled components block (lines 36–270) with the new definitions**

Delete everything from `// ─── Styled Components ───` down to (but not including) `// ─── Main Component ─────`) and replace with:

```js
// ─── Styled Components ───────────────────────────────────────────────────────

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  display: flex;
  margin-top: 10rem;

  @media (max-width: 768px) {
    padding-bottom: 56px;
  }
`;

const Sidebar = styled.div`
  width: 160px;
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.background};
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarBrand = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: ${(p) => p.theme.colors.primary};
  padding: 0 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.primary};
  }
`;

const SidebarSection = styled.div`
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(255, 255, 255, 0.25);
  padding: 0 10px;
  margin: 10px 0 4px;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: ${(p) => p.theme.borderRadius.sm};
  font-size: 0.72rem;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.45)'};
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}1a` : 'transparent'};

  &:hover {
    background: ${(p) =>
      p.active
        ? `${p.theme.colors.primary}1a`
        : 'rgba(255,255,255,0.04)'};
    color: ${(p) =>
      p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.7)'};
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 3px;
`;

const PageSubtitle = styled.div`
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.35);
`;

const CmsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${(p) =>
    p.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  color: ${(p) => (p.active ? '#4ade80' : '#f87171')};
  border: 1px solid
    ${(p) =>
      p.active ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};
  font-size: 0.6rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 9999px;
`;

const CmsDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`;

/* ── Shared card primitives ── */

const SectionCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.md};
  padding: 16px;
  margin-bottom: 12px;
`;

const SectionCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
`;

const GhostTealButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  padding: 4px 10px;
  background: ${(p) => p.theme.colors.primary}1a;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}40;
  border-radius: ${(p) => p.theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  font-family: inherit;

  &:hover {
    background: ${(p) => p.theme.colors.primary}2a;
  }
`;

const CompactEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 5px;
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.65rem;
`;

const CompactEmptyIcon = styled.div`
  font-size: 18px;
  margin-bottom: 2px;
`;

/* ── Stat cards ── */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.md};
  padding: 14px 16px;
`;

const StatValue = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 5px;
`;

/* ── Navigation tab cards ── */

const NavigationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NavigationItemCard = styled.div`
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.borderRadius.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavigationActions = styled.div`
  display: flex;
  gap: 4px;
`;

const IconButton = styled.button`
  padding: 5px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primary}1a;
  }
`;

/* ── Form primitives (Settings / Navigation edit forms) ── */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FormLabel = styled.label`
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const StyledTextarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.sm};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}1a;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
`;

/* ── Bottom tab bar (mobile only) ── */

const BottomTabBar = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: ${(p) => p.theme.colors.background};
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    z-index: ${(p) => p.theme.zIndex.sticky};
  }
`;

const BottomTab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.3)'};
  transition: color ${(p) => p.theme.transitions.fast};
`;

/* ── Loading spinner (kept for Navigation tab) ── */

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
```

- [ ] **Step 3: Verify no compile errors**

```bash
cd /Users/joshua/Development/spa-template-base && yarn lint 2>&1 | head -40
```

Expected: No errors about undefined identifiers in the styled components block. Warnings about unused vars are expected at this stage (JSX not updated yet).

- [ ] **Step 4: Commit**

```bash
git add src/components/AdminDashboard.jsx
git commit -m "refactor(admin): replace styled components with ContentEditor design language"
```

---

## Task 2 — Rewrite the JSX: Shell + Sidebar

Replace the `return` statement's outer shell — `AdminContainer`, `Sidebar` content, and `MainContent` wrapper — with the new structure. Wire up `useMediaQuery` for mobile.

**Files:**
- Modify: `src/components/AdminDashboard.jsx` (inside `AdminDashboard` function, starting at line ~432)

- [ ] **Step 1: Add `useMediaQuery` call inside the component**

In `AdminDashboard()`, after the existing state declarations (around line 280), add:

```js
const isMobile = useMediaQuery('(max-width: 768px)');
```

- [ ] **Step 2: Replace the return statement shell**

Replace the entire `return (` block with the following. Keep all the tab content `{activeTab === 'xxx' && ...}` blocks in place for now — you're only changing the wrapping shell and sidebar.

```jsx
return (
  <AdminContainer>
    {/* ── Desktop Sidebar ── */}
    <Sidebar>
      <SidebarBrand>Admin</SidebarBrand>

      <SidebarSection>Main</SidebarSection>
      <SidebarItem
        active={activeTab === 'dashboard'}
        onClick={() => setActiveTab('dashboard')}
      >
        <BarChart3 size={14} />
        Dashboard
      </SidebarItem>
      <SidebarItem
        active={activeTab === 'settings'}
        onClick={() => setActiveTab('settings')}
      >
        <Settings size={14} />
        Settings
      </SidebarItem>

      <SidebarSection>Content</SidebarSection>
      <SidebarItem
        active={activeTab === 'content'}
        onClick={() => setActiveTab('content')}
      >
        <FileText size={14} />
        Content
      </SidebarItem>
      <SidebarItem
        active={activeTab === 'navigation'}
        onClick={() => setActiveTab('navigation')}
      >
        <Navigation size={14} />
        Navigation
      </SidebarItem>
      <SidebarItem
        active={activeTab === 'analytics'}
        onClick={() => setActiveTab('analytics')}
      >
        <TrendingUp size={14} />
        Analytics
      </SidebarItem>
    </Sidebar>

    {/* ── Main content ── */}
    <MainContent>
      <TabContent>
        <AnimatePresence mode="wait">
          {/* TAB CONTENT GOES HERE — paste existing tab blocks unchanged */}
        </AnimatePresence>
      </TabContent>
    </MainContent>

    {/* ── Mobile bottom tab bar ── */}
    <BottomTabBar>
      <BottomTab
        active={activeTab === 'dashboard'}
        onClick={() => setActiveTab('dashboard')}
      >
        <BarChart3 size={16} />
        Dash
      </BottomTab>
      <BottomTab
        active={activeTab === 'settings'}
        onClick={() => setActiveTab('settings')}
      >
        <Settings size={16} />
        Settings
      </BottomTab>
      <BottomTab
        active={activeTab === 'content'}
        onClick={() => setActiveTab('content')}
      >
        <FileText size={16} />
        Content
      </BottomTab>
      <BottomTab
        active={activeTab === 'navigation'}
        onClick={() => setActiveTab('navigation')}
      >
        <Navigation size={16} />
        Nav
      </BottomTab>
      <BottomTab
        active={activeTab === 'analytics'}
        onClick={() => setActiveTab('analytics')}
      >
        <TrendingUp size={16} />
        Analytics
      </BottomTab>
    </BottomTabBar>
  </AdminContainer>
);
```

The existing `<AnimatePresence mode="wait">` block from the old `<ContentArea>` slides directly inside `<TabContent>`. The individual tab `motion.div` blocks are replaced in the next tasks.

- [ ] **Step 3: Verify renders without error**

```bash
yarn dev:logs
```

Open http://localhost:5173/admin. Expected: sidebar visible, 160px wide, teal active state on Dashboard item, no bottom bar on desktop. The tab content area may look broken — that's fine, it gets fixed in the next tasks.

- [ ] **Step 4: Commit**

```bash
git add src/components/AdminDashboard.jsx
git commit -m "refactor(admin): new sidebar (160px, grouped) + mobile bottom tab bar"
```

---

## Task 3 — Rewrite Dashboard Tab

Replace the `activeTab === 'dashboard'` motion block with the new design: glass stat cards, no icon badges, Quick Actions in a SectionCard.

**Files:**
- Modify: `src/components/AdminDashboard.jsx` (Dashboard tab block, approx lines 502–583)

- [ ] **Step 1: Replace the dashboard `motion.div` block**

Find the block starting with `{activeTab === 'dashboard' && (` and replace the entire motion.div contents with:

```jsx
{activeTab === 'dashboard' && (
  <motion.div
    key="dashboard"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <PageHeader>
      <div>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Overview of your site</PageSubtitle>
      </div>
      <CmsBadge active={isCMSEnabled}>
        <CmsDot />
        {isCMSEnabled ? 'Firebase Active' : 'Local Mode'}
      </CmsBadge>
    </PageHeader>

    <StatsGrid>
      <StatCard>
        <StatValue>{calculatedStats.pages}</StatValue>
        <StatLabel>Pages</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{calculatedStats.posts}</StatValue>
        <StatLabel>Posts</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{calculatedStats.navItems}</StatValue>
        <StatLabel>Nav Items</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{calculatedStats.cacheSize}</StatValue>
        <StatLabel>Cached</StatLabel>
      </StatCard>
    </StatsGrid>

    <SectionCard>
      <SectionCardHeader>
        <SectionCardTitle>
          <RefreshCw size={12} />
          Quick Actions
        </SectionCardTitle>
      </SectionCardHeader>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <GhostTealButton onClick={() => setActiveTab('settings')}>
          <Settings size={12} />
          Edit Settings
        </GhostTealButton>
        <GhostTealButton onClick={() => setActiveTab('navigation')}>
          <Navigation size={12} />
          Manage Navigation
        </GhostTealButton>
        <GhostTealButton onClick={handleClearCache}>
          <RefreshCw size={12} />
          Clear Cache
        </GhostTealButton>
      </div>
    </SectionCard>
  </motion.div>
)}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:5173/admin → Dashboard tab. Expected: 4 glass stat cards in a row, teal stat values, no icon badges, Quick Actions SectionCard below with 3 ghost teal buttons.

- [ ] **Step 3: Commit**

```bash
git add src/components/AdminDashboard.jsx
git commit -m "refactor(admin): restyle Dashboard tab — glass stats, no icon badges"
```

---

## Task 4 — Rewrite Content Tab

Replace the `activeTab === 'content'` block. ContentEditor stays unchanged — just gets wrapped in a SectionCard. Blog Posts and Media Library get compact empty states with action buttons in the card header.

**Files:**
- Modify: `src/components/AdminDashboard.jsx` (Content tab block, approx lines 851–1001)

- [ ] **Step 1: Replace the content `motion.div` block**

```jsx
{activeTab === 'content' && (
  <motion.div
    key="content"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <PageHeader>
      <div>
        <PageTitle>Content</PageTitle>
        <PageSubtitle>Manage pages, posts and media</PageSubtitle>
      </div>
      <GhostTealButton onClick={() => handleButtonClick('create-post')}>
        <Plus size={12} />
        Add Content
      </GhostTealButton>
    </PageHeader>

    {/* Pages — ContentEditor wrapped for visual consistency */}
    <SectionCard style={{ padding: 0, overflow: 'hidden' }}>
      <ContentEditor />
    </SectionCard>

    {/* Blog Posts */}
    <SectionCard>
      <SectionCardHeader>
        <SectionCardTitle>
          <FileText size={12} />
          Blog Posts
        </SectionCardTitle>
        <GhostTealButton onClick={() => handleButtonClick('create-post')}>
          <Plus size={12} />
          Create Post
        </GhostTealButton>
      </SectionCardHeader>
      {posts?.length > 0 ? (
        <div style={{ display: 'grid', gap: '6px' }}>
          {posts.map((post) => (
            <NavigationItemCard key={post.id}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {post.title}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {post.status || 'Draft'}
                </div>
              </div>
              <NavigationActions>
                <IconButton onClick={() => handleButtonClick('edit-post')} title="Edit">
                  <Edit2 size={14} />
                </IconButton>
                <IconButton onClick={() => handleButtonClick('view-post')} title="View">
                  <Eye size={14} />
                </IconButton>
                <IconButton onClick={() => handleButtonClick('delete-post')} title="Delete">
                  <Trash2 size={14} />
                </IconButton>
              </NavigationActions>
            </NavigationItemCard>
          ))}
        </div>
      ) : (
        <CompactEmptyState>
          <CompactEmptyIcon>📝</CompactEmptyIcon>
          No posts yet
        </CompactEmptyState>
      )}
    </SectionCard>

    {/* Media Library */}
    <SectionCard>
      <SectionCardHeader>
        <SectionCardTitle>
          <Database size={12} />
          Media Library
        </SectionCardTitle>
      </SectionCardHeader>
      <CompactEmptyState>
        <CompactEmptyIcon>🖼️</CompactEmptyIcon>
        No media yet · coming soon
      </CompactEmptyState>
    </SectionCard>
  </motion.div>
)}
```

- [ ] **Step 2: Verify in browser**

Click Content tab. Expected: ContentEditor renders inside a borderless SectionCard wrapper, Blog Posts shows compact empty state with "Create Post" in header, Media Library shows compact empty state with no button.

- [ ] **Step 3: Commit**

```bash
git add src/components/AdminDashboard.jsx
git commit -m "refactor(admin): Content tab — SectionCard wrapper, compact empty states"
```

---

## Task 5 — Restyle Settings Tab

Wrap the settings form and read-only view in SectionCard. Replace the ad-hoc `Label` with `FormLabel`, `Textarea` with `StyledTextarea`.

**Files:**
- Modify: `src/components/AdminDashboard.jsx` (Settings tab block, approx lines 586–694)

- [ ] **Step 1: Replace the settings `motion.div` block**

```jsx
{activeTab === 'settings' && (
  <motion.div
    key="settings"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <PageHeader>
      <div>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Site-wide configuration</PageSubtitle>
      </div>
    </PageHeader>

    <SectionCard>
      <SectionCardHeader>
        <SectionCardTitle>
          <Settings size={12} />
          Site Settings
        </SectionCardTitle>
        {!editingSettings && (
          <GhostTealButton onClick={() => setEditingSettings(true)}>
            <Edit2 size={12} />
            Edit
          </GhostTealButton>
        )}
      </SectionCardHeader>

      {editingSettings ? (
        <Form onSubmit={handleSettingsSubmit}>
          <FormGroup>
            <FormLabel>Site Title</FormLabel>
            <Input
              value={settingsForm.title}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, title: e.target.value })
              }
              placeholder="Enter site title"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Site Description</FormLabel>
            <StyledTextarea
              value={settingsForm.description}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, description: e.target.value })
              }
              placeholder="Enter site description"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Author</FormLabel>
            <Input
              value={settingsForm.author}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, author: e.target.value })
              }
              placeholder="Enter author name"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Site URL</FormLabel>
            <Input
              value={settingsForm.url}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, url: e.target.value })
              }
              placeholder="https://example.com"
              type="url"
            />
          </FormGroup>
          <ActionButtons>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingSettings(false)}
            >
              Cancel
            </Button>
          </ActionButtons>
        </Form>
      ) : (
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            ['Title', settings?.title],
            ['Description', settings?.description],
            ['Author', settings?.author],
            ['URL', settings?.url],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ fontSize: '0.75rem', color: value ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)' }}>
                {value || 'Not set'}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  </motion.div>
)}
```

- [ ] **Step 2: Verify in browser**

Click Settings tab. Expected: SectionCard wrapper, field values shown in muted grid, "Edit" ghost button in card header, clicking it reveals the form, Save/Cancel work.

- [ ] **Step 3: Commit**

```bash
git add src/components/AdminDashboard.jsx
git commit -m "refactor(admin): Settings tab — SectionCard wrapper, consistent field display"
```

---

## Task 6 — Restyle Navigation Tab

Move "Add Navigation Item" button to SectionCardHeader. Apply consistent card styling to nav item rows.

**Files:**
- Modify: `src/components/AdminDashboard.jsx` (Navigation tab block, approx lines 697–848)

- [ ] **Step 1: Replace the navigation `motion.div` block**

```jsx
{activeTab === 'navigation' && (
  <motion.div
    key="navigation"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <PageHeader>
      <div>
        <PageTitle>Navigation</PageTitle>
        <PageSubtitle>Manage site navigation items</PageSubtitle>
      </div>
    </PageHeader>

    {editingNavigation ? (
      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <Navigation size={12} />
            {editingNavItem ? 'Edit Item' : 'Add Item'}
          </SectionCardTitle>
        </SectionCardHeader>
        <Form onSubmit={handleNavigationSubmit}>
          <FormGroup>
            <FormLabel>Label</FormLabel>
            <Input
              value={navigationForm.label}
              onChange={(e) =>
                setNavigationForm({ ...navigationForm, label: e.target.value })
              }
              placeholder="Enter navigation label"
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Path</FormLabel>
            <Input
              value={navigationForm.path}
              onChange={(e) =>
                setNavigationForm({ ...navigationForm, path: e.target.value })
              }
              placeholder="/path"
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Order</FormLabel>
            <Input
              type="number"
              value={navigationForm.order}
              onChange={(e) =>
                setNavigationForm({
                  ...navigationForm,
                  order: parseInt(e.target.value),
                })
              }
              min="1"
              required
            />
          </FormGroup>
          <ActionButtons>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingNavItem ? 'Update Item' : 'Add Item'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingNavigation(false);
                setEditingNavItem(null);
                setNavigationForm({ label: '', path: '', order: 1 });
              }}
            >
              Cancel
            </Button>
          </ActionButtons>
        </Form>
      </SectionCard>
    ) : (
      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <Navigation size={12} />
            Navigation Items
          </SectionCardTitle>
          <GhostTealButton onClick={() => setEditingNavigation(true)}>
            <Plus size={12} />
            Add Item
          </GhostTealButton>
        </SectionCardHeader>
        {navigationLoading ? (
          <LoadingSpinner />
        ) : navigation?.length > 0 ? (
          <NavigationList>
            {navigation.map((item) => (
              <NavigationItemCard key={item.id}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                    {item.path} · Order {item.order}
                  </div>
                </div>
                <NavigationActions>
                  <IconButton onClick={() => handleEditNavigation(item)} title="Edit">
                    <Edit2 size={14} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteNavigation(item.id)} title="Delete">
                    <Trash2 size={14} />
                  </IconButton>
                </NavigationActions>
              </NavigationItemCard>
            ))}
          </NavigationList>
        ) : (
          <CompactEmptyState>
            <CompactEmptyIcon>≡</CompactEmptyIcon>
            No navigation items yet
          </CompactEmptyState>
        )}
      </SectionCard>
    )}
  </motion.div>
)}
```

- [ ] **Step 2: Verify in browser**

Click Navigation tab. Expected: SectionCard, "Add Item" ghost button in header, existing nav items shown in styled cards, edit/delete icon buttons work. Empty state shows compact inline message.

- [ ] **Step 3: Commit**

```bash
git add src/components/AdminDashboard.jsx
git commit -m "refactor(admin): Navigation tab — SectionCard, compact nav item cards"
```

---

## Task 7 — Restyle Analytics Tab

Replace hardcoded colors and `StatIcon` badge boxes with glass stat cards. Wrap activity rows and performance metrics in SectionCards. Remove hardcoded `border: '1px solid #e2e8f0'` borders.

**Files:**
- Modify: `src/components/AdminDashboard.jsx` (Analytics tab block, approx lines 1005–1185)

- [ ] **Step 1: Replace the analytics `motion.div` block**

```jsx
{activeTab === 'analytics' && (
  <motion.div
    key="analytics"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <PageHeader>
      <div>
        <PageTitle>Analytics</PageTitle>
        <PageSubtitle>Traffic and performance overview</PageSubtitle>
      </div>
    </PageHeader>

    <StatsGrid>
      <StatCard>
        <StatValue>1,234</StatValue>
        <StatLabel>Total Visitors</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>89</StatValue>
        <StatLabel>Page Views</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>45</StatValue>
        <StatLabel>Active Users</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>3:24</StatValue>
        <StatLabel>Avg Session</StatLabel>
      </StatCard>
    </StatsGrid>

    <SectionCard>
      <SectionCardHeader>
        <SectionCardTitle>
          <Clock size={12} />
          Recent Activity
        </SectionCardTitle>
      </SectionCardHeader>
      <div style={{ display: 'grid', gap: '1px' }}>
        {[
          ['Admin user logged in', '2 minutes ago'],
          ['Settings updated', '15 minutes ago'],
          ['New navigation item added', '1 hour ago'],
        ].map(([text, time]) => (
          <div
            key={text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(45,212,191,0.5)', flexShrink: 0 }} />
            {text}
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem' }}>{time}</span>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard>
      <SectionCardHeader>
        <SectionCardTitle>
          <TrendingUp size={12} />
          Performance Metrics
        </SectionCardTitle>
      </SectionCardHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          ['98%', 'Uptime'],
          ['1.2s', 'Avg Load Time'],
          ['A+', 'Performance'],
        ].map(([value, label]) => (
          <div key={label}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'rgba(45,212,191,1)' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  </motion.div>
)}
```

- [ ] **Step 2: Verify in browser**

Click Analytics tab. Expected: 4 glass stat cards, Recent Activity in SectionCard with teal dots, Performance Metrics in SectionCard. No hardcoded blue/purple/green colors. No borders with `#e2e8f0`.

- [ ] **Step 3: Run full quality check**

```bash
yarn format && yarn lint && yarn test
```

Expected: format exits 0, lint exits 0, tests pass (no test changes needed — this is pure styling).

- [ ] **Step 4: Commit**

```bash
git add src/components/AdminDashboard.jsx
git commit -m "refactor(admin): Analytics tab — glass stats, SectionCard activity + metrics"
```

---

## Task 8 — Manual Verification + PR

Full browser verification across all tabs and breakpoints.

- [ ] **Step 1: Start dev server**

```bash
./dev.sh
```

- [ ] **Step 2: Desktop checks (viewport > 768px)**

- [ ] Sidebar shows at 160px, no overflow
- [ ] Two sections visible: MAIN (Dashboard, Settings) and CONTENT (Content, Navigation, Analytics)
- [ ] Active tab has teal text + subtle teal background on sidebar item
- [ ] No full-teal-background active state (old style)
- [ ] Clicking each sidebar item switches content with fade animation
- [ ] Dashboard: 4 glass stat cards in a row, Quick Actions SectionCard below
- [ ] Content: ContentEditor renders, Blog Posts compact empty state, Media Library compact empty state
- [ ] Settings: read view in SectionCard, Edit button in header, form works and saves
- [ ] Navigation: Add Item in header, form appears inline, nav items render as cards with edit/delete
- [ ] Analytics: 4 glass stat cards, Recent Activity + Performance in SectionCards

- [ ] **Step 3: Mobile checks (viewport ≤ 768px, DevTools → 375px)**

- [ ] Sidebar hidden
- [ ] Bottom tab bar fixed at bottom of screen, 56px tall
- [ ] All 5 tabs visible (Dash / Settings / Content / Nav / Analytics)
- [ ] Active tab label + icon are teal, inactive are muted
- [ ] Tab switching works, content scrolls above the tab bar without overlap
- [ ] Dashboard stat cards become 2-column grid on mobile

- [ ] **Step 4: Create PR**

```bash
git push origin 39-feat-add-firebase-cms-integration-with-content-management
gh pr create --fill
```

---

## Self-Review Notes

- All tab JSX uses `motion.div` with consistent `{ opacity: 0, y: 10 }` / `{ opacity: 1, y: 0 }` — unified (old code had `y: 20`/`-20`)
- `Label` styled component in old code is now `FormLabel` — no name collision with Radix `Label` from ui/
- `Textarea` styled component is now `StyledTextarea` — no collision with HTML `<textarea>`
- `StatCard` is now a plain `div` (not `motion.div`) — removes the `whileHover` lift effect which wasn't in the spec
- `isMobile` is declared but only used to conditionally render the `BottomTabBar` via CSS media query (CSS handles it directly, but the variable is available for any future conditional JSX)
- `CmsDot` and `CmsBadge` replace the old `StatusBadge` — now appear per-tab in Dashboard's `PageHeader` only, not above all tabs
