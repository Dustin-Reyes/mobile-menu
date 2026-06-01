# Translate Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add automated translation via the MyMemory API so developers can seed multilingual content from English in one step — both from the CLI and from the admin dashboard.

**Architecture:** A Netlify function (`netlify/functions/translate.js`) proxies browser translation requests to MyMemory, keeping API calls server-side. A standalone Node script (`scripts/translate-content.js`) calls MyMemory directly to seed local content files. The admin dashboard gains two translate buttons: "Translate all" on the EN tab and a "Translate from EN" hint on empty non-EN tabs.

**Tech Stack:** MyMemory REST API (no key required), Netlify Functions, React, Jest

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/services/content.js` | Modify | Add `hasLocaleContent(pageId, locale)` method |
| `src/services/translate.js` | Create | Browser translate service — calls Netlify function |
| `netlify/functions/translate.js` | Create | Server-side proxy to MyMemory API |
| `scripts/translate-content.js` | Create | CLI dev script — seeds content files from English |
| `package.json` | Modify | Add `"translate"` script |
| `src/components/AdminDashboard.jsx` | Modify | Add translate buttons and handlers |
| `tests/services/content.test.js` | Modify | Add tests for `hasLocaleContent` |
| `tests/services/translate.test.js` | Create | Unit tests for browser translate service |

---

## Task 1: Add `hasLocaleContent` to content service

**Files:**
- Modify: `src/services/content.js`
- Modify: `tests/services/content.test.js`

- [ ] **Step 1: Write the failing tests**

  Open `tests/services/content.test.js`. Add a new `describe` block after the `clearCache` block:

  ```js
  describe('hasLocaleContent', () => {
    it('returns true when locale content exists locally', async () => {
      const result = await contentService.hasLocaleContent('home', 'en');
      expect(result).toBe(true);
    });

    it('returns false for a locale with no local content', async () => {
      const result = await contentService.hasLocaleContent('home', 'xx');
      expect(result).toBe(false);
    });

    it('returns false for a non-existent page', async () => {
      const result = await contentService.hasLocaleContent('nonexistent', 'en');
      expect(result).toBe(false);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify they fail**

  ```bash
  yarn test tests/services/content.test.js
  ```
  Expected: 3 new tests FAIL with `contentService.hasLocaleContent is not a function`

- [ ] **Step 3: Implement `hasLocaleContent` in the content service**

  Open `src/services/content.js`. Add this method inside the `ContentService` class, after `isCMSEnabled()`:

  ```js
  /**
   * Check whether locale-specific content genuinely exists for a page.
   * Returns false when the only available content is the English fallback.
   * Used by the admin UI to decide whether to show the "Translate from EN" hint.
   */
  async hasLocaleContent(pageId, locale) {
    if (CMS_CONFIG.enabled) {
      try {
        const doc = await fetchFromFirebase('pages', pageId);
        return !!(doc && doc[locale]);
      } catch {
        // Fall through to local check on Firebase error
      }
    }
    return !!(localContent.pages[pageId]?.[locale]);
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**

  ```bash
  yarn test tests/services/content.test.js
  ```
  Expected: all tests PASS

- [ ] **Step 5: Commit**

  ```bash
  git add src/services/content.js tests/services/content.test.js
  git commit -m "feat(cms): add hasLocaleContent to content service"
  ```

---

## Task 2: Create the browser translate service

**Files:**
- Create: `src/services/translate.js`
- Create: `tests/services/translate.test.js`

- [ ] **Step 1: Write the failing tests**

  Create `tests/services/translate.test.js`:

  ```js
  import { translateText, translateFields } from '../../src/services/translate';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('translateText', () => {
    it('calls the Netlify function with correct payload and returns translated text', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ translatedText: 'Hola mundo' }),
      });

      const result = await translateText('Hello world', 'es');

      expect(result).toBe('Hola mundo');
      expect(fetch).toHaveBeenCalledWith(
        '/.netlify/functions/translate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Hello world', targetLang: 'es', sourceLang: 'en' }),
        }),
      );
    });

    it('respects an explicit sourceLang', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ translatedText: 'Hello world' }),
      });

      await translateText('Hola mundo', 'en', 'es');

      expect(fetch).toHaveBeenCalledWith(
        '/.netlify/functions/translate',
        expect.objectContaining({
          body: JSON.stringify({ text: 'Hola mundo', targetLang: 'en', sourceLang: 'es' }),
        }),
      );
    });

    it('throws when the function returns a non-ok response', async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'rate limit' }),
      });

      await expect(translateText('Hello', 'es')).rejects.toThrow('rate limit');
    });
  });

  describe('translateFields', () => {
    it('translates all string fields and passes through non-string values', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ translatedText: 'translated' }),
      });

      const input = { title: 'Hello', count: 5, tags: ['a', 'b'] };
      const result = await translateFields(input, 'es');

      expect(result.title).toBe('translated');
      expect(result.count).toBe(5);
      expect(result.tags).toEqual(['a', 'b']);
    });

    it('calls translateText once per string field', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ translatedText: 'ok' }),
      });

      await translateFields({ a: 'one', b: 'two', c: 3 }, 'fr');

      // 2 string fields → 2 fetch calls
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify they fail**

  ```bash
  yarn test tests/services/translate.test.js
  ```
  Expected: FAIL — module not found

