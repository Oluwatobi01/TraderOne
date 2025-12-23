import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  DollarSign, 
  Upload, 
  Sparkles, 
  X,
  AlertCircle,
  Plus, 
  Filter,
  Search,
  ChevronLeft,
  ArrowRight,
  Hash,
  Loader2,
  Image as ImageIcon,
  LayoutGrid,
  List as ListIcon,
  Download,
  Calculator,
  Smile,
  Meh,
  Frown,
  Zap,
  BrainCircuit,
  Target
} from 'lucide-react';

// --- Types ---

interface Trade {
  id: number;
  pair: string;
  type: 'LONG' | 'SHORT';
  pnl: number;
  pnlPerc: number;
  status: 'WIN' | 'LOSS' | 'BE';
  date: string;
  time: string;
  setup: string;
  entryPrice: string;
  exitPrice: string;
  stopLoss: string;
  quantity: string;
  rationale: string;
  screenshot: string | null;
  confidence: number; // 1-5
  mood: 'Calm' | 'Anxious' | 'Greedy' | 'Fearful' | 'Neutral' | 'Excited';
}

const INITIAL_TRADES: Trade[] = [
  { 
    id: 1, pair: 'BTC/USD', type: 'LONG', pnl: 1200, pnlPerc: 1.75, status: 'WIN', date: '2023-10-24', time: '14:30', 
    setup: 'Silver Bullet', entryPrice: '34200.00', exitPrice: '35400.00', stopLoss: '33800.00', quantity: '1.0', 
    rationale: 'Clean retest of the 1H order block during NY AM session. Market structure shift on M15 confirmed entry. #SilverBullet',
    screenshot: null, confidence: 5, mood: 'Calm'
  },
  { 
    id: 2, pair: 'TSLA', type: 'SHORT', pnl: -250, pnlPerc: -1.01, status: 'LOSS', date: '2023-10-23', time: '10:15', 
    setup: 'Gap Fill', entryPrice: '245.50', exitPrice: '248.00', stopLoss: '243.00', quantity: '100', 
    rationale: 'Attempted to fade the morning gap but momentum was too strong. Stopped out quickly.',
    screenshot: null, confidence: 3, mood: 'Anxious'
  },
  { 
    id: 3, pair: 'ETH/USD', type: 'LONG', pnl: 450, pnlPerc: 0.85, status: 'WIN', date: '2023-10-23', time: '16:00', 
    setup: 'Breakout', entryPrice: '1780.00', exitPrice: '1805.00', stopLoss: '1765.00', quantity: '18', 
    rationale: 'Classic ascending triangle breakout on the 4H timeframe.',
    screenshot: null, confidence: 4, mood: 'Neutral'
  },
  { 
    id: 4, pair: 'NVDA', type: 'LONG', pnl: 2100, pnlPerc: 3.2, status: 'WIN', date: '2023-10-21', time: '09:45', 
    setup: 'Trend Following', entryPrice: '412.00', exitPrice: '425.00', stopLoss: '405.00', quantity: '160', 
    rationale: 'Strong earnings anticipation. Riding the moving average.',
    screenshot: null, confidence: 5, mood: 'Excited'
  } as any,
  { 
    id: 5, pair: 'XAU/USD', type: 'SHORT', pnl: -120, pnlPerc: -0.4, status: 'LOSS', date: '2023-10-20', time: '08:00', 
    setup: 'Supply Zone', entryPrice: '1985.00', exitPrice: '1988.00', stopLoss: '1990.00', quantity: '40', 
    rationale: 'Rejection from daily supply zone, but news event caused a wick out.',
    screenshot: null, confidence: 4, mood: 'Calm'
  },
];

// --- Helper Components ---

