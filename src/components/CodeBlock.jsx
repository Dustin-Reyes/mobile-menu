import { useState } from 'react';
import styled from '@emotion/styled';
import { CopyIcon } from 'lucide-react';
import Pill from 'components/ui/Pill';

const CodeBlockContainer = styled.div`
  position: relative;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  overflow: hidden;
  margin: 0.5rem 0;
`;

const CodeBlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.textSecondary};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  font-style: italic;
  gap: 1rem;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.onPrimary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CodeBlockContent = styled.pre`
  margin: 0;
  padding: 1rem;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  font-family: ${(p) => p.theme.typography.fontFamilies.monoSecondary};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  line-height: ${(p) => p.theme.typography.lineHeights.normal};
  overflow-x: auto;
  white-space: pre-wrap;

  code {
    padding: 0;
    border-radius: 0;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }
`;

/**
 * Lightweight code block component with copy functionality.
 * Supports language labeling, descriptions, and theme-aware styling.
 */
const CodeBlock = ({
  children,
  language = 'jsx',
  description,
  showCopy = true,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textContent =
      typeof children === 'string' ? children : String(children);
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <CodeBlockContainer {...props}>
      <CodeBlockHeader>
        <HeaderContent>
          {description || 'Code example'}
          <Pill>{language}</Pill>
        </HeaderContent>
        {showCopy && (
          <CopyButton onClick={handleCopy}>
            <CopyIcon size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </CopyButton>
        )}
      </CodeBlockHeader>
      <CodeBlockContent>
        <code>{children}</code>
      </CodeBlockContent>
    </CodeBlockContainer>
  );
};

export default CodeBlock;
