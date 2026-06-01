import { screen } from '@testing-library/react';
import { render } from '../../jest.setup';
import PageTransition from '../../src/components/PageTransition';

describe('PageTransition', () => {
  it('renders its children', () => {
    render(
      <PageTransition>
        <div>Page content</div>
      </PageTransition>,
    );
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders multiple children without throwing', () => {
    render(
      <PageTransition>
        <h1>Title</h1>
        <p>Body text</p>
      </PageTransition>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });
});