- [ ] **Step 3: Implement `src/services/translate.js`**

  Create the file:

  ```js
  /**
   * Browser translate service
   *
   * Calls the /.netlify/functions/translate proxy to translate text via MyMemory.
   * The locale mapping (zh → zh-CN, etc.) is handled server-side in the function.
   *
   * To swap translation providers, update netlify/functions/translate.js only.
   */

  /**
   * Translate a single string to the target locale.
   * @param {string} text
   * @param {string} targetLang - project locale code (e.g. 'es', 'zh')
   * @param {string} sourceLang - defaults to 'en'
   * @returns {Promise<string>}
   */
  export async function translateText(text, targetLang, sourceLang = 'en') {
    const response = await fetch('/.netlify/functions/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang, sourceLang }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Translation failed (${response.status})`);
    }

    return data.translatedText;
  }

  /**
   * Translate all string values in a flat object.
   * Non-string values (arrays, numbers, objects) are passed through unchanged.
   * @param {Object} fields
   * @param {string} targetLang
   * @param {string} sourceLang - defaults to 'en'
   * @returns {Promise<Object>}
   */
  export async function translateFields(fields, targetLang, sourceLang = 'en') {
    const result = {};
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string') {
        result[key] = await translateText(value, targetLang, sourceLang);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**

  ```bash
  yarn test tests/services/translate.test.js
  ```
  Expected: all 5 tests PASS

- [ ] **Step 5: Run the full test suite to check for regressions**

  ```bash
  yarn test
  ```
  Expected: all tests PASS

- [ ] **Step 6: Commit**

  ```bash
  git add src/services/translate.js tests/services/translate.test.js
  git commit -m "feat(translate): add browser translate service"
  ```

---

## Task 3: Create the Netlify function

**Files:**
- Create: `netlify/functions/translate.js`

No unit test here — the function is a thin HTTP adapter. It is manually tested in Task 6 (via curl after the full feature is wired up).

- [ ] **Step 1: Create the functions directory and file**

  ```bash
  mkdir -p netlify/functions
  ```

  Create `netlify/functions/translate.js`:

  ```js
  /**
   * Netlify Function: translate
   *
   * POST { text, targetLang, sourceLang? }
   * → { translatedText }
   *
   * Proxies to the MyMemory free translation API.
   * Handles the zh → zh-CN locale code mapping.
   * MyMemory signals rate limits via responseStatus in the body (not HTTP status).
   */

  // Maps project locale codes to MyMemory language codes
  const LOCALE_MAP = {
    en: 'en',
    es: 'es',
    fr: 'fr',
    zh: 'zh-CN',
  };

  export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    const { text, targetLang, sourceLang = 'en' } = body;

    if (!targetLang) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'targetLang is required' }),
      };
    }

    const src = LOCALE_MAP[sourceLang] ?? sourceLang;
    const tgt = LOCALE_MAP[targetLang] ?? targetLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      // MyMemory returns 200 HTTP even on rate-limit — check body status
      if (data.responseStatus !== 200) {
        throw new Error(`MyMemory error (${data.responseStatus})`);
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translatedText: data.responseData.translatedText }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add netlify/functions/translate.js
  git commit -m "feat(translate): add Netlify translate function proxy"
  ```

---

## Task 4: Create the dev script + add `yarn translate`

**Files:**
- Create: `scripts/translate-content.js`
- Modify: `package.json`

The script uses static ESM imports, calls MyMemory directly, and rewrites the content files in place.

- [ ] **Step 1: Add `translate` to `package.json` scripts**

  Open `package.json`. In the `"scripts"` object, add after `"setup"`:

  ```json
  "translate": "node scripts/translate-content.mjs",
  ```

  Note: the script uses `.mjs` extension (consistent with `scripts/setup-seo.mjs`) because it uses ESM `import` syntax and top-level `await`. The project does not have `"type": "module"` in `package.json`, so `.mjs` is required.

- [ ] **Step 2: Create `scripts/translate-content.mjs`**

  ```js
  #!/usr/bin/env node
  /**
   * Translate content files to all configured locales.
   *
   * Usage:
   *   yarn translate                  — translate missing locales only (safe re-run)
   *   yarn translate --force          — overwrite all existing translations
   *   yarn translate --locale es      — translate only the 'es' locale
   *   yarn translate --force --locale es
   *
   * Reads:  src/content/pages.js, src/content/navigation.js
   * Writes: src/content/pages.js, src/content/navigation.js
   * Config: src/config/i18n.js (availableLanguages)
   *
   * Note: arrays (e.g. the 'features' field) are skipped — only top-level string
   * fields are translated.
   */

  import { writeFileSync } from 'fs';
  import { fileURLToPath } from 'url';
  import { dirname, join } from 'path';

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const ROOT = join(__dirname, '..');

  // Parse flags
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const localeIndex = args.indexOf('--locale');
  const onlyLocale = localeIndex !== -1 ? args[localeIndex + 1] : null;

  // MyMemory locale code mapping
  const LOCALE_MAP = { en: 'en', es: 'es', fr: 'fr', zh: 'zh-CN' };

  async function translateText(text, targetLang, sourceLang = 'en') {
    const src = LOCALE_MAP[sourceLang] ?? sourceLang;
    const tgt = LOCALE_MAP[targetLang] ?? targetLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory error (${data.responseStatus}) — daily limit may be reached`);
    }
    return data.responseData.translatedText;
  }

  async function translateStringFields(fields, targetLang) {
    const result = {};
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string') {
        result[key] = await translateText(value, targetLang);
        console.log(`    ✓ ${key}: "${result[key]}"`);
      } else {
        result[key] = value; // arrays, numbers, objects passed through
      }
    }
    return result;
  }

  // Static imports — these files have no browser-specific dependencies
  const { pages } = await import('../src/content/pages.js');
  const { navigation } = await import('../src/content/navigation.js');
  const { availableLanguages } = await import('../src/config/i18n.js');

  const allTargetLocales = Object.keys(availableLanguages).filter((l) => l !== 'en');
  const targetLocales = onlyLocale ? [onlyLocale] : allTargetLocales;

  if (onlyLocale && !allTargetLocales.includes(onlyLocale)) {
    console.error(`Error: locale "${onlyLocale}" is not in availableLanguages`);
    process.exit(1);
  }

  let hasError = false;

  // ─── Translate pages ──────────────────────────────────────────────────────────

  const updatedPages = JSON.parse(JSON.stringify(pages)); // deep clone

  for (const [pageId, pageLocales] of Object.entries(pages)) {
    if (!pageLocales.en) {
      console.warn(`Skipping pages.${pageId} — no English source content`);
      continue;
    }
    for (const locale of targetLocales) {
      if (!force && pageLocales[locale]) {
        console.log(`Skipping pages.${pageId}.${locale} (exists — use --force to overwrite)`);
        continue;
      }
      console.log(`Translating pages.${pageId}.${locale}...`);
      try {
        updatedPages[pageId][locale] = await translateStringFields(pageLocales.en, locale);
      } catch (err) {
        console.error(`✗ Error: ${err.message}`);
        hasError = true;
        break;
      }
    }
    if (hasError) break;
  }

  // ─── Translate navigation labels ──────────────────────────────────────────────

  const updatedNavigation = JSON.parse(JSON.stringify(navigation)); // deep clone

  if (!hasError) {
    for (const [menuId, items] of Object.entries(navigation)) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        for (const locale of targetLocales) {
          if (!force && item.labels?.[locale]) {
            console.log(`Skipping navigation.${menuId}.${item.id}.labels.${locale} (exists)`);
            continue;
          }
          const enLabel = item.labels?.en;
          if (!enLabel) continue;
          console.log(`Translating navigation.${menuId}.${item.id}.labels.${locale}...`);
          try {
            const translated = await translateText(enLabel, locale);
            console.log(`    ✓ "${translated}"`);
            updatedNavigation[menuId][i].labels[locale] = translated;
          } catch (err) {
            console.error(`✗ Error: ${err.message}`);
            hasError = true;
            break;
          }
        }
        if (hasError) break;
      }
      if (hasError) break;
    }
  }

  // ─── Write results ────────────────────────────────────────────────────────────

  if (hasError) {
    console.error('\n❌ Translation stopped due to an error. No files were written.');
    process.exit(1);
  }

  const pagesHeader = `/**
   * Local page content
   *
   * All content is organized by page, then by locale.
   * Add a new locale key to each page to support additional languages.
   * If a requested locale is missing, the content service falls back to 'en'.
   *
   * To add a new language:
   *   1. Add the locale key here (e.g., \`de: { title: '...' }\`)
   *   2. Add the locale to \`src/config/i18n.js\` availableLanguages
   *   3. Add a locale JSON file at \`src/i18n/locales/de.json\` for UI strings
   *
   * When Firebase CMS is enabled, these values serve as defaults until
   * an admin updates the content via the /admin dashboard.
   */

  export const pages = `;

  const navHeader = `/**
   * Local navigation content
   *
   * Each nav item has locale-keyed labels so navigation can be translated.
   * The href and order fields are shared across all locales.
   * The content service resolves the correct label for the active locale.
   *
   * To add a label for a new language, add the locale key to each item's labels object.
   */

  export const navigation = `;

  writeFileSync(
    join(ROOT, 'src/content/pages.js'),
    pagesHeader + JSON.stringify(updatedPages, null, 2) + ';\n',
  );

  writeFileSync(
    join(ROOT, 'src/content/navigation.js'),
    navHeader + JSON.stringify(updatedNavigation, null, 2) + ';\n',
  );

  console.log('\n✅ Done! Content files updated.');
  ```

- [ ] **Step 3: Run the script to verify it works end-to-end**

  ```bash
  yarn translate
  ```
  Expected output: lines like `✓ subtitle: "Una plantilla SPA moderna"` for each field/locale, then `✅ Done! Content files updated.`

  Check the output:
  ```bash
  node -e "import('./src/content/pages.js').then(m => console.log(JSON.stringify(m.pages.home.es, null, 2)))"
  ```
  Expected: Spanish content object with translated fields.

- [ ] **Step 4: Verify re-run is a no-op**

  ```bash
  yarn translate
  ```
  Expected: all lines say `Skipping ... (exists)` — no API calls made, no file changes.

- [ ] **Step 5: Run the full test suite to check for regressions**

  ```bash
  yarn format && yarn lint && yarn test
  ```
  Expected: all pass (lint may flag the script — fix any errors before committing).

- [ ] **Step 6: Commit**

  ```bash
  git add scripts/translate-content.mjs package.json
  git commit -m "feat(translate): add yarn translate script to seed content files"
  ```

---

## Task 5: Admin UI — "Translate all" button

**Files:**
- Modify: `src/components/AdminDashboard.jsx`

No automated test added — the admin component has no existing tests. Manual testing is in Task 6.

- [ ] **Step 1: Add the translate service import**

  Open `src/components/AdminDashboard.jsx`. After the existing imports, add:

  ```js
  import { translateFields } from 'services/translate';
  ```

- [ ] **Step 2: Add `translatingAll` state**

  In the component body, after the existing state declarations (around line 293), add:

  ```js
  const [translatingAll, setTranslatingAll] = useState(false);
  ```

- [ ] **Step 3: Add the `handleTranslateAll` handler**

  After `handlePageSubmit`, add:

  ```js
  const handleTranslateAll = async () => {
    setTranslatingAll(true);
    const otherLocales = Object.keys(availableLanguages).filter((l) => l !== 'en');
    const saved = [];
    const failed = [];

    for (const locale of otherLocales) {
      try {
        const translated = await translateFields(pageForm, locale);
        await contentService.updatePage('home', locale, translated);
        saved.push(locale.toUpperCase());
      } catch {
        failed.push(locale.toUpperCase());
      }
    }

    setTranslatingAll(false);

    if (saved.length) {
      toast.success(`Translated and saved: ${saved.join(', ')}`);
    }
    if (failed.length) {
      toast.error(`Failed to translate: ${failed.join(', ')}`);
    }
  };
  ```

- [ ] **Step 4: Update the "Save Changes" button to disable during translation**

  Find the Save button for the home page form (around line 1082 in the file):

  ```jsx
  <Button type="submit" disabled={loading || !homeContent}>
    {loading ? 'Saving...' : 'Save Changes'}
  </Button>
  ```

  Update the `disabled` condition to also block saves while translation is in progress:

  ```jsx
  <Button type="submit" disabled={loading || !homeContent || translatingAll || translatingLocale}>
    {loading ? 'Saving...' : 'Save Changes'}
  </Button>
  ```

  Note: `translatingLocale` is added in Task 6 Step 1 — if implementing tasks in order, add it now as `translatingAll` only, then update again in Task 6:

  ```jsx
  <Button type="submit" disabled={loading || !homeContent || translatingAll}>
    {loading ? 'Saving...' : 'Save Changes'}
  </Button>
  ```

- [ ] **Step 5: Add the "Translate all" button to the page form header** (replaces the bare `<h3>` line)

  Find this block in the JSX (the page editor heading area, around line 940):

  ```jsx
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '0.5rem',
    }}
  >
    <h3>Edit Home Page</h3>
    <div style={{ display: 'flex', gap: '0.25rem' }}>
  ```

  Replace the `<h3>Edit Home Page</h3>` line with:

  ```jsx
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <h3 style={{ margin: 0 }}>Edit Home Page</h3>
    {editingLocale === 'en' && (
      <Button
        type="button"
        variant="secondary"
        disabled={translatingAll || loading}
        onClick={handleTranslateAll}
        style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
      >
        {translatingAll ? 'Translating…' : '✨ Translate all'}
      </Button>
    )}
  </div>
  ```

- [ ] **Step 6: Format and lint**

  ```bash
  yarn format && yarn lint
  ```
  Fix any errors before continuing.

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/AdminDashboard.jsx
  git commit -m "feat(admin): add Translate all button to page editor"
  ```

