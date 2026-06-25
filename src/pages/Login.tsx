import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, register, clearError } from '../store/authSlice';
import { Mail, Lock, User as UserIcon, Shield, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';

interface LoginProps {
  redirectInfo?: { view: string; jobId?: string } | null;
}

export const Login: React.FC<LoginProps> = ({ redirectInfo }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER', // Default to USER for candidate applications
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(clearError());
    setValidationErrors({});
  }, [isLogin, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!isLogin && !formData.name.trim()) {
      errors.name = 'Full Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isLogin) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      dispatch(register(formData));
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-6 sm:py-10 relative overflow-hidden select-none">
      {/* Soft background icy glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-200/10 rounded-full blur-[112px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-200/10 rounded-full blur-[112px]" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center">
          <div className="inline-flex bg-white border border-slate-200/60 p-3 rounded-2xl shadow-sm mb-4 text-indigo-600">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
            {isLogin ? 'Sign In to Portal' : 'Create Candidate Account'}
          </h2>
          <p className="mt-2 text-xs text-slate-400 font-semibold tracking-wide uppercase">
            {isLogin ? 'Enter your credential architecture' : 'Register details to apply for vacancies'}
          </p>
        </div>

        {/* Redirect Notice */}
        {redirectInfo && (
          <div className="flex items-center space-x-3 bg-indigo-50 border border-indigo-200/40 p-4 rounded-2xl text-indigo-600 text-xs font-semibold shadow-sm animate-fadeIn">
            <Sparkles className="h-4.5 w-4.5 shrink-0 text-indigo-500" />
            <span>Authentication required. Please log in to complete your job application.</span>
          </div>
        )}

        {/* Login/Register Card Container */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 pb-4 mb-6">
            <button
              type="button"
              className={`flex-1 text-center pb-2 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors duration-150 ${
                isLogin
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 text-center pb-2 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors duration-150 ${
                !isLogin
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-4.5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-xs transition-all duration-200 ${
                      validationErrors.name ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Candidate Name"
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-[10px] text-red-500 font-semibold pl-1">{validationErrors.name}</p>
                )}
              </div>
            )}

            {/* Clean Crimson Login Error Warning Banner */}
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200 flex items-start space-x-2 animate-fadeIn font-semibold">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-xs transition-all duration-200 ${
                    validationErrors.email ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="candidate@nexus.com"
                />
              </div>
              {validationErrors.email && (
                <p className="text-[10px] text-red-500 font-semibold pl-1">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-xs transition-all duration-200 ${
                    validationErrors.password ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {validationErrors.password && (
                <p className="text-[10px] text-red-500 font-semibold pl-1">{validationErrors.password}</p>
              )}
            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.005]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
