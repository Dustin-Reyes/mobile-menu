import styled from '@emotion/styled';
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionChevron,
} from 'components/Accordion';
import CodeBlock from 'components/CodeBlock';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';

// ─── Accordion items data ──────────────────────────────────────────────────────

const ACCORDION_ITEMS = [
  {
    value: 'item-1',
    trigger: 'What is this template?',
    content: 'A production-ready SPA starter with Vite + React.',
  },
  {
    value: 'item-2',
    trigger: "What's included?",
    content: 'ESLint, Prettier, Jest, Playwright, Sentry, Emotion, Netlify.',
  },
  {
    value: 'item-3',
    trigger: 'How do I get started?',
    content: 'Clone the repo, run yarn install, then ./dev.sh.',
  },
];

// ─── Props table rows (AccordionRoot) ─────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'type',
    type: "'single' | 'multiple'",
    default: "'single'",
    description: 'Whether one or multiple items can be open simultaneously',
  },
  {
    prop: 'defaultValue',
    type: 'string | string[]',
    default: null,
    description: 'Default open item(s) (uncontrolled)',
  },
  {
    prop: 'value',
    type: 'string | string[]',
    default: null,
    description: 'Controlled open item(s)',
  },
  {
    prop: 'onValueChange',
    type: 'function',
    default: null,
    description: 'Called when open item(s) change',
  },
  {
    prop: 'collapsible',
    type: 'boolean',
    default: 'false',
    description: 'Allows closing all items when type="single"',
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

const DemoGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const DemoItem = styled.div`
  flex: 1;
  min-width: 260px;
`;

const DemoTypeLabel = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 0.5rem;
`;

// ─── AccordionSection ─────────────────────────────────────────────────────────

function AccordionSection() {
  return (
    <ComponentSection
      id="accordion"
      title="Accordion"
      description="Vertically collapsible content sections built on Radix UI Accordion."
    >
      <SubLabel>Demo</SubLabel>
      <DemoGroup>
        <DemoItem>
          <DemoTypeLabel>type=&quot;single&quot; collapsible</DemoTypeLabel>
          <AccordionRoot type="single" collapsible>
            {ACCORDION_ITEMS.map(({ value, trigger, content }) => (
              <AccordionItem key={value} value={value}>
                <AccordionTrigger>
                  {trigger}
                  <AccordionChevron />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="accordion-content-inner">{content}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </DemoItem>

        <DemoItem>
          <DemoTypeLabel>type=&quot;multiple&quot;</DemoTypeLabel>
          <AccordionRoot type="multiple">
            {ACCORDION_ITEMS.map(({ value, trigger, content }) => (
              <AccordionItem key={value} value={value}>
                <AccordionTrigger>
                  {trigger}
                  <AccordionChevron />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="accordion-content-inner">{content}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </DemoItem>
      </DemoGroup>

      <PropsTable rows={PROPS_ROWS} label="AccordionRoot Props" />

      <SubLabel>Import</SubLabel>
      <CodeBlock language="jsx" description="Import">
        {`import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from 'components/Accordion';`}
      </CodeBlock>
    </ComponentSection>
  );
}

export default AccordionSection;
