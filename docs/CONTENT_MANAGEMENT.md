# Content Management Guide

This guide explains how to add and manage content in the template, including the workflow for developers adding new content fields and the workflow for clients updating content via the admin dashboard.

## Content Architecture

The template uses a two-tier content system with a hybrid nested/flat structure:

### 1. Page Content (CMS-Managed)
- **Location:** `src/content/pages.js` (local fallback, nested structure) + Firebase Firestore (live, flat structure)
- **Purpose:** Section titles, subtitles, descriptions, CTA text, etc.
- **Editable:** Yes, via `/admin` dashboard
- **Fallback:** Local content if Firebase is unavailable
- **Language Support:** Yes, via locale keys (en, es, etc.)
- **Structure:** Nested by section in local files, flat in Firebase (auto-transformed)

### 2. UI Strings (Local Only)
- **Location:** `src/i18n/locales/en.json`, `es.json`
- **Purpose:** Navigation labels, button text, form labels, error messages
- **Editable:** No, these are static UI strings
- **Fallback:** None (local only)
- **Language Support:** Yes, via i18next

## Hybrid Structure Explained

**Local files (`src/content/pages.js`) - Nested:**
```javascript
home: {
  en: {
    hero: {
      title: 'Your Headline',
      subtitle: 'Your tagline',
    },
    services: {
      title: 'Our Services',
      subtitle: 'What we do',
    },
  }
}
```

**Firebase (CMS) - Flat with section prefixes:**
```javascript
home: {
  en: {
    heroTitle: 'Your Headline',
    heroSubtitle: 'Your tagline',
    servicesTitle: 'Our Services',
    servicesSubtitle: 'What we do',
  }
}
```

**Components - Nested access:**
```javascript
const title = content?.hero?.title ?? 'Default';
```

**Why this hybrid approach?**
- **Nested in local files:** Clean organization, easy to find section content, modular structure
- **Flat in Firebase:** Simple admin UI, no nested forms, easier for clients
- **Auto-transformation:** Content service handles conversion automatically

## Adding New Content Fields

When you need to add a new text field to a section (e.g., adding a "mission" field to the About section), follow this workflow:

### Step 1: Add Field to Schema

**File:** `src/content/schema.js`

Add the field definition with section prefix to the appropriate page's schema:

```javascript
export const pageSchema = {
  home: {
    label: 'Home',
    emoji: '🏠',
    fields: [
      // ... existing fields
      { key: 'aboutTitle', label: 'About Section Title', type: 'text' },
      { key: 'aboutSubtitle', label: 'About Section Subtitle', type: 'textarea' },
      { key: 'aboutDescription', label: 'About Section Description', type: 'textarea' },
      { key: 'aboutMission', label: 'About Section Mission', type: 'textarea' }, // NEW FIELD
    ],
  },
};
```

**Important:** Use section prefix (e.g., `aboutMission`) for the key. This matches the flat structure in Firebase.

**Field Types:**
- `text` - Single-line text input
- `textarea` - Multi-line text input
- `number` - Numeric input
- `boolean` - Toggle switch
- `url` - URL input with validation

### Step 2: Add Content to Local Files

**File:** `src/content/pages.js`

Add the content for both English and Spanish (and any other locales) using **nested structure**:

```javascript
export const pages = {
  home: {
    en: {
      // ... existing sections
      about: {
        title: 'About Us',
        subtitle: 'Learn more about our company and values',
        description: 'We are dedicated to delivering excellence...',
        mission: 'Our mission is to empower businesses through innovative technology solutions.', // NEW
      },
    },
    es: {
      // ... existing sections
      about: {
        title: 'Sobre Nosotros',
        subtitle: 'Conoce más sobre nuestra empresa y valores',
        description: 'Estamos dedicados a entregar excelencia...',
        mission: 'Nuestra misión es empoderar a las empresas a través de soluciones tecnológicas innovadoras.', // NEW
      },
    },
  },
};
```

**Important:** Use nested structure in local files (e.g., `about.mission`), not flat.

### Step 3: Update the Component

**File:** `src/components/sections/About.jsx`

Use the `usePage` hook to fetch and render the new field with **nested access**:

```javascript
import { usePage } from 'hooks/useContent';

export default function About() {
  const { content, loading } = usePage('home');

  const mission = content?.about?.mission ?? (loading ? null : 'Our mission is to empower businesses...');

  return (
    <Wrapper id="about">
      {/* ... existing JSX */}
      {mission && (
        <MissionText>{mission}</MissionText>
      )}
    </Wrapper>
  );
}
```

**Key Points:**
- Always use nested access: `content?.sectionName?.fieldName`
- Provide a fallback value for when CMS is disabled or loading
- Use `loading` state to show skeleton UI if needed

### Step 4: Seed to Firestore

Run the seed script to push your local content to Firebase:

```bash
yarn seed
```

