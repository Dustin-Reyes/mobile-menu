import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, useTheme } from 'components/ThemeProvider';

function ThemeConsumer() {
  const { mode, toggleMode, isDark, isLight } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="isDark">{String(isDark)}</span>
      <span data-testid="isLight">{String(isLight)}</span>
      <button onClick={toggleMode}>Toggle</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <HelmetProvider>
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    </HelmetProvider>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('provides a mode value of light or dark', () => {
    renderWithProvider();
    expect(['light', 'dark']).toContain(screen.getByTestId('mode').textContent);
  });

  it('isDark is true when localStorage has dark', () => {
    window.localStorage.setItem('theme-mode', 'dark');
    renderWithProvider();
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(screen.getByTestId('isDark').textContent).toBe('true');
    expect(screen.getByTestId('isLight').textContent).toBe('false');
  });

  it('isLight is true when localStorage has light', () => {
    window.localStorage.setItem('theme-mode', 'light');
    renderWithProvider();
    expect(screen.getByTestId('isLight').textContent).toBe('true');
    expect(screen.getByTestId('isDark').textContent).toBe('false');
  });

  it('toggleMode switches from light to dark', () => {
    window.localStorage.setItem('theme-mode', 'light');
    renderWithProvider();
    expect(screen.getByTestId('mode').textContent).toBe('light');
    act(() => {
      fireEvent.click(screen.getByText('Toggle'));
    });
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('toggleMode switches from dark to light', () => {
    window.localStorage.setItem('theme-mode', 'dark');
    renderWithProvider();
    act(() => {
      fireEvent.click(screen.getByText('Toggle'));
    });
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('persists mode to localStorage after toggle', () => {
    window.localStorage.setItem('theme-mode', 'light');
    renderWithProvider();
    act(() => {
      fireEvent.click(screen.getByText('Toggle'));
    });
    expect(window.localStorage.getItem('theme-mode')).toBe('dark');
  });
});
