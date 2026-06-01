/**
 * Tests for Content Hooks
 */

import { render, screen, waitFor } from '@testing-library/react';
import {
  usePage,
  useSettings,
  useNavigation,
  useCMS,
} from '../../src/hooks/useContent';
import contentService from '../../src/services/content';

// Mock content service
jest.mock('../../src/services/content');

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
  }),
}));

describe('Content Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usePage', () => {
    it('should return page content', async () => {
      const mockContent = {
        title: 'Test Page',
        subtitle: 'Test Subtitle',
        content: 'Test content',
      };

      contentService.getPage.mockResolvedValue(mockContent);

      function TestComponent() {
        const { content, loading, error } = usePage('test');

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;

        return (
          <div>
            <h1>{content?.title}</h1>
            <p>{content?.subtitle}</p>
          </div>
        );
      }

      render(<TestComponent />);

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should show content after loading
      await waitFor(() => {
        expect(screen.getByText('Test Page')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
      });

      expect(contentService.getPage).toHaveBeenCalledWith('test', 'en');
    });

    it('should handle errors', async () => {
      const mockError = new Error('Failed to fetch');
      contentService.getPage.mockRejectedValue(mockError);

      function TestComponent() {
        const { content, loading, error } = usePage('test');

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;

        return <div>{content?.title}</div>;
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
      });
    });

    it('should not fetch when disabled', async () => {
      contentService.getPage.mockResolvedValue({});

      function TestComponent() {
        const { content } = usePage('test', { enabled: false });
        return <div>{content?.title}</div>;
      }

      render(<TestComponent />);

      expect(contentService.getPage).not.toHaveBeenCalled();
    });

    it('should expose updatePage that updates content state', async () => {
      const initial = { title: 'Old Title', subtitle: 'Old Sub' };
      const updated = { title: 'New Title', subtitle: 'New Sub' };

      contentService.getPage.mockResolvedValue(initial);
      contentService.updatePage.mockResolvedValue(updated);

      let capturedUpdate;

      function TestComponent() {
        const { content, loading, updatePage } = usePage('home');
        if (loading) return <div>Loading...</div>;
        capturedUpdate = updatePage;
        return <div>{content?.title}</div>;
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Old Title')).toBeInTheDocument();
      });

      await waitFor(() => capturedUpdate(updated));

      await waitFor(() => {
        expect(screen.getByText('New Title')).toBeInTheDocument();
      });

      expect(contentService.updatePage).toHaveBeenCalledWith(
        'home',
        'en',
        updated,
      );
    });

    it('should set error state and rethrow when updatePage fails', async () => {
      const mockError = new Error('Update failed');
      contentService.getPage.mockResolvedValue({ title: 'Original' });
      contentService.updatePage.mockRejectedValue(mockError);

      let capturedUpdate;
      let capturedError;

      function TestComponent() {
        const { content, loading, error, updatePage } = usePage('home');
        capturedUpdate = updatePage;
        capturedError = error;
        if (loading) return <div>Loading...</div>;
        return <div>{content?.title}</div>;
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Original')).toBeInTheDocument();
      });

      await expect(
        waitFor(() => capturedUpdate({ title: 'New' })),
      ).rejects.toThrow('Update failed');

      await waitFor(() => {
        expect(capturedError).toBe(mockError);
      });
    });
  });

  describe('useSettings', () => {
    it('should return settings', async () => {
      const mockSettings = {
        title: 'Site Title',
        description: 'Site Description',
      };

      contentService.getSettings.mockResolvedValue(mockSettings);

      function TestComponent() {
        const { settings, loading } = useSettings('site');

        if (loading) return <div>Loading...</div>;

        return <div>{settings?.title}</div>;
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Site Title')).toBeInTheDocument();
      });

      expect(contentService.getSettings).toHaveBeenCalledWith('site');
    });
  });

  describe('useNavigation', () => {
    it('should return navigation items', async () => {
      const mockNav = [
        { id: 'home', label: 'Home', href: '/', order: 1 },
        { id: 'about', label: 'About', href: '/about', order: 2 },
      ];

      contentService.getNavigation.mockResolvedValue(mockNav);

      function TestComponent() {
        const { navigation, loading } = useNavigation('main');

        if (loading) return <div>Loading...</div>;

        return (
          <div>
            {navigation.map((item) => (
              <div key={item.id}>{item.label}</div>
            ))}
          </div>
        );
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
      });

      expect(contentService.getNavigation).toHaveBeenCalledWith('main', 'en');
    });
  });

  describe('useCMS', () => {
    it('should return CMS status', async () => {
      contentService.isCMSEnabled.mockReturnValue(false);

      function TestComponent() {
        const { isCMSEnabled, checking } = useCMS();

        if (checking) return <div>Checking...</div>;

        return <div>CMS Enabled: {isCMSEnabled.toString()}</div>;
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('CMS Enabled: false')).toBeInTheDocument();
      });
    });

    it('should provide clearCache function', async () => {
      contentService.isCMSEnabled.mockReturnValue(true);
      contentService.clearCache = jest.fn();

      function TestComponent() {
        const { clearCache } = useCMS();

        return <button onClick={clearCache}>Clear Cache</button>;
      }

      render(<TestComponent />);

      const button = screen.getByText('Clear Cache');
      button.click();

      expect(contentService.clearCache).toHaveBeenCalled();
    });
  });
});
