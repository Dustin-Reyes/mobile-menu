# Admin Content Section UI Redesign

## Goal

Replace the current inline-form content editor in `AdminDashboard.jsx` with a modern, scalable split-pane layout that works for pages with 5 fields or 50, handles multiple locales cleanly, and has a focused mobile experience.

## Architecture

A single new component `ContentEditor` handles all content tab rendering. It is dropped into `AdminDashboard.jsx` in place of the entire `activeTab === 'content'` branch — no props required, `ContentEditor` calls its own hooks internally.

`ContentEditor` detects viewport size via a new `useMediaQuery` hook (created as part of this work — see below) and renders either the desktop split-pane or the mobile drill-down. Blog posts are **out of scope** for this redesign; the existing blog posts card from `AdminDashboard` remains unchanged and is rendered below `ContentEditor` in the content tab.

**Tech stack:** React 18, Emotion styled components, existing `Button`, `Input`, `Label` from `src/components/ui/`. No new dependencies.

---

## New Hook: `useMediaQuery`

Create `src/hooks/useMediaQuery.js`:

```js
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}
```

Usage in `ContentEditor`:
```js
const isMobile = useMediaQuery('(max-width: 768px)');
```

---

## Field Schema

Create `src/content/schema.js`. This is the single source of truth for which fields exist per page, their labels, types, and optional group names.

```js
export const pageSchema = {
  home: {
    fields: [
      { key: 'title',      label: 'Title',            type: 'text' },
      { key: 'subtitle',   label: 'Subtitle',          type: 'textarea' },
      { key: 'viewDemo',   label: 'View Demo Label',   type: 'text' },
      { key: 'viewGitHub', label: 'GitHub Label',      type: 'text' },
      { key: 'copyright',  label: 'Copyright',         type: 'text' },
    ],
  },
  about: {
    fields: [
      { key: 'title',   label: 'Title',   type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
    ],
  },
};
```

For future pages that need groups, add `group: 'Hero'` etc. to individual field entries. The component groups fields by `group` at render time; if no `group` is set, all fields render flat.

Both `home` and `about` are in scope for the new editor. Both pages use the same `ContentFieldEditor` component.

---

## Data Loading Strategy

`ContentEditor` bypasses the `usePage` hook (which is bound to `i18n.language`) and calls `contentService.getPage(pageId, locale)` directly. This allows locale-switching without changing the active i18n language.

**On page or locale selection:**
```js
const content = await contentService.getPage(selectedPage, selectedLocale);
setFormValues(content ?? {});
setSavedValues(content ?? {});  // both seeded together — isDirty is false on load
```

`isDirty` is derived: `JSON.stringify(formValues) !== JSON.stringify(savedValues)`.

`savedValues` is always seeded at the same time as `formValues` so that `isDirty` is `false` immediately after load.

---

## Locale Dot Data

The locale dots shown on page list rows are derived from `pageSchema` cross-referenced with `contentService.hasLocaleContent`. To keep it performant:

- On mount, for each page in `pageSchema`, call `contentService.hasLocaleContent(pageId, locale)` for each locale in `availableLanguages` (from `src/config/i18n.js` — this is a plain object keyed by locale code, so use `Object.keys(availableLanguages)`)
- Store results in a map: `localeMap: Record<pageId, locale[]>` — the list of locales that have content
- This drives dot rendering: `localeMap['home']` → `['en', 'es', 'fr', 'zh']` → 4 dots

These checks are fast (cache hits after first page load) and run once on `ContentEditor` mount. Show up to 3 dots, then `+N` pill for overflow.

---

## Desktop Layout

```
┌─────────────────────────────────────────────────────┐
│ sidebar │  list pane        │  editor pane           │
│         │  ─────────────   │  ─────────────────────  │
│  icons  │  PAGES           │  🏠 Home                │
│         │  > Home  ●●●+1   │  5 fields · 4 locales  │
│         │    About  ●      │  [EN] [ES] [FR] [ZH]   │
│         │                  │  [↺ Translate from EN]  │
│         │                  │  ─────────────────────  │
│         │                  │  ← scrollable fields → │
│         │                  │                         │
│         │                  │  ─────────────────────  │
│         │                  │  ● Unsaved  [Cancel][Save]│
└─────────────────────────────────────────────────────┘
```

List pane: fixed ~220px. Editor pane: flex fill. The list pane and editor pane each scroll independently; the editor header and save bar are sticky within the editor pane.

### Page List Rows

- **Name** (bold, left)
- **Locale dots** (right): up to 3 filled `●` circles (6px, indigo), then `+N` pill for overflow
- **Active indicator**: 2px indigo left-edge bar on the selected row
- **Hover state**: `rgba(255,255,255,0.03)` background
- Section dividers: small uppercase grey labels ("PAGES") above each group, no borders

### Editor Header (sticky)

```
🏠  Home
    5 fields · 4 locales

[EN] [ES] [FR] [ZH]    [✨ Translate all]   ← on EN tab
[EN] [ES] [FR] [ZH]    [↺ Translate from EN] ← on non-EN tab (always visible)
```

- `✨ Translate all` shown only on EN tab
- `↺ Translate from EN` shown on all non-EN tabs, always visible regardless of whether locale content already exists (matches the fix in the current codebase: users need to be able to re-translate stale content)
- Both buttons disabled while `isTranslating` or `isLoading`

### Editor Fields (scrollable)

- Each field: low-contrast card (`rgba(255,255,255,0.03)` background, 1px `rgba(255,255,255,0.06)` border, 5px radius)
- Field label: tiny uppercase grey above the input
- `type: 'text'` → single-line `Input` (from `src/components/ui/Input.jsx`)
- `type: 'textarea'` → a locally-defined Emotion-styled `<textarea>` (no `Textarea` component exists in `src/components/ui/`); `resize: vertical`, min-height 80px, same focus/border styles as `Input`
- Fields with a `group` key render with a group label divider: small uppercase, `rgba(255,255,255,0.2)`, 1px top border, small top margin
- Fields with no `group` render flat with no dividers

### Save Bar (sticky)

```
● Unsaved changes         [Cancel]  [Save Changes]
```

- Sticks to the bottom of the editor pane (not the viewport — sticky within the pane)
- When `isDirty`: amber dot + "Unsaved changes" text
- When clean: "No unsaved changes" in dim grey, no dot
- `backdrop-filter: blur(8px)` + `theme.colors.background` base (works in both light and dark theme)
- Cancel: resets `formValues` to `savedValues`, clears dirty state
- Save: calls `contentService.updatePage(pageId, locale, formValues)`, then seeds `savedValues` from response

### Locale Switch While Dirty

If the user switches locale while `isDirty` is true, discard the unsaved changes silently and load the new locale. No confirmation dialog — the save bar makes the dirty state visible and the user chose to navigate away.

### Scroll Affordance

A `position: absolute; bottom: 0` gradient overlay on the scrollable field container:
```
background: linear-gradient(to bottom, transparent, ${p => p.theme.colors.background})
```
This respects both light and dark themes. `pointer-events: none` so it doesn't block interaction.

---

## Mobile Layout

Breakpoint: `max-width: 768px`. The split pane is replaced by a 3-screen drill-down. Navigation is handled by `mobileScreen` state.

### Screen 1 — Pages List

- Section headers (PAGES)
- Each row: page name + locale dots (`●●● +N`) + chevron
- Tapping a row: set `selectedPage`, load all locale content for that page (see Screen 2 data), advance to `mobileScreen: 'fields'`

### Screen 2 — Field List

Back chevron + page name in header.

**Data loading:** On entering Screen 2, load content for **all** locales for the selected page in parallel:
```js
const allLocaleContent = {};
await Promise.all(
  AVAILABLE_LANGUAGES.map(async ({ code }) => {
    allLocaleContent[code] = await contentService.getPage(selectedPage, code);
  })
);
```
Store in `allLocaleContent` state. This enables Screen 3 to show other-locale values without additional fetches. Use `Object.keys(availableLanguages)` (from `src/config/i18n.js`) to iterate locales — it is a plain object keyed by locale code, not an array.