---

## Task 6: Admin UI — "Translate from EN" hint + manual testing

**Files:**
- Modify: `src/components/AdminDashboard.jsx`

- [ ] **Step 1: Add `localeHasContent` state**

  After `translatingAll`, add:

  ```js
  const [localeHasContent, setLocaleHasContent] = useState(true);
  const [translatingLocale, setTranslatingLocale] = useState(false);
  ```

- [ ] **Step 2: Check locale content when `editingLocale` changes**

  Add a new `useEffect` after the existing page form init effect:

  ```js
  useEffect(() => {
    if (editingPage !== 'home' || editingLocale === 'en') {
      setLocaleHasContent(true);
      return;
    }
    contentService.hasLocaleContent('home', editingLocale).then(setLocaleHasContent);
  }, [editingPage, editingLocale]);
  ```

- [ ] **Step 3: Add the `handleTranslateLocale` handler**

  After `handleTranslateAll`, add:

  ```js
  const handleTranslateLocale = async () => {
    setTranslatingLocale(true);
    try {
      // Load the English source content to translate from
      const enContent = await contentService.getPage('home', 'en');
      const translated = await translateFields(enContent, editingLocale);
      setPageForm({
        title: translated.title || '',
        subtitle: translated.subtitle || '',
        viewDemo: translated.viewDemo || '',
        viewGitHub: translated.viewGitHub || '',
        copyright: translated.copyright || '',
      });
    } catch {
      toast.error('Translation failed. Try again.');
    } finally {
      setTranslatingLocale(false);
    }
  };
  ```