This will:
- Read content from `src/content/pages.js` (nested structure)
- Transform nested to flat structure automatically
- Push it to Firestore as the initial content
- Use merge writes (safe to re-run, won't wipe existing data)

### Step 5: Client Updates via Admin

After seeding, clients can:
1. Go to `/admin` dashboard
2. Navigate to **Content** > **Home** page
3. Find the new field (e.g., "About Section Mission")
4. Edit the content directly
5. Save changes

Firebase content will supersede local content when CMS is enabled. The content service automatically transforms between flat (Firebase) and nested (components) structures.

## Content Fallback Behavior

The content service (`src/services/content.js`) handles fallbacks automatically:

1. **Firebase CMS enabled:**
   - Try to fetch from Firestore first
   - If successful, use Firebase content
   - If Firebase fails, fall back to local content

2. **Firebase CMS disabled:**
   - Use local content from `src/content/pages.js` immediately

3. **Locale fallback:**
   - If requested locale (e.g., `es`) is missing
   - Fall back to English (`en`)
   - If English is also missing, return `null`

## Adding a New Section

To add an entirely new section (not just a field):

### 1. Create Section Component

**File:** `src/components/sections/NewSection.jsx`

```javascript
import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';

const Wrapper = styled.section`
  padding: 6rem 2rem;
`;

export default function NewSection() {
  const { content, loading } = usePage('home');

  const title = content?.newSection?.title ?? (loading ? null : 'Default Title');
  const subtitle = content?.newSection?.subtitle ?? (loading ? null : 'Default Subtitle');

  return (
    <Wrapper id="new-section">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </Wrapper>
  );
}
```

### 2. Add Schema Fields

**File:** `src/content/schema.js`

Add fields with section prefix:

```javascript
fields: [
  // ... existing fields
  { key: 'newSectionTitle', label: 'New Section Title', type: 'text' },
  { key: 'newSectionSubtitle', label: 'New Section Subtitle', type: 'textarea' },
],
```

### 3. Add Local Content (Nested)

**File:** `src/content/pages.js`

Add nested section object:

```javascript
en: {
  // ... existing sections
  newSection: {
    title: 'Our New Section',
    subtitle: 'This is a new section we added',
  },
},
es: {
  // ... existing sections
  newSection: {
    title: 'Nuestra Nueva Sección',
    subtitle: 'Esta es una nueva sección que agregamos',
  },
},
```

### 4. Add to Home Page

**File:** `src/pages/Home.jsx`

```javascript
import NewSection from 'components/sections/NewSection';

const SECTIONS = [
  { id: 'hero', component: Hero },
  { id: 'new-section', component: NewSection }, // NEW
  // ... other sections
];
```

### 5. Add to Section Config

**File:** `src/config/sections.js`

```javascript
export const SECTIONS_CONFIG = {
  newSection: true, // NEW
  // ... other sections
  navigation: [
    { id: 'new-section', enabled: true }, // NEW
    // ... other nav items
  ],
};
```

### 6. Add Navigation Label

**File:** `src/i18n/locales/en.json`

```json
"nav": {
  "newSection": "New Section",
  // ... other nav items
}
```

### 7. Update Content Service Transformation

**File:** `src/services/content.js`

Add the new section prefix to the transformation functions:

```javascript
const sectionPrefixes = ['hero', 'services', 'about', 'gallery', 'faq', 'contact', 'cta', 'newSection'];
```

Also update `scripts/seed-content.mjs` with the same prefix.

### 8. Seed and Test

```bash
yarn seed
```

## Quick Reference

| Task | File | Structure | Command |
|------|------|-----------|---------|
| Add field to admin | `src/content/schema.js` | Flat with prefix (e.g., `aboutMission`) | - |
| Add local content | `src/content/pages.js` | Nested (e.g., `about.mission`) | - |
| Update component | `src/components/sections/*.jsx` | Nested access (e.g., `content?.about?.mission`) | - |
| Add navigation label | `src/i18n/locales/*.json` | - | - |
| Add new section prefix | `src/services/content.js` | Update `sectionPrefixes` array | - |
| Add new section prefix | `scripts/seed-content.mjs` | Update `sectionPrefixes` array | - |
| Push to Firebase | - | Auto-transforms nested→flat | `yarn seed` |
| Test content | Browser | Auto-transforms flat→nested | - |

## Best Practices

1. **Always add to schema first** - This ensures the field appears in the admin editor
2. **Use section prefixes in schema** - Schema keys should be flat with prefixes (e.g., `aboutMission`)
3. **Use nested structure in local files** - Local content should be organized by section (e.g., `about.mission`)
4. **Use nested access in components** - Components should access content as `content?.section?.field`
5. **Provide fallback values** - Components should work even without CMS
6. **Seed after changes** - Run `yarn seed` after updating local content
7. **Use consistent naming** - Field names should match section names (e.g., `aboutTitle`, `servicesSubtitle`)
8. **Keep UI strings separate** - Navigation, buttons, and form labels go in i18n files, not page content
9. **Test both locales** - Ensure content works in English and Spanish
10. **Update transformation functions** - When adding new sections, update the sectionPrefixes array in content service and seed script

## Troubleshooting

**Field not showing in admin:**
- Check that the field is added to `src/content/schema.js` with section prefix
- Verify the field key matches the transformation pattern (e.g., `aboutMission`)
- Check that the section prefix is in the `sectionPrefixes` array in content service

**Content not updating:**
- Run `yarn seed` to push local content to Firebase
- Check that Firebase CMS is enabled in `src/config/firebase.js`
- Verify the transformation functions are working correctly

**Fallback content not loading:**
- Verify content exists in `src/content/pages.js` with nested structure
- Check that locale keys match (en, es)
- Ensure the component uses nested access (`content?.section?.field`)
- Check that the section prefix is in the transformation array

**Language switching not working:**
- Verify content exists for both locales in `src/content/pages.js` (nested)
- Check that the component uses `usePage` (not i18n for content)
- Ensure locale fallback is working (en → requested locale)
- Verify transformation functions handle both locales correctly

**Transformation not working:**
- Check that `sectionPrefixes` array includes all sections in `src/services/content.js`
- Verify the same array is updated in `scripts/seed-content.mjs`
- Ensure field naming follows the pattern: `sectionPrefix + fieldName` (e.g., `aboutMission`)
- Check that local content uses nested structure (e.g., `about.mission`)
