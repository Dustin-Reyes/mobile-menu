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
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: clamp(1.75rem, 5vw, 3.5rem);
  font-weight: 800;
  text-align: center;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 2.5rem;
  max-width: 480px;
`;

const CommandBox = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 1rem;
  margin-bottom: 3rem;
  min-width: 260px;
`;

const Prompt = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  user-select: none;
`;

const Command = styled.span`
  color: ${({ theme }) => theme.colors.text};
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
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  letter-spacing: 0.02em;
`;

const Hint = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.5;
  text-align: center;
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
      <CommandBox>
        <Prompt>$</Prompt>
        <Command>yarn setup</Command>
      </CommandBox>
      <StackGrid>
        {STACK.map((tech) => (
          <StackPill key={tech}>{tech}</StackPill>
        ))}
      </StackGrid>
      <Hint>{t('home.hint')}</Hint>
    </Wrapper>
  );
}

export default Home;
