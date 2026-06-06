import { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import {
  Type,
  AlignLeft,
  Eye,
  MoreVertical,
  Tag,
  Heading2,
  Heading3,
  MousePointerClick,
  Mail,
  Phone,
  MapPin,
  List,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
} from 'lucide-react';
import Button from 'components/ui/Button';
import ConfirmDialog from '../shared/ConfirmDialog';
import { usePageEditor } from 'hooks/usePageEditor';
import { FaqItemsEditor } from './ContentFieldEditor';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSections(schema) {
  const seen = new Map();
  for (const field of schema?.fields ?? []) {
    if (field.group && !seen.has(field.group)) {
      seen.set(field.group, true);
    }
  }
  return Array.from(seen.keys());
}

function getFieldIcon(key, type) {
  const k = key.toLowerCase();
  if (k.includes('facebook')) return Facebook;
  if (k.includes('instagram')) return Instagram;
  if (k.includes('twitter')) return Twitter;
  if (k.includes('linkedin')) return Linkedin;
  if (k.includes('github')) return Github;
  if (k.includes('youtube')) return Youtube;
  if (k.includes('email')) return Mail;
  if (k.includes('phone')) return Phone;
  if (k.includes('address')) return MapPin;
  if (k.includes('badge')) return Tag;
  if (k.includes('cta') || k.endsWith('text')) return MousePointerClick;
  if (k.includes('items')) return List;
  if (k.includes('title') || k.includes('headline')) return Heading2;
  if (k.includes('subtitle') || k.includes('description')) return Heading3;
  return type === 'textarea' ? AlignLeft : Type;
}

// ─── Animations ──────────────────────────────────────────────────────────────

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 10rem);
  min-height: 0;
`;

const Placeholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const PageTitle = styled.h2`
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
  white-space: nowrap;
`;

const PublishedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s1};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  white-space: nowrap;
  flex-shrink: 0;
`;

const PageMeta = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.3);
  white-space: nowrap;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  color: rgba(255, 255, 255, 0.35);
  cursor: default;
  font-family: inherit;
  opacity: 0.6;
`;

const LocaleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`;

const LocaleLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.35);
  margin-right: 4px;
`;

const LocaleBarSpacer = styled.div`
  flex: 1;
`;

const TranslateBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  padding: 3px 10px;
  background: ${(p) => p.theme.colors.primary}1a;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}40;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  font-family: inherit;
  transition: all ${(p) => p.theme.transitions.fast};
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.primary}2a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LocaleTab = styled('button', {
  shouldForwardProp: (p) => p !== 'active',
})`
  padding: 3px 10px;
  border-radius: 5px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid
    ${(p) =>
      p.active ? `${p.theme.colors.primary}4d` : 'rgba(255,255,255,0.1)'};
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}40` : 'transparent'};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.4)'};
  font-family: inherit;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SectionTabBar = styled.div`
  display: flex;
  gap: 0;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SectionTab = styled('button', {
  shouldForwardProp: (p) => p !== 'active',
})`
  padding: 10px 14px;
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${(p) => (p.active ? p.theme.colors.primary : 'transparent')};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.4)'};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) =>
    p.active
      ? p.theme.typography.fontWeights.semibold
      : p.theme.typography.fontWeights.normal};
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s;
  font-family: inherit;
  margin-bottom: -1px;

  &:hover {
    color: ${(p) =>
      p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.7)'};
  }
`;

const FieldsArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 80px;
  min-height: 0;
`;

const FieldCard = styled.div`
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 12px 14px;
  margin-bottom: 10px;
`;

const FieldIconWrap = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 3px;
  color: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`;

const FieldBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
`;

const FieldInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  outline: none;
  transition: border-color 0.15s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 72px;
  resize: vertical;
  padding: 7px 10px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  outline: none;
  transition: border-color 0.15s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 200px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: ${(p) => p.theme.colors.background};
  z-index: 50;

  @media (max-width: 768px) {
    left: 0;
    bottom: 56px;
  }
`;

const ChangeStatus = styled('div', {
  shouldForwardProp: (p) => p !== 'dirty',
})`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => (p.dirty ? '#f59e0b' : 'rgba(255,255,255,0.3)')};
`;

const DirtyDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
`;

const Spinner = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  flex-shrink: 0;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PageEditor({ pageId }) {
  const {
    schema,
    formValues,
    hasChanges,
    selectedLocale,
    availableLocales,
    isLoading,
    isSaving,
    isTranslating,
    handleLocaleChange,
    handleFieldChange,
    handleSave,
    handleCancel,
    handleTranslateAll,
    handleTranslateLocale,
  } = usePageEditor(pageId);

  const [confirmTranslateOpen, setConfirmTranslateOpen] = useState(false);

  const sections = useMemo(() => (schema ? getSections(schema) : []), [schema]);
  const [activeSection, setActiveSection] = useState(() => sections[0] ?? null);

  const filteredFields = useMemo(
    () =>
      schema
        ? activeSection
          ? schema.fields.filter((f) => f.group === activeSection)
          : schema.fields
        : [],
    [schema, activeSection],
  );

  const busy = isLoading || isSaving || isTranslating;

  if (!schema) {
    return (
      <Container>
        <Placeholder>Select a page to start editing</Placeholder>
      </Container>
    );
  }

  const fieldCount = schema.fields.length;
  const localeCount = availableLocales.length;

  return (
    <>
      <ConfirmDialog
        open={confirmTranslateOpen}
        onOpenChange={setConfirmTranslateOpen}
        title="Translate all content?"
        description={`This will translate all content for "${schema.label}" into every non-English locale and save immediately. Existing translations will be overwritten.`}
        confirmLabel="Translate all"
        onConfirm={handleTranslateAll}
      />

      <Container>
        <Header>
          <TitleGroup>
            <PageTitle>{schema.label}</PageTitle>
            <PublishedBadge>Published</PublishedBadge>
            <PageMeta>
              {fieldCount} field{fieldCount !== 1 ? 's' : ''} &middot;{' '}
              {localeCount} locale{localeCount !== 1 ? 's' : ''}
            </PageMeta>
          </TitleGroup>
          <HeaderActions>
            <IconBtn title="Preview (coming soon)" aria-label="Preview">
              <Eye size={14} />
            </IconBtn>
            <IconBtn title="More options" aria-label="More options">
              <MoreVertical size={14} />
            </IconBtn>
          </HeaderActions>
        </Header>

        <LocaleBar>
          <LocaleLabel>Locale:</LocaleLabel>
          {availableLocales.map((locale) => (
            <LocaleTab
              key={locale}
              active={locale === selectedLocale}
              onClick={() => handleLocaleChange(locale)}
              disabled={busy}
            >
              {locale.toUpperCase()}
            </LocaleTab>
          ))}
          <LocaleBarSpacer />
          {selectedLocale === 'en' ? (
            <TranslateBtn
              onClick={() => setConfirmTranslateOpen(true)}
              disabled={busy}
              style={{ gap: 6 }}
            >
              {isTranslating ? (
                <>
                  <Spinner /> Translating…
                </>
              ) : (
                '✨ Translate all'
              )}
            </TranslateBtn>
          ) : (
            <TranslateBtn
              onClick={handleTranslateLocale}
              disabled={busy}
              style={{ gap: 6 }}
            >
              {isTranslating ? (
                <>
                  <Spinner /> Translating…
                </>
              ) : (
                '↺ Translate from EN'
              )}
            </TranslateBtn>
          )}
        </LocaleBar>

        <SectionTabBar>
          {sections.map((section) => (
            <SectionTab
              key={section}
              active={activeSection === section}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </SectionTab>
          ))}
        </SectionTabBar>

        <FieldsArea>
          {filteredFields.map((field) => {
            const FieldIcon = getFieldIcon(field.key, field.type);
            return (
              <FieldCard key={field.key}>
                <FieldIconWrap>
                  <FieldIcon size={14} />
                </FieldIconWrap>
                <FieldBody>
                  <FieldLabel htmlFor={`pf-${field.key}`}>
                    {field.label}
                  </FieldLabel>
                  {field.type === 'faq-items' ? (
                    <FaqItemsEditor
                      value={formValues[field.key] ?? []}
                      onChange={(arr) => handleFieldChange(field.key, arr)}
                      disabled={busy}
                    />
                  ) : field.type === 'textarea' ? (
                    <FieldTextarea
                      id={`pf-${field.key}`}
                      value={formValues[field.key] ?? ''}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                      disabled={busy}
                    />
                  ) : (
                    <FieldInput
                      id={`pf-${field.key}`}
                      value={formValues[field.key] ?? ''}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                      disabled={busy}
                    />
                  )}
                </FieldBody>
              </FieldCard>
            );
          })}
        </FieldsArea>

        <Footer>
          <ChangeStatus dirty={hasChanges}>
            {hasChanges && <DirtyDot />}
            {hasChanges ? 'Unsaved changes' : 'No unsaved changes'}
          </ChangeStatus>
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={!hasChanges || busy}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges || busy}
          >
            Save Changes
          </Button>
        </Footer>
      </Container>
    </>
  );
}
