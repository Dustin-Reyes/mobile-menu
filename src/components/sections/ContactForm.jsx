import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Loader2, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import Button from 'components/ui/Button';

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PrivacyRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  padding-top: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const PrivacyNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex: 1;
`;

const PrivacyIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
`;

const PrivacyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0;
`;

const PrivacyLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s1};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  background: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-family: inherit;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.secondaryBackground};
    box-shadow: 0 0 0 3px
      ${({ theme }) =>
        theme.mode === 'dark'
          ? `${theme.colors.primary}22`
          : `${theme.colors.primary}15`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.colors.error};
    &:focus {
      box-shadow: 0 0 0 3px ${theme.colors.error}26;
    }
  `}
`;

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  background: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-family: inherit;
  resize: vertical;
  min-height: 140px;
  line-height: 1.6;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.secondaryBackground};
    box-shadow: 0 0 0 3px
      ${({ theme }) =>
        theme.mode === 'dark'
          ? `${theme.colors.primary}22`
          : `${theme.colors.primary}15`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.colors.error};
    &:focus {
      box-shadow: 0 0 0 3px ${theme.colors.error}26;
    }
  `}
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.error};
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const SuccessBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.success}26;
  border: 1px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
`;

const SuccessIcon = styled.div`
  color: ${({ theme }) => theme.colors.success};
  flex-shrink: 0;
`;

const SuccessText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  line-height: 1.5;
`;

const SpinnerIcon = styled(Loader2)`
  animation: ${spinAnimation} 1s linear infinite;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contactForm.errors.nameRequired', 'Name is required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t(
        'contactForm.errors.emailRequired',
        'Email is required',
      );
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t(
        'contactForm.errors.emailInvalid',
        'Email is invalid',
      );
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t(
        'contactForm.errors.subjectRequired',
        'Subject is required',
      );
    }

    if (!formData.message.trim()) {
      newErrors.message = t(
        'contactForm.errors.messageRequired',
        'Message is required',
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    // In production, this would send to your backend/API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {isSubmitted && (
        <SuccessBanner>
          <SuccessIcon>
            <CheckCircle2 size={20} aria-hidden="true" />
          </SuccessIcon>
          <SuccessText>
            {t(
              'contactForm.success',
              'Thank you for your message! We will get back to you soon.',
            )}
          </SuccessText>
        </SuccessBanner>
      )}

      <FormRow>
        <FormGroup>
          <Label htmlFor="name">
            {t('contactForm.name', 'Name')} <Required>*</Required>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('contactForm.namePlaceholder', 'Your name')}
            error={errors.name}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">
            {t('contactForm.email', 'Email')} <Required>*</Required>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('contactForm.emailPlaceholder', 'your@email.com')}
            error={errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label htmlFor="subject">
          {t('contactForm.subject', 'Subject')} <Required>*</Required>
        </Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t('contactForm.subjectPlaceholder', 'How can we help?')}
          error={errors.subject}
        />
        {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="message">
          {t('contactForm.message', 'Message')} <Required>*</Required>
        </Label>
        <TextArea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t(
            'contactForm.messagePlaceholder',
            'Tell us more about your project...',
          )}
          error={errors.message}
        />
        {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
      </FormGroup>

      <PrivacyRow>
        <PrivacyNote>
          <PrivacyIcon>
            <ShieldCheck size={16} aria-hidden="true" />
          </PrivacyIcon>
          <PrivacyText>
            {t('contact.privacy')}{' '}
            <PrivacyLink href="#" onClick={(e) => e.preventDefault()}>
              {t('contact.privacyPolicy')}
            </PrivacyLink>
          </PrivacyText>
        </PrivacyNote>

        <Button
          type="submit"
          disabled={isSubmitting}
          style={{ height: '48px' }}
        >
          {isSubmitting ? (
            <ButtonContent>
              <SpinnerIcon size={18} aria-hidden="true" />
              {t('contactForm.sending', 'Sending...')}
            </ButtonContent>
          ) : (
            <ButtonContent>
              {t('contactForm.send', 'Send Message')}
              <Send size={16} aria-hidden="true" />
            </ButtonContent>
          )}
        </Button>
      </PrivacyRow>
    </Form>
  );
}

const Required = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: 0.25rem;
`;
