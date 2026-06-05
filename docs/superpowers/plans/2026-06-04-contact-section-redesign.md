# Contact Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Contact section to match the new dark-card design with amber icon accents, a 2-column Name+Email row, and a privacy footer in the form.

**Architecture:** Surgical edits to four files — no new files created. `Contact.jsx` gets a theme-aware info panel replacing the purple gradient. `ContactForm.jsx` gets a `FormRow` wrapper for Name+Email and a `PrivacyRow` footer. Both locale files get a new `contact` i18n namespace.

**Tech Stack:** React 18, Emotion CSS-in-JS (`@emotion/styled`), lucide-react icons, react-i18next

---

## File Map

| File | Change |
|---|---|
| `src/i18n/locales/en.json` | Add `contact` namespace keys |
| `src/i18n/locales/es.json` | Add `contact` namespace keys (Spanish) |
| `src/components/sections/Contact.jsx` | Restyle InfoPanel; amber icons; remove social links; add `Send` icon header; wire `t()` |
| `src/components/sections/ContactForm.jsx` | Add `FormRow` for Name+Email; add `PrivacyRow` with `ShieldCheck` + privacy note; move `Button` inside `PrivacyRow`; add `Send` icon on button |

---

## Task 1: Add i18n keys

**Files:**
- Modify: `src/i18n/locales/en.json`
- Modify: `src/i18n/locales/es.json`

- [ ] **Step 1: Add `contact` key to en.json**

In `src/i18n/locales/en.json`, add after the closing `}` of the `"home"` block and before `"nav"`:

```json
  "contact": {
    "getInTouch": "Get in touch",
    "getInTouchSubtitle": "Have a question or want to work together? Reach out and let's make it happen.",
    "privacy": "We'll never share your information.",
    "privacyPolicy": "View our Privacy Policy"
  },
```

The file should have keys in this order at the root level: `language`, `home`, `contact`, `nav`, `footer`, `admin`, `common`.

- [ ] **Step 2: Add `contact` key to es.json**

In `src/i18n/locales/es.json`, add the same block in the same position:

```json
  "contact": {
    "getInTouch": "Contáctanos",
    "getInTouchSubtitle": "¿Tienes alguna pregunta o quieres trabajar juntos? Escríbenos y hagámoslo realidad.",
    "privacy": "Nunca compartiremos tu información.",
    "privacyPolicy": "Ver nuestra Política de Privacidad"
  },
```

- [ ] **Step 3: Verify JSON is valid**

```bash
cd /Users/joshua/Development/transpiled-web-template
node -e "require('./src/i18n/locales/en.json'); console.log('en OK')"
node -e "require('./src/i18n/locales/es.json'); console.log('es OK')"
```

Expected output:
```
en OK
es OK
```

- [ ] **Step 4: Format and lint**

```bash
yarn format && yarn lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/locales/en.json src/i18n/locales/es.json
git commit -m "feat(i18n): add contact namespace for panel and privacy note strings"
```

---

## Task 2: Rewrite Contact.jsx

**Files:**
- Modify: `src/components/sections/Contact.jsx`

- [ ] **Step 1: Replace the full file contents**

Replace the entire contents of `src/components/sections/Contact.jsx` with:

