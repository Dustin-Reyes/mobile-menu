/**
 * @module components/auth/Login
 * @description Full-page admin login screen that authenticates users via Firebase email/password
 * through the `AuthContext`. Displays a centered card with email and password fields, an inline
 * error message on failure, and a loading state on the submit button during sign-in.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useAuth } from 'context/AuthContext';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FormLabel = styled.label`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: ${(p) => p.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
  display: block;
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${(p) => p.theme.colors.background};
  background-image:
    linear-gradient(${(p) => p.theme.colors.border} 1px, transparent 1px),
    linear-gradient(90deg, ${(p) => p.theme.colors.border} 1px, transparent 1px);
  background-size: 40px 40px;

  @media (min-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding: 2rem 1rem;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s3};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.6s ease-out;
  backdrop-filter: blur(10px);

  @media (min-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding: 40px;
    gap: 24px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  padding-bottom: 20px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  @media (min-width: ${(p) => p.theme.breakpoints.tablet}) {
    padding-bottom: 24px;
  }
`;

const CenteredTitle = styled.h2`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;

  @media (min-width: ${(p) => p.theme.breakpoints.tablet}) {
    font-size: ${(p) => p.theme.typography.fontSizes.s5};
  }
`;

const ErrorMessage = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.error};
  padding: 12px;
  background: ${(p) =>
    p.theme.mode === 'dark'
      ? `${p.theme.colors.error}1a`
      : `${p.theme.colors.error}14`};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  border: 1px solid ${(p) => p.theme.colors.error}33;
  text-align: center;
`;

/**
 * AdminLogin component. Renders a full-page centered login card for the admin dashboard,
 * handling form state, submission, and error display.
 *
 * @returns {JSX.Element}
 */
export default function AdminLogin() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signIn(email, password);
    } catch {
      setError(t('admin.login.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <HeaderSection>
          <CenteredTitle>{t('admin.login.title')}</CenteredTitle>
        </HeaderSection>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>{t('admin.login.email')}</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('admin.login.emailPlaceholder')}
              autoComplete="username"
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>{t('admin.login.password')}</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('admin.login.passwordPlaceholder')}
              autoComplete="current-password"
              required
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={submitting}>
            {submitting ? t('admin.login.signingIn') : t('admin.login.signIn')}
          </Button>
        </Form>
      </Card>
    </Wrapper>
  );
}
