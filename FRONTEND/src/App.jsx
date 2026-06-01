import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadProfile } from './store/authSlice';

// Pages imports
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import Guides from './pages/Guides';
import GuideDetails from './pages/GuideDetails';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Profile from './pages/Profile';

/**
 * Route protector for logged in sessions.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user, loading } = useSelector((state) => state.auth);

  if (loading && !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-darkBg text-indigo-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/guides" replace />;
  }

  return children;
};

/**
 * Route protector for guest sessions (login/register).
 */
const GuestRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (token) {
    return <Navigate to="/guides" replace />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadProfile());
    }
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest Authentication page */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Protected Dashboard Layout and Sub-Views */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Route redirects to Guides */}
          <Route index element={<Navigate to="/guides" replace />} />
          
          <Route path="guides" element={<Guides />} />
          <Route path="guides/:id" element={<GuideDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Admin Only routes */}
          <Route
            path="users"
            element={
              <ProtectedRoute adminOnly={true}>
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback to Guides */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
