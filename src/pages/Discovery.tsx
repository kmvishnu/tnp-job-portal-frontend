import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchJobs } from '../store/jobSlice';
import { Filter, ChevronLeft, ChevronRight, Briefcase, Tag, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface DiscoveryProps {
  onNavigate: (view: string, data?: any) => void;
}

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Fullstack', 'Design', 'Marketing'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive'];

export const Discovery: React.FC<DiscoveryProps> = ({ onNavigate }) => {
  const dispatch = useAppDispatch();
  const { jobs, metadata, loading } = useAppSelector((state) => state.jobs);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const loadDiscoveryJobs = () => {
    const params: any = {
      page: currentPage,
      limit: 6,
    };
    if (selectedCategory) {
      params.category = selectedCategory;
    }
    if (selectedExperience) {
      params.experienceLevel = selectedExperience;
    }
    dispatch(fetchJobs(params));
  };

  useEffect(() => {
    loadDiscoveryJobs();
  }, [dispatch, currentPage, selectedCategory, selectedExperience]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setCurrentPage(1);
  };

  const handleExperienceToggle = (level: string) => {
    setSelectedExperience((prev) => (prev === level ? null : level));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedExperience(null);
    setCurrentPage(1);
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <div 
        key={idx}
        className="bg-white border border-slate-200/60 p-6 rounded-2xl h-36 animate-pulse flex flex-col justify-between"
      >
        <div className="space-y-2">
          <div className="h-5 bg-slate-100 rounded w-2/3" />
          <div className="h-4 bg-slate-100/60 rounded w-1/3" />
        </div>
        <div className="flex space-x-2">
          <div className="h-5 bg-slate-100 rounded w-16" />
          <div className="h-5 bg-slate-100 rounded w-20" />
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Header Banner */}
      <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900">Discover Opportunities</h2>
        <p className="text-xs text-slate-400 mt-1">
          Apply filters to locate active software positions matching your experience architecture.
        </p>
      </div>

      {/* Mobile Filters Trigger */}
      <div className="lg:hidden w-full">
        <button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="w-full flex items-center justify-between bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer text-sm focus:outline-none"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
            <span>Filters 🔍</span>
            {(selectedCategory || selectedExperience) && (
              <span className="bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-600 font-extrabold px-2 py-0.5 rounded-md ml-1">
                Active
              </span>
            )}
          </div>
          {isFilterExpanded ? (
            <ChevronUp className="h-4.5 w-4.5 text-slate-400" />
          ) : (
            <ChevronDown className="h-4.5 w-4.5 text-slate-400" />
          )}
        </button>

        {/* Collapsible mobile panel */}
        {isFilterExpanded && (
          <div className="mt-3 bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm space-y-6 animate-fadeIn">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Filter Parameters</span>
              {(selectedCategory || selectedExperience) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-wider"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category checkboxes */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</h4>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {CATEGORIES.map((cat) => (
                    <label 
                      key={cat}
                      className="flex items-center space-x-2.5 text-xs text-slate-650 font-semibold cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() => handleCategoryToggle(cat)}
                        className="h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                      />
                      <span className="group-hover:text-slate-900 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience level checkboxes */}
              <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience Level</h4>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <label 
                      key={level}
                      className="flex items-center space-x-2.5 text-xs text-slate-650 font-semibold cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExperience === level}
                        onChange={() => handleExperienceToggle(level)}
                        className="h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                      />
                      <span className="group-hover:text-slate-900 transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar: Filter Panel (Desktop Only) */}
        <aside className="hidden lg:block bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 font-bold text-slate-800 text-sm">
              <Filter className="h-4 w-4 text-indigo-600" />
              <span>Search Filters</span>
            </div>
            {(selectedCategory || selectedExperience) && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories checkboxes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categories</h4>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label 
                  key={cat}
                  className="flex items-center space-x-2.5 text-xs text-slate-600 font-semibold cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat}
                    onChange={() => handleCategoryToggle(cat)}
                    className="h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <span className="group-hover:text-slate-900 transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience level checkboxes */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Experience Level</h4>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <label 
                  key={level}
                  className="flex items-center space-x-2.5 text-xs text-slate-600 font-semibold cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedExperience === level}
                    onChange={() => handleExperienceToggle(level)}
                    className="h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <span className="group-hover:text-slate-900 transition-colors">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Workspace: Job List */}
        <section className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              renderSkeletons()
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-slate-200/60 rounded-2xl py-16 text-center shadow-sm">
                <div className="inline-flex bg-slate-100 p-3 rounded-full text-slate-400 mb-3">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No Jobs Match Your Filters</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Adjust your category or experience level checks to discover other listings.
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onNavigate('job-details', job.id)}
                  className="bg-white hover:bg-slate-50/50 border border-slate-200/60 hover:border-indigo-500/20 p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:scale-[1.002]"
                >
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-950 group-hover:text-indigo-600 text-base transition-colors leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100/30">
                        <Tag className="h-3 w-3 mr-0.5" />
                        <span>{job.category}</span>
                      </span>
                      <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 bg-cyan-50 text-cyan-600 rounded-md border border-cyan-100/30">
                        <Award className="h-3 w-3 mr-0.5" />
                        <span>{job.experienceLevel}</span>
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 flex flex-col sm:items-end justify-between h-full">
                    <span className="font-mono text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                      {formatSalary(job.salary)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-2 hidden sm:block">
                      Posted by {job.postedBy?.name || 'Admin'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Navigation */}
          {metadata && metadata.totalPages > 1 && (
            <div className="bg-white border border-slate-200/60 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-500 font-medium">
                Page <span className="text-slate-800 font-bold">{metadata.currentPage}</span> of{' '}
                <span className="text-slate-800 font-bold">{metadata.totalPages}</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={metadata.currentPage === 1 || loading}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  disabled={metadata.currentPage === metadata.totalPages || loading}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, metadata.totalPages))}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
