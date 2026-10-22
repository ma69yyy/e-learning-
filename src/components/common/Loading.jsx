import React from 'react';

/**
 * Reusable Loading spinner / placeholder component
 */
const Loading = ({ message = 'Loading learning content...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-ping"></div>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        <p className="text-xs text-slate-500 mt-0.5">Please wait while modules and materials are retrieved.</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
