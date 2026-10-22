import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../../hooks/useLearning';
import AssignmentCard from './AssignmentCard';
import Input from '../common/Input';
import Button from '../common/Button';
import { isSafeHttpUrl, sanitizePlainText } from '../../utils/security';
import {
  FileCheck2,
  GitBranch,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Send,
  X
} from 'lucide-react';

const Assignment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    courses,
    selectedCourseId,
    isEnrolled,
    submitAssignment,
    getAssignmentStatus
  } = useLearning();

  const courseId = searchParams.get('courseId') || selectedCourseId || '101';
  const course = courses.find(c => c.id === String(courseId)) || courses[0];

  const enrolled = isEnrolled(course?.id);
  const assignments = course?.assignments || [];

  // Selected assignment for modal/form submission
  const [activeAssignment, setActiveAssignment] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!activeAssignment || !dialogRef.current) return undefined;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]';
    const focusableElements = () => Array.from(dialog.querySelectorAll(focusableSelector));
    focusableElements()[0]?.focus();

    const handleDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveAssignment(null);
        return;
      }
      if (event.key !== 'Tab') return;
      const elements = focusableElements();
      if (elements.length === 0) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === elements[0]) {
        event.preventDefault();
        elements[elements.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === elements[elements.length - 1]) {
        event.preventDefault();
        elements[0].focus();
      }
    };

    dialog.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      dialog.removeEventListener('keydown', handleDialogKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [activeAssignment]);

  // Controlled form state for assignment submission
  const [formData, setFormData] = useState({
    repoUrl: '',
    liveUrl: '',
    notes: '',
    honorCode: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Conditional Rendering State: "Course not enrolled"
  if (!enrolled) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Course not enrolled</h2>
        <p className="text-sm text-slate-600 mb-6">
          You must be enrolled in <strong className="text-indigo-600">{course?.title}</strong> to view and submit practical assignments.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate(`/enrollment/${course?.id}`)}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Enroll in this Course
        </Button>
      </div>
    );
  }

  const handleOpenSubmission = (assignment) => {
    setActiveAssignment(assignment);
    const existing = getAssignmentStatus(course.id, assignment.id);
    if (existing) {
      setFormData({
        repoUrl: existing.repoUrl || '',
        liveUrl: existing.liveUrl || '',
        notes: existing.notes || '',
        honorCode: true
      });
    } else {
      setFormData({
        repoUrl: 'https://github.com/alex-johnson/elearn-practical-solution',
        liveUrl: 'https://elearn-solution.vercel.app',
        notes: 'Implemented using custom hooks, Context API, responsive Tailwind layout, and full test suite.',
        honorCode: true
      });
    }
    setErrors({});
    setSubmitSuccess(false);
  };

  // Form validation for Assignment submission (Experiment 4f)
  const validate = () => {
    const errs = {};
    if (!formData.repoUrl.trim()) {
      errs.repoUrl = 'Repository URL is required.';
    } else if (!isSafeHttpUrl(formData.repoUrl)) {
      errs.repoUrl = 'Please enter a valid URL (e.g., https://github.com/...)';
    }

    if (formData.liveUrl.trim() && !isSafeHttpUrl(formData.liveUrl)) {
      errs.liveUrl = 'Please enter a valid HTTP or HTTPS URL.';
    }

    if (!formData.notes.trim()) {
      errs.notes = 'Implementation notes and architecture summary are required.';
    } else if (formData.notes.trim().length < 15) {
      errs.notes = 'Please provide at least 15 characters describing your approach.';
    } else if (formData.notes.length > 5000) {
      errs.notes = 'Notes must be 5,000 characters or fewer.';
    }

    if (!formData.honorCode) {
      errs.honorCode = 'You must certify this is your original work.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'notes' ? sanitizePlainText(value, 5000) : value
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
      submitAssignment(course.id, activeAssignment.id, {
        ...formData,
        repoUrl: formData.repoUrl.trim(),
        liveUrl: formData.liveUrl.trim(),
        notes: sanitizePlainText(formData.notes, 5000),
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 400);
  };

  const allSubmitted = assignments.every(a => Boolean(getAssignmentStatus(course.id, a.id)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Practical Project Submissions
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{course.title}</h2>
          <p className="text-xs text-slate-500">
            Submit your project repository and deliverables for peer &amp; automated rubric grading.
          </p>
        </div>

        {allSubmitted && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> All Assignments Complete
          </div>
        )}
      </div>

      {/* Assignment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map(assignment => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            submission={getAssignmentStatus(course.id, assignment.id)}
            onOpenSubmission={handleOpenSubmission}
          />
        ))}
      </div>

      {/* Programmatic Navigation Forward */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-500">
          Once your assignment is submitted and quiz passed, you can claim your accredited Certificate.
        </span>
        <Button
          variant="primary"
          onClick={() => navigate(`/learning/certificate?courseId=${course.id}`)}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Certificate
        </Button>
      </div>

      {/* Submission Modal / Dialog */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="assignment-dialog-title" tabIndex={-1} className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Assignment Submission Portal
                </span>
                <h3 id="assignment-dialog-title" className="text-lg font-bold text-slate-900 mt-1">{activeAssignment.title}</h3>
              </div>
              <button
                type="button"
                aria-label="Close assignment submission"
                onClick={() => setActiveAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Assignment Successfully Submitted!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 mb-6">
                  Your project has been recorded in the gradebook and validated with passing score.
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setActiveAssignment(null)}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveAssignment(null);
                      navigate(`/learning/certificate?courseId=${course.id}`);
                    }}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Certificate
                  </Button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <p className="font-semibold text-slate-700">Submission Guidelines:</p>
                  <p className="text-slate-600">{activeAssignment.submissionGuidelines}</p>
                </div>

                <Input
                  label="GitHub / Code Repository URL"
                  type="url"
                  name="repoUrl"
                  value={formData.repoUrl}
                  onChange={handleChange}
                  error={errors.repoUrl}
                  placeholder="https://github.com/username/project"
                  icon={<GitBranch className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Live Deployment Link (Optional)"
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  error={errors.liveUrl}
                  placeholder="https://my-demo-app.vercel.app"
                  icon={<Globe className="w-4 h-4" />}
                />

                <div className="text-left">
                  <label htmlFor="assignment-notes" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Architecture &amp; Implementation Notes <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="assignment-notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    maxLength={5000}
                    aria-invalid={Boolean(errors.notes)}
                    aria-describedby={errors.notes ? 'assignment-notes-error' : undefined}
                    className={`w-full text-xs rounded-lg border p-3 focus:outline-none focus:ring-2 ${
                      errors.notes
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-500'
                    }`}
                    placeholder="Describe how hooks, Context API, and state flows were structured..."
                  />
                  {errors.notes && <p id="assignment-notes-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.notes}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      aria-invalid={Boolean(errors.honorCode)}
                      name="honorCode"
                      checked={formData.honorCode}
                      onChange={handleChange}
                      className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                    />
                    <span>
                      I affirm that this submission represents my own work in accordance with the course academic integrity standards.
                    </span>
                  </label>
                  {errors.honorCode && <p role="alert" className="text-xs text-rose-600 mt-1">{errors.honorCode}</p>}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setActiveAssignment(null)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                    icon={<Send className="w-3.5 h-3.5" />}
                  >
                    Submit Deliverable
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignment;
