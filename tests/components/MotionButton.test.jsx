import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../jest.setup';
import MotionButton from '../../src/components/MotionButton';

describe('MotionButton', () => {
  it('renders with a label', () => {
    render(<MotionButton>Click me</MotionButton>);
    expect(
      screen.getByRole('button', { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it('forwards variant prop to Button', () => {
    render(<MotionButton variant="outline">Outline</MotionButton>);
    expect(
      screen.getByRole('button', { name: /outline/i }),
    ).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<MotionButton onClick={handleClick}>Press</MotionButton>);
    fireEvent.click(screen.getByRole('button', { name: /press/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is passed', () => {
    render(<MotionButton disabled>Disabled</MotionButton>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });
});
