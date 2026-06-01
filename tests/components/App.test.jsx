import { screen, waitFor } from '@testing-library/react';
import { render } from '../../jest.setup';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../../src/components/ThemeProvider';
import App from '../../src/App';

describe('App', () => {
  it('renders the home page at /', async () => {
    render(<App />, {
      wrapper: ({ children }) => (
        <HelmetProvider>
          <ThemeProvider>
            <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
          </ThemeProvider>
        </HelmetProvider>
      ),
    });

    // Wait for content to load
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /transpiled-web-template/i,
          level: 1,
        }),
      ).toBeInTheDocument();
    });
  });

  it('renders the demo page at /demo', async () => {
    render(<App />, {
      wrapper: ({ children }) => (
        <HelmetProvider>
          <ThemeProvider>
            <MemoryRouter initialEntries={['/demo']}>{children}</MemoryRouter>
          </ThemeProvider>
        </HelmetProvider>
      ),
    });
    expect(
      await screen.findByRole('heading', { name: /Colors/i }),
    ).toBeInTheDocument();
  });
});
