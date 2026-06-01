# Google Translate Integration — Design Spec

**Date:** 2026-03-24
**Status:** Approved

## Context

The SPA template supports multilingual content via locale-keyed content files (`src/content/pages.js`, `src/content/navigation.js`) and a locale selector in the admin dashboard. Adding translations manually for every page and language is tedious. This feature adds automated translation via the MyMemory API to make seeding and managing multilingual content significantly easier.

## Goals

- Make it easy to seed all locale variants of content from English in one step
- Work in both local (no Firebase) and CMS (Firebase) modes
- Require no API key or account setup (zero-config)
- Keep the API call server-side for CSP compliance and future provider flexibility

## Non-Goals

- Real-time translation of user-generated content
- Translation of i18n UI strings (those are in locale JSON files, not content files)
- Replacing human review of translations

---

## Architecture

Four pieces, each with one job:

| Piece | File | Purpose |
|---|---|---|
| Netlify function | `netlify/functions/translate.js` | Proxies text to MyMemory API server-side |
| Browser service | `src/services/translate.js` | Calls the function; used by admin UI |
| Dev script | `scripts/translate-content.js` | Node script; calls MyMemory directly; reads+writes content files |
| Admin UI | `src/components/AdminDashboard.jsx` | Two translate buttons (global + per-locale) |

The browser service and dev script both reach MyMemory, but via different routes:
- **Browser → Netlify function → MyMemory** (CSP-safe, same-origin call to `/.netlify/functions/translate`)
- **Node script → MyMemory directly** (no CSP involved)

---

## Translation Provider

**MyMemory** (`https://api.mymemory.translated.net`)

- Free, no API key or account required
- 10K characters/day per IP (ample for content seeding)
- Request format: `GET /get?q={text}&langpair={source}|{target}`
- Response: `{ responseData: { translatedText: '...' }, responseStatus: 200 }`
- **Important:** MyMemory signals rate-limit errors via the response body (`responseStatus: 429`), not HTTP status (which remains 200). Both the Netlify function and the dev script must inspect `responseStatus` in the body and treat non-200 values as errors.

**Language code mapping** (MyMemory uses different codes for some locales):

| Project locale | MyMemory code |
|---|---|
| `en` | `en` |
| `es` | `es` |
| `fr` | `fr` |
| `zh` | `zh-CN` |

This mapping lives in `src/services/translate.js` so it only needs updating in one place if locales are added. All four locales (`en`, `es`, `fr`, `zh`) are active in `src/config/i18n.js` `availableLanguages`.

---

## Netlify Function

**File:** `netlify/functions/translate.js`

- Method: `POST`
- Body: `{ text: string, targetLang: string, sourceLang?: string }` (`sourceLang` defaults to `en`)
- Maps `targetLang` to MyMemory code (e.g. `zh` → `zh-CN`)
- Calls MyMemory, inspects `responseStatus` in the body — treats non-200 as an error
- Returns `{ translatedText: string }` on success
- Returns HTTP 500 with `{ error }` on failure or rate-limit
- Validates that `targetLang` is non-empty; returns HTTP 400 if missing

**Local development note:** `netlify.toml` configures the dev server to serve from `dist/`. Run `yarn build` before `netlify dev` so the admin UI is available at `http://localhost:8888`. The Netlify function will be available at `http://localhost:8888/.netlify/functions/translate`.

---

## Browser Translate Service

**File:** `src/services/translate.js`

Two exported async functions:

```js
translateText(text, targetLang, sourceLang = 'en')
// → string: translated text

translateFields(fields, targetLang, sourceLang = 'en')
// fields: flat object — string values are translated, non-string values passed through unchanged
// → object: same keys, translated string values
```

Both throw on failure. Callers handle errors via try/catch and toast notifications.

**Non-string field handling:** `translateFields` passes through any non-string value (arrays, numbers, nested objects) unchanged. This means the `features` array in `pages.home.en` will remain in English across all locales — this is intentional for the admin UI context where `pageForm` does not include `features`.

---

## Dev Script

**File:** `scripts/translate-content.js`

**Invocation:** `yarn translate` (added to `package.json` scripts)

**Behaviour:**
1. Reads `src/content/pages.js` and `src/content/navigation.js`
2. Reads configured locales from `src/config/i18n.js` `availableLanguages`
3. For each page, for each non-`en` locale:
   - If the locale already has content → **skip** (safe re-run by default)
   - Translates all top-level string fields from the `en` version using MyMemory directly
   - Non-string values are skipped (arrays such as `features` remain in English)
