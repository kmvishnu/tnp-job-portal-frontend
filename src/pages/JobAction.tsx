import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createJob, updateJob, clearJobError } from '../store/jobSlice';
import { Briefcase, ArrowLeft, Loader2, AlertCircle, Save, CheckCircle } from 'lucide-react';

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

  useEffect(() => {
    dispatch(clearJobError());
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || '',
        description: jobToEdit.description || '',
        category: jobToEdit.category || 'Frontend',
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
      }

      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-800 animate-fadeIn select-none">
      {/* Return link */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      {/* Header Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center space-x-3.5">
        <div className="bg-indigo-50 border border-indigo-150/40 p-2.5 rounded-xl text-indigo-600">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {isEditMode ? 'Modify Job Posting' : 'Post a New Job'}
          </h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
            {isEditMode 
              ? 'Update vacancy parameters or descriptions' 
              : 'Add new technical roles to placement catalog'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 flex items-start space-x-3 bg-red-50 border border-red-200/50 p-4 rounded-xl text-red-655 text-xs font-semibold">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-6 flex items-start space-x-3 bg-emerald-50 border border-emerald-200/50 p-4 rounded-xl text-emerald-600 text-xs font-semibold animate-fadeIn">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="title">
                Job Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Senior Full Stack Software Architect"
                className={`block w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-xs transition-all duration-200 ${
                  validationErrors.title ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              {validationErrors.title && (
                <p className="text-[10px] text-red-500 font-semibold pl-1">{validationErrors.title}</p>
              )}
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="category">
                Category Group
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-700 text-xs transition-all duration-200 cursor-pointer"
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
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="experienceLevel">
                Required Experience
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-700 text-xs transition-all duration-200 cursor-pointer"
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
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="salary">
                Annual Salary (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                  $
                </span>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="145000"
                  className={`block w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-xs transition-all duration-200 ${
                    validationErrors.salary ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
              </div>
              {validationErrors.salary && (
                <p className="text-[10px] text-red-500 font-semibold pl-1">{validationErrors.salary}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="description">
                Job Description & Requirements
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail technical requirements, infrastructure dependencies, and prerequisites..."
                className={`block w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-xs transition-all duration-200 resize-none ${
                  validationErrors.description ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              {validationErrors.description && (
                <p className="text-[10px] text-red-500 font-semibold pl-1">{validationErrors.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3.5 border-t border-slate-100 pt-6 mt-6">
            <button
              type="button"
              onClick={onBack}
              disabled={actionLoading}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-900 border border-slate-200 rounded-xl font-bold text-xs transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:scale-[1.005] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditMode ? 'Update Vacancy' : 'Publish Posting'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
