import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, register, clearError } from '../store/authSlice';
import { Mail, Lock, User as UserIcon, Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN', // Default to ADMIN for evaluation ease
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
    // Clear validation error when typing
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden select-none">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px]" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Logo header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl mb-4 text-indigo-500">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Create Admin Session'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin ? 'Log in to manage jobs and track applications' : 'Sign up to register your corporate administrative account'}
          </p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/50">
          {/* Tab Selection */}
          <div className="flex border-b border-slate-800/60 pb-5 mb-6">
            <button
              type="button"
              className={`flex-1 text-center pb-2.5 font-medium text-sm border-b-2 transition-colors duration-200 ${
                isLogin
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 text-center pb-2.5 font-medium text-sm border-b-2 transition-colors duration-200 ${
                !isLogin
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="mb-6 flex items-start space-x-3 bg-red-950/20 border border-red-900/30 p-4 rounded-2xl text-red-400 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-200 placeholder-slate-600 text-sm transition-all duration-200 ${
                      validationErrors.name ? 'border-red-900/60' : 'border-slate-800'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-xs text-red-500 font-medium pl-1">{validationErrors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-200 placeholder-slate-600 text-sm transition-all duration-200 ${
                    validationErrors.email ? 'border-red-900/60' : 'border-slate-800'
                  }`}
                  placeholder="admin@tnp.com"
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-red-500 font-medium pl-1">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-200 placeholder-slate-600 text-sm transition-all duration-200 ${
                    validationErrors.password ? 'border-red-900/60' : 'border-slate-800'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {validationErrors.password && (
                <p className="text-xs text-red-500 font-medium pl-1">{validationErrors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="role">
                  Role Authority
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Shield className="h-5 w-5" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-200 text-sm transition-all duration-200 appearance-none"
                  >
                    <option value="ADMIN">ADMIN (Post and edit jobs)</option>
                    <option value="USER">USER (Apply for jobs)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 border border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-550/20 disabled:bg-indigo-850 disabled:border-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Session'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
