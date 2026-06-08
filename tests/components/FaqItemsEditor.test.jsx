import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import { FaqItemsEditor } from 'components/admin/content/ContentFieldEditor';

const ITEMS = [
  { question: 'What do you do?', answer: 'We build things.' },
  { question: 'How much?', answer: 'Depends on scope.' },
];

describe('FaqItemsEditor', () => {
  it('renders each item with its question and answer', () => {
    render(<FaqItemsEditor value={ITEMS} onChange={() => {}} />);
    expect(screen.getByDisplayValue('What do you do?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('We build things.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('How much?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Depends on scope.')).toBeInTheDocument();
  });

  it('renders an add button', () => {
    render(<FaqItemsEditor value={[]} onChange={() => {}} />);
    expect(
      screen.getByRole('button', { name: /add faq item/i }),
    ).toBeInTheDocument();
  });

  it('calls onChange with a new empty item when add is clicked', () => {
    const onChange = jest.fn();
    render(<FaqItemsEditor value={ITEMS} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /add faq item/i }));
    expect(onChange).toHaveBeenCalledWith([
      ...ITEMS,
      { question: '', answer: '' },
    ]);
  });

  it('calls onChange with the item removed when × is clicked', () => {
    const onChange = jest.fn();
    render(<FaqItemsEditor value={ITEMS} onChange={onChange} />);
    const removeButtons = screen.getAllByRole('button', {
      name: /remove faq item/i,
    });
    fireEvent.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalledWith([ITEMS[1]]);
  });

  it('calls onChange with updated question when question input changes', () => {
    const onChange = jest.fn();
    render(<FaqItemsEditor value={ITEMS} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('What do you do?'), {
      target: { value: 'Updated question' },
    });
    expect(onChange).toHaveBeenCalledWith([
      { question: 'Updated question', answer: 'We build things.' },
      ITEMS[1],
    ]);
  });

  it('calls onChange with updated answer when answer textarea changes', () => {
    const onChange = jest.fn();
    render(<FaqItemsEditor value={ITEMS} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('We build things.'), {
      target: { value: 'Updated answer' },
    });
    expect(onChange).toHaveBeenCalledWith([
      { question: 'What do you do?', answer: 'Updated answer' },
      ITEMS[1],
    ]);
  });

  it('renders nothing but the add button when value is empty', () => {
    render(<FaqItemsEditor value={[]} onChange={() => {}} />);
    expect(screen.queryByDisplayValue(/.+/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add faq item/i }),
    ).toBeInTheDocument();
  });

  it('handles a non-array value gracefully', () => {
    render(<FaqItemsEditor value={null} onChange={() => {}} />);
    expect(
      screen.getByRole('button', { name: /add faq item/i }),
    ).toBeInTheDocument();
  });

  it('disables all inputs and buttons when disabled prop is true', () => {
    render(<FaqItemsEditor value={ITEMS} onChange={() => {}} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => expect(input).toBeDisabled());
  });
});
