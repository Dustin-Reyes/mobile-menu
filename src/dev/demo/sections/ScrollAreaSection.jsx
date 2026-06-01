import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';
import CodeBlock from 'components/CodeBlock';
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from 'components/ScrollArea';

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

const DemoWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const StyledScrollAreaRoot = styled(ScrollAreaRoot)`
  height: 200px;
  width: 100%;
  max-width: 400px;
`;

const ItemRow = styled.div`
  padding: 0.625rem 1rem;
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.text};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

// ─── Data ──────────────────────────────────────────────────────────────────────

const ITEMS = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

const PROPS_ROWS = [
  {
    prop: 'type',
    type: "'auto' | 'always' | 'scroll' | 'hover'",
    default: "'hover'",
    description: 'Scroll visibility strategy',
  },
  {
    prop: 'scrollHideDelay',
    type: 'number',
    default: '600',
    description: 'Delay in ms before scrollbar hides (type=scroll/auto)',
  },
];

const CODE_EXAMPLE = `<ScrollAreaRoot style={{ height: '200px' }}>
  <ScrollAreaViewport>
    {items.map((item) => (
      <div key={item}>{item}</div>
    ))}
  </ScrollAreaViewport>
  <ScrollAreaScrollbar orientation="vertical">
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
  <ScrollAreaCorner />
</ScrollAreaRoot>`;

const IMPORT_SNIPPET = `import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaCorner } from 'components/ScrollArea';`;

// ─── ScrollAreaSection ─────────────────────────────────────────────────────────

function ScrollAreaSection() {
  return (
    <ComponentSection
      id="scroll-area"
      title="Scroll Area"
      description="Custom scrollable container with styled scrollbars built on Radix UI ScrollArea."
    >
      <SubLabel>Live Demo</SubLabel>
      <DemoWrapper>
        <StyledScrollAreaRoot>
          <ScrollAreaViewport>
            {ITEMS.map((item) => (
              <ItemRow key={item}>{item}</ItemRow>
            ))}
          </ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="vertical">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
          <ScrollAreaCorner />
        </StyledScrollAreaRoot>
      </DemoWrapper>

      <SubLabel>Code Example</SubLabel>
      <CodeBlock language="jsx" description="Basic scroll area usage">
        {CODE_EXAMPLE}
      </CodeBlock>

      <SubLabel>Import</SubLabel>
      <CodeBlock language="js" description="Import statement">
        {IMPORT_SNIPPET}
      </CodeBlock>

      <PropsTable rows={PROPS_ROWS} label="ScrollAreaRoot Props" />
    </ComponentSection>
  );
}

export default ScrollAreaSection;
