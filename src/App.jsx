import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout & Common Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Protected Components & Routing
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import TokenSecurityWidget from './components/common/TokenSecurityWidget';
import { useAuth } from './context/AuthContext';
import { AlertTriangle } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const CourseList = lazy(() => import('./components/courses/CourseList'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Login = lazy(() => import('./components/auth/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./components/auth/Profile'));
const AdminCourses = lazy(() => import('./pages/AdminCourses'));
const Enrollment = lazy(() => import('./components/learning/Enrollment'));
const LearningDashboard = lazy(() => import('./components/learning/LearningDashboard'));
const LearningMaterials = lazy(() => import('./components/learning/LearningMaterials'));
const ProgressTracking = lazy(() => import('./components/learning/ProgressTracking'));
const Quiz = lazy(() => import('./components/learning/Quiz'));
const Assignment = lazy(() => import('./components/learning/Assignment'));
const Certificate = lazy(() => import('./components/learning/Certificate'));

function App() {
  const { sessionExpiredMessage, setSessionExpiredMessage } = useAuth();

  return (
    <ErrorBoundary>
      <div className="app-shell flex flex-col min-h-screen text-slate-900 font-sans antialiased">
        {/* Persistent Global Header */}
        <Header />

        {/* 401 Unauthorized / Expired Session Notification (Experiment 22f) */}
        {sessionExpiredMessage && (
          <div className="bg-[#8f3040] text-white px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2 font-bold shadow-md animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>{sessionExpiredMessage}</span>
            <button
              onClick={() => setSessionExpiredMessage(null)}
              className="ml-3 underline text-[11px] hover:text-rose-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1">
          <Suspense fallback={<div className="px-4 py-12 text-center text-sm text-slate-600" role="status" aria-live="polite">Loading your learning experience…</div>}>
          <Routes>
            {/* Experiment 3a: Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminRoute><AdminCourses /></AdminRoute>} />

            {/* Enrollment Route */}
            <Route
              path="/enrollment/:id"
              element={
                <ProtectedRoute>
                  <Enrollment />
                </ProtectedRoute>
              }
            />

            {/* Experiment 3e & 3f: Nested Routing for Learning Dashboard using Outlet */}
            <Route
              path="/learning"
              element={
                <ProtectedRoute>
                  <LearningDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="materials" element={<LearningMaterials />} />
              <Route path="progress" element={<ProgressTracking />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="assignments" element={<Assignment />} />
              <Route path="certificate" element={<Certificate />} />
            </Route>

            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <div className="max-w-5xl mx-auto px-4 py-8">
                    <Quiz />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <div className="max-w-5xl mx-auto px-4 py-8">
                    <Assignment />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/certificate"
              element={
                <ProtectedRoute>
                  <div className="max-w-5xl mx-auto px-4 py-8">
                    <Certificate />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </main>

        {/* JWT Token & Security Inspector Widget (Experiment 22b, c, f) */}
        <TokenSecurityWidget />

        {/* Persistent Global Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
