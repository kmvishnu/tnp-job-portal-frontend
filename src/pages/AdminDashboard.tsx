import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchJobs, deleteJob } from '../store/jobSlice';
import { Plus, Edit, Trash2, Filter, ChevronLeft, ChevronRight, Briefcase, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Fullstack', 'Design', 'Marketing'];
const EXPERIENCE_LEVELS = ['All', 'Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const dispatch = useAppDispatch();
  const { jobs, metadata, loading, actionLoading } = useAppSelector((state) => state.jobs);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadJobs = () => {
    const params: any = {
      page: currentPage,
      limit: 8,
    };
    if (categoryFilter !== 'All') {
      params.category = categoryFilter;
    }
    if (experienceFilter !== 'All') {
      params.experienceLevel = experienceFilter;
    }
    dispatch(fetchJobs(params));
  };

  useEffect(() => {
    loadJobs();
  }, [dispatch, currentPage, categoryFilter, experienceFilter]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExperienceFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await dispatch(deleteJob(id)).unwrap();
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <tr key={idx} className="border-b border-slate-100 bg-white">
        <td className="px-6 py-4.5">
          <div className="h-4.5 bg-slate-100 rounded w-2/3 animate-pulse" />
          <div className="h-3 bg-slate-100/60 rounded w-1/3 mt-2 animate-pulse" />
        </td>
        <td className="px-6 py-4.5">
          <div className="h-5 bg-slate-100 rounded w-16 animate-pulse" />
        </td>
        <td className="px-6 py-4.5">
          <div className="h-4.5 bg-slate-100 rounded w-20 animate-pulse" />
        </td>
        <td className="px-6 py-4.5">
          <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
        </td>
        <td className="px-6 py-4.5">
          <div className="h-4 bg-slate-100 rounded w-32 animate-pulse" />
        </td>
        <td className="px-6 py-4.5 text-right">
          <div className="flex items-center justify-end space-x-2">
            <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Job Control Board</h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
            Publish jobs, filter records, and audit candidate positions.
          </p>
        </div>
        <button
          onClick={() => onNavigate('create')}
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 shadow-md hover:scale-[1.005]"
        >
          <Plus className="h-4 w-4" />
          <span>Post Job Opportunity</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold mr-2 uppercase tracking-wide">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span>Filters:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3.5 py-2 focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={experienceFilter}
            onChange={handleExperienceChange}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3.5 py-2 focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            {EXPERIENCE_LEVELS.map((exp) => (
              <option key={exp} value={exp}>
                {exp === 'All' ? 'All Experience' : exp}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-150/40 w-full sm:w-auto text-center">
          {metadata ? `${metadata.totalCount} active positions` : 'Loading status...'}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Salary</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {loading ? (
                renderSkeletons()
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-slate-50 border border-slate-200/40 rounded-full text-slate-400">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-slate-700">No vacancies matched</p>
                      <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                        Alter your search filter matrices or post a new job opportunity to load figures.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr 
                    key={job.id} 
                    className="hover:bg-slate-50/40 transition-colors border-b border-slate-100/60"
                  >
                    <td className="px-6 py-4.5">
                      <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-medium">{job.description}</div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-100/40">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-slate-600">
                      {job.experienceLevel}
                    </td>
                    <td className="px-6 py-4.5 font-mono text-slate-800 font-bold">
                      {formatSalary(job.salary)}
                    </td>
                    <td className="px-6 py-4.5 text-slate-500 font-medium">
                      <div>{job.postedBy?.name || 'Administrative Recruiter'}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{job.postedBy?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          disabled={actionLoading || deletingId !== null}
                          onClick={() => onNavigate('edit', job)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-500/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Edit Vacancy"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          disabled={actionLoading || deletingId !== null}
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:border-red-500/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
                          title="Delete Vacancy"
                        >
                          {deletingId === job.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin text-red-650" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {metadata && metadata.totalPages > 1 && (
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Page <span className="text-slate-800 font-bold">{metadata.currentPage}</span> of{' '}
              <span className="text-slate-800 font-bold">{metadata.totalPages}</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={metadata.currentPage === 1 || loading}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>
              <button
                disabled={metadata.currentPage === metadata.totalPages || loading}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, metadata.totalPages))}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
