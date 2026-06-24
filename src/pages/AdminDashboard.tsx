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

  // Load jobs with filters
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

  // Render Table Skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, idx) => (
      <tr key={idx} className="border-b border-slate-800/50 bg-slate-900/10">
        <td className="px-6 py-4.5">
          <div className="h-4 bg-slate-800 rounded-md w-2/3 animate-pulse" />
          <div className="h-3 bg-slate-800/60 rounded-md w-1/3 mt-2 animate-pulse" />
        </td>
        <td className="px-6 py-4.5">
          <div className="h-4.5 bg-slate-800 rounded-md w-1/2 animate-pulse" />
        </td>
        <td className="px-6 py-4.5">
          <div className="h-4.5 bg-slate-800 rounded-md w-2/3 animate-pulse" />
        </td>
        <td className="px-6 py-4.5">
          <div className="h-4 bg-slate-800 rounded-md w-2/5 animate-pulse" />
        </td>
        <td className="px-6 py-4.5">
          <div className="h-4.5 bg-slate-800 rounded-md w-1/3 animate-pulse" />
        </td>
        <td className="px-6 py-4.5 text-right">
          <div className="flex items-center justify-end space-x-2.5">
            <div className="h-8 w-8 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Welcome Board & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 shadow-lg">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white">Active Job Postings</h2>
          <p className="text-sm text-slate-400">
            Publish new job opportunities, filter listings, and manage candidates applications.
          </p>
        </div>
        <button
          onClick={() => onNavigate('create')}
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-5 py-3 rounded-xl transition-all duration-200 border border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20 self-start md:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Post a New Job</span>
        </button>
      </div>

      {/* Filters & Actions Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/60">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium mr-2">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col min-w-[140px]">
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="flex flex-col min-w-[140px]">
            <select
              value={experienceFilter}
              onChange={handleExperienceChange}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none"
            >
              {EXPERIENCE_LEVELS.map((exp) => (
                <option key={exp} value={exp}>
                  {exp === 'All' ? 'All Experience' : exp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total stats */}
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3.5 py-1.5 rounded-lg border border-indigo-500/20 w-full sm:w-auto text-center sm:text-left">
          {metadata ? `${metadata.totalCount} jobs matching` : 'Loading stats...'}
        </div>
      </div>

      {/* Main Data Table Container */}
      <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Experience Level</th>
                <th className="px-6 py-4">Salary</th>
                <th className="px-6 py-4">Posted By</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {loading ? (
                renderSkeletons()
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-full text-slate-500">
                        <Briefcase className="h-7 w-7" />
                      </div>
                      <p className="font-semibold text-slate-300">No Job Listings Found</p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Try modifying your filter selections or register a new job listing to start populated statistics.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr 
                    key={job.id} 
                    className="hover:bg-slate-800/20 transition-colors duration-150 border-b border-slate-800/30"
                  >
                    <td className="px-6 py-4.5 font-medium text-slate-200">
                      <div className="font-semibold text-slate-200 text-sm">{job.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{job.description}</div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-slate-300 text-xs font-medium">
                      {job.experienceLevel}
                    </td>
                    <td className="px-6 py-4.5 font-mono text-xs text-slate-300 font-semibold">
                      {formatSalary(job.salary)}
                    </td>
                    <td className="px-6 py-4.5 text-xs text-slate-400">
                      <div>{job.postedBy?.name || 'Admin'}</div>
                      <div className="text-[10px] text-slate-600 font-light">{job.postedBy?.email}</div>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Edit Button */}
                        <button
                          disabled={actionLoading || deletingId !== null}
                          onClick={() => onNavigate('edit', job)}
                          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-slate-800/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Edit Job"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {/* Delete Button */}
                        <button
                          disabled={actionLoading || deletingId !== null}
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-slate-800/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                          title="Delete Job"
                        >
                          {deletingId === job.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin text-red-400" />
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

        {/* Pagination Navigation */}
        {metadata && metadata.totalPages > 1 && (
          <div className="bg-slate-900/40 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing Page <span className="text-slate-300 font-semibold">{metadata.currentPage}</span> of{' '}
              <span className="text-slate-300 font-semibold">{metadata.totalPages}</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={metadata.currentPage === 1 || loading}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>
              <button
                disabled={metadata.currentPage === metadata.totalPages || loading}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, metadata.totalPages))}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
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
