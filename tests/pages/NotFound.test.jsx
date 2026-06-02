import React from 'react';
import { render, screen } from '../utils/test-utils';
import NotFound from 'pages/NotFound';

describe('NotFound page', () => {
  beforeEach(() => render(<NotFound />));

  it('renders the 404 error code', () => {
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the not-found title translation key', () => {
    expect(screen.getByText('error.notFound.title')).toBeInTheDocument();
  });

  it('renders the not-found message translation key', () => {
    expect(screen.getByText('error.notFound.message')).toBeInTheDocument();
  });

  it('renders a link back to home', () => {
    const homeLink = screen.getByRole('link', {
      name: 'error.notFound.goHome',
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute('href')).toBe('/');
  });
});
