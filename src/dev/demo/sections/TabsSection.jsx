import styled from '@emotion/styled';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'components/ui/Tabs';
import CodeBlock from 'components/CodeBlock';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';

// ─── Props table rows (TabsRoot) ───────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'defaultValue',
    type: 'string',
    default: null,
    description: 'The default active tab value (uncontrolled)',
  },
  {
    prop: 'value',
    type: 'string',
    default: null,
    description: 'Controlled active tab value',
  },
  {
    prop: 'onValueChange',
    type: 'function',
    default: null,
    description: 'Called when active tab changes',
  },
  {
    prop: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Tab orientation',
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

const ContentText = styled.p`
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

// ─── TabsSection ──────────────────────────────────────────────────────────────

function TabsSection() {
  return (
    <ComponentSection
      id="tabs"
      title="Tabs"
      description="Accessible tab navigation built on Radix UI Tabs."
    >
      <SubLabel>Demo</SubLabel>
      <TabsRoot defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ContentText>
            The Tabs component provides accessible keyboard-navigable tab panels
            built on Radix UI. It supports both controlled and uncontrolled
            usage and follows the WAI-ARIA Tabs pattern.
          </ContentText>
        </TabsContent>
        <TabsContent value="usage">
          <ContentText>
            Wrap your tab structure in TabsRoot, define tab labels with
            TabsTrigger inside a TabsList, and pair each trigger with a
            TabsContent using matching value props. Set defaultValue to control
            which tab opens initially.
          </ContentText>
        </TabsContent>
        <TabsContent value="api">
          <ContentText>
            TabsRoot accepts defaultValue, value, onValueChange, and orientation
            props. TabsTrigger and TabsContent are linked by their value prop.
            See the props table below for full details.
          </ContentText>
        </TabsContent>
      </TabsRoot>

      <PropsTable rows={PROPS_ROWS} label="TabsRoot Props" />

      <SubLabel>Import</SubLabel>
      <CodeBlock language="jsx" description="Import">
        {`import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'components/ui/Tabs';`}
      </CodeBlock>
    </ComponentSection>
  );
}

export default TabsSection;
