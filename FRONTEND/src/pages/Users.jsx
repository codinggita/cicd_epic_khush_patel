import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, createUserByAdmin, updateUserByAdmin, deleteUserByAdmin, clearUserErrors 
} from '../store/userSlice';

// Icons imports (Material UI)
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Users() {
  const dispatch = useDispatch();
  const { usersList, pagination, loading, error, successMessage } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  // States
  const [searchVal, setSearchVal] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // If null, we are creating
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Fetch users list
  useEffect(() => {
    const query = { page, limit: 10 };
    if (searchVal.trim()) query.search = searchVal;
    dispatch(fetchUsers(query));
  }, [dispatch, page]);

  // Handle Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const query = { page: 1, limit: 10 };
    if (searchVal.trim()) query.search = searchVal;
    dispatch(fetchUsers(query));
  };

  // Open Create modal
  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'user' });
    dispatch(clearUserErrors());
    setModalOpen(true);
  };

  // Open Edit modal
  const openEditModal = (userItem) => {
    setEditingUser(userItem);
    setFormData({
      name: userItem.name,
      email: userItem.email,
      password: '', // Keep empty unless updating password
      role: userItem.role
    });
    dispatch(clearUserErrors());
    setModalOpen(true);
  };

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit (Create/Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      // If editing, filter out empty password so we don't overwrite with blank
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      
      dispatch(updateUserByAdmin({ id: editingUser._id, userData: payload })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setModalOpen(false);
          dispatch(fetchUsers({ page, limit: 10 }));
        }
      });
    } else {
      dispatch(createUserByAdmin(formData)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setModalOpen(false);
          dispatch(fetchUsers({ page, limit: 10 }));
        }
      });
    }
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (currentUser._id === id) {
      alert('You cannot delete your own admin account.');
      return;
    }
    if (window.confirm('Are you sure you want to permanently delete this user account?')) {
      dispatch(deleteUserByAdmin(id)).then(() => {
        dispatch(fetchUsers({ page, limit: 10 }));
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Alert toasts */}
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

      {/* Header action panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-darkCard/30 p-6 rounded-2xl border border-darkBorder/40">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Operations Team Administration</h1>
          <p className="text-sm text-slate-400">Add, configure, and audit administrative developer roles and permissions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all duration-150"
        >
          <AddIcon fontSize="small" />
          <span>Register User</span>
        </button>
      </div>

      {/* Search panel */}
      <div className="bg-darkCard/40 rounded-2xl border border-darkBorder p-5">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-3 text-slate-500" fontSize="small" />
            <input
              type="text"
              placeholder="Search users by name or email query..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full rounded-lg border border-darkBorder bg-slate-900/40 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600/10 border border-indigo-500/30 px-5 py-2.5 text-sm font-semibold text-indigo-400 hover:bg-indigo-600/20 transition-all duration-150"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users table card */}
      <div className="overflow-hidden rounded-2xl border border-darkBorder bg-glassBg backdrop-blur-xl">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent"></div>
          </div>
        ) : usersList.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <p className="text-lg font-semibold">No registered users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-darkBorder/60 bg-slate-950/30 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Permissions Role</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkBorder/40 text-sm">
                {usersList.map((usr) => (
                  <tr key={usr._id} className="hover:bg-slate-900/20 transition-all duration-150">
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-200">
                      {usr.name} {usr._id === currentUser._id && <span className="text-xs font-normal text-indigo-400 italic">(You)</span>}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-300 font-mono text-xs">{usr.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        usr.role === 'admin' 
                          ? 'bg-red-950/50 text-red-400 border border-red-800/30' 
                          : 'bg-green-950/50 text-green-400 border border-green-800/30'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-400 text-xs">
                      {new Date(usr.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => openEditModal(usr)}
                          title="Modify Account"
                          className="text-slate-500 hover:text-slate-200 transition duration-150"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          disabled={usr._id === currentUser._id}
                          onClick={() => handleDelete(usr._id)}
                          title="Delete Account"
                          className="text-slate-500 hover:text-red-500 disabled:opacity-30 disabled:pointer-events-none transition duration-150"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-darkBorder/40 bg-slate-950/20 px-6 py-4">
            <span className="text-xs text-slate-400 font-medium">
              Showing page <b className="text-indigo-400">{pagination.page}</b> of <b className="text-indigo-400">{pagination.totalPages}</b> ({pagination.total} users total)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={!pagination.hasPrevious}
                onClick={() => setPage(pagination.page - 1)}
                className="rounded-lg border border-darkBorder p-1.5 text-slate-400 hover:bg-slate-900/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition duration-150"
              >
                <ChevronLeftIcon />
              </button>
              <button
                disabled={!pagination.hasNext}
                onClick={() => setPage(pagination.page + 1)}
                className="rounded-lg border border-darkBorder p-1.5 text-slate-400 hover:bg-slate-900/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition duration-150"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Register/Update User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-darkBorder bg-darkCard/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-200">
                {editingUser ? 'Modify User Profile' : 'Register Operations Account'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition duration-150"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500"
                />
              </div>

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
                  placeholder="jane@example.com"
                  className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Password {editingUser && <span className="text-[10px] text-slate-500 lowercase">(leave blank to keep unchanged)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500"
                />
              </div>

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

              <div className="flex justify-end space-x-3 pt-4 border-t border-darkBorder/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-darkBorder px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-900/40 hover:text-slate-200 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all duration-150"
                >
                  {editingUser ? 'Save Profile' : 'Register Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
