import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuthStatus, logout } from './store/authSlice';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Discovery } from './pages/Discovery';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { JobAction } from './pages/JobAction';
import { Loader2, ShieldAlert, LogOut } from 'lucide-react';

interface RedirectState {
  view: string;
  jobId?: string;
}

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  const [currentView, setCurrentView] = useState('landing'); // landing | jobs | job-details | login | dashboard | create | edit
  const [editingJob, setEditingJob] = useState<any>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<RedirectState | null>(null);

  // 1. Initial Authentication Check on Mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // 2. Core Redirect Handler
  useEffect(() => {
    if (isAuthenticated && user) {
      if (redirectAfterLogin) {
        const { view, jobId } = redirectAfterLogin;
        setCurrentView(view);
        if (jobId) {
          setEditingJobId(jobId);
        }
        setRedirectAfterLogin(null); // Clear redirect
      } else if (currentView === 'login') {
        // Standard redirect if no saved redirect path is found
        if (user.role === 'ADMIN') {
          setCurrentView('dashboard');
        } else {
          setCurrentView('landing');
        }
      }
    }
  }, [isAuthenticated, user, redirectAfterLogin, currentView]);

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'login' && data?.redirect) {
      setRedirectAfterLogin(data.redirect);
    } else if (view !== 'login') {
      setRedirectAfterLogin(null);
    }

    setCurrentView(view);

    if (view === 'job-details' && data) {
      setEditingJobId(data);
    } else if (view === 'edit' && data) {
      setEditingJob(data);
    } else {
      setEditingJob(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setCurrentView('landing');
  };

  // Bootstrapping Loader
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 select-none">
        <Loader2 className="h-7 w-7 text-indigo-650 animate-spin" />
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-800 tracking-wide">Connecting Console</h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Verifying encrypted credential matrices...</p>
        </div>
      </div>
    );
  }

  // Admin Views Routing
  const isAdminView = ['dashboard', 'create', 'edit'].includes(currentView);

  if (isAdminView) {
    // If not logged in, force authentication
    if (!isAuthenticated || !user) {
      return <Login redirectInfo={{ view: currentView }} />;
    }

    // Role verification: Restrict to administrators
    if (user.role !== 'ADMIN') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="inline-flex bg-red-50 border border-red-200/50 p-4 rounded-full text-red-655">
              <ShieldAlert className="h-9 w-9 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 leading-none">Access Forbidden</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Your account authority level is <span className="font-bold text-indigo-600">USER</span>. 
                The requested panel requires elevated <span className="font-bold text-red-650">ADMIN</span> permissions.
              </p>
            </div>
            <div className="flex flex-col space-y-3 pt-2">
              <button
                onClick={handleLogout}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Log In as Admin</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

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
  }

  // Public Views Routing (Landing, Discovery, Details, Login)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all duration-200">
      <Header currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-8 animate-fadeIn">
        {currentView === 'landing' && (
          <Landing onNavigate={handleNavigate} />
        )}
        {currentView === 'jobs' && (
          <Discovery onNavigate={handleNavigate} />
        )}
        {currentView === 'job-details' && editingJobId && (
          <JobDetails 
            jobId={editingJobId} 
            onBack={() => handleNavigate('jobs')} 
            onNavigate={handleNavigate} 
          />
        )}
        {currentView === 'login' && (
          <Login redirectInfo={redirectAfterLogin} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200/60 py-6 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} TNP India Job Portal. All Rights Reserved. Powered by Icy Cyber Light Tech.</p>
      </footer>
    </div>
  );
};

export default App;
