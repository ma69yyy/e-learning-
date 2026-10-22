import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { useLearning } from '../../hooks/useLearning';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import CourseCard from './CourseCard';
import Loading from '../common/Loading';
import Button from '../common/Button';
import { AlertCircle, SearchX, RotateCcw } from 'lucide-react';

const CourseList = () => {
  const navigate = useNavigate();

  // Use custom hook useCourses (Experiment 2a)
  const {
    courses,
    isLoadingCourses,
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
    matchingCoursesCount
  } = useCourses();

  // Use custom hook useLearning (Experiment 2b)
  const {
    isEnrolled,
    getCourseCompletionPercentage
  } = useLearning();

  const handleEnrollClick = (courseId) => {
    navigate(`/enrollment/${courseId}`);
  };

  if (isLoadingCourses) {
    return <Loading message="Loading curated courses and materials..." fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Catalog Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Course Catalog &amp; Discovery
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
          Explore Industry-Accredited Courses
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Discover hands-on curricula taught by verified experts. Filter by domain, difficulty tier, or instructor.
        </p>
      </div>

      {/* Search Bar with useRef Focus */}
      <div className="max-w-2xl mx-auto mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        difficultyLevel={difficultyLevel}
        setDifficultyLevel={setDifficultyLevel}
        durationFilter={durationFilter}
        setDurationFilter={setDurationFilter}
        instructorFilter={instructorFilter}
        setInstructorFilter={setInstructorFilter}
        instructors={instructors}
        resetFilters={resetFilters}
        totalMatching={matchingCoursesCount}
      />

      {/* Conditional Rendering State 1: "No courses available" (Experiment 2h) */}
      {courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No courses available</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            The learning database currently contains no published courses. Please check back later.
          </p>
        </div>
      ) : /* Conditional Rendering State 2: "No matching courses found" (Experiment 2h) */
      filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No matching courses found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            We couldn't find any courses matching your specified filters or search term: "{searchTerm}".
          </p>
          <Button
            variant="primary"
            onClick={resetFilters}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Clear All Filters &amp; Reset Search
          </Button>
        </div>
      ) : (
        /* Course Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={isEnrolled(course.id)}
              completionPercentage={getCourseCompletionPercentage(course.id)}
              onEnroll={handleEnrollClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
