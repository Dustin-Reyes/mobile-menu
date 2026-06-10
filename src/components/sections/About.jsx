/**
 * @module components/sections/About
 * @description Displays the About section with a title, subtitle, description, and a 2×2 stats
 * grid. Content is fetched from the CMS via `usePage('home')` and falls back to hard-coded
 * defaults once loading has settled.
 */

import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';
import placeholderSrc from 'assets/placeholder-image.svg';

// ─── Layout ───────────────────────────────────────────────────────────────────

const Wrapper = styled.section`
  min-height: min(100vh, 1080px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.surface : theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Content = styled.div`
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 1;
  }
`;

const ImageContainer = styled.div`
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 2;
  }
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
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.s5};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const AboutImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  display: block;
`;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * About section component. Renders company history, a descriptive paragraph, and key
 * statistics alongside a placeholder image in a two-column responsive layout.
 *
 * @returns {JSX.Element}
 */
export default function About() {
  const { content, loading } = usePage('home');

  const title = content?.about?.title ?? (loading ? null : 'About Us');
  const subtitle =
    content?.about?.subtitle ??
    (loading ? null : 'Our story and what drives us');
  const description =
    content?.about?.description ??
    (loading
      ? null
      : 'We are a dedicated team passionate about delivering exceptional results. With years of experience and a commitment to excellence, we help businesses achieve their goals through innovative solutions and personalized service.');
  const image = content?.about?.image ?? null;

  const stats =
    content?.about?.stats ??
    (loading
      ? null
      : [
          {
            number: '100+',
            label: 'Clients',
          },
          {
            number: '5+',
            label: 'Years',
          },
          {
            number: '50+',
            label: 'Projects',
          },
          {
            number: '24/7',
            label: 'Support',
          },
        ]);

  return (
    <Wrapper id="about">
      <Container>
        <Content>
          {loading ? (
            <div style={{ height: '40px', marginBottom: '1rem' }} />
          ) : (
            <SectionTitle>{title}</SectionTitle>
          )}
          {loading ? (
            <div style={{ height: '28px', marginBottom: '1.5rem' }} />
          ) : (
            <SectionSubtitle>{subtitle}</SectionSubtitle>
          )}
          {loading ? (
            <div style={{ height: '80px', marginBottom: '1.5rem' }} />
          ) : (
            <Description>{description}</Description>
          )}
          {stats && (
            <StatsGrid>
              {stats.map((stat, index) => (
                <StatItem key={index}>
                  <StatNumber>{stat.number}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              ))}
            </StatsGrid>
          )}
        </Content>
        <ImageContainer>
          <AboutImage
            src={image?.url ?? placeholderSrc}
            alt={image?.name ?? ''}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = placeholderSrc;
            }}
          />
        </ImageContainer>
      </Container>
    </Wrapper>
  );
}
