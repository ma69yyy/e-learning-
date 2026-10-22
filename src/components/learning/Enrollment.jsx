import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { useLearning } from '../../hooks/useLearning';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { isValidEmail, sanitizePlainText } from '../../utils/security';
import { CheckCircle2, User, Mail, Award, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

const Enrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, isLoadingCourses } = useCourses();
  const { user } = useAuth();
  const { isEnrolled, enrollCourse, setSelectedCourseId } = useLearning();

  const course = courses.find(c => String(c.id) === String(id));

  // Controlled Enrollment Form state
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    studentEmail: user?.email || '',
    studentId: user?.studentId || 'STD-2026-88',
    termsAccepted: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  // Form validation for Enrollment
  const validate = () => {
    const errs = {};
    if (!formData.studentName.trim()) {
      errs.studentName = 'Student name is required.';
    }
    if (!formData.studentEmail.trim()) {
      errs.studentEmail = 'Student email is required.';
    } else if (!isValidEmail(formData.studentEmail)) {
      errs.studentEmail = 'Please provide a valid email address.';
    }
    if (!formData.studentId.trim()) {
      errs.studentId = 'Student ID is required.';
    }
    if (!formData.termsAccepted) {
      errs.terms = 'You must accept the enrollment terms.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizePlainText(value, name === 'studentEmail' ? 254 : 160)
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      enrollCourse(course.id, {
        ...formData,
        studentName: sanitizePlainText(formData.studentName, 100),
        studentEmail: sanitizePlainText(formData.studentEmail, 254),
        studentId: sanitizePlainText(formData.studentId, 64),
      });
      setSelectedCourseId(course.id);
      setIsSubmitting(false);
      setEnrolledSuccess(true);
    }, 400);
  };

  const handleProceedToLearning = () => {
    setSelectedCourseId(course.id);
    navigate(`/learning/materials?courseId=${course.id}`);
  };

  if (isLoadingCourses) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-600" role="status" aria-live="polite">
        Loading course enrollment…
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Course not found</h1>
        <p className="mt-2 mb-6 text-sm text-slate-600">We could not locate course ID {id} in the catalog.</p>
        <Button variant="outline" onClick={() => navigate('/courses')}>Browse Courses</Button>
      </div>
    );
  }

  const alreadyEnrolled = isEnrolled(course?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation & Stepper */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to={`/course/${course.id}`} className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Course
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Enrollment Portal</span>
      </div>

      {/* Programmatic Stepper Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Programmatic Flow (useNavigate sequence):
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">1. Course Details</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 bg-indigo-600 text-white rounded-full">2. Enrollment</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">3. Learning Materials</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">4. Progress Tracking</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Course Summary Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full aspect-video object-cover rounded-xl mb-4"
              loading="lazy"
              decoding="async"
            />
            <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded">
              {course.category}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">{course.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{course.instructor}</p>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Total Duration:</span>
                <span className="font-bold text-slate-800">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Curriculum:</span>
                <span className="font-bold text-slate-800">{course.learningMaterials?.length} Modules</span>
              </div>
              <div className="flex justify-between">
                <span>Tuition:</span>
                <span className="font-black text-indigo-600 text-sm">{course.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Controlled Enrollment Form or Success View */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {enrolledSuccess || alreadyEnrolled ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {enrolledSuccess ? "Enrollment Confirmed!" : "Already Enrolled"}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                  You are registered for <strong className="text-indigo-600">{course.title}</strong>. You can now access all learning materials, track progress, and take the final assessment.
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleProceedToLearning}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Learning Materials
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Confirm Student Enrollment</h2>
                <p className="text-xs text-slate-500 mb-6">
                  Verify your registration details before confirming your placement in this course.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Student Full Name"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    error={errors.studentName}
                    icon={<User className="w-4 h-4" />}
                    required
                  />

                  <Input
                    label="Student Email Address"
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleChange}
                    error={errors.studentEmail}
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />

                  <Input
                    label="Student ID"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    error={errors.studentId}
                    icon={<Award className="w-4 h-4" />}
                    required
                  />

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                      />
                      <span>
                        I agree to complete quizzes, submit required assignments honestly, and adhere to the student honor code.
                      </span>
                    </label>
                    {errors.terms && <p role="alert" className="text-xs text-rose-600 mt-1">{errors.terms}</p>}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      icon={<ShieldCheck className="w-4 h-4" />}
                      className="w-full sm:w-auto"
                    >
                      Complete Enrollment &amp; Begin Learning
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
