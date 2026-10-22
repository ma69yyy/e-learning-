import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';

test('the not-found recovery action is a single keyboard-operable link', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <MemoryRouter initialEntries={['/missing-page']}>
      <Routes><Route path="*" element={<NotFound />} /></Routes>
    </MemoryRouter>,
  );
  const homeLink = screen.getByRole('link', { name: /return to learning portal home/i });

  expect(homeLink).toHaveAttribute('href', '/');
  expect(homeLink.querySelector('button')).toBeNull();
  expect(container.querySelectorAll('a button')).toHaveLength(0);
  await user.tab();
  expect(homeLink).toHaveFocus();
});