- Locale switcher pills sticky below header; switching locale re-renders the field preview values from `allLocaleContent[selectedLocale]`
- Each field row: field label + current value preview (truncated to 1 line) + chevron
- Tapping a field: set `selectedField`, advance to `mobileScreen: 'field-edit'`

### Screen 3 — Single Field Edit

Back chevron + field label in header.

- "Current saved value" section: read-only preview of `allLocaleContent[selectedLocale][selectedField]`
- Editable input (single-line or multiline based on `type`)
- **Save** / **Cancel** buttons
  - **Save**: calls `contentService.updatePage(selectedPage, selectedLocale, { [selectedField]: inputValue })` — saves only that one field; navigates back to Screen 2 on success; updates `allLocaleContent[selectedLocale][selectedField]` so the preview refreshes
  - **Cancel**: discards edit, navigates back to Screen 2 with no changes
- "Other locales" section: shows `allLocaleContent[otherLocale][selectedField]` for each other locale — read-only, for context

---

## State Model

```js
// Shared
selectedPage: string | null         // 'home', 'about', null
selectedLocale: string              // 'en', 'es', 'fr', 'zh'
formValues: Record<string, string>  // current input values for selectedLocale
savedValues: Record<string, string> // last saved/loaded values for selectedLocale
isDirty: boolean                    // derived from formValues !== savedValues
isLoading: boolean
isTranslating: boolean
localeMap: Record<string, string[]> // pageId → locales that have content

// Mobile only
mobileScreen: 'pages' | 'fields' | 'field-edit'
selectedField: string | null
allLocaleContent: Record<string, Record<string, string>> // locale → field values
```

---

## Component Breakdown

| Component | File | Responsibility |
|-----------|------|----------------|
| `ContentEditor` | `src/components/admin/ContentEditor.jsx` | Top-level; owns all state, detects mobile/desktop, renders the appropriate view |
| `ContentPageList` | `src/components/admin/ContentPageList.jsx` | Left-pane list (desktop) + Screen 1 (mobile) |
| `ContentFieldEditor` | `src/components/admin/ContentFieldEditor.jsx` | Right-pane editor (desktop) + Screen 2 + 3 (mobile) |
| `useMediaQuery` | `src/hooks/useMediaQuery.js` | Viewport breakpoint detection |
| `pageSchema` | `src/content/schema.js` | Field definitions per page |

`AdminDashboard.jsx` replaces its `activeTab === 'content'` branch with `<ContentEditor />`. The existing blog posts card renders below it, unchanged.

---

## Palette

All values use theme tokens or explicit rgba with hex opacity suffix (no `rgba(token, alpha)` syntax).

| Element | Value |
|---------|-------|
| List pane border | `rgba(255,255,255,0.06)` |
| Active bar | `${p => p.theme.colors.primary}` |
| Active row background | `${p => p.theme.colors.primary}14` (8% opacity hex) |
| Locale pill active background | `${p => p.theme.colors.primary}40` (25% opacity hex) |
| Locale pill active border | `${p => p.theme.colors.primary}4d` |
| Field card background | `rgba(255,255,255,0.03)` |
| Field card border | `rgba(255,255,255,0.06)` |
| Group label | `rgba(255,255,255,0.2)` |
| Unsaved indicator | `#f59e0b` (amber — not in theme, used directly) |
| Scroll fade gradient end | `${p => p.theme.colors.background}` |

No gradients on interactive elements. No drop shadows on list items.

---

## Verification

```bash
yarn format && yarn lint && yarn test
```

Manual checks:
- Select Home → editor loads EN fields, `isDirty` is false
- Edit a field → amber dot appears, Save button active
- Save → dot clears, success toast
- Switch locale while dirty → unsaved changes discarded silently, new locale loads
- Switch to ES tab → "↺ Translate from EN" button visible
- Click translate → fields populate with translation, `isDirty` becomes true, user must save
- Click "✨ Translate all" on EN tab → all non-EN locales translated and auto-saved
- Page with 10+ fields → fields scroll, header + save bar remain fixed
- About page → opens correctly with its 2 fields
- Mobile 375px → 3-screen flow works, per-field save works, back navigation correct
- `VITE_CMS_ENABLED=false` → editing works from local content
- `VITE_CMS_ENABLED=true` → saves persist to Firestore
