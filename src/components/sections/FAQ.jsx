/**
 * @module components/sections/FAQ
 * @description Renders the FAQ section as a list of accordion-style items where each question
 * can be toggled to reveal its answer. Content is fetched from the CMS; the component renders
 * nothing until FAQ items are available.
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ─── Layout ───────────────────────────────────────────────────────────────────

const Wrapper = styled.section`
  min-height: min(100vh, 1080px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.s6};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  margin-bottom: 1rem;
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.secondaryBackground};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FAQAnswer = styled.div`
  padding: ${({ isOpen }) => (isOpen ? '1.5rem' : '0 1.5rem')};
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top: none;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.s2}
    ${({ theme }) => theme.borderRadius.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  line-height: 1.6;
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  overflow: hidden;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition:
    max-height ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast},
    padding ${({ theme }) => theme.transitions.fast};
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * FAQ section component. Displays an accordion list of frequently asked questions sourced from
 * the CMS. Returns `null` when no FAQ items are present.
 *
 * @returns {JSX.Element|null}
 */
export default function FAQ() {
  const { content, loading } = usePage('home');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const title =
    content?.faq?.title ?? (loading ? null : 'Frequently Asked Questions');
  const subtitle =
    content?.faq?.subtitle ??
    (loading ? null : 'Find answers to common questions');
  const faqs = content?.faq?.items ?? (loading ? null : []);

  if (!faqs) return null;

  return (
    <Wrapper id="faq">
      <SectionHeader>
        {loading ? (
          <div style={{ height: '40px', marginBottom: '1rem' }} />
        ) : (
          <SectionTitle>{title}</SectionTitle>
        )}
        {loading ? (
          <div
            style={{ height: '24px', maxWidth: '400px', margin: '0 auto' }}
          />
        ) : (
          <SectionSubtitle>{subtitle}</SectionSubtitle>
        )}
      </SectionHeader>

      <FAQContainer>
        {faqs.map((faq, index) => (
          <FAQItem key={index}>
            <FAQQuestion onClick={() => toggleFAQ(index)}>
              {faq.question}
              <IconWrapper>
                {openIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </IconWrapper>
            </FAQQuestion>
            <FAQAnswer isOpen={openIndex === index}>{faq.answer}</FAQAnswer>
          </FAQItem>
        ))}
      </FAQContainer>
    </Wrapper>
  );
}
