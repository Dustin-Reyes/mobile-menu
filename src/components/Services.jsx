import styled from '@emotion/styled';
import {
  Home,
  Building2,
  Hammer,
  Wrench,
  Droplet,
  ChevronDown,
  Phone,
  ArrowRight,
} from 'lucide-react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { useTranslation } from 'react-i18next';

const ServicesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.s7} ${({ theme }) => theme.spacing.s4};
  background: ${({ theme }) => theme.colors.surface};
`;

const Container = styled.div`
  max-width: 1800px;
  margin: 0 auto;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s3};
  margin-bottom: ${({ theme }) => theme.spacing.s3};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.primary};
    max-width: 100px;
  }
`;

const EyebrowText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.s9};
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};

  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.02em;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s6};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s5};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s4};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.s6};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s3};
  }
`;

const AccordionRoot = styled(RadixAccordion.Root)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const AccordionItem = styled(RadixAccordion.Item)`
  border: 1px solid ${({ theme }) => theme.colors.secondaryBorder};

  &:first-of-type {
    border-top: 1px solid ${({ theme }) => theme.colors.secondaryBorder};
  }
`;

const AccordionTrigger = styled(RadixAccordion.Trigger)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s4};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.s4};
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all ${({ theme }) => theme.transitions.base};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.s3};
    gap: ${({ theme }) => theme.spacing.s3};
  }
`;

const IconBox = styled.div`
  width: 70px;
  height: 70px;
  min-width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
`;

const AccordionItemLayout = styled.div`
  display: flex;
`;

const AccordionIconSide = styled.div`
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.s4};
  border-right: 1px solid ${({ theme }) => theme.colors.secondaryBorder};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.s3};
    border-right: none;
  }
`;

const AccordionMainSide = styled.div`
  flex: 1;
  min-width: 0;
`;

const ServiceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ServiceTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.s6};
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};

  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.s2};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s4};
  }
`;

const ServiceDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s2};
  }
`;

const ChevronIcon = styled(ChevronDown)`
  color: ${({ theme }) => theme.colors.primary};
  transition: transform ${({ theme }) => theme.transitions.base};
  flex-shrink: 0;
  margin-left: auto;

  ${AccordionTrigger}[data-state='open'] & {
    transform: rotate(180deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 20px;
    height: 20px;
  }
`;

const AccordionContent = styled(RadixAccordion.Content)`
  overflow: hidden;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.s3};
  line-height: 1.7;

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
`;

const AccordionContentInner = styled.div`
  padding: ${({ theme }) => theme.spacing.s4};
  padding-top: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.s3};
    padding-top: 0;
  }
`;

const CTABanner = styled.div`
  margin-top: ${({ theme }) => theme.spacing.s6};
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  padding: ${({ theme }) => theme.spacing.s5};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s5};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.s4};
    padding: ${({ theme }) => theme.spacing.s4};
  }
`;

const CTALeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s3};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.s2};
  }
`;

const PhoneIconCircle = styled.div`
  width: 60px;
  height: 60px;
  min-width: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.s100};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
`;

const CTAHeadline = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.s5};
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};

  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s4};
  }
`;

const CTAHeadlineWhite = styled.span`
  color: ${({ theme }) => theme.colors.text};
  display: block;
`;

const CTAHeadlineGold = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  display: block;
`;

const CTACenter = styled.p`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s2};
  }
`;

const CTAButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  padding: ${({ theme }) => theme.spacing.s3} ${({ theme }) => theme.spacing.s5};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  font-size: ${({ theme }) => theme.fontSizes.s4};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s2};
  transition: all ${({ theme }) => theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s3};
    padding: ${({ theme }) => theme.spacing.s2}
      ${({ theme }) => theme.spacing.s4};
  }
`;

const serviceKeys = [
  {
    icon: Home,
    key: 'interiorDemolition',
  },
  {
    icon: Building2,
    key: 'structuralDemolition',
  },
  {
    icon: Hammer,
    key: 'sitePrep',
  },
  {
    icon: Wrench,
    key: 'specialtyDemo',
  },
  {
    icon: Droplet,
    key: 'asbestosLead',
  },
];

function Services() {
  const { t } = useTranslation();

  return (
    <ServicesSection id="services">
      <Container>
        <Eyebrow>
          <EyebrowText>{t('services.eyebrow')}</EyebrowText>
        </Eyebrow>
        <SectionTitle>{t('services.title')}</SectionTitle>
        <SectionSubtitle>{t('services.subtitle')}</SectionSubtitle>
        <AccordionRoot type="single" collapsible>
          {serviceKeys.map((service, index) => (
            <AccordionItem key={index} value={`service-${index}`}>
              <AccordionItemLayout>
                <AccordionIconSide>
                  <IconBox>
                    <service.icon size={32} strokeWidth={1.5} />
                  </IconBox>
                </AccordionIconSide>
                <AccordionMainSide>
                  <AccordionTrigger>
                    <ServiceInfo>
                      <ServiceTitle>
                        {t(`services.${service.key}.title`)}
                      </ServiceTitle>
                      <ServiceDescription>
                        {t(`services.${service.key}.description`)}
                      </ServiceDescription>
                    </ServiceInfo>
                    <ChevronIcon size={24} />
                  </AccordionTrigger>
                  <AccordionContent>
                    <AccordionContentInner>
                      {t(`services.${service.key}.details`)}
                    </AccordionContentInner>
                  </AccordionContent>
                </AccordionMainSide>
              </AccordionItemLayout>
            </AccordionItem>
          ))}
        </AccordionRoot>

        <CTABanner>
          <CTALeft>
            <PhoneIconCircle>
              <Phone size={28} strokeWidth={2} />
            </PhoneIconCircle>
            <CTAHeadline>
              <CTAHeadlineWhite>
                {t('services.cta.headlineWhite')}
              </CTAHeadlineWhite>
              <CTAHeadlineGold>
                {t('services.cta.headlineGold')}
              </CTAHeadlineGold>
            </CTAHeadline>
          </CTALeft>
          <CTACenter>{t('services.cta.body')}</CTACenter>
          <CTAButton>
            {t('services.cta.button')}
            <ArrowRight size={20} />
          </CTAButton>
        </CTABanner>
      </Container>
    </ServicesSection>
  );
}

export default Services;
