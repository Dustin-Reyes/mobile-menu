import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Send } from 'lucide-react';
import UILabel from 'components/Label';
import UIInput from 'components/Input';
import Button from 'components/Button';

const ContactFormContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.s7} ${({ theme }) => theme.spacing.s4};
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.s5}
      ${({ theme }) => theme.spacing.s2};
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.s7};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  color: ${({ theme }) => theme.colors.black};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s7};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s6};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s5};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.s6};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.s4};
    margin-bottom: ${({ theme }) => theme.spacing.s5};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.s3};
  }
`;

const Form = styled.form`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.s5};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  box-shadow: ${({ theme }) => theme.shadows.s4};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.s3};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.s3};
  margin-bottom: ${({ theme }) => theme.spacing.s3};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.s2};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s1};

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const StyledLabel = styled(UILabel)`
  font-size: ${({ theme }) => theme.fontSizes.s3};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.black};
`;

const StyledInput = styled(UIInput)`
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.black};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.white};
    box-shadow: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.s2};
  font-size: ${({ theme }) => theme.fontSizes.s3};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.black};
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.white};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.s3};
  font-size: ${({ theme }) => theme.fontSizes.s4};
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  gap: ${({ theme }) => theme.spacing.s2};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.s3};
    opacity: 1;
  }
`;

const FormFeedback = styled('div', {
  shouldForwardProp: (p) => p !== 'isError',
})`
  padding: ${({ theme }) => theme.spacing.s3};
  background: ${({ theme, isError }) =>
    isError ? theme.colors.error : theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.s4};
  margin-top: ${({ theme }) => theme.spacing.s3};
`;

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
};

const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

function ContactFormSection() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const resetTimerRef = useRef(null);

  // Clear the reset timer if the component unmounts while it's pending
  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasError(false);
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...formData }),
      });
      setIsSubmitted(true);
      resetTimerRef.current = setTimeout(() => {
        setFormData(EMPTY_FORM);
        setIsSubmitted(false);
      }, 3000);
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactFormContainer id="contact-form">
      <Container>
        <SectionTitle>Get Your Free Quote</SectionTitle>
        <SectionSubtitle>
          Fill out the form below and we&apos;ll get back to you within 24 hours
        </SectionSubtitle>
        <Form onSubmit={handleSubmit} name="contact" data-netlify="true">
          {/* Required by Netlify to identify the form on static prerender */}
          <input type="hidden" name="form-name" value="contact" />
          <FormGrid>
            <FormGroup>
              <StyledLabel htmlFor="name">Full Name *</StyledLabel>
              <StyledInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </FormGroup>
            <FormGroup>
              <StyledLabel htmlFor="email">Email *</StyledLabel>
              <StyledInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </FormGroup>
            <FormGroup>
              <StyledLabel htmlFor="phone">Phone Number *</StyledLabel>
              <StyledInput
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                required
              />
            </FormGroup>
            <FormGroup>
              <StyledLabel htmlFor="projectType">Project Type *</StyledLabel>
              <StyledInput
                type="text"
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                placeholder="Residential, Commercial, etc."
                required
              />
            </FormGroup>
            <FormGroup className="full-width">
              <StyledLabel htmlFor="message">Project Details *</StyledLabel>
              <StyledTextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your demolition project..."
                required
              />
            </FormGroup>
          </FormGrid>
          <StyledButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
            {!isSubmitting && <Send size={20} />}
          </StyledButton>
          {isSubmitted && (
            <FormFeedback>Thank you! We&apos;ll be in touch soon.</FormFeedback>
          )}
          {hasError && (
            <FormFeedback isError>
              Something went wrong. Please try again.
            </FormFeedback>
          )}
        </Form>
      </Container>
    </ContactFormContainer>
  );
}

export default ContactFormSection;
