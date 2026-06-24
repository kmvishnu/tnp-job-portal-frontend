import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { LogOut, Briefcase, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
            <Briefcase className="h-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              TNP Job Portal
            </h1>
            <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Admin Control Room</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-6">
            {/* User Session Info Card */}
            <div className="hidden sm:flex items-center space-x-3 bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-700/50">
              <div className="bg-slate-700/60 p-1.5 rounded-lg">
                <UserIcon className="h-4 w-4 text-slate-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-200 leading-tight">{user.name}</p>
                <p className="text-xs text-slate-400 leading-none">{user.email}</p>
              </div>
              <span className="ml-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                {user.role}
              </span>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-3">
              {currentView === 'dashboard' && (
                <button
                  onClick={() => onNavigate('create')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 flex items-center space-x-2 border border-indigo-500/30"
                >
                  <span>Post Job</span>
                </button>
              )}
              {currentView !== 'dashboard' && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm px-4 py-2 rounded-xl transition-all duration-200"
                >
                  Dashboard
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-red-950/30 border border-slate-700 hover:border-red-800/50 text-slate-300 hover:text-red-400 p-2.5 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-red-950/10 flex items-center justify-center"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} TNP India Job Portal. All Rights Reserved. Powered by Secure JWT Authentication.</p>
      </footer>
    </div>
  );
};
