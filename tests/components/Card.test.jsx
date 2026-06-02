import React from 'react';
import { render, screen } from '../utils/test-utils';
import { CardRoot, CardHeader, CardBody, CardFooter } from 'components/Card';

describe('Card', () => {
  it('CardRoot renders children', () => {
    render(<CardRoot>card content</CardRoot>);
    expect(screen.getByText('card content')).toBeInTheDocument();
  });

  it('CardHeader renders children', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('CardBody renders children', () => {
    render(<CardBody>Body text</CardBody>);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('CardFooter renders children', () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders a complete card with all four parts', () => {
    render(
      <CardRoot>
        <CardHeader>H</CardHeader>
        <CardBody>B</CardBody>
        <CardFooter>F</CardFooter>
      </CardRoot>
    );
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
  });
});
