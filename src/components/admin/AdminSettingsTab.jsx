import { motion } from 'framer-motion';
import { Settings, Edit2 } from 'lucide-react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
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
  StyledTextarea,
  ActionButtons,
  SettingsViewGrid,
  SettingsLabel,
  SettingsValue,
} from './AdminDashboard.styles';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function AdminSettingsTab({
  settings,
  settingsForm,
  setSettingsForm,
  editingSettings,
  setEditingSettings,
  loading,
  onSubmit,
}) {
  return (
    <motion.div key="settings" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Settings</PageTitle>
          <PageSubtitle>Site-wide configuration</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <Settings size={12} />
            Site Settings
          </SectionCardTitle>
          {!editingSettings && (
            <GhostTealButton onClick={() => setEditingSettings(true)}>
              <Edit2 size={12} />
              Edit
            </GhostTealButton>
          )}
        </SectionCardHeader>

        {editingSettings ? (
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel>Site Title</FormLabel>
              <Input
                value={settingsForm.title}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, title: e.target.value })
                }
                placeholder="Enter site title"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Site Description</FormLabel>
              <StyledTextarea
                value={settingsForm.description}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter site description"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Author</FormLabel>
              <Input
                value={settingsForm.author}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, author: e.target.value })
                }
                placeholder="Enter author name"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Site URL</FormLabel>
              <Input
                value={settingsForm.url}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, url: e.target.value })
                }
                placeholder="https://example.com"
                type="url"
              />
            </FormGroup>
            <ActionButtons>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingSettings(false)}
              >
                Cancel
              </Button>
            </ActionButtons>
          </Form>
        ) : (
          <SettingsViewGrid>
            {[
              ['Title', settings?.title],
              ['Description', settings?.description],
              ['Author', settings?.author],
              ['URL', settings?.url],
            ].map(([label, value]) => (
              <div key={label}>
                <SettingsLabel>{label}</SettingsLabel>
                <SettingsValue hasValue={!!value}>
                  {value || 'Not set'}
                </SettingsValue>
              </div>
            ))}
          </SettingsViewGrid>
        )}
      </SectionCard>
    </motion.div>
  );
}
