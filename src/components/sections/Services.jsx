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
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  border: 1px solid
    ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.s3};
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
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
  const { content, loading } = usePage('home');

  const title = content?.services?.title ?? (loading ? null : 'Our Services');
  const subtitle =
    content?.services?.subtitle ?? (loading ? null : 'What we can do for you');
  const services =
    content?.services?.items ??
    (loading
      ? null
      : [
          {
            icon: '⚡',
            title: 'Fast Delivery',
            description: 'Quick turnaround times without compromising quality.',
          },
          {
            icon: '🎨',
            title: 'Custom Design',
            description: 'Tailored solutions that match your brand and needs.',
          },
          {
            icon: '🔧',
            title: 'Expert Support',
            description: 'Dedicated support from our experienced team.',
          },
        ]);
  const ctaText = content?.services?.ctaText ?? (loading ? null : 'Learn More');
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
              <ServiceIcon>{service.icon}</ServiceIcon>
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
