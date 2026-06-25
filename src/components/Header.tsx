import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { Briefcase, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    onNavigate('landing');
  };

  return (
    <header className="sticky top-0 z-50 glass-navbar border-b border-slate-200/60 px-6 py-4 flex items-center justify-between transition-all duration-200">
      {/* Brand logo and naming */}
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => onNavigate('landing')}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-2.5 rounded-xl shadow-md hover:scale-105 transition-transform duration-250">
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
            TNP Job Portal
          </h1>
          <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider leading-none mt-0.5">
            Career Architecture
          </p>
        </div>
      </div>

      {/* Navigation options */}
      <nav className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => onNavigate('landing')}
          className={`text-sm font-semibold transition-colors duration-200 hover:text-indigo-600 ${
            currentView === 'landing' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('jobs')}
          className={`text-sm font-semibold transition-colors duration-200 hover:text-indigo-600 ${
            currentView === 'jobs' || currentView === 'job-details' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          Browse Jobs
        </button>
        {isAuthenticated && user?.role === 'ADMIN' && (
          <button
            onClick={() => onNavigate('dashboard')}
            className={`text-sm font-semibold transition-colors duration-200 hover:text-indigo-600 flex items-center space-x-1.5 ${
              currentView === 'dashboard' || currentView === 'create' || currentView === 'edit'
                ? 'text-indigo-600'
                : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Admin Console</span>
          </button>
        )}
      </nav>

      {/* Profile & Logout Action / Futuristic glass Sign In */}
      <div className="flex items-center space-x-4">
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-4">
            {/* Profile Info */}
            <div className="flex items-center space-x-2.5 bg-slate-100/80 px-3.5 py-1.5 rounded-xl border border-slate-200/40">
              <div className="bg-slate-200 p-1.5 rounded-lg text-slate-600">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <div className="text-left leading-none">
                <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                <p className="text-[9px] text-slate-500 font-light mt-0.5">{user.email}</p>
              </div>
              <span className={`ml-1.5 border text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${
                user.role === 'ADMIN' 
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200/50' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
              }`}>
                {user.role}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200/60 hover:border-red-200 text-slate-600 p-2.5 rounded-xl transition-all duration-200 hover:shadow-sm"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="glass-panel border border-slate-200/80 hover:border-indigo-500/40 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-cyan-500 hover:text-white text-slate-800 font-semibold text-sm px-4.5 py-2.5 rounded-xl transition-all duration-250 shadow-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
