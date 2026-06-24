import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createJob, updateJob, clearJobError } from '../store/jobSlice';
import { Briefcase, ArrowLeft, Loader2, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

interface JobActionProps {
  jobToEdit?: any;
  onBack: () => void;
}

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Fullstack', 'Design', 'Marketing'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'];

export const JobAction: React.FC<JobActionProps> = ({ jobToEdit, onBack }) => {
  const dispatch = useAppDispatch();
  const { actionLoading, error } = useAppSelector((state) => state.jobs);

  const isEditMode = !!jobToEdit;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    experienceLevel: 'Entry Level',
    salary: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load editing details if in edit mode
  useEffect(() => {
    dispatch(clearJobError());
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || '',
        description: jobToEdit.description || '',
        category: jobToEdit.category || 'Engineering',
        experienceLevel: jobToEdit.experienceLevel || 'Entry Level',
        salary: jobToEdit.salary ? String(jobToEdit.salary) : '',
      });
    }
  }, [jobToEdit, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Job Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Job Description is required';
    } else if (formData.description.trim().length < 20) {
      errors.description = 'Job Description must be at least 20 characters long';
    }

    if (!formData.salary) {
      errors.salary = 'Annual Salary is required';
    } else {
      const parsedSalary = parseInt(formData.salary, 10);
      if (isNaN(parsedSalary) || parsedSalary <= 0) {
        errors.salary = 'Salary must be a positive integer';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formattedData = {
        ...formData,
        salary: parseInt(formData.salary, 10),
      };

      if (isEditMode) {
        await dispatch(updateJob({ id: jobToEdit.id, jobData: formattedData })).unwrap();
        setSuccessMessage('Job posting updated successfully!');
      } else {
        await dispatch(createJob(formattedData)).unwrap();
        setSuccessMessage('Job opportunity posted successfully!');
        // Reset form for next post
        setFormData({
          title: '',
          description: '',
          category: 'Engineering',
          experienceLevel: 'Entry Level',
          salary: '',
        });
      }

      // Automatically head back to dashboard after a short delay
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* Return link */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors duration-150"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      {/* Header and Details */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditMode ? 'Modify Job Posting' : 'Post a New Job'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditMode 
                ? 'Update descriptions, salaries, or level details for this job posting.' 
                : 'Publish custom job requirements and salary structures for incoming applications.'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-xl">
        {/* Status Alerts */}
        {error && (
          <div className="mb-6 flex items-start space-x-3 bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start space-x-3 bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl text-emerald-400 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="title">
                Job Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Senior Full Stack Software Engineer"
                className={`block w-full px-4 py-3 bg-slate-950/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 placeholder-slate-600 text-sm transition-all duration-200 ${
                  validationErrors.title ? 'border-red-900/60' : 'border-slate-800'
                }`}
              />
              {validationErrors.title && (
                <p className="text-xs text-red-500 font-medium pl-1">{validationErrors.title}</p>
              )}
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="category">
                Category Group
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 text-sm transition-all duration-200 appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="experienceLevel">
                Required Experience
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 text-sm transition-all duration-200 appearance-none"
              >
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="salary">
                Annual Salary (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 text-sm font-semibold">
                  $
                </span>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="120000"
                  className={`block w-full pl-9 pr-4 py-3 bg-slate-950/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 placeholder-slate-600 text-sm transition-all duration-200 ${
                    validationErrors.salary ? 'border-red-900/60' : 'border-slate-800'
                  }`}
                />
              </div>
              {validationErrors.salary && (
                <p className="text-xs text-red-500 font-medium pl-1">{validationErrors.salary}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="description">
                Job Description & Details
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail the technical responsibilities, tools, and prerequisites needed for candidates to succeed..."
                className={`block w-full px-4 py-3 bg-slate-950/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 placeholder-slate-600 text-sm transition-all duration-200 resize-none ${
                  validationErrors.description ? 'border-red-900/60' : 'border-slate-800'
                }`}
              />
              {validationErrors.description && (
                <p className="text-xs text-red-500 font-medium pl-1">{validationErrors.description}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3.5 border-t border-slate-800/60 pt-6 mt-6">
            <button
              type="button"
              onClick={onBack}
              disabled={actionLoading}
              className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 font-semibold text-sm rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 border border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20 disabled:bg-indigo-850 disabled:border-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-slate-400" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  <span>{isEditMode ? 'Update Posting' : 'Post Job'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
