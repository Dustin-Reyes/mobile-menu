import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';
import ElementBuilder from 'components/ElementBuilder';
import CodeBlock from 'components/CodeBlock';
import Separator from 'components/Separator';

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

const VariantsRow = styled.div`
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  align-items: stretch;
  margin-bottom: 1.5rem;
`;

const VariantCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  flex: 1;
  min-width: 200px;
`;

const VariantLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
`;

const VerticalContainer = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  width: 100%;
  justify-content: center;
`;

// ─── SeparatorPreview ──────────────────────────────────────────────────────────

function SeparatorPreview({ orientation, decorative }) {
  return (
    <div
      style={{
        padding: '1rem',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Separator orientation={orientation} decorative={decorative} />
    </div>
  );
}

// ─── ElementBuilder config ─────────────────────────────────────────────────────

const BUILDER_CONFIG = {
  component: SeparatorPreview,
  componentName: 'Separator',
  defaultChildren: '',
  attributes: [
    {
      id: 'orientation-vertical',
      label: 'vertical',
      prop: 'orientation',
      value: 'vertical',
      group: 'orientation',
      pillVariant: 'primary',
    },
    {
      id: 'decorative',
      label: 'decorative',
      prop: 'decorative',
      value: true,
      group: null,
      pillVariant: 'secondary',
    },
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Direction of the separator line',
  },
  {
    prop: 'decorative',
    type: 'boolean',
    default: 'false',
    description:
      'When true, renders as aria-hidden (purely visual, not semantic)',
  },
];

const IMPORT_SNIPPET = `import Separator from 'components/Separator';`;

// ─── SeparatorSection ──────────────────────────────────────────────────────────

function SeparatorSection() {
  return (
    <ComponentSection
      id="separator"
      title="Separator"
      description="Visual divider between content sections, built on Radix UI Separator."
    >
      <ElementBuilder config={BUILDER_CONFIG} />

      <SubLabel>All Variants</SubLabel>
      <VariantsRow>
        <VariantCard>
          <VariantLabel>horizontal</VariantLabel>
          <Separator orientation="horizontal" />
        </VariantCard>
        <VariantCard>
          <VariantLabel>vertical</VariantLabel>
          <VerticalContainer>
            <Separator orientation="vertical" />
          </VerticalContainer>
        </VariantCard>
      </VariantsRow>

      <SubLabel>Import</SubLabel>
      <CodeBlock language="js" description="Import statement">
        {IMPORT_SNIPPET}
      </CodeBlock>

      <PropsTable rows={PROPS_ROWS} label="Separator Props" />
    </ComponentSection>
  );
}

export default SeparatorSection;
