import { screen } from '@testing-library/react';
import { render } from '../../jest.setup';
import AnimatedSection from '../../src/components/AnimatedSection';

describe('AnimatedSection', () => {
  it('renders its children', () => {
    render(
      <AnimatedSection>
        <p>Section content</p>
      </AnimatedSection>,
    );
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('accepts a delay prop without throwing', () => {
    render(
      <AnimatedSection delay={0.2}>
        <span>Delayed section</span>
      </AnimatedSection>,
    );
    expect(screen.getByText('Delayed section')).toBeInTheDocument();
  });

  it('passes extra props to the wrapper element', () => {
    render(
      <AnimatedSection data-testid="animated-section">
        <span>Content</span>
      </AnimatedSection>,
    );
    expect(screen.getByTestId('animated-section')).toBeInTheDocument();
  });
});
