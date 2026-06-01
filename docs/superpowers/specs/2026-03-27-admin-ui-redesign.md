# Admin Dashboard UI Redesign

## Goal

The admin dashboard (`AdminDashboard.jsx`) looks visually inconsistent — generic dark-panel styling, oversized sidebar, and clunky empty states — compared to the polished `ContentEditor` component built in the previous sprint. This redesign extends the ContentEditor's design language (rgba glass cards, teal accents, minimal borders) to the entire admin shell and all tab content areas.

---

## Scope

Three areas in scope:

1. **Page frame** — sidebar navigation and overall shell layout
2. **Content tab** — Blog Posts and Media Library sections (ContentEditor itself is untouched)
3. **All other tabs** — Dashboard, Settings, Navigation, Analytics

---

## Design Language (matches ContentEditor)

All values mirror the ContentEditor palette:

| Element | Value |
|---|---|
| Background | `theme.colors.background` |
| Sidebar background | slightly lighter than background — `rgba(255,255,255,0.02)` overlay |
| Card / section background | `rgba(255,255,255,0.03)` |
| Card / section border | `rgba(255,255,255,0.06)` |
| Section group labels | `rgba(255,255,255,0.25)` |
| Nav item (inactive) | `rgba(255,255,255,0.45)` |
| Nav item (active bg) | `${theme.colors.primary}1a` (10% opacity) |
| Nav item (active text) | `theme.colors.primary` |
| Stat values | `theme.colors.primary` |
| Firebase Active badge | `rgba(34,197,94,0.1)` bg / `#4ade80` text |
| Border radius | `borderRadius.md` (0.75rem) for cards, `borderRadius.sm` (0.5rem) for nav items |

No colored icon badges on stat cards. No drop shadows on interactive elements.

---

## Layout

### Desktop

```
┌───────────────────────────────────────────────────┐
│  Sidebar (160px)  │  Main content (flex: 1)        │
│                   │                                │
│  · Admin          │  [page title]    [status badge]│
│                   │                                │
│  MAIN             │  [stats row]                   │
│  > Dashboard      │                                │
│  > Settings       │  [section cards]               │
│                   │                                │
│  CONTENT          │                                │
│  > Content        │                                │
│  > Navigation     │                                │
│  > Analytics      │                                │
└───────────────────────────────────────────────────┘
```

- Sidebar: 160px fixed, down from 280px
- Sidebar and main share `theme.colors.background`; sidebar has a 1px right border at `rgba(255,255,255,0.06)`
- `margin-top: 10rem` on `AdminContainer` stays (required for fixed header clearance)

### Mobile (≤ 768px)

- Sidebar hidden
- Bottom tab bar: 5 tabs (icon + short label), 56px tall, fixed to bottom
- Active tab: teal icon + label; inactive: `rgba(255,255,255,0.3)`
- Bottom tab bar background: same as sidebar (`rgba(255,255,255,0.02)` over background), 1px top border

---

## Sidebar

```jsx
// Structure
<Sidebar>
  <SidebarBrand>· Admin</SidebarBrand>

  <SidebarSection>Main</SidebarSection>
  <SidebarItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
    <BarChart3 size={14} /> Dashboard
  </SidebarItem>
  <SidebarItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
    <Settings size={14} /> Settings
  </SidebarItem>

  <SidebarSection>Content</SidebarSection>
  <SidebarItem active={activeTab === 'content'} onClick={() => setActiveTab('content')}>
    <FileText size={14} /> Content
  </SidebarItem>
  <SidebarItem active={activeTab === 'navigation'} onClick={() => setActiveTab('navigation')}>
    <Navigation size={14} /> Navigation
  </SidebarItem>
  <SidebarItem active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
    <TrendingUp size={14} /> Analytics
  </SidebarItem>
</Sidebar>
```

Lucide icons already imported in `AdminDashboard.jsx`. No new icon dependencies.

---

## Dashboard Tab

### Stats row

4 cards in a grid (`repeat(4, 1fr)`), each:
- Glass card: `rgba(255,255,255,0.03)` bg, `rgba(255,255,255,0.06)` border, `borderRadius.md`
- Large value in `theme.colors.primary`, small uppercase muted label below
- No icon badges, no trend arrows (keep it simple)

Stats: Pages (from `pageSchema`), Locales (from `availableLanguages`), Posts (from `usePosts`), Status (`isCMSEnabled ? '● Live' : '● Local'`)

### Recent Activity section

