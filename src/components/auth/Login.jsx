import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { isValidEmail, normalizeIdentifier, safeInternalPath, sanitizePlainText } from '../../utils/security';
import { LogIn, Lock, Mail, KeyRound, Sparkles, UserPlus, UserRound, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login, register, defaultCredentials, adminCredentials, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = safeInternalPath(location.state?.from?.pathname || '/learning');

  const [mode, setMode] = useState('signin');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    emailOrId: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setServerError('');
    setSuccessMessage('');
  };

  const validate = () => {
    const newErrors = {};

    if (mode === 'signup') {
      if (!sanitizePlainText(formData.name, 100)) newErrors.name = 'Your name is required.';
      if (!/^[a-z0-9][a-z0-9._-]{2,39}$/.test(normalizeIdentifier(formData.username))) {
        newErrors.username = 'Use 3–40 letters, numbers, dots, underscores, or hyphens.';
      }
      if (!isValidEmail(formData.email)) {
        newErrors.email = 'Enter a valid email address.';
      }
    } else if (!formData.emailOrId.trim()) {
      newErrors.emailOrId = 'Username, email, or Student ID is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password must be 128 characters or fewer.';
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const safeValue = name === 'password' || name === 'confirmPassword'
      ? value
      : sanitizePlainText(value, name === 'name' ? 100 : 254);
    setFormData(prev => ({ ...prev, [name]: safeValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');
    setSuccessMessage('');

    if (mode === 'signup') {
      const result = await register({
        name: sanitizePlainText(formData.name, 100),
        username: normalizeIdentifier(formData.username),
        email: normalizeIdentifier(formData.email),
        password: formData.password
      });
      setSubmitting(false);

      if (result.success !== false) {
        setMode('signin');
        setFormData(prev => ({ ...prev, emailOrId: formData.username, password: formData.password }));
        setSuccessMessage('Account created. Sign in with the same username and password.');
      } else {
        setServerError(result.error || 'Could not create your account.');
      }
      return;
    }

    const result = await login(formData.emailOrId, formData.password);
    setSubmitting(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleFillDemo = () => {
    setFormData(prev => ({ ...prev, emailOrId: defaultCredentials.emailOrId, password: defaultCredentials.password }));
    setErrors({});
    setServerError('');
  };

  const handleFillAdmin = () => {
    setFormData(prev => ({ ...prev, emailOrId: adminCredentials.emailOrId, password: adminCredentials.password }));
    setErrors({});
    setServerError('');
  };

  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl shadow-lg border border-slate-200 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Already Authenticated</h2>
        <p className="text-sm text-slate-600 mb-6">Logged in as <strong className="text-[#183a68]">{user.name}</strong> ({user.email})</p>
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={() => navigate(from, { replace: true })}>Continue to {from === '/learning' ? 'Learning Dashboard' : from}</Button>
          <Button variant="outline" onClick={logout}>Log Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-2xl shadow-[0_18px_45px_rgba(31,54,84,.1)] border border-[#dbe3ee] overflow-hidden">
        <div className="bg-[#183a68] p-7 text-white text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-xl mb-3"><LogIn className="w-8 h-8" /></div>
          <h1 className="text-2xl font-bold">Student Portal</h1>
          <p className="text-xs text-blue-100 mt-1">Create an account or continue your learning journey.</p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            <button type="button" onClick={() => switchMode('signin')} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${mode === 'signin' ? 'bg-white text-[#183a68] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button type="button" onClick={() => switchMode('signup')} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-[#183a68] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>

          {location.state?.from && mode === 'signin' && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2"><Lock className="w-4 h-4 shrink-0 text-amber-600" /><span>Please sign in to access <strong>{location.state.from.pathname}</strong>.</span></div>
          )}
          {successMessage && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{successMessage}</div>}
          {serverError && <div role="alert" className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">{serverError}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' ? (
              <>
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Alex Johnson" error={errors.name} icon={<UserRound className="w-4 h-4" />} required />
                <Input label="Username" name="username" value={formData.username} onChange={handleChange} placeholder="alex.johnson" error={errors.username} icon={<UserRound className="w-4 h-4" />} required />
                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} icon={<Mail className="w-4 h-4" />} required />
              </>
            ) : (
              <Input label="Username, Email, or Student ID" name="emailOrId" value={formData.emailOrId} onChange={handleChange} placeholder="alex.johnson or you@example.com" error={errors.emailOrId} icon={<Mail className="w-4 h-4" />} required />
            )}

            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" error={errors.password} icon={<KeyRound className="w-4 h-4" />} required />
            {mode === 'signup' && <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" error={errors.confirmPassword} icon={<Lock className="w-4 h-4" />} required />}

            <Button type="submit" variant="primary" size="lg" isLoading={submitting} className="w-full mt-2" icon={mode === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}>
              {mode === 'signup' ? 'Create Account' : 'Sign In to Learning Portal'}
            </Button>
          </form>

          {mode === 'signin' && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Student demo</span><button type="button" onClick={handleFillDemo} className="text-xs font-bold text-[#315b8f] hover:underline cursor-pointer">Quick Fill</button></div>
                  <p className="text-xs text-slate-600 font-mono">ID: {defaultCredentials.emailOrId}</p>
                  <p className="text-xs text-slate-600 font-mono">Pass: {defaultCredentials.password}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-100">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Admin demo</span><button type="button" onClick={handleFillAdmin} className="text-xs font-bold text-blue-800 hover:underline cursor-pointer">Quick Fill Admin</button></div>
                  <p className="text-xs text-blue-900 font-mono">ID: {adminCredentials.emailOrId}</p>
                  <p className="text-xs text-blue-900 font-mono">Pass: {adminCredentials.password}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
