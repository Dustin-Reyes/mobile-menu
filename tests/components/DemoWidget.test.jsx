import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../jest.setup';
import DemoWidget from '../../src/components/DemoWidget';

// createPortal renders into document.body in jsdom — no extra setup needed

describe('DemoWidget', () => {
  // ─── Initial render ───────────────────────────────────────────────────────

  it('renders the input and submit button', () => {
    render(<DemoWidget />);
    expect(
      screen.getByRole('textbox', { name: /your name/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders the input with the correct placeholder', () => {
    render(<DemoWidget />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    render(<DemoWidget />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('modal is not visible on initial render', () => {
    render(<DemoWidget />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ─── Input interaction ────────────────────────────────────────────────────

  it('enables the submit button when the input has a value', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), 'Alice');

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  it('keeps submit button disabled when input is only whitespace', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), '   ');

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  // ─── Submit — button click ────────────────────────────────────────────────

  it('opens the modal with the submitted value when Submit is clicked', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), 'Alice');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
    expect(screen.getByText(/you submitted:/i)).toBeInTheDocument();
  });

  it('shows the trimmed value in the modal', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), '  Bob  ');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Hello, Bob!')).toBeInTheDocument();
  });

  // ─── Submit — Enter key ───────────────────────────────────────────────────

  it('opens the modal when Enter is pressed in the input', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), 'Carol{Enter}');

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hello, Carol!')).toBeInTheDocument();
  });

  it('does not open modal when Enter is pressed on empty input', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), '{Enter}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ─── Close modal ─────────────────────────────────────────────────────────

  it('closes the modal when the Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), 'Dave');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal when the overlay backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), 'Eve');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByTestId('modal-overlay'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ─── Post-close state ─────────────────────────────────────────────────────

  it('input retains its value after the modal is closed', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), 'Frank');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.getByRole('textbox')).toHaveValue('Frank');
  });

  it('can open the modal a second time after closing', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'Grace');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await user.click(screen.getByRole('button', { name: /close/i }));

    await user.clear(input);
    await user.type(input, 'Heidi');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Hello, Heidi!')).toBeInTheDocument();
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  it('modal has role="dialog" and aria-modal="true"', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), 'Ivan');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('modal title is labelled by aria-labelledby', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    await user.type(screen.getByRole('textbox'), 'Judy');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    const dialog = screen.getByRole('dialog');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(document.getElementById(labelId)).toHaveTextContent('Hello, Judy!');
  });
});
