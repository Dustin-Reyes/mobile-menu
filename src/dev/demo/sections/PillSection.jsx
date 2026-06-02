import styled from '@emotion/styled';
import Pill from 'components/ui/Pill';
import CodeBlock from 'components/CodeBlock';
import ElementBuilder from 'components/ElementBuilder';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';

// ─── ElementBuilder config ─────────────────────────────────────────────────────

const BUILDER_CONFIG = {
  component: Pill,
  componentName: 'Pill',
  defaultChildren: 'Label',
  attributes: [
    {
      id: 'variant-primary',
      label: 'primary',
      prop: 'variant',
      value: 'primary',
      group: 'variant',
      pillVariant: 'primary',
    },
    {
      id: 'variant-success',
      label: 'success',
      prop: 'variant',
      value: 'success',
      group: 'variant',
      pillVariant: 'success',
    },
    {
      id: 'variant-warning',
      label: 'warning',
      prop: 'variant',
      value: 'warning',
      group: 'variant',
      pillVariant: 'warning',
    },
    {
      id: 'variant-error',
      label: 'error',
      prop: 'variant',
      value: 'error',
      group: 'variant',
      pillVariant: 'error',
    },
    {
      id: 'style-solid',
      label: 'solid',
      prop: 'styleVariant',
      value: 'solid',
      group: 'styleVariant',
      pillVariant: 'primary',
    },
    {
      id: 'style-outline',
      label: 'outline',
      prop: 'styleVariant',
      value: 'outline',
      group: 'styleVariant',
      pillVariant: 'secondary',
    },
    {
      id: 'size-sm',
      label: 'sm',
      prop: 'size',
      value: 'sm',
      group: 'size',
      pillVariant: 'primary',
    },
    {
      id: 'size-lg',
      label: 'lg',
      prop: 'size',
      value: 'lg',
      group: 'size',
      pillVariant: 'primary',
    },
    {
      id: 'dismissible',
      label: 'dismissible',
      prop: 'dismissible',
      value: true,
      group: null,
      pillVariant: 'warning',
    },
  ],
};

// ─── Variants data ─────────────────────────────────────────────────────────────

const COLOR_VARIANTS = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'error',
];

const STYLE_VARIANTS = ['solid', 'outline'];

// ─── Props table rows ──────────────────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'variant',
    type: "'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'",
    default: "'default'",
    description: 'Color variant',
  },
  {
    prop: 'styleVariant',
    type: "'solid' | 'outline'",
    default: "'solid'",
    description: 'Fill style',
  },
  {
    prop: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Size of the pill',
  },
  {
    prop: 'dismissible',
    type: 'boolean',
    default: 'false',
    description: 'Shows an \u00d7 button that calls onDismiss when clicked',
  },
  {
    prop: 'onDismiss',
    type: 'function',
    default: null,
    description: 'Called when the dismiss button is clicked',
  },
  {
    prop: 'as',
    type: 'ElementType',
    default: "'span'",
    description: 'Polymorphic: render as any element',
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

const StyleGroupLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
  min-width: 3.5rem;
  flex-shrink: 0;
`;

const VariantGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const VariantRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

// ─── PillSection ───────────────────────────────────────────────────────────────

function PillSection() {
  return (
    <ComponentSection
      id="pill"
      title="Pill"
      description="Compact label/badge component with color and style variants."
    >
      <ElementBuilder config={BUILDER_CONFIG} />

      <SubLabel>All Variants</SubLabel>
      <VariantGroup>
        {STYLE_VARIANTS.map((sv) => (
          <VariantRow key={sv}>
            <StyleGroupLabel>{sv}</StyleGroupLabel>
            {COLOR_VARIANTS.map((v) => (
              <Pill key={v} variant={v} styleVariant={sv}>
                {v}
              </Pill>
            ))}
          </VariantRow>
        ))}
      </VariantGroup>

      <PropsTable rows={PROPS_ROWS} />

      <SubLabel>Import</SubLabel>
      <CodeBlock language="jsx" description="Import">
        {`import Pill from 'components/ui/Pill';`}
      </CodeBlock>
    </ComponentSection>
  );
}

export default PillSection;