const PositionSizeModal = ({ 
  isOpen, 
  onClose, 
  entry, 
  stop 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  entry: string, 
  stop: string 
}) => {
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPerc, setRiskPerc] = useState('1');
  
  if (!isOpen) return null;

  const entryNum = parseFloat(entry) || 0;
  const stopNum = parseFloat(stop) || 0;
  const riskAmount = (parseFloat(accountSize) * parseFloat(riskPerc)) / 100;
  const stopDistance = Math.abs(entryNum - stopNum);
  const units = stopDistance > 0 ? (riskAmount / stopDistance) : 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#162b1e] border border-gray-200 dark:border-primary/20 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"><X size={18} /></button>
         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator size={20} className="text-emerald-600 dark:text-primary" /> Risk Calculator
         </h3>
         
         <div className="space-y-4">
            <div>
               <label className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Account Balance</label>
               <div className="relative mt-1">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                 <input className="w-full bg-gray-50 dark:bg-[#102216] border border-gray-200 dark:border-white/10 rounded-lg py-2 pl-8 text-gray-900 dark:text-white focus:border-emerald-600 dark:focus:border-primary outline-none" 
                   value={accountSize} onChange={e => setAccountSize(e.target.value)} type="number" />
               </div>
            </div>
            <div>
               <label className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Risk Percentage</label>
               <div className="relative mt-1">
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                 <input className="w-full bg-gray-50 dark:bg-[#102216] border border-gray-200 dark:border-white/10 rounded-lg py-2 px-3 text-gray-900 dark:text-white focus:border-emerald-600 dark:focus:border-primary outline-none" 
                   value={riskPerc} onChange={e => setRiskPerc(e.target.value)} type="number" />
               </div>
            </div>
            
            <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 space-y-2">
               <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400 text-sm">Risk Amount:</span>
                  <span className="text-red-500 dark:text-red-400 font-bold font-mono">${riskAmount.toFixed(2)}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400 text-sm">Stop Distance:</span>
                  <span className="text-gray-900 dark:text-white font-bold font-mono">{stopDistance.toFixed(2)} pts</span>
               </div>
               <div className="border-t border-gray-200 dark:border-white/10 pt-2 flex justify-between items-end">
                  <span className="text-emerald-700 dark:text-primary font-bold">Position Size:</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white font-mono">{units.toFixed(2)} <span className="text-xs text-gray-500">Units</span></span>
               </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-500 text-center">Calculated based on Entry & Stop price in form.</p>
         </div>
      </div>
    </div>
  )
}

const JournalStats = ({ trades }: { trades: Trade[] }) => {
  const stats = useMemo(() => {
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.status === 'WIN').length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
    const grossProfit = trades.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0);
    const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0));
    const pf = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 100 : 0;
    
    return { winRate, totalPnL, pf, totalTrades };
  }, [trades]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
       <div className="glass-panel p-4 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Target size={60} className="text-gray-900 dark:text-white"/></div>
          <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold tracking-wider">Win Rate</p>
          <p className={`text-2xl font-black font-display mt-1 ${stats.winRate > 50 ? 'text-emerald-600 dark:text-primary' : 'text-yellow-500'}`}>
             {stats.winRate.toFixed(1)}%
          </p>
       </div>
       <div className="glass-panel p-4 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign size={60} className="text-gray-900 dark:text-white"/></div>
          <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold tracking-wider">Total P&L</p>
          <p className={`text-2xl font-black font-display mt-1 ${stats.totalPnL >= 0 ? 'text-emerald-600 dark:text-primary' : 'text-red-500'}`}>
             {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString()}
          </p>
       </div>
       <div className="glass-panel p-4 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp size={60} className="text-gray-900 dark:text-white"/></div>
          <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold tracking-wider">Profit Factor</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white font-display mt-1">{stats.pf.toFixed(2)}</p>
       </div>
       <div className="glass-panel p-4 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Hash size={60} className="text-gray-900 dark:text-white"/></div>
          <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold tracking-wider">Trades Taken</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white font-display mt-1">{stats.totalTrades}</p>
       </div>
    </div>
  )
}

