import { screen, within } from '@testing-library/react';
import { render } from '../../jest.setup';
import PropsTable from '../../src/dev/demo/PropsTable';

const SAMPLE_ROWS = [
  {
    prop: 'variant',
    type: "'primary' | 'secondary'",
    default: "'primary'",
    description: 'Visual style variant',
  },
  {
    prop: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the button',
  },
  {
    prop: 'onClick',
    type: 'function',
    default: null,
    description: 'Click handler',
  },
];

describe('PropsTable', () => {
  it('renders a row for each prop', () => {
    render(<PropsTable rows={SAMPLE_ROWS} />);
    expect(screen.getByText('variant')).toBeInTheDocument();
    expect(screen.getByText('disabled')).toBeInTheDocument();
    expect(screen.getByText('onClick')).toBeInTheDocument();
  });

  it('renders the type for each prop', () => {
    render(<PropsTable rows={SAMPLE_ROWS} />);
    expect(screen.getByText("'primary' | 'secondary'")).toBeInTheDocument();
    expect(screen.getByText('boolean')).toBeInTheDocument();
    expect(screen.getByText('function')).toBeInTheDocument();
  });

  it('renders the default values', () => {
    render(<PropsTable rows={SAMPLE_ROWS} />);
    expect(screen.getByText("'primary'")).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  it('renders a dash for null default values', () => {
    render(<PropsTable rows={SAMPLE_ROWS} />);
    // onClick has null default — should render a dash
    const table = screen.getByRole('table');
    expect(within(table).getByText('—')).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<PropsTable rows={SAMPLE_ROWS} />);
    expect(screen.getByText('Visual style variant')).toBeInTheDocument();
    expect(screen.getByText('Disables the button')).toBeInTheDocument();
  });

  it('renders the default label "Props" when no label prop is given', () => {
    render(<PropsTable rows={SAMPLE_ROWS} />);
    expect(screen.getByText('Props')).toBeInTheDocument();
  });

  it('renders a custom label when provided', () => {
    render(<PropsTable rows={SAMPLE_ROWS} label="DialogContent Props" />);
    expect(screen.getByText('DialogContent Props')).toBeInTheDocument();
  });

  it('renders column headers Prop, Type, Default, Description', () => {
    render(<PropsTable rows={SAMPLE_ROWS} />);
    expect(screen.getByText('Prop')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders nothing when rows is empty', () => {
    const { container } = render(<PropsTable rows={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
