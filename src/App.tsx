import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuthStatus, logout } from './store/authSlice';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { JobAction } from './pages/JobAction';
import { Layout } from './components/Layout';
import { Loader2, ShieldAlert, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  const [currentView, setCurrentView] = useState('dashboard'); // dashboard | create | edit
  const [editingJob, setEditingJob] = useState<any>(null);

  // Check authentication status on startup
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    if (view === 'edit' && data) {
      setEditingJob(data);
    } else {
      setEditingJob(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // 1. Initial Application Bootstrapping Loader
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 select-none">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-white tracking-wide">Bootstrapping Console</h3>
          <p className="text-xs text-slate-500 mt-1">Verifying encrypted administrator session tokens...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State: Render Login/Register
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  // 3. Authenticated but Authorization Check (Only ADMINs can view Admin Portal)
  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="inline-flex bg-red-950/30 border border-red-900/30 p-4 rounded-full text-red-500">
            <ShieldAlert className="h-10 w-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Access Forbidden</h3>
            <p className="text-sm text-slate-400">
              Your account has the <span className="font-semibold text-indigo-400">USER</span> role. 
              The administration panel requires elevated <span className="font-semibold text-red-400">ADMIN</span> permissions.
            </p>
          </div>
          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={handleLogout}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 border border-slate-700 hover:shadow-md"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Log In with Admin Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized State: Render Admin Layout & Subviews
  return (
    <Layout onNavigate={handleNavigate} currentView={currentView}>
      {currentView === 'dashboard' && (
        <AdminDashboard onNavigate={handleNavigate} />
      )}
      {currentView === 'create' && (
        <JobAction onBack={() => handleNavigate('dashboard')} />
      )}
      {currentView === 'edit' && (
        <JobAction jobToEdit={editingJob} onBack={() => handleNavigate('dashboard')} />
      )}
    </Layout>
  );
};

export default App;
