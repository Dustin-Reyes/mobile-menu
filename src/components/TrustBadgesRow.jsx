import styled from '@emotion/styled';
import { Shield, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TrustBadgesRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.s6};
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.s4};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-wrap: wrap;
    justify-content: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.s5};
  }
`;

const TrustBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s2};
  flex: 1;
  text-align: center;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: calc(-${({ theme }) => theme.spacing.s4} / 2);
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 40px;
    background: ${({ theme }) => theme.colors.border};

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 0 0 calc(50% - ${({ theme }) => theme.spacing.s4});

    &:nth-of-type(2)::after {
      display: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex: 1;
    width: 100%;
  }
`;

const TrustBadgeIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
  }
`;

const TrustBadgeLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-family: ${({ theme }) => theme.typography.fontFamilies.heading};

  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s2};
  }
`;

const trustBadgeKeys = [
  {
    icon: Shield,
    labelKey: 'licensedInsured',
  },
  {
    icon: AlertTriangle,
    labelKey: 'safetyFocused',
  },
  {
    icon: Clock,
    labelKey: 'onTime',
  },
  {
    icon: MapPin,
    labelKey: 'locallyOwned',
    labelLine2Key: 'oregonProud',
  },
];

function TrustBadgesRowComponent() {
  const { t } = useTranslation();

  return (
    <TrustBadgesRow>
      {trustBadgeKeys.map((badge, index) => (
        <TrustBadge key={index}>
          <TrustBadgeIcon>
            <badge.icon size={28} strokeWidth={1.5} />
          </TrustBadgeIcon>
          <TrustBadgeLabel>
            {t(`services.trustBadges.${badge.labelKey}`)}
            {badge.labelLine2Key && (
              <>
                <br />
                {t(`services.trustBadges.${badge.labelLine2Key}`)}
              </>
            )}
          </TrustBadgeLabel>
        </TrustBadge>
      ))}
    </TrustBadgesRow>
  );
}

export default TrustBadgesRowComponent;
