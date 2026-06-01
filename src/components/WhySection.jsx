import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, Award, Users, DollarSign } from 'lucide-react';

const WhySectionContainer = styled.section`
  position: relative;
  padding: ${({ theme }) => theme.spacing.s7} ${({ theme }) => theme.spacing.s4};
  background: url('/background-hero.png') center/cover no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.s5}
      ${({ theme }) => theme.spacing.s2};
  }
`;

const Container = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  z-index: 2;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s3};
  margin-bottom: ${({ theme }) => theme.spacing.s4};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.primary};
    max-width: 150px;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      max-width: 80px;
    }
  }
`;

const EyebrowText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.15em;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s2};
  }
`;

const Headline = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.s10};
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};

  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.s4};
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s9};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s8};
  }
`;

const HeadlineAccent = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const BodyCopy = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s4};
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.s3};
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s3};
  }
`;

const CTALine = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s4};
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.s6};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s3};
  }
`;

const CTAAccent = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  margin-top: ${({ theme }) => theme.spacing.s6};
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.s5} ${({ theme }) => theme.spacing.s3};
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 80%;
    background: ${({ theme }) => theme.colors.border};

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      width: 80%;
      height: 1px;
      right: auto;
      left: 50%;
      top: auto;
      bottom: 0;
      transform: translateX(-50%);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.s4}
      ${({ theme }) => theme.spacing.s3};
  }
`;

const BenefitIcon = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.s3};
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 60px;
    height: 60px;
  }
`;

const BenefitTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.s5};
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};

  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  letter-spacing: 0.05em;
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.s2};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s3};
  }
`;

const BenefitDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.6;
  margin-top: ${({ theme }) => theme.spacing.s2};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s2};
  }
`;

const getBenefitsData = (t) => [
  {
    icon: Shield,
    title: t('why.benefits.licensed.title'),
    description: t('why.benefits.licensed.description'),
  },
  {
    icon: Clock,
    title: t('why.benefits.turnaround.title'),
    description: t('why.benefits.turnaround.description'),
  },
  {
    icon: Award,
    title: t('why.benefits.satisfaction.title'),
    description: t('why.benefits.satisfaction.description'),
  },
  {
    icon: Users,
    title: t('why.benefits.team.title'),
    description: t('why.benefits.team.description'),
  },
  {
    icon: DollarSign,
    title: t('why.benefits.pricing.title'),
    description: t('why.benefits.pricing.description'),
  },
];

function WhySection() {
  const { t } = useTranslation();
  const benefits = getBenefitsData(t);

  return (
    <WhySectionContainer id="why">
      <Container>
        <Eyebrow>
          <EyebrowText>{t('why.eyebrow')}</EyebrowText>
        </Eyebrow>
        <Headline>
          {t('why.headline')}
          <br />
          {t('why.headlineLine2')}{' '}
          <HeadlineAccent>{t('why.headlineAccent')}</HeadlineAccent>
        </Headline>
        <BodyCopy>{t('why.body')}</BodyCopy>
        <CTALine>
          {t('why.ctaLine')} <CTAAccent>{t('why.ctaAccent')}</CTAAccent>
        </CTALine>

        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitItem key={index}>
              <BenefitIcon>
                <benefit.icon size={48} strokeWidth={1.5} />
              </BenefitIcon>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitItem>
          ))}
        </BenefitsGrid>
      </Container>
    </WhySectionContainer>
  );
}

export default WhySection;
