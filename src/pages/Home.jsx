import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useLearning } from '../hooks/useLearning';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/courses/CourseCard';
import Button, { buttonClassName } from '../components/common/Button';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Compass
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { courses } = useCourses();
  const { isEnrolled, getCourseCompletionPercentage } = useLearning();
  const { isAuthenticated, user } = useAuth();

  const featuredCourses = courses.slice(0, 3);

  const learningSteps = [
    { num: "01", title: "Course Details", desc: "Explore syllabus, instructor profiles, prerequisites, and learning objectives." },
    { num: "02", title: "Instant Enrollment", desc: "Confirm student credentials and enroll with single-click verification." },
    { num: "03", title: "Learning Materials", desc: "Interact with modular video lectures, reading references, and code sandboxes." },
    { num: "04", title: "Progress Tracking", desc: "Monitor automated milestones calculated via useMemo hooks." },
    { num: "05", title: "Interactive Quiz", desc: "Complete timed assessments with immediate scoring and detailed feedback." },
    { num: "06", title: "Capstone Assignment", desc: "Submit project deliverables and GitHub repositories against rubrics." },
    { num: "07", title: "Accredited Certificate", desc: "Receive cryptographically verified credentials ready for print or sharing." }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden soft-grid border-y border-[#dfe7f1] bg-[#f8fbff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center max-w-3xl mx-auto py-12 lg:py-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf0f8] border border-[#cbd9ea] text-[#315b8f] text-xs font-bold mb-6">
              <Sparkles className="w-4 h-4 text-[#315b8f]" />
              <span>Next-Generation E-Learning Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#172033] tracking-[-0.045em] leading-[1.05] mb-6">
              Empower Your Future with <span className="text-[#315b8f]">Modern Digital Skills</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Explore dynamic curricula in Web Development, Data Science, Cloud, UI/UX, and Cybersecurity. Track progress in real-time, pass quizzes, and earn industry-recognized certificates.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses" className={buttonClassName('primary', 'lg')}>
                <span className="shrink-0"><BookOpen className="w-5 h-5" /></span>
                <span>Explore All Courses</span>
              </Link>
              <Link to={isAuthenticated ? "/learning" : "/login"} className={buttonClassName('outline', 'lg')}>
                <span className="shrink-0"><GraduationCap className="w-5 h-5" /></span>
                <span>{isAuthenticated ? `Continue Learning (${user?.name})` : "Student Portal Login"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white rounded-3xl border border-[#dbe3ee] shadow-[0_16px_38px_rgba(31,54,84,.06)] text-center">
          <div>
            <div className="text-3xl font-black text-indigo-600">{courses.length}+</div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Curated Courses
            </p>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">50,000+</div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Active Learners
            </p>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600">98.4%</div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Completion Satisfaction
            </p>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-500">100%</div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Verified Certificates
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Programmatic Learning Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Guided Pedagogical Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            The Seven-Step Learning Methodology
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered using React Router v7 programmatic navigation (`useNavigate`) and Context state persistence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-gradient-to-br from-[#eaf0f8] to-white border-[#b9cce2] shadow-sm'
                  : 'bg-white border-[#dbe3ee] hover:border-[#aebfd3]'
              }`}
            >
              <div className="text-xs font-mono font-bold text-indigo-600 mb-2">{step.num}</div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
          {/* Final Launch Card */}
          <div className="p-5 rounded-2xl bg-[#183a68] text-white flex flex-col justify-between shadow-[0_12px_24px_rgba(24,58,104,.16)]">
            <div>
              <div className="text-xs font-mono font-bold text-indigo-200 mb-2">Ready?</div>
              <h3 className="font-bold text-white text-sm mb-1">Begin Learning Now</h3>
              <p className="text-xs text-indigo-100">
                Pick a course to start your guided journey from module 1 to verified certificate.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/courses')}
              className="mt-4 bg-white text-indigo-900 hover:bg-indigo-50 text-xs"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Start Course
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Recommended Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Featured Professional Courses
            </h2>
          </div>
          <Link to="/courses" className={buttonClassName('outline', 'sm')}>
            <span className="shrink-0"><Compass className="w-4 h-4" /></span>
            <span>View All Courses</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={isEnrolled(course.id)}
              completionPercentage={getCourseCompletionPercentage(course.id)}
              onEnroll={(id) => navigate(`/enrollment/${id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