const JournalCalendar = ({ trades, onDayClick }: { trades: Trade[], onDayClick: (date: string) => void }) => {
  const daysInMonth = 31; 
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2023-10-${dayNum.toString().padStart(2, '0')}`;
    const dayTrades = trades.filter(t => t.date === dateStr);
    const dayPnL = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
    return { dayNum, dateStr, dayTrades, dayPnL };
  });

  return (
    <div className="glass-panel rounded-2xl p-6">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">Performance Calendar</h2>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-[#102216] px-3 py-1 rounded-lg">
             <Calendar size={14} /> October 2023
          </div>
       </div>
       
       <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
             <div key={d} className="bg-white dark:bg-surface-dark p-2 text-center text-xs font-bold text-gray-500 dark:text-slate-500 uppercase">{d}</div>
          ))}
          {days.map((day) => (
             <div 
               key={day.dayNum} 
               onClick={() => day.dayTrades.length > 0 && onDayClick(day.dateStr)}
               className={`bg-white dark:bg-[#102216] min-h-[80px] p-2 flex flex-col justify-between transition-colors hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group
                  ${day.dayTrades.length > 0 ? '' : 'opacity-50'}
               `}
             >
                <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">{day.dayNum}</span>
                {day.dayTrades.length > 0 && (
                  <div className={`mt-1 text-xs font-bold px-1.5 py-1 rounded text-center truncate ${
                    day.dayPnL >= 0 
                      ? 'bg-emerald-100 dark:bg-primary/20 text-emerald-700 dark:text-primary' 
                      : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-500'
                  }`}>
                     {day.dayPnL >= 0 ? '+' : ''}${Math.round(day.dayPnL)}
                  </div>
                )}
             </div>
          ))}
       </div>
    </div>
  )
}

const TradeListItem: React.FC<{ trade: Trade, onClick: () => void }> = ({ trade, onClick }) => (
  <div onClick={onClick} className="glass-panel p-5 rounded-2xl hover:border-emerald-300 dark:hover:border-primary/30 transition-all cursor-pointer hover:shadow-lg dark:hover:shadow-primary/5 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className={`size-12 rounded-xl flex items-center justify-center font-bold text-xs border ${
         trade.status === 'WIN' ? 'bg-emerald-100 dark:bg-primary/10 text-emerald-700 dark:text-primary border-emerald-200 dark:border-primary/20' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-500 border-red-200 dark:border-red-500/20'
      }`}>
         {trade.status === 'WIN' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
      </div>
      <div>
         <div className="flex items-center gap-2">
            <h4 className="text-gray-900 dark:text-white font-bold font-display">{trade.pair}</h4>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trade.type === 'LONG' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'}`}>{trade.type}</span>
         </div>
         <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
            <Calendar size={12} /> {trade.date} • <span className="text-gray-400">#{trade.setup}</span>
         </p>
      </div>
    </div>
    
    {/* Middle Stats */}
    <div className="hidden lg:flex items-center gap-6">
       <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-500 dark:text-slate-500 uppercase">Confidence</span>
          <div className="flex text-yellow-500 gap-0.5 mt-1">
             {Array.from({length: 5}).map((_, i) => (
                <Zap key={i} size={10} className={i < (trade.confidence || 0) ? 'fill-yellow-500' : 'text-gray-300 dark:text-slate-700'} />
             ))}
          </div>
       </div>
       <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-[10px] text-gray-500 dark:text-slate-500 uppercase">Mood</span>
          <span className="text-lg mt-0.5" title={trade.mood}>
            {trade.mood === 'Calm' ? <Smile size={18} className="text-blue-500 dark:text-blue-400"/> : 
             trade.mood === 'Anxious' ? <Frown size={18} className="text-orange-500 dark:text-orange-400"/> :
             trade.mood === 'Excited' ? <Zap size={18} className="text-yellow-500 dark:text-yellow-400"/> :
             <Meh size={18} className="text-gray-400 dark:text-slate-400"/>}
          </span>
       </div>
    </div>

    <div className="flex items-center justify-between md:justify-end gap-6 min-w-[150px]">
       <div className="text-right">
          <p className={`text-lg font-bold font-mono ${trade.pnl > 0 ? 'text-emerald-600 dark:text-primary' : 'text-red-600 dark:text-red-500'}`}>
             {trade.pnl > 0 ? '+' : ''}${Math.abs(trade.pnl).toLocaleString()}
          </p>
          <p className={`text-xs ${trade.pnl > 0 ? 'text-emerald-600/70 dark:text-primary/70' : 'text-red-600/70 dark:text-red-500/70'}`}>
             {trade.pnl > 0 ? '+' : ''}{trade.pnlPerc}%
          </p>
       </div>
       <ArrowRight size={18} className="text-gray-400 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
    </div>
  </div>
);

