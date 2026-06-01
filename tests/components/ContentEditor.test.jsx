import React from 'react';
import { render, screen, waitFor } from '../../jest.setup';
import { ContentEditor } from 'components/AdminContentEditor';
import * as contentService from 'services/content';

jest.mock('services/content');
jest.mock('hooks/useCMS', () => ({ useCMS: () => ({ enabled: false }) }), {
  virtual: true,
});
jest.mock('hooks/useMediaQuery', () => ({ useMediaQuery: () => false }));
jest.mock('hooks/useToast', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

const mockContent = { title: 'Hello', subtitle: 'World' };

beforeEach(() => {
  contentService.getPage.mockResolvedValue(mockContent);
  contentService.hasLocaleContent.mockResolvedValue(true);
  contentService.updatePage.mockResolvedValue(mockContent);
});

describe('ContentEditor', () => {
  it('renders page list on mount', async () => {
    render(<ContentEditor />);
    await waitFor(() => expect(screen.getByText('Home')).toBeInTheDocument());
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('loads content when page is selected', async () => {
    render(<ContentEditor />);
    await waitFor(() => screen.getByText('Home'));
    screen.getByText('Home').click();
    await waitFor(() => {
      expect(contentService.getPage).toHaveBeenCalledWith(
        'home',
        expect.any(String),
      );
    });
  });

  it('shows placeholder when no page selected', async () => {
    render(<ContentEditor />);
    await waitFor(() => screen.getByText('Home'));
    expect(screen.getByText(/Select a page/i)).toBeInTheDocument();
  });
});
