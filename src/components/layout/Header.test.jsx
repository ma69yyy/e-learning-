import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../hooks/useLearning';

jest.mock('../../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../../hooks/useLearning', () => ({ useLearning: jest.fn() }));

beforeEach(() => {
  useAuth.mockReturnValue({ user: null, isAuthenticated: false, logout: jest.fn() });
  useLearning.mockReturnValue({ enrolledCourses: [] });
});

test('student login is a single semantic link, not a link containing a button', () => {
  const { container } = render(<MemoryRouter><Header /></MemoryRouter>);
  const loginLink = screen.getByRole('link', { name: /student login/i });

  expect(loginLink).toHaveAttribute('href', '/login');
  expect(loginLink.querySelector('button')).toBeNull();
  expect(container.querySelectorAll('a button')).toHaveLength(0);
});
