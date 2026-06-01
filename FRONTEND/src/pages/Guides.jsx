import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWorkflows, createWorkflow, archiveWorkflow, deleteWorkflow, cloneWorkflow } from '../store/dataSlice';

// Icons imports (Material UI)
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Guides() {
  const dispatch = useDispatch();
  const { workflows, pagination, loading, successMessage, error } = useSelector((state) => state.data);

  // States
  const [searchVal, setSearchVal] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    difficulty: '',
    topic: '',
    sort: '-createdAt'
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newWorkflowData, setNewWorkflowData] = useState({
    instruction: '',
    output: '',
    topic: '',
    difficulty: 'beginner'
  });

  // Fetch workflows on mount and when filters change
  useEffect(() => {
    const query = { ...filters };
    if (searchVal.trim()) query.search = searchVal;
    dispatch(fetchWorkflows(query));
  }, [dispatch, filters]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 }); // Reset to page 1
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchVal('');
    setFilters({
      page: 1,
      limit: 10,
      difficulty: '',
      topic: '',
      sort: '-createdAt'
    });
  };

  // Modal handlers
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    dispatch(createWorkflow(newWorkflowData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setModalOpen(false);
        setNewWorkflowData({ instruction: '', output: '', topic: '', difficulty: 'beginner' });
      }
    });
  };

  // Difficulty badge color mapping
  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'beginner': return 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
      case 'intermediate': return 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
      case 'advanced': return 'bg-orange-950/40 text-orange-400 border border-orange-500/20';
      case 'expert': return 'bg-red-950/40 text-red-400 border border-red-500/20';
      default: return 'bg-slate-950/40 text-slate-400 border border-slate-500/20';
    }
  };

  // Major topics for dropdown selection
  const popularTopics = [
    'docker', 'kubernetes', 'jenkins', 'gitlab-ci', 'terraform', 'go', 'monitoring', 'testing', 'github-actions'
  ];

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

      {/* Top action header card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-darkCard/30 p-6 rounded-2xl border border-darkBorder/40">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Workflows Library</h1>
          <p className="text-sm text-slate-400">Query, inspect, and trigger your continuous deployment workflows</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all duration-150"
        >
          <AddIcon fontSize="small" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Filter and search panel */}
      <div className="bg-darkCard/40 rounded-2xl border border-darkBorder p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-3 text-slate-500" fontSize="small" />
            <input
              type="text"
              placeholder="Search by keywords inside instruction or output..."
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

        <div className="flex flex-wrap gap-4 items-center justify-between border-t border-darkBorder/40 pt-4">
          <div className="flex flex-wrap gap-3 items-center">
            <FilterAltIcon className="text-slate-500" fontSize="small" />
            
            {/* Difficulty select */}
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value, page: 1 })}
              className="rounded-lg border border-darkBorder bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="" className="bg-slate-950">All Difficulties</option>
              <option value="beginner" className="bg-slate-950">Beginner</option>
              <option value="intermediate" className="bg-slate-950">Intermediate</option>
              <option value="advanced" className="bg-slate-950">Advanced</option>
              <option value="expert" className="bg-slate-950">Expert</option>
            </select>

            {/* Topic select */}
            <select
              value={filters.topic}
              onChange={(e) => setFilters({ ...filters, topic: e.target.value, page: 1 })}
              className="rounded-lg border border-darkBorder bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="" className="bg-slate-950">All Topics</option>
              {popularTopics.map(t => (
                <option key={t} value={t} className="bg-slate-950">{t}</option>
              ))}
            </select>

            {/* Sort select */}
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="rounded-lg border border-darkBorder bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="-createdAt" className="bg-slate-950">Sort: Newest First</option>
              <option value="createdAt" className="bg-slate-950">Sort: Oldest First</option>
              <option value="-views" className="bg-slate-950">Sort: Most Viewed</option>
              <option value="-runCount" className="bg-slate-950">Sort: Most Run</option>
              <option value="-rating" className="bg-slate-950">Sort: Highest Rated</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition duration-150"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main workflows list table card */}
      <div className="overflow-hidden rounded-2xl border border-darkBorder bg-glassBg backdrop-blur-xl">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent"></div>
          </div>
        ) : workflows.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <p className="text-lg font-semibold">No workflows found</p>
            <p className="text-sm mt-1">Try relaxing your search terms or filter constraints</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-darkBorder/60 bg-slate-950/30 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Topic</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Pipeline Instruction</th>
                  <th className="px-6 py-4 text-center">Views</th>
                  <th className="px-6 py-4 text-center">Runs</th>
                  <th className="px-6 py-4 text-center">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkBorder/40 text-sm">
                {workflows.map((wf) => (
                  <tr key={wf._id} className="hover:bg-slate-900/20 transition-all duration-150">
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-block rounded bg-indigo-950/40 px-2 py-0.5 text-xs font-bold text-indigo-400 border border-indigo-500/10">
                        {wf.topic}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${getDifficultyColor(wf.difficulty)}`}>
                        {wf.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/guides/${wf._id}`} className="font-semibold text-slate-200 hover:text-indigo-400 transition-all duration-150">
                        {wf.instruction.length > 80 ? `${wf.instruction.substring(0, 80)}...` : wf.instruction}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-slate-400 font-medium">{wf.views}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-slate-400 font-medium">{wf.runCount}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-indigo-300 font-bold">⭐ {wf.rating.toFixed(1)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2.5">
                        <button
                          onClick={() => dispatch(cloneWorkflow(wf._id))}
                          title="Clone Workflow"
                          className="text-slate-500 hover:text-slate-200 transition duration-150"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => dispatch(archiveWorkflow(wf._id))}
                          title="Archive Workflow"
                          className="text-slate-500 hover:text-amber-500 transition duration-150"
                        >
                          <ArchiveIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => dispatch(deleteWorkflow(wf._id))}
                          title="Delete Workflow"
                          className="text-slate-500 hover:text-red-500 transition duration-150"
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

        {/* Pagination bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-darkBorder/40 bg-slate-950/20 px-6 py-4">
            <span className="text-xs text-slate-400 font-medium">
              Showing page <b className="text-indigo-400">{pagination.page}</b> of <b className="text-indigo-400">{pagination.totalPages}</b> ({pagination.total} total items)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={!pagination.hasPrevious}
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                className="rounded-lg border border-darkBorder p-1.5 text-slate-400 hover:bg-slate-900/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transitionduration-150"
              >
                <ChevronLeftIcon />
              </button>
              <button
                disabled={!pagination.hasNext}
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                className="rounded-lg border border-darkBorder p-1.5 text-slate-400 hover:bg-slate-900/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition duration-150"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Create Workflow Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-darkBorder bg-darkCard/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-200">Register New Pipeline</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition duration-150"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Instruction / Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={newWorkflowData.instruction}
                  onChange={(e) => setNewWorkflowData({ ...newWorkflowData, instruction: e.target.value })}
                  placeholder="e.g. Deploy container to Kubernetes staging pod"
                  className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Output Code / Script Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={newWorkflowData.output}
                  onChange={(e) => setNewWorkflowData({ ...newWorkflowData, output: e.target.value })}
                  placeholder="e.g. kubectl apply -f deployment.yml"
                  className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm font-mono text-indigo-300 placeholder-slate-600 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Pipeline Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorkflowData.topic}
                    onChange={(e) => setNewWorkflowData({ ...newWorkflowData, topic: e.target.value.toLowerCase() })}
                    placeholder="e.g. kubernetes"
                    className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Difficulty level
                  </label>
                  <select
                    value={newWorkflowData.difficulty}
                    onChange={(e) => setNewWorkflowData({ ...newWorkflowData, difficulty: e.target.value })}
                    className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="beginner" className="bg-slate-950">Beginner</option>
                    <option value="intermediate" className="bg-slate-950">Intermediate</option>
                    <option value="advanced" className="bg-slate-950">Advanced</option>
                    <option value="expert" className="bg-slate-950">Expert</option>
                  </select>
                </div>
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
                  Create Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Guides;
