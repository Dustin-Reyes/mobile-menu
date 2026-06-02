import React from 'react';
import { render, screen } from '../utils/test-utils';
import Header from 'components/Header';

describe('Header', () => {
  it('renders the header landmark', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains a link to home', () => {
    render(<Header />);
    const homeLinks = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/');
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  it('contains a theme toggle button', () => {
    render(<Header />);
    // Header renders a plain button for theme toggle with aria-label about mode
    const btn = screen.getByRole('button', { name: /mode/i });
    expect(btn).toBeInTheDocument();
  });
});
