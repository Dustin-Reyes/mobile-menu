import { useState } from 'react';
import styled from '@emotion/styled';
import { CardRoot, CardHeader, CardBody, CardFooter } from 'components/Card';
import Button from 'components/Button';
import Pill from 'components/Pill';
import CodeBlock from 'components/CodeBlock';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';

// ─── Props table rows ──────────────────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'children',
    type: 'ReactNode',
    default: null,
    description: 'Card content (CardHeader, CardBody, CardFooter)',
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

const ToggleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const PreviewBox = styled.div`
  padding: 2rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  max-width: 480px;
`;

const Note = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 0.75rem;
  font-style: italic;
`;

const VariantsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const VariantItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 220px;
  max-width: 320px;
`;

const VariantLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
`;

// ─── CardSection ──────────────────────────────────────────────────────────────

function CardSection() {
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  return (
    <ComponentSection
      id="card"
      title="Card"
      description="Structured content container with optional header and footer."
    >
      <SubLabel>Interactive Demo</SubLabel>
      <ToggleRow>
        <Pill
          as="button"
          type="button"
          onClick={() => setShowHeader((v) => !v)}
          aria-pressed={showHeader}
          variant={showHeader ? 'primary' : 'default'}
          styleVariant={showHeader ? 'solid' : 'outline'}
          style={{ cursor: 'pointer' }}
        >
          header
        </Pill>
        <Pill
          as="button"
          type="button"
          onClick={() => setShowFooter((v) => !v)}
          aria-pressed={showFooter}
          variant={showFooter ? 'primary' : 'default'}
          styleVariant={showFooter ? 'solid' : 'outline'}
          style={{ cursor: 'pointer' }}
        >
          footer
        </Pill>
      </ToggleRow>
      <PreviewBox>
        <CardRoot>
          {showHeader && <CardHeader>Card Title</CardHeader>}
          <CardBody>
            This is the card body. It holds the main content of the card and
            supports any child elements you need.
          </CardBody>
          {showFooter && (
            <CardFooter>
              <Button variant="primary">Action</Button>
              <Button variant="ghost">Cancel</Button>
            </CardFooter>
          )}
        </CardRoot>
      </PreviewBox>

      <SubLabel>All Variants</SubLabel>
      <VariantsGrid>
        <VariantItem>
          <VariantLabel>header + body + footer</VariantLabel>
          <CardRoot>
            <CardHeader>Full Card</CardHeader>
            <CardBody>Body content goes here.</CardBody>
            <CardFooter>
              <Button variant="primary">OK</Button>
            </CardFooter>
          </CardRoot>
        </VariantItem>

        <VariantItem>
          <VariantLabel>body only</VariantLabel>
          <CardRoot>
            <CardBody>Body content only — no header or footer.</CardBody>
          </CardRoot>
        </VariantItem>

        <VariantItem>
          <VariantLabel>header + body</VariantLabel>
          <CardRoot>
            <CardHeader>With Header</CardHeader>
            <CardBody>Body content with a header but no footer.</CardBody>
          </CardRoot>
        </VariantItem>
      </VariantsGrid>

      <PropsTable rows={PROPS_ROWS} />
      <Note>
        CardHeader, CardBody, and CardFooter accept children and standard HTML
        div props.
      </Note>

      <SubLabel>Import</SubLabel>
      <CodeBlock language="jsx" description="Import">
        {`import { CardRoot, CardHeader, CardBody, CardFooter } from 'components/Card';`}
      </CodeBlock>
    </ComponentSection>
  );
}

export default CardSection;
