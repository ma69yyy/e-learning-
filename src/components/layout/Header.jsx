import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../hooks/useLearning';
import Button, { buttonClassName } from '../common/Button';
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  HelpCircle,
  FileCheck2,
  Award,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { enrolledCourses } = useLearning();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
      isActive
        ? 'text-[#183a68] bg-[#eaf0f8] font-semibold'
        : 'text-slate-600 hover:text-[#183a68] hover:bg-[#f3f6fa]'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-[#183a68] bg-[#eaf0f8] font-semibold'
        : 'text-slate-700 hover:text-[#183a68] hover:bg-[#f3f6fa]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#fbfcfe]/95 backdrop-blur-md border-b border-[#dbe3ee] shadow-[0_4px_20px_rgba(24,58,104,.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#183a68] text-white flex items-center justify-center shadow-[0_7px_15px_rgba(24,58,104,.2)] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#172033] group-hover:text-[#183a68] transition-colors">
                EduVantage
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                E-Learning
              </span>
            </div>
          </Link>

          {/* Desktop NavLinks */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              <BookOpen className="w-4 h-4" />
              Courses
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>
                <ShieldCheck className="w-4 h-4" /> Admin
              </NavLink>
            )}
            <NavLink to="/learning" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              Learning
              {enrolledCourses.length > 0 && (
                <span className="ml-1 text-[11px] font-bold bg-indigo-600 text-white rounded-full px-1.5 py-0.2">
                  {enrolledCourses.length}
                </span>
              )}
            </NavLink>
            <NavLink to="/quiz" className={navLinkClass}>
              <HelpCircle className="w-4 h-4" />
              Quiz
            </NavLink>
            <NavLink to="/assignments" className={navLinkClass}>
              <FileCheck2 className="w-4 h-4" />
              Assignments
            </NavLink>
            <NavLink to="/certificate" className={navLinkClass}>
              <Award className="w-4 h-4" />
              Certificate
            </NavLink>
          </nav>

          {/* Desktop Right Actions: Profile / Login */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-[#f1f5f9] transition-colors text-left"
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                    decoding="async"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900 leading-tight">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{user?.studentId}</p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" className={buttonClassName('primary', 'sm')}>
                <span className="shrink-0"><LogIn className="w-4 h-4" /></span>
                <span>Student Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {isAuthenticated && (
              <Link to="/profile" className="p-1">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-400"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/courses" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <BookOpen className="w-4 h-4" /> Courses
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <ShieldCheck className="w-4 h-4" /> Course management
            </NavLink>
          )}
          <NavLink to="/learning" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <LayoutDashboard className="w-4 h-4" /> Learning Dashboard
            {enrolledCourses.length > 0 && (
              <span className="ml-auto text-xs bg-indigo-600 text-white font-bold rounded-full px-2 py-0.5">
                {enrolledCourses.length} Enrolled
              </span>
            )}
          </NavLink>
          <NavLink to="/quiz" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <HelpCircle className="w-4 h-4" /> Quiz
          </NavLink>
          <NavLink to="/assignments" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <FileCheck2 className="w-4 h-4" /> Assignments
          </NavLink>
          <NavLink to="/certificate" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <Award className="w-4 h-4" /> Certificate
          </NavLink>
          <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <User className="w-4 h-4" /> Student Profile
          </NavLink>

          <div className="pt-3 border-t border-slate-100 mt-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
              >
                <LogOut className="w-4 h-4" /> Log Out ({user?.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                <LogIn className="w-4 h-4" /> Student Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
