# Internationalization (i18n) Guide

This guide explains how to use and customize the internationalization (i18n) system in this SPA template.

## Overview

The i18n system is built with [react-i18next](https://react.i18next.com/) and provides:

- 🌍 Multi-language support with automatic detection
- 🎛️ Opt-in configuration for developers
- 🔄 Seamless language switching
- 💾 Language persistence in localStorage
- 📱 SEO-friendly with hreflang support
- ⚡ Lazy-loaded translations for performance

## Quick Start

### 1. Enable i18n

The i18n system is enabled by default. To disable it, edit `src/config/i18n.js`:

```javascript
export const i18nConfig = {
  enabled: false, // Disable i18n
  // ... other settings
};
```

### 2. Configure Available Languages

Edit `src/config/i18n.js` to specify which languages your app supports:

```javascript
export const i18nConfig = {
  availableLanguages: {
    en: {
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
    },
    es: {
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
    },
    // Add more languages...
  },
};
```

### 3. Use Translations in Components

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.message')}</p>
    </div>
  );
}
```

## Translation Files

### Structure

Translation files are located in `src/i18n/locales/`:

```
src/i18n/locales/
├── en.json          # English translations
├── es.json          # Spanish translations
└── [language].json  # Add more languages
```

### Translation Format

Each translation file follows this structure:

```json
{
  "namespace": {
    "key": "Translation text",
    "nested": {
      "key": "Nested translation"
    }
  }
}
```

### Best Practices

1. **Use descriptive keys**: `user.profile.title` instead of `title1`
2. **Group related translations**: `navigation.home`, `navigation.about`
3. **Keep keys consistent across languages**
4. **Use interpolation for dynamic content**:

```json
{
  "welcome": "Welcome, {{name}}!",
  "items": "You have {{count}} items"
}
```

```jsx
// In component
t('welcome', { name: 'John' });
t('items', { count: 5 });
```

## Language Switcher

### Basic Usage

```jsx
import LanguageSwitcher from 'components/LanguageSwitcher';

// Full language switcher
<LanguageSwitcher />

// Compact version (flag only)
<LanguageSwitcher compact />

// Show native language names
<LanguageSwitcher showNativeName />
```

### Custom Placement

The language switcher is included in the header by default. You can move it or add additional instances:

```jsx
// In your custom component
<LanguageSwitcher compact showNativeName />
```

## Adding New Languages

### 1. Update Configuration

Add the new language to `src/config/i18n.js`:

```javascript
export const i18nConfig = {
  availableLanguages: {
    // ... existing languages
    de: {
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
    },
  },
};
```

### 2. Create Translation File

Create `src/i18n/locales/de.json`:

```json
{
  "common": {
    "loading": "Laden...",
    "error": "Fehler"
  },
  "navigation": {
    "home": "Startseite",
    "demo": "Demo"
  }
  // ... translate all keys from en.json
}
```

### 3. Update i18n Index

Add the import to `src/i18n/index.js`:

```javascript
import de from './locales/de.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de }, // Add this line
};
```

## SEO Considerations

### Hreflang Tags

The system automatically generates hreflang tags for SEO. Enable/disable in config:

```javascript
export const i18nConfig = {
  seo: {
    generateHrefLang: true, // Enable/disable hreflang tags
  },
};
```

### Page-Specific SEO

Use the `useTranslation` hook with SEO keys:

```jsx
function AboutPage() {
  const { t } = useTranslation();

  return (
    <SEO
      title={t('seo.about.title')}
      description={t('seo.about.description')}
    />
  );
}
```

## Advanced Features

### Pluralization

```json
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{{count}} items"
  }
}
```

```jsx
t('items', { count: 0 }); // "No items"
t('items', { count: 1 }); // "One item"
t('items', { count: 5 }); // "5 items"
```

### Namespaces

Organize large translation sets with namespaces:

```javascript
// In component
const { t } = useTranslation('admin'); // Use admin namespace

// Translation key
t('users.title'); // Looks for admin:users.title
```

### Lazy Loading

For better performance, translations are lazy-loaded by default. The system only loads the current language's translations.

## Testing

### Mock i18n in Tests

```javascript
// __mocks__/react-i18next.js
export const useTranslation = () => ({
  t: (key) => key,
  i18n: {
    changeLanguage: () => Promise.resolve(),
    language: 'en',
  },
});
```

### Test Language Switching

```javascript
import { render, screen } from '@testing-library/react';
import LanguageSwitcher from 'components/LanguageSwitcher';

test('renders language switcher', () => {
  render(<LanguageSwitcher />);
  expect(screen.getByTitle(/switch language/i)).toBeInTheDocument();
});
```

## Performance Optimization

### Bundle Size

- Only the current language's translations are loaded
- Unused languages are not included in the bundle
- Compression reduces translation file sizes significantly

### Caching

- Translations are cached in localStorage
- Language preference persists across sessions
- Automatic cleanup of old translations

## Troubleshooting

### Common Issues

1. **Missing translations**: Check that all keys exist in all language files
2. **Language not switching**: Verify the language code exists in configuration
3. **SEO tags not updating**: Ensure `generateHrefLang` is enabled in config

### Debug Mode

Enable debug mode to see i18n logs:

```javascript
export const i18nConfig = {
  debug: true, // Shows console logs in development
};
```

## Migration Guide

### From Plain Text

1. Wrap all text strings in `t()` function calls
2. Create translation files with the extracted text
3. Test each language thoroughly

### From Other i18n Libraries

The migration process depends on your current library. The main differences are:

- Function names: `t()` instead of `translate()` or `__()`
- File format: JSON instead of YAML or other formats
- Configuration: Use `src/config/i18n.js` instead of separate config files

## Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Core Documentation](https://www.i18next.com/)
- [Unicode CLDR for Language Data](https://cldr.unicode.org/)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/ISO_639-1)

## Support

For issues specific to this template's i18n implementation:

1. Check this guide first
2. Review the configuration in `src/config/i18n.js`
3. Test with different languages
4. Check browser console for error messages
