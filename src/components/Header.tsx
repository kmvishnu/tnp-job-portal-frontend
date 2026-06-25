import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { Briefcase, LogOut, User as UserIcon, LayoutDashboard, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onLogoutClick }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-navbar border-b border-slate-200/60 px-6 py-4 flex flex-col transition-all duration-200">
      <div className="flex items-center justify-between w-full">
        {/* Brand logo and naming */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => {
            onNavigate('landing');
            setIsMenuOpen(false);
          }}
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

        {/* Navigation options - Desktop */}
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

        {/* Profile & Logout Action / Futuristic glass Sign In - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
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
                onClick={onLogoutClick}
                className="bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200/60 hover:border-red-200 text-slate-600 p-2.5 rounded-xl transition-all duration-200 hover:shadow-sm cursor-pointer"
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

        {/* Hamburger Menu - Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors shadow-sm focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Collapsible Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden w-full border-t border-slate-100 mt-4 pt-4 flex flex-col space-y-4 animate-fadeIn">
          {/* Mobile Links */}
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => {
                onNavigate('landing');
                setIsMenuOpen(false);
              }}
              className={`text-left text-sm font-semibold py-2.5 px-3.5 rounded-xl transition-colors hover:bg-slate-50 ${
                currentView === 'landing' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('jobs');
                setIsMenuOpen(false);
              }}
              className={`text-left text-sm font-semibold py-2.5 px-3.5 rounded-xl transition-colors hover:bg-slate-50 ${
                currentView === 'jobs' || currentView === 'job-details' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'
              }`}
            >
              Browse Jobs
            </button>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`text-left text-sm font-semibold py-2.5 px-3.5 rounded-xl transition-colors hover:bg-slate-50 flex items-center space-x-2.5 ${
                  currentView === 'dashboard' || currentView === 'create' || currentView === 'edit'
                    ? 'text-indigo-600 font-bold bg-indigo-50/50'
                    : 'text-slate-655'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Mobile Auth / Profile Section */}
          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated && user ? (
              <div className="flex flex-col space-y-3">
                {/* Profile Card */}
                <div className="flex items-center space-x-2.5 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/50">
                  <div className="bg-slate-200 p-1.5 rounded-lg text-slate-600">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[9px] text-slate-500 font-light mt-0.5">{user.email}</p>
                  </div>
                  <span className={`ml-auto border text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${
                    user.role === 'ADMIN' 
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-200/50' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                  }`}>
                    {user.role}
                  </span>
                </div>
                {/* Logout Action */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200/60 hover:border-red-200 text-slate-600 py-2.5 px-4 rounded-xl transition-all duration-200 font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setIsMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all duration-250 shadow-sm flex items-center justify-center"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
