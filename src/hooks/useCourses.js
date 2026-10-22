import { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';

/**
 * Custom Hook: useCourses
 * Manages course data, course search, category filtering, difficulty-level filtering,
 * duration filtering, and instructor filtering.
 */
export const useCourses = () => {
  const context = useContext(LearningContext);

  if (!context) {
    throw new Error('useCourses must be used within a LearningProvider');
  }

  const {
    courses,
    isLoadingCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    filteredCourses,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    difficultyLevel,
    setDifficultyLevel,
    durationFilter,
    setDurationFilter,
    instructorFilter,
    setInstructorFilter,
    resetFilters
  } = context;

  // Extract unique instructors list for dropdown
  const instructors = ['All', ...new Set(courses.map(c => c.instructor))];

  return {
    courses,
    isLoadingCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    filteredCourses,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    difficultyLevel,
    setDifficultyLevel,
    durationFilter,
    setDurationFilter,
    instructorFilter,
    setInstructorFilter,
    instructors,
    resetFilters,
    totalCoursesCount: courses.length,
    matchingCoursesCount: filteredCourses.length
  };
};

export default useCourses;
