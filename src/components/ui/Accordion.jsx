import styled from '@emotion/styled';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

export const AccordionRoot = styled(RadixAccordion.Root)`
  width: 100%;
  border-radius: ${(p) => p.theme.borderRadius.s2};
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const AccordionItem = styled(RadixAccordion.Item)`
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const AccordionTrigger = styled(RadixAccordion.Trigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.surface};
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => p.theme.colors.border};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: -2px;
  }

  & .accordion-chevron {
    transition: transform ${(p) => p.theme.transitions.base};
    color: ${(p) => p.theme.colors.textSecondary};
    flex-shrink: 0;
  }

  &[data-state='open'] .accordion-chevron {
    transform: rotate(180deg);
  }
`;

export const AccordionContent = styled(RadixAccordion.Content)`
  overflow: hidden;
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  color: ${(p) => p.theme.colors.textSecondary};
  background: ${(p) => p.theme.colors.background};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};

  @keyframes slideDown {
    from {
      height: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }

  @keyframes slideUp {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0;
    }
  }

  &[data-state='open'] {
    animation: slideDown 0.2s ease;
  }

  &[data-state='closed'] {
    animation: slideUp 0.2s ease;
  }

  & .accordion-content-inner {
    padding: 1rem 1.25rem;
  }
`;

export function AccordionChevron() {
  return <ChevronDown size={16} className="accordion-chevron" aria-hidden />;
}
