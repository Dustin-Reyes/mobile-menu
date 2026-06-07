import { useState, useEffect, useCallback } from 'react';
import { useToast } from 'hooks/useToast';
import * as contentService from 'services/content';
import { availableLanguages } from 'config/i18n';
import { pageSchema } from '../content/schema';

const AVAILABLE_LOCALES = Object.keys(availableLanguages);
const DEFAULT_LOCALE = AVAILABLE_LOCALES[0] ?? 'en';

export function usePageEditor(pageId) {
  const { showToast } = useToast();

  const [selectedLocale, setSelectedLocale] = useState(DEFAULT_LOCALE);
  const [formValues, setFormValues] = useState({});
  const [savedValues, setSavedValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const schema = pageId ? pageSchema[pageId] : null;
  const hasChanges = JSON.stringify(formValues) !== JSON.stringify(savedValues);

  const loadContent = useCallback(async (pid, locale) => {
    if (!pid) return;
    setIsLoading(true);
    try {
      const content = await contentService.getPage(pid, locale);
      const values = contentService.transformNestedToFlat(content ?? {});
      setFormValues(values);
      setSavedValues(values);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load content on mount / when pageId changes.
  // selectedLocale intentionally omitted — locale changes call loadContent directly.
  useEffect(() => {
    loadContent(pageId, DEFAULT_LOCALE);
  }, [pageId, loadContent]);

  const handleLocaleChange = useCallback(
    async (locale) => {
      setSelectedLocale(locale);
      await loadContent(pageId, locale);
    },
    [pageId, loadContent],
  );

  const handleFieldChange = useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!pageId) return;
    setIsSaving(true);
    try {
      const result = await contentService.updatePage(
        pageId,
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
      setIsSaving(false);
    }
  }, [pageId, selectedLocale, formValues, showToast]);

  const handleCancel = useCallback(() => {
    setFormValues(savedValues);
  }, [savedValues]);

  const handleTranslateAll = useCallback(async () => {
    if (!pageId) return;
    setIsTranslating(true);
    try {
      const otherLocales = AVAILABLE_LOCALES.filter((l) => l !== 'en');
      await Promise.all(
        otherLocales.map(async (locale) => {
          const translated = await contentService.translateContent(
            pageId,
            locale,
          );
          if (translated) {
            await contentService.updatePage(pageId, locale, translated);
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
  }, [pageId, showToast]);

  const handleTranslateLocale = useCallback(async () => {
    if (!pageId) return;
    setIsTranslating(true);
    try {
      const translated = await contentService.translateContent(
        pageId,
        selectedLocale,
      );
      if (translated) {
        setFormValues(translated);
        showToast({ message: 'Translation complete', type: 'success' });
      }
    } catch {
      showToast({ message: 'Translation failed', type: 'error' });
    } finally {
      setIsTranslating(false);
    }
  }, [pageId, selectedLocale, showToast]);

  return {
    schema,
    formValues,
    hasChanges,
    selectedLocale,
    availableLocales: AVAILABLE_LOCALES,
    isLoading,
    isSaving,
    isTranslating,
    handleLocaleChange,
    handleFieldChange,
    handleSave,
    handleCancel,
    handleTranslateAll,
    handleTranslateLocale,
  };
}
