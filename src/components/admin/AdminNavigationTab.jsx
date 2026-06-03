import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Plus, Edit2, Trash2 } from 'lucide-react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import ConfirmDialog from './ConfirmDialog';
import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  GhostTealButton,
  Form,
  FormGroup,
  FormLabel,
  ActionButtons,
  NavigationList,
  NavigationItemCard,
  NavigationItemTitle,
  NavigationItemPath,
  NavigationActions,
  IconButton,
  CompactEmptyState,
  CompactEmptyIcon,
  LoadingSpinner,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminNavigationTab({
  navigation,
  navigationLoading,
  editingNavigation,
  setEditingNavigation,
  editingNavItem,
  navigationForm,
  setNavigationForm,
  loading,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
}) {
  const [pendingDelete, setPendingDelete] = useState(null);

  const confirmDelete = () => {
    if (pendingDelete) {
      onDelete(pendingDelete.id);
    }
  };

  return (
    <motion.div key="navigation" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Navigation</PageTitle>
          <PageSubtitle>Manage site navigation items</PageSubtitle>
        </div>
      </PageHeader>

      {editingNavigation ? (
        <SectionCard>
          <SectionCardHeader>
            <SectionCardTitle>
              <Navigation size={12} />
              {editingNavItem ? 'Edit Item' : 'Add Item'}
            </SectionCardTitle>
          </SectionCardHeader>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel>Label</FormLabel>
              <Input
                value={navigationForm.label}
                onChange={(e) =>
                  setNavigationForm({
                    ...navigationForm,
                    label: e.target.value,
                  })
                }
                placeholder="Enter navigation label"
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Path</FormLabel>
              <Input
                value={navigationForm.path}
                onChange={(e) =>
                  setNavigationForm({ ...navigationForm, path: e.target.value })
                }
                placeholder="/path"
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Order</FormLabel>
              <Input
                type="number"
                value={navigationForm.order}
                onChange={(e) =>
                  setNavigationForm({
                    ...navigationForm,
                    order: parseInt(e.target.value),
                  })
                }
                min="1"
                required
              />
            </FormGroup>
            <ActionButtons>
              <Button type="submit" disabled={loading}>
                {loading
                  ? 'Saving...'
                  : editingNavItem
                    ? 'Update Item'
                    : 'Add Item'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </ActionButtons>
          </Form>
        </SectionCard>
      ) : (
        <SectionCard>
          <SectionCardHeader>
            <SectionCardTitle>
              <Navigation size={12} />
              Navigation Items
            </SectionCardTitle>
            <GhostTealButton onClick={() => setEditingNavigation(true)}>
              <Plus size={12} />
              Add Item
            </GhostTealButton>
          </SectionCardHeader>
          {navigationLoading ? (
            <LoadingSpinner />
          ) : navigation?.length > 0 ? (
            <NavigationList>
              {navigation.map((item) => (
                <NavigationItemCard key={item.id}>
                  <div>
                    <NavigationItemTitle>{item.label}</NavigationItemTitle>
                    <NavigationItemPath>
                      {item.path} · Order {item.order}
                    </NavigationItemPath>
                  </div>
                  <NavigationActions>
                    <IconButton onClick={() => onEdit(item)} title="Edit">
                      <Edit2 size={14} />
                    </IconButton>
                    <IconButton
                      onClick={() => setPendingDelete(item)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </NavigationActions>
                </NavigationItemCard>
              ))}
            </NavigationList>
          ) : (
            <CompactEmptyState>
              <CompactEmptyIcon>≡</CompactEmptyIcon>
              No navigation items yet
            </CompactEmptyState>
          )}
        </SectionCard>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete navigation item?"
        description={
          pendingDelete
            ? `"${pendingDelete.label}" will be removed from the site navigation. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
}
