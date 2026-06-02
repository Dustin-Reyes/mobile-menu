import React from 'react';
import { render, screen } from '../utils/test-utils';
import PageTransition from 'components/PageTransition';

describe('PageTransition', () => {
  it('renders its children', () => {
    render(
      <PageTransition>
        <p>Page Content</p>
      </PageTransition>
    );
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <PageTransition>
        <h1>Title</h1>
        <p>Body</p>
      </PageTransition>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
