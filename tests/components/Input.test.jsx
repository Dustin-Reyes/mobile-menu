import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import Input from 'components/ui/Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('calls onChange when the user types', () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} defaultValue="" />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' },
    });
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Input disabled placeholder="test" />);
    expect(screen.getByPlaceholderText('test')).toBeDisabled();
  });

  it('accepts a value as controlled input', () => {
    render(<Input value="controlled" onChange={jest.fn()} />);
    expect(screen.getByDisplayValue('controlled')).toBeInTheDocument();
  });

  it('accepts type prop', () => {
    render(<Input type="email" placeholder="email" />);
    expect(screen.getByPlaceholderText('email')).toHaveAttribute(
      'type',
      'email',
    );
  });
});
