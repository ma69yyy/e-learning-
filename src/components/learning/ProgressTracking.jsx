import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLearning } from '../../hooks/useLearning';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import {
  CheckCircle,
  Clock,
  Award,
  FileCheck,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const ProgressTracking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    courses,
    selectedCourseId,
    isEnrolled,
    learningProgress,
    getCourseCompletionPercentage,
    getQuizScore,
    getAssignmentStatus,
    isCertificateEligible
  } = useLearning();

  const courseId = searchParams.get('courseId') || selectedCourseId || '101';
  const course = courses.find(c => c.id === String(courseId)) || courses[0];

  const enrolled = isEnrolled(course?.id);

  if (!enrolled) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-8">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Course not enrolled</h3>
        <p className="text-xs text-slate-500 mb-4">
          Please enroll in {course?.title} to track your learning journey.
        </p>
        <Button variant="primary" onClick={() => navigate(`/enrollment/${course?.id}`)}>
          Enroll Now
        </Button>
      </div>
    );
  }

  const completionPercentage = getCourseCompletionPercentage(course.id);
  const quizRecord = getQuizScore(course.id);
  const assignmentRecord = getAssignmentStatus(course.id, course.assignments?.[0]?.id);
  const eligibleForCert = isCertificateEligible(course.id);
  const completedLessons = learningProgress[course.id]?.completedLessons || [];
  const totalLessons = course.learningMaterials?.length || 1;

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/10 text-indigo-300 px-3 py-1 rounded-full">
              Progress Tracking Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">{course.title}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Calculated using useMemo hooks for instant recalibration as lessons, quizzes, and assignments are completed.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center min-w-[200px]">
            <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Completion Score</span>
            <div className="text-4xl font-black mt-1 text-white">{completionPercentage}%</div>
            <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              completionPercentage >= 80 ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300'
            }`}>
              {completionPercentage >= 80 ? 'Distinction Level' : 'In Progress'}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <ProgressBar
            value={completionPercentage}
            showLabel={false}
            height="h-3"
            color="bg-emerald-400"
          />
        </div>
      </div>

      {/* Tri-Pillar Assessment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Modules / Lessons (60%) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Weight: 60%
              </span>
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Curriculum Lessons</h3>
            <p className="text-xs text-slate-500 mb-4">
              {completedLessons.length} of {totalLessons} modules finished
            </p>
            <ProgressBar
              value={completedLessons.length}
              max={totalLessons}
              showLabel={false}
              className="mb-4"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/learning/materials?courseId=${course.id}`)}
            className="w-full text-xs"
          >
            Review Course Materials
          </Button>
        </div>

        {/* Pillar 2: Quiz Assessment (20%) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Weight: 20%
              </span>
              <HelpCircle className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Knowledge Quiz</h3>
            <p className="text-xs text-slate-500 mb-4">
              Passing threshold: 70% or higher
            </p>
            {quizRecord ? (
              <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Score:</span>
                  <span className={quizRecord.passed ? "text-emerald-600" : "text-rose-600"}>
                    {quizRecord.score}% ({quizRecord.passed ? "Passed" : "Retake Needed"})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {quizRecord.correctCount} of {quizRecord.totalQuestions} questions correct
                </p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4 text-xs text-amber-800">
                Quiz not attempted yet
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/learning/quiz?courseId=${course.id}`)}
            className="w-full text-xs"
          >
            {quizRecord ? "Retake / Review Quiz" : "Take Quiz Assessment"}
          </Button>
        </div>

        {/* Pillar 3: Practical Assignment (20%) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Weight: 20%
              </span>
              <FileCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Practical Assignment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Hands-on coding or case study project
            </p>
            {assignmentRecord ? (
              <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs space-y-1">
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Status:</span>
                  <span>{assignmentRecord.status}</span>
                </div>
                <p className="text-[11px] text-slate-500">Grade: {assignmentRecord.grade}</p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4 text-xs text-amber-800">
                Assignment pending submission
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/learning/assignments?courseId=${course.id}`)}
            className="w-full text-xs"
          >
            {assignmentRecord ? "View Submission" : "Submit Assignment"}
          </Button>
        </div>
      </div>

      {/* Programmatic Navigation Forward */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Next Step in Learning Flow:</h4>
          <p className="text-xs text-slate-500">
            Proceed directly to the interactive Quiz assessment to validate your comprehension.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(`/learning/quiz?courseId=${course.id}`)}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Quiz
        </Button>
      </div>
    </div>
  );
};

export default ProgressTracking;
