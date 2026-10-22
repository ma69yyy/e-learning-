import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import Button, { buttonClassName } from '../common/Button';
import ProgressBar from '../common/ProgressBar';

/**
 * Reusable CourseCard component displaying comprehensive course details
 */
const CourseCard = ({
  course,
  isEnrolled = false,
  completionPercentage = 0,
  onEnroll
}) => {
  const navigate = useNavigate();

  const getDifficultyBadge = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Advanced':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#dbe3ee] shadow-[0_8px_24px_rgba(31,54,84,.055)] hover:shadow-[0_16px_32px_rgba(31,54,84,.11)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Course Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[11px] font-bold bg-white/95 backdrop-blur-xs text-slate-800 px-2.5 py-1 rounded-full shadow-xs">
            {course.category}
          </span>
          <span className={`text-[11px] font-bold border px-2.5 py-1 rounded-full backdrop-blur-xs ${getDifficultyBadge(course.difficulty)}`}>
            {course.difficulty}
          </span>
        </div>

        {isEnrolled && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Enrolled
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.duration}
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {course.rating}
              <span className="text-slate-400 font-normal">({course.studentsCount?.toLocaleString()})</span>
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
              <Link to={`/course/${course.id}`}>{course.title}</Link>
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>

          <div className="flex items-center gap-2 mb-4 text-xs text-slate-700">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
              {course.instructor.charAt(0)}
            </div>
            <span className="font-medium truncate">{course.instructor}</span>
          </div>
        </div>

        {/* Bottom Section: Progress or Price & Actions */}
        <div className="pt-3 border-t border-slate-100">
          {isEnrolled ? (
            <div className="space-y-3">
              <ProgressBar value={completionPercentage} labelPrefix="Course Completion" />
              <div className="flex gap-2">
                <Link to={`/course/${course.id}`} className={`flex-1 ${buttonClassName('outline', 'sm', 'w-full text-xs')}`}>
                  View Details
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/learning?courseId=${course.id}`)}
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 line-through mr-1.5">$129.99</span>
                <span className="text-lg font-black text-slate-900">{course.price}</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/course/${course.id}`} className={buttonClassName('outline', 'sm', 'text-xs')}>
                  Details
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs"
                  onClick={() => onEnroll ? onEnroll(course.id) : navigate(`/enrollment/${course.id}`)}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Enroll
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
