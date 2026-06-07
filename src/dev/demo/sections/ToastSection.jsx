import { useState } from 'react';
import styled from '@emotion/styled';
import Button from 'components/ui/Button';
import CodeBlock from 'components/CodeBlock';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';
import { toast } from '@/utils/toast';

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

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const PositionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.5rem;
  width: fit-content;
`;

const PositionButton = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  border: 1px solid
    ${(p) => (p.active ? p.theme.colors.primary : p.theme.colors.border)};
  background: ${(p) =>
    p.active ? p.theme.colors.primary : p.theme.colors.surface};
  color: ${(p) => (p.active ? p.theme.colors.onPrimary : p.theme.colors.text)};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: ${(p) => p.theme.typography.fontFamilies.mono};
  cursor: pointer;
  transition: ${(p) => p.theme.transitions.fast};

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

// ─── Data ──────────────────────────────────────────────────────────────────────

const POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

const PROPS_ROWS = [
  {
    prop: 'position',
    type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
    default: "'top-right'",
    description: 'Screen corner where toasts appear',
  },
];

// ─── Code snippets ─────────────────────────────────────────────────────────────

const PROVIDER_SNIPPET = `// In App.jsx — mount once, inside ThemeProvider:
import { ToastProvider } from 'components/ToastProvider';

<ToastProvider />                          // default: top-right
<ToastProvider position="bottom-center" /> // custom position`;

const TOAST_SNIPPET = `import { toast } from '@/utils/toast';

toast.success('Changes saved');
toast.error('Failed to save');
toast.warning('Unsaved changes');
toast.info('New version available');
toast.loading('Saving...');
toast.dismiss();      // dismiss all
toast.dismiss(id);    // dismiss specific toast`;

// ─── ToastSection ───────────────────────────────────────────────────────────────

function ToastSection() {
  const [position, setPosition] = useState('top-right');

  return (
    <ComponentSection
      id="toast"
      title="Toast"
      description="Lightweight notification system powered by react-hot-toast, styled to match the active theme."
    >
      <SubLabel>Variants</SubLabel>
      <ButtonRow>
        <Button
          variant="primary"
          onClick={() =>
            toast.success('Changes saved successfully', { position })
          }
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.error('Something went wrong', { position })}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning('You have unsaved changes', { position })
          }
        >
          Warning
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.info('New version available', { position })}
        >
          Info
        </Button>
      </ButtonRow>

      <SubLabel>Position</SubLabel>
      <PositionGrid>
        {POSITIONS.map((p) => (
          <PositionButton
            key={p}
            active={p === position}
            onClick={() => setPosition(p)}
          >
            {p}
          </PositionButton>
        ))}
      </PositionGrid>

      <SubLabel>ToastProvider</SubLabel>
      <CodeBlock language="jsx" description="Mount ToastProvider">
        {PROVIDER_SNIPPET}
      </CodeBlock>

      <PropsTable rows={PROPS_ROWS} label="ToastProvider Props" />

      <SubLabel>toast utility</SubLabel>
      <CodeBlock language="js" description="Trigger toasts">
        {TOAST_SNIPPET}
      </CodeBlock>
    </ComponentSection>
  );
}

export default ToastSection;
