import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import Button from 'components/ui/Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('accepts variant prop without throwing', () => {
    for (const variant of ['primary', 'secondary', 'outline', 'ghost']) {
      expect(() => render(<Button variant={variant}>V</Button>)).not.toThrow();
    }
  });

  it('renders as motion component when motion=true', () => {
    render(<Button motion={true}>Animated</Button>);
    expect(
      screen.getByRole('button', { name: 'Animated' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the underlying button element', () => {
    const ref = React.createRef();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes additional props to the button element', () => {
    render(
      <Button aria-label="custom label" type="submit">
        S
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'custom label' });
    expect(btn).toHaveAttribute('type', 'submit');
  });
});
