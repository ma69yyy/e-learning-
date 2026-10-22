import React from 'react';

/**
 * Reusable ProgressBar with animated progress, custom color tiers, and label support
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = true,
  height = 'h-2.5',
  color = null,
  labelPrefix = '',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  // Dynamic color depending on completion percentage if color is not explicitly specified
  const getAutoColor = () => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-indigo-600';
    if (percentage >= 25) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const barColor = color || getAutoColor();

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold">
          <span className="text-slate-600">{labelPrefix || 'Progress'}</span>
          <span className="text-slate-900 font-bold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${barColor} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-label={labelPrefix || 'Learning progress'}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
