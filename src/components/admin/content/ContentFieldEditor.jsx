/**
 * Field-level editing components for CMS content, covering desktop and mobile modes,
 * FAQ items, and service items.
 * @module components/admin/content/ContentFieldEditor
 */

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
  border: 1px solid ${(p) => p.theme.colors.border};
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
    ${(p) => (p.active ? `${p.theme.colors.primary}4d` : p.theme.colors.border)};
  background: ${(p) =>
    p.active ? `${p.theme.colors.primary}40` : 'transparent'};
  color: ${(p) =>
    p.active ? p.theme.colors.primary : p.theme.colors.textSecondary};
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

// ─── FAQ Items Editor ────────────────────────────────────────────────────────

const FaqItemCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 5px;
  padding: 10px 12px;
  margin-bottom: 8px;
`;

const FaqItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const FaqItemFields = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FaqItemLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s0};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.textMuted};
  display: block;
  margin-bottom: 3px;
`;

const RemoveItemBtn = styled.button`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 4px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  margin-top: 2px;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.error}80;
    color: ${(p) => p.theme.colors.error};
    background: ${(p) => p.theme.colors.error}14;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const AddItemBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px dashed ${(p) => p.theme.colors.secondaryBorder};
  border-radius: 5px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  cursor: pointer;
  width: 100%;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.primary}60;
    color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primary}0d;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/**
 * Editable list of FAQ question-and-answer pairs.
 * @param {Object} props
 * @param {Array<{question: string, answer: string}>} props.value - Current array of FAQ items.
 * @param {function} props.onChange - Callback invoked with the updated items array.
 * @param {boolean} [props.disabled] - Disables all inputs and buttons when true.
 * @param {number} [props.maxItems] - Maximum number of items allowed.
 * @returns {JSX.Element}
 */
export function FaqItemsEditor({ value, onChange, disabled, maxItems }) {
  const items = Array.isArray(value) ? value : [];
  const atLimit = maxItems != null && items.length >= maxItems;

  const updateItem = (index, field, text) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: text } : item,
    );
    onChange(updated);
  };

  const addItem = () => {
    onChange([...items, { question: '', answer: '' }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      {items.map((item, index) => (
        <FaqItemCard key={index}>
          <FaqItemRow>
            <FaqItemFields>
              <div>
                <FaqItemLabel>Question</FaqItemLabel>
                <Input
                  value={item.question ?? ''}
                  onChange={(e) =>
                    updateItem(index, 'question', e.target.value)
                  }
                  disabled={disabled}
                  placeholder="Enter question…"
                />
              </div>
              <div>
                <FaqItemLabel>Answer</FaqItemLabel>
                <StyledTextarea
                  value={item.answer ?? ''}
                  onChange={(e) => updateItem(index, 'answer', e.target.value)}
                  disabled={disabled}
                  placeholder="Enter answer…"
                  style={{ minHeight: 60 }}
                />
              </div>
            </FaqItemFields>
            <RemoveItemBtn
              onClick={() => removeItem(index)}
              disabled={disabled}
              title="Remove item"
              aria-label="Remove FAQ item"
            >
              ×
            </RemoveItemBtn>
          </FaqItemRow>
        </FaqItemCard>
      ))}
      <AddItemBtn onClick={addItem} disabled={disabled || atLimit}>
        {atLimit ? `Max ${maxItems} items reached` : '＋ Add FAQ Item'}
      </AddItemBtn>
    </div>
  );
}

// ─── Service Items Editor ─────────────────────────────────────────────────────

/**
 * Editable list of service title-and-description pairs.
 * @param {Object} props
 * @param {Array<{title: string, description: string}>} props.value - Current array of service items.
 * @param {function} props.onChange - Callback invoked with the updated items array.
 * @param {boolean} [props.disabled] - Disables all inputs and buttons when true.
 * @param {number} [props.maxItems] - Maximum number of items allowed.
 * @returns {JSX.Element}
 */
export function ServiceItemsEditor({ value, onChange, disabled, maxItems }) {
  const items = Array.isArray(value) ? value : [];
  const atLimit = maxItems != null && items.length >= maxItems;

  const updateItem = (index, field, text) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: text } : item,
    );
    onChange(updated);
  };

  const addItem = () => {
    onChange([...items, { title: '', description: '' }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      {items.map((item, index) => (
        <FaqItemCard key={index}>
          <FaqItemRow>
            <FaqItemFields>
              <div>
                <FaqItemLabel>Title</FaqItemLabel>
                <Input
                  value={item.title ?? ''}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  disabled={disabled}
                  placeholder="Service name…"
                />
              </div>
              <div>
                <FaqItemLabel>Description</FaqItemLabel>
                <StyledTextarea
                  value={item.description ?? ''}
                  onChange={(e) =>
                    updateItem(index, 'description', e.target.value)
                  }
                  disabled={disabled}
                  placeholder="Short description…"
                  style={{ minHeight: 60 }}
                />
              </div>
            </FaqItemFields>
            <RemoveItemBtn
              onClick={() => removeItem(index)}
              disabled={disabled}
              title="Remove item"
              aria-label="Remove service item"
            >
              ×
            </RemoveItemBtn>
          </FaqItemRow>
        </FaqItemCard>
      ))}
      <AddItemBtn onClick={addItem} disabled={disabled || atLimit}>
        {atLimit ? `Max ${maxItems} items reached` : '＋ Add Service Item'}
      </AddItemBtn>
    </div>
  );
}

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
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
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
  color: ${(p) => p.theme.colors.textMuted};
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
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 16px;
  margin-bottom: 8px;
  padding-top: 12px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const FieldCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
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
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 6px;
`;

const SaveBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  backdrop-filter: blur(8px);
  flex-shrink: 0;
`;

const UnsavedDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.warning};
  flex-shrink: 0;
`;

const SaveStatus = styled('span', {
  shouldForwardProp: (p) => p !== 'dirty',
})`
  flex: 1;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) =>
    p.dirty ? p.theme.colors.warning : p.theme.colors.textMuted};
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
                {field.type === 'faq-items' ? (
                  <FaqItemsEditor
                    value={formValues[field.key] ?? []}
                    onChange={(arr) => onFieldChange(field.key, arr)}
                    disabled={isLoading}
                    maxItems={field.maxItems}
                  />
                ) : field.type === 'service-items' ? (
                  <ServiceItemsEditor
                    value={formValues[field.key] ?? []}
                    onChange={(arr) => onFieldChange(field.key, arr)}
                    disabled={isLoading}
                    maxItems={field.maxItems}
                  />
                ) : field.type === 'textarea' ? (
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
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
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
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
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
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:hover {
    background: ${(p) => p.theme.colors.surface};
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
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileFieldChevron = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 1rem;
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
            <FieldRowPreview>
              {field.type === 'faq-items' || field.type === 'service-items'
                ? `${(values[field.key] ?? []).length} item${(values[field.key] ?? []).length !== 1 ? 's' : ''}`
                : (values[field.key] ?? '—')}
            </FieldRowPreview>
          </FieldRowLeft>
          <MobileFieldChevron>›</MobileFieldChevron>
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
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 8px;
`;

const SavedPreview = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textSecondary};
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
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
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 4px;
`;

const OtherLocaleValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
`;

const FieldEditBar = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
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
  const isFaqItems = fieldDef?.type === 'faq-items';
  const isServiceItems = fieldDef?.type === 'service-items';
  const isArrayField = isFaqItems || isServiceItems;
  const currentSaved =
    allLocaleContent[selectedLocale]?.[selectedField] ??
    (isArrayField ? [] : '');
  const [inputValue, setInputValue] = useState(currentSaved);

  useEffect(() => {
    setInputValue(currentSaved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField, selectedLocale]);

  if (!fieldDef) return null;

  const otherLocales = availableLocales.filter((l) => l !== selectedLocale);

  return (
    <FieldEditWrap>
      <MobileHeader>
        <BackBtn onClick={onBack}>‹ Back</BackBtn>
        <MobileTitle>{fieldDef.label}</MobileTitle>
      </MobileHeader>

      <FieldEditContent>
        {!isArrayField && (
          <>
            <SectionTitle>Current saved value</SectionTitle>
            <SavedPreview>{currentSaved || '—'}</SavedPreview>
          </>
        )}

        <SectionTitle>Edit</SectionTitle>
        {isFaqItems ? (
          <FaqItemsEditor
            value={inputValue}
            onChange={setInputValue}
            disabled={false}
            maxItems={fieldDef.maxItems}
          />
        ) : isServiceItems ? (
          <ServiceItemsEditor
            value={inputValue}
            onChange={setInputValue}
            disabled={false}
            maxItems={fieldDef.maxItems}
          />
        ) : fieldDef.type === 'textarea' ? (
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

        {!isArrayField && otherLocales.length > 0 && (
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

/**
 * Public content field editor that delegates to the appropriate sub-component based on mode.
 * @param {Object} props
 * @param {'editor'|'fields'|'field-edit'} props.mode - Rendering mode: 'editor' for desktop,
 *   'fields' for mobile field list, 'field-edit' for single-field mobile edit.
 * @returns {JSX.Element}
 */
export function ContentFieldEditor({ mode, ...props }) {
  if (mode === 'fields') return <MobileFieldList {...props} />;
  if (mode === 'field-edit') return <MobileFieldEdit {...props} />;
  return <DesktopEditor {...props} />;
}
