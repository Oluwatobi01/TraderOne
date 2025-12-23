import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Flame, 
  Search, 
  Filter,
  ArrowRight
} from 'lucide-react';

const chartDataSets: Record<string, any[]> = {
  '1M': [
    { name: 'Week 1', value: 12000 },
    { name: 'Week 2', value: 12800 },
    { name: 'Week 3', value: 12400 },
    { name: 'Week 4', value: 13500 },
  ],
  '3M': [
    { name: 'Aug', value: 10500 },
    { name: 'Sep', value: 11200 },
    { name: 'Oct', value: 12450 },
  ],
  'YTD': [
    { name: 'JAN', value: 8000 },
    { name: 'MAR', value: 10000 },
    { name: 'APR', value: 9500 },
    { name: 'JUN', value: 11000 },
    { name: 'AUG', value: 11500 },
    { name: 'OCT', value: 12450 },
  ],
  'ALL': [
    { name: '2021', value: 4000 },
    { name: '2022', value: 8500 },
    { name: '2023', value: 12450 },
  ]
};

const allTrades = [
  { id: 1, pair: 'BTC/USD', type: 'LONG', setup: 'Breakout Retest', entry: '34,250.00', exit: '34,850.00', pnl: '+$1,200.00', pnlPerc: '+1.75%', status: 'WIN', time: '10:42 AM' },
  { id: 2, pair: 'TSLA', type: 'SHORT', setup: 'Gap Fill', entry: '245.50', exit: '248.00', pnl: '-$250.00', pnlPerc: '-1.01%', status: 'LOSS', time: 'Yesterday' },
  { id: 3, pair: 'XAU/USD', type: 'LONG', setup: 'Supply Zone', entry: '1,980.50', exit: '1,995.00', pnl: '+$725.00', pnlPerc: '+0.73%', status: 'WIN', time: 'Yesterday' },
  { id: 4, pair: 'ETH/USD', type: 'SHORT', setup: 'Liquidity Grab', entry: '1,850.00', exit: '1,840.00', pnl: '+$150.00', pnlPerc: '+0.81%', status: 'WIN', time: 'Oct 22' },
  { id: 5, pair: 'NVDA', type: 'LONG', setup: 'Trend Following', entry: '420.00', exit: '425.00', pnl: '+$500.00', pnlPerc: '+1.19%', status: 'WIN', time: 'Oct 21' },
];

