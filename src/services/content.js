/**
 * Content Service - Abstraction layer for content management
 *
 * This service provides a unified interface for content retrieval
 * from Firebase CMS or local fallbacks, making the template work
 * seamlessly with or without Firebase configuration.
 */

import CMS_CONFIG from '../config/firebase';
import { pages, settings, navigation, pageSchema } from '../content';

// Simple in-memory cache for content
const contentCache = new Map();
const cacheTimestamps = new Map();

// Local content fallbacks
const localContent = {
  pages,
  settings,
  navigation,
};

/**
 * Transform flat field names to nested section structure
 * e.g., { heroTitle: '...', servicesTitle: '...' } → { hero: { title: '...' }, services: { title: '...' } }
 */
function transformFlatToNested(flatData) {
  if (!flatData || typeof flatData !== 'object') return flatData;

  const nested = {};
  const sectionPrefixes = [
    'hero',
    'services',
    'about',
    'gallery',
    'faq',
    'contact',
    'cta',
    'header',
    'features',
    'footer',
  ];

  for (const [key, value] of Object.entries(flatData)) {
    let matched = false;
    for (const prefix of sectionPrefixes) {
      if (key.startsWith(prefix)) {
        const field = key.slice(prefix.length);
        // Convert camelCase to lowercase first letter
        const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
        if (!nested[prefix]) nested[prefix] = {};
        nested[prefix][fieldName] = value;
        matched = true;
        break;
      }
    }
    if (!matched) {
      nested[key] = value;
    }
  }

  return nested;
}

/**
 * Transform nested section structure to flat field names
 * e.g., { hero: { title: '...' }, services: { title: '...' } } → { heroTitle: '...', servicesTitle: '...' }
 */
function transformNestedToFlat(nestedData) {
  if (!nestedData || typeof nestedData !== 'object') return nestedData;

  const flat = {};
  const sectionPrefixes = [
    'hero',
    'services',
    'about',
    'gallery',
    'faq',
    'contact',
    'cta',
    'header',
    'features',
    'footer',
  ];

  for (const [key, value] of Object.entries(nestedData)) {
    if (sectionPrefixes.includes(key) && typeof value === 'object') {
      // This is a section object, transform its fields
      for (const [field, fieldValue] of Object.entries(value)) {
        // Convert to camelCase with prefix
        const flatKey = key + field.charAt(0).toUpperCase() + field.slice(1);
        flat[flatKey] = fieldValue;
      }
    } else {
      flat[key] = value;
    }
  }

  return flat;
}

/**
 * Check if content is cached and still valid
 */
function isCached(key) {
  if (!contentCache.has(key) || !cacheTimestamps.has(key)) {
    return false;
  }

  const timestamp = cacheTimestamps.get(key);
  const now = Date.now();
  return now - timestamp < CMS_CONFIG.cache.ttl;
}

/**
 * Get content from cache or fetch fresh
 */
async function getCachedContent(key, fetcher) {
  // Check cache first
  if (isCached(key)) {
    return contentCache.get(key);
  }

  // Fetch fresh content
  const content = await fetcher();

  // Cache the result
  contentCache.set(key, content);
  cacheTimestamps.set(key, Date.now());

  // Clean old cache entries if needed
  if (contentCache.size > CMS_CONFIG.cache.maxSize) {
    cleanOldCache();
  }

  return content;
}

/**
 * Clean old cache entries (LRU strategy)
 */
function cleanOldCache() {
  const entries = Array.from(cacheTimestamps.entries()).sort(
    (a, b) => a[1] - b[1],
  ); // Oldest first

  // Remove oldest entries
  const toRemove = entries.slice(0, Math.floor(CMS_CONFIG.cache.maxSize * 0.2));
  toRemove.forEach(([key]) => {
    contentCache.delete(key);
    cacheTimestamps.delete(key);
  });
}

/**
 * Fetch content from Firebase (if configured)
 */
async function fetchFromFirebase(collection, docId) {
  if (!CMS_CONFIG.enabled) {
    throw new Error('Firebase CMS not configured');
  }

  const { db } = await import('../config/firebase');
  if (!db) {
    throw new Error('Firebase Firestore not available');
  }

  const { doc, getDoc } = await import('firebase/firestore');
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
}

/**
 * Fetch collection from Firebase
 */
async function fetchCollectionFromFirebase(collection) {
  if (!CMS_CONFIG.enabled) {
    throw new Error('Firebase CMS not configured');
  }

  const { db } = await import('../config/firebase');
  if (!db) {
    throw new Error('Firebase Firestore not available');
  }

  const {
    collection: firestoreCollection,
    getDocs,
    query,
    orderBy,
  } = await import('firebase/firestore');
  const q = query(firestoreCollection(db, collection), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);

  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });

  return items;
}

/**
 * Update document in Firebase
 */
