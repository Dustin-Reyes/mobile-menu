import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../jest.setup';
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../src/components/Dialog';

function TestDialog({ defaultOpen = false }) {
  return (
    <DialogRoot defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <button>Open</button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay data-testid="dialog-overlay" />
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription>Test description text.</DialogDescription>
          <DialogClose asChild>
            <button>Close</button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}

describe('Dialog', () => {
  // ─── Closed state ─────────────────────────────────────────────────────────

  it('does not show dialog content when closed', () => {
    render(<TestDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ─── Open on trigger ──────────────────────────────────────────────────────

  it('opens when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: /open/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description text.')).toBeInTheDocument();
  });

  // ─── Close on overlay click ───────────────────────────────────────────────

  it('closes when the overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click the overlay (pointer down on overlay triggers close in Radix)
    await user.click(screen.getByTestId('dialog-overlay'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ─── Close on Escape key ──────────────────────────────────────────────────

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ─── Close button ─────────────────────────────────────────────────────────

  it('closes when the Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ─── ARIA attributes ──────────────────────────────────────────────────────

  it('dialog has aria-modal="true"', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: /open/i }));

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('dialog is labelled by its title via aria-labelledby', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: /open/i }));

    const dialog = screen.getByRole('dialog');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(document.getElementById(labelId)).toHaveTextContent('Test Title');
  });
});
