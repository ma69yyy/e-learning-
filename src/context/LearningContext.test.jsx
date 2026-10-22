import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearningProvider } from './LearningContext';
import { useLearning } from '../hooks/useLearning';

function ProgressProbe() {
  const { learningProgress, completeLesson, updateProgress } = useLearning();
  const completed = learningProgress['101']?.completedLessons || [];
  return (
    <div>
      <output aria-label="completed lessons">{completed.length}</output>
      <button type="button" onClick={() => completeLesson('101', 'l3')}>Complete l3</button>
      <button type="button" onClick={() => updateProgress('101', 'l1')}>Toggle l1</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test('lesson completion and toggles update the persisted course progress', async () => {
  const user = userEvent.setup();
  render(<LearningProvider><ProgressProbe /></LearningProvider>);

  const completed = screen.getByLabelText('completed lessons');
  await waitFor(() => expect(completed).toHaveTextContent('2'));
  await user.click(screen.getByRole('button', { name: 'Complete l3' }));
  await waitFor(() => expect(completed).toHaveTextContent('3'));
  await waitFor(() => expect(JSON.parse(localStorage.getItem('elearn_progress'))['101'].completedLessons).toContain('l3'));

  await user.click(screen.getByRole('button', { name: 'Toggle l1' }));
  await waitFor(() => expect(completed).toHaveTextContent('2'));
  expect(JSON.parse(localStorage.getItem('elearn_progress'))['101'].completedLessons).not.toContain('l1');
});