async function updateInFirebase(collection, docId, data) {
  if (!CMS_CONFIG.enabled) {
    throw new Error('Firebase CMS not configured');
  }

  const { db } = await import('../config/firebase');
  if (!db) {
    throw new Error('Firebase Firestore not available');
  }

  const { doc, setDoc, getDoc } = await import('firebase/firestore');
  const docRef = doc(db, collection, docId);

  // For locale-based updates (e.g., { en: {...} }), we need to merge at the locale level
  // to avoid losing other fields in the same locale object
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const existingData = docSnap.data();
    // Deep merge the new data with existing data
    const mergedData = { ...existingData };
    for (const [key, value] of Object.entries(data)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Merge nested objects (e.g., locale objects)
        mergedData[key] = { ...existingData[key], ...value };
      } else {
        mergedData[key] = value;
      }
    }
    await setDoc(docRef, mergedData);
  } else {
    // Document doesn't exist, create it
    await setDoc(docRef, data);
  }

  return data;
}

/**
 * Main Content Service Class
 */
class ContentService {
  /**
   * Get page content
   */
  async getPage(pageId, locale = 'en') {
    const cacheKey = `page_${pageId}_${locale}`;

    return getCachedContent(cacheKey, async () => {
      if (CMS_CONFIG.enabled) {
        try {
          // One document per page; locale is a sub-field: pages/home → { en: {...}, es: {...} }
          const doc = await fetchFromFirebase('pages', pageId);
          if (doc) {
            const localeData = doc[locale] ?? doc['en'] ?? null;
            // Transform flat field names to nested section structure
            return transformFlatToNested(localeData);
          }
        } catch (error) {
          console.warn('Firebase fetch failed, using local content:', error);
        }
      }

      // Fallback to local content — with locale fallback to 'en'
      // Local content is already nested, so no transformation needed
      return (
        localContent.pages[pageId]?.[locale] ??
        localContent.pages[pageId]?.['en'] ??
        null
      );
    });
  }

  /**
   * Get site settings
   */
  async getSettings(category = null) {
    const cacheKey = `settings_${category || 'all'}`;

    return getCachedContent(cacheKey, async () => {
      if (CMS_CONFIG.enabled) {
        try {
          if (category) {
            const content = await fetchFromFirebase('settings', category);
            if (content) return content;
          } else {
            // Fetch all settings
            const content = await fetchFromFirebase('settings', 'site');
            if (content) return content;
          }
        } catch (error) {
          console.warn('Firebase fetch failed, using local content:', error);
        }
      }

      // Fallback to local content
      return category ? localContent.settings[category] : localContent.settings;
    });
  }

  /**
   * Get navigation items
   */
  async getNavigation(menuId = 'main', locale = 'en') {
    const cacheKey = `navigation_${menuId}_${locale}`;

    return getCachedContent(cacheKey, async () => {
      // Resolve locale-keyed label to a flat `label` field for consumers
      const resolveLabel = (item) => ({
        ...item,
        label: item.labels?.[locale] ?? item.labels?.['en'] ?? item.label ?? '',
      });

      if (CMS_CONFIG.enabled) {
        try {
          const items = await fetchCollectionFromFirebase('navigation');
          const menuItems = items.filter((item) => item.menu === menuId);
          if (menuItems.length > 0) return menuItems.map(resolveLabel);
        } catch (error) {
          console.warn('Firebase fetch failed, using local content:', error);
        }
      }

      // Fallback to local content
      return (localContent.navigation[menuId] || []).map(resolveLabel);
    });
  }

  /**
   * Get blog posts/articles
   */
  async getPosts(limit = 10, offset = 0) {
    const cacheKey = `posts_${limit}_${offset}`;

    return getCachedContent(cacheKey, async () => {
      if (CMS_CONFIG.enabled) {
        try {
          const posts = await fetchCollectionFromFirebase('posts');
          return posts.slice(offset, offset + limit);
        } catch (error) {
          console.warn('Firebase fetch failed, using local content:', error);
        }
      }

      // Fallback to empty array (no local posts by default)
      return [];
    });
  }

  /**
   * Get single post by slug
   */
  async getPost(slug) {
    const cacheKey = `post_${slug}`;

    return getCachedContent(cacheKey, async () => {
      if (CMS_CONFIG.enabled) {
        try {
          const content = await fetchFromFirebase('posts', slug);
          if (content) return content;
        } catch (error) {
          console.warn('Firebase fetch failed, using local content:', error);
        }
      }

      return null;
    });
  }

  /**
   * Update page content
   */
  async updatePage(pageId, locale = 'en', data) {
    const cacheKey = `page_${pageId}_${locale}`;

    if (CMS_CONFIG.enabled) {
      // Transform nested section structure to flat field names for Firebase
      const flatData = transformNestedToFlat(data);
      // Write locale as a sub-field: pages/home → { en: {...} }
      await updateInFirebase('pages', pageId, { [locale]: flatData });
      // Clear cache so next read fetches the merged result from Firebase
      contentCache.delete(cacheKey);
      cacheTimestamps.delete(cacheKey);
    } else {
      // CMS disabled — merge into in-memory cache so partial field saves don't lose other fields
      const existing = contentCache.get(cacheKey) ?? {};
      contentCache.set(cacheKey, { ...existing, ...data });
      cacheTimestamps.set(cacheKey, Date.now());
    }

    return data;
  }

