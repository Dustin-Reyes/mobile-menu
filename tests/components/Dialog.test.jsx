import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../utils/test-utils';
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'components/Dialog';

function DialogFixture() {
  return (
    <DialogRoot>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogTitle>Dialog Heading</DialogTitle>
        <p>Dialog body text</p>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </DialogRoot>
  );
}

describe('Dialog', () => {
  it('dialog content is not visible initially', () => {
    render(<DialogFixture />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<DialogFixture />);
    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Heading')).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<DialogFixture />);
    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
