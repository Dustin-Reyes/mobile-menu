import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
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

const StackGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  max-width: 560px;
  margin-bottom: 3rem;
`;

const StackPill = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  letter-spacing: 0.02em;
`;

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

function Home() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Badge>{t('home.badge')}</Badge>
      <Title>transpiled-web-template</Title>
      <Subtitle>{t('home.subtitle')}</Subtitle>
      <StackGrid>
        {STACK.map((tech) => (
          <StackPill key={tech}>{tech}</StackPill>
        ))}
      </StackGrid>
    </Wrapper>
  );
}

export default Home;
