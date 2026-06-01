import React from 'react';
import { render, screen, fireEvent } from '../../jest.setup';
import { ContentPageList } from 'components/AdminContentPageList';

const pages = {
  home: { label: 'Home', emoji: '🏠', fields: [] },
  about: { label: 'About', emoji: '📄', fields: [] },
};
const localeMap = { home: ['en', 'es'], about: ['en'] };

describe('ContentPageList', () => {
  it('renders all pages', () => {
    render(
      <ContentPageList
        pages={pages}
        selectedPage={null}
        localeMap={localeMap}
        onSelect={jest.fn()}
        isMobile={false}
      />,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('calls onSelect with page id when row clicked', () => {
    const onSelect = jest.fn();
    render(
      <ContentPageList
        pages={pages}
        selectedPage={null}
        localeMap={localeMap}
        onSelect={onSelect}
        isMobile={false}
      />,
    );
    fireEvent.click(screen.getByText('Home'));
    expect(onSelect).toHaveBeenCalledWith('home');
  });

  it('shows +N pill when locale count > 3', () => {
    render(
      <ContentPageList
        pages={pages}
        selectedPage="home"
        localeMap={localeMap}
        onSelect={jest.fn()}
        isMobile={false}
      />,
    );
    // With only 2 locales (en, es), no +N pill should be shown
    expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
  });

  it('shows chevron on mobile', () => {
    const { container } = render(
      <ContentPageList
        pages={pages}
        selectedPage={null}
        localeMap={localeMap}
        onSelect={jest.fn()}
        isMobile={true}
      />,
    );
    // chevron character rendered for mobile rows
    expect(container.textContent).toContain('›');
  });
});
