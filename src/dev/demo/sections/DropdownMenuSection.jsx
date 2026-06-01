import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';
import Button from 'components/Button';
import CodeBlock from 'components/CodeBlock';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'components/DropdownMenu';

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

const DemoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  margin-bottom: 1.5rem;
`;

const DangerMenuItem = styled(DropdownMenuItem)`
  color: ${(p) => p.theme.colors.error};

  &[data-highlighted] {
    background: ${(p) => p.theme.colors.error}18;
    color: ${(p) => p.theme.colors.error};
  }
`;

// ─── Data ──────────────────────────────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'side',
    type: "'top' | 'right' | 'bottom' | 'left'",
    default: "'bottom'",
    description: 'Preferred side to render the menu',
  },
  {
    prop: 'align',
    type: "'start' | 'center' | 'end'",
    default: "'start'",
    description: 'Alignment against the trigger',
  },
  {
    prop: 'sideOffset',
    type: 'number',
    default: '4',
    description: 'Distance in px from the trigger',
  },
];

const CODE_EXAMPLE = `<DropdownMenuRoot>
  <DropdownMenuTrigger asChild>
    <Button>Menu \u25be</Button>
  </DropdownMenuTrigger>
  <DropdownMenuPortal>
    <DropdownMenuContent sideOffset={4}>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuPortal>
</DropdownMenuRoot>`;

const IMPORT_SNIPPET = `import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from 'components/DropdownMenu';`;

// ─── DropdownMenuSection ───────────────────────────────────────────────────────

function DropdownMenuSection() {
  return (
    <ComponentSection
      id="dropdown-menu"
      title="Dropdown Menu"
      description="Context menu with keyboard navigation built on Radix UI DropdownMenu."
    >
      <SubLabel>Live Demo</SubLabel>
      <DemoRow>
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button>Menu &#9662;</Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent sideOffset={4}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DangerMenuItem>Sign out</DangerMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </DemoRow>

      <SubLabel>Code Example</SubLabel>
      <CodeBlock language="jsx" description="Basic dropdown menu usage">
        {CODE_EXAMPLE}
      </CodeBlock>

      <SubLabel>Import</SubLabel>
      <CodeBlock language="js" description="Import statement">
        {IMPORT_SNIPPET}
      </CodeBlock>

      <PropsTable rows={PROPS_ROWS} label="DropdownMenuContent Props" />
    </ComponentSection>
  );
}

export default DropdownMenuSection;
