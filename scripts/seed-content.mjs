#!/usr/bin/env node
/**
 * Seed Firestore with local content
 *
 * Pushes src/content/pages.js, settings.js, and navigation.js to Firestore
 * using merge writes — safe to re-run; never wipes existing data.
 *
 * Authentication (choose one):
 *   1. Service account key (recommended):
 *        FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json yarn seed
 *        Download from: Firebase Console > Project Settings > Service Accounts
 *
 *   2. Application Default Credentials:
 *        gcloud auth application-default login
 *        yarn seed
 *
 * Usage:
 *   yarn seed                  — seed all collections
 *   yarn seed --dry-run        — preview what would be written, no writes
 *
 * Workflow for adding a new section:
 *   1. Add fields to src/content/schema.js
 *   2. Add content values to src/content/pages.js
 *   3. Run yarn seed to push to Firestore
 *   4. Edit live in the /admin dashboard
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const isDryRun = process.argv.includes('--dry-run');

// ─── Load .env ────────────────────────────────────────────────────────────────

function loadDotenv() {
  const envFile = join(ROOT, '.env');
  if (!existsSync(envFile)) return;
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadDotenv();

// ─── Validate config ──────────────────────────────────────────────────────────

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error('❌  VITE_FIREBASE_PROJECT_ID not set. Check your .env file.');
  process.exit(1);
}

// ─── Initialize Firebase Admin ────────────────────────────────────────────────

let credential;
const saEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

if (saEnv) {
  const saPath = resolve(ROOT, saEnv);
  if (!existsSync(saPath)) {
    console.error(`❌  Service account file not found: ${saPath}`);
    console.error(
      '    Download from Firebase Console > Project Settings > Service Accounts',
    );
    process.exit(1);
  }
  credential = cert(JSON.parse(readFileSync(saPath, 'utf8')));
  console.log(`🔑  Using service account: ${saEnv}`);
} else {
  credential = applicationDefault();
  console.log('🔑  Using Application Default Credentials');
  console.log(
    '    (run `gcloud auth application-default login` if this fails)\n',
  );
}

initializeApp({ credential, projectId });
const db = getFirestore();

// ─── Load local content ───────────────────────────────────────────────────────

const { pages } = await import('../src/content/pages.js');
const { settings } = await import('../src/content/settings.js');
const { navigation } = await import('../src/content/navigation.js');

/**
 * Transform nested section structure to flat field names
 * e.g., { hero: { title: '...' }, services: { title: '...' } } → { heroTitle: '...', servicesTitle: '...' }
 */
function transformNestedToFlat(nestedData) {
  if (!nestedData || typeof nestedData !== 'object') return nestedData;

  const flat = {};
  const sectionPrefixes = [
    'hero',
    'services',
    'about',
    'gallery',
    'faq',
    'contact',
    'cta',
    'header',
    'features',
    'footer',
  ];

  for (const [key, value] of Object.entries(nestedData)) {
    if (sectionPrefixes.includes(key) && typeof value === 'object') {
      // This is a section object, transform its fields
      for (const [field, fieldValue] of Object.entries(value)) {
        // Convert to camelCase with prefix
        const flatKey = key + field.charAt(0).toUpperCase() + field.slice(1);
        flat[flatKey] = fieldValue;
      }
    } else {
      flat[key] = value;
    }
  }

  return flat;
}

// ─── Write helpers ────────────────────────────────────────────────────────────

async function upsert(collection, docId, data) {
  if (isDryRun) {
    console.log(
      `  [dry-run] ${collection}/${docId}:`,
      JSON.stringify(data, null, 2),
    );
    return;
  }
  await db.collection(collection).doc(docId).set(data, { merge: true });
  console.log(`  ✓ ${collection}/${docId}`);
}

// ─── Seed pages ───────────────────────────────────────────────────────────────
// Each page is one Firestore document with locale keys: { en: {...}, es: {...} }
// Transform nested section structure to flat field names for Firebase

console.log('\n📄  Seeding pages...');
for (const [pageId, locales] of Object.entries(pages)) {
  const transformedLocales = {};
  for (const [locale, content] of Object.entries(locales)) {
    // Transform nested to flat for Firebase storage
    transformedLocales[locale] = transformNestedToFlat(content);
  }
  await upsert('pages', pageId, transformedLocales);
}

// ─── Seed settings ────────────────────────────────────────────────────────────
// Each settings category is one document: settings/site, settings/seo, etc.

console.log('\n⚙️   Seeding settings...');
for (const [category, values] of Object.entries(settings)) {
  await upsert('settings', category, values);
}

// ─── Seed navigation ──────────────────────────────────────────────────────────
// Each nav item is its own document so the content service can query by menu.

console.log('\n🧭  Seeding navigation...');
for (const [menuId, items] of Object.entries(navigation)) {
  for (const item of items) {
    const docId = item.id ?? `${menuId}_${item.order}`;
    await upsert('navigation', docId, { ...item, menu: menuId });
  }
  if (items.length === 0) {
    console.log(`  (skipped ${menuId} — no items)`);
  }
}

console.log(
  isDryRun
    ? '\n✅  Dry run complete — no data was written.'
    : '\n✅  Seed complete. Open /admin to manage content.',
);
