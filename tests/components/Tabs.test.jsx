import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../jest.setup';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../src/components/Tabs';

function TestTabs() {
  return (
    <TabsRoot defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab One</TabsTrigger>
        <TabsTrigger value="tab2">Tab Two</TabsTrigger>
        <TabsTrigger value="tab3">Tab Three</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab one</TabsContent>
      <TabsContent value="tab2">Content for tab two</TabsContent>
      <TabsContent value="tab3">Content for tab three</TabsContent>
    </TabsRoot>
  );
}

describe('Tabs', () => {
  // ─── Initial render ───────────────────────────────────────────────────────

  it('renders all tab triggers', () => {
    render(<TestTabs />);
    expect(screen.getByRole('tab', { name: /tab one/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab two/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab three/i })).toBeInTheDocument();
  });

  it('shows the first tab content by default', () => {
    render(<TestTabs />);
    expect(screen.getByText('Content for tab one')).toBeInTheDocument();
  });

  it('first tab trigger has data-state="active" initially', () => {
    render(<TestTabs />);
    expect(screen.getByRole('tab', { name: /tab one/i })).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  // ─── Tab switching ────────────────────────────────────────────────────────

  it('switches content when a different tab is clicked', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    await user.click(screen.getByRole('tab', { name: /tab two/i }));

    expect(screen.getByText('Content for tab two')).toBeInTheDocument();
  });

  it('sets clicked tab to data-state="active"', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    await user.click(screen.getByRole('tab', { name: /tab two/i }));

    expect(screen.getByRole('tab', { name: /tab two/i })).toHaveAttribute(
      'data-state',
      'active',
    );
    expect(screen.getByRole('tab', { name: /tab one/i })).toHaveAttribute(
      'data-state',
      'inactive',
    );
  });

  it('inactive tab panels are not visible', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    await user.click(screen.getByRole('tab', { name: /tab two/i }));

    // tab one panel should be hidden (Radix uses hidden attr or removes from DOM)
    const tabOnePanel = screen.queryByText('Content for tab one');
    if (tabOnePanel) {
      expect(tabOnePanel).not.toBeVisible();
    } else {
      expect(tabOnePanel).toBeNull();
    }
  });
});
