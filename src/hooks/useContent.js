/**
 * React hooks for content management
 *
 * These hooks provide easy-to-use interfaces for consuming content
 * from the CMS service with proper loading states and error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import contentService from '../services/content';

/**
 * Hook for fetching page content
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
      console.error(`Failed to fetch page ${pageId}:`, err);
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
        console.error(`Failed to update page ${pageId}:`, err);
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
 * Hook for fetching site settings
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
      console.error(`Failed to fetch settings ${category || 'all'}:`, err);
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
        console.error(`Failed to update settings ${category || 'all'}:`, err);
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
 * Hook for fetching navigation items
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
      console.error(`Failed to fetch navigation ${menuId}:`, err);
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
        console.error(`Failed to update navigation ${menuId}:`, err);
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
 * Hook for fetching blog posts
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
      console.error('Failed to fetch posts:', err);
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
 * Hook for fetching a single post
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
      console.error(`Failed to fetch post ${slug}:`, err);
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
 * Hook for CMS status and utilities
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
      console.error('Failed to refresh stats:', error);
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
 * Hook for content with real-time updates (when CMS is enabled)
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
      console.error(`Failed to fetch live content ${contentKey}:`, err);
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
