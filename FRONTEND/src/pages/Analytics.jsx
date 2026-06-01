import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalyticsWorkflows } from '../store/dataSlice';

// Recharts imports
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

function Analytics() {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchAnalyticsWorkflows('latest'));
    dispatch(fetchAnalyticsWorkflows('trending'));
    dispatch(fetchAnalyticsWorkflows('popular'));
    dispatch(fetchAnalyticsWorkflows('recommended'));
  }, [dispatch]);

  // Format charts data
  const getTrendingChartData = () => {
    return analytics.trending.map(item => ({
      name: item.instruction.substring(0, 15) + '...',
      runs: item.runCount,
      views: item.views
    }));
  };

  const getRecommendedChartData = () => {
    return analytics.recommended.map(item => ({
      name: item.instruction.substring(0, 15) + '...',
      rating: item.rating,
      views: Math.round(item.views / 100) // Scaled down for bar parity
    }));
  };

  const getDifficultyDistributionData = () => {
    // Counts mock distribution based on analytics data loaded
    const counts = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
    [...analytics.trending, ...analytics.popular, ...analytics.recommended].forEach(item => {
      if (counts[item.difficulty] !== undefined) {
        counts[item.difficulty]++;
      }
    });

    return [
      { name: 'Beginner', value: counts.beginner || 4, color: '#34d399' },
      { name: 'Intermediate', value: counts.intermediate || 6, color: '#fbbf24' },
      { name: 'Advanced', value: counts.advanced || 5, color: '#fb923c' },
      { name: 'Expert', value: counts.expert || 3, color: '#f87171' }
    ];
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-darkCard/30 border border-darkBorder/40 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Indexed Pipelines</p>
          <h2 className="text-3xl font-extrabold text-slate-100 mt-1">2,708</h2>
          <span className="text-[10px] text-emerald-400 font-medium">100% Synced from JSON</span>
        </div>
        <div className="bg-darkCard/30 border border-darkBorder/40 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Top Technology</p>
          <h2 className="text-3xl font-extrabold text-indigo-400 mt-1">Docker</h2>
          <span className="text-[10px] text-indigo-400 font-medium">1,810 guides active</span>
        </div>
        <div className="bg-darkCard/30 border border-darkBorder/40 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg Quality Rating</p>
          <h2 className="text-3xl font-extrabold text-cyan-400 mt-1">⭐ 4.3</h2>
          <span className="text-[10px] text-slate-400 font-medium">Based on developer reviews</span>
        </div>
        <div className="bg-darkCard/30 border border-darkBorder/40 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simulated Runs</p>
          <h2 className="text-3xl font-extrabold text-emerald-400 mt-1">84,124</h2>
          <span className="text-[10px] text-emerald-400 font-medium">▲ 12.4% weekly uptime</span>
        </div>
      </div>

      {/* Main charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Trending Workflows (Bar Chart) */}
        <div className="lg:col-span-8 bg-glassBg border border-darkBorder/40 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Trending Pipelines</h3>
            <p className="text-xs text-slate-400">Top executing pipelines ranked by combined run count and views</p>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getTrendingChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: '#161e31', border: '1px solid #23304c', color: '#f1f5f9' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="runs" name="Run Execution Count" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="views" name="View Count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Difficulty Distribution (Pie Chart) */}
        <div className="lg:col-span-4 bg-glassBg border border-darkBorder/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Difficulty Share</h3>
            <p className="text-xs text-slate-400">Distribution of pipelines by experience level</p>
          </div>
          <div className="h-56 flex items-center justify-center">
            {loading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getDifficultyDistributionData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {getDifficultyDistributionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#161e31', border: '1px solid #23304c', color: '#f1f5f9' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          {/* Legend indicator */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {getDifficultyDistributionData().map(d => (
              <div key={d.name} className="flex items-center space-x-1.5 justify-center py-1 rounded bg-slate-950/20 border border-darkBorder/25">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-400 font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Popular Ratings vs Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended Workflows metrics */}
        <div className="lg:col-span-7 bg-glassBg border border-darkBorder/40 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Highly Recommended Pipelines</h3>
            <p className="text-xs text-slate-400">Workflow guides with top quality ratings compared to viewer counts</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getRecommendedChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23304c" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#161e31', border: '1px solid #23304c' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="rating" name="Rating (1-5)" stroke="#fbbf24" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="views" name="Views (x100)" stroke="#22d3ee" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest pipelines summary cards */}
        <div className="lg:col-span-5 bg-glassBg border border-darkBorder/40 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Newly Registered Pipelines</h3>
            <p className="text-xs text-slate-400">Inspect the latest templates uploaded by operations team</p>
          </div>
          <div className="space-y-3 h-[240px] overflow-y-auto pr-1">
            {analytics.latest.map(item => (
              <div 
                key={item._id} 
                className="p-3 bg-slate-900/30 border border-darkBorder/30 rounded-xl flex items-center justify-between hover:bg-slate-900/50 transition duration-100"
              >
                <div className="space-y-0.5 truncate mr-2">
                  <p className="text-xs font-semibold text-slate-200 truncate">{item.instruction}</p>
                  <span className="inline-block text-[9px] bg-slate-800 text-slate-400 px-1 rounded uppercase tracking-wider font-mono">
                    {item.topic}
                  </span>
                </div>
                <div className="whitespace-nowrap">
                  <span className="text-[10px] text-indigo-400 font-semibold">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Analytics;
