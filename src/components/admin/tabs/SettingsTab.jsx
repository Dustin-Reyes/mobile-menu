import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Settings, Edit2 } from 'lucide-react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from '../shared/SectionCard';

const GhostTealButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  padding: 4px 10px;
  background: ${(p) => p.theme.colors.primary}1a;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}40;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  font-family: inherit;

  &:hover {
    background: ${(p) => p.theme.colors.primary}2a;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FormLabel = styled.label`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
  display: block;
`;

const StyledTextarea = styled.textarea`
  padding: ${(p) => p.theme.spacing.s2} ${(p) => p.theme.spacing.s3};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSizes.s5};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colors.primary}1a;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
`;

const SettingsViewGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const SettingsLabel = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 2px;
`;

const SettingsValue = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) =>
    p.hasValue ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)'};
`;

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

export default function SettingsTab({
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
              <FormLabel>Tagline</FormLabel>
              <Input
                value={settingsForm.tagline}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, tagline: e.target.value })
                }
                placeholder="Your tagline"
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
            <FormGroup>
              <FormLabel>Facebook URL</FormLabel>
              <Input
                value={settingsForm.facebook}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, facebook: e.target.value })
                }
                placeholder="https://facebook.com/yourpage"
                type="url"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Instagram URL</FormLabel>
              <Input
                value={settingsForm.instagram}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    instagram: e.target.value,
                  })
                }
                placeholder="https://instagram.com/yourhandle"
                type="url"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Twitter URL</FormLabel>
              <Input
                value={settingsForm.twitter}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, twitter: e.target.value })
                }
                placeholder="https://twitter.com/yourhandle"
                type="url"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>LinkedIn URL</FormLabel>
              <Input
                value={settingsForm.linkedin}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/yourprofile"
                type="url"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>GitHub URL</FormLabel>
              <Input
                value={settingsForm.github}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, github: e.target.value })
                }
                placeholder="https://github.com/yourusername"
                type="url"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>YouTube URL</FormLabel>
              <Input
                value={settingsForm.youtube}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, youtube: e.target.value })
                }
                placeholder="https://youtube.com/@yourchannel"
                type="url"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Contact Phone</FormLabel>
              <Input
                value={settingsForm.contactPhone}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    contactPhone: e.target.value,
                  })
                }
                placeholder="+1 (555) 123-4567"
                type="tel"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Contact Email</FormLabel>
              <Input
                value={settingsForm.contactEmail}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    contactEmail: e.target.value,
                  })
                }
                placeholder="contact@example.com"
                type="email"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Address</FormLabel>
              <StyledTextarea
                value={settingsForm.address}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, address: e.target.value })
                }
                placeholder="123 Main Street, City, State, Country"
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
              ['Tagline', settings?.tagline],
              ['Author', settings?.author],
              ['URL', settings?.url],
              ['Facebook', settings?.facebook],
              ['Instagram', settings?.instagram],
              ['Twitter', settings?.twitter],
              ['LinkedIn', settings?.linkedin],
              ['GitHub', settings?.github],
              ['YouTube', settings?.youtube],
              ['Contact Phone', settings?.contactPhone],
              ['Contact Email', settings?.contactEmail],
              ['Address', settings?.address],
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
