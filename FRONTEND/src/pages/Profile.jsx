import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.password) delete payload.password; // Do not send blank password
    
    dispatch(updateProfile(payload));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Alerts */}
      {successMessage && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-4 text-sm text-emerald-400 shadow-md">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4 text-sm text-red-400 shadow-md">
          {error}
        </div>
      )}

      {/* Main card */}
      <div className="bg-glassBg border border-darkBorder rounded-2xl overflow-hidden shadow-xl">
        
        {/* Header */}
        <div className="bg-slate-950/30 px-6 py-5 border-b border-darkBorder/40 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-200">Account Credentials</h3>
            <p className="text-xs text-slate-400">Modify your login identity and display name</p>
          </div>
          <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
            user?.role === 'admin' 
              ? 'bg-red-950/50 text-red-400 border border-red-800/30' 
              : 'bg-green-950/50 text-green-400 border border-green-800/30'
          }`}>
            {user?.role}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Full Display Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Developer Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Password <span className="text-[10px] text-slate-500 lowercase">(leave blank to keep unchanged)</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-darkBorder/40 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}

export default Profile;
