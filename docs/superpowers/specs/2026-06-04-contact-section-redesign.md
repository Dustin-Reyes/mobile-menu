# Contact Section Redesign

**Date:** 2026-06-04
**Branch:** 1-single-page-layout
**Files touched:** `Contact.jsx`, `ContactForm.jsx`, `en.json`, `es.json`

## Overview

Restyle the Contact section to match the new design: a dark theme-aware two-column layout with amber icon accents, a cleaner info panel (no social links), a side-by-side Name+Email row in the form, and a privacy footer row below the message field.

## Approach

Surgical edits to existing files. No new files or components — the current Contact.jsx / ContactForm.jsx separation stays intact.

---

## Section 1 — Contact.jsx (Info Panel)

### InfoPanel

Remove the purple gradient. Replace with a theme-aware card:

- `background: theme.colors.surface`
  - dark mode: `#1C1C1C`
  - light mode: `#F5F5F5`
- `border: 1px solid theme.colors.border`
- All text colors: switch from hardcoded `#fff` / `rgba(white, N)` → `theme.colors.text` / `theme.colors.textSecondary`

### Panel header

Add a `Send` icon (lucide-react) rendered inside a small amber square container above "Get in touch". The container uses:
- `background: ${theme.colors.primary}22` (≈15% opacity amber fill)
- `color: theme.colors.primary`
- `border-radius: theme.borderRadius.s2`
- Size: `48px × 48px`, icon `20px`

"Get in touch" text and subtitle both use theme-aware colors (`theme.colors.text`, `theme.colors.textSecondary`).

> **Note:** `Contact.jsx` already imports `useTranslation` but the component body never destructures `t`. Add `const { t } = useTranslation();` at the top of the component function.

### IconWrapper (contact item icons)

Change from circular (`border-radius: 50%`) white-on-purple to:
- `border-radius: theme.borderRadius.s2` (rounded square)
- `background: ${theme.colors.primary}22`
- `color: theme.colors.primary`
- Size stays `40px × 40px`

### Contact item hover state

Change from `rgba(255, 255, 255, 0.25)` fill to `${theme.colors.primary}10` (subtle amber tint, theme-safe).

### Removed

The following styled components and all their JSX usage are deleted:
- `Divider`
- `SocialLabel`
- `SocialLinks`
- `SocialLink`

The `SOCIAL_REGISTRY` constant and the `activeSocial` derived variable are also removed.

The social icon imports (`Facebook`, `Instagram`, `Twitter`, `Linkedin`, `Github`, `Youtube`) are removed from the lucide-react import.

---

## Section 2 — ContactForm.jsx (Form Layout + Privacy Footer)

### Name + Email row

Add a `FormRow` styled component:

```
display: grid;
grid-template-columns: 1fr 1fr;
gap: 1.5rem;

@media (max-width: theme.breakpoints.tablet) {
  grid-template-columns: 1fr;
}
```

Wrap the `name` and `email` `FormGroup` elements inside a single `<FormRow>`.

### Privacy footer row

Add below the message `FormGroup` (above the submit button). Layout:

```
display: flex;
align-items: center;
justify-content: space-between;
flex-wrap: wrap;
gap: 1rem;
padding-top: 0.5rem;

@media (max-width: theme.breakpoints.tablet) {
  flex-direction: column;
  align-items: stretch;
}
```

Left side — `PrivacyNote`:
- `ShieldCheck` icon (lucide-react, 16px, amber `theme.colors.primary`)
- Text: `t('contact.privacy')` — "We'll never share your information."
- Amber `<a>` link: `t('contact.privacyPolicy')` — "View our Privacy Policy", `href="#"`

Right side — the existing submit `Button` moves **inside** `PrivacyRow` (it is no longer a direct child of `<Form>`). No style change to the Button component itself; it becomes right-aligned naturally within the flex row.

On mobile (`< tablet`), `PrivacyNote` stacks above the button, button stretches full-width.

### Button icon

Add a `Send` icon (lucide-react, 16px) after the label text in the non-loading state:

```jsx
<>
  {t('contactForm.send', 'Send Message')}
  <Send size={16} style={{ marginLeft: '0.5rem' }} />
</>
```

The loading state (`Loader2` spinner) is unchanged.

---

## Section 3 — i18n additions

Add a root-level `contact` key to both locale files. No existing keys are changed.

### en.json

```json
"contact": {
  "getInTouch": "Get in touch",
  "getInTouchSubtitle": "Have a question or want to work together? Reach out and let's make it happen.",
  "privacy": "We'll never share your information.",
  "privacyPolicy": "View our Privacy Policy"
}
```

### es.json

```json
"contact": {
  "getInTouch": "Contáctanos",
  "getInTouchSubtitle": "¿Tienes alguna pregunta o quieres trabajar juntos? Escríbenos y hagámoslo realidad.",
  "privacy": "Nunca compartiremos tu información.",
  "privacyPolicy": "Ver nuestra Política de Privacidad"
}
```

Usage in `Contact.jsx`:
- `t('contact.getInTouch')` — panel title
- `t('contact.getInTouchSubtitle')` — panel subtitle

Usage in `ContactForm.jsx`:
- `t('contact.privacy')` — privacy note text
- `t('contact.privacyPolicy')` — privacy policy link text

---

## Mobile-first behaviour

| Viewport | Info panel | Form |
|---|---|---|
| Mobile (< tablet) | Full width, stacked above form | Full width; Name+Email stacked; privacy note above full-width button |
| Tablet+ | 1fr / 1fr grid | Name+Email side-by-side; privacy note left, button right |

---

## What is NOT changing

- Form validation logic in `ContactForm.jsx` — unchanged
- Existing `contactForm.*` i18n keys — unchanged
- Section header (title + subtitle) pulled from CMS via `usePage('home')` — unchanged
- The `ContactItem` / `ContactItemStatic` link behaviour (mailto, tel) — unchanged
- The `FormPanel` right card styles — unchanged
- Business hours — omitted from this iteration