  /**
   * Update site settings
   */
  async updateSettings(category, data) {
    if (!CMS_CONFIG.enabled) {
      throw new Error('CMS is not enabled');
    }

    try {
      // Update in Firebase
      await updateInFirebase('settings', category, data);

      // Clear cache to force refresh
      contentCache.delete(`settings_${category}`);
      cacheTimestamps.delete(`settings_${category}`);

      return data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }

  /**
   * Update navigation items
   */
  async updateNavigation(menuId, items, locale = 'en') {
    if (!CMS_CONFIG.enabled) {
      throw new Error('CMS is not enabled');
    }

    try {
      // Write each item; merge the updated locale label into the existing labels object
      for (const item of items) {
        await updateInFirebase('navigation', item.id, {
          id: item.id,
          href: item.href,
          order: item.order,
          menu: menuId,
          // Preserve existing locale labels and update only the current one
          labels: { ...(item.labels || {}), [locale]: item.label },
        });
      }

      // Clear cache to force refresh
      contentCache.delete(`navigation_${menuId}_${locale}`);
      cacheTimestamps.delete(`navigation_${menuId}_${locale}`);

      return items;
    } catch (error) {
      console.error('Failed to update navigation:', error);
      throw error;
    }
  }

  /**
   * Clear cache (useful for admin updates)
   */
  clearCache() {
    contentCache.clear();
    cacheTimestamps.clear();
  }

  /**
   * Get current cache size
   */
  getCacheSize() {
    return contentCache.size;
  }

  /**
   * Get dashboard stats derived from real content sources.
   */
  async getStats(locale = 'en') {
    const [navItems, posts] = await Promise.all([
      this.getNavigation('main', locale),
      this.getPosts(),
    ]);

    return {
      pages: Object.keys(pageSchema).length,
      posts: posts.length,
      navItems: navItems.length,
      cacheSize: this.getCacheSize(),
    };
  }

  /**
   * Check if CMS is enabled
   */
  isCMSEnabled() {
    return CMS_CONFIG.enabled;
  }

  /**
   * Check whether locale-specific content genuinely exists for a page.
   * Returns false when the only available content is the English fallback.
   * Used by the admin UI to decide whether to show the "Translate from EN" hint.
   */
  async hasLocaleContent(pageId, locale) {
    if (CMS_CONFIG.enabled) {
      try {
        const doc = await fetchFromFirebase('pages', pageId);
        return !!(doc && doc[locale]);
      } catch {
        // Fall through to local check on Firebase error
      }
    }
    return !!localContent.pages[pageId]?.[locale];
  }

  /**
   * Translate a page's English content into the given locale using the CMS
   * translation service. Returns the translated content object, or null if
   * translation is not available or the CMS is disabled.
   */
  async translateContent(pageId, targetLocale) {
    try {
      // Get the English content to translate
      const enContent = await this.getPage(pageId, 'en');
      if (!enContent) return null;

      // Flatten nested content so we iterate over actual string values
      // (getPage returns nested { hero: { title } }; we need flat { heroTitle })
      const flatContent = transformNestedToFlat(enContent);

      // If target locale is English, no translation needed — return flat
      if (targetLocale === 'en') return flatContent;

      // Translate each flat field in the content
      const translatedContent = {};

      for (const [key, value] of Object.entries(flatContent)) {
        if (typeof value === 'string' && value.trim()) {
          try {
            // Call the Netlify translation function using the current window origin
            const response = await fetch(
              `${window.location.origin}/.netlify/functions/translate`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  text: value,
                  targetLang: targetLocale,
                  sourceLang: 'en',
                }),
              },
            );

            if (!response.ok) {
              console.warn(
                `Translation failed for field ${key}:`,
                response.status,
              );
              translatedContent[key] = value; // Fallback to original
              continue;
            }

            const result = await response.json();
            translatedContent[key] = result.translatedText || value; // Fallback to original
          } catch (error) {
            console.warn(`Translation error for field ${key}:`, error);
            translatedContent[key] = value; // Fallback to original
          }
        } else {
          // Non-string values or empty strings, keep as-is
          translatedContent[key] = value;
        }
      }

      return translatedContent;
    } catch (error) {
      console.error('Translation failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const contentService = new ContentService();
export default contentService;

// Named function exports for easy mocking and direct imports
export { transformNestedToFlat };
export const getPage = (...args) => contentService.getPage(...args);
export const updatePage = (...args) => contentService.updatePage(...args);
export const hasLocaleContent = (...args) =>
  contentService.hasLocaleContent(...args);
export const translateContent = (...args) =>
  contentService.translateContent(...args);
export const getSettings = (...args) => contentService.getSettings(...args);
export const getNavigation = (...args) => contentService.getNavigation(...args);
export const getStats = (...args) => contentService.getStats(...args);
