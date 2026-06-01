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
const LOCALE_MAP = { en: 'en', es: 'es' };

async function translateText(text, targetLang, sourceLang = 'en') {
  const src = LOCALE_MAP[sourceLang] ?? sourceLang;
  const tgt = LOCALE_MAP[targetLang] ?? targetLang;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(
      `MyMemory error (${data.responseStatus}) — daily limit may be reached`,
    );
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

const allTargetLocales = Object.keys(availableLanguages).filter(
  (l) => l !== 'en',
);
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
      console.log(
        `Skipping pages.${pageId}.${locale} (exists — use --force to overwrite)`,
      );
      continue;
    }
    console.log(`Translating pages.${pageId}.${locale}...`);
    try {
      updatedPages[pageId][locale] = await translateStringFields(
        pageLocales.en,
        locale,
      );
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
          console.log(
            `Skipping navigation.${menuId}.${item.id}.labels.${locale} (exists)`,
          );
          continue;
        }
        const enLabel = item.labels?.en;
        if (!enLabel) continue;
        console.log(
          `Translating navigation.${menuId}.${item.id}.labels.${locale}...`,
        );
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
  console.error(
    '\n❌ Translation stopped due to an error. No files were written.',
  );
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
