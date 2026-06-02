import React from 'react';
import { render, screen } from '../utils/test-utils';
import Pill from 'components/ui/Pill';

describe('Pill', () => {
  it('renders children text', () => {
    render(<Pill>React 18</Pill>);
    expect(screen.getByText('React 18')).toBeInTheDocument();
  });

  it('renders multiple pills independently', () => {
    render(
      <>
        <Pill>Alpha</Pill>
        <Pill>Beta</Pill>
      </>,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});
