import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight,
  Maximize2,
  Minimize2,
  Download,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// --- Mock Data Generators ---

const generateChartData = (points: number, startVal: number, volatility: number) => {
  let current = startVal;
  const startDate = new Date('2023-11-01');
  
  return Array.from({ length: points }, (_, i) => {
    const change = (Math.random() - 0.45) * volatility;
    current += change;
    
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    
    return {
      name: i % Math.ceil(points/7) === 0 ? dateStr : '', 
      value: Math.round(current),
      fullDate: dateStr
    };
  });
};

// Data sets for different timeframes
const ANALYTICS_DATA: Record<string, any> = {
  '7D': {
    kpi: { pnl: '+$2,450.00', pnlPerc: '+5.2%', winRate: '72%', profitFactor: '3.1', rr: '1:3.2' },
    chart: generateChartData(7, 12000, 500),
    outcome: { wins: 12, losses: 4, total: 16 },
    insight: "Excellent short-term momentum. Your scalping strategy is performing 20% above average this week.",
    pairs: [
      { pair: 'BTC/USD 🚀', val: '+$1,840', w: '75%', color: '#F7931A' },
      { pair: 'ETH/USD', val: '+$620', w: '25%', color: '#627EEA' },
      { pair: 'SOL/USD', val: '-$120', w: '5%', color: '#9945FF', neg: true },
    ]
  },
  '1M': {
    kpi: { pnl: '+$12,450.00', pnlPerc: '+15.2%', winRate: '68%', profitFactor: '2.5', rr: '1:2.8' },
    chart: generateChartData(30, 8000, 800),
    outcome: { wins: 42, losses: 20, total: 62 },
    insight: "Your win rate drops by 15% when trading after 2 PM EST. Consider closing positions earlier.",
    pairs: [
      { pair: 'BTC/USD 🚀', val: '+$8,240', w: '85%', color: '#F7931A' },
      { pair: 'ETH/USD', val: '+$3,120', w: '45%', color: '#627EEA' },
      { pair: 'XAU/USD 🏆', val: '-$450', w: '12%', color: '#FFD700', neg: true },
      { pair: 'EUR/USD', val: '+$1,540', w: '25%', color: '#9CA3AF' }
    ]
  },
  '3M': {
    kpi: { pnl: '+$28,900.00', pnlPerc: '+32.4%', winRate: '64%', profitFactor: '2.2', rr: '1:2.5' },
    chart: generateChartData(90, 5000, 1200),
    outcome: { wins: 115, losses: 65, total: 180 },
    insight: "Consistency is improving. You've adhered to your stop-loss rules 95% of the time this quarter.",
    pairs: [
      { pair: 'BTC/USD', val: '+$15,200', w: '80%', color: '#F7931A' },
      { pair: 'NVDA', val: '+$8,400', w: '50%', color: '#76B900' },
      { pair: 'ETH/USD', val: '+$4,100', w: '30%', color: '#627EEA' },
      { pair: 'GBP/JPY', val: '-$1,200', w: '15%', color: '#cfcfcf', neg: true }
    ]
  },
  'YTD': {
    kpi: { pnl: '+$84,200.00', pnlPerc: '+112%', winRate: '61%', profitFactor: '1.9', rr: '1:2.4' },
    chart: generateChartData(50, 2000, 2500), // Smoothed points for YTD
    outcome: { wins: 340, losses: 215, total: 555 },
    insight: "Yearly review: 'Trend Following' setups have generated 70% of your total profits.",
    pairs: [
      { pair: 'BTC/USD', val: '+$45,000', w: '90%', color: '#F7931A' },
      { pair: 'TSLA', val: '+$22,000', w: '55%', color: '#cc0000' },
      { pair: 'ETH/USD', val: '+$12,500', w: '35%', color: '#627EEA' },
      { pair: 'XAU/USD', val: '+$4,200', w: '15%', color: '#FFD700' }
    ]
  }
};

