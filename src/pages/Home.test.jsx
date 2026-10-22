import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { useCourses } from '../hooks/useCourses';
import { useLearning } from '../hooks/useLearning';
import { useAuth } from '../context/AuthContext';

jest.mock('../hooks/useCourses', () => ({ useCourses: jest.fn() }));
jest.mock('../hooks/useLearning', () => ({ useLearning: jest.fn() }));
jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));

beforeEach(() => {
  useCourses.mockReturnValue({ courses: [] });
  useLearning.mockReturnValue({
    isEnrolled: jest.fn(() => false),
    getCourseCompletionPercentage: jest.fn(() => 0),
  });
  useAuth.mockReturnValue({ isAuthenticated: false, user: null });
});

test('Home CTAs are single focusable links to course and student-portal destinations', async () => {
  const user = userEvent.setup();
  const { container } = render(<MemoryRouter><Home /></MemoryRouter>);
  const explore = screen.getByRole('link', { name: /explore all courses/i });
  const portal = screen.getByRole('link', { name: /student portal login/i });
  const viewAll = screen.getByRole('link', { name: /view all courses/i });

  expect(explore).toHaveAttribute('href', '/courses');
  expect(portal).toHaveAttribute('href', '/login');
  expect(viewAll).toHaveAttribute('href', '/courses');
  expect(container.querySelectorAll('a button')).toHaveLength(0);

  await user.tab();
  expect(explore).toHaveFocus();
});
