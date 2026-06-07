import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, useTheme } from 'components/ThemeProvider';
import ThemeToggle from 'components/ThemeToggle';

function Wrapper({ children }) {
  return (
    <HelmetProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </HelmetProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders a switch element', () => {
    // ThemeToggle uses Radix Switch which renders role="switch"
    render(<ThemeToggle />, { wrapper: Wrapper });
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('clicking the toggle changes the theme mode', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('theme-mode', 'light');

    function ModeDisplay() {
      const { mode } = useTheme();
      return <span data-testid="mode">{mode}</span>;
    }

    render(
      <Wrapper>
        <ThemeToggle />
        <ModeDisplay />
      </Wrapper>,
    );

    expect(screen.getByTestId('mode').textContent).toBe('light');
    await user.click(screen.getByRole('switch'));
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});
