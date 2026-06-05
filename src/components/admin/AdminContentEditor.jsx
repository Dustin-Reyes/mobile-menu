import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { pageSchema } from '../../content/schema';
import { ContentPageList } from './AdminContentPageList';
import { ContentFieldEditor } from './AdminContentFieldEditor';
import ConfirmDialog from './ConfirmDialog';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { useToast } from 'hooks/useToast';
import * as contentService from 'services/content';
import { availableLanguages } from 'config/i18n';

const AVAILABLE_LOCALES = Object.keys(availableLanguages);

// ─── Desktop Layout ──────────────────────────────────────────────────────────

const SplitPane = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;
`;

const ListPane = styled.div`
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  overflow-y: auto;
`;

const EditorPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

const Placeholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

// ─── Main Component ──────────────────────────────────────────────────────────

export function ContentEditor() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { showToast } = useToast();

  // Shared state
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLocale, setSelectedLocale] = useState(
    AVAILABLE_LOCALES[0] ?? 'en',
  );
  const [formValues, setFormValues] = useState({});
  const [savedValues, setSavedValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [localeMap, setLocaleMap] = useState({});
  const [confirmTranslateOpen, setConfirmTranslateOpen] = useState(false);

  // Mobile state
  const [mobileScreen, setMobileScreen] = useState('pages');
  const [selectedField, setSelectedField] = useState(null);
  const [allLocaleContent, setAllLocaleContent] = useState({});

  const isDirty = JSON.stringify(formValues) !== JSON.stringify(savedValues);

  // Build locale map on mount
  useEffect(() => {
    async function buildLocaleMap() {
      const map = {};
      await Promise.all(
        Object.keys(pageSchema).map(async (pageId) => {
          const locales = await Promise.all(
            AVAILABLE_LOCALES.map(async (locale) => {
              const has = await contentService.hasLocaleContent(pageId, locale);
              return has ? locale : null;
            }),
          );
          map[pageId] = locales.filter(Boolean);
        }),
      );
      setLocaleMap(map);
    }
    buildLocaleMap();
  }, []);

  // Load content for selected page + locale
  // getPage() returns nested data (e.g. { hero: { title } }); we flatten to
  // match schema field keys (e.g. heroTitle) for the field editor form.
  const loadContent = useCallback(async (pageId, locale) => {
    setIsLoading(true);
    try {
      const content = await contentService.getPage(pageId, locale);
      const values = contentService.transformNestedToFlat(content ?? {});
      setFormValues(values);
      setSavedValues(values);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Page selection
  const handleSelectPage = useCallback(
    async (pageId) => {
      setSelectedPage(pageId);
      setSelectedSection(null); // Clear section when page changes
      if (isMobile) {
        setIsLoading(true);
        const all = {};
        await Promise.all(
          AVAILABLE_LOCALES.map(async (locale) => {
            const nested = (await contentService.getPage(pageId, locale)) ?? {};
            all[locale] = contentService.transformNestedToFlat(nested);
          }),
        );
        setAllLocaleContent(all);
        setIsLoading(false);
        setMobileScreen('fields');
      } else {
        await loadContent(pageId, selectedLocale);
      }
    },
    [isMobile, selectedLocale, loadContent],
  );

  // Section selection
  const handleSelectSection = useCallback(async (section) => {
    setSelectedSection(section);
    // No need to reload content - we'll filter fields in the editor
  }, []);

  // Locale switch (discards unsaved changes silently)
  // On mobile, allLocaleContent already has all locales — skip the redundant fetch
  const handleLocaleChange = useCallback(
    async (locale) => {
      setSelectedLocale(locale);
      if (!isMobile && selectedPage) {
        await loadContent(selectedPage, locale);
      }
    },
    [isMobile, selectedPage, loadContent],
  );

  // Field change
  const handleFieldChange = useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Save (desktop)
  const handleSave = useCallback(async () => {
    if (!selectedPage) return;
    setIsLoading(true);
    try {
      const result = await contentService.updatePage(
        selectedPage,
        selectedLocale,
        formValues,
      );
      const saved = result ?? formValues;
      setSavedValues(saved);
      setFormValues(saved);
      showToast({ message: 'Saved successfully', type: 'success' });
    } catch {
      showToast({ message: 'Failed to save', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPage, selectedLocale, formValues, showToast]);

  // Cancel (desktop)
  const handleCancel = useCallback(() => {
    setFormValues(savedValues);
  }, [savedValues]);

  // Translate all locales from EN (EN tab only) — opens confirm dialog first
  const handleTranslateAll = useCallback(() => {
    if (!selectedPage) return;
    setConfirmTranslateOpen(true);
  }, [selectedPage]);

  const executeTranslateAll = useCallback(async () => {
    if (!selectedPage) return;
    setIsTranslating(true);
    try {
      const otherLocales = AVAILABLE_LOCALES.filter((l) => l !== 'en');
      await Promise.all(
        otherLocales.map(async (locale) => {
          const translated = await contentService.translateContent(
            selectedPage,
            locale,
          );
          if (translated) {
            await contentService.updatePage(selectedPage, locale, translated);
          }
        }),
      );
      showToast({
        message: 'All locales translated and saved',
        type: 'success',
      });
    } catch {
      showToast({ message: 'Translation failed', type: 'error' });
    } finally {
      setIsTranslating(false);
    }
  }, [selectedPage, showToast]);

  // Translate current non-EN locale from EN
  const handleTranslateLocale = useCallback(async () => {
    if (!selectedPage) return;
    setIsTranslating(true);
    try {
      const translated = await contentService.translateContent(
        selectedPage,
        selectedLocale,
      );
      if (translated) {
        // translateContent already returns flat keys after our fix
        setFormValues(translated);
        showToast({ message: 'Translation complete', type: 'success' });
      }
    } catch {
      showToast({ message: 'Translation failed', type: 'error' });
    } finally {
      setIsTranslating(false);
    }
  }, [selectedPage, selectedLocale, showToast]);

  // Mobile: per-field save
  const handleFieldSave = useCallback(
    async (fieldKey, value) => {
      if (!selectedPage) return;
      setIsLoading(true);
      try {
        await contentService.updatePage(selectedPage, selectedLocale, {
          [fieldKey]: value,
        });
        setAllLocaleContent((prev) => ({
          ...prev,
          [selectedLocale]: {
            ...(prev[selectedLocale] ?? {}),
            [fieldKey]: value,
          },
        }));
        showToast({ message: 'Saved', type: 'success' });
        setMobileScreen('fields');
      } catch {
        showToast({ message: 'Failed to save', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedPage, selectedLocale, showToast],
  );

  const sharedEditorProps = {
    schema: selectedPage ? pageSchema[selectedPage] : null,
    selectedSection,
    selectedLocale,
    availableLocales: AVAILABLE_LOCALES,
    formValues,
    savedValues,
    isDirty,
    isLoading,
    isTranslating,
    onLocaleChange: handleLocaleChange,
    onFieldChange: handleFieldChange,
    onSave: handleSave,
    onCancel: handleCancel,
    onTranslateAll: handleTranslateAll,
    onTranslateLocale: handleTranslateLocale,
    onSelectSection: handleSelectSection,
    // mobile
    allLocaleContent,
    selectedField,
    onSelectField: (key) => {
      setSelectedField(key);
      setMobileScreen('field-edit');
    },
    onBack: () => setMobileScreen('fields'),
    onFieldSave: handleFieldSave,
  };

  // ─── Mobile render ────────────────────────────────────────────────────────
  if (isMobile) {
    if (mobileScreen === 'pages') {
      return (
        <ContentPageList
          pages={pageSchema}
          selectedPage={selectedPage}
          selectedSection={selectedSection}
          localeMap={localeMap}
          onSelectPage={handleSelectPage}
          onSelectSection={handleSelectSection}
          isMobile={true}
        />
      );
    }
    if (mobileScreen === 'fields' && selectedPage) {
      return (
        <ContentFieldEditor
          mode="fields"
          {...sharedEditorProps}
          onBack={() => setMobileScreen('pages')}
        />
      );
    }
    if (mobileScreen === 'field-edit' && selectedPage && selectedField) {
      return <ContentFieldEditor mode="field-edit" {...sharedEditorProps} />;
    }
    return null;
  }

  const pageLabel = selectedPage
    ? (pageSchema[selectedPage]?.label ?? selectedPage)
    : '';

  // ─── Desktop render ───────────────────────────────────────────────────────
  return (
    <>
      <ConfirmDialog
        open={confirmTranslateOpen}
        onOpenChange={setConfirmTranslateOpen}
        title="Translate all content?"
        description={`This will translate all content fields for the "${pageLabel}" page into every non-English locale and save immediately. Any existing translations will be overwritten.`}
        confirmLabel="Translate all"
        onConfirm={executeTranslateAll}
      />
      <SplitPane>
        <ListPane>
          <ContentPageList
            pages={pageSchema}
            selectedPage={selectedPage}
            selectedSection={selectedSection}
            localeMap={localeMap}
            onSelectPage={handleSelectPage}
            onSelectSection={handleSelectSection}
            isMobile={false}
          />
        </ListPane>
        <EditorPane>
          {selectedSection ||
          (selectedPage &&
            !pageSchema[selectedPage]?.fields?.some((f) => f.group)) ? (
            <ContentFieldEditor mode="editor" {...sharedEditorProps} />
          ) : (
            <Placeholder>
              {selectedPage
                ? 'Select a section to start editing'
                : 'Select a page to start editing'}
            </Placeholder>
          )}
        </EditorPane>
      </SplitPane>
    </>
  );
}
