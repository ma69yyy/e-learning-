import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CourseList from './CourseList';
import { LearningProvider } from '../../context/LearningContext';
import { initialCoursesData } from '../../data/coursesData';

beforeEach(() => {
  localStorage.clear();
});

test('course catalog searches and filters the real course collection', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/courses']}>
      <LearningProvider>
        <CourseList />
      </LearningProvider>
    </MemoryRouter>,
  );

  expect(await screen.findByRole('heading', { name: 'Explore Industry-Accredited Courses' })).toBeInTheDocument();
  const search = screen.getByRole('textbox', { name: 'Search courses' });
  await user.type(search, 'no-course-uses-this-search-term');
  expect(await screen.findByRole('heading', { name: 'No matching courses found' })).toBeInTheDocument();

  await user.clear(search);
  const category = 'Data Science';
  await user.selectOptions(screen.getByLabelText('Category'), category);
  const matchingCount = initialCoursesData.filter(course => course.category === category).length;
  expect(await screen.findByText(`(${matchingCount} result${matchingCount === 1 ? '' : 's'})`)).toBeInTheDocument();
  for (const course of initialCoursesData.filter(item => item.category === category)) {
    expect(screen.getByRole('link', { name: course.title })).toBeInTheDocument();
  }
});
