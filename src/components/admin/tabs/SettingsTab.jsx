import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Edit2 } from 'lucide-react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import { SectionCard, SectionCardHeader } from '../shared/SectionCard';
import { toast } from '@/utils/toast';

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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SettingsViewGrid = styled.div`
  display: grid;
  gap: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

export default function SettingsTab({ settings, updateSettings }) {
  const [editingSettings, setEditingSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    title: '',
    description: '',
    author: '',
    url: '',
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        title: settings.title || '',
        description: settings.description || '',
        author: settings.author || '',
        url: settings.url || '',
      });
    }
  }, [settings]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(settingsForm);
      setEditingSettings(false);
      toast.success('Settings updated successfully!');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const settingsDisplay = useMemo(
    () => [
      ['Title', settings?.title],
      ['Description', settings?.description],
      ['Author', settings?.author],
      ['URL', settings?.url],
    ],
    [settings],
  );

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
          {!editingSettings && (
            <GhostTealButton onClick={() => setEditingSettings(true)}>
              <Edit2 size={12} />
              Edit
            </GhostTealButton>
          )}
        </SectionCardHeader>

        {editingSettings ? (
          <Form onSubmit={handleSettingsSubmit}>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingSettings(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </ActionButtons>
          </Form>
        ) : (
          <SettingsViewGrid>
            {settingsDisplay.map(([label, value]) => (
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