const JournalEntryForm = ({ onCancel, onSave, initialData }: { onCancel: () => void, onSave: (trade: any) => void, initialData?: Trade | null }) => {
  const [asset, setAsset] = useState(initialData?.pair || 'BTC/USD');
  const [direction, setDirection] = useState<'long' | 'short'>(initialData?.type === 'SHORT' ? 'short' : 'long');
  const [entry, setEntry] = useState(initialData?.entryPrice || '34250.00');
  const [exit, setExit] = useState(initialData?.exitPrice || '35100.00');
  const [stop, setStop] = useState(initialData?.stopLoss || '33800.00');
  const [quantity, setQuantity] = useState(initialData?.quantity || '0.5');
  const [rationale, setRationale] = useState(initialData?.rationale || '');
  const [screenshot, setScreenshot] = useState<string | null>(initialData?.screenshot || null);
  const [date, setDate] = useState(initialData?.date || '2023-10-24');
  const [time, setTime] = useState(initialData?.time || '09:30');
  const [confidence, setConfidence] = useState(initialData?.confidence || 3);
  const [mood, setMood] = useState<Trade['mood']>(initialData?.mood || 'Neutral');
  
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [rr, setRr] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [roi, setRoi] = useState(0);
  
  useEffect(() => {
    const clean = (val: string) => parseFloat(String(val).replace(/,/g, ''));
    const e = clean(entry);
    const x = clean(exit);
    const s = clean(stop);
    const q = clean(quantity);

    if (!isNaN(e) && !isNaN(x) && !isNaN(s) && !isNaN(q) && e !== 0) {
      const distReward = Math.abs(x - e);
      const distRisk = Math.abs(e - s);
      const ratio = distRisk === 0 ? 0 : distReward / distRisk;
      setRr(parseFloat(ratio.toFixed(2)));

      let valPnl = 0;
      let valRoi = 0;

      if (direction === 'long') {
        valPnl = (x - e) * q;
        valRoi = ((x - e) / e) * 100;
      } else {
        valPnl = (e - x) * q;
        valRoi = ((e - x) / e) * 100;
      }

      setPnl(valPnl);
      setRoi(valRoi);
    }
  }, [entry, exit, stop, quantity, direction]);

  const handleSave = () => {
      const tags = rationale.match(/#[\w]+/g);
      const setupTag = tags ? tags[0].replace('#', '') : (initialData?.setup || 'Manual Entry');

      const newTrade = {
          id: initialData?.id || Date.now(),
          pair: asset || 'Unknown',
          type: direction === 'long' ? 'LONG' : 'SHORT',
          pnl: parseFloat(pnl.toFixed(2)),
          pnlPerc: parseFloat(roi.toFixed(2)),
          status: pnl >= 0 ? 'WIN' : 'LOSS',
          date, time, setup: setupTag,
          entryPrice: entry, exitPrice: exit, stopLoss: stop,
          quantity, rationale, screenshot,
          confidence, mood
      };

      onSave(newTrade);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setScreenshot(reader.result as string);
        reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PositionSizeModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} entry={entry} stop={stop} />

      <div className="flex flex-col gap-6 mb-8">
        <button onClick={onCancel} className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit group">
           <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Journal
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 font-display">{initialData ? 'Trade Details' : 'Log New Trade'}</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">Capture details immediately for better recall.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-6 py-3 rounded-xl border border-gray-300 dark:border-surface-input text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">Discard</button>
            <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-emerald-600 dark:bg-primary text-white dark:text-black font-bold hover:bg-emerald-700 dark:hover:bg-green-400 transition-colors shadow-sm dark:shadow-neon">{initialData ? 'Update Log' : 'Save Log'}</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
                   <div className="p-1.5 bg-emerald-100 dark:bg-primary/10 rounded-lg"><TrendingUp size={20} className="text-emerald-600 dark:text-primary" /></div>
                   Trade Parameters
                </h2>
                <button 
                  onClick={() => setIsCalcOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-primary hover:text-emerald-800 dark:hover:text-white bg-emerald-50 dark:bg-primary/10 hover:bg-emerald-100 dark:hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100 dark:border-primary/20"
                >
                   <Calculator size={14} /> Size Calc
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Select Asset</label>
                   <input value={asset} onChange={(e) => setAsset(e.target.value)} className="w-full h-14 bg-white dark:bg-surface-input text-gray-900 dark:text-white border border-gray-300 dark:border-white/5 rounded-xl px-4 focus:border-emerald-500 dark:focus:border-primary focus:ring-1 focus:ring-emerald-500 dark:focus:ring-primary outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500 font-bold" />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Direction</label>
                   <div className="flex h-14 bg-white dark:bg-surface-input rounded-xl p-1 border border-gray-300 dark:border-white/5">
                      <button onClick={() => setDirection('long')} className={`flex-1 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${direction === 'long' ? 'bg-emerald-600 dark:bg-primary text-white dark:text-black shadow-sm' : 'text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}><TrendingUp size={18} /> Long</button>
                      <button onClick={() => setDirection('short')} className={`flex-1 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${direction === 'short' ? 'bg-red-500 dark:bg-[#ff4d4d] text-white shadow-sm' : 'text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}><TrendingDown size={18} /> Short</button>
                   </div>
                </div>
                {/* Date and Time Fields */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Entry Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-14 bg-white dark:bg-surface-input text-gray-900 dark:text-white border border-gray-300 dark:border-white/5 rounded-xl px-4 focus:border-emerald-500 dark:focus:border-primary outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Entry Time</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full h-14 bg-white dark:bg-surface-input text-gray-900 dark:text-white border border-gray-300 dark:border-white/5 rounded-xl px-4 focus:border-emerald-500 dark:focus:border-primary outline-none" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Position Size</label>
                    <input value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full h-14 bg-white dark:bg-surface-input text-gray-900 dark:text-white border border-gray-300 dark:border-white/5 rounded-xl px-4 font-mono text-lg focus:border-emerald-500 dark:focus:border-primary outline-none" placeholder="Units" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Entry Price</label>
                    <input value={entry} onChange={(e) => setEntry(e.target.value)} className="w-full h-14 bg-white dark:bg-surface-input text-gray-900 dark:text-white border border-gray-300 dark:border-white/5 rounded-xl px-4 font-mono text-lg focus:border-emerald-500 dark:focus:border-primary outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Exit Price</label>
                    <input value={exit} onChange={(e) => setExit(e.target.value)} className="w-full h-14 bg-white dark:bg-surface-input text-gray-900 dark:text-white border border-gray-300 dark:border-white/5 rounded-xl px-4 font-mono text-lg focus:border-emerald-500 dark:focus:border-primary outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Stop Loss</label>
                    <input value={stop} onChange={(e) => setStop(e.target.value)} className="w-full h-14 bg-white dark:bg-surface-input text-gray-900 dark:text-white border border-gray-300 dark:border-white/5 rounded-xl px-4 font-mono text-lg focus:border-emerald-500 dark:focus:border-primary outline-none" />
                </div>
             </div>
          </div>

          {/* Psychology Section */}
          <div className="glass-panel p-6 rounded-2xl">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 font-display">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-500/10 rounded-lg"><BrainCircuit size={20} className="text-purple-600 dark:text-purple-400" /></div>
                Trader Psychology
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                   <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Confidence Level</label>
                   <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                         <button 
                            key={level} 
                            onClick={() => setConfidence(level)}
                            className={`flex-1 h-12 rounded-xl flex items-center justify-center border transition-all ${
                               confidence === level 
                               ? 'bg-yellow-50 dark:bg-yellow-500/20 border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-500 shadow-md' 
                               : 'bg-white dark:bg-surface-input border-gray-200 dark:border-white/5 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                         >
                            <Zap size={20} className={confidence === level ? 'fill-yellow-500' : ''} />
                         </button>
                      ))}
                   </div>
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-sm font-medium text-gray-500 dark:text-slate-300">Emotional State</label>
                   <div className="flex gap-2 bg-white dark:bg-surface-input p-1 rounded-xl border border-gray-200 dark:border-white/5 h-12">
                      {['Calm', 'Anxious', 'Excited', 'Neutral'].map((m) => (
                         <button 
                            key={m} 
                            onClick={() => setMood(m as any)}
                            title={m}
                            className={`flex-1 rounded-lg flex items-center justify-center transition-all ${
                               mood === m ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                         >
                            {m === 'Calm' && <Smile size={20} />}
                            {m === 'Anxious' && <Frown size={20} />}
                            {m === 'Excited' && <Zap size={20} />}
                            {m === 'Neutral' && <Meh size={20} />}
                         </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-500 dark:text-slate-300 flex justify-between">
                    Trade Rationale
                    <span className="text-xs text-gray-400 dark:text-slate-500 font-normal">Markdown Supported</span>
                </label>
                <textarea 
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    className="w-full h-32 bg-white dark:bg-surface-input text-gray-900 dark:text-white border border-gray-300 dark:border-white/5 rounded-xl p-4 resize-none focus:border-emerald-500 dark:focus:border-primary outline-none leading-relaxed" 
                    placeholder="Why did you take this trade? e.g. #breakout #retest"
                ></textarea>
             </div>

             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-500 dark:text-slate-300 flex items-center gap-2">
                    <ImageIcon size={16} className="text-gray-400 dark:text-slate-400" />
                    Chart Screenshot
                </label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-500 dark:hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group bg-gray-50 dark:bg-surface-input/30 min-h-[160px]">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    {screenshot ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden z-10">
                             <img src={screenshot} alt="Trade Screenshot" className="w-full h-full object-contain bg-black/50" />
                             <button onClick={(e) => { e.preventDefault(); setScreenshot(null); }} className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full hover:bg-red-500/80 text-white transition-colors z-30"><X size={16}/></button>
                        </div>
                    ) : (
                        <div className="pointer-events-none flex flex-col items-center">
                            <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Upload size={24} className="text-emerald-600 dark:text-primary" /></div>
                            <p className="text-sm text-gray-600 dark:text-white font-bold mb-1">Click to upload or drag and drop</p>
                        </div>
                    )}
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={100} className="text-gray-900 dark:text-primary" /></div>
                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-1">Estimated P/L</h3>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-4xl md:text-5xl font-black tracking-tight ${pnl >= 0 ? 'text-emerald-600 dark:text-primary' : 'text-red-500 dark:text-loss'}`}>
                      {pnl >= 0 ? '+' : ''}${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex gap-4 border-t border-gray-200 dark:border-white/10 pt-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-1">ROI</p>
                        <p className={`text-xl font-bold ${roi >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500 dark:text-loss'}`}>{roi >= 0 ? '+' : ''}{roi.toFixed(2)}%</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-white/10"></div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-1">R:R Ratio</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">1:{rr}</p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20} />
                </div>
                <div>
                    <p className="text-indigo-800 dark:text-indigo-200 text-sm font-bold font-display">AI Insight</p>
                    <p className="text-indigo-600 dark:text-indigo-300/80 text-xs">Based on your mood "Excited", ensure you double check your risk parameters.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const Journal: React.FC = () => {
  const location = useLocation();
  const [trades, setTrades] = useState<Trade[]>(INITIAL_TRADES);
  const [view, setView] = useState<'list' | 'calendar' | 'entry'>(location.state?.mode === 'entry' ? 'entry' : 'list');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | 'win' | 'loss'>('all');
  
  useEffect(() => {
    if (location.state?.mode) {
      setView(location.state.mode);
      setSelectedTrade(null);
    }
  }, [location.state]);

  const handleSaveTrade = (savedTrade: Trade) => {
      const exists = trades.find(t => t.id === savedTrade.id);
      if (exists) {
          setTrades(trades.map(t => t.id === savedTrade.id ? savedTrade : t));
      } else {
          setTrades([savedTrade, ...trades]);
      }
      setView('list');
      setSelectedTrade(null);
  };

  const filteredTrades = trades.filter(trade => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = trade.pair.toLowerCase().includes(searchLower) || trade.setup.toLowerCase().includes(searchLower);
      const matchesOutcome = outcomeFilter === 'all' ? true : outcomeFilter === 'win' ? trade.status === 'WIN' : trade.status === 'LOSS';
      return matchesSearch && matchesOutcome;
  });

  const handleExport = () => {
    const headers = ['ID,Pair,Type,Status,PnL,Date,Setup,Entry,Exit,Rationale'];
    const rows = filteredTrades.map(t => 
      `${t.id},${t.pair},${t.type},${t.status},${t.pnl},${t.date},${t.setup},${t.entryPrice},${t.exitPrice},"${t.rationale.replace(/"/g, '""')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "trading_journal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (view === 'entry') {
    return (
      <div className="p-4 md:p-8 lg:px-12 max-w-7xl mx-auto w-full pb-20">
         <JournalEntryForm key={selectedTrade ? selectedTrade.id : 'new'} initialData={selectedTrade} onCancel={() => setView('list')} onSave={handleSaveTrade} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:px-12 max-w-7xl mx-auto w-full pb-20 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
             <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight font-display mb-2">Trade <span className="text-emerald-600 dark:text-primary">Journal</span></h1>
             <p className="text-gray-500 dark:text-slate-400 text-lg">Your ledger of wins, losses, and lessons.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-slate-300 px-4 py-3 rounded-xl font-bold transition-all shadow-sm">
               <Download size={20} /> Export
            </button>
            <button 
              onClick={() => { setSelectedTrade(null); setView('entry'); }}
              className="flex items-center gap-2 bg-emerald-600 dark:bg-primary hover:bg-emerald-700 dark:hover:bg-primary-dim text-white dark:text-background-dark px-6 py-3 rounded-xl font-bold transition-all shadow-sm dark:shadow-neon"
            >
               <Plus size={20} className="stroke-[3px]" /> Log New Trade
            </button>
          </div>
       </div>

       <JournalStats trades={filteredTrades} />

       {/* Toolbar */}
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
             <input 
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..." className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:border-emerald-500 dark:focus:border-primary outline-none transition-all placeholder-gray-400" 
             />
          </div>
          <div className="flex bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl p-1 gap-1">
             <button onClick={() => setView('list')} className={`p-2.5 rounded-lg transition-all ${view === 'list' ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'}`}><ListIcon size={20} /></button>
             <button onClick={() => setView('calendar')} className={`p-2.5 rounded-lg transition-all ${view === 'calendar' ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'}`}><Calendar size={20} /></button>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setOutcomeFilter(f => f === 'all' ? 'win' : f === 'win' ? 'loss' : 'all')} className={`flex items-center gap-2 border px-4 py-3 rounded-xl min-w-[120px] justify-center font-bold text-sm ${outcomeFilter !== 'all' ? 'bg-emerald-100 dark:bg-primary/20 text-emerald-700 dark:text-primary border-emerald-200 dark:border-primary/30' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 text-gray-400'}`}>
                <Filter size={16} /> {outcomeFilter === 'all' ? 'All' : outcomeFilter === 'win' ? 'Wins' : 'Losses'}
             </button>
          </div>
       </div>

       {view === 'calendar' ? (
         <JournalCalendar trades={filteredTrades} onDayClick={(date) => { setSearchTerm(date); setView('list'); }} />
       ) : (
         <div className="flex flex-col gap-3">
            {filteredTrades.length > 0 ? (
              filteredTrades.map(trade => (
                  <TradeListItem key={trade.id} trade={trade} onClick={() => { setSelectedTrade(trade); setView('entry'); }} />
              ))
            ) : (
               <div className="py-20 text-center text-gray-500 dark:text-gray-500 bg-white dark:bg-surface-dark/50 rounded-2xl border border-gray-200 dark:border-white/5 border-dashed">
                  <p>No trades found matching your filters.</p>
               </div>
            )}
         </div>
       )}
    </div>
  );
};

export default Journal;