import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLearning } from '../../hooks/useLearning';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import {
  BookOpen,
  LayoutDashboard,
  CheckCircle,
  HelpCircle,
  FileCheck2,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

const LearningDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    courses,
    enrolledCourses,
    enrolledCoursesList,
    selectedCourseId,
    setSelectedCourseId,
    activeCourse,
    getCourseCompletionPercentage,
    overallLearningProgress
  } = useLearning();

  // Selected course sync with URL search params
  const currentParamId = searchParams.get('courseId');
  const effectiveCourseId = currentParamId || selectedCourseId || (enrolledCourses[0] || '101');
  const currentCourse = courses.find(c => c.id === String(effectiveCourseId)) || courses[0];

  const handleSelectCourse = (e) => {
    const newId = e.target.value;
    setSelectedCourseId(newId);
    setSearchParams({ courseId: newId });
  };

  const navTabClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-150 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100 bg-white'
    }`;

  // Check if current route is the base index /learning route
  const isIndexRoute = location.pathname === '/learning' || location.pathname === '/learning/';

  // Complete programmatic flow step detection
  const getCurrentStepIndex = () => {
    if (location.pathname.includes('/materials')) return 3;
    if (location.pathname.includes('/progress')) return 4;
    if (location.pathname.includes('/quiz')) return 5;
    if (location.pathname.includes('/assignments')) return 6;
    if (location.pathname.includes('/certificate')) return 7;
    return 2; // Dashboard overview
  };

  const currentStep = getCurrentStepIndex();
  const handleCardKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Active Course Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Student Learning Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Learning Dashboard &amp; Study Room
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage enrolled modules, interactive quizzes, assignments, and certificates.
          </p>
        </div>

        {/* Course Switcher */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" /> Active Course:
          </label>
          <select
            value={effectiveCourseId}
            onChange={handleSelectCourse}
            className="flex-1 lg:w-72 text-xs py-2.5 px-3 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-xs cursor-pointer"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title} {enrolledCourses.includes(c.id) ? '✓ (Enrolled)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Programmatic Learning Flow Stepper Bar (Experiment 3g) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Programmatic Flow Pipeline (useNavigate Sequence):
          </span>
          <span className="text-xs text-indigo-600 font-bold">
            Step {currentStep} of 7
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold min-w-max">
          <button
            onClick={() => navigate(`/course/${currentCourse.id}`)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            1. Details
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => navigate(`/enrollment/${currentCourse.id}`)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            2. Enrollment
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => navigate(`/learning/materials?courseId=${currentCourse.id}`)}
            className={`px-3 py-1.5 rounded-full cursor-pointer ${
              currentStep === 3 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. Materials
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => navigate(`/learning/progress?courseId=${currentCourse.id}`)}
            className={`px-3 py-1.5 rounded-full cursor-pointer ${
              currentStep === 4 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            4. Progress Tracking
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => navigate(`/learning/quiz?courseId=${currentCourse.id}`)}
            className={`px-3 py-1.5 rounded-full cursor-pointer ${
              currentStep === 5 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            5. Quiz
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => navigate(`/learning/assignments?courseId=${currentCourse.id}`)}
            className={`px-3 py-1.5 rounded-full cursor-pointer ${
              currentStep === 6 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            6. Assignment
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => navigate(`/learning/certificate?courseId=${currentCourse.id}`)}
            className={`px-3 py-1.5 rounded-full cursor-pointer ${
              currentStep === 7 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            7. Certificate
          </button>
        </div>
      </div>

      {/* Nested Tabs Navigation (Experiment 3e) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200">
        <NavLink
          to={`/learning?courseId=${effectiveCourseId}`}
          end
          className={navTabClass}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard Home
        </NavLink>
        <NavLink
          to={`/learning/materials?courseId=${effectiveCourseId}`}
          className={navTabClass}
        >
          <BookOpen className="w-4 h-4" />
          Materials
        </NavLink>
        <NavLink
          to={`/learning/progress?courseId=${effectiveCourseId}`}
          className={navTabClass}
        >
          <CheckCircle className="w-4 h-4" />
          Progress
        </NavLink>
        <NavLink
          to={`/learning/quiz?courseId=${effectiveCourseId}`}
          className={navTabClass}
        >
          <HelpCircle className="w-4 h-4" />
          Quiz
        </NavLink>
        <NavLink
          to={`/learning/assignments?courseId=${effectiveCourseId}`}
          className={navTabClass}
        >
          <FileCheck2 className="w-4 h-4" />
          Assignments
        </NavLink>
        <NavLink
          to={`/learning/certificate?courseId=${effectiveCourseId}`}
          className={navTabClass}
        >
          <Award className="w-4 h-4" />
          Certificate
        </NavLink>
      </div>

      {/* If directly on /learning index, render Overview Dashboard, else render Nested Outlet (Experiment 3f) */}
      {isIndexRoute ? (
        <div className="space-y-8">
          {/* Active Course Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                  Selected Subject • {currentCourse.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {currentCourse.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  {currentCourse.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span>Instructor: <strong className="text-slate-700">{currentCourse.instructor}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-slate-700">{currentCourse.duration}</strong></span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full md:w-64 text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Course Completion
                </span>
                <div className="text-3xl font-black text-indigo-600 my-1">
                  {getCourseCompletionPercentage(currentCourse.id)}%
                </div>
                <ProgressBar
                  value={getCourseCompletionPercentage(currentCourse.id)}
                  showLabel={false}
                  height="h-2"
                />
              </div>
            </div>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div
                onClick={() => navigate(`/learning/materials?courseId=${currentCourse.id}`)}
                onKeyDown={event => handleCardKeyDown(event, () => navigate(`/learning/materials?courseId=${currentCourse.id}`))}
                role="button"
                tabIndex={0}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-sm bg-white cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                  Learning Materials
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Access {currentCourse.learningMaterials?.length} lectures and code sandboxes.
                </p>
              </div>

              <div
                onClick={() => navigate(`/learning/progress?courseId=${currentCourse.id}`)}
                onKeyDown={event => handleCardKeyDown(event, () => navigate(`/learning/progress?courseId=${currentCourse.id}`))}
                role="button"
                tabIndex={0}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-sm bg-white cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                  Progress Tracking
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Review lesson completions and weighted milestones.
                </p>
              </div>

              <div
                onClick={() => navigate(`/learning/quiz?courseId=${currentCourse.id}`)}
                onKeyDown={event => handleCardKeyDown(event, () => navigate(`/learning/quiz?courseId=${currentCourse.id}`))}
                role="button"
                tabIndex={0}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-sm bg-white cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                  Assessment Quiz
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Test comprehension with auto-scored questions.
                </p>
              </div>

              <div
                onClick={() => navigate(`/learning/certificate?courseId=${currentCourse.id}`)}
                onKeyDown={event => handleCardKeyDown(event, () => navigate(`/learning/certificate?courseId=${currentCourse.id}`))}
                role="button"
                tabIndex={0}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-sm bg-white cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                  Verified Certificate
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Claim and print your accredited completion credential.
                </p>
              </div>
            </div>
          </div>

          {/* Enrolled Courses Carousel / Quick List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              All Enrolled Courses ({enrolledCoursesList.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledCoursesList.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCourseId(c.id);
                    setSearchParams({ courseId: c.id });
                  }}
                  onKeyDown={event => handleCardKeyDown(event, () => {
                    setSelectedCourseId(c.id);
                    setSearchParams({ courseId: c.id });
                  })}
                  role="button"
                  aria-label={`Open course ${c.title}`}
                  aria-pressed={c.id === currentCourse.id}
                  tabIndex={0}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    c.id === currentCourse.id
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img src={c.thumbnail} alt="" loading="lazy" decoding="async" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{c.title}</h4>
                      <p className="text-[11px] text-slate-500">{c.category}</p>
                    </div>
                  </div>
                  <ProgressBar
                    value={getCourseCompletionPercentage(c.id)}
                    labelPrefix="Progress"
                    height="h-1.5"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Outlet renders nested child routes: materials, progress, quiz, assignments, certificate (Experiment 3f) */
        <Outlet />
      )}
    </div>
  );
};

export default LearningDashboard;
