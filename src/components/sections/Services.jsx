import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';
import Button from 'components/ui/Button';

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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ServiceCard = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.s3};
  }
`;

const ServiceTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.75rem;
`;

const ServiceDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CtaContainer = styled.div`
  text-align: center;
  margin-top: 4rem;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Services() {
  const { t } = useTranslation();
  const { content, loading } = usePage('home');

  const title =
    content?.services?.title ?? (loading ? null : t('services.title'));
  const subtitle =
    content?.services?.subtitle ?? (loading ? null : t('services.subtitle'));

  // Parse services items from CMS if it's a string, otherwise use as-is or fallback
  let servicesItems = content?.services?.items;
  if (typeof servicesItems === 'string') {
    try {
      servicesItems = JSON.parse(servicesItems);
    } catch {
      servicesItems = null;
    }
  }

  const services =
    servicesItems ??
    (loading
      ? null
      : [
          {
            title: t('services.fastDelivery.title'),
            description: t('services.fastDelivery.description'),
          },
          {
            title: t('services.customDesign.title'),
            description: t('services.customDesign.description'),
          },
          {
            title: t('services.expertSupport.title'),
            description: t('services.expertSupport.description'),
          },
        ]);
  const ctaText =
    content?.services?.ctaText ?? (loading ? null : t('services.ctaText'));
  const ctaHref = content?.services?.ctaHref ?? '/#contact';

  if (!services) return null;

  return (
    <Wrapper id="services">
      <Container>
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

        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </ServiceCard>
          ))}
        </ServicesGrid>

        {ctaText && (
          <CtaContainer>
            {loading ? (
              <div
                style={{ height: '46px', width: '130px', margin: '0 auto' }}
              />
            ) : (
              <Button as="a" href={ctaHref}>
                {ctaText}
              </Button>
            )}
          </CtaContainer>
        )}
      </Container>
    </Wrapper>
  );
}
