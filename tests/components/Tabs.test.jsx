import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../utils/test-utils';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'components/Tabs';

// Use forceMount so all panel content is always in the DOM (Radix v2 lazy-mounts by default)
function TabsFixture() {
  return (
    <TabsRoot defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab One</TabsTrigger>
        <TabsTrigger value="tab2">Tab Two</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" forceMount>
        Panel One Content
      </TabsContent>
      <TabsContent value="tab2" forceMount>
        Panel Two Content
      </TabsContent>
    </TabsRoot>
  );
}

describe('Tabs', () => {
  it('renders all tab triggers', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tab', { name: 'Tab One' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab Two' })).toBeInTheDocument();
  });

  it('default tab is selected', () => {
    render(<TabsFixture />);
    expect(screen.getByRole('tab', { name: 'Tab One' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('panel content is rendered for the default tab', () => {
    render(<TabsFixture />);
    expect(screen.getByText('Panel One Content')).toBeInTheDocument();
  });

  it('switches selected tab when another tab is clicked', async () => {
    const user = userEvent.setup();
    render(<TabsFixture />);
    const tabTwo = screen.getByRole('tab', { name: 'Tab Two' });
    expect(tabTwo).toHaveAttribute('aria-selected', 'false');
    await user.click(tabTwo);
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab One' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('Tab Two panel content is in the DOM after forceMount', () => {
    render(<TabsFixture />);
    expect(screen.getByText('Panel Two Content')).toBeInTheDocument();
  });
});
