import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';
import Button from 'components/ui/Button';

const STACK = [
  'Vite 6',
  'React 18',
  'Emotion',
  'Radix UI',
  'Framer Motion',
  'Firebase',
  'i18next',
  'Sentry',
  'Jest',
  'Playwright',
  'Netlify',
];

const Wrapper = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 4rem;
  background-color: ${({ theme }) => theme.colors.background};
  background-image:
    linear-gradient(
      ${({ theme }) =>
          theme.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.04)'}
        1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      ${({ theme }) =>
          theme.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.04)'}
        1px,
      transparent 1px
    );
  background-size: 40px 40px;
`;

const Badge = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.s8};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s5};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 2.5rem;
  max-width: 480px;
`;

const CtaRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const StackGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  max-width: 560px;
`;

const StackPill = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid
    ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.12)'};
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  letter-spacing: 0.02em;
`;

export default function Hero() {
  const { t } = useTranslation();
  const { content } = usePage('home');

  // CMS content takes priority; i18n keys are the static fallback
  const badge = content?.badge ?? t('home.badge');
  const title = content?.title ?? t('home.title');
  const subtitle = content?.subtitle ?? t('home.subtitle');
  const ctaText = content?.ctaText ?? t('home.ctaText');
  const ctaHref = content?.ctaHref ?? '/';

  return (
    <Wrapper>
      <Badge>{badge}</Badge>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <CtaRow>
        <Button as="a" href={ctaHref}>
          {ctaText}
        </Button>
      </CtaRow>
      <StackGrid>
        {STACK.map((tech) => (
          <StackPill key={tech}>{tech}</StackPill>
        ))}
      </StackGrid>
    </Wrapper>
  );
}
