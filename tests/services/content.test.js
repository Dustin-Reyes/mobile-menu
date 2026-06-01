/**
 * Tests for Content Service
 */

import contentService from '../../src/services/content';

// Mock Firebase modules
jest.mock('../../src/config/firebase', () => ({
  __esModule: true,
  default: {
    enabled: false,
    provider: 'firebase',
    collections: {
      pages: 'pages',
      settings: 'settings',
      navigation: 'navigation',
      posts: 'posts',
    },
    cache: {
      ttl: 5 * 60 * 1000,
      maxSize: 50,
    },
  },
  db: { _isMockDb: true },
  isFirebaseConfigured: () => false,
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({ _isMockDocRef: true })),
  getDoc: jest.fn(() =>
    Promise.resolve({ exists: () => false, data: () => null }),
  ),
  setDoc: jest.fn(() => Promise.resolve(undefined)),
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ forEach: jest.fn() })),
  query: jest.fn(),
  orderBy: jest.fn(),
}));

describe('ContentService', () => {
  beforeEach(() => {
    // Clear cache before each test
    contentService.clearCache();
  });

  describe('getPage', () => {
    it('should return local content when Firebase is disabled', async () => {
      const result = await contentService.getPage('home', 'en');

      expect(result).toBeDefined();
    });

    it('should return null for non-existent page', async () => {
      const result = await contentService.getPage('nonexistent', 'en');
      expect(result).toBeNull();
    });

    it('should cache page content', async () => {
      const spy = jest.spyOn(contentService, 'clearCache');

      // First call
      const result1 = await contentService.getPage('home', 'en');

      // Second call should use cache
      const result2 = await contentService.getPage('home', 'en');

      expect(result1).toEqual(result2);
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe('getSettings', () => {
    it('should return local settings when Firebase is disabled', async () => {
      const result = await contentService.getSettings('site');

      expect(result).toBeDefined();
      expect(result.title).toBe('Your App');
    });

    it('should return all settings when no category specified', async () => {
      const result = await contentService.getSettings();

      expect(result).toBeDefined();
      expect(result.site).toBeDefined();
      expect(result.seo).toBeDefined();
    });
  });

  describe('getNavigation', () => {
    it('should return local navigation when Firebase is disabled', async () => {
      const result = await contentService.getNavigation('main');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // Template ships with empty navigation; items are added via yarn setup
    });

    it('should return empty array for non-existent menu', async () => {
      const result = await contentService.getNavigation('nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('getPosts', () => {
    it('should return empty array when Firebase is disabled', async () => {
      const result = await contentService.getPosts(10, 0);
      expect(result).toEqual([]);
    });
  });

  describe('getPost', () => {
    it('should return null when Firebase is disabled', async () => {
      const result = await contentService.getPost('test-post');
      expect(result).toBeNull();
    });
  });

  describe('isCMSEnabled', () => {
    it('should return false when Firebase is disabled', () => {
      const result = contentService.isCMSEnabled();
      expect(result).toBe(false);
    });
  });

  describe('updatePage', () => {
    it('should update cache and return data when CMS disabled', async () => {
      const data = {
        title: 'New Title',
        subtitle: 'New Subtitle',
        viewDemo: 'Try It',
        viewGitHub: 'GitHub',
        copyright: '© 2026',
      };

      const result = await contentService.updatePage('home', 'en', data);
      expect(result).toEqual(data);

      // Cache should now return updated content
      const cached = await contentService.getPage('home', 'en');
      expect(cached).toEqual(data);
    });

    it('should clear cache when CMS is enabled and write succeeds', async () => {
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      const CMS_CONFIG = require('../../src/config/firebase').default;
      const originalEnabled = CMS_CONFIG.enabled;
      CMS_CONFIG.enabled = true;

      // Pre-populate cache with CMS disabled so getPage uses local fallback
      CMS_CONFIG.enabled = false;
      await contentService.getPage('home', 'en');
      const cacheSizeBefore = contentService.getCacheSize();
      expect(cacheSizeBefore).toBeGreaterThan(0);

      // Now enable CMS and call updatePage — setDoc is mocked to succeed
      CMS_CONFIG.enabled = true;
      try {
        await contentService.updatePage('home', 'en', { title: 'Updated' });
      } finally {
        CMS_CONFIG.enabled = originalEnabled;
      }

      // Cache entry for page_home_en should have been deleted
      const cacheSizeAfter = contentService.getCacheSize();
      expect(cacheSizeAfter).toBeLessThan(cacheSizeBefore);
    });

    it('should throw when CMS is enabled and Firebase write fails', async () => {
      const { setDoc } = require('firebase/firestore');
      setDoc.mockRejectedValue(new Error('Firestore write failed'));

      const CMS_CONFIG = require('../../src/config/firebase').default;
      const originalEnabled = CMS_CONFIG.enabled;
      CMS_CONFIG.enabled = true;

      try {
        await expect(
          contentService.updatePage('home', 'en', { title: 'Updated' }),
        ).rejects.toThrow('Firestore write failed');
      } finally {
        CMS_CONFIG.enabled = originalEnabled;
      }
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', async () => {
      // Populate cache
      await contentService.getPage('home', 'en');

      // Clear cache
      contentService.clearCache();

      // Should fetch fresh data (but still return local content)
      const result = await contentService.getPage('home', 'en');
      expect(result).toBeDefined();
    });
  });

  describe('hasLocaleContent', () => {
    it('returns true when locale content exists locally', async () => {
      const result = await contentService.hasLocaleContent('home', 'en');
      expect(result).toBe(true);
    });

    it('returns false for a locale with no local content', async () => {
      const result = await contentService.hasLocaleContent('home', 'xx');
      expect(result).toBe(false);
    });

    it('returns false for a non-existent page', async () => {
      const result = await contentService.hasLocaleContent('nonexistent', 'en');
      expect(result).toBe(false);
    });
  });
});
