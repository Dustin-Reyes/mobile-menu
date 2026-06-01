import styled from '@emotion/styled';
import { Phone, Calendar, CheckCircle2 } from 'lucide-react';

const ProcessSectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.s7} ${({ theme }) => theme.spacing.s4};
  background: ${({ theme }) => theme.colors.surface};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.s7};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  color: ${({ theme }) => theme.colors.black};
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s5};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.s6};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ProcessFlow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.s4};
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.s5};
  }
`;

const ProcessStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  padding: ${({ theme }) => theme.spacing.s4};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.s1};

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.s3};
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.s100};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.s6};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.s3};
  transition: all ${({ theme }) => theme.transitions.base};

  ${ProcessStep}:hover & {
    background: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.1);
  }
`;

const IconWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  color: ${({ theme }) => theme.colors.primary};
  transition: all ${({ theme }) => theme.transitions.base};

  ${ProcessStep}:hover & {
    color: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.1);
  }
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.s6};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  color: ${({ theme }) => theme.colors.primary};
  transition: color ${({ theme }) => theme.transitions.fast};

  ${ProcessStep}:hover & {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const StepDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  transition: color ${({ theme }) => theme.transitions.fast};

  ${ProcessStep}:hover & {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const steps = [
  {
    number: 1,
    icon: Phone,
    title: 'Request a Quote',
    description:
      'Call us or fill out our contact form for a free, no-obligation estimate. We respond quickly to all inquiries.',
  },
  {
    number: 2,
    icon: Calendar,
    title: 'Schedule the Job',
    description:
      'Most jobs are scheduled within the week. We work around your timeline to minimize disruption.',
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: 'We Handle It',
    description:
      'Our professional team completes the demolition fast and clean, so your contractor can get to work.',
  },
];

function ProcessSection() {
  return (
    <ProcessSectionContainer>
      <Container>
        <SectionTitle>How It Works</SectionTitle>
        <SectionSubtitle>
          Get your demolition project done in three simple steps
        </SectionSubtitle>
        <ProcessFlow>
          {steps.map((step) => (
            <ProcessStep key={step.number}>
              <StepNumber>{step.number}</StepNumber>
              <IconWrapper>
                <step.icon size={48} />
              </IconWrapper>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </ProcessStep>
          ))}
        </ProcessFlow>
      </Container>
    </ProcessSectionContainer>
  );
}

export default ProcessSection;
