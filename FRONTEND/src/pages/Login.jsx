import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearAuthErrors } from '../store/authSlice';

function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    // Clear errors when swapping login/register tabs
    dispatch(clearAuthErrors());
  }, [isLogin, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      dispatch(registerUser(formData));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-darkBg px-4 py-12 text-slate-100 overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]"></div>

      <div className="w-full max-w-md rounded-2xl border border-darkBorder bg-glassBg p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-accentPurple to-accentCyan bg-clip-text text-transparent">
            CICD_Epic
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin ? 'Sign in to access workflows & infra guides' : 'Create an account to start managing pipelines'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-lg bg-slate-900/50 p-1 border border-darkBorder/40">
          <button
            type="button"
            className={`w-1/2 rounded-md py-2 text-sm font-semibold transition-all duration-200 ${
              isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`w-1/2 rounded-md py-2 text-sm font-semibold transition-all duration-200 ${
              !isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Error message card */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-950/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition duration-150 focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition duration-150 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              min={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition duration-150 focus:border-indigo-500"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Account Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="user" className="bg-slate-950">Developer (Standard User)</option>
                <option value="admin" className="bg-slate-950">Lead Ops (Administrator)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-150 hover:bg-indigo-500 hover:shadow-indigo-500/35 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
