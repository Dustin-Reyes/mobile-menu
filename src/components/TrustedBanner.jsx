import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { MapPin } from 'lucide-react';
import useScrollToSection from 'hooks/useScrollToSection';

const Banner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    min-height: 160px;
    padding-bottom: 0;
    background: ${({ theme }) =>
      theme.mode === 'dark'
        ? theme.colors.surface
        : "url('/dirty-paper.png') center/cover no-repeat"};
  }
`;

const WhiteSection = styled.div`
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s2};
  padding: ${({ theme }) => theme.spacing.s3} ${({ theme }) => theme.spacing.s4}
    ${({ theme }) => theme.spacing.s5};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: space-between;
    flex: 3;
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.s5};
    padding: ${({ theme }) => theme.spacing.s4}
      ${({ theme }) => theme.spacing.s6};
    clip-path: polygon(0 0, 100% 0, calc(100% - 48px) 100%, 0 100%);
  }
`;

const TrustedText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s0};
  flex-shrink: 0;
`;

const TrustedHeading = styled.p`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    font-family: ${({ theme }) => theme.typography.fontFamilies.heading};
    font-size: ${({ theme }) => theme.fontSizes.s6};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.text};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.5;
  }
`;

const TrustedBody = styled.p`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    font-family: ${({ theme }) => theme.typography.fontFamilies.body};
    font-size: ${({ theme }) => theme.fontSizes.s2};
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.5;
    max-width: 210px;
    text-wrap: pretty;
  }
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s1};
  flex: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.s2};
    max-width: 700px;
  }
`;

const Stat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 48px;
  background: ${({ theme }) => theme.colors.tertiary};
  flex-shrink: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 100px;
  }
`;

const StatNumber = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};
  font-size: ${({ theme }) => theme.fontSizes.s6};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.2;
  display: block;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s8};
    line-height: 1.5;
  }
`;

const StatLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamilies.body};
  font-size: ${({ theme }) => theme.fontSizes.s1};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  margin-top: ${({ theme }) => theme.spacing.s0};
  max-width: 10rem;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s2};
    max-width: 12rem;
  }
`;

const MapWrapper = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
`;

const MapImage = styled.img`
  max-width: 130px;
  height: auto;
`;

const MapPinContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const GoldSection = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.s1};
    padding: ${({ theme }) => theme.spacing.s4}
      ${({ theme }) => theme.spacing.s5};
    background: ${({ theme }) => theme.colors.primary};
    margin-left: -48px;
    padding-left: calc(${({ theme }) => theme.spacing.s5} + 48px);
  }
`;

const CTAContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s0};
  flex: 1;
`;

const CTAHeading = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};
  font-size: ${({ theme }) => theme.fontSizes.s4};
  color: ${({ theme }) => theme.colors.onPrimary};
  text-transform: uppercase;
  line-height: 1.3;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s6};
  }
`;

const CTABody = styled.p`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    font-family: ${({ theme }) => theme.typography.fontFamilies.body};
    font-size: ${({ theme }) => theme.fontSizes.s2};
    color: ${({ theme }) => theme.colors.onPrimary};
    line-height: 1.5;
  }
`;

const BannerCTAButton = styled.button`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.s0};
    padding: ${({ theme }) => theme.spacing.s1}
      ${({ theme }) => theme.spacing.s3};
    background: rgba(0, 0, 0, 0.85);
    color: ${({ theme }) => theme.colors.white};
    font-family: ${({ theme }) => theme.typography.fontFamilies.body};
    font-size: ${({ theme }) => theme.fontSizes.s2};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: background ${({ theme }) => theme.transitions.fast};
    flex-shrink: 0;

    &:hover {
      background: ${({ theme }) => theme.colors.black};
    }
  }
`;

function TrustedBanner() {
  const theme = useTheme();
  const { t } = useTranslation();
  const scrollToSection = useScrollToSection();

  return (
    <Banner>
      <WhiteSection>
        <TrustedText>
          <TrustedHeading>{t('trustedBanner.heading')}</TrustedHeading>
          <TrustedBody>{t('trustedBanner.body')}</TrustedBody>
        </TrustedText>

        <MapWrapper>
          <MapPinContainer>
            <MapPin size={24} color="currentColor" />
          </MapPinContainer>
          <MapImage
            src={
              theme.mode === 'dark'
                ? '/oregon_map_dark_transparent.png'
                : '/oregon_map_light_transparent.png'
            }
            alt={t('trustedBanner.mapAlt')}
          />
        </MapWrapper>

        <StatsRow>
          <Stat>
            <StatNumber>15+</StatNumber>
            <StatLabel>{t('trustedBanner.stats.yearsExperience')}</StatLabel>
          </Stat>
          <StatDivider />
          <Stat>
            <StatNumber>500+</StatNumber>
            <StatLabel>{t('trustedBanner.stats.projectsCompleted')}</StatLabel>
          </Stat>
          <StatDivider />
          <Stat>
            <StatNumber>100%</StatNumber>
            <StatLabel>{t('trustedBanner.stats.safetyFocused')}</StatLabel>
          </Stat>
        </StatsRow>
      </WhiteSection>

      <GoldSection>
        <CTAContent>
          <CTAHeading>{t('trustedBanner.cta.heading')}</CTAHeading>
          <CTABody>{t('trustedBanner.cta.body')}</CTABody>
        </CTAContent>
        <BannerCTAButton onClick={() => scrollToSection('contact-form')}>
          {t('trustedBanner.cta.button')}
        </BannerCTAButton>
      </GoldSection>
    </Banner>
  );
}

export default TrustedBanner;
