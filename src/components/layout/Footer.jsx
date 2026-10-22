import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Code2, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#172033] text-slate-400 text-sm border-t border-[#26344c] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-[#315b8f] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">EduVantage</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scenario 7 Online Learning (E-Learning) Web Application implementing React Hooks, Context API, React Router v7, and Protected Route Architecture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Academic Paths</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-white transition-colors">Course Catalog</Link></li>
              <li><Link to="/course/101" className="hover:text-white transition-colors">Full Stack Web Dev (101)</Link></li>
              <li><Link to="/course/102" className="hover:text-white transition-colors">Python & Data Science (102)</Link></li>
              <li><Link to="/course/103" className="hover:text-white transition-colors">UI/UX Design Masterclass (103)</Link></li>
            </ul>
          </div>

          {/* Learning Flow Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Learning Flow</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/learning" className="hover:text-white transition-colors">Dashboard Overview</Link></li>
              <li><Link to="/learning/materials" className="hover:text-white transition-colors">Learning Materials</Link></li>
              <li><Link to="/learning/progress" className="hover:text-white transition-colors">Progress Tracker</Link></li>
              <li><Link to="/quiz" className="hover:text-white transition-colors">Interactive Quiz</Link></li>
              <li><Link to="/assignments" className="hover:text-white transition-colors">Assignments & Rubrics</Link></li>
              <li><Link to="/certificate" className="hover:text-white transition-colors">Verified Certificate</Link></li>
            </ul>
          </div>

          {/* Experiments Covered */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Covered Topics</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">useState</span>
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">useEffect</span>
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">useRef</span>
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">useMemo</span>
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">useCallback</span>
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">Custom Hooks</span>
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">Context API</span>
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">React Router</span>
              <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">Protected Routes</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EduVantage E-Learning Portal. Built for Academic Lab Experiment 18.</p>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>React 19 + Tailwind CSS + Context API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
