# Admin Pages Section Redesign

**Date:** 2026-06-05  
**Status:** Implemented — [Issue #25](https://github.com/TranspiledCode/transpiled-web-template/issues/25)

---

## Problem

The previous "Pages" tab used a split-pane layout: a collapsible tree of pages on the left (`AdminContentPageList`) and a field editor on the right. Page navigation was contained entirely within the content area, disconnected from the main app sidebar.

## Solution

Move page navigation into the main app sidebar and replace the split-pane with a full-width, tabbed editor.

---

## Architecture

### State

`selectedPage` state lives in `AdminDashboard` alongside the existing `activeTab`. When a page sub-item is clicked in the sidebar, both `activeTab → 'pages'` and `selectedPage → pageId` update atomically.

```
AdminDashboard
  ├── activeTab
  ├── selectedPage (new)
  ├── AdminSidebar  ← receives both, renders page sub-list
  └── AdminPagesTab ← receives selectedPage, renders AdminPageEditor
```

### New files

**`src/hooks/usePageEditor.js`**  
Extracts all load/save logic that was previously embedded in `AdminContentEditor`. Accepts `pageId`, returns form state and handlers. Uses `contentService.getPage/updatePage/translateContent` and `contentService.transformNestedToFlat`.

**`src/components/admin/AdminPageEditor.jsx`**  
Full-width editor component. Uses `usePageEditor` for state. Layout (top to bottom):
- Header: page title + Published badge (static) + field/locale meta + Preview (non-functional) + ⋮ (non-functional) + Save Changes
- Locale switcher: pill tabs for each available locale
- Section tabs: horizontal tabs derived from `pageSchema[pageId].fields` grouped by `field.group`
- Scrollable fields area: one card per field with type icon, label, and input/textarea
- Sticky footer: unsaved-changes indicator + Cancel + Save Changes

`key={pageId}` on the component from `AdminPagesTab` causes a clean remount on page change, resetting section tab and form state without extra effects.

### Modified files

| File | Change |
|---|---|
| `AdminDashboard.jsx` | + `selectedPage` state; passes to sidebar and pages tab; `flush` prop on `TabContent` |
| `AdminDashboard.styles.js` | `TabContent` gets `flush` prop — removes padding and switches to `overflow: hidden` when on pages tab (lets the editor manage its own scrolling) |
| `AdminSidebar.jsx` | Pages nav item gets a `ChevronDown` indicator; when `activeTab === 'pages'`, renders a `PageSubList` of all entries from `pageSchema` |
| `AdminPagesTab.jsx` | Stripped to ~15 lines — renders `<AdminPageEditor key={selectedPage} pageId={selectedPage} />` inside a motion wrapper |

### Files unchanged

`AdminContentEditor.jsx`, `AdminContentPageList.jsx`, `AdminContentFieldEditor.jsx` — kept but no longer rendered in the pages flow. Delete in a future cleanup pass.

---

## Design Decisions

- **Section tabs from schema groups**: No new config needed; tabs derive from unique `field.group` values in insertion order.
- **`key={pageId}` for remount**: Avoids needing `useEffect` to reset section/form state when the page changes.
- **`flush` mode on `TabContent`**: Lets the editor control its own scrolling so the sticky footer sits flush at the bottom of the viewport.
- **Published badge is static**: No publish/draft logic built — visual placeholder only.
- **Preview and ⋮ buttons render but are non-functional**: Wired up in a future iteration.

## Out of Scope

- Character counters on fields
- Publish/draft status toggle
- Preview button navigation
- Mobile-specific behavior changes
