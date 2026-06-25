import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchJobs, applyForJob, clearJobError } from '../store/jobSlice';
import { ArrowLeft, Loader2, ShieldCheck, AlertCircle, CheckCircle, Tag, Award, User } from 'lucide-react';

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ jobId, onBack, onNavigate }) => {
  const dispatch = useAppDispatch();
  const { jobs, loading, actionLoading, appliedJobIds, error } = useAppSelector((state) => state.jobs);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [localSuccess, setLocalSuccess] = useState(false);

  useEffect(() => {
    dispatch(clearJobError());
    // Load jobs if store is empty (e.g., on reload)
    if (jobs.length === 0) {
      dispatch(fetchJobs());
    }
  }, [dispatch, jobs.length]);

  const job = jobs.find((j) => j.id === jobId);
  const isApplied = appliedJobIds.includes(jobId) || localSuccess;

  const handleApply = async () => {
    if (!isAuthenticated || !user) {
      // Save redirect parameters and route to login page
      onNavigate('login', { redirect: { view: 'job-details', jobId } });
      return;
    }

    if (user.role !== 'USER') {
      return; // Handled visually by disabling the button
    }

    try {
      await dispatch(applyForJob(jobId)).unwrap();
      setLocalSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Loading Screen
  if (loading && !job) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Loading job architecture...</p>
      </div>
    );
  }

  // Job Not Found Error
  if (!job) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="inline-flex bg-red-550/10 border border-red-200/50 p-4 rounded-full text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Job Posting Not Found</h3>
          <p className="text-xs text-slate-500">
            The requested job posting may have been removed or does not exist on this network.
          </p>
        </div>
        <button
          onClick={onBack}
          className="bg-white hover:bg-slate-50 border border-slate-200/60 text-slate-700 font-semibold text-xs px-4.5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Return Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors duration-150"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Browse Listings</span>
      </button>

      {/* Main Role Details Panel */}
      <article className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm space-y-8">
        
        {/* Status Alerts */}
        {error && (
          <div className="flex items-start space-x-3 bg-red-50 border border-red-200/50 p-4 rounded-2xl text-red-600 text-xs font-semibold">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Header Details Block */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-150/40 uppercase tracking-wide">
                {job.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-50 text-cyan-600 border border-cyan-150/40 uppercase tracking-wide">
                {job.experienceLevel}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {job.title}
            </h1>
            <div className="flex items-center space-x-4 text-xs text-slate-500 font-semibold">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4 text-slate-400" />
                <span>Recruiter: {job.postedBy?.name || 'Administrative Staff'}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:items-end space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salary Budget</span>
            <span className="text-xl font-mono font-extrabold text-slate-900 bg-slate-50 border border-slate-200/50 px-3.5 py-1.5 rounded-xl">
              {formatSalary(job.salary)} <span className="text-xs text-slate-400 font-normal">/yr</span>
            </span>
          </div>
        </div>

        {/* 2. Job Description Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Position Description</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* 3. Placement Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-slate-100 py-6">
          <div className="flex items-center space-x-3.5">
            <div className="bg-slate-50 p-2.5 rounded-xl text-slate-600 border border-slate-200/30">
              <Tag className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Domain Category</p>
              <p className="text-xs font-bold text-slate-800">{job.category} Engineering</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="bg-slate-50 p-2.5 rounded-xl text-slate-600 border border-slate-200/30">
              <Award className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Experience Architecture</p>
              <p className="text-xs font-bold text-slate-800">{job.experienceLevel} Prerequisites</p>
            </div>
          </div>
        </div>

        {/* 4. Action Button / Conditional Flow rendering */}
        <div className="flex flex-col space-y-3 pt-2">
          {isApplied ? (
            /* Scenario A: Applied Successfully Check Badge */
            <div className="w-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm animate-fadeIn">
              <CheckCircle className="h-5 w-5 animate-pulse" />
              <span>Applied Successfully</span>
            </div>
          ) : user && user.role === 'ADMIN' ? (
            /* Scenario B: Admin Access restriction warning */
            <div className="space-y-3">
              <button
                disabled
                className="w-full bg-slate-100 text-slate-400 border border-slate-200/60 font-bold py-3.5 px-4 rounded-xl cursor-not-allowed flex items-center justify-center"
              >
                Apply Now
              </button>
              <p className="text-[11px] text-center text-indigo-600 font-semibold flex items-center justify-center space-x-1.5 bg-indigo-50 border border-indigo-100/30 p-3.5 rounded-xl">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>You are currently authenticated as an ADMIN. Recruiters cannot apply for active vacancies.</span>
              </p>
            </div>
          ) : (
            /* Scenario C: Standard Apply button (triggers redirect or API) */
            <button
              onClick={handleApply}
              disabled={actionLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-indigo-500/10 flex items-center justify-center space-x-2 hover:scale-[1.005] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Apply Now</span>
                </>
              )}
            </button>
          )}

          {!isAuthenticated && (
            <p className="text-[10px] text-center text-slate-400 font-medium">
              Guest users will be prompted to log in securely to verify credentials before application processing.
            </p>
          )}
        </div>
      </article>
    </div>
  );
};
