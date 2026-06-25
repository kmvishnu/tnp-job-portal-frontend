import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { LogOut, Briefcase, User as UserIcon, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: string) => void;
  currentView: string;
  onLogoutClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView, onLogoutClick }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-all duration-200">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-navbar border-b border-slate-200/60 px-6 py-4 flex flex-col transition-all duration-200">
        <div className="flex items-center justify-between w-full">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              onNavigate('landing');
              setIsMenuOpen(false);
            }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                TNP Job Portal
              </h1>
              <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider leading-none mt-0.5">
                Admin Control Room
              </p>
            </div>
          </div>

          {user && (
            <>
              {/* Desktop Nav Items */}
              <div className="hidden md:flex items-center space-x-6">
                {/* User Session Info Card */}
                <div className="flex items-center space-x-3 bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200/40">
                  <div className="bg-slate-200 p-1.5 rounded-lg text-slate-600">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[9px] text-slate-500 font-light mt-0.5">{user.email}</p>
                  </div>
                  <span className="ml-2 bg-indigo-50 text-indigo-600 border border-indigo-150/40 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>

                {/* Navigation Actions */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onNavigate('landing')}
                    className="bg-white hover:bg-slate-50 text-slate-655 border border-slate-200 rounded-xl font-bold text-xs px-4 py-2.5 shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    Go to Site
                  </button>

                  {currentView === 'dashboard' && (
                    <button
                      onClick={() => onNavigate('create')}
                      className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      Post Job
                    </button>
                  )}
                  {currentView !== 'dashboard' && (
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="bg-white hover:bg-slate-50 text-slate-655 border border-slate-200 rounded-xl font-bold text-xs px-4 py-2.5 shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      Dashboard
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={onLogoutClick}
                    className="bg-white hover:bg-red-50 hover:text-red-650 border border-slate-200 hover:border-red-200 text-slate-500 p-2.5 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Hamburger Button (Mobile Only) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors shadow-sm focus:outline-none cursor-pointer"
                aria-label="Toggle Admin Menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Accordion Menu */}
        {isMenuOpen && user && (
          <div className="md:hidden w-full border-t border-slate-100 mt-4 pt-4 flex flex-col space-y-4 animate-fadeIn">
            {/* Navigation options */}
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onNavigate('landing');
                  setIsMenuOpen(false);
                }}
                className="text-left text-sm font-semibold py-2.5 px-3.5 rounded-xl transition-colors hover:bg-slate-50 text-slate-600"
              >
                Go to Site
              </button>
              {currentView === 'dashboard' ? (
                <button
                  onClick={() => {
                    onNavigate('create');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm font-semibold py-2.5 px-3.5 rounded-xl transition-colors hover:bg-slate-50 text-indigo-600 bg-indigo-50/50 font-bold"
                >
                  Post Job
                </button>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm font-semibold py-2.5 px-3.5 rounded-xl transition-colors hover:bg-slate-50 text-indigo-600 bg-indigo-50/50 font-bold"
                >
                  Dashboard
                </button>
              )}
            </nav>

            {/* User Session Info Card & Logout - Mobile */}
            <div className="border-t border-slate-100 pt-3 flex flex-col space-y-3">
              <div className="flex items-center space-x-2.5 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/50">
                <div className="bg-slate-200 p-1.5 rounded-lg text-slate-600">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                  <p className="text-[9px] text-slate-500 font-light mt-0.5">{user.email}</p>
                </div>
                <span className="ml-auto bg-indigo-50 text-indigo-600 border border-indigo-150/40 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {user.role}
                </span>
              </div>

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
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-6 text-center text-xs text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} TNP India Job Portal. All Rights Reserved. | Built with ❤️ by{' '}
          <a
            href="https://kmvishnu.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Vishnu KM
          </a>
        </p>
      </footer>
    </div>
  );
};
