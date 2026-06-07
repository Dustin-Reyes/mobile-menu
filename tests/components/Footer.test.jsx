import React from 'react';
import { render, screen } from '../utils/test-utils';
import Footer from 'components/Footer';

describe('Footer', () => {
  it('renders the footer landmark', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('footer is non-empty', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent.length).toBeGreaterThan(0);
  });
});
