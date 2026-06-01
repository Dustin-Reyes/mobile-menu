import { screen } from '@testing-library/react';
import { render } from '../../jest.setup';
import ComponentSection from '../../src/dev/demo/ComponentSection';

describe('ComponentSection', () => {
  it('renders the section title', () => {
    render(
      <ComponentSection
        id="test-section"
        title="Test Title"
        description="Test description."
      >
        <p>Content</p>
      </ComponentSection>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(
      <ComponentSection
        id="test-section"
        title="Test Title"
        description="A short description."
      >
        <p>Content</p>
      </ComponentSection>,
    );
    expect(screen.getByText('A short description.')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <ComponentSection id="test-section" title="Title" description="Desc">
        <p>Child content here</p>
      </ComponentSection>,
    );
    expect(screen.getByText('Child content here')).toBeInTheDocument();
  });

  it('renders the anchor element with the given id', () => {
    const { container } = render(
      <ComponentSection id="my-section" title="Title" description="Desc">
        <span>inner</span>
      </ComponentSection>,
    );
    const anchor = container.querySelector('#my-section');
    expect(anchor).toBeInTheDocument();
  });

  it('does not render a description element when description is omitted', () => {
    render(
      <ComponentSection id="no-desc" title="No Desc Title">
        <span>inner</span>
      </ComponentSection>,
    );
    // Title should exist, but the description paragraph should not
    expect(screen.getByText('No Desc Title')).toBeInTheDocument();
    // The section root should only have the heading + children, no extra <p>
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