A `SectionCard` with a header row ("Recent Activity" + clock icon) and a list of activity rows. Each row: colored dot + text + relative timestamp. If no activity data exists, show a compact inline empty state (no large icon — just a single line of muted text).

---

## Content Tab

### Page header

```
Content                          [＋ Add Content]
Manage pages, posts and media
```

"Add Content" button: same ghost teal style as ContentEditor's translate buttons.

### ContentEditor

Unchanged. Wrapped in a `SectionCard` container for visual consistency with the sections below it.

### Blog Posts section

```jsx
<SectionCard>
  <SectionCardHeader>
    <SectionCardTitle><FileText size={12} /> Blog Posts</SectionCardTitle>
    <GhostTealButton>＋ Create Post</GhostTealButton>
  </SectionCardHeader>
  {posts.length === 0 ? (
    <CompactEmptyState icon="📝" text="No posts yet" />
  ) : (
    // post list
  )}
</SectionCard>
```

`CompactEmptyState`: `padding: 20px`, small emoji icon (18px), single muted line of text. No button — the action button lives in the card header.

### Media Library section

Same structure as Blog Posts. Text: "No media yet · coming soon". No upload button until feature is real.

---

## Settings Tab

Current form layout is acceptable. Redesign applies consistent styling only:
- Replace ad-hoc `Form`/`FormGroup`/`Label` styled components with `SectionCard` wrapper
- Use existing `Input` component from `src/components/ui/`
- Use existing `Button` component for submit/cancel actions
- No structural changes to the form fields themselves

---

## Navigation Tab

Current card-list layout is acceptable. Redesign applies:
- Wrap in `SectionCard`
- `NavigationItemCard` uses `rgba(255,255,255,0.03)` bg and `rgba(255,255,255,0.06)` border
- `IconButton` inherits consistent hover state (teal border + text)

---

## Analytics Tab

Currently shows placeholder/stub content. Redesign applies `SectionCard` wrapper and compact empty state if no data.

---

## Shared Components to Extract

These Emotion-styled primitives should be defined once in `AdminDashboard.jsx` (or a co-located `adminStyles.js`) and reused across all tabs:

| Component | Description |
|---|---|
| `SectionCard` | `rgba(255,255,255,0.03)` bg, border, `borderRadius.md`, padding `16px` |
| `SectionCardHeader` | flex row, space-between, align center, `margin-bottom: 12px` |
| `SectionCardTitle` | flex row, gap `6px`, `0.7rem` semibold, `rgba(255,255,255,0.7)` |
| `GhostTealButton` | small teal ghost button — matches ContentEditor translate buttons |
| `CompactEmptyState` | centered column, small emoji, muted text, `padding: 20px` |
| `StatCard` | glass card for dashboard stats |
| `SidebarItem` | nav item with active/hover states |
| `SidebarSection` | uppercase group label |
| `BottomTabBar` | mobile-only, fixed bottom, 5 tabs |
| `BottomTab` | single tab item with icon + label |

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| `> 768px` | Sidebar visible (160px), `BottomTabBar` hidden |
| `≤ 768px` | Sidebar hidden (`display: none`), `BottomTabBar` visible, `AdminContainer` gets `padding-bottom: 56px` |

Use `useMediaQuery('(max-width: 768px)')` — already created in `src/hooks/useMediaQuery.js`.

---

## What Does NOT Change

- `ContentEditor`, `ContentPageList`, `ContentFieldEditor` — untouched
- Route, auth, hook logic — untouched
- `margin-top: 10rem` on `AdminContainer` — required for header clearance
- All existing data hooks (`useCMS`, `useSettings`, `useNavigation`, `usePosts`)
- Lucide icon imports — already present

---

## Verification

```bash
yarn format && yarn lint && yarn test
```

Manual checks:
- Desktop: sidebar shows at 160px, grouped sections, active tab highlighted in teal
- Desktop: clicking each sidebar item switches tab content
- Mobile (375px): sidebar hidden, bottom tab bar visible and fixed, all 5 tabs switch content correctly
- Dashboard tab: 4 stat cards render, Firebase Active badge shows, recent activity section renders
- Content tab: ContentEditor renders, Blog Posts and Media Library show compact empty states with header action buttons
- Settings tab: form renders in SectionCard wrapper, save/cancel work
- Navigation tab: nav items render in consistent card style
- Light mode: all rgba values readable — check no hardcoded dark-only colors outside ContentEditor
- No console errors
