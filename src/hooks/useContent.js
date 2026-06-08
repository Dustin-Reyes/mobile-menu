/**
 * React hooks for consuming CMS content.
 *
 * All hooks manage their own loading/error state and delegate to
 * `ContentService`. They work whether Firebase CMS is enabled or not —
 * when CMS is disabled the service falls back to local content files.
 *
 * @module hooks/useContent
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import contentService from '../services/content';
import globalErrorHandler from 'utils/errorHandler';

/**
 * Fetches and manages CMS content for a single page.
 *
 * Automatically re-fetches when `pageId` or the active i18n locale changes.
 *
 * @param {string} pageId - Firestore page document ID (e.g. `'home'`, `'example'`).
 * @param {{ locale?: string, enabled?: boolean }} [options]
 * @param {string} [options.locale='en'] - Fallback locale when i18n is unavailable.
 * @param {boolean} [options.enabled=true] - Set to `false` to skip fetching.
 * @returns {{
 *   content: Object | null,
 *   loading: boolean,
 *   error: Error | null,
 *   refetch: () => Promise<void>,
 *   updatePage: (data: Object) => Promise<Object>
 * }}
 */
export function usePage(pageId, options = {}) {
  const { locale: fallbackLocale = 'en', enabled = true } = options;
  const { i18n } = useTranslation();
  const locale = i18n.language || fallbackLocale;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const pageContent = await contentService.getPage(pageId, locale);
      setContent(pageContent);
    } catch (err) {
      setError(err);
      globalErrorHandler.reportError(err, {
        hook: 'usePage',
        action: 'fetch',
        pageId,
        locale,
      });
    } finally {
      setLoading(false);
    }
  }, [pageId, locale, enabled]);

  const updatePage = useCallback(
    async (data) => {
      if (!enabled) {
        throw new Error('CMS is not enabled');
      }
      try {
        setLoading(true);
        setError(null);
        const updated = await contentService.updatePage(pageId, locale, data);
        setContent(updated);
        return updated;
      } catch (err) {
        setError(err);
        globalErrorHandler.reportError(err, {
          hook: 'usePage',
          action: 'update',
          pageId,
          locale,
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pageId, locale, enabled],
  );

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
    updatePage,
  };
}

/**
 * Fetches and manages site settings from the CMS.
 *
 * @param {string | null} [category=null] - Settings category key (e.g. `'site'`, `'seo'`). Pass `null` to fetch all settings.
 * @param {{ enabled?: boolean }} [options]
 * @param {boolean} [options.enabled=true] - Set to `false` to skip fetching.
 * @returns {{
 *   settings: Object | null,
 *   loading: boolean,
 *   error: Error | null,
 *   refetch: () => Promise<void>,
 *   updateSettings: (data: Object) => Promise<Object>
 * }}
 */
export function useSettings(category = null, options = {}) {
  const { enabled = true } = options;

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const settingsData = await contentService.getSettings(category);
      setSettings(settingsData);
    } catch (err) {
      setError(err);
      globalErrorHandler.reportError(err, {
        hook: 'useSettings',
        action: 'fetch',
        category,
      });
    } finally {
      setLoading(false);
    }
  }, [category, enabled]);

  const updateSettings = useCallback(
    async (data) => {
      if (!enabled) {
        throw new Error('CMS is not enabled');
      }

      try {
        setLoading(true);
        const updatedSettings = await contentService.updateSettings(
          category || 'site',
          data,
        );
        setSettings(updatedSettings);
        return updatedSettings;
      } catch (err) {
        setError(err);
        globalErrorHandler.reportError(err, {
          hook: 'useSettings',
          action: 'update',
          category,
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [category, enabled],
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSettings,
  };
}

/**
 * Fetches and manages navigation items for a named menu.
 *
 * @param {string} [menuId='main'] - Menu identifier (e.g. `'main'`, `'footer'`).
 * @param {{ enabled?: boolean }} [options]
 * @param {boolean} [options.enabled=true] - Set to `false` to skip fetching.
 * @returns {{
 *   navigation: Array<Object>,
 *   loading: boolean,
 *   error: Error | null,
 *   refetch: () => Promise<void>,
 *   updateNavigation: (items: Array<Object>) => Promise<Array<Object>>
 * }}
 */
export function useNavigation(menuId = 'main', options = {}) {
  const { enabled = true } = options;
  const { i18n } = useTranslation();
  const locale = i18n.language || 'en';

  const [navigation, setNavigation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNavigation = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const navItems = await contentService.getNavigation(menuId, locale);
      setNavigation(navItems);
    } catch (err) {
      setError(err);
      globalErrorHandler.reportError(err, {
        hook: 'useNavigation',
        action: 'fetch',
        menuId,
      });
    } finally {
      setLoading(false);
    }
  }, [menuId, locale, enabled]);

  const updateNavigation = useCallback(
    async (items) => {
      if (!enabled) {
        throw new Error('CMS is not enabled');
      }

      try {
        setLoading(true);
        const updatedItems = await contentService.updateNavigation(
          menuId,
          items,
          locale,
        );
        setNavigation(updatedItems);
        return updatedItems;
      } catch (err) {
        setError(err);
        globalErrorHandler.reportError(err, {
          hook: 'useNavigation',
          action: 'update',
          menuId,
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [menuId, locale, enabled],
  );

  useEffect(() => {
    fetchNavigation();
  }, [fetchNavigation]);

  return {
    navigation,
    loading,
    error,
    refetch: fetchNavigation,
    updateNavigation,
  };
}

/**
 * Fetches a paginated list of blog posts.
 *
 * @param {{ limit?: number, offset?: number, enabled?: boolean }} [options]
 * @param {number} [options.limit=10] - Maximum number of posts to fetch.
 * @param {number} [options.offset=0] - Number of posts to skip (pagination).
 * @param {boolean} [options.enabled=true] - Set to `false` to skip fetching.
 * @returns {{
 *   posts: Array<Object>,
 *   loading: boolean,
 *   error: Error | null,
 *   hasMore: boolean,
 *   refetch: () => Promise<void>
 * }}
 */
export function usePosts(options = {}) {
  const { limit = 10, offset = 0, enabled = true } = options;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const postsData = await contentService.getPosts(limit, offset);
      setPosts(postsData);
      setHasMore(postsData.length === limit);
    } catch (err) {
      setError(err);
      globalErrorHandler.reportError(err, {
        hook: 'usePosts',
        action: 'fetch',
      });
    } finally {
      setLoading(false);
    }
  }, [limit, offset, enabled]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    refetch: fetchPosts,
  };
}

/**
 * Fetches a single blog post by its URL slug.
 *
 * @param {string} slug - URL slug of the post to fetch.
 * @param {{ enabled?: boolean }} [options]
 * @param {boolean} [options.enabled=true] - Set to `false` to skip fetching.
 * @returns {{
 *   post: Object | null,
 *   loading: boolean,
 *   error: Error | null,
 *   refetch: () => Promise<void>
 * }}
 */
export function usePost(slug, options = {}) {
  const { enabled = true } = options;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (!enabled || !slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const postData = await contentService.getPost(slug);
      setPost(postData);
    } catch (err) {
      setError(err);
      globalErrorHandler.reportError(err, {
        hook: 'usePost',
        action: 'fetch',
        slug,
      });
    } finally {
      setLoading(false);
    }
  }, [slug, enabled]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    loading,
    error,
    refetch: fetchPost,
  };
}

