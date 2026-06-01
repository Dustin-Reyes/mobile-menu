import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../src/components/ThemeProvider';
import ThemeToggle from '../../src/components/ThemeToggle';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, values) => {
      const translations = {
        'theme.toggle': 'Switch to {{mode}} mode',
      };
      let result = translations[key] || key;
      if (values && values.mode) {
        result = result.replace('{{mode}}', values.mode);
      }
      return result;
    },
  }),
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides theme context to children', () => {
    const TestComponent = () => {
      const { mode, theme } = useTheme();
      return (
        <div>
          <span data-testid="mode">{mode}</span>
          <span data-testid="primary">{theme.colors.primary}</span>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(screen.getByTestId('primary')).toHaveTextContent('#F5A623');
  });

  it('toggles theme mode', () => {
    const TestComponent = () => {
      const { mode, toggleMode } = useTheme();
      return (
        <button onClick={toggleMode} data-testid="toggle">
          {mode}
        </button>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveTextContent('light');

    act(() => {
      toggle.click();
    });

    expect(toggle).toHaveTextContent('dark');
  });

  it('persists theme mode to localStorage', () => {
    localStorage.setItem('theme-mode', 'dark');

    const TestComponent = () => {
      const { mode } = useTheme();
      return <span data-testid="mode">{mode}</span>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('uses system preference when no stored value', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const TestComponent = () => {
      const { mode } = useTheme();
      return <span data-testid="mode">{mode}</span>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');

    window.matchMedia = originalMatchMedia;
  });

  it('returns undefined when useTheme is used outside ThemeProvider', () => {
    const TestComponent = () => {
      const theme = useTheme();
      return <div>{theme ? 'has theme' : 'no theme'}</div>;
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText('no theme')).toBeInTheDocument();
  });
});

describe('ThemeToggle', () => {
  it('renders toggle switch with correct icon for light mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole('switch', { name: /switch to dark mode/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle.querySelector('svg')).toBeInTheDocument();
  });

  it('renders toggle switch with correct icon for dark mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole('switch', { name: /switch to dark mode/i });
    expect(toggle.querySelector('svg')).toBeInTheDocument();

    act(() => {
      toggle.click();
    });

    expect(
      screen
        .getByRole('switch', { name: /switch to light mode/i })
        .querySelector('svg'),
    ).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole('switch', {
      name: /switch to (dark|light) mode/i,
    });
    expect(toggle).toHaveAttribute('aria-label');
    expect(toggle).toHaveAttribute('title');
  });
});
