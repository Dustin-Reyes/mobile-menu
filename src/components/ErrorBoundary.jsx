import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/react';

// ─── Styled components ────────────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: ${(props) => props.theme.colors.background};
  font-family: ${(props) => props.theme.typography.fontFamilies.sans};
`;

const Card = styled.div`
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes.s8};
  color: ${(props) => props.theme.colors.error};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.s5};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  line-height: ${(props) => props.theme.typography.lineHeights.relaxed};
`;

const DetailsBox = styled.details`
  text-align: left;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.s2};
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: ${(props) => props.theme.typography.fontSizes.s5};
`;

const DetailsSummary = styled.summary`
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const DetailsContent = styled.div`
  white-space: pre-wrap;
  color: ${(props) => props.theme.colors.error};
  font-family: ${(props) => props.theme.typography.fontFamilies.mono};
  font-size: ${(props) => props.theme.typography.fontSizes.s5};
  overflow: auto;
  max-height: 200px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.onPrimary};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.s2};
  font-size: ${(props) => props.theme.typography.fontSizes.s4};
  cursor: pointer;
  transition: background ${(props) => props.theme.transitions.base};

  &:hover {
    background: ${(props) => props.theme.colors.primary}dd;
  }
`;

const SecondaryButton = styled.button`
  background: ${(props) => props.theme.colors.textSecondary};
  color: ${(props) => props.theme.colors.onPrimary};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.s2};
  font-size: ${(props) => props.theme.typography.fontSizes.s4};
  cursor: pointer;
  transition: background ${(props) => props.theme.transitions.base};

  &:hover {
    background: ${(props) => props.theme.colors.textSecondary}dd;
  }
`;

const Footer = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.s5};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 1.5rem;
`;

// ─── ErrorFallback ────────────────────────────────────────────────────────────

function ErrorFallback({ error, errorInfo, onRetry }) {
  const { t } = useTranslation();

  return (
    <Container>
      <Card>
        <Title>{t('error.boundary.title')}</Title>

        <Message>{t('error.boundary.message')}</Message>

        {import.meta.env.DEV && error && (
          <DetailsBox>
            <DetailsSummary>Error Details (Development Only)</DetailsSummary>
            <DetailsContent>
              {error.toString()}
              {errorInfo && errorInfo.componentStack}
            </DetailsContent>
          </DetailsBox>
        )}

        <ButtonGroup>
          <PrimaryButton onClick={onRetry}>{t('common.retry')}</PrimaryButton>
          <SecondaryButton onClick={() => window.location.reload()}>
            {t('common.reload')}
          </SecondaryButton>
        </ButtonGroup>

        <Footer>{t('error.boundary.footer')}</Footer>
      </Card>
    </Container>
  );
}

// ─── ErrorBoundary ────────────────────────────────────────────────────────────

/**
 * Catches JavaScript errors anywhere in the child component tree, reports them
 * to Sentry, and displays a fallback UI instead of crashing the whole app.
 *
 * Props:
 *   fallback  — optional React element to render instead of the default UI
 *   children  — the component subtree to protect
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
