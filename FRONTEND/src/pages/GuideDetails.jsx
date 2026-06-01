import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchWorkflowById, fetchVersions, fetchHistory, 
  runWorkflow, cancelRun, updateWorkflow, deleteWorkflow,
  clearCurrentWorkflow 
} from '../store/dataSlice';

// Icons imports (Material UI)
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TerminalIcon from '@mui/icons-material/Terminal';
import HistoryIcon from '@mui/icons-material/History';
import LayersIcon from '@mui/icons-material/Layers';

// Recharts imports
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function GuideDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    currentWorkflow, versions, history, logs, metrics, loading, successMessage, error 
  } = useSelector((state) => state.data);

  // States
  const [activeTab, setActiveTab] = useState('history'); // history or versions
  const [copied, setCopied] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    instruction: '',
    output: '',
    topic: '',
    difficulty: ''
  });

  // Fetch workflow details, runs history, and version history on mount
  useEffect(() => {
    dispatch(fetchWorkflowById(id));
    dispatch(fetchVersions(id));
    dispatch(fetchHistory(id));

    return () => {
      dispatch(clearCurrentWorkflow());
    };
  }, [dispatch, id]);

  // Load edit data once details are fetched
  useEffect(() => {
    if (currentWorkflow) {
      setEditData({
        instruction: currentWorkflow.instruction,
        output: currentWorkflow.output,
        topic: currentWorkflow.topic,
        difficulty: currentWorkflow.difficulty
      });
    }
  }, [currentWorkflow]);

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (currentWorkflow?.output) {
      navigator.clipboard.writeText(currentWorkflow.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Trigger Edit submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateWorkflow({ id, workflowData: editData })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setEditModalOpen(false);
        dispatch(fetchVersions(id)); // Reload version logs
      }
    });
  };

  // Delete handler
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this workflow?')) {
      dispatch(deleteWorkflow(id)).then(() => {
        navigate('/guides');
      });
    }
  };

  // Chart data formatting
  const getMetricsChartData = () => {
    if (!metrics?.metrics) return [];
    return [
      { name: 'CPU (%)', value: metrics.metrics.cpuUsagePercent, fill: '#818cf8' },
      { name: 'RAM (x10 MB)', value: Math.round(metrics.metrics.memoryUsageMb / 10), fill: '#22d3ee' },
      { name: 'Duration (s)', value: Math.round(metrics.metrics.durationMs / 1000), fill: '#34d399' }
    ];
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'beginner': return 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
      case 'intermediate': return 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
      case 'advanced': return 'bg-orange-950/40 text-orange-400 border border-orange-500/20';
      case 'expert': return 'bg-red-950/40 text-red-400 border border-red-500/20';
      default: return 'bg-slate-950/40 text-slate-400 border border-slate-500/20';
    }
  };

  if (loading && !currentWorkflow) {
    return (
      <div className="flex h-64 items-center justify-center bg-darkBg text-indigo-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentWorkflow) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg font-semibold">Workflow pipeline not found</p>
        <Link to="/guides" className="mt-4 inline-block text-sm text-indigo-400 hover:underline">
          Back to Workflows
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Alert toasts */}
      {successMessage && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-4 text-sm text-emerald-400 shadow-md">
          {successMessage}
        </div>
      )}

      {/* Back button and page controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link 
          to="/guides" 
          className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition duration-150"
        >
          <ArrowBackIcon fontSize="small" />
          <span>Back to Workflows</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-lg border border-darkBorder bg-slate-900/40 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900/80 transition duration-150"
          >
            <EditIcon fontSize="small" />
            <span>Edit Code</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1.5 rounded-lg border border-red-950/30 bg-red-950/10 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30 hover:border-red-900/40 transition duration-150"
          >
            <DeleteIcon fontSize="small" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main detail card */}
      <div className="bg-darkCard/20 border border-darkBorder/40 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="rounded bg-indigo-950/40 px-2 py-0.5 text-xs font-bold text-indigo-400 border border-indigo-500/10">
            {currentWorkflow.topic}
          </span>
          <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${getDifficultyColor(currentWorkflow.difficulty)}`}>
            {currentWorkflow.difficulty}
          </span>
          <div className="flex-1"></div>
          <div className="text-xs text-slate-400">
            Views: <b className="text-slate-200 mr-3">{currentWorkflow.views}</b>
            Runs: <b className="text-slate-200">⭐ {currentWorkflow.runCount}</b>
          </div>
        </div>
        <h1 className="text-xl font-bold text-slate-100 mb-2">
          {currentWorkflow.instruction}
        </h1>
        <p className="text-xs text-slate-500">Pipeline ID: {currentWorkflow._id} | Registered: {new Date(currentWorkflow.createdAt).toLocaleString()}</p>
      </div>

      {/* Layout Split: Left details & logs, Right versions & runs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Code & Terminal Stream) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Code display block */}
          <div className="rounded-2xl border border-darkBorder bg-slate-950/90 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between bg-slate-950 px-5 py-3 border-b border-darkBorder/40">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                pipeline_source.sh
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition duration-150"
              >
                {copied ? <CheckIcon fontSize="small" className="text-emerald-400" /> : <ContentCopyIcon fontSize="small" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-5 overflow-x-auto text-sm text-indigo-300 font-mono leading-relaxed bg-slate-950/40">
              <code>{currentWorkflow.output}</code>
            </pre>
          </div>

          {/* Terminal Logs & Executions */}
          <div className="rounded-2xl border border-darkBorder bg-glassBg backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between bg-slate-950/30 px-5 py-4 border-b border-darkBorder/40">
              <div className="flex items-center space-x-2">
                <TerminalIcon className="text-indigo-400" fontSize="small" />
                <span className="text-sm font-bold text-slate-200">Execution Console</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => dispatch(runWorkflow(id))}
                  className="flex items-center space-x-1 rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition duration-150"
                >
                  <PlayArrowIcon fontSize="small" />
                  <span>Run Pipeline</span>
                </button>
                {logs?.status === 'running' && (
                  <button
                    onClick={() => dispatch(cancelRun(id))}
                    className="flex items-center space-x-1 rounded border border-red-500/20 bg-red-950/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-950/30 transition duration-150"
                  >
                    <CancelIcon fontSize="small" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Terminal Screen */}
            <div className="p-5 bg-slate-950 text-slate-300 font-mono text-xs leading-relaxed space-y-1.5 h-64 overflow-y-auto">
              {!logs ? (
                <div className="flex h-full items-center justify-center text-slate-600 italic">
                  Console idle. Click "Run Pipeline" to trigger execution run.
                </div>
              ) : (
                <>
                  <div className="text-slate-500 border-b border-darkBorder/25 pb-1 mb-2">
                    RUN_ID: {logs.runId} | STATUS: 
                    <span className={`ml-1 font-bold ${
                      logs.status === 'completed' ? 'text-emerald-400' :
                      logs.status === 'failed' ? 'text-red-400' :
                      logs.status === 'cancelled' ? 'text-amber-400' : 'text-indigo-400 animate-pulse'
                    }`}>
                      {logs.status.toUpperCase()}
                    </span>
                  </div>
                  {logs.logs.map((logLine, idx) => {
                    let colorClass = 'text-slate-300';
                    if (logLine.includes('ERROR') || logLine.includes('FATAL')) colorClass = 'text-red-400';
                    else if (logLine.includes('SUCCESS') || logLine.includes('PASS')) colorClass = 'text-emerald-400';
                    else if (logLine.includes('WARN')) colorClass = 'text-amber-400';
                    else if (logLine.includes('DEBUG')) colorClass = 'text-purple-400';
                    return (
                      <div key={idx} className={colorClass}>
                        {logLine}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Performance metrics dashboard chart */}
          {metrics && (
            <div className="rounded-2xl border border-darkBorder bg-glassBg backdrop-blur-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-200">Execution Performance Diagnostics</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* Recharts chart */}
                <div className="w-full sm:w-1/2 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getMetricsChartData()} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={90} stroke="#94a3b8" fontSize={11} />
                      <Tooltip formatter={(value) => [value, '']} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Stats cards list */}
                <div className="grid grid-cols-3 gap-4 w-full sm:w-1/2">
                  <div className="bg-slate-900/50 border border-darkBorder/40 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">CPU Peak</p>
                    <p className="text-lg font-bold text-indigo-400 mt-1">{metrics.metrics.cpuUsagePercent}%</p>
                  </div>
                  <div className="bg-slate-900/50 border border-darkBorder/40 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Memory</p>
                    <p className="text-lg font-bold text-cyan-400 mt-1">{metrics.metrics.memoryUsageMb}MB</p>
                  </div>
                  <div className="bg-slate-900/50 border border-darkBorder/40 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Duration</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">{(metrics.metrics.durationMs / 1000).toFixed(1)}s</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Tabs for Versions & Runs) */}
        <div className="lg:col-span-5">
          
          <div className="rounded-2xl border border-darkBorder bg-glassBg backdrop-blur-xl overflow-hidden flex flex-col h-full">
            
            {/* Tabs Header */}
            <div className="flex border-b border-darkBorder bg-slate-950/30 p-1">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'history'
                    ? 'bg-indigo-600/15 border-b-2 border-indigo-500 text-indigo-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HistoryIcon fontSize="small" />
                <span>Runs History ({history.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('versions')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'versions'
                    ? 'bg-indigo-600/15 border-b-2 border-indigo-500 text-indigo-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayersIcon fontSize="small" />
                <span>Versions ({versions.length})</span>
              </button>
            </div>

            {/* Tabs Body */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[600px]">
              
              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 italic text-sm">
                      No execution run history logged.
                    </div>
                  ) : (
                    history.map((run) => (
                      <div 
                        key={run._id} 
                        className="p-3 bg-slate-900/40 border border-darkBorder/40 rounded-xl flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            run.status === 'completed' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/30' :
                            run.status === 'failed' ? 'bg-red-950/50 text-red-400 border border-red-800/30' :
                            run.status === 'cancelled' ? 'bg-amber-950/50 text-amber-400 border border-amber-800/30' :
                            'bg-indigo-950/50 text-indigo-400 border border-indigo-800/30'
                          }`}>
                            {run.status}
                          </span>
                          <p className="text-[10px] text-slate-500">{new Date(run.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          <p>Duration: <b className="text-slate-200">{(run.metrics.durationMs / 1000).toFixed(1)}s</b></p>
                          <p>CPU: <b className="text-slate-200">{run.metrics.cpuUsagePercent}%</b></p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Versions Tab */}
              {activeTab === 'versions' && (
                <div className="space-y-3">
                  {versions.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 italic text-sm">
                      No versions history logged.
                    </div>
                  ) : (
                    versions.map((ver) => (
                      <div 
                        key={ver._id} 
                        className="p-3 bg-slate-900/40 border border-darkBorder/40 rounded-xl flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold font-mono text-indigo-400 text-xs">V{ver.version}</span>
                            <span className="text-[10px] font-semibold uppercase px-1 rounded bg-slate-800 text-slate-400">
                              {ver.changeType}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{new Date(ver.changedAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right text-xs max-w-[180px] truncate italic text-slate-400 font-mono">
                          {ver.instruction.substring(0, 30)}...
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Edit Code Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-darkBorder bg-darkCard/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-200">Modify Pipeline Source</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition duration-150"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Instruction / Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={editData.instruction}
                  onChange={(e) => setEditData({ ...editData, instruction: e.target.value })}
                  placeholder="e.g. Deploy container to Kubernetes staging pod"
                  className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Output Code / Script Content
                </label>
                <textarea
                  required
                  rows={6}
                  value={editData.output}
                  onChange={(e) => setEditData({ ...editData, output: e.target.value })}
                  placeholder="e.g. kubectl apply -f deployment.yml"
                  className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm font-mono text-indigo-300 outline-none focus:border-indigo-500"
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
                    value={editData.topic}
                    onChange={(e) => setEditData({ ...editData, topic: e.target.value.toLowerCase() })}
                    placeholder="e.g. kubernetes"
                    className="w-full rounded-lg border border-darkBorder bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Difficulty level
                  </label>
                  <select
                    value={editData.difficulty}
                    onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
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
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-lg border border-darkBorder px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-900/40 hover:text-slate-200 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all duration-150"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuideDetails;
