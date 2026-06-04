import styled from '@emotion/styled';

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

export default function About() {
  return (
    <Wrapper>
      <Content>
        <Title>About This Template</Title>
        <Description>
          A production-ready SPA starter template built with modern web
          technologies and best practices.
        </Description>
        <Description>
          This template provides a solid foundation for building scalable web
          applications with React, featuring comprehensive tooling for
          development, testing, and deployment.
        </Description>
        <FeatureList>
          <FeatureItem>
            Vite 6 for fast development and optimized builds
          </FeatureItem>
          <FeatureItem>React 18 with modern hooks and patterns</FeatureItem>
          <FeatureItem>Emotion for CSS-in-JS styling</FeatureItem>
          <FeatureItem>
            Radix UI for accessible component primitives
          </FeatureItem>
          <FeatureItem>Framer Motion for smooth animations</FeatureItem>
          <FeatureItem>Firebase for authentication and CMS</FeatureItem>
          <FeatureItem>i18next for internationalization</FeatureItem>
          <FeatureItem>Sentry for error tracking</FeatureItem>
          <FeatureItem>Jest for unit testing</FeatureItem>
          <FeatureItem>Playwright for E2E testing</FeatureItem>
          <FeatureItem>Netlify for seamless deployment</FeatureItem>
        </FeatureList>
      </Content>
    </Wrapper>
  );
}
