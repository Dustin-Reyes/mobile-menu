import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'components/ThemeProvider';

function AllProviders({ children, initialEntries = ['/'] }) {
  return (
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider>{children}</ThemeProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

function customRender(ui, { initialEntries, ...options } = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };
