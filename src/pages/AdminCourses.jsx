import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Check, ChevronDown, CircleAlert, Edit3, Plus,
  Search, ShieldCheck, Trash2, X
} from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { CATEGORIES, DIFFICULTIES } from '../data/courseFilters';
import { isSafeHttpUrl, sanitizePlainText } from '../utils/security';

const EMPTY_FORM = {
  title: '',
  category: 'Web Development',
  difficulty: 'Beginner',
  instructor: '',
  instructorRole: '',
  durationHours: '8',
  price: '0',
  thumbnail: '',
  description: ''
};

const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700';

const AdminCourses = () => {
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses();
  const [search, setSearch] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const visibleCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter(course =>
      [course.title, course.category, course.instructor, course.id]
        .some(value => String(value || '').toLowerCase().includes(query))
    );
  }, [courses, search]);

  const openCreate = () => {
    setEditingCourse(null);
    setEditorOpen(true);
    setForm(EMPTY_FORM);
    setError('');
    setSavedMessage('');
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setEditorOpen(true);
    setForm({
      title: course.title || '',
      category: course.category || 'Web Development',
      difficulty: course.difficulty || 'Beginner',
      instructor: course.instructor || '',
      instructorRole: course.instructorRole || '',
      durationHours: String(course.durationHours || 1),
      price: String(course.price || '').replace(/[^0-9.]/g, '') || '0',
      thumbnail: course.thumbnail || '',
      description: course.description || ''
    });
    setError('');
    setSavedMessage('');
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingCourse(null);
    setError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = sanitizePlainText(form.title, 120);
    const category = sanitizePlainText(form.category, 60);
    const instructor = sanitizePlainText(form.instructor, 100);
    const description = sanitizePlainText(form.description, 1200);
    const hours = Number(form.durationHours);
    const price = Number(form.price);

    if (!title || !category || !instructor || !description) {
      setError('Add a course title, category, instructor, and description.');
      return;
    }
    if (!Number.isFinite(hours) || hours < 1 || hours > 500) {
      setError('Course duration must be between 1 and 500 hours.');
      return;
    }
    if (!Number.isFinite(price) || price < 0 || price > 100000) {
      setError('Enter a valid price between $0 and $100,000.');
      return;
    }
    const thumbnail = form.thumbnail.trim();
    if (thumbnail && !isSafeHttpUrl(thumbnail)) {
      setError('Thumbnail must be a valid HTTP or HTTPS image URL.');
      return;
    }

    const courseData = {
      title,
      category,
      difficulty: form.difficulty,
      instructor,
      instructorRole: sanitizePlainText(form.instructorRole, 120) || 'Course Instructor',
      durationHours: hours,
      price: `$${price.toFixed(2)}`,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      description
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
      setSavedMessage('Course changes saved.');
    } else {
      createCourse(courseData);
      setSavedMessage('Course added to the catalog.');
    }
    closeEditor();
  };

  const handleDelete = (course) => {
    const confirmed = window.confirm(`Delete “${course.title}”? This also removes its saved learner progress in this browser.`);
    if (!confirmed) return;
    deleteCourse(course.id);
    setSavedMessage('Course deleted.');
  };

  return (
    <div className="min-h-[70vh] bg-slate-50/80 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/courses" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#183a68]">
          <ArrowLeft className="h-4 w-4" /> Back to course catalog
        </Link>

        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[.16em] text-blue-800">
              <ShieldCheck className="h-3.5 w-3.5" /> Administrator workspace
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Course management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Add, update, and remove courses from the EduVantage learning catalog.</p>
          </div>
          <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183a68] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/10 transition hover:bg-[#224c82]">
            <Plus className="h-4 w-4" /> Add course
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total courses</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{courses.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Matching search</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{visibleCourses.length}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">Storage</p>
            <p className="mt-2 text-sm font-bold text-blue-950">Saved in this browser</p>
            <p className="mt-1 text-xs leading-5 text-blue-800">This demo does not connect to a shared server database.</p>
          </div>
        </div>

        {savedMessage && (
          <div role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <Check className="h-4 w-4" /> {savedMessage}
            <button className="ml-auto rounded p-1 hover:bg-emerald-100" aria-label="Dismiss message" onClick={() => setSavedMessage('')}><X className="h-4 w-4" /></button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">Catalog courses</h2>
              <p className="mt-1 text-xs text-slate-500">Changes appear on the public catalog immediately.</p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input aria-label="Search courses" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search title, category, instructor…" className={`${fieldClass} pl-9`} />
            </label>
          </div>

          {visibleCourses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <BookOpen className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 font-bold text-slate-800">No courses found</p>
              <p className="mt-1 text-sm text-slate-500">Try a different search or add a new course.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {visibleCourses.map(course => (
                <article key={course.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:px-6">
                  <img src={course.thumbnail} alt="" className="h-16 w-24 shrink-0 rounded-xl bg-slate-100 object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-bold text-slate-900">{course.title}</h3>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">#{course.id}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{course.category} <span className="px-1 text-slate-300">·</span> {course.difficulty} <span className="px-1 text-slate-300">·</span> {course.instructor}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-700">{course.duration || `${course.durationHours || 0} hours`} <span className="px-1 text-slate-300">·</span> {course.price || 'Free'}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={() => openEdit(course)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800">
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(course)} aria-label={`Delete ${course.title}`} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 px-3 py-2 text-xs font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p><strong>Demo-only access:</strong> this sample admin login and browser storage are for local demonstration. Production admin permissions and course data should be enforced by a server-side API and database.</p>
        </div>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeEditor(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="course-editor-title" className="my-5 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-700">Catalog details</p>
                <h2 id="course-editor-title" className="mt-1 text-xl font-black text-slate-900">{editingCourse ? 'Edit course' : 'Add a course'}</h2>
              </div>
              <button type="button" onClick={closeEditor} aria-label="Close editor" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-7">
              <div>
                <label className={labelClass} htmlFor="course-title">Course title</label>
                <input id="course-title" name="title" value={form.title} onChange={handleChange} maxLength={120} className={fieldClass} placeholder="e.g. Intro to Product Analytics" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="course-category">Category</label>
                  <div className="relative">
                    <select id="course-category" name="category" value={form.category} onChange={handleChange} className={`${fieldClass} appearance-none pr-9`}>
                      {CATEGORIES.filter(category => category !== 'All').map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="course-difficulty">Difficulty</label>
                  <div className="relative">
                    <select id="course-difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className={`${fieldClass} appearance-none pr-9`}>
                      {DIFFICULTIES.filter(level => level !== 'All').map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="course-instructor">Instructor</label>
                  <input id="course-instructor" name="instructor" value={form.instructor} onChange={handleChange} maxLength={100} className={fieldClass} placeholder="Instructor name" required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="course-instructor-role">Instructor title <span className="font-normal text-slate-400">(optional)</span></label>
                  <input id="course-instructor-role" name="instructorRole" value={form.instructorRole} onChange={handleChange} maxLength={120} className={fieldClass} placeholder="e.g. Senior Data Scientist" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="course-hours">Duration (hours)</label>
                  <input id="course-hours" name="durationHours" type="number" min="1" max="500" step="1" value={form.durationHours} onChange={handleChange} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="course-price">Price (USD)</label>
                  <input id="course-price" name="price" type="number" min="0" max="100000" step="0.01" value={form.price} onChange={handleChange} className={fieldClass} required />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="course-thumbnail">Thumbnail image URL <span className="font-normal text-slate-400">(optional)</span></label>
                <input id="course-thumbnail" name="thumbnail" type="url" value={form.thumbnail} onChange={handleChange} className={fieldClass} placeholder="https://example.com/course-image.jpg" />
              </div>
              <div>
                <label className={labelClass} htmlFor="course-description">Description</label>
                <textarea id="course-description" name="description" value={form.description} onChange={handleChange} maxLength={1200} rows={4} className={`${fieldClass} resize-y`} placeholder="Describe what learners will gain from this course…" required />
                <p className="mt-1 text-right text-[10px] text-slate-400">{form.description.length}/1200</p>
              </div>
              {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{error}</p>}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeEditor} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183a68] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#224c82]"><Check className="h-4 w-4" /> {editingCourse ? 'Save changes' : 'Add course'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