4. For each navigation item, translates `labels` for each missing non-`en` locale
5. Writes updated objects back to the source files
6. Logs each field as it's translated: `✓ pages.home.es.subtitle`
7. Exits with a non-zero code if any translation call fails

**Flags:**
- `--force` — re-translates all locales, overwriting existing content
- `--locale es` — translates only the specified locale (can be combined with `--force`)

**Rate limit:** If MyMemory returns `responseStatus: 429` the script logs an error and stops (preserving any translations already written). Re-run after the daily limit resets.

---

## Admin UI Changes

**File:** `src/components/AdminDashboard.jsx`

### Detecting untranslated locales

`contentService.getPage(pageId, locale)` falls back to English when a locale has no content, so `pageForm` will never appear empty for a missing locale. To detect whether a locale is genuinely untranslated, a new method is added to the content service:

**`contentService.hasLocaleContent(pageId, locale)`** — returns `true` only if locale-specific content actually exists (no fallback). Implementation:
- Local mode: `return !!(localContent.pages[pageId]?.[locale])`
- CMS mode: fetches the page document and checks if `doc[locale]` exists

The admin calls this when `editingLocale` changes to decide whether to show the "Translate from EN" hint.

### "Translate all" button (EN tab only)

- Shown in the page editor header, visible only when `editingLocale === 'en'`
- **Always overwrites** existing translated content for all locales — the user is explicitly requesting a full re-translate
- On click: for each non-`en` locale in `availableLanguages`:
  1. Calls `translateFields(pageForm, locale)` via the browser translate service
  2. Calls `contentService.updatePage('home', locale, translatedFields)` to persist
- This applies to the Home Page editor only (the only editable page currently)
- Shows a spinner on the button during translation; disables "Save Changes" while in progress
- On success: toast listing which locales were saved (e.g. "Translated and saved: ES, FR, ZH")
- On partial failure: toast naming which locales failed; successful locales are preserved

### "Translate from EN" hint (non-EN tabs)

- Shown as a banner above the form fields when `editingLocale !== 'en'` AND `contentService.hasLocaleContent('home', editingLocale)` returns `false`
- Disappears once `hasLocaleContent` returns `true` (i.e. after saving translated content)
- On click: calls `translateFields(en pageForm content, editingLocale)`, populates form fields
- Does **not** auto-save — user reviews the filled fields and clicks "Save Changes" manually
- Shows a spinner on the hint button during translation

### Loading and error states

- Both buttons show inline spinners during the API call
- Errors surface via `toast.error()`
- "Save Changes" is disabled while translation is in progress

---

## Files Created / Modified

| File | Action |
|---|---|
| `netlify/functions/translate.js` | Create |
| `src/services/translate.js` | Create |
| `scripts/translate-content.js` | Create |
| `src/components/AdminDashboard.jsx` | Modify — add translate buttons and handlers |
| `src/services/content.js` | Modify — add `hasLocaleContent(pageId, locale)` method |
| `package.json` | Modify — add `"translate": "node scripts/translate-content.js"` script |

---

## Testing

### Dev script
```bash
yarn translate
# Verify src/content/pages.js now has es/fr/zh fields populated
yarn translate  # second run should be a no-op (no changes, no API calls)
yarn translate --force  # should re-translate everything
yarn translate --locale es  # should translate only es
```

### Admin UI (requires netlify dev)
```bash
yarn build && netlify dev  # must build first — dev config serves from dist/
```
1. Open `http://localhost:8888/admin`, go to Content tab, click Edit on Home Page
2. On EN tab: verify "Translate all" button is visible
3. Click "Translate all" — verify spinner, then success toast naming each locale
4. Switch to ES tab — verify fields are populated with Spanish; "Translate from EN" hint is gone
5. Delete the ES locale content from local content file, restart, open ES tab — verify "Translate from EN" hint appears
6. Click "Translate from EN" hint — verify fields populate without auto-saving
7. Click "Save Changes" — verify save succeeds and hint disappears

### Netlify function
```bash
curl -X POST http://localhost:8888/.netlify/functions/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","targetLang":"es"}'
# Expected: {"translatedText":"Hola mundo"}

curl -X POST http://localhost:8888/.netlify/functions/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","targetLang":""}'
# Expected: HTTP 400
```
