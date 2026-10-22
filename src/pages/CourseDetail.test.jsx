import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LearningProvider } from '../context/LearningContext';
import CourseDetail from './CourseDetail';
import { initialCoursesData } from '../data/coursesData';

const course = initialCoursesData[1];

beforeEach(() => {
  localStorage.clear();
});

test('course detail reads a dynamic course route and navigates to enrollment', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[`/course/${course.id}`]}>
      <LearningProvider>
        <Routes>
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/enrollment/:id" element={<div>Enrollment step</div>} />
        </Routes>
      </LearningProvider>
    </MemoryRouter>,
  );

  expect(await screen.findByRole('heading', { name: course.title })).toBeInTheDocument();
  expect(screen.getByText('Curriculum & Learning Materials')).toBeInTheDocument();
  expect(screen.getByText(course.learningMaterials[0].title)).toBeInTheDocument();
  const image = screen.getByRole('img', { name: course.title });
  expect(image).toHaveAttribute('loading', 'lazy');
  expect(image).toHaveAttribute('decoding', 'async');

  await user.click(screen.getByRole('button', { name: 'Proceed to Enrollment' }));
  expect(await screen.findByText('Enrollment step')).toBeInTheDocument();
});