/**
 * Exposes CMS availability status and cache management utilities.
 *
 * @returns {{
 *   isCMSEnabled: boolean,
 *   checking: boolean,
 *   clearCache: () => void,
 *   stats: { pages: number, posts: number, navItems: number, cacheSize: number },
 *   refreshStats: () => Promise<void>
 * }}
 */
export function useCMS() {
  const [isCMSEnabled, setIsCMSEnabled] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({
    pages: 0,
    posts: 0,
    navItems: 0,
    cacheSize: 0,
  });

  useEffect(() => {
    const checkCMS = () => {
      const enabled = contentService.isCMSEnabled();
      setIsCMSEnabled(enabled);
      setChecking(false);
    };

    checkCMS();
  }, []);

  const clearCache = useCallback(() => {
    contentService.clearCache();
    // Update stats after clearing cache
    setStats((prev) => ({ ...prev, cacheSize: 0 }));
  }, []);

  const refreshStats = useCallback(async () => {
    if (!isCMSEnabled) return;

    try {
      const nextStats = await contentService.getStats();
      setStats(nextStats);
    } catch (error) {
      globalErrorHandler.reportError(error, {
        hook: 'useCMS',
        action: 'refresh-stats',
      });
    }
  }, [isCMSEnabled]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    isCMSEnabled,
    checking,
    clearCache,
    stats,
    refreshStats,
  };
}

/**
 * Fetches content via a custom fetcher function with optional polling.
 *
 * When `refreshInterval` is set the fetcher is called on that cadence as long
 * as the component is mounted. Useful for dashboard widgets that need periodic
 * refreshes without a full realtime subscription.
 *
 * @param {string} contentKey - Unique identifier for the content (used in error reporting).
 * @param {() => Promise<unknown>} fetcher - Async function that returns the content.
 * @param {{ enabled?: boolean, refreshInterval?: number | null }} [options]
 * @param {boolean} [options.enabled=true] - Set to `false` to skip fetching.
 * @param {number | null} [options.refreshInterval=null] - Polling interval in ms, or `null` to disable.
 * @returns {{
 *   content: unknown,
 *   loading: boolean,
 *   error: Error | null,
 *   refetch: () => Promise<void>
 * }}
 */
export function useLiveContent(contentKey, fetcher, options = {}) {
  const { enabled = true, refreshInterval = null } = options;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetcher();
      setContent(data);
    } catch (err) {
      setError(err);
      globalErrorHandler.reportError(err, {
        hook: 'useLiveContent',
        action: 'fetch',
        contentKey,
      });
    } finally {
      setLoading(false);
    }
  }, [contentKey, fetcher, enabled]);

  useEffect(() => {
    fetchContent();

    let interval = null;
    if (refreshInterval && enabled) {
      interval = setInterval(fetchContent, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchContent, refreshInterval, enabled]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}
