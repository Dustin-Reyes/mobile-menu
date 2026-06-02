import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../utils/test-utils';
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'components/Accordion';

function AccordionFixture() {
  return (
    <AccordionRoot type="single" collapsible>
      <AccordionItem value="item1">
        <AccordionTrigger>Question One</AccordionTrigger>
        <AccordionContent>Answer One</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item2">
        <AccordionTrigger>Question Two</AccordionTrigger>
        <AccordionContent>Answer Two</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

describe('Accordion', () => {
  it('renders all accordion triggers', () => {
    render(<AccordionFixture />);
    expect(screen.getByText('Question One')).toBeInTheDocument();
    expect(screen.getByText('Question Two')).toBeInTheDocument();
  });

  it('expands an item when its trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<AccordionFixture />);
    await user.click(screen.getByText('Question One'));
    expect(screen.getByText('Answer One')).toBeInTheDocument();
  });
});
