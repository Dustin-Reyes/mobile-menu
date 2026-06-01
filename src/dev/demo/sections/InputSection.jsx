import styled from '@emotion/styled';
import Input from 'components/Input';
import CodeBlock from 'components/CodeBlock';
import ElementBuilder from 'components/ElementBuilder';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';

// ─── InputPreview wrapper ──────────────────────────────────────────────────────
// ElementBuilder renders <Component {...activeProps}>{defaultChildren}</Component>.
// Input ignores children, so we wrap it to inject a placeholder by default.

function InputPreview({ children: _children, ...props }) {
  return <Input placeholder="Enter text…" {...props} />;
}

// ─── ElementBuilder config ─────────────────────────────────────────────────────

const BUILDER_CONFIG = {
  component: InputPreview,
  componentName: 'Input',
  defaultChildren: '',
  attributes: [
    {
      id: 'type-email',
      label: 'email',
      prop: 'type',
      value: 'email',
      group: 'type',
      pillVariant: 'primary',
    },
    {
      id: 'type-password',
      label: 'password',
      prop: 'type',
      value: 'password',
      group: 'type',
      pillVariant: 'secondary',
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

// ─── Props table rows ──────────────────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'type',
    type: "'text' | 'email' | 'password' | 'number' | ...",
    default: "'text'",
    description: 'HTML input type',
  },
  {
    prop: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the input field',
  },
  {
    prop: 'placeholder',
    type: 'string',
    default: null,
    description: 'Placeholder text shown when empty',
  },
  {
    prop: 'value',
    type: 'string',
    default: null,
    description: 'Controlled value',
  },
  {
    prop: 'onChange',
    type: 'function',
    default: null,
    description: 'Change event handler',
  },
];

// ─── Styled components ─────────────────────────────────────────────────────────

const SubLabel = styled.h3`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
`;

const VariantGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const VariantItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 200px;
`;

const VariantLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
`;

// ─── InputSection ──────────────────────────────────────────────────────────────

function InputSection() {
  return (
    <ComponentSection
      id="input"
      title="Input"
      description="Text input field with focus, disabled, and error states."
    >
      <ElementBuilder config={BUILDER_CONFIG} />

      <SubLabel>All Variants</SubLabel>
      <VariantGrid>
        <VariantItem>
          <VariantLabel>default</VariantLabel>
          <Input placeholder="Default input" />
        </VariantItem>
        <VariantItem>
          <VariantLabel>disabled</VariantLabel>
          <Input placeholder="Disabled input" disabled />
        </VariantItem>
      </VariantGrid>

      <PropsTable rows={PROPS_ROWS} />

      <SubLabel>Import</SubLabel>
      <CodeBlock language="jsx" description="Import">
        {`import Input from 'components/Input';`}
      </CodeBlock>
    </ComponentSection>
  );
}

export default InputSection;
