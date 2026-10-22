import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import LazyVideo from './LazyVideo';

let originalIntersectionObserver;

beforeEach(() => {
  originalIntersectionObserver = global.IntersectionObserver;
});

afterEach(() => {
  if (originalIntersectionObserver === undefined) {
    delete global.IntersectionObserver;
  } else {
    global.IntersectionObserver = originalIntersectionObserver;
  }
});

test('a valid lesson video loads only after its container approaches the viewport', async () => {
  const MockIntersectionObserver = jest.fn(function IntersectionObserverMock(callback) {
    this.callback = callback;
    this.observe = jest.fn();
    this.disconnect = jest.fn();
  });
  global.IntersectionObserver = MockIntersectionObserver;

  render(
    <LazyVideo
      src="https://cdn.example.edu/course/lesson.mp4"
      poster="https://cdn.example.edu/course/lesson-poster.jpg"
      title="Lesson one"
    />,
  );

  const observer = MockIntersectionObserver.mock.instances[0];
  await waitFor(() => expect(observer.observe).toHaveBeenCalled());
  expect(screen.getByRole('status')).toHaveTextContent('Video will load when you reach this lesson media.');

  act(() => observer.callback([{ isIntersecting: true }]));
  const video = await screen.findByLabelText('Lesson one');
  expect(video).toHaveAttribute('preload', 'none');
  expect(video).toHaveAttribute('poster', 'https://cdn.example.edu/course/lesson-poster.jpg');
  expect(video.querySelector('source')).toHaveAttribute('src', 'https://cdn.example.edu/course/lesson.mp4');
  expect(observer.disconnect).toHaveBeenCalled();
});

test('unsafe video protocols are rejected before a media element is rendered', () => {
  render(<LazyVideo src="javascript:alert(1)" title="Unsafe lesson" />);

  expect(screen.getByRole('status')).toHaveTextContent('This video source is not allowed.');
  expect(screen.queryByLabelText('Unsafe lesson')).not.toBeInTheDocument();
});
