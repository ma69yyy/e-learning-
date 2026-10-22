import { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';

/**
 * Custom Hook: useLearning
 * Manages enrolled courses, course progress, quiz scores, assignment status,
 * and certificate eligibility.
 */
export const useLearning = () => {
  const context = useContext(LearningContext);

  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }

  const {
    courses,
    enrolledCourses,
    learningProgress,
    quizResponses,
    assignmentStatus,
    selectedCourseId,
    setSelectedCourseId,
    isEnrolled,
    enrollCourse,
    updateProgress,
    completeLesson,
    submitQuiz,
    submitAssignment,
    getCourseCompletionPercentage,
    getQuizScore,
    getAssignmentStatus,
    isCertificateEligible,
    overallLearningProgress
  } = context;

  // Resolve active/selected course object
  const activeCourse = courses.find(c => c.id === String(selectedCourseId)) || courses[0] || null;

  // Resolve enrolled course objects list
  const enrolledCoursesList = courses.filter(c => enrolledCourses.includes(c.id));

  return {
    courses,
    enrolledCourses,
    enrolledCoursesList,
    learningProgress,
    quizResponses,
    assignmentStatus,
    selectedCourseId,
    setSelectedCourseId,
    activeCourse,
    isEnrolled,
    enrollCourse,
    updateProgress,
    completeLesson,
    submitQuiz,
    submitAssignment,
    getCourseCompletionPercentage,
    getQuizScore,
    getAssignmentStatus,
    isCertificateEligible,
    overallLearningProgress
  };
};

export default useLearning;
