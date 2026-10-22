import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LearningProvider } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import LearningMaterials from './LearningMaterials';
import ProgressTracking from './ProgressTracking';
import Enrollment from './Enrollment';
import Quiz from './Quiz';
import Assignment from './Assignment';
import { initialCoursesData } from '../../data/coursesData';

jest.mock('../../context/AuthContext', () => ({ useAuth: jest.fn() }));

const course = initialCoursesData[0];
const enrollmentCourse = initialCoursesData[1];

function renderInRouter(ui, initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LearningProvider>{ui}</LearningProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  useAuth.mockReturnValue({
    user: { name: 'Ada Student', email: 'ada@example.edu', studentId: 'STU-1' },
  });
});

test('learning materials update real course progress and persist lesson completion', async () => {
  const user = userEvent.setup();
  renderInRouter(<LearningMaterials />, `/learning/materials?courseId=${course.id}`);

  expect(await screen.findByRole('heading', { name: course.title })).toBeInTheDocument();
  const nextLesson = course.learningMaterials[2];
  await user.click(screen.getByRole('button', { name: new RegExp(`3\\. ${nextLesson.title}`) }));
  await user.click(screen.getByRole('button', { name: 'Mark as Completed' }));

  await waitFor(() => {
    const progress = JSON.parse(localStorage.getItem('elearn_progress'));
    expect(progress[course.id].completedLessons).toContain(nextLesson.id);
  });
  expect(screen.getByText('Completed')).toBeInTheDocument();
});

test('progress tracking reads real course completion state and exposes accessible progress indicators', async () => {
  renderInRouter(<ProgressTracking />, `/learning/progress?courseId=${course.id}`);

  expect(await screen.findByRole('heading', { name: course.title })).toBeInTheDocument();
  expect(screen.getByText('Curriculum Lessons')).toBeInTheDocument();
  expect(screen.getAllByRole('progressbar', { name: 'Learning progress' })).toHaveLength(2);
  expect(screen.getByText('Quiz not attempted yet')).toBeInTheDocument();
});

test('enrollment updates real enrolled-course and initial-progress persistence', async () => {
  const user = userEvent.setup();
  renderInRouter(
    <Routes><Route path="/enrollment/:id" element={<Enrollment />} /></Routes>,
    `/enrollment/${enrollmentCourse.id}`,
  );

  expect(screen.getByRole('status')).toHaveTextContent('Loading course enrollment');
  expect(await screen.findByLabelText(/Student Full Name/)).toHaveValue('Ada Student');
  await user.click(screen.getByRole('button', { name: /complete enrollment & begin learning/i }));
  expect(await screen.findByText('Enrollment Confirmed!')).toBeInTheDocument();

  await waitFor(() => {
    expect(JSON.parse(localStorage.getItem('elearn_enrolled'))).toContain(enrollmentCourse.id);
    expect(JSON.parse(localStorage.getItem('elearn_progress'))).toHaveProperty(enrollmentCourse.id);
  });
});

test('quiz answers produce a passing score in the real provider and persist the result', async () => {
  const user = userEvent.setup();
  renderInRouter(<Quiz />, `/learning/quiz?courseId=${course.id}`);

  const answers = {};
  for (const question of course.quiz) {
    const questionGroup = await screen.findByRole('group', { name: new RegExp(question.question) });
    await user.click(within(questionGroup).getByRole('radio', { name: question.options[question.correctIndex] }));
    answers[question.id] = question.correctIndex;
  }
  await user.click(screen.getByRole('button', { name: 'Submit Quiz for Grading' }));

  expect(screen.getByText('Congratulations! Assessment Passed!')).toBeInTheDocument();
  await waitFor(() => expect(JSON.parse(localStorage.getItem('elearn_quiz'))[course.id].passed).toBe(true));
});

test('assignment form rejects unsafe URLs and persists a valid assignment submission', async () => {
  const user = userEvent.setup();
  renderInRouter(<Assignment />, `/learning/assignments?courseId=${course.id}`);

  await user.click(await screen.findByRole('button', { name: 'Submit Assignment' }));
  const dialog = screen.getByRole('dialog', { name: course.assignments[0].title });
  const repoInput = within(dialog).getByLabelText(/GitHub \/ Code Repository URL/);
  await user.clear(repoInput);
  await user.type(repoInput, 'javascript:alert(1)');
  await user.click(within(dialog).getByRole('button', { name: 'Submit Deliverable' }));
  expect(await within(dialog).findByText(/please enter a valid url/i)).toBeInTheDocument();

  await user.clear(repoInput);
  await user.type(repoInput, 'https://github.com/learner/project');
  await user.click(within(dialog).getByRole('button', { name: 'Submit Deliverable' }));
  expect(await screen.findByText('Assignment Successfully Submitted!')).toBeInTheDocument();
  await waitFor(() => {
    const submissions = JSON.parse(localStorage.getItem('elearn_assignments'));
    expect(submissions[course.id][course.assignments[0].id].repoUrl).toBe('https://github.com/learner/project');
  });
});
