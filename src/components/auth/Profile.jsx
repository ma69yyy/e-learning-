import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../hooks/useLearning';
import Input from '../common/Input';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { User, Mail, School, Building2, Phone, Award, BookOpen, CheckCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { enrolledCoursesList, overallLearningProgress, isCertificateEligible } = useLearning();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    phone: user?.phone || '',
    department: user?.department || '',
    institution: user?.institution || '',
    bio: user?.bio || ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form validation for Profile
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.studentId.trim()) errs.studentId = 'Student ID is required.';
    if (!formData.department.trim()) errs.department = 'Academic department is required.';
    if (!formData.institution.trim()) errs.institution = 'Institution is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSuccessMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      setSuccessMessage('Profile information successfully updated!');
    }, 400);
  };

  const eligibleCertsCount = enrolledCoursesList.filter(c => isCertificateEligible(c.id)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></span>
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="inline-block bg-white/20 text-indigo-100 text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2">
            Verified Student • {user?.studentId}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name}</h1>
          <p className="text-sm text-indigo-100 mt-1 max-w-xl">{user?.bio}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[180px] border border-white/20">
          <div className="text-xs uppercase tracking-wider text-indigo-200">Overall Progress</div>
          <div className="text-3xl font-black mt-1">{overallLearningProgress}%</div>
          <div className="text-xs text-indigo-200 mt-1">{enrolledCoursesList.length} Courses Enrolled</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Learning Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Academic Milestones
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" /> Enrolled Courses
                </span>
                <span className="font-bold text-slate-900">{enrolledCoursesList.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-600 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Verified Certificates
                </span>
                <span className="font-bold text-slate-900">{eligibleCertsCount}</span>
              </div>
              <div className="pt-2">
                <ProgressBar value={overallLearningProgress} labelPrefix="Degree Completion" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-3">Enrolled Program List</h3>
            {enrolledCoursesList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No courses currently enrolled.</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-xs">
                {enrolledCoursesList.map(c => (
                  <li key={c.id} className="py-2.5 flex justify-between items-center">
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{c.title}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{c.duration}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Controlled Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Edit Student Profile</h2>
            <p className="text-xs text-slate-500 mb-6">
              Update your registered academic identity and contact coordinates.
            </p>

            {successMessage && (
              <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<User className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Student ID"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  error={errors.studentId}
                  icon={<Award className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone className="w-4 h-4" />}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  error={errors.department}
                  icon={<Building2 className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  error={errors.institution}
                  icon={<School className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Bio / Focus
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  placeholder="Share your learning objectives and research interests..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
