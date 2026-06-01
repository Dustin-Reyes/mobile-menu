import styled from '@emotion/styled';
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionChevron,
} from 'components/Accordion';

const FAQContainer = styled.section`
  position: relative;
  padding: ${({ theme }) => theme.spacing.s7} ${({ theme }) => theme.spacing.s4};
  background: url('https://images.unsplash.com/photo-1677588508537-5106322c2d40?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
    center/cover no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.s5}
      ${({ theme }) => theme.spacing.s2};
  }
`;

const Container = styled.div`
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  z-index: 2;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.s7};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s7};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s6};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s5};
  text-align: center;
  color: ${({ theme }) => theme.colors.onDark};
  margin-bottom: ${({ theme }) => theme.spacing.s6};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s4};
    margin-bottom: ${({ theme }) => theme.spacing.s5};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s3};
  }
`;

const StyledAccordionRoot = styled(AccordionRoot)`
  border: none;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s2};
  overflow: visible;
`;

const StyledAccordionItem = styled(AccordionItem)`
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  border: 2px solid transparent;
  box-shadow: ${({ theme }) => theme.shadows.s1};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.s3};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const StyledAccordionTrigger = styled(AccordionTrigger)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.s4};
  padding: ${({ theme }) => theme.spacing.s3} ${({ theme }) => theme.spacing.s4};

  & .accordion-chevron {
    color: ${({ theme }) => theme.colors.white};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    opacity: 1;
  }

  &[data-state='open'] {
    background: ${({ theme }) => theme.colors.secondary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.s2};
    font-size: ${({ theme }) => theme.fontSizes.s3};
  }
`;

const StyledAccordionContent = styled(AccordionContent)`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.s3};
  line-height: 1.7;

  & .accordion-content-inner {
    padding: ${({ theme }) => theme.spacing.s3}
      ${({ theme }) => theme.spacing.s4};

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      padding: ${({ theme }) => theme.spacing.s2};
      font-size: ${({ theme }) => theme.fontSizes.s2};
    }
  }
`;

const faqs = [
  {
    question: 'What types of demolition services do you offer?',
    answer:
      'We offer comprehensive demolition services including residential demolition (houses, garages, sheds), commercial demolition (buildings, warehouses), interior demolition (selective demo, gut-outs), and site clearing. We handle projects of all sizes throughout Central Oregon.',
  },
  {
    question: 'How long does a demolition project normally take?',
    answer:
      'The duration of a demolition project varies based on factors such as the size of the structure, site conditions, and any necessary permits. Titan Demo works efficiently to complete projects within agreed timelines while maintaining the highest safety standards.',
  },
  {
    question: 'What safety measures are in place during demolition?',
    answer:
      'Our team prioritizes safety with rigorous protocols, including proper equipment use, debris containment, dust control, and strict adherence to OSHA and industry standards. Safety is paramount to protect both our crew and your property throughout the entire demolition process.',
  },
  {
    question: 'How can I get started with a demolition project?',
    answer:
      "Contact Titan Demo to schedule a free consultation. We'll discuss your project needs, conduct an on-site assessment, and provide a detailed estimate. Our team will guide you through the entire process, from permits to completion, ensuring a seamless experience.",
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Yes, we are fully licensed and insured for all demolition work in Oregon. We carry comprehensive liability insurance and workers compensation coverage to protect you and our team throughout every project.',
  },
];

function FAQSection() {
  return (
    <FAQContainer id="faq">
      <Container>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <SectionSubtitle>
          Everything you need to know about our demolition services
        </SectionSubtitle>
        <StyledAccordionRoot type="single" collapsible>
          {faqs.map((faq, index) => (
            <StyledAccordionItem key={index} value={`faq-${index}`}>
              <StyledAccordionTrigger>
                {faq.question}
                <AccordionChevron />
              </StyledAccordionTrigger>
              <StyledAccordionContent>
                <div className="accordion-content-inner">{faq.answer}</div>
              </StyledAccordionContent>
            </StyledAccordionItem>
          ))}
        </StyledAccordionRoot>
      </Container>
    </FAQContainer>
  );
}

export default FAQSection;