const StatBox = ({ title, value, sub, subType, tooltip }: any) => (
  <div className="glass-panel p-6 rounded-2xl flex flex-col gap-1 group hover:border-emerald-500/30 dark:hover:border-primary/30 transition-all duration-300">
    <div className="flex items-center justify-between">
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider font-display">{title}</p>
      <div className="group/info relative">
        <div className="bg-emerald-100 dark:bg-primary/10 p-1.5 rounded-lg text-emerald-600 dark:text-primary cursor-help">
          <Info size={16} />
        </div>
        {tooltip && (
          <div className="absolute right-0 top-8 w-48 bg-white dark:bg-black/90 border border-gray-200 dark:border-white/10 p-2 rounded text-xs text-gray-600 dark:text-gray-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
            {tooltip}
          </div>
        )}
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:text-emerald-600 dark:group-hover:text-primary transition-colors font-display">{value}</p>
    <div className="flex items-center gap-2 mt-1">
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${subType === 'good' ? 'bg-emerald-100 dark:bg-primary/10 text-emerald-700 dark:text-primary' : subType === 'bad' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
        {subType === 'good' && <TrendingUp size={10} />}
        {subType === 'bad' && <TrendingDown size={10} />}
        {sub}
      </span>
      <span className="text-gray-500 dark:text-gray-500 text-xs">vs last period</span>
    </div>
  </div>
);

const HeatmapCell = ({ status }: { status: 'win' | 'loss' | 'none' }) => {
  let bgClass = 'bg-gray-200 dark:bg-white/5 border border-transparent';
  if (status === 'win') bgClass = 'bg-emerald-500 dark:bg-primary shadow-sm dark:shadow-[0_0_8px_rgba(19,236,91,0.5)]';
  if (status === 'loss') bgClass = 'bg-red-400/50 dark:bg-red-500/50';

  return (
    <div className={`size-3.5 rounded-sm ${bgClass} hover:scale-125 transition-transform duration-200 cursor-pointer group relative`}>
        {status !== 'none' && (
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 dark:bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10 font-bold border border-white/10">
              {status === 'win' ? '+$450.00' : '-$120.00'}
           </div>
        )}
    </div>
  );
};

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('YTD');
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect theme change
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const data = useMemo(() => ANALYTICS_DATA[timeframe], [timeframe]);

  const heatmapData = useMemo(() => {
    return Array.from({ length: 26 }).map(() => {
       return Array.from({ length: 7 }).map(() => {
          const r = Math.random();
          if (r > 0.75) return 'win';
          if (r > 0.6) return 'loss';
          return 'none';
       });
    });
  }, [timeframe]);

  const handleDownloadChart = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Date,Equity"].join(",") + "\n" 
      + data.chart.map((row: any) => `${row.fullDate},${row.value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `equity_curve_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto min-h-screen animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-500/5 to-transparent dark:from-primary/5 pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight font-display">Performance <span className="text-emerald-600 dark:text-primary">Analytics</span></h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-lg">Deep dive into your trading edge. Track profitability, win rates, and consistency over time.</p>
          </div>
          {/* Timeframe */}
          <div className="bg-white dark:bg-card-dark p-1 rounded-xl flex items-center border border-gray-200 dark:border-white/5 shadow-lg">
             {['7D', '1M', '3M', 'YTD'].map((t) => (
                <button 
                  key={t} 
                  onClick={() => setTimeframe(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    timeframe === t 
                      ? 'bg-emerald-600 dark:bg-primary text-white dark:text-background-dark shadow-sm dark:shadow-neon scale-105' 
                      : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                    {t}
                </button>
             ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
           <StatBox title="Net P&L" value={data.kpi.pnl} sub={data.kpi.pnlPerc} subType="good" tooltip="Total realized profit/loss for the selected period." />
           <StatBox title="Win Rate" value={data.kpi.winRate} sub="+2.1%" subType="good" tooltip="Percentage of trades that closed in profit." />
           <StatBox title="Profit Factor" value={data.kpi.profitFactor} sub="Healthy" subType="neutral" tooltip="Gross Profit divided by Gross Loss." />
           <StatBox title="Avg R:R" value={data.kpi.rr} sub="+0.3" subType="good" tooltip="Average Risk to Reward ratio on taken trades." />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Main Equity Chart */}
           <div className={`glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col transition-all duration-300 z-30 ${
             isChartExpanded 
               ? 'fixed inset-4 h-auto bg-white/95 dark:bg-[#162b1e]/95 backdrop-blur-xl border-emerald-500/50 dark:border-primary/50 shadow-2xl' 
               : 'h-[400px] relative'
           }`}>
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Equity Growth Curve</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Net cumulative P&L over time</p>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setIsChartExpanded(!isChartExpanded)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" 
                      title={isChartExpanded ? "Minimize" : "Expand"}
                    >
                      {isChartExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button 
                      onClick={handleDownloadChart}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" 
                      title="Download CSV"
                    >
                      <Download size={18} />
                    </button>
                 </div>
              </div>
              
              <div className="flex-1 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="eqGradientDark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="eqGradientLight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#162b1e' : '#ffffff', 
                          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb', 
                          borderRadius: '8px', 
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          color: isDark ? '#fff' : '#111827'
                        }}
                        itemStyle={{ color: isDark ? '#fff' : '#111827', fontWeight: 'bold' }}
                        labelStyle={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '0.25rem' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#6b7280' : '#4b5563', fontSize: 10}} dy={10} interval="preserveStartEnd" />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#6b7280' : '#4b5563', fontSize: 10}} tickFormatter={(val) => `$${val/1000}k`} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={isDark ? "#13ec5b" : "#059669"} 
                        strokeWidth={3}
                        fill={isDark ? "url(#eqGradientDark)" : "url(#eqGradientLight)"} 
                        className={isDark ? "drop-shadow-[0_0_10px_rgba(19,236,91,0.5)]" : ""}
                        animationDuration={800}
                      />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Stats Column */}
           <div className="flex flex-col gap-4 h-full min-h-[400px]">
              {/* Outcome Circle */}
              <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col items-center justify-center relative">
                 <h3 className="absolute top-6 left-6 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Outcome Distribution</h3>
                 
                 <div className="relative size-40 mt-4 flex items-center justify-center group cursor-default">
                    {/* Background Circle */}
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                       <path className="text-gray-200 dark:text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                       {/* Value Circle */}
                       <path 
                          className="text-emerald-500 dark:text-primary dark:drop-shadow-[0_0_10px_rgba(19,236,91,0.4)] transition-all duration-1000 ease-out" 
                          strokeDasharray={`${parseInt(data.kpi.winRate)}, 100`} 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeLinecap="round" 
                          strokeWidth="3.5"
                        ></path>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-bold text-gray-900 dark:text-white font-display">{data.kpi.winRate}</span>
                       <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">Wins</span>
                    </div>
                 </div>

                 <div className="flex w-full justify-between px-4 mt-6">
                    <div className="flex flex-col items-center">
                       <span className="text-sm text-emerald-600 dark:text-primary font-bold">{data.outcome.wins} Trades</span>
                       <span className="text-[10px] text-gray-500 uppercase tracking-wider">Won</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-white/10"></div>
                    <div className="flex flex-col items-center">
                       <span className="text-sm text-red-500 dark:text-red-400 font-bold">{data.outcome.losses} Trades</span>
                       <span className="text-[10px] text-gray-500 uppercase tracking-wider">Lost</span>
                    </div>
                 </div>
              </div>

              {/* AI Insight */}
              <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-[#1A2C22] dark:to-background-dark p-5 rounded-2xl border border-emerald-100 dark:border-primary/20 relative overflow-hidden flex-shrink-0 group hover:border-emerald-300 dark:hover:border-primary/40 transition-colors shadow-sm">
                 <div className="absolute -right-4 -top-4 bg-emerald-100 dark:bg-primary/20 blur-2xl size-24 rounded-full group-hover:bg-emerald-200 dark:group-hover:bg-primary/30 transition-all"></div>
                 <div className="flex items-start gap-3 relative z-10">
                    <div className="bg-emerald-100 dark:bg-primary/20 p-2 rounded-lg text-emerald-600 dark:text-primary">
                       <Sparkles size={18} />
                    </div>
                    <div>
                       <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-1 font-display">AI Insight 🤖</h4>
                       <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                          {data.insight}
                       </p>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* Heatmap & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
            <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Consistency Heatmap</h3>
                    <div className="flex gap-3 text-xs">
                        <div className="flex items-center gap-1.5"><div className="size-3 rounded bg-gray-200 dark:bg-white/5 border border-transparent dark:border-white/5"></div><span className="text-gray-500 font-medium">No Trade</span></div>
                        <div className="flex items-center gap-1.5"><div className="size-3 rounded bg-red-400/50 dark:bg-red-900/50 border border-transparent dark:border-red-500/20"></div><span className="text-gray-500 font-medium">Loss</span></div>
                        <div className="flex items-center gap-1.5"><div className="size-3 rounded bg-emerald-500 dark:bg-primary border border-emerald-600 dark:border-primary/50 shadow-sm dark:shadow-neon"></div><span className="text-gray-500 font-medium">Win</span></div>
                    </div>
                </div>
                
                {/* Visual Heatmap Grid */}
                <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                  <div className="flex gap-1 min-w-max">
                      {/* Day Labels */}
                      <div className="flex flex-col justify-between text-[10px] text-gray-400 dark:text-gray-500 font-mono pr-2 py-0.5 h-[110px]">
                          <span>Mon</span>
                          <span>Wed</span>
                          <span>Fri</span>
                      </div>
                      
                      {/* Grid Columns (Weeks) */}
                      {heatmapData.map((week, wIdx) => (
                          <div key={wIdx} className="flex flex-col gap-1">
                              {week.map((status: any, dIdx: number) => (
                                  <HeatmapCell key={`${wIdx}-${dIdx}`} status={status} />
                              ))}
                          </div>
                      ))}
                  </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
                <div className="flex justify-between items-center">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Performance by Pair</h3>
                   <span className="text-xs text-gray-500">Net Profit</span>
                </div>
                
                <div className="flex flex-col gap-5">
                    {data.pairs.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-2 group cursor-pointer">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full shadow-[0_0_8px_currentColor]" style={{backgroundColor: item.color, color: item.color}}></div>
                                    <span className="font-bold text-gray-700 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-primary transition-colors">{item.pair}</span>
                                </div>
                                <span className={`${item.neg ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-primary'} font-mono font-bold`}>{item.val}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full relative transition-all duration-1000 ease-out`} 
                                    style={{ 
                                        width: item.w, 
                                        backgroundColor: item.neg ? '#ef4444' : item.color,
                                        boxShadow: `0 0 10px ${item.neg ? 'rgba(239, 68, 68, 0.4)' : item.color + '66'}`
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                  onClick={() => navigate('/journal')}
                  className="mt-auto w-full py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group"
                >
                    View All Instruments <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;