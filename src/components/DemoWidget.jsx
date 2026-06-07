import { useState } from 'react';
import styled from '@emotion/styled';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'components/ui/Dialog';

// ─── Styled components ────────────────────────────────────────────────────────

const Section = styled.section`
  width: 100%;
  max-width: 480px;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: ${(props) => props.theme.typography.fontSizes.s5};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.text};
  text-align: left;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.s2};
  font-size: ${(props) => props.theme.typography.fontSizes.s4};
  outline: none;
  transition: border-color ${(props) => props.theme.transitions.fast};
  color: ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.background};

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) =>
    props.theme.colors.surface === '#ffffff' ? '#ffffff' : '#111827'};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.s2};
  font-size: ${(props) => props.theme.typography.fontSizes.s4};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition: background ${(props) => props.theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.primary}dd;
  }

  &:disabled {
    background: ${(props) => props.theme.colors.primary}40;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  align-self: flex-end;
  margin-top: 0.5rem;
  padding: 0.5rem 1.125rem;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.s2};
  font-size: ${(props) => props.theme.typography.fontSizes.s5};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition: background ${(props) => props.theme.transitions.fast};

  &:hover {
    background: ${(props) => props.theme.colors.border};
  }
`;

// ─── DemoWidget ───────────────────────────────────────────────────────────────

function DemoWidget() {
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    setSubmittedValue(inputValue.trim());
    setIsModalOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <Section aria-label="Demo widget">
      <FieldLabel htmlFor="demo-input">
        Your name
        <Input
          id="demo-input"
          type="text"
          placeholder="Enter your name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-describedby="demo-hint"
        />
      </FieldLabel>
      <span id="demo-hint" style={{ fontSize: '0.8rem', color: '#888' }}>
        Press Enter or click Submit
      </span>
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!inputValue.trim()}
        aria-disabled={!inputValue.trim()}
      >
        Submit
      </Button>

      <DialogRoot open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogPortal>
          <DialogOverlay data-testid="modal-overlay" />
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogTitle>Hello, {submittedValue}!</DialogTitle>
            <DialogDescription>
              You submitted: &ldquo;{submittedValue}&rdquo;
            </DialogDescription>
            <DialogClose asChild>
              <CloseButton>Close</CloseButton>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </Section>
  );
}

export default DemoWidget;
