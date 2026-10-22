import React from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '../components/common/Button';
import { Home as HomeIcon, AlertOctagon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">404</h1>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          The requested route does not exist or has been relocated within the learning management system.
        </p>
        <Link to="/" className={buttonClassName('primary', 'md')}>
          <span className="shrink-0"><HomeIcon className="w-4 h-4" /></span>
          <span>Return to Learning Portal Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
