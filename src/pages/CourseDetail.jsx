import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useLearning } from '../hooks/useLearning';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import {
  ArrowLeft,
  Clock,
  Award,
  Layers,
  Star,
  BookOpen,
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const CourseDetail = () => {
  // Use useParams() to retrieve course ID dynamically from URL (Experiment 3d)
  const { id } = useParams();
  const navigate = useNavigate();

  const { courses } = useCourses();
  const { isEnrolled, getCourseCompletionPercentage, setSelectedCourseId } = useLearning();

  // Find course matching dynamic route param
  const course = courses.find(c => String(c.id) === String(id));

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Course Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          We could not locate course ID <span className="font-mono text-rose-600 font-semibold">{id}</span> in our catalog.
        </p>
        <Button variant="primary" onClick={() => navigate('/courses')} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Course Catalog
        </Button>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);
  const completionPercentage = getCourseCompletionPercentage(course.id);

  // Programmatic navigation through learning process (Experiment 3g)
  const handleProceedToEnrollment = () => {
    setSelectedCourseId(course.id);
    navigate(`/enrollment/${course.id}`);
  };

  const handleProceedToLearning = () => {
    setSelectedCourseId(course.id);
    navigate(`/learning/materials?courseId=${course.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/courses" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>
        <span>/</span>
        <span className="text-slate-400">{course.category}</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{course.title}</span>
      </div>

      {/* Programmatic Learning Flow Stepper Bar (Experiment 3g) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Programmatic Learning Process (useNavigate Flow):
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 bg-indigo-600 text-white rounded-full">1. Course Details ({course.id})</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className={`px-3 py-1 rounded-full ${enrolled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
            2. Enrollment
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">3. Learning Materials</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">4. Progress Tracking</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">5. Quiz</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">6. Assignment</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">7. Certificate</span>
        </div>
      </div>

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Course Information (Experiment 3d) */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                {course.category}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                {course.difficulty} Level
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                ID: {course.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {course.title}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {course.description}
            </p>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-2xl border border-slate-200">
              <div className="text-left">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Duration
                </span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{course.duration}</p>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Rating
                </span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{course.rating} / 5.0</p>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Difficulty
                </span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{course.difficulty}</p>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Curriculum
                </span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{course.learningMaterials?.length} Modules</p>
              </div>
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Course Instructor</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{course.instructor}</h4>
                <p className="text-xs text-indigo-600 font-medium">{course.instructorRole || 'Lead Technical Instructor'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Dedicated educator with over a decade of industry mentorship in applied software engineering.
                </p>
              </div>
            </div>
          </div>

          {/* Learning Materials Curriculum List (Experiment 3d) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Curriculum &amp; Learning Materials</h3>
                <p className="text-xs text-slate-500">Comprehensive modular roadmap with practical hands-on exercises.</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {course.learningMaterials?.length} Modules
              </span>
            </div>

            <div className="space-y-3">
              {course.learningMaterials?.map((mat, index) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{mat.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{mat.summary}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-3 h-3 text-indigo-500" /> {mat.type}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {mat.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {enrolled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/learning/materials?courseId=${course.id}`)}
                      className="shrink-0 text-xs"
                    >
                      Open Lesson
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Card & Action */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="relative aspect-video">
              <img src={course.thumbnail} alt={course.title} loading="lazy" decoding="async" fetchPriority="low" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Certificate Program
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {enrolled ? (
                <div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-center">
                    <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> You are enrolled in this course!
                    </span>
                  </div>

                  <ProgressBar value={completionPercentage} labelPrefix="Your Progress" className="mb-4" />

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleProceedToLearning}
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Go to Learning Materials
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-xs text-slate-400 line-through mr-2">$129.99</span>
                      <span className="text-3xl font-black text-slate-900">{course.price}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      30% Off Limited Offer
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mb-3"
                    onClick={handleProceedToEnrollment}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to Enrollment
                  </Button>

                  <p className="text-center text-[11px] text-slate-400">
                    Instant access to all modules, quizzes &amp; assignments.
                  </p>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Full lifetime access to materials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Graded quiz and coding assignment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Accredited completion certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
