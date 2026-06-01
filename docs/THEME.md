# Theme System

A centralized emotion-based theme system supporting light/dark modes, design tokens, and a toggle UI.

---

## Features

- ✅ Centralized design tokens (colors, typography)
- ✅ Light and dark mode palettes
- ✅ Persistent theme preference (localStorage)
- ✅ System preference detection (prefers-color-scheme)
- ✅ `useTheme` hook for component access
- ✅ `ThemeToggle` UI component
- ✅ Smooth transitions between modes

---

## Getting Started

The theme provider is already set up in `src/main.jsx`. Use the `useTheme` hook to access tokens:

```jsx
import styled from '@emotion/styled';
import { useTheme } from './components/ThemeProvider';

const Card = styled.div`
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

function Example() {
  const { isDark, toggleMode } = useTheme();
  return (
    <Card>
      <p>Current mode: {isDark ? 'dark' : 'light'}</p>
      <button onClick={toggleMode}>Toggle theme</button>
    </Card>
  );
}
```

---

## Theme Structure

### Colors

```js
// src/styles/colors.js
export const lightColors = {
  primary: '#2563eb',
  secondary: '#6b7280',
  tertiary: '#16a34a',
  background: '#ffffff',
  // ...
};

export const darkColors = {
  primary: '#3b82f6',
  secondary: '#9ca3af',
  tertiary: '#22c55e',
  background: '#111827',
  // ...
};
```

### Typography

```js
// src/styles/typography.js
export const fontSizes = {
  s1: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)',
  s2: 'clamp(1.5rem, 1.4rem + 0.5vw, 2rem)',
  s3: 'clamp(2rem, 1.8rem + 1vw, 2.5rem)',
  // ...
};

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  // ...
};
```

### Breakpoints

```js
// src/styles/breakpoints.js
export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  ultrawide: '1536px',
};
```

---

## useTheme Hook

```js
const {
  mode, // 'light' | 'dark'
  theme, // Full theme object
  toggleMode, // Function to switch modes
  isDark, // Boolean
  isLight, // Boolean
} = useTheme();
```

---

## ThemeToggle Component

A ready-to-use toggle button with icons and accessibility support:

```jsx
import ThemeToggle from './components/ThemeToggle';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

Props:

- Accepts any standard button attributes (`className`, `style`, etc.)

---

## Adding New Tokens

1. Add the token to the appropriate file (`colors.js`, `typography.js`)
2. Export it from the theme object in `src/styles/theme.js`
3. Use it in components via `props.theme.tokens.yourToken`

Example:

```js
// src/styles/colors.js
export const lightColors = {
  // existing tokens...
  accent: '#8b5cf6',
};

// src/styles/theme.js
export const createTheme = (mode = 'light') => ({
  mode,
  colors: colors[mode],
  typography,
});

// Usage
const Button = styled.button`
  background: ${(props) => props.theme.colors.accent};
`;
```

---

## Custom Theme Instances

If you need a separate theme instance (e.g., for an embedded widget):

```jsx
import { ThemeProvider } from './components/ThemeProvider';
import { createTheme } from './styles/theme';

const customTheme = createTheme('dark');

function CustomWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```

---

## Testing

The theme system includes comprehensive tests. When testing components that use `useTheme`, wrap them in `ThemeProvider`:

```jsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '../components/ThemeProvider';

test('renders with theme', () => {
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>,
  );
});
```

---

## Migration Tips

When converting existing styled components:

1. Replace hardcoded colors with theme tokens
2. Use direct rem values for spacing
3. Leverage typography tokens for consistency
4. Test in both light and dark modes

Before:

```jsx
const Box = styled.div`
  background: #fff;
  color: #333;
  padding: 16px;
  font-size: 14px;
`;
```

After:

```jsx
const Box = styled.div`
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  padding: 1rem;
  font-size: ${(props) => props.theme.typography.fontSizes.s2};
`;
```