```jsx
import styled from '@emotion/styled';
import { usePage } from 'hooks/useContent';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import ContactForm from './ContactForm';

// ─── Layout ───────────────────────────────────────────────────────────────────

const Wrapper = styled.section`
  min-height: min(100vh, 1080px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.surface : theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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
  max-width: 600px;
  margin: 0 auto;
`;

const ContactLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`;

// ─── Left Panel (Contact Info) ─────────────────────────────────────────────────

const InfoPanel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  padding: 3rem;
`;

const PanelIconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  background: ${({ theme }) => `${theme.colors.primary}22`};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const PanelHeader = styled.div`
  margin-bottom: 2rem;
`;

const PanelTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.s5};
  font-weight: ${({ theme }) => theme.typography.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const PanelSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const ContactItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateX(4px);
    background: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const ContactItemStatic = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.s2};
  background: ${({ theme }) => `${theme.colors.primary}22`};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ContactText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ContactLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s2};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

const ContactValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

// ─── Right Panel (Form) ───────────────────────────────────────────────────────

const FormPanel = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.colors.surface : '#fff'};
  border-radius: ${({ theme }) => theme.borderRadius.s3};
  padding: 3rem;
  border: 1px solid
    ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Contact() {
  const { t } = useTranslation();
  const { content: homeContent, loading: homeLoading } = usePage('home');
  const { content: siteContent } = usePage('site');

  const title =
    homeContent?.contact?.title ?? (homeLoading ? null : 'Contact Us');
  const subtitle =
    homeContent?.contact?.subtitle ??
    (homeLoading ? null : 'Get in touch with our team');

  const footer = siteContent?.footer ?? {};

  return (
    <Wrapper id="contact">
      <Container>
        <SectionHeader>
          {homeLoading ? (
            <div style={{ height: '40px', marginBottom: '1rem' }} />
          ) : (
            <SectionTitle>{title}</SectionTitle>
          )}
          {homeLoading ? (
            <div
              style={{ height: '24px', maxWidth: '400px', margin: '0 auto' }}
            />
          ) : (
            <SectionSubtitle>{subtitle}</SectionSubtitle>
          )}
        </SectionHeader>

        <ContactLayout>
          {/* Left Panel - Contact Info */}
          <InfoPanel>
            <PanelIconBox>
              <Send size={20} />
            </PanelIconBox>
            <PanelHeader>
              <PanelTitle>{t('contact.getInTouch')}</PanelTitle>
              <PanelSubtitle>{t('contact.getInTouchSubtitle')}</PanelSubtitle>
            </PanelHeader>

            <ContactItems>
              {footer.contactEmail && (
                <ContactItem href={`mailto:${footer.contactEmail}`}>
                  <IconWrapper>
                    <Mail size={18} />
                  </IconWrapper>
                  <ContactText>
                    <ContactLabel>Email</ContactLabel>
                    <ContactValue>{footer.contactEmail}</ContactValue>
                  </ContactText>
                </ContactItem>
              )}

              {footer.contactPhone && (
                <ContactItem href={`tel:${footer.contactPhone}`}>
                  <IconWrapper>
                    <Phone size={18} />
                  </IconWrapper>
                  <ContactText>
                    <ContactLabel>Phone</ContactLabel>
                    <ContactValue>{footer.contactPhone}</ContactValue>
                  </ContactText>
                </ContactItem>
              )}

              {footer.address && (
                <ContactItemStatic>
                  <IconWrapper>
                    <MapPin size={18} />
                  </IconWrapper>
                  <ContactText>
                    <ContactLabel>Address</ContactLabel>
                    <ContactValue style={{ whiteSpace: 'pre-line' }}>
                      {footer.address}
                    </ContactValue>
                  </ContactText>
                </ContactItemStatic>
              )}
            </ContactItems>
          </InfoPanel>

          {/* Right Panel - Form */}
          <FormPanel>
            <ContactForm />
          </FormPanel>
        </ContactLayout>
      </Container>
    </Wrapper>
  );
}
```

- [ ] **Step 2: Format and lint**

```bash
yarn format && yarn lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.jsx
git commit -m "feat(contact): restyle info panel — amber icons, theme-aware card, remove social links"
```

---

## Task 3: Update ContactForm.jsx

**Files:**
- Modify: `src/components/sections/ContactForm.jsx`

- [ ] **Step 1: Update the lucide-react import**

Change line 4 from:

```js
import { Loader2, CheckCircle2 } from 'lucide-react';
```

to:

```js
import { Loader2, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
```

- [ ] **Step 2: Add FormRow styled component**

Add `FormRow` after the `FormGroup` styled component (after line 19):

```js
const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;
```

- [ ] **Step 3: Add PrivacyRow styled components**

Add these four styled components after `FormRow`:

```js
const PrivacyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
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
```

- [ ] **Step 4: Update the JSX — wrap Name + Email in FormRow**

In the `return` block, replace the two consecutive `<FormGroup>` elements for `name` and `email` (currently separate siblings of `<Form>`) with a single `<FormRow>` wrapping both:

Replace:
```jsx
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
```

With:
```jsx
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
```

- [ ] **Step 5: Replace bottom Button with PrivacyRow**

Replace the final `<Button>` block (currently a direct child of `<Form>`):

```jsx
      <Button
        type="submit"
        disabled={isSubmitting}
        style={{ width: '100%', height: '48px' }}
      >
        {isSubmitting ? (
          <>
            <Loader2
              size={18}
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <span style={{ marginLeft: '0.5rem' }}>
              {t('contactForm.sending', 'Sending...')}
            </span>
          </>
        ) : (
          t('contactForm.send', 'Send Message')
        )}
      </Button>
```

With:
```jsx
      <PrivacyRow>
        <PrivacyNote>
          <PrivacyIcon>
            <ShieldCheck size={16} />
          </PrivacyIcon>
          <PrivacyText>
            {t('contact.privacy')}{' '}
            <PrivacyLink href="#">
              {t('contact.privacyPolicy')}
            </PrivacyLink>
          </PrivacyText>
        </PrivacyNote>

        <Button type="submit" disabled={isSubmitting} style={{ height: '48px' }}>
          {isSubmitting ? (
            <>
              <Loader2
                size={18}
                style={{ animation: 'spin 1s linear infinite' }}
              />
              <span style={{ marginLeft: '0.5rem' }}>
                {t('contactForm.sending', 'Sending...')}
              </span>
            </>
          ) : (
            <>
              {t('contactForm.send', 'Send Message')}
              <Send size={16} style={{ marginLeft: '0.5rem' }} />
            </>
          )}
        </Button>
      </PrivacyRow>
```

- [ ] **Step 6: Format and lint**

```bash
yarn format && yarn lint
```

Expected: no errors.

- [ ] **Step 7: Run tests**

```bash
yarn test
```

Expected: all tests pass (no tests exist for these UI components — this is a smoke check that nothing else broke).

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/ContactForm.jsx
git commit -m "feat(contact): add FormRow for Name+Email, PrivacyRow footer with Send icon"
```

---

## Task 4: Visual verification

- [ ] **Step 1: Start the dev server**

```bash
./dev.sh
```

Open `http://localhost:5173` and scroll to the Contact section.

- [ ] **Step 2: Check dark mode**

Verify:
- Info panel has a dark card background (not purple gradient)
- Email, Phone, Address icons are amber rounded squares (not white circles)
- "Get in touch" title and subtitle are readable (theme text color, not white)
- Send icon appears in the amber header box above "Get in touch"

- [ ] **Step 3: Check light mode**

Toggle to light mode. Verify:
- Info panel background lightens to `#F5F5F5`
- Amber icon containers still visible on light background
- Text is dark, readable

- [ ] **Step 4: Check form layout (desktop)**

At `>768px` width:
- Name and Email appear side-by-side in one row
- Subject and Message are full-width below
- Privacy note (ShieldCheck + text + amber link) appears on the left
- "Send Message" button with Send icon appears on the right, same row

- [ ] **Step 5: Check form layout (mobile)**

Resize browser to `<768px`:
- Name and Email stack vertically
- Privacy note stacks above the Send button
- Send button is full-width

- [ ] **Step 6: Check language switch**

Toggle language to Spanish (ES):
- "Get in touch" → "Contáctanos"
- Panel subtitle → "¿Tienes alguna pregunta..."
- Privacy note → "Nunca compartiremos tu información."
- Privacy link → "Ver nuestra Política de Privacidad"
- Form labels switch to Spanish (these already worked — confirm no regression)

- [ ] **Step 7: Check no social links**

Confirm the social links row is gone from the info panel.

- [ ] **Step 8: Final quality pass**

```bash
yarn format && yarn lint && yarn test
```

Expected: all pass.
