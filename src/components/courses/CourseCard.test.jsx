import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CourseCard from './CourseCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import { initialCoursesData } from '../../data/coursesData';

const course = initialCoursesData[0];

function SearchHarness() {
  const [searchTerm, setSearchTerm] = useState('');
  return <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
}

test('course card shows its accessible course details and calls the enrollment action', async () => {
  const user = userEvent.setup();
  const onEnroll = jest.fn();
  const { container } = render(
    <MemoryRouter>
      <CourseCard course={course} onEnroll={onEnroll} />
    </MemoryRouter>,
  );

  expect(screen.getByRole('img', { name: course.title })).toHaveAttribute('loading', 'lazy');
  expect(screen.getByRole('link', { name: course.title })).toHaveAttribute('href', `/course/${course.id}`);
  expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('href', `/course/${course.id}`);
  expect(container.querySelectorAll('a button')).toHaveLength(0);
  expect(screen.getByText(course.instructor)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Enroll' }));
  expect(onEnroll).toHaveBeenCalledWith(course.id);
});

test('an enrolled course exposes one keyboard target for its details link', () => {
  const { container } = render(
    <MemoryRouter>
      <CourseCard course={course} isEnrolled completionPercentage={40} />
    </MemoryRouter>,
  );

  expect(screen.getByRole('link', { name: 'View Details' })).toHaveAttribute('href', `/course/${course.id}`);
  expect(container.querySelectorAll('a button')).toHaveLength(0);
});

test('course search is named, updates its parent, and provides a keyboard-accessible clear action', async () => {
  const user = userEvent.setup();
  render(<SearchHarness />);

  const search = screen.getByRole('textbox', { name: 'Search courses' });
  expect(search).toHaveFocus();
  await user.type(search, 'react');
  expect(search).toHaveValue('react');

  await user.click(screen.getByRole('button', { name: 'Clear course search' }));
  expect(search).toHaveValue('');
});

test('category, difficulty, duration, and instructor filters expose labels and callbacks', async () => {
  const user = userEvent.setup();
  const setSelectedCategory = jest.fn();
  const setDifficultyLevel = jest.fn();
  const setDurationFilter = jest.fn();
  const setInstructorFilter = jest.fn();
  const resetFilters = jest.fn();

  render(
    <FilterPanel
      selectedCategory="All"
      setSelectedCategory={setSelectedCategory}
      difficultyLevel="Intermediate"
      setDifficultyLevel={setDifficultyLevel}
      durationFilter="All"
      setDurationFilter={setDurationFilter}
      instructorFilter="All"
      setInstructorFilter={setInstructorFilter}
      instructors={['All', course.instructor]}
      resetFilters={resetFilters}
      totalMatching={4}
    />,
  );

  await user.selectOptions(screen.getByLabelText('Category'), 'Web Development');
  await user.selectOptions(screen.getByLabelText('Difficulty'), 'Advanced');
  await user.selectOptions(screen.getByLabelText('Duration'), 'long');
  await user.selectOptions(screen.getByLabelText('Instructor'), course.instructor);
  expect(setSelectedCategory).toHaveBeenCalledWith('Web Development');
  expect(setDifficultyLevel).toHaveBeenCalledWith('Advanced');
  expect(setDurationFilter).toHaveBeenCalledWith('long');
  expect(setInstructorFilter).toHaveBeenCalledWith(course.instructor);
  expect(screen.getByText('(4 results)')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /reset filters/i }));
  expect(resetFilters).toHaveBeenCalledTimes(1);
});
