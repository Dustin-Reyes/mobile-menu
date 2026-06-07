import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';
import ElementBuilder from 'components/ElementBuilder';
import CodeBlock from 'components/CodeBlock';
import { SwitchRoot, SwitchThumb } from 'components/ui/Switch';

// ─── Styled components ─────────────────────────────────────────────────────────

const SubLabel = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
`;

const NoteBox = styled.div`
  padding: 0.875rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-left: 3px solid ${(p) => p.theme.colors.secondary};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
  margin-bottom: 1.5rem;
`;

const NoteLabel = styled.strong`
  color: ${(p) => p.theme.colors.text};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
`;

// ─── SwitchPreview ─────────────────────────────────────────────────────────────

function SwitchPreview({ disabled, defaultChecked }) {
  return (
    <SwitchRoot disabled={disabled} defaultChecked={defaultChecked}>
      <SwitchThumb />
    </SwitchRoot>
  );
}

// ─── ElementBuilder config ─────────────────────────────────────────────────────

const BUILDER_CONFIG = {
  component: SwitchPreview,
  componentName: 'Switch',
  defaultChildren: '',
  attributes: [
    {
      id: 'disabled',
      label: 'disabled',
      prop: 'disabled',
      value: true,
      group: null,
      pillVariant: 'error',
    },
    {
      id: 'defaultChecked',
      label: 'defaultChecked',
      prop: 'defaultChecked',
      value: true,
      group: null,
      pillVariant: 'success',
    },
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'checked',
    type: 'boolean',
    default: null,
    description: 'Controlled checked state',
  },
  {
    prop: 'defaultChecked',
    type: 'boolean',
    default: 'false',
    description: 'Default checked state (uncontrolled)',
  },
  {
    prop: 'onCheckedChange',
    type: 'function',
    default: null,
    description: 'Called when the switch is toggled',
  },
  {
    prop: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the switch',
  },
  {
    prop: 'name',
    type: 'string',
    default: null,
    description: 'Name for form submission',
  },
];

const IMPORT_SNIPPET = `import { SwitchRoot, SwitchThumb } from 'components/ui/Switch';`;

// ─── SwitchSection ─────────────────────────────────────────────────────────────

function SwitchSection() {
  return (
    <ComponentSection
      id="switch"
      title="Switch"
      description="Toggle switch for boolean on/off states built on Radix UI Switch."
    >
      <NoteBox>
        <NoteLabel>Accessibility note:</NoteLabel> Radix Switch renders with{' '}
        <code>role=&quot;switch&quot;</code>, not{' '}
        <code>role=&quot;button&quot;</code>. When querying in tests, use{' '}
        <code>getByRole(&apos;switch&apos;)</code>.
      </NoteBox>

      <ElementBuilder config={BUILDER_CONFIG} />

      <SubLabel>Import</SubLabel>
      <CodeBlock language="js" description="Import statement">
        {IMPORT_SNIPPET}
      </CodeBlock>

      <PropsTable rows={PROPS_ROWS} label="SwitchRoot Props" />
    </ComponentSection>
  );
}

export default SwitchSection;