- [ ] **Step 4: Add the hint banner to the page form**

  Find the `<Form onSubmit={handlePageSubmit}>` opening tag (inside the page editor card). Add this hint banner as the first child of the form, before the first `<FormGroup>`:

  ```jsx
  {editingLocale !== 'en' && !localeHasContent && (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0.75rem',
        marginBottom: '1rem',
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '0.375rem',
      }}
    >
      <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
        No {editingLocale.toUpperCase()} content yet
      </span>
      <Button
        type="button"
        variant="secondary"
        disabled={translatingLocale}
        onClick={handleTranslateLocale}
        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
      >
        {translatingLocale ? 'Translating…' : 'Translate from EN →'}
      </Button>
    </div>
  )}
  ```

- [ ] **Step 5: Update Save button to also disable during per-locale translation**

  Find the Save button updated in Task 5 Step 4. Update it to also include `translatingLocale`:

  ```jsx
  <Button type="submit" disabled={loading || !homeContent || translatingAll || translatingLocale}>
    {loading ? 'Saving...' : 'Save Changes'}
  </Button>
  ```

- [ ] **Step 6: Format and lint**

  ```bash
  yarn format && yarn lint && yarn test
  ```
  Expected: all pass.

- [ ] **Step 7: Manual test — "Translate all" (requires `netlify dev`)**

  ```bash
  yarn build && netlify dev
  ```
  Open `http://localhost:8888/admin` → Content tab → Edit Home Page.

  1. Confirm you are on the EN tab — "✨ Translate all" button is visible
  2. Click "Translate all" — button shows "Translating…" spinner
  3. After a few seconds, toast: "Translated and saved: ES, FR, ZH"
  4. Switch to the ES tab — fields contain Spanish content; hint banner is absent
  5. Switch to the FR tab — fields contain French content

