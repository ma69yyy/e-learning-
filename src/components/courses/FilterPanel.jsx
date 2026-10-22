import React from 'react';
import { CATEGORIES, DIFFICULTIES, DURATIONS } from '../../data/courseFilters';
import { Filter, RotateCcw, Clock, Layers, Award, User } from 'lucide-react';
import Button from '../common/Button';

const FilterPanel = ({
  selectedCategory,
  setSelectedCategory,
  difficultyLevel,
  setDifficultyLevel,
  durationFilter,
  setDurationFilter,
  instructorFilter,
  setInstructorFilter,
  instructors = [],
  resetFilters,
  totalMatching = 0
}) => {
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    difficultyLevel !== 'All' ||
    durationFilter !== 'All' ||
    instructorFilter !== 'All';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Course Filter Panel</span>
          <span className="text-xs font-normal text-slate-500">
            ({totalMatching} result{totalMatching === 1 ? '' : 's'})
          </span>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            icon={<RotateCcw className="w-3.5 h-3.5 text-rose-500" />}
            className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            Reset Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="course-category-filter" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Category
          </label>
          <select
            id="course-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label htmlFor="course-difficulty-filter" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            Difficulty
          </label>
          <select
            id="course-difficulty-filter"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
          >
            {DIFFICULTIES.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <label htmlFor="course-duration-filter" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Duration
          </label>
          <select
            id="course-duration-filter"
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
          >
            {DURATIONS.map(dur => (
              <option key={dur.value} value={dur.value}>{dur.label}</option>
            ))}
          </select>
        </div>

        {/* Instructor Filter */}
        <div>
          <label htmlFor="course-instructor-filter" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-500" />
            Instructor
          </label>
          <select
            id="course-instructor-filter"
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
          >
            {instructors.map(inst => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