const StatCard = ({ title, value, subValue, subLabel, icon: Icon, trend, isFire }: any) => (
  <div className={`p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group border border-gray-200 dark:border-white/5 transition-all duration-300 hover:border-emerald-300 dark:hover:border-white/10 ${isFire ? 'bg-gradient-to-br from-emerald-900 to-[#1a3a25] dark:from-card-dark dark:to-[#1a3a25]' : 'glass-panel shadow-sm'}`}>
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={40} className={`text-gray-900 dark:text-white ${isFire ? 'text-white' : ''}`} />
    </div>
    <p className={`text-sm font-medium uppercase tracking-wider font-display ${isFire ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{title}</p>
    <div className="flex items-end gap-2 z-10">
      <p className={`text-2xl lg:text-3xl font-bold leading-tight font-display ${isFire ? 'text-white' : 'text-gray-900 dark:text-white glow-text'}`}>{value}</p>
    </div>
    <div className="flex items-center gap-1 mt-2 z-10">
      {trend && (
        <>
          {trend === 'up' ? <TrendingUp size={14} className="text-emerald-600 dark:text-primary" /> : <TrendingDown size={14} className="text-emerald-600 dark:text-primary" />}
          <p className="text-emerald-600 dark:text-primary text-sm font-bold font-display">{subValue}</p>
        </>
      )}
      {isFire && (
        <>
          <Flame size={14} className="text-orange-500" />
          <p className="text-orange-500 text-sm font-bold font-display">{subValue}</p>
        </>
      )}
      {!isFire && <p className={`text-xs ml-1 ${isFire ? 'text-gray-300' : 'text-gray-500 dark:text-gray-600'}`}>{subLabel}</p>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('YTD');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWins, setFilterWins] = useState(false);

  // Check if dark mode is active for chart colors
  const isDark = document.documentElement.classList.contains('dark');

  // Filter trades based on search and win status
  const displayedTrades = allTrades.filter(trade => {
    const matchesSearch = trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trade.setup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterWins ? trade.status === 'WIN' : true;
    return matchesSearch && matchesFilter;
  }).slice(0, 3); // Keep only top 3 for dashboard view

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2 font-display">
          <span className="w-2 h-8 bg-emerald-600 dark:bg-primary rounded-full inline-block shadow-sm dark:shadow-neon"></span>
          Dashboard Overview
        </h2>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 dark:bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-300 tracking-wide font-display">MARKET OPEN</span>
          </div>
          <div className="text-sm font-medium font-mono text-gray-500">Oct 24, 2023</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Net P&L" value="$12,450.00" subValue="+15%" subLabel="vs last month" icon={Activity} trend="up" />
        <StatCard title="Win Rate" value="68%" subValue="+2%" subLabel="vs last month" icon={TrendingUp} trend="up" />
        <StatCard title="Profit Factor" value="2.4" subValue="+0.1" subLabel="" icon={Activity} trend="up" />
        <StatCard title="Current Streak" value="5 Days" subValue="On Fire!" icon={Flame} isFire={true} />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Equity Curve */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-gray-900 dark:text-white text-lg font-bold font-display">Equity Curve ({timeframe})</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Growth</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-black/20 p-1 rounded-lg">
              {['1M', '3M', 'YTD', 'ALL'].map((tf) => (
                <button 
                  key={tf} 
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    timeframe === tf 
                      ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full h-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataSets[timeframe]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorValueLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#162b1e' : '#ffffff', 
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb', 
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#111827'
                    }}
                    itemStyle={{ color: isDark ? '#13ec5b' : '#10b981' }}
                    cursor={{ stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: isDark ? '#6b7280' : '#4b5563', fontSize: 10}} 
                    dy={10} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={isDark ? "#13ec5b" : "#10b981"} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill={isDark ? "url(#colorValue)" : "url(#colorValueLight)"}
                    className={isDark ? "drop-shadow-[0_0_8px_rgba(19,236,91,0.4)]" : ""}
                    animationDuration={1000}
                  />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Trading Days Heatmap (Mockup) */}
        <div className="glass-panel rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold font-display">Trading Days</h3>
            <button 
              onClick={() => navigate('/analytics')}
              className="text-emerald-600 dark:text-primary text-sm font-bold hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
             <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] text-gray-500 font-bold">{d}</div>)}
             </div>
             <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  // Random pattern for demo
                  const r = Math.random();
                  let bg = 'bg-gray-100 dark:bg-card-dark border-gray-200 dark:border-white/5';
                  if (i === 10) bg = 'bg-red-500/20 border-red-500/50'; // Loss
                  else if (i === 20) bg = 'bg-emerald-500 dark:bg-primary border-emerald-600 dark:border-primary shadow-sm dark:shadow-neon'; // Big Win
                  else if (r > 0.8) bg = 'bg-emerald-200 dark:bg-primary/40 border-emerald-300 dark:border-primary/50';
                  else if (r > 0.6) bg = 'bg-emerald-100 dark:bg-primary/20 border-emerald-200 dark:border-primary/30';
                  
                  return (
                    <div key={i} className={`aspect-square rounded-md border ${bg} transition-all hover:scale-105 cursor-pointer`}></div>
                  )
                })}
             </div>
             
             <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-[10px] text-gray-500 font-bold">LESS</span>
                <div className="flex gap-1">
                   <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-card-dark border border-gray-200 dark:border-white/5"></div>
                   <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-primary/20 border border-emerald-200 dark:border-primary/30"></div>
                   <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-primary/50 border border-emerald-400 dark:border-primary/60"></div>
                   <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-primary border border-emerald-600 dark:border-primary"></div>
                </div>
                <span className="text-[10px] text-gray-500 font-bold">MORE</span>
             </div>
          </div>
        </div>
      </div>

      {/* Recent Trades Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-gray-200 dark:border-white/5">
        <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-gray-900 dark:text-white text-lg font-bold font-display">Recent Trades</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticker..." 
                className="bg-gray-100 dark:bg-[#102216] border-none text-sm text-gray-900 dark:text-white pl-9 pr-4 py-2 rounded-lg focus:ring-1 focus:ring-emerald-500 dark:focus:ring-primary w-full sm:w-auto placeholder-gray-500 font-body transition-all"
              />
            </div>
            <button 
              onClick={() => setFilterWins(!filterWins)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                filterWins 
                  ? 'bg-emerald-600 dark:bg-primary text-white dark:text-black font-bold shadow-sm dark:shadow-neon' 
                  : 'bg-gray-100 dark:bg-[#102216] text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Filter size={16} />
              {filterWins ? 'Wins Only' : 'Filter'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-display">
                <th className="p-4 font-bold">Asset</th>
                <th className="p-4 font-bold">Setup</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold text-right">Entry</th>
                <th className="p-4 font-bold text-right">Exit</th>
                <th className="p-4 font-bold text-right">Return</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body">
              {displayedTrades.length > 0 ? (
                displayedTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => navigate('/journal')}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                          trade.pair.includes('BTC') ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 border-orange-200 dark:border-orange-500/30' :
                          trade.pair.includes('TSLA') ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-500/30' :
                          trade.pair.includes('ETH') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-500 border-indigo-200 dark:border-indigo-500/30' :
                          'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/30'
                        }`}>
                          {trade.pair.split('/')[0].substring(0,3)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{trade.pair}</p>
                          <p className="text-xs text-gray-500">{trade.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{trade.setup}</td>
                    <td className="p-4">
                      <span className={`font-bold px-2 py-1 rounded text-xs ${trade.type === 'LONG' ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-400/10' : 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-400/10'}`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300 font-mono">{trade.entry}</td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300 font-mono">{trade.exit}</td>
                    <td className="p-4 text-right">
                      <p className={`font-bold ${trade.status === 'WIN' ? 'text-emerald-600 dark:text-primary' : 'text-red-600 dark:text-loss'}`}>{trade.pnl}</p>
                      <p className={`text-xs ${trade.status === 'WIN' ? 'text-emerald-600/70 dark:text-primary/70' : 'text-red-600/70 dark:text-loss/70'}`}>{trade.pnlPerc}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center h-6 px-2 rounded-full text-xs font-bold border ${
                        trade.status === 'WIN' ? 'bg-emerald-100 dark:bg-primary/20 text-emerald-700 dark:text-primary border-emerald-200 dark:border-primary/30' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-500 border-red-200 dark:border-red-500/30'
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No trades found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-white/5 flex justify-center">
            <button 
              onClick={() => navigate('/journal')}
              className="text-sm font-bold text-emerald-600 dark:text-primary hover:text-emerald-700 dark:hover:text-white transition-colors flex items-center gap-1"
            >
                View Full Journal
                <ArrowRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;