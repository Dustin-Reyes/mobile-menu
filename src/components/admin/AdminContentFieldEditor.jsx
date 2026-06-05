import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';

// ─── Shared Atoms ───────────────────────────────────────────────────────────

const StyledTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;
  padding: 8px 12px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${(p) => p.theme.borderRadius.s1};
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const LocalePill = styled('button', {
  shouldForwardProp: (p) => p !== 'active',
})`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: ${(p) => p.theme.typography.fontSizes.s1};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  border: 1px solid
    ${(p) =>
      p.active ? `${p.theme.colors.primary}4d` : 'rgba(255,255,255,0.1)'};
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}40` : 'transparent'};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : 'rgba(255,255,255,0.5)'};
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

// ─── Helpers ────────────────────────────────────────────────────────────────

function groupFields(fields) {
  const groups = [];
  const seen = new Map();
  for (const field of fields) {
    const key = field.group ?? '__ungrouped__';
    if (!seen.has(key)) {
      seen.set(key, groups.length);
      groups.push({ group: field.group ?? null, fields: [] });
    }
    groups[seen.get(key)].fields.push(field);
  }
  return groups;
}

// ─── Desktop Editor Mode ─────────────────────────────────────────────────────

const EditorWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  padding: 16px 20px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`;

const PageTitle = styled.h2`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  margin: 0 0 2px;
  color: ${(p) => p.theme.colors.text};
`;

const PageMeta = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.35);
  margin: 0 0 12px;
`;

const LocaleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const TranslateBtn = styled(Button)`
  margin-left: auto;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  padding: 4px 10px;
`;

const FieldsScrollWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  position: relative;
`;

const ScrollFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${(p) => p.theme.colors.background}
  );
  pointer-events: none;
`;

const GroupLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s1};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.2);
  margin-top: 16px;
  margin-bottom: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const FieldCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  padding: 10px 12px;
  margin-bottom: 10px;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: ${(p) => p.theme.typography.fontSizes.s1};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 6px;
`;

const SaveBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: ${(p) => p.theme.colors.background};
  backdrop-filter: blur(8px);
  flex-shrink: 0;
`;

const UnsavedDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
`;

const SaveStatus = styled('span', {
  shouldForwardProp: (p) => p !== 'dirty',
})`
  flex: 1;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => (p.dirty ? '#f59e0b' : 'rgba(255,255,255,0.3)')};
`;

function DesktopEditor({
  schema,
  selectedSection,
  selectedLocale,
  availableLocales,
  formValues,
  isDirty,
  isLoading,
  isTranslating,
  onLocaleChange,
  onFieldChange,
  onSave,
  onCancel,
  onTranslateAll,
  onTranslateLocale,
}) {
  // Filter fields by selected section
  const filteredFields = selectedSection
    ? schema.fields.filter((field) => field.group === selectedSection)
    : schema.fields;

  const groups = groupFields(filteredFields);
  const fieldCount = filteredFields.length;
  const localeCount = availableLocales.length;

  return (
    <EditorWrap>
      <EditorHeader>
        <PageTitle>
          {schema.emoji} {schema.label}
        </PageTitle>
        <PageMeta>
          {fieldCount} field{fieldCount !== 1 ? 's' : ''} · {localeCount} locale
          {localeCount !== 1 ? 's' : ''}
        </PageMeta>
        <LocaleRow>
          {availableLocales.map((locale) => (
            <LocalePill
              key={locale}
              active={locale === selectedLocale}
              onClick={() => onLocaleChange(locale)}
              disabled={isLoading || isTranslating}
            >
              {locale.toUpperCase()}
            </LocalePill>
          ))}
          {selectedLocale === 'en' && (
            <TranslateBtn
              variant="ghost"
              onClick={onTranslateAll}
              disabled={isLoading || isTranslating}
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
          )}
          {selectedLocale !== 'en' && (
            <TranslateBtn
              variant="ghost"
              onClick={onTranslateLocale}
              disabled={isLoading || isTranslating}
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
        </LocaleRow>
      </EditorHeader>

      <FieldsScrollWrapper>
        {groups.map(({ group, fields }) => (
          <div key={group ?? '__ungrouped__'}>
            {group && <GroupLabel>{group}</GroupLabel>}
            {fields.map((field) => (
              <FieldCard key={field.key}>
                <FieldLabel htmlFor={`field-${field.key}`}>
                  {field.label}
                </FieldLabel>
                {field.type === 'textarea' ? (
                  <StyledTextarea
                    id={`field-${field.key}`}
                    aria-label={field.label}
                    value={formValues[field.key] ?? ''}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    disabled={isLoading}
                  />
                ) : (
                  <Input
                    id={`field-${field.key}`}
                    aria-label={field.label}
                    value={formValues[field.key] ?? ''}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    disabled={isLoading}
                  />
                )}
              </FieldCard>
            ))}
          </div>
        ))}
        <ScrollFade />
      </FieldsScrollWrapper>

      <SaveBar>
        {isDirty && <UnsavedDot />}
        <SaveStatus dirty={isDirty}>
          {isDirty ? 'Unsaved changes' : 'No unsaved changes'}
        </SaveStatus>
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={!isDirty || isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          disabled={!isDirty || isLoading}
        >
          Save Changes
        </Button>
      </SaveBar>
    </EditorWrap>
  );
}

// ─── Mobile Fields Mode (Screen 2) ───────────────────────────────────────────

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.primary};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MobileTitle = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
`;

const StickyLocaleRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
`;

const FieldRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const FieldRowLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const FieldRowName = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 2px;
`;

const FieldRowPreview = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function MobileFieldList({
  schema,
  selectedSection,
  selectedLocale,
  availableLocales,
  formValues,
  allLocaleContent,
  onLocaleChange,
  onSelectField,
  onSelectSection,
  onBack,
}) {
  // Filter fields by selected section
  const filteredFields = selectedSection
    ? schema.fields.filter((field) => field.group === selectedSection)
    : schema.fields;

  // Extract unique sections
  const sections = React.useMemo(() => {
    const sectionSet = new Set();
    schema.fields.forEach((field) => {
      if (field.group) sectionSet.add(field.group);
    });
    return Array.from(sectionSet).sort();
  }, [schema.fields]);

  const values = allLocaleContent[selectedLocale] ?? formValues ?? {};
  return (
    <div>
      <MobileHeader>
        <BackBtn onClick={onBack}>‹ Back</BackBtn>
        <MobileTitle>
          {schema.emoji} {schema.label}
        </MobileTitle>
      </MobileHeader>
      <StickyLocaleRow>
        {availableLocales.map((locale) => (
          <LocalePill
            key={locale}
            active={locale === selectedLocale}
            onClick={() => onLocaleChange(locale)}
          >
            {locale.toUpperCase()}
          </LocalePill>
        ))}
      </StickyLocaleRow>
      {sections.length > 0 && (
        <StickyLocaleRow>
          <LocalePill
            active={!selectedSection}
            onClick={() => onSelectSection(null)}
          >
            All
          </LocalePill>
          {sections.map((section) => (
            <LocalePill
              key={section}
              active={selectedSection === section}
              onClick={() => onSelectSection(section)}
            >
              {section}
            </LocalePill>
          ))}
        </StickyLocaleRow>
      )}
      {filteredFields.map((field) => (
        <FieldRow key={field.key} onClick={() => onSelectField(field.key)}>
          <FieldRowLeft>
            <FieldRowName>{field.label}</FieldRowName>
            <FieldRowPreview>{values[field.key] ?? '—'}</FieldRowPreview>
          </FieldRowLeft>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>
            ›
          </span>
        </FieldRow>
      ))}
    </div>
  );
}

// ─── Mobile Field Edit Mode (Screen 3) ───────────────────────────────────────

const FieldEditWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FieldEditContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const SectionTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s1};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.25);
  margin-bottom: 8px;
`;

const SavedPreview = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  padding: 10px 12px;
  margin-bottom: 16px;
  min-height: 36px;
`;

const OtherLocaleItem = styled.div`
  margin-bottom: 12px;
`;

const OtherLocaleCode = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s0};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
  margin-bottom: 4px;
`;

const OtherLocaleValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.4);
`;

const FieldEditBar = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

function MobileFieldEdit({
  schema,
  selectedField,
  selectedLocale,
  availableLocales,
  allLocaleContent,
  onBack,
  onFieldSave,
}) {
  const fieldDef = schema.fields.find((f) => f.key === selectedField);
  const currentSaved = allLocaleContent[selectedLocale]?.[selectedField] ?? '';
  const [inputValue, setInputValue] = useState(currentSaved);

  useEffect(() => {
    setInputValue(currentSaved);
  }, [selectedField, selectedLocale, currentSaved]);

  if (!fieldDef) return null;

  const otherLocales = availableLocales.filter((l) => l !== selectedLocale);

  return (
    <FieldEditWrap>
      <MobileHeader>
        <BackBtn onClick={onBack}>‹ Back</BackBtn>
        <MobileTitle>{fieldDef.label}</MobileTitle>
      </MobileHeader>

      <FieldEditContent>
        <SectionTitle>Current saved value</SectionTitle>
        <SavedPreview>{currentSaved || '—'}</SavedPreview>

        <SectionTitle>Edit</SectionTitle>
        {fieldDef.type === 'textarea' ? (
          <StyledTextarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ marginBottom: 16 }}
          />
        )}

        {otherLocales.length > 0 && (
          <>
            <SectionTitle>Other locales</SectionTitle>
            {otherLocales.map((locale) => (
              <OtherLocaleItem key={locale}>
                <OtherLocaleCode>{locale.toUpperCase()}</OtherLocaleCode>
                <OtherLocaleValue>
                  {allLocaleContent[locale]?.[selectedField] ?? '—'}
                </OtherLocaleValue>
              </OtherLocaleItem>
            ))}
          </>
        )}
      </FieldEditContent>

      <FieldEditBar>
        <Button variant="ghost" onClick={onBack} style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => onFieldSave(selectedField, inputValue)}
          style={{ flex: 2 }}
        >
          Save
        </Button>
      </FieldEditBar>
    </FieldEditWrap>
  );
}

// ─── Public Export ───────────────────────────────────────────────────────────

export function ContentFieldEditor({ mode, ...props }) {
  if (mode === 'fields') return <MobileFieldList {...props} />;
  if (mode === 'field-edit') return <MobileFieldEdit {...props} />;
  return <DesktopEditor {...props} />;
}
