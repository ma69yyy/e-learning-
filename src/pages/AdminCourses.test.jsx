import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LearningProvider } from '../context/LearningContext';
import AdminCourses from './AdminCourses';

const renderAdmin = () => render(
  <MemoryRouter>
    <LearningProvider>
      <AdminCourses />
    </LearningProvider>
  </MemoryRouter>
);

let crudConsoleLog;

beforeEach(() => {
  localStorage.clear();
  window.confirm = jest.fn(() => true);
  crudConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

test('admin can create, edit, delete, and persist a course', async () => {
  renderAdmin();
  expect(await screen.findByText('Course management')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Add course' }));
  const addDialog = screen.getByRole('dialog');
  fireEvent.change(within(addDialog).getByLabelText('Course title'), {
    target: { value: 'Data Storytelling Essentials' }
  });
  fireEvent.change(within(addDialog).getByLabelText('Instructor'), {
    target: { value: 'Taylor Morgan' }
  });
  fireEvent.change(within(addDialog).getByLabelText('Description'), {
    target: { value: 'Learn to communicate insights with clear visual stories.' }
  });
  fireEvent.click(within(addDialog).getByRole('button', { name: 'Add course' }));

  const createdTitle = await screen.findByText('Data Storytelling Essentials');
  expect(createdTitle).toBeInTheDocument();
  expect(crudConsoleLog).toHaveBeenCalledWith('[EduVantage CRUD] CREATE course', expect.objectContaining({ title: 'Data Storytelling Essentials' }));
  await waitFor(() => {
    const savedCourses = JSON.parse(localStorage.getItem('elearn_courses'));
    expect(savedCourses.some(course => course.title === 'Data Storytelling Essentials')).toBe(true);
  });

  const createdRow = createdTitle.closest('article');
  fireEvent.click(within(createdRow).getByRole('button', { name: 'Edit' }));
  const editDialog = screen.getByRole('dialog');
  fireEvent.change(within(editDialog).getByLabelText('Course title'), {
    target: { value: 'Data Storytelling for Teams' }
  });
  fireEvent.click(within(editDialog).getByRole('button', { name: 'Save changes' }));
  const updatedTitle = await screen.findByText('Data Storytelling for Teams');
  expect(updatedTitle).toBeInTheDocument();
  expect(crudConsoleLog).toHaveBeenCalledWith('[EduVantage CRUD] UPDATE course', expect.objectContaining({ title: 'Data Storytelling for Teams' }));

  const updatedRow = updatedTitle.closest('article');
  fireEvent.click(within(updatedRow).getByRole('button', { name: 'Delete Data Storytelling for Teams' }));
  expect(crudConsoleLog).toHaveBeenCalledWith('[EduVantage CRUD] DELETE course', expect.objectContaining({ title: 'Data Storytelling for Teams' }));
  await waitFor(() => expect(screen.queryByText('Data Storytelling for Teams')).not.toBeInTheDocument());
  await waitFor(() => {
    const savedCourses = JSON.parse(localStorage.getItem('elearn_courses'));
    expect(savedCourses.some(course => course.title === 'Data Storytelling for Teams')).toBe(false);
  });
});
