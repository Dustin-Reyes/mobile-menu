import { useState } from 'react';
import styled from '@emotion/styled';
import ComponentSection from '../ComponentSection';
import PropsTable from '../PropsTable';
import Button from 'components/ui/Button';
import CodeBlock from 'components/CodeBlock';
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'components/ui/Dialog';

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

const NoteBox = styled.div`
  padding: 0.875rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-left: 3px solid ${(p) => p.theme.colors.warning};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
  margin-bottom: 1.5rem;
`;

const NoteLabel = styled.strong`
  color: ${(p) => p.theme.colors.text};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
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

// ─── Data ──────────────────────────────────────────────────────────────────────

const PROPS_ROWS = [
  {
    prop: 'onOpenAutoFocus',
    type: 'function',
    default: null,
    description:
      'Prevent auto-focus on open to avoid keyboard-triggered immediate close',
  },
  {
    prop: 'onCloseAutoFocus',
    type: 'function',
    default: null,
    description: 'Called when focus returns after dialog closes',
  },
  {
    prop: 'onEscapeKeyDown',
    type: 'function',
    default: null,
    description: 'Called when Escape key is pressed',
  },
  {
    prop: 'forceMount',
    type: 'boolean',
    default: 'false',
    description:
      'Keep the dialog in the DOM when closed (useful for animations)',
  },
];

const CODE_EXAMPLE = `<DialogRoot>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description here.</DialogDescription>
      <DialogClose asChild>
        <Button variant="outline">Close</Button>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</DialogRoot>`;

const IMPORT_SNIPPET = `import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'components/ui/Dialog';`;

// ─── DialogSection ─────────────────────────────────────────────────────────────

function DialogSection() {
  const [open, setOpen] = useState(false);

  return (
    <ComponentSection
      id="dialog"
      title="Dialog"
      description="Accessible modal dialog built on Radix UI Dialog."
    >
      <NoteBox>
        <NoteLabel>Keyboard quirk:</NoteLabel> When a Dialog is opened via
        keyboard (Enter), Radix auto-focuses the first focusable element, then
        the keyup event fires on that element — which can immediately close the
        dialog. Fix this by adding{' '}
        <code>onOpenAutoFocus={`{(e) => e.preventDefault()}`}</code> to{' '}
        <code>DialogContent</code>.
      </NoteBox>

      <SubLabel>Live Demo</SubLabel>
      <DemoRow>
        <DialogRoot open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogTitle>Example Dialog</DialogTitle>
              <DialogDescription>
                This is a sample dialog to demonstrate the Dialog component.
              </DialogDescription>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </DemoRow>

      <SubLabel>Code Example</SubLabel>
      <CodeBlock language="jsx" description="Basic dialog usage">
        {CODE_EXAMPLE}
      </CodeBlock>

      <SubLabel>Import</SubLabel>
      <CodeBlock language="js" description="Import statement">
        {IMPORT_SNIPPET}
      </CodeBlock>

      <PropsTable rows={PROPS_ROWS} label="DialogContent Props" />
    </ComponentSection>
  );
}

export default DialogSection;
