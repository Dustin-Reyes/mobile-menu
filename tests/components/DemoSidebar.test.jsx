import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../jest.setup';
import DemoSidebar from '../../src/dev/demo/DemoSidebar';

// Mock useDemoScrollspy — returns null (no active section) by default
jest.mock('../../src/dev/demo/useDemoScrollspy', () => () => null);

const SECTIONS = [
  { id: 'colors', label: 'Colors', group: 'tokens' },
  { id: 'typography', label: 'Typography', group: 'tokens' },
  { id: 'button', label: 'Button', group: 'components' },
  { id: 'input', label: 'Input', group: 'components' },
  { id: 'dev-utilities', label: 'Developer Utilities', group: 'dev' },
];

describe('DemoSidebar (desktop mode)', () => {
  it('renders group headings', () => {
    render(<DemoSidebar sections={SECTIONS} />);
    expect(screen.getByText('Design Tokens')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
  });

  it('renders all non-collapsible nav items', () => {
    render(<DemoSidebar sections={SECTIONS} />);
    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Typography')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(screen.getByText('Input')).toBeInTheDocument();
  });

  it('hides dev items behind the collapsible group by default', () => {
    render(<DemoSidebar sections={SECTIONS} />);
    // "Developer Utilities" is the toggle button label, not a nav item
    expect(
      screen.queryByRole('link', { name: 'Developer Utilities' }),
    ).not.toBeInTheDocument();
  });

  it('expands the Developer Utilities group on click', () => {
    render(<DemoSidebar sections={SECTIONS} />);
    const toggle = screen.getByRole('button', { name: /developer utilities/i });
    fireEvent.click(toggle);
    expect(
      screen.getByRole('link', { name: 'Developer Utilities' }),
    ).toBeInTheDocument();
  });

  it('collapses the Developer Utilities group on second click', () => {
    render(<DemoSidebar sections={SECTIONS} />);
    const toggle = screen.getByRole('button', { name: /developer utilities/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(
      screen.queryByRole('link', { name: 'Developer Utilities' }),
    ).not.toBeInTheDocument();
  });
});

describe('DemoSidebar (mobile drawer)', () => {
  it('does not render the drawer when drawerOpen is false', () => {
    render(
      <DemoSidebar
        sections={SECTIONS}
        mobileDrawer
        drawerOpen={false}
        onClose={jest.fn()}
      />,
    );
    expect(screen.queryByText('Design Tokens')).not.toBeInTheDocument();
  });

  it('renders the drawer with nav groups when drawerOpen is true', () => {
    render(
      <DemoSidebar
        sections={SECTIONS}
        mobileDrawer
        drawerOpen={true}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('Design Tokens')).toBeInTheDocument();
    expect(screen.getByText('Colors')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <DemoSidebar
        sections={SECTIONS}
        mobileDrawer
        drawerOpen={true}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /close navigation/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
