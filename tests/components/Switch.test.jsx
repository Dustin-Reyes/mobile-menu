import { useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../jest.setup';
import { SwitchRoot, SwitchThumb } from '../../src/components/Switch';

function TestSwitch({ onCheckedChange }) {
  const [checked, setChecked] = useState(false);

  const handleChange = (value) => {
    setChecked(value);
    onCheckedChange?.(value);
  };

  return (
    <SwitchRoot
      checked={checked}
      onCheckedChange={handleChange}
      aria-label="Toggle feature"
    >
      <SwitchThumb />
    </SwitchRoot>
  );
}

describe('Switch', () => {
  // ─── Initial state ────────────────────────────────────────────────────────

  it('renders unchecked by default', () => {
    render(<TestSwitch />);
    const switchEl = screen.getByRole('switch', { name: /toggle feature/i });
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });

  // ─── Toggle on click ──────────────────────────────────────────────────────

  it('toggles to checked when clicked', async () => {
    const user = userEvent.setup();
    render(<TestSwitch />);

    const switchEl = screen.getByRole('switch');
    await user.click(switchEl);

    expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles back to unchecked on second click', async () => {
    const user = userEvent.setup();
    render(<TestSwitch />);

    const switchEl = screen.getByRole('switch');
    await user.click(switchEl);
    await user.click(switchEl);

    expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });

  // ─── Callback ─────────────────────────────────────────────────────────────

  it('calls onCheckedChange with the new value', async () => {
    const user = userEvent.setup();
    const handler = jest.fn();
    render(<TestSwitch onCheckedChange={handler} />);

    await user.click(screen.getByRole('switch'));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(true);
  });
});
