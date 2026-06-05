import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';
import Button from 'components/ui/Button';

// ─── Layout ───────────────────────────────────────────────────────────────────

const Wrapper = styled.section`
  min-height: min(50vh, 600px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
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
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CtaRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function CTA() {
  const { content, loading } = usePage('home');

  const title =
    content?.cta?.title ?? (loading ? null : 'Ready to Get Started?');
  const subtitle =
    content?.cta?.subtitle ??
    (loading
      ? null
      : 'Contact us today to discuss your project and discover how we can help you achieve your goals.');
  const primaryCtaText =
    content?.cta?.primaryText ?? (loading ? null : 'Contact Us');
  const primaryCtaHref = content?.cta?.primaryHref ?? '/#contact';
  const secondaryCtaText =
    content?.cta?.secondaryText ?? (loading ? null : 'View Portfolio');
  const secondaryCtaHref = content?.cta?.secondaryHref ?? '/#gallery';

  return (
    <Wrapper id="cta">
      <Container>
        {loading ? (
          <div style={{ height: '40px', marginBottom: '1rem' }} />
        ) : (
          <SectionTitle>{title}</SectionTitle>
        )}
        {loading ? (
          <div style={{ height: '56px', marginBottom: '2rem' }} />
        ) : (
          <SectionSubtitle>{subtitle}</SectionSubtitle>
        )}

        <CtaRow>
          {loading ? (
            <div style={{ height: '46px', width: '130px', margin: '0 auto' }} />
          ) : (
            <Button as="a" href={primaryCtaHref}>
              {primaryCtaText}
            </Button>
          )}
          {secondaryCtaText && (
            <>
              {loading ? (
                <div
                  style={{ height: '46px', width: '130px', margin: '0 auto' }}
                />
              ) : (
                <Button as="a" href={secondaryCtaHref} variant="outline">
                  {secondaryCtaText}
                </Button>
              )}
            </>
          )}
        </CtaRow>
      </Container>
    </Wrapper>
  );
}
