import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../utils/test-utils';
import { SwitchRoot } from 'components/Switch';

describe('Switch', () => {
  it('renders a switch element', () => {
    render(<SwitchRoot aria-label="toggle" />);
    expect(screen.getByRole('switch', { name: 'toggle' })).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<SwitchRoot aria-label="toggle" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles to checked when clicked', async () => {
    const user = userEvent.setup();
    render(<SwitchRoot aria-label="toggle" />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onCheckedChange when toggled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = jest.fn();
    render(<SwitchRoot aria-label="toggle" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
