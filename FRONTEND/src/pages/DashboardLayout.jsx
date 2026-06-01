import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

// Icons imports (Material UI)
import TerminalIcon from '@mui/icons-material/Terminal';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Workflows', path: '/guides', icon: <TerminalIcon /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChartIcon /> },
    { name: 'My Profile', path: '/profile', icon: <AccountCircleIcon /> },
  ];

  // Only expose User Management to Admin role
  if (user?.role === 'admin') {
    navLinks.push({ name: 'Users CRUD', path: '/users', icon: <PeopleIcon /> });
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/guides/')) return 'Workflow Pipeline Details';
    if (path === '/guides') return 'Continuous Integration Workflows';
    if (path === '/analytics') return 'Infrastructure Analytics';
    if (path === '/profile') return 'Developer Profile';
    if (path === '/users') return 'Operations User Administration';
    return 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-darkBg text-slate-100 font-sans">
      
      {/* 1. Mobile Sidebar Hamburger overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Navigation Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-darkBorder bg-glassBg/95 backdrop-blur-xl transition-all duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-darkBorder/40">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/40">
              C
            </div>
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-accentPurple to-accentCyan bg-clip-text text-transparent">
              CICD_Epic
            </span>
          </Link>
          <button 
            type="button" 
            className="text-slate-400 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
                             (link.path === '/guides' && location.pathname.startsWith('/guides/'));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 border-l-4 border-indigo-500 text-indigo-300'
                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Details */}
        <div className="border-t border-darkBorder/40 p-4 bg-slate-950/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 font-semibold border border-darkBorder">
              {user?.name?.substring(0, 2).toUpperCase() || 'OP'}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-slate-200">{user?.name || 'Developer'}</p>
              <span className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                user?.role === 'admin' ? 'bg-red-950/50 text-red-400 border border-red-800/30' : 'bg-green-950/50 text-green-400 border border-green-800/30'
              }`}>
                {user?.role || 'user'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center space-x-2 rounded-lg border border-darkBorder bg-slate-900/40 py-2 text-xs font-semibold text-slate-400 transition-all duration-150 hover:bg-red-950/15 hover:border-red-900/30 hover:text-red-400"
          >
            <LogoutIcon fontSize="small" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. Main content body */}
      <div className="flex flex-1 flex-col md:pl-64">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-darkBorder bg-darkBg/80 px-6 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="text-slate-400 hover:text-white md:hidden focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon />
            </button>
            <h2 className="text-lg font-bold text-slate-200">
              {getPageTitle()}
            </h2>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-medium">Environment: <b className="text-indigo-400 font-semibold uppercase">Development</b></span>
            <div className="h-4 w-px bg-darkBorder"></div>
            <span className="text-xs text-slate-400 font-medium">Status: <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span> Live</span>
          </div>
        </header>

        {/* Nested Routing Render */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