- [ ] **Step 8: Manual test — "Translate from EN" hint**

  Still in the admin editor:

  1. Switch to a non-EN tab that has no content (temporarily remove a locale from `src/content/pages.js` and restart to simulate, or use a fresh Firebase environment)
  2. The hint banner "No ES content yet" + "Translate from EN →" should appear
  3. Click "Translate from EN →" — fields populate with translated content
  4. Fields are NOT saved automatically — click "Save Changes"
  5. After saving, hint disappears

- [ ] **Step 9: Manual test — Netlify function directly**

  ```bash
  # Success case
  curl -s -X POST http://localhost:8888/.netlify/functions/translate \
    -H "Content-Type: application/json" \
    -d '{"text":"Hello world","targetLang":"es"}' | jq .
  # Expected: {"translatedText":"Hola mundo"}

  # Validation error
  curl -s -X POST http://localhost:8888/.netlify/functions/translate \
    -H "Content-Type: application/json" \
    -d '{"text":"Hello","targetLang":""}' | jq .
  # Expected: HTTP 400, {"error":"targetLang is required"}
  ```

- [ ] **Step 10: Commit**

  ```bash
  git add src/components/AdminDashboard.jsx
  git commit -m "feat(admin): add Translate from EN hint to page editor"
  ```

---

## Final Checks

- [ ] Run the full suite one last time:
  ```bash
  yarn format && yarn lint && yarn test
  ```
  Expected: all pass, 0 errors.

- [ ] Verify `yarn translate` still works (script wasn't broken by any of the UI changes):
  ```bash
  yarn translate --force --locale es
  ```
  Expected: ES fields re-translated and written to `src/content/pages.js`.
