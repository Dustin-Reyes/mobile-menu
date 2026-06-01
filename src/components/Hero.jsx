import { Phone, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Button from 'components/Button';
import TrustedBanner from 'components/TrustedBanner';
import useScrollToSection from 'hooks/useScrollToSection';

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  margin-top: -72px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: url('/background-hero.png') center/cover no-repeat fixed;

  /* Add overlay for better text readability */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.97) 0%,
      rgba(0, 0, 0, 0.75) 45%,
      rgba(0, 0, 0, 0.1) 100%
    );
    z-index: 1;
  }

  /* Ensure background doesn't scroll on mobile */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    background-attachment: scroll;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: calc(${({ theme }) => theme.spacing.s7} + 72px)
    ${({ theme }) => theme.spacing.s6} ${({ theme }) => theme.spacing.s7};
  color: ${({ theme }) => theme.colors.white};
  text-align: left;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: calc(${({ theme }) => theme.spacing.s5} + 72px)
      ${({ theme }) => theme.spacing.s2} ${({ theme }) => theme.spacing.s5};
  }
`;

const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamilies.body};
  font-size: ${({ theme }) => theme.fontSizes.s6};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: ${({ theme }) => theme.spacing.s1};
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s4};
  }
`;

const MainMotto = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};
  font-size: ${({ theme }) => theme.fontSizes.s10};
  text-transform: uppercase;
  line-height: 1.1;
  letter-spacing: 0.05em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s8};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s9};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  width: 60px;
  margin: ${({ theme }) => theme.spacing.s3} 0;
`;

const SubMotto = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamilies.body};
  font-size: ${({ theme }) => theme.fontSizes.s5};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing.s5};
  line-height: 1.6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s4};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s3};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s3};
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

const CTAButton = styled(Button)`
  gap: ${({ theme }) => theme.spacing.s1};
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.s3};
  padding: ${({ theme }) => theme.spacing.s3} ${({ theme }) => theme.spacing.s5};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.s4};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.s2}
      ${({ theme }) => theme.spacing.s4};
    font-size: ${({ theme }) => theme.fontSizes.s4};
  }
`;

function Hero() {
  const { t } = useTranslation();
  const scrollToSection = useScrollToSection();

  return (
    <HeroSection>
      <HeroContent>
        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
        <MainMotto>
          {t('hero.headlineLine1')}
          <br />
          {t('hero.headlineLine2')}
        </MainMotto>
        <Divider />
        <SubMotto>{t('hero.body')}</SubMotto>
        <ButtonGroup>
          <CTAButton onClick={() => scrollToSection('contact-form')}>
            {t('hero.ctaQuote')} <ArrowRight size={18} />
          </CTAButton>
          <CTAButton as="a" variant="outline" href="tel:+15413297504">
            <Phone size={18} color="currentColor" /> {t('hero.ctaPhone')}
          </CTAButton>
        </ButtonGroup>
      </HeroContent>
      <TrustedBanner />
    </HeroSection>
  );
}

export default Hero;
