import React from 'react';
import { render, screen, fireEvent } from '../../jest.setup';
import { ContentFieldEditor } from 'components/AdminContentFieldEditor';

const schema = {
  label: 'Home',
  emoji: '🏠',
  fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
  ],
};

const baseProps = {
  mode: 'editor',
  schema,
  selectedLocale: 'en',
  availableLocales: ['en', 'es'],
  formValues: { title: 'Hello', subtitle: 'World' },
  savedValues: { title: 'Hello', subtitle: 'World' },
  isDirty: false,
  isLoading: false,
  isTranslating: false,
  onLocaleChange: jest.fn(),
  onFieldChange: jest.fn(),
  onSave: jest.fn(),
  onCancel: jest.fn(),
  onTranslateAll: jest.fn(),
  onTranslateLocale: jest.fn(),
  // mobile-only
  allLocaleContent: {},
  selectedField: null,
  onSelectField: jest.fn(),
  onBack: jest.fn(),
  onFieldSave: jest.fn(),
};

describe('ContentFieldEditor — desktop editor mode', () => {
  it('renders all fields', () => {
    render(<ContentFieldEditor {...baseProps} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Subtitle')).toBeInTheDocument();
  });

  it('shows Translate from EN button on non-EN locale', () => {
    render(<ContentFieldEditor {...baseProps} selectedLocale="es" />);
    expect(screen.getByText(/Translate from EN/i)).toBeInTheDocument();
  });

  it('does not show Translate from EN button on EN locale', () => {
    render(<ContentFieldEditor {...baseProps} selectedLocale="en" />);
    expect(screen.queryByText(/Translate from EN/i)).not.toBeInTheDocument();
  });

  it('shows unsaved dot when isDirty', () => {
    render(<ContentFieldEditor {...baseProps} isDirty={true} />);
    expect(screen.getByText(/Unsaved changes/i)).toBeInTheDocument();
  });

  it('calls onFieldChange when input changes', () => {
    const onFieldChange = jest.fn();
    render(<ContentFieldEditor {...baseProps} onFieldChange={onFieldChange} />);
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New' },
    });
    expect(onFieldChange).toHaveBeenCalledWith('title', 'New');
  });

  it('calls onSave when Save button clicked while dirty', () => {
    const onSave = jest.fn();
    render(
      <ContentFieldEditor {...baseProps} isDirty={true} onSave={onSave} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    expect(onSave).toHaveBeenCalled();
  });
});

describe('ContentFieldEditor — mobile fields mode', () => {
  it('shows field list with value previews', () => {
    render(<ContentFieldEditor {...baseProps} mode="fields" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('calls onSelectField on row click', () => {
    const onSelectField = jest.fn();
    render(
      <ContentFieldEditor
        {...baseProps}
        mode="fields"
        onSelectField={onSelectField}
      />,
    );
    fireEvent.click(screen.getByText('Title'));
    expect(onSelectField).toHaveBeenCalledWith('title');
  });
});

describe('ContentFieldEditor — mobile field-edit mode', () => {
  it('renders editable input for selected field', () => {
    render(
      <ContentFieldEditor
        {...baseProps}
        mode="field-edit"
        selectedField="title"
        allLocaleContent={{ en: { title: 'Hello' }, es: { title: 'Hola' } }}
      />,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onBack when back button clicked', () => {
    const onBack = jest.fn();
    render(
      <ContentFieldEditor
        {...baseProps}
        mode="field-edit"
        selectedField="title"
        allLocaleContent={{ en: { title: 'Hello' } }}
        onBack={onBack}
      />,
    );
    fireEvent.click(screen.getByText(/back/i));
    expect(onBack).toHaveBeenCalled();
  });
});
