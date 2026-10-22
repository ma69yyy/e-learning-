import React, { useRef, useEffect } from 'react';
import { Search, X, Focus } from 'lucide-react';
import Button from '../common/Button';

/**
 * SearchBar: Demonstrates useRef hook for DOM element referencing and auto-focusing
 */
const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search courses by title, keywords, or instructor..." }) => {
  // useRef hook to reference the DOM input element
  const searchInputRef = useRef(null);

  // Auto-focus search field on mount using useRef and useEffect (Requirement 1d)
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Programmatic DOM focus action demonstrating useRef capability
  const handleFocusClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      // Add a brief subtle pulse animation to highlight DOM element reference
      searchInputRef.current.classList.add('ring-4', 'ring-indigo-300');
      setTimeout(() => {
        searchInputRef.current?.classList.remove('ring-4', 'ring-indigo-300');
      }, 600);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="w-full" role="search" aria-label="Course catalog">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-indigo-500" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            aria-label="Search courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-xs transition-all"
          />

          {searchTerm && (
            <button
              type="button"
              aria-label="Clear course search"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* DOM Reference Demonstration Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleFocusClick}
          icon={<Focus className="w-4 h-4 text-indigo-600" />}
          className="shrink-0 text-xs py-3"
          title="Demonstrates useRef DOM element referencing"
        >
          Auto Focus (useRef)
        </Button>
      </div>

      <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
        <span>Tip: Type to filter courses dynamically in real-time</span>
        <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
          useRef &amp; useEffect Active
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
