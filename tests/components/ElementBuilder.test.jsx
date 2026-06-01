import { screen, within, fireEvent } from '@testing-library/react';
import { render } from '../../jest.setup';
import ElementBuilder from '../../src/components/ElementBuilder';
import Button from '../../src/components/Button';

// ─── Test config ───────────────────────────────────────────────────────────────

const BUTTON_BUILDER_CONFIG = {
  component: Button,
  componentName: 'Button',
  defaultChildren: 'Click me',
  attributes: [
    {
      id: 'variant-secondary',
      label: 'secondary',
      prop: 'variant',
      value: 'secondary',
      group: 'variant',
      pillVariant: 'secondary',
    },
    {
      id: 'variant-outline',
      label: 'outline',
      prop: 'variant',
      value: 'outline',
      group: 'variant',
      pillVariant: 'primary',
    },
    {
      id: 'variant-ghost',
      label: 'ghost',
      prop: 'variant',
      value: 'ghost',
      group: 'variant',
      pillVariant: 'default',
    },
    {
      id: 'disabled',
      label: 'disabled',
      prop: 'disabled',
      value: true,
      group: null,
      pillVariant: 'error',
    },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getPreviewButton() {
  const preview = screen.getByTestId('element-builder-preview');
  return within(preview).getByRole('button');
}

function getPillButton(label) {
  // There are multiple buttons: pill buttons and the live preview button.
  // Pill buttons have aria-pressed; getByRole with name is sufficient since
  // labels are unique among pill buttons.
  return screen.getByRole('button', { name: label });
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('ElementBuilder', () => {
  beforeEach(() => {
    render(<ElementBuilder config={BUTTON_BUILDER_CONFIG} />);
  });

  it('renders the live component (Button) in the preview', () => {
    expect(getPreviewButton()).toBeInTheDocument();
  });

  it('renders all attribute pills', () => {
    expect(
      screen.getByRole('button', { name: 'secondary' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'outline' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ghost' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'disabled' }),
    ).toBeInTheDocument();
  });

  it('inactive pills have aria-pressed="false"', () => {
    const outlinePill = getPillButton('outline');
    expect(outlinePill).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking a variant pill activates it and updates the code block', () => {
    fireEvent.click(getPillButton('outline'));

    expect(getPillButton('outline')).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByText(`<Button variant="outline">Click me</Button>`),
    ).toBeInTheDocument();
  });

  it('clicking an active variant pill deactivates it and reverts the code', () => {
    const outlinePill = getPillButton('outline');
    fireEvent.click(outlinePill);
    fireEvent.click(outlinePill);

    expect(outlinePill).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('<Button>Click me</Button>')).toBeInTheDocument();
  });

  it('clicking two variant pills leaves only the last one active (exclusive group)', () => {
    fireEvent.click(getPillButton('secondary'));
    fireEvent.click(getPillButton('outline'));

    expect(getPillButton('secondary')).toHaveAttribute('aria-pressed', 'false');
    expect(getPillButton('outline')).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByText(`<Button variant="outline">Click me</Button>`),
    ).toBeInTheDocument();
  });

  it('clicking the disabled pill disables the live button', () => {
    fireEvent.click(getPillButton('disabled'));

    expect(getPreviewButton()).toBeDisabled();
  });

  it('live component reflects active props from toggled pills', () => {
    fireEvent.click(getPillButton('outline'));

    // The preview should contain a button that has the outline variant applied.
    // We verify the code block reflects the active state as a proxy for props.
    const preview = screen.getByTestId('element-builder-preview');
    expect(within(preview).getByRole('button')).toBeInTheDocument();
    expect(
      screen.getByText(`<Button variant="outline">Click me</Button>`),
    ).toBeInTheDocument();
  });
});
