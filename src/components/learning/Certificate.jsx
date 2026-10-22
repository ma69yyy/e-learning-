import React, { useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../../hooks/useLearning';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Certificate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    courses,
    selectedCourseId,
    isEnrolled,
    learningProgress,
    getQuizScore,
    getAssignmentStatus,
    isCertificateEligible,
    getCourseCompletionPercentage
  } = useLearning();

  const certificateRef = useRef(null);

  const courseId = searchParams.get('courseId') || selectedCourseId || '101';
  const course = courses.find(c => c.id === String(courseId)) || courses[0];

  const enrolled = isEnrolled(course?.id);
  const quizRecord = getQuizScore(course?.id);
  const assignmentRecord = getAssignmentStatus(course?.id, course?.assignments?.[0]?.id);
  const eligible = isCertificateEligible(course?.id);
  const completionPercentage = getCourseCompletionPercentage(course?.id);

  const completedLessons = learningProgress[course?.id]?.completedLessons || [];
  const totalLessons = course?.learningMaterials?.length || 1;
  const lessonsCompleted = completedLessons.length >= totalLessons || (completedLessons.length / totalLessons) >= 0.8;

  // Conditional Rendering State: "Course not enrolled" (Experiment 2h)
  if (!enrolled) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Course not enrolled</h2>
        <p className="text-sm text-slate-600 mb-6">
          You must be enrolled in <strong className="text-indigo-600">{course?.title}</strong> to view or earn a certificate of completion.
        </p>
        <Button variant="primary" onClick={() => navigate(`/enrollment/${course?.id}`)}>
          Enroll in this Course
        </Button>
      </div>
    );
  }

  // Conditional Rendering State: "Quiz not completed" (Experiment 2h)
  if (!quizRecord || !quizRecord.passed) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Quiz not completed</h2>
        <p className="text-sm text-slate-600 mb-6">
          You must pass the course assessment quiz with a minimum score of 70% before your accredited certificate can be generated.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate(`/learning/quiz?courseId=${course.id}`)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Take Assessment Quiz Now
          </Button>
          <Button variant="outline" onClick={() => navigate(`/learning/progress?courseId=${course.id}`)}>
            View Progress
          </Button>
        </div>
      </div>
    );
  }

  // Conditional Rendering State: "Certificate not available" (Experiment 2h)
  if (!eligible) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 max-w-2xl mx-auto my-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Certificate not available</h2>
          <p className="text-sm text-slate-600 mt-1">
            Complete the remaining course milestones below to unlock your verified credential.
          </p>
        </div>

        {/* Milestone Checklist */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Eligibility Requirements:
          </h4>

          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
            <span className="font-medium text-slate-800 flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${lessonsCompleted ? 'text-emerald-500' : 'text-slate-300'}`} />
              Complete at least 80% of curriculum lessons
            </span>
            <span className="font-bold text-slate-700">
              {completedLessons.length} / {totalLessons} ({Math.round((completedLessons.length / totalLessons) * 100)}%)
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
            <span className="font-medium text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Pass course quiz (&gt;= 70%)
            </span>
            <span className="font-bold text-emerald-600">Passed ({quizRecord.score}%)</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
            <span className="font-medium text-slate-800 flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${assignmentRecord ? 'text-emerald-500' : 'text-slate-300'}`} />
              Submit required practical assignment
            </span>
            <span className={`font-bold ${assignmentRecord ? 'text-emerald-600' : 'text-amber-600'}`}>
              {assignmentRecord ? 'Submitted' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {!lessonsCompleted && (
            <Button
              variant="primary"
              onClick={() => navigate(`/learning/materials?courseId=${course.id}`)}
            >
              Resume Lessons
            </Button>
          )}
          {!assignmentRecord && (
            <Button
              variant="primary"
              onClick={() => navigate(`/learning/assignments?courseId=${course.id}`)}
            >
              Complete Assignment
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Certificate Verified & Rendered State
  const handlePrint = () => {
    window.print();
  };

  const studentName = user?.name || "Alex Johnson";
  const verificationCode = `EDV-${course.id}-${Math.abs(studentName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Accredited Certificate Earned!</h3>
            <p className="text-xs text-slate-500">
              Verified credential issued to <strong className="text-indigo-600">{studentName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
          >
            Print / Save as PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert(`Verification URL copied: https://eduvantage.edu/verify/${verificationCode}`)}
            icon={<Share2 className="w-4 h-4" />}
          >
            Share Credential
          </Button>
        </div>
      </div>

      {/* Official Certificate Canvas */}
      <div
        ref={certificateRef}
        className="relative bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 rounded-3xl border-8 border-double border-indigo-950 p-8 sm:p-14 text-center shadow-xl overflow-hidden print:m-0 print:border-4"
      >
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <GraduationCap className="w-96 h-96 text-slate-900" />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-900 text-amber-400 flex items-center justify-center shadow-lg mb-3">
            <Award className="w-9 h-9" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-900">
            EduVantage Global Academy of Learning
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 mt-2 tracking-tight">
            Certificate of Excellence
          </h1>
          <div className="w-24 h-1 bg-amber-500 rounded-full mt-3"></div>
        </div>

        {/* Certificate Body */}
        <div className="max-w-2xl mx-auto my-6 space-y-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
            This is proudly conferred upon
          </p>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-indigo-950 tracking-wide border-b-2 border-indigo-100 pb-2 inline-block px-8">
            {studentName}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
            for successfully fulfilling all rigorous pedagogical requirements, module lectures, graded knowledge assessments, and practical capstone projects for the program:
          </p>

          <h3 className="text-lg sm:text-2xl font-bold text-slate-900 py-2">
            "{course.title}"
          </h3>

          <p className="text-xs text-slate-500">
            Under the academic direction of <strong>{course.instructor}</strong> • {course.duration} Curriculum
          </p>
        </div>

        {/* Footer Credentials & Signatures */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
          {/* Signature 1 */}
          <div className="text-center sm:text-left">
            <div className="font-serif italic text-base text-indigo-900 font-bold border-b border-slate-300 pb-1">
              {course.instructor}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 uppercase font-semibold">Lead Course Instructor</p>
          </div>

          {/* Official Verification Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/70 bg-amber-50 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-600 mt-1">
              ID: {verificationCode}
            </span>
          </div>

          {/* Signature 2 */}
          <div className="text-center sm:text-right">
            <div className="font-serif italic text-base text-indigo-900 font-bold border-b border-slate-300 pb-1">
              {issueDate}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 uppercase font-semibold">Date of Conferral</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
