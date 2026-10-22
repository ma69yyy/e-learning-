import React from 'react';
import { Calendar, Award, FileText, CheckCircle, Clock } from 'lucide-react';
import Button from '../common/Button';

/**
 * Reusable AssignmentCard component showing assignment details, deadlines, rubric, and status
 */
const AssignmentCard = ({
  assignment,
  submission,
  onOpenSubmission
}) => {
  const isSubmitted = Boolean(submission);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-indigo-200 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
            Course Practical Project
          </span>
          {isSubmitted ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> Submitted &amp; Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Clock className="w-3.5 h-3.5" /> Action Required
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">{assignment.title}</h3>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">{assignment.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Due: <strong className="text-slate-800">{assignment.dueDate}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>Max Score: <strong className="text-slate-800">{assignment.points} pts</strong></span>
          </div>
        </div>

        {isSubmitted && (
          <div className="mb-4 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
            <div className="flex justify-between font-bold text-emerald-900">
              <span>Grade Assigned:</span>
              <span>{submission.grade}</span>
            </div>
            <p className="text-slate-600 text-[11px] font-mono truncate">
              Repo: {submission.repoUrl}
            </p>
            {submission.feedback && (
              <p className="text-emerald-800 text-[11px] italic mt-1">"{submission.feedback}"</p>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <Button
          variant={isSubmitted ? "outline" : "primary"}
          size="sm"
          onClick={() => onOpenSubmission(assignment)}
          icon={<FileText className="w-3.5 h-3.5" />}
          className="w-full text-xs"
        >
          {isSubmitted ? "Review Submission" : "Submit Assignment"}
        </Button>
      </div>
    </div>
  );
};

export default AssignmentCard;
