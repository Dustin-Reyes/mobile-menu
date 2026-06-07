import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';

const Wrapper = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 4rem;
  background-color: ${({ theme }) => theme.colors.background};
  background-image:
    linear-gradient(${({ theme }) => theme.colors.border} 1px, transparent 1px),
    linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.border} 1px,
      transparent 1px
    );
  background-size: 40px 40px;
`;

const Content = styled.div`
  max-width: 720px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.s8};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  line-height: 1.1;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s5};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:before {
    content: '✓';
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
    margin-right: 0.75rem;
  }
`;

const FALLBACK_FEATURES = [
  'Vite 6 for fast development and optimized builds',
  'React 18 with modern hooks and patterns',
  'Emotion for CSS-in-JS styling',
  'Radix UI for accessible component primitives',
  'Framer Motion for smooth animations',
  'Firebase for authentication and CMS',
  'i18next for internationalization',
  'Sentry for error tracking',
  'Jest for unit testing',
  'Playwright for E2E testing',
  'Netlify for seamless deployment',
];

export default function Development() {
  const { content, loading } = usePage('development');

  const title = content?.header?.title ?? (loading ? null : 'Development');
  const description1 =
    content?.header?.description1 ??
    (loading
      ? null
      : 'A production-ready SPA starter template built with modern web technologies and best practices.');
  const description2 =
    content?.header?.description2 ??
    (loading
      ? null
      : 'This template provides a solid foundation for building scalable web applications with React, featuring comprehensive tooling for development, testing, and deployment.');

  const featuresRaw = content?.features?.items ?? null;
  const features = featuresRaw
    ? featuresRaw.split('\n').filter(Boolean)
    : loading
      ? []
      : FALLBACK_FEATURES;

  return (
    <Wrapper>
      <Content>
        {title && <Title>{title}</Title>}
        {description1 && <Description>{description1}</Description>}
        {description2 && <Description>{description2}</Description>}
        <FeatureList>
          {features.map((item, i) => (
            <FeatureItem key={i}>{item}</FeatureItem>
          ))}
        </FeatureList>
      </Content>
    </Wrapper>
  );
}
