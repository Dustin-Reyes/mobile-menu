import styled from '@emotion/styled';
import Button from 'components/Button';
import CodeBlock from 'components/CodeBlock';
import ElementBuilder from 'components/ElementBuilder';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';

// ─── ElementBuilder config ─────────────────────────────────────────────────────

const BUILDER_CONFIG = {
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
      pillVariant: 'warning',
    },
    {
      id: 'disabled',
      label: 'disabled',
      prop: 'disabled',
      value: true,
      group: null,
      pillVariant: 'error',
    },
    {
      id: 'motion',
      label: 'motion',
      prop: 'motion',
      value: true,
      group: null,
      pillVariant: 'warning',
    },
  ],
};

// ─── Props table rows ──────────────────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'variant',
    type: "'primary' | 'secondary' | 'outline' | 'ghost'",
    default: "'primary'",
    description: 'Visual style variant',
  },
  {
    prop: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the button and applies reduced opacity',
  },
  {
    prop: 'motion',
    type: 'boolean',
    default: 'false',
    description: 'Enables Framer Motion hover/tap scale micro-interactions',
  },
  {
    prop: 'as',
    type: 'ElementType',
    default: "'button'",
    description: 'Polymorphic: render as any HTML element or React component',
  },
  {
    prop: 'children',
    type: 'ReactNode',
    default: null,
    description: 'Button label content',
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

const VariantRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`;

const VariantItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const VariantLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
`;

// ─── ButtonSection ─────────────────────────────────────────────────────────────

function ButtonSection() {
  return (
    <ComponentSection
      id="button"
      title="Button"
      description="Primary interactive element with multiple variants and sizes."
    >
      <ElementBuilder config={BUILDER_CONFIG} />

      <SubLabel>All Variants</SubLabel>
      <VariantRow>
        <VariantItem>
          <Button variant="primary">Primary</Button>
          <VariantLabel>primary</VariantLabel>
        </VariantItem>
        <VariantItem>
          <Button variant="secondary">Secondary</Button>
          <VariantLabel>secondary</VariantLabel>
        </VariantItem>
        <VariantItem>
          <Button variant="outline">Outline</Button>
          <VariantLabel>outline</VariantLabel>
        </VariantItem>
        <VariantItem>
          <Button variant="ghost">Ghost</Button>
          <VariantLabel>ghost</VariantLabel>
        </VariantItem>
        <VariantItem>
          <Button disabled>Disabled</Button>
          <VariantLabel>disabled</VariantLabel>
        </VariantItem>
      </VariantRow>

      <PropsTable rows={PROPS_ROWS} />

      <SubLabel>Import</SubLabel>
      <CodeBlock language="jsx" description="Import">
        {`import Button from 'components/Button';`}
      </CodeBlock>
    </ComponentSection>
  );
}

export default ButtonSection;
