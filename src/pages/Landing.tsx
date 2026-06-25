import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchJobs } from '../store/jobSlice';
import { ArrowRight, Briefcase } from 'lucide-react';

interface LandingProps {
  onNavigate: (view: string, data?: any) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    // Fetch initial list of jobs
    dispatch(fetchJobs({ limit: 4 }));
  }, [dispatch]);

  // Take the first 4 jobs for featured
  const featuredJobs = jobs.slice(0, 4);

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* 1. Bold Minimal Hero Section */}
      <section className="text-center py-16 px-4 max-w-4xl mx-auto space-y-6 relative overflow-hidden select-none">
        {/* Subtle decorative tech glows */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-[96px]" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-500/5 rounded-full blur-[96px]" />

        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-150/40">
          Corporate Placements Hub
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          The Next Phase of <br />
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Career Architecture
          </span>
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium">
          A security-focused placement engine bridging the gap between developers and elite technical recruiters.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => onNavigate('jobs')}
            className="group inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-indigo-500/10 hover:scale-[1.02]"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 2. Grid of 4 Featured Jobs */}
      <section className="space-y-8 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Featured Opportunities</h3>
            <p className="text-xs text-slate-400 mt-1">Carefully architected roles for elite developers</p>
          </div>
          <button
            onClick={() => onNavigate('jobs')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center space-x-1 transition-colors"
          >
            <span>View All Jobs</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && featuredJobs.length === 0 ? (
            // Loader Skeletons
            Array.from({ length: 4 }).map((_, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200/60 p-6 rounded-2xl h-44 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-5 bg-slate-100 rounded w-2/3" />
                  <div className="h-4 bg-slate-100/60 rounded w-1/3" />
                </div>
                <div className="flex space-x-2">
                  <div className="h-5 bg-slate-100 rounded w-16" />
                  <div className="h-5 bg-slate-100 rounded w-24" />
                </div>
              </div>
            ))
          ) : featuredJobs.length === 0 ? (
            <div className="col-span-1 md:col-span-2 text-center py-12 bg-white border border-slate-200/60 rounded-2xl text-slate-400 text-sm">
              No active job positions found. Please check back later.
            </div>
          ) : (
            featuredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onNavigate('job-details', job.id)}
                className="bg-white hover:bg-slate-50/50 border border-slate-200/60 hover:border-indigo-500/20 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between hover:scale-[1.005] group"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base line-clamp-1">
                      {job.title}
                    </h4>
                    <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-md">
                      ₹{job.salary.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100/30">
                    {job.category}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 bg-cyan-50 text-cyan-600 rounded-lg border border-cyan-100/30">
                    {job.experienceLevel}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. Minimalist Grid Footer */}
      <section className="bg-white border-t border-slate-200/60 py-12 px-6 mt-16 max-w-6xl mx-auto rounded-3xl shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3 col-span-2">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm">TNP Job Portal</span>
            </div>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              Designed as a modern tech-forward portal with JWT authentication, role restrictions, and cookie protection.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate Flow</h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-indigo-600 font-medium">Browse Jobs</button></li>
              <li><button onClick={() => onNavigate('login')} className="hover:text-indigo-600 font-medium">User Login</button></li>
              <li><button onClick={() => onNavigate('login')} className="hover:text-indigo-600 font-medium">Create Account</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Admin Actions</h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><button onClick={() => onNavigate('login')} className="hover:text-indigo-600 font-medium">Dashboard Access</button></li>
              <li><button onClick={() => onNavigate('login')} className="hover:text-indigo-600 font-medium">Publish Posting</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-indigo-600 font-medium">Platform Metrics</button></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
