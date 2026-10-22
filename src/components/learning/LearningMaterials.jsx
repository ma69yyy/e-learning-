import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLearning } from '../../hooks/useLearning';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import LazyVideo from './LazyVideo';
import {
  Play,
  CheckCircle,
  BookOpen,
  FileText,
  Clock,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const LearningMaterials = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    isEnrolled,
    learningProgress,
    completeLesson,
    updateProgress,
    getCourseCompletionPercentage
  } = useLearning();

  // Pick course from search params or active context
  const courseId = searchParams.get('courseId') || selectedCourseId || '101';
  const course = courses.find(c => c.id === String(courseId)) || courses[0];

  const enrolled = isEnrolled(course?.id);
  const completedLessons = learningProgress[course?.id]?.completedLessons || [];

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // Conditional Rendering State: "Course not enrolled" (Experiment 2h)
  if (!enrolled) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Course not enrolled</h2>
        <p className="text-sm text-slate-600 mb-6">
          You must be enrolled in <strong className="text-indigo-600">{course?.title}</strong> to access these proprietary course materials and lectures.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate(`/enrollment/${course?.id}`)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Enroll in this Course Now
          </Button>
          <Button variant="outline" onClick={() => navigate('/courses')}>
            Browse Catalog
          </Button>
        </div>
      </div>
    );
  }

  const materials = course?.learningMaterials || [];
  const currentLesson = materials[activeLessonIndex] || materials[0];
  const isCurrentLessonCompleted = currentLesson && completedLessons.includes(currentLesson.id);

  const handleToggleCurrentLesson = () => {
    if (currentLesson) {
      updateProgress(course.id, currentLesson.id);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < materials.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
    } else {
      // Programmatic navigation to Progress Tracking (Experiment 3g)
      navigate(`/learning/progress?courseId=${course.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Context Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Active Study Module
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{course.title}</h2>
          <p className="text-xs text-slate-500">Instructor: {course.instructor} • {materials.length} Total Lessons</p>
        </div>

        <div className="w-full sm:w-60">
          <ProgressBar
            value={getCourseCompletionPercentage(course.id)}
            labelPrefix="Course Mastery"
          />
        </div>
      </div>

      {/* Main Material Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lesson Content & Media Simulator */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Interactive Media Simulator */}
            {currentLesson?.videoUrl && (
              <LazyVideo src={currentLesson.videoUrl} poster={currentLesson.videoPoster} title={currentLesson.title} className="relative aspect-video bg-slate-900" />
            )}
            <div className={`${currentLesson?.videoUrl ? 'hidden' : 'relative aspect-video'} bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center`}>
              <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer mb-3">
                <Play className="w-8 h-8 ml-1 fill-white" />
              </div>
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Video Lecture &amp; Walkthrough
              </p>
              <h3 className="text-base sm:text-lg font-bold text-white max-w-lg mt-1">
                {currentLesson?.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span>Duration: {currentLesson?.duration}</span>
                <span>•</span>
                <span>Type: {currentLesson?.type}</span>
              </div>
            </div>

            {/* Lesson Body */}
            <div className="p-6">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Module {activeLessonIndex + 1} of {materials.length}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  isCurrentLessonCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {isCurrentLessonCompleted ? 'Completed' : 'In Progress'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{currentLesson?.title}</h3>
              <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
                {currentLesson?.summary}
              </p>

              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                <p>{currentLesson?.content}</p>
              </div>

              {/* Learning Resources */}
              {currentLesson?.resources && (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Supplemental Reading &amp; Code References
                  </h4>
                  <ul className="space-y-1.5 text-xs text-indigo-800">
                    {currentLesson.resources.map((res, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant={isCurrentLessonCompleted ? "outline" : "success"}
                  onClick={handleToggleCurrentLesson}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  {isCurrentLessonCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                </Button>

                <Button
                  variant="primary"
                  onClick={handleNextLesson}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {activeLessonIndex < materials.length - 1 ? "Next Lesson" : "Proceed to Progress Tracking"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Lessons List Checklist */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Curriculum Modules</h3>
            <p className="text-xs text-slate-500 mb-4">
              {completedLessons.length} of {materials.length} completed
            </p>

            <div className="space-y-2">
              {materials.map((m, idx) => {
                const isDone = completedLessons.includes(m.id);
                const isActive = activeLessonIndex === idx;

                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'border-indigo-600' : 'border-slate-300'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {idx + 1}. {m.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.duration}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Flow Navigator */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(`/learning/progress?courseId=${course.id}`)}
              >
                Go to Progress Tracking
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(`/learning/quiz?courseId=${course.id}`)}
              >
                Go to Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningMaterials;
